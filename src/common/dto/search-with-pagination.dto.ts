import { PaginationDto } from 'common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWithPaginationDto extends PaginationDto {
   @ApiProperty({
      name: 'search',
      type: String,
      required: false,
      description: 'Search term',
   })
   search?: string;
}
