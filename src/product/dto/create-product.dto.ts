import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateProductDto {

  @ApiProperty({
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 1200,
  })
  @IsNumber()
  @Min(1)
  price: number;


  @ApiProperty({
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  categoryIds: number[];
}