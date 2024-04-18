import { BaseModel } from 'models/base';
import { BelongsTo, BelongsToMany, Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { OrderItem } from 'models/order-item';
import { ProductImage } from 'models/product-image';
import { ProductProperty } from 'models/product-property';
import { ProductSubProduct } from 'models/product-sub-product';
import { Category } from 'models/category';

@Table({
  tableName: 'products',
})
export class Product extends BaseModel<Product> {
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoryId: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  qty: number;

  @Column({ type: DataType.STRING, allowNull: false })
  titleEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  titleAm?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  descriptionEn?: string;

  @Column({ type: DataTypes.TEXT, allowNull: true })
  descriptionAm?: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  shortDescriptionEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  shortDescriptionAm?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  metaTitle?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  metaDescription?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isHidden: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isTop: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isBestseller: boolean;

  @Column({ type: DataType.INTEGER({ length: 2 }), allowNull: false })
  age: number;

  @BelongsTo(() => Category, {
    foreignKey: 'categoryId',
    as: 'category',
  })
  category: Category;

  @HasMany(() => OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems',
  })
  orderItems: OrderItem[];

  @HasMany(() => ProductImage, {
    foreignKey: 'productId',
    as: 'images',
  })
  images: ProductImage[];

  @HasMany(() => ProductProperty, {
    foreignKey: 'productId',
    as: 'productProperties',
  })
  productProperties: ProductProperty[];

  @BelongsToMany(() => Product, {
    through: () => ProductSubProduct,
    foreignKey: 'productId',
    otherKey: 'subProductId', // important to provide secondKey
    as: 'subProducts',
  })
  subProducts?: Product[];

  @BelongsToMany(() => Product, {
    through: () => ProductSubProduct,
    foreignKey: 'subProductId',
    otherKey: 'productId',
    as: 'parentProducts',
  })
  parentProducts: Product[];
}
