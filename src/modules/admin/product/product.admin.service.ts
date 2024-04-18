import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'models/product';
import { generateResponse, includeSearchConditions, mapPagination, pluck } from 'utils/helpers';
import { AppResponse } from 'common/types/response.type';
import { ProductImage } from 'models/product-image';
import { FileService } from 'shared/file/file.service';
import { UPLOAD_FOLDER_PATH } from 'constants/config';
import { PaginationResponseInterface } from 'common/interfaces/pagination.interface';
import { Op, WhereOptions } from 'sequelize';
import { ManageProductDto, ProductPropertyObject } from 'modules/admin/product/dto/manage-product.dto';
import { ProductSubProduct } from 'models/product-sub-product';
import { Property } from 'models/property';
import { PropertyOption } from 'models/property-option';
import { ProductProperty } from 'models/product-property';
import { ProductsGridDto } from 'modules/admin/product/dto/products-grid.dto';
import { Category } from 'models/category';
import { ProductEditPageInterface } from 'modules/admin/product/interfaces/product-edit-page.interface';
import { ProductCreateDataInterface } from 'modules/admin/product/interfaces/product-create-data.interface';

@Injectable()
export class ProductAdminService {
  constructor(private readonly fileService: FileService) {}
  async create(manageProductDto: ManageProductDto): AppResponse<Product> {
    return generateResponse(await this.manageProduct(manageProductDto), 'Product successfully created', 201);
  }

  async update(id: number, manageProductDto: ManageProductDto): AppResponse<Product> {
    return generateResponse(await this.manageProduct(manageProductDto, id), 'Product successfully updated', 200);
  }

  async delete(id: number): AppResponse<number> {
    const product = await Product.findByPk(id, {
      include: {
        model: ProductImage,
        required: false,
        attributes: ['src'],
      },
    });

    if (!product) {
      throw new NotFoundException('No product with this id');
    }

    if (product.images.length) {
      await Promise.all(
        product.images.map((image: ProductImage) => this.fileService.deleteFile(`${UPLOAD_FOLDER_PATH}/${image.src}`)),
      );
    }

    await product.destroy();

    return generateResponse(id, 'Product successfully deleted', 202);
  }

  async getAll(productsGridDto: ProductsGridDto): AppResponse<PaginationResponseInterface> {
    const { search, parentCategoryId, ...paginationDto } = productsGridDto;
    const { offset, limit } = mapPagination(paginationDto);

    let where: WhereOptions<Product> = {};

    if (parentCategoryId) {
      where.categoryId = parentCategoryId;
    }

    if (search) {
      where = includeSearchConditions<Product>(['titleEn', 'titleAm'], search, where);
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      attributes: ['id', 'categoryId', 'titleEn', 'titleAm', 'qty', 'price', 'isHidden', 'isBestseller'],
      include: {
        model: ProductImage,
        as: 'images',
        attributes: ['src'],
        limit: 1,
        order: [['id', 'ASC']],
      },
    });

    const productData = rows.map((product: Product) => {
      const { isHidden, ...productData } = product.dataValues;

      delete productData.images;

      return {
        ...productData,
        status: isHidden ? 'Hidden' : 'Visible',
        preview: product.images[0]?.src || '',
      };
    });

    return generateResponse<PaginationResponseInterface>({ rows: productData, count });
  }

  async getEditPageData(id: number): AppResponse<ProductEditPageInterface> {
    const product = await Product.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Category,
          required: true,
          attributes: ['id', 'titleEn', 'titleAm'],
        },
        {
          model: Product,
          through: { attributes: [] },
          required: false,
          as: 'subProducts',
        },
        {
          model: ProductImage,
          required: false,
          attributes: ['src'],
        },
        {
          model: ProductProperty,
          required: false,
          attributes: ['id', 'propertyId', 'valEn', 'valAm'],
        },
      ],
    });

    if (!product) {
      throw new BadRequestException('No product with this id');
    }

    const [properties, categories, products] = await Promise.all([
      Property.findAll({
        include: {
          model: PropertyOption,
          required: false,
          attributes: ['id', 'propertyId', 'valueEn', 'valueAm'],
        },
      }),
      Category.findAll({
        attributes: ['id', 'titleEn', 'titleAm'],
        where: {
          isHidden: false,
        },
      }),
      Product.findAll({
        where: {
          isHidden: false,
          id: {
            [Op.not]: id,
          },
        },
        attributes: ['id', 'titleEn', 'titleAm'],
      }),
    ]);

    const responseData: ProductEditPageInterface = {
      product,
      products,
      properties,
      categories,
    };

    return generateResponse(responseData);
  }

  async getCreatePageData(): AppResponse<ProductCreateDataInterface> {
    const [properties, categories, products] = await Promise.all([
      Property.findAll({
        include: {
          model: PropertyOption,
          required: false,
          attributes: ['id', 'valueEn', 'valueAm'],
        },
      }),
      Category.findAll({
        attributes: ['id', 'titleEn', 'titleAm'],
        where: {
          isHidden: false,
        },
      }),
      Product.findAll({
        where: {
          isHidden: false,
        },
        attributes: ['id', 'titleEn', 'titleAm'],
      }),
    ]);

    return generateResponse<ProductCreateDataInterface>({ properties, categories, products });
  }

  private async manageProduct(manageProductDto: ManageProductDto, id?: number): Promise<Product> {
    const { images = [], subProductIds = [], productProperties = [], ...productData } = manageProductDto;
    let product: Product;
    let imagesToDelete: string[] = [];

    const category = await Category.findByPk(productData.categoryId);

    if (!category) {
      throw new BadRequestException('No category with this id');
    }

    if (id) {
      product = await Product.findByPk(id, {
        include: [
          {
            model: Product,
            through: { attributes: [] },
            required: false,
            attributes: ['id', 'titleEn', 'titleAm'],
            as: 'subProducts',
          },
          {
            model: ProductImage,
            required: false,
            attributes: ['id', 'src'],
          },
          {
            model: ProductProperty,
            required: false,
            attributes: ['id', 'valEn', 'valAm'],
          },
        ],
      });

      if (!product) {
        throw new BadRequestException('No product with this id');
      }

      if (product.subProducts.length) {
        await ProductSubProduct.destroy({
          where: {
            productId: product.id,
            subProductId: pluck(product.subProducts, 'id'),
          },
        });
      }

      if (product.productProperties.length) {
        await ProductProperty.destroy({
          where: {
            id: pluck(product.productProperties, 'id'),
          },
        });
      }

      if (images.length) {
        const productImagesSources = pluck(product.images, 'src');
        const imagesToCreate = images.filter((image: string) => !productImagesSources.includes(image));
        imagesToDelete = productImagesSources.filter((image: string) => !images.includes(image));

        if (imagesToCreate) {
          await ProductImage.bulkCreate(
            imagesToCreate.map((image: string) => ({
              productId: product.id,
              src: image,
            })),
          );
        }
      } else if (product.images.length) {
        imagesToDelete = pluck(product.images, 'src');
      }

      if (imagesToDelete.length) {
        await Promise.all([
          ProductImage.destroy({
            where: {
              productId: product.id,
              src: imagesToDelete,
            },
          }),
          ...imagesToDelete.map((image: string) => this.fileService.deleteFile(`${UPLOAD_FOLDER_PATH}/${image}`)),
        ]);
      }

      await product.update(productData);
    } else {
      product = await Product.create(productData);

      if (images.length) {
        await ProductImage.bulkCreate(
          images.map((image: string) => ({
            productId: product.id,
            src: image,
          })),
        );
      }
    }

    if (subProductIds.length) {
      await ProductSubProduct.bulkCreate(
        subProductIds.map((subProductId: number) => ({
          productId: product.id,
          subProductId: subProductId,
        })),
      );
    }

    if (productProperties.length) {
      const properties = await Property.findAll({
        where: {
          id: pluck(productProperties, 'propertyId'),
        },
        include: {
          model: PropertyOption,
          required: false,
        },
      });

      const preparedProductProperties = productProperties.map(
        (productProperty: ProductPropertyObject, index: number) => ({
          productId: product.id,
          propertyId: productProperty.propertyId,
          valEn: productProperty.valEn,
          valAm:
            productProperty?.valAm ||
            properties[index]?.propertyOptions?.find(
              (propertyOption: PropertyOption) => propertyOption.valueEn == productProperty.valEn,
            )?.valueAm ||
            null,
        }),
      );

      await ProductProperty.bulkCreate(preparedProductProperties);
    }

    return product.reload();
  }
}
