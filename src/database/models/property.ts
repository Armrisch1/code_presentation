import { BaseModel } from 'models/base';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Category } from 'models/category';
import { PropertyTypeEnum } from 'enums/property-enums';
import { ProductProperty } from 'models/product-property';
import { PropertyOption } from 'models/property-option';
import { CategoryProperty } from 'models/category-property';

@Table({
  tableName: 'properties',
})
export class Property extends BaseModel<Property> {
  @Column({ type: DataType.STRING, allowNull: false })
  nameEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  nameAm?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: PropertyTypeEnum;

  @BelongsToMany(() => Category, {
    through: () => CategoryProperty,
    foreignKey: 'propertyId',
    otherKey: 'categoryId',
    as: 'categories',
  })
  category: Category;

  @HasMany(() => ProductProperty, {
    foreignKey: 'propertyId',
    as: 'productProperties',
  })
  productProperties: ProductProperty[];

  @HasMany(() => PropertyOption, {
    foreignKey: 'propertyId',
    as: 'propertyOptions',
  })
  propertyOptions: PropertyOption[];
}
