import { BaseModel } from 'models/base';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { Product } from 'models/product';

@Table({
  tableName: 'product_images',
  underscored: true,
})
export class ProductImage extends BaseModel<ProductImage> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  src: string;

  @BelongsTo(() => Product, {
    foreignKey: 'product_id',
    as: 'product',
  })
  product: Product;
}
