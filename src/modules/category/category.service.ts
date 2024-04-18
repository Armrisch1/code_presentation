import { Injectable } from '@nestjs/common';
import { TOP_CATEGORIES_DEFAULT_LIMIT } from 'constants/config';
import { generateResponse } from 'utils/helpers';
import { AppResponse } from 'common/types/response.type';
import { Category } from 'models/category';
import { CategoryHelper } from 'common/helpers/category.helper';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryHelper: CategoryHelper) {}

  async getTopCategories(limit: number = TOP_CATEGORIES_DEFAULT_LIMIT): AppResponse<Category[]> {
    const categories = await Category.findAll({
      where: {
        isTop: true,
        isHidden: false,
      },
      attributes: ['id', 'titleEn', 'titleAm', 'img'],
      limit,
      order: [['id', 'DESC']],
    });

    return generateResponse(categories);
  }

  async getCategoryTree(): AppResponse<Category[]> {
    const categories = await Category.findAll({
      where: {
        parentId: null,
      },
      attributes: ['id', 'titleEn', 'titleAm'],
      include: this.categoryHelper.buildCategoryTree(),
    });

    return generateResponse(categories);
  }
}
