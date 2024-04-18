import { Sequelize } from 'sequelize-typescript';
import * as cls from 'cls-hooked';

import { SequelizeDBConfig } from 'src/database/database.config';
import { Admin } from 'models/admin';
import { Category } from 'models/category';
import { OrderItem } from 'models/order-item';
import { Product } from 'models/product';
import { ProductImage } from 'models/product-image';
import { ProductProperty } from 'models/product-property';
import { ProductSubProduct } from 'models/product-sub-product';
import { Property } from 'models/property';
import { Order } from 'models/order';
import { PropertyOption } from 'models/property-option';
import { CategoryProperty } from 'models/category-property';

// Makes transactions globally
export const namespace = cls.createNamespace('hk-session');
Sequelize.useCLS(namespace);
export const sequelizeHK = new Sequelize(SequelizeDBConfig);

sequelizeHK.addModels([
  Admin,
  Category,
  Product,
  ProductImage,
  ProductProperty,
  ProductSubProduct,
  Property,
  Order,
  OrderItem,
  PropertyOption,
  CategoryProperty,
]);

// export const rawQuery = async (
//   sql: string,
//   options = {},
//   shouldReturnArray = true,
// ): Promise<any> => {
//   const [data] = await sequelizeHK.query(sql, {
//     type: shouldReturnArray ? 'RAW' : 'SELECT',
//     ...options,
//   });
//
//   return data;
// };
