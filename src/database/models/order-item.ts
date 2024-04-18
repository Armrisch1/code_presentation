import { BaseModel } from 'models/base';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { Order } from 'models/order';
import { Product } from 'models/product';

@Table({
  tableName: 'order_items',
  underscored: true,
})
export class OrderItem extends BaseModel<OrderItem> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  orderId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @BelongsTo(() => Order, {
    foreignKey: 'orderId',
    as: 'order',
  })
  order: Order;

  @BelongsTo(() => Product, {
    foreignKey: 'productId',
    as: 'product',
  })
  product: Product;
}
