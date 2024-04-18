import { BaseModel } from 'models/base';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { Property } from 'models/property';
import { Product } from 'models/product';

@Table({
  tableName: 'product_properties',
  underscored: true,
})
export class ProductProperty extends BaseModel<ProductProperty> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  valEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  valAm?: string;

  @BelongsTo(() => Property, {
    foreignKey: 'propertyId',
    as: 'property',
  })
  property: Property;

  @BelongsTo(() => Product, {
    foreignKey: 'productId',
    as: 'product',
  })
  product: Product;
}
