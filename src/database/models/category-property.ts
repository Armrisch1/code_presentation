import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';

import { BaseModel } from 'models/base';
import { Category } from 'models/category';
import { Property } from 'models/property';

@Table({
  tableName: 'category_properties',
  underscored: true,
})
export class CategoryProperty extends BaseModel<CategoryProperty> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Category)
  categoryId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Property)
  propertyId: number;
}
