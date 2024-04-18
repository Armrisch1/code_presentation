import { Injectable, NotFoundException } from '@nestjs/common';
import sequelize, { Op, WhereOptions } from 'sequelize';

import { filterDuplicates, generateResponse, includeSearchConditions, mapPagination } from 'utils/helpers';
import { BESTSELLERS_DEFAULT_LIMIT } from 'constants/config';
import { Product } from 'models/product';
import { AppResponse } from 'common/types/response.type';
import { PaginationResponseInterface } from 'common/interfaces/pagination.interface';
import { PaginationDto } from 'common/dto/pagination.dto';
import { GetProductGroupDto } from 'modules/product/dto/get-product-group.dto';
import { ProductProperty } from 'models/product-property';
import { Property } from 'models/property';
import { ProductImage } from 'models/product-image';
import { ProductViewInterface } from 'modules/product/interfaces/product-view.interface';
import { CategoryHelper } from 'common/helpers/category.helper';
import { Category } from 'models/category';
import { PropertyOption } from 'models/property-option';
import { ResponseInterface } from 'common/interfaces/response.interface';
import { ListPageDataInterface } from 'modules/product/interfaces/list-page-data.interface';
import { FilterPageDto, PropertyFilter } from 'modules/product/dto/filter-page.dto';
import { PropertyTypeEnum } from 'enums/property-enums';
import { Includeable } from 'sequelize/types/model';

@Injectable()
export class ProductService {
  constructor(private readonly categoryHelper: CategoryHelper) {}

  async search(search, dto: PaginationDto): AppResponse<PaginationResponseInterface> {
    const { offset, limit } = mapPagination(dto);
    let where: WhereOptions<Product> = {
      isHidden: false,
    };

    where = includeSearchConditions(['titleEn', 'titleAm'], search, where);

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: {
        model: ProductImage,
        as: 'images',
        attributes: ['src'],
        limit: 1,
        order: [['id', 'ASC']],
      },
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    const products = rows.map((product: Product) => {
      const productData = product.dataValues;
      delete productData.images;

      return {
        ...productData,
        image: product.images[0]?.src || '',
      };
    });

    return generateResponse({ rows: products, count });
  }

  async getProductViewPageData(id: number): AppResponse<ProductViewInterface> {
    const product = await Product.findOne({
      where: {
        id,
        isHidden: false,
      },
      include: [
        { model: ProductImage, attributes: ['src'], required: false, as: 'images' },
        {
          model: Product,
          as: 'subProducts',
          required: false,
          through: { attributes: [] },
          attributes: [
            'id',
            'price',
            'titleEn',
            'titleAm',
            [
              sequelize.literal(
                '(SELECT src FROM product_images WHERE product_id = subProducts.id ORDER BY id ASC LIMIT 1)',
              ),
              'image',
            ],
          ],
        },
        {
          model: ProductProperty,
          required: false,
          attributes: [
            'id',
            'valEn',
            'valAm',
            [sequelize.literal('`productProperties->property`.`name_en`'), 'propertyNameEn'],
            [sequelize.literal('`productProperties->property`.`name_am`'), 'propertyNameAm'],
          ],
          include: [
            {
              model: Property,
              required: true,
              attributes: [],
            },
          ],
        },
      ],
    });
    const bestsellers = await this.getBestsellers(5, false);

    if (!product) {
      throw new NotFoundException('No product');
    }

    const { images, productProperties, subProducts, ...productData } = product;

    const responseData = {
      product: {
        ...productData.dataValues,
        images: images.map((image: ProductImage) => image.src),
        subProducts,
        productProperties,
      } as unknown as Product,
      bestsellers,
      breadcrumbs: await this.categoryHelper.formBreadCrumbsArray(product.categoryId),
    };

    return generateResponse<ProductViewInterface>(responseData, 'success', 200);
  }

  async getProducts(paginationDto: PaginationDto): AppResponse<PaginationResponseInterface<Product>> {
    const { limit, offset } = mapPagination(paginationDto);

    const { rows, count } = await Product.findAndCountAll({
      where: { isHidden: false },
      limit,
      offset,
    });

    return generateResponse({ rows, count });
  }

  async getProductByIdGroup(dto: GetProductGroupDto): AppResponse<PaginationResponseInterface<Product>> {
    const { limit, offset } = mapPagination({
      limit: dto.limit,
      page: dto.page,
    });

    const { rows, count } = await Product.findAndCountAll({
      where: {
        id: dto.productsIds,
        isHidden: false,
      },
      attributes: [
        'id',
        'titleEn',
        'titleAm',
        'price',
        'qty',
        [
          sequelize.literal('(SELECT src FROM product_images WHERE product_id = product.id ORDER BY id ASC LIMIT 1)'),
          'image',
        ],
      ],
      limit,
      offset,
    });

    return generateResponse({ rows, count });
  }

  async getListPageData(categoryId: number, paginationDto: PaginationDto): AppResponse<ListPageDataInterface> {
    const { limit, offset } = mapPagination(paginationDto);
    const subIds = await this.categoryHelper.getSubsIds(categoryId);

    const categories = await Category.findAll({
      where: {
        id: [categoryId, ...subIds],
        isHidden: false,
      },
      attributes: [],
      include: [
        {
          model: Property,
          required: false,
          through: { attributes: [] },
          attributes: ['id', 'nameEn', 'nameAm', 'type'],
          include: [
            {
              model: PropertyOption,
              attributes: ['valueEn', 'valueAm'],
            },
          ],
        },
      ],
    });

    if (!categories.length) {
      throw new NotFoundException('No category with provided id');
    }

    const properties = [];
    const notListTypePropertiesIds = [];

    categories.forEach((category: Category) => {
      properties.push(...category.properties.filter((property: Property) => property.type === PropertyTypeEnum.list));
      notListTypePropertiesIds.push(
        ...category.properties
          .filter((property: Property) => property.type !== PropertyTypeEnum.list)
          .map((property: Property) => property.id),
      );
    });

    const filteredProperties = filterDuplicates<Property>(properties, 'id');

    if (notListTypePropertiesIds.length) {
      const propertyWithOptions = await ProductProperty.findAll({
        where: {
          propertyId: notListTypePropertiesIds,
        },
        attributes: ['propertyId', 'valEn', 'valAm'],
        include: {
          model: Property,
          required: true,
          attributes: ['id', 'nameEn', 'nameAm', 'type'],
        },
      });

      const dividedProperties = {};

      propertyWithOptions.forEach((productProperty: ProductProperty) => {
        if (!dividedProperties[productProperty.propertyId]) {
          dividedProperties[productProperty.propertyId] = {};
        }

        if (Array.isArray(dividedProperties[productProperty.propertyId]?.propertyOptions)) {
          dividedProperties[productProperty.propertyId].propertyOptions.push({
            valueEn: productProperty.valEn,
            valueAm: productProperty.valAm,
          });
        } else {
          dividedProperties[productProperty.propertyId].propertyOptions = [
            { valueEn: productProperty.valEn, valueAm: productProperty.valAm },
          ];
        }

        dividedProperties[productProperty.propertyId].property = productProperty.property;
      });

      for (const key in dividedProperties) {
        const uniqueValEnSet = new Set();
        const uniquePropertyOptions = [];

        dividedProperties[key].propertyOptions.forEach((option) => {
          if (!uniqueValEnSet.has(option.valueEn)) {
            uniqueValEnSet.add(option.valueEn);
            uniquePropertyOptions.push(option);
          }
        });

        if (uniquePropertyOptions.length) {
          filteredProperties.push({
            ...dividedProperties[key].property.dataValues,
            propertyOptions: uniquePropertyOptions,
          });
        }
      }
    }

    const breadcrumbs = await this.categoryHelper.formBreadCrumbsArray(categoryId);
    const products = await Product.findAndCountAll({
      where: {
        categoryId: [categoryId, ...subIds],
        isHidden: false,
      },
      include: {
        model: ProductImage,
        as: 'images',
        attributes: ['src'],
        limit: 1,
        order: [['id', 'ASC']],
      },
      limit,
      offset,
    });

    const productData = products.rows.map((product: Product) => {
      const productData = product.dataValues;
      delete productData.images;

      return {
        ...productData,
        image: product.images[0]?.src || '',
      };
    });

    const subCategories = await Category.findAll({
      where: {
        id: subIds,
        isHidden: false,
      },
      attributes: ['id', 'titleEn', 'titleAm'],
    });

    return generateResponse({
      breadcrumbs,
      subCategories,
      properties: filteredProperties,
      products: { rows: productData as unknown as Product[], count: products.count },
    });
  }

  async filterListPage(filterPageDto: FilterPageDto): AppResponse<PaginationResponseInterface<Product>> {
    const where: WhereOptions<Product> = {};
    const { limit, offset } = mapPagination({ limit: filterPageDto.limit, page: filterPageDto.page });
    const subIds = await this.categoryHelper.getSubsIds(filterPageDto.categoryId);
    const include: Includeable[] = [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['src'],
        limit: 1,
        order: [['id', 'ASC']],
      },
    ];

    if (filterPageDto?.priceRange) {
      if (filterPageDto?.priceRange.from && filterPageDto?.priceRange.to) {
        where.price = { [Op.between]: [filterPageDto?.priceRange.from, filterPageDto.priceRange.to] };
      } else if (filterPageDto?.priceRange.from) {
        where.price = { [Op.gte]: filterPageDto?.priceRange.from };
      } else {
        where.price = { [Op.lte]: filterPageDto?.priceRange.to };
      }
    }

    if (filterPageDto?.age?.length) {
      where.age = filterPageDto.age;
    }

    if (!filterPageDto?.subCategories?.length) {
      where.categoryId = [filterPageDto.categoryId, ...subIds];
    } else {
      where.categoryId = filterPageDto.subCategories;
    }

    if (filterPageDto?.propertyFilters?.length) {
      const where: WhereOptions<ProductProperty> = {};

      filterPageDto?.propertyFilters.forEach((propertyFilter: PropertyFilter) => {
        if (!where[Op.or]) {
          where[Op.or] = [];
        }

        where[Op.or].push({
          [Op.and]: {
            propertyId: propertyFilter.propertyId,
            [Op.or]: {
              valEn: propertyFilter.values,
              valAm: propertyFilter.values,
            },
          },
        });
      });

      include.push({
        model: ProductProperty,
        required: true,
        where,
        attributes: [],
      });
    }

    const products = await Product.findAndCountAll({ where, include, limit, offset, distinct: true });

    const productData = products.rows.map((product: Product) => {
      const productData = product.dataValues;
      delete productData.images;

      return {
        ...productData,
        image: product.images[0]?.src || '',
      };
    });

    return generateResponse<PaginationResponseInterface<Product>>({
      rows: productData as unknown as Product[],
      count: products.count,
    });
  }

  // Overloading
  async getBestsellers(limit: number, isResponse: true): Promise<ResponseInterface<Product[]>>;
  async getBestsellers(limit: number, isResponse: false): Promise<Product[]>;
  async getBestsellers(
    limit: number = BESTSELLERS_DEFAULT_LIMIT,
    isResponse: boolean,
  ): Promise<ResponseInterface<Product[]> | Product[]> {
    const bestsellers = await Product.findAll({
      where: {
        isBestseller: true,
        isHidden: false,
      },
      attributes: [
        'id',
        'titleEn',
        'titleAm',
        'shortDescriptionEn',
        'shortDescriptionAm',
        'price',
        'qty',
        [
          sequelize.literal('(SELECT src FROM product_images WHERE product_id = product.id ORDER BY id ASC LIMIT 1)'),
          'image',
        ],
      ],
      limit,
      order: [['id', 'DESC']],
    });

    if (isResponse) {
      return generateResponse(bestsellers);
    } else {
      return bestsellers;
    }
  }
}
