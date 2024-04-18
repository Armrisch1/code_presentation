import { BaseModel } from 'models/base';
import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { OrderDeliveryStatusEnum, OrderPaymentStatusEnum } from 'enums/order.enums';
import { OrderItem } from 'models/order-item';

@Table({
  tableName: 'orders',
})
export class Order extends BaseModel<Order> {
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  postalCode: string;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 0 })
  paymentStatus: OrderPaymentStatusEnum;

  @Column({ type: DataType.TINYINT, allowNull: false, defaultValue: 0 })
  deliveryStatus: OrderDeliveryStatusEnum;

  @Column({ type: DataType.STRING(700), allowNull: false })
  fullAddress: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  stripeSessionId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPaymentModalShown: boolean;

  @HasMany(() => OrderItem, {
    foreignKey: 'order_id',
    as: 'orderItems',
  })
  orderItems: OrderItem[];

  static editableAttributes(): string[] {
    return ['firstName', 'lastName', 'email', 'deliveryStatus', 'fullAddress'];
  }
}
