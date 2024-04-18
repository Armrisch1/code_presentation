import { BaseModel } from 'models/base';
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Product } from 'models/product';

@Table({
  tableName: 'product_sub_products',
  underscored: true,
})
export class ProductSubProduct extends BaseModel<ProductSubProduct> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subProductId: number;

  @BelongsTo(() => Product, {
    foreignKey: 'productId',
    as: 'product',
  })
  product?: Product;

  @BelongsTo(() => Product, {
    foreignKey: 'subProductId',
    as: 'subProduct',
  })
  subProduct?: Product;
}
