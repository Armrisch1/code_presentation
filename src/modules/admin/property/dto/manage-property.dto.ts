import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyTypeEnum } from 'enums/property-enums';

export class ListObject {
  @ApiProperty({
    description: 'Property value en',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  valueEn: string;

  @ApiProperty({
    description: 'Property value am',
    type: String,
  })
  @IsOptional()
  @IsString()
  valueAm?: string;
}

export class ListObjectWithId extends ListObject {
  @ApiProperty({
    description: 'Property option id',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id?: number;
}

export class ManagePropertyDto {
  @ApiProperty({
    description: 'Property type',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  nameEn: string;

  @ApiProperty({
    description: 'Property type',
    type: String,
  })
  @IsOptional()
  @IsString()
  nameAm?: string;

  @ApiProperty({
    description: 'Property type',
    enum: PropertyTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(PropertyTypeEnum)
  type: PropertyTypeEnum;

  @ApiProperty({
    description: 'Property options need to send only when selected "list" type',
    isArray: true,
    type: ListObject,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ListObject)
  @ValidateIf((object) => object.type === PropertyTypeEnum.list)
  list: Array<ListObject> = [];
}

export class UpdatePropertyDto extends ManagePropertyDto {
  @ApiProperty({
    description: 'Property options need to send only when selected "list" type',
    isArray: true,
    type: ListObjectWithId,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ListObjectWithId)
  @ValidateIf((object) => object.type === PropertyTypeEnum.list)
  list: Array<ListObjectWithId> = [];
}
