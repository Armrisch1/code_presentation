import { BaseModel } from 'models/base';
import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { Property } from 'models/property';
import { CategoryProperty } from 'models/category-property';

@Table({
  tableName: 'categories',
})
export class Category extends BaseModel<Category> {
  @Column({ type: DataType.STRING, allowNull: false })
  titleEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  titleAm?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  parentId?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  metaTitle?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  metaDescription?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isHidden: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isTop: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  img?: string;

  @BelongsTo(() => Category, {
    foreignKey: 'parentId',
    as: 'parentCategory',
  })
  parentCategory?: Category;

  @HasMany(() => Category, {
    foreignKey: 'parentId',
    as: 'subCategories',
  })
  subCategories: Category[];

  @BelongsToMany(() => Property, {
    through: () => CategoryProperty,
    foreignKey: 'categoryId',
    otherKey: 'propertyId',
    as: 'properties',
  })
  properties?: Property[];
}
