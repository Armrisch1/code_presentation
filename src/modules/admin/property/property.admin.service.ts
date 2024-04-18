import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Property } from 'models/property';
import {
  ListObject,
  ListObjectWithId,
  ManagePropertyDto,
  UpdatePropertyDto,
} from 'modules/admin/property/dto/manage-property.dto';
import { PropertyOption } from 'models/property-option';
import { PropertyTypeEnum } from 'enums/property-enums';
import { AppResponse } from 'common/types/response.type';
import { generateResponse, includeSearchConditions, mapPagination, pluck } from 'utils/helpers';
import { Category } from 'models/category';
import { SearchWithPaginationDto } from 'common/dto/search-with-pagination.dto';
import { WhereOptions } from 'sequelize';
import { PaginationResponseInterface } from 'common/interfaces/pagination.interface';

@Injectable()
export class PropertyAdminService {
  async createProperty(managePropertyDto: ManagePropertyDto): AppResponse<Property> {
    const { list, ...propertyData } = managePropertyDto;
    const property = await Property.create(propertyData);

    if (property.type === PropertyTypeEnum.list) {
      const propertyOptions = list.map((listObject: ListObject) => ({
        propertyId: property.id,
        ...listObject,
      }));

      await PropertyOption.bulkCreate(propertyOptions);
    }

    return generateResponse(property, 'Property successfully created', 201);
  }

  async updateProperty(id: number, updatePropertyDto: UpdatePropertyDto): AppResponse<Property> {
    const { list, ...propertyData } = updatePropertyDto;
    const property = await Property.findByPk(id, {
      include: {
        model: PropertyOption,
        attributes: ['id', 'valueEn', 'valueAm'],
      },
    });

    if (!property) {
      throw new BadRequestException('No property with this id');
    }

    if (property.type !== propertyData.type) {
      throw new ConflictException('Property type change not allowed');
    }

    await property.update(propertyData);

    if (property.type === PropertyTypeEnum.list) {
      const propertyOptionIds: number[] = pluck(list, 'id');
      const propertyOptions = await property.$get('propertyOptions');

      const propertyOptionsToDelete = propertyOptions.filter(
        (propertyOption: PropertyOption) => !propertyOptionIds.includes(propertyOption.id),
      );

      const propertyOptionsToUpdate = list.filter((propertyOption: PropertyOption) =>
        pluck(propertyOptions, 'id').includes(propertyOption.id),
      );

      const propertyOptionsToCreate = list.filter((listObjectWithId: ListObjectWithId) => !listObjectWithId?.id);

      if (propertyOptionsToDelete.length) {
        await PropertyOption.destroy({
          where: {
            id: pluck(propertyOptionsToDelete, 'id'),
          },
        });
      }

      if (propertyOptionsToCreate.length) {
        await PropertyOption.bulkCreate(
          propertyOptionsToCreate.map((listObject: ListObject) => ({
            propertyId: id,
            ...listObject,
          })),
        );
      }

      if (propertyOptionsToUpdate.length) {
        const options = propertyOptionsToUpdate.map((listObjectWithId: ListObjectWithId) =>
          PropertyOption.update(
            {
              valueEn: listObjectWithId.valueEn,
              valueAm: listObjectWithId.valueAm,
            },
            {
              where: {
                id: listObjectWithId.id,
              },
            },
          ),
        );

        await Promise.all(options);
      }
    }

    const freshData = await property.reload();

    return generateResponse(freshData, 'Property successfully updated', 200);
  }

  async deleteProperty(id: number): AppResponse<number> {
    const property = await Property.findByPk(id);

    if (!property) {
      throw new BadRequestException('No property with this id');
    }

    await property.destroy();

    return generateResponse(id, 'Property successfully deleted', 202);
  }

  async getAll(searchWithPaginationDto: SearchWithPaginationDto): AppResponse<PaginationResponseInterface> {
    const { search, ...paginationDto } = searchWithPaginationDto;
    const { limit, offset } = mapPagination(paginationDto);
    let where: WhereOptions = {};

    if (search) {
      where = includeSearchConditions(['nameEn', 'nameAm'], search);
    }

    const [rows, count] = await Promise.all([
      Property.findAll({
        include: { model: PropertyOption, required: false, attributes: ['id', 'valueEn', 'valueAm'] },
        where,
        limit,
        offset,
      }),
      Property.count({ where }),
    ]);

    return generateResponse({ rows, count }, 'success', 200);
  }

  async getPropertyEditPageData(id: number): AppResponse<Property> {
    const property = await Property.findByPk(id, {
      include: { model: PropertyOption, required: false, attributes: ['id', 'valueEn', 'valueAm'] },
    });

    return generateResponse(property, 'success', 200);
  }

  async getByCategoryId(categoryId: number): AppResponse<Property[]> {
    const category = await Category.findOne({
      where: { id: categoryId },
      attributes: ['id'],
      include: {
        model: Property,
        required: false,
        through: { attributes: [] },
        attributes: ['id', 'nameEn', 'nameAm', 'type'],
        include: [
          {
            model: PropertyOption,
            required: false,
            attributes: ['id', 'valueEn', 'valueAm'],
          },
        ],
      },
    });

    if (!category) {
      throw new BadRequestException('No category with this id');
    }

    return generateResponse(category.properties);
  }
}
