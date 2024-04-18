import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import sequelize, { WhereOptions } from 'sequelize';

import { convertCamelCaseToSentence, generateResponse, includeSearchConditions, mapPagination } from 'utils/helpers';
import { Order } from 'models/order';
import { EditOrderDto } from 'modules/admin/order/dto/edit-order.dto';
import { AppResponse } from 'common/types/response.type';
import { OrderHelper } from 'common/helpers/order.helper';
import { OrderItem } from 'models/order-item';
import { Product } from 'models/product';
import { ProductImage } from 'models/product-image';
import { OrderItemInterface, OrderItemPageDataInterface } from 'modules/admin/order/interfaces/order-item.interface';
import { OrdersGridDto } from 'modules/admin/order/dto/orders-grid.dto';
import { OrderDeliveryStatusEnum, OrderPaymentStatusEnum } from 'enums/order.enums';
import { PaginationResponseInterface } from 'common/interfaces/pagination.interface';

@Injectable()
export class OrderAdminService {
  constructor(private readonly orderHelper: OrderHelper) {}

  async editOrderKey(id, editOrderDto: EditOrderDto): AppResponse<Order> {
    const order = await Order.findByPk(id);

    if (!order) {
      throw new NotFoundException('No Order with this id');
    }

    order[editOrderDto.key] = editOrderDto.value;
    await order.save();

    return generateResponse(order, `${convertCamelCaseToSentence(editOrderDto.key)} successfully updated`);
  }

  async getOrderData(id: number): AppResponse<OrderItemPageDataInterface> {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          required: true,
          as: 'orderItems',
          attributes: ['id', 'amount'],
          include: [
            {
              model: Product,
              required: true,
              attributes: ['id', 'price', 'titleEn', 'titleAm'],
              include: [
                {
                  model: ProductImage,
                  attributes: ['src'],
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order || !order.orderItems.length) {
      throw new ConflictException('Order or order items not found');
    }

    const totalAmount: number = await this.orderHelper.calculateOrderTotalPrice(order.id);
    const orderItems: OrderItemInterface[] = this.orderHelper.formOrderItems(order.orderItems);

    const { firstName, lastName, email, deliveryStatus: status, fullAddress: deliveryAddress } = order;
    const responseData: OrderItemPageDataInterface = {
      firstName,
      lastName,
      email,
      status,
      deliveryAddress,
      totalAmount,
      orderItems,
    };

    return generateResponse(responseData);
  }

  async getOrders(ordersGridDto: OrdersGridDto): AppResponse<PaginationResponseInterface> {
    const { search, status = OrderDeliveryStatusEnum.new, ...paginationDto } = ordersGridDto;
    const { limit, offset } = mapPagination(paginationDto);
    let where: WhereOptions<Order> = {
      deliveryStatus: status,
      paymentStatus: OrderPaymentStatusEnum.success,
    };

    if (search) {
      where = includeSearchConditions<Order>(
        ['id', 'email', 'firstName', 'lastName', 'country', 'city'],
        search,
        where,
      );
    }

    const { rows, count } = await Order.findAndCountAll({
      attributes: [
        'id',
        'email',
        'firstName',
        'lastName',
        'createdAt',
        [sequelize.literal('(SELECT COUNT(order_items.id) FROM order_items WHERE order_id = `Order`.`id`)'), 'amount'],
        [
          sequelize.literal(`(
            SELECT SUM(order_items.amount * products.price) FROM order_items 
            INNER JOIN products ON products.id = order_items.product_id
            WHERE order_id = \`Order\`.\`id\`)`),
          'sum',
        ],
      ],
      where,
      limit,
      offset,
    });

    return generateResponse({ rows, count });
  }
}
