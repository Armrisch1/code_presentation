import { OrderDeliveryStatusEnum } from 'enums/order.enums';

export interface OrderItemInterface {
  name: string;
  price: number;
  amount: number;
  image?: string;
}

export interface OrderItemPageDataInterface {
  firstName: string;
  lastName: string;
  email: string;
  status: OrderDeliveryStatusEnum;
  deliveryAddress: string;
  totalAmount: number;
  orderItems: OrderItemInterface[];
}
