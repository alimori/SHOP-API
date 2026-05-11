import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsInt, Min } from 'class-validator';

import { Type } from 'class-transformer';

export class PaginationQueryDto {

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of items to skip',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number = 0;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}