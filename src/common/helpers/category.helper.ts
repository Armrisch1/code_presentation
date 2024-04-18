import { Injectable } from '@nestjs/common';
import { Category } from 'models/category';
import { CATEGORY_TREE_MAX_DEPTH } from 'constants/config';
import { Includeable } from 'sequelize/types/model';
import { Breadcrumb } from 'common/types/breadcrumb.type';

@Injectable()
export class CategoryHelper {
  async formBreadCrumbsArray(categoryId: number): Promise<Breadcrumb[]> {
    let tempCategory = await Category.findByPk(categoryId, {
      attributes: ['id', 'titleEn', 'titleAm'],
      include: this.buildParentCategoryTree(),
    });
    const breadcrumbs: Breadcrumb[] = [];

    while (tempCategory) {
      breadcrumbs.unshift({
        id: tempCategory.id,
        titleEn: tempCategory.titleEn,
        titleAm: tempCategory.titleAm,
      });

      tempCategory = tempCategory.parentCategory;
    }

    return breadcrumbs;
  }

  async getSubsIds(parentCategoryId: number): Promise<number[]> {
    const category = await Category.findOne({
      where: {
        id: parentCategoryId,
        isHidden: false,
      },
      attributes: ['id'],
      include: this.buildCategoryTree(),
    });

    if (!category) {
      return [];
    }

    return this.flattenCategoryTree(category, parentCategoryId);
  }

  flattenCategoryTree(category: Category, parentCategoryId: number): number[] {
    let ids: number[] = [];

    if (category.id !== parentCategoryId) {
      ids.push(category.id);
    }

    if (category.subCategories && category.subCategories.length > 0) {
      for (const subCategory of category.subCategories) {
        ids = ids.concat(this.flattenCategoryTree(subCategory, parentCategoryId));
      }
    }

    return ids;
  }

  buildCategoryTree(depth: number = CATEGORY_TREE_MAX_DEPTH): Includeable[] {
    if (depth <= 0) {
      return [];
    }

    return [
      {
        model: Category,
        as: 'subCategories',
        include: this.buildCategoryTree(depth - 1),
        attributes: ['id', 'titleEn', 'titleAm'],
      },
    ];
  }

  buildParentCategoryTree(depth: number = CATEGORY_TREE_MAX_DEPTH): Includeable[] {
    if (depth <= 0) {
      return [];
    }

    return [
      {
        model: Category,
        as: 'parentCategory',
        include: this.buildParentCategoryTree(depth - 1),
        attributes: ['id', 'titleEn', 'titleAm'],
      },
    ];
  }
}
