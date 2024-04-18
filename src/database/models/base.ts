import {
  $GetType,
  AssociationGetOptions,
  Column,
  DataType,
  Model,
} from 'sequelize-typescript';

export abstract class BaseAbstractModel<
  TModelAttributes extends NonNullable<unknown> = any,
  TCreationAttributes extends NonNullable<unknown> = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  /**
   * Returns related instance (specified by propertyKey) of source instance
   */
  abstract $getOne<K extends keyof this>(
    propertyKey: K,
    options?: AssociationGetOptions,
  ): Promise<$GetType<this[K]>>;
}

export class BaseModel<
  TModelAttributes extends NonNullable<unknown> = any,
  TCreationAttributes extends NonNullable<unknown> = TModelAttributes,
> extends BaseAbstractModel<TModelAttributes, TCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  async $getOne(propertyKey, options = undefined) {
    const models = await this.$get(propertyKey, { ...options, limit: 1 });
    if (Array.isArray(models)) {
      return models?.length ? models[0] : null;
    }

    return models;
  }
}
