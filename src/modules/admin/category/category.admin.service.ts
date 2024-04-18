import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';

import { Category } from 'models/category';
import { CategoryProperty } from 'models/category-property';
import { ManageCategoryDto } from 'modules/admin/category/dto/manage-category.dto';
import { AppResponse } from 'common/types/response.type';
import { falsyToNull, generateResponse } from 'utils/helpers';
import { UPLOAD_FOLDER_PATH } from 'constants/config';
import { FileService } from 'shared/file/file.service';
import { Property } from 'models/property';
import { Op } from 'sequelize';
import { CategoryEditPageInterface } from 'modules/admin/category/interfaces/category-edit-page.interface';
import { CategoryCreateDataInterface } from 'modules/admin/category/interfaces/category-create-data.interface';
import { CategoryHelper } from 'common/helpers/category.helper';

@Injectable()
export class CategoryAdminService {
  constructor(private readonly fileService: FileService, private readonly categoryHelper: CategoryHelper) {}

  async create(manageCategoryDto: ManageCategoryDto): AppResponse<Category> {
    return generateResponse(await this.manageCategory(manageCategoryDto), 'Category successfully created', 201);
  }

  async update(id: number, manageCategoryDto: ManageCategoryDto): AppResponse<Category> {
    return generateResponse(await this.manageCategory(manageCategoryDto, id), 'Category successfully updated', 200);
  }

  async delete(id: number): AppResponse<number> {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new NotFoundException('No category with this id');
    }

    await this.fileService.deleteFile(`${UPLOAD_FOLDER_PATH}/${category.img}`);
    await category.destroy();

    return generateResponse(id, 'Category successfully deleted', 202);
  }

  async getCategories(): AppResponse<Category[]> {
    const categories = await Category.findAll({
      where: {
        parentId: null,
      },
      attributes: ['id', 'titleEn', 'titleAm'],
      include: this.categoryHelper.buildCategoryTree(),
    });

    return generateResponse(categories);
  }

  async getCreatePageData(): AppResponse<CategoryCreateDataInterface> {
    const categories = await Category.findAll({ attributes: ['id', 'titleEn', 'titleAm'] });
    const properties = await Property.findAll({ attributes: ['id', 'nameEn', 'nameAm'] });

    return generateResponse({ categories, properties });
  }

  async getEditPageData(id: number): AppResponse<CategoryEditPageInterface> {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Property,
          required: false,
          through: { attributes: [] },
          attributes: ['id', 'nameEn', 'nameAm'],
        },
        {
          model: Category,
          required: false,
          as: 'parentCategory',
          attributes: ['id', 'titleEn', 'titleAm'],
        },
      ],
    });

    const categories = await Category.findAll({
      where: {
        id: {
          [Op.not]: id,
        },
      },
      attributes: ['id', 'titleEn', 'titleAm'],
    });

    const properties = await Property.findAll({ attributes: ['id', 'nameEn', 'nameAm'] });

    return generateResponse({ category, categories, properties });
  }

  private async manageCategory(manageCategoryDto: ManageCategoryDto, id: number = null): Promise<Category> {
    let categoryId: number = id;
    let category: Category;
    const { propertiesIds, ...categoryData } = manageCategoryDto;

    categoryData.img = falsyToNull(categoryData.img);

    const categoryOmitted: Omit<ManageCategoryDto, 'propertiesIds'> = categoryData;

    if (categoryId) {
      category = await Category.findByPk(id);

      if (!category) {
        throw new BadRequestException('No category with this id');
      }

      const properties = await category.$count('properties');

      if (properties && propertiesIds?.length) {
        await CategoryProperty.destroy({ where: { categoryId: id } });
      }

      if (category.img && category.img !== categoryOmitted.img) {
        await this.fileService.deleteFile(join(`${UPLOAD_FOLDER_PATH}/${category.img}`));
      }

      if (!categoryOmitted?.parentId) {
        categoryOmitted.parentId = null;
      }

      await category.update(categoryOmitted);
    } else {
      category = await Category.create(categoryOmitted);
      categoryId = category.id;
    }

    if (propertiesIds?.length) {
      await CategoryProperty.bulkCreate(
        propertiesIds.map((propertyId: number) => ({
          categoryId,
          propertyId,
        })),
      );
    }

    return category;
  }
}
