import { BaseModel } from 'models/base';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Property } from 'models/property';

@Table({
  tableName: 'property_options',
  underscored: true,
})
export class PropertyOption extends BaseModel<PropertyOption> {
  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  valueEn: string;

  @Column({ type: DataType.STRING, allowNull: true })
  valueAm?: string;

  @BelongsTo(() => Property, {
    foreignKey: 'propertyId',
    as: 'property',
  })
  property?: Property;
}
