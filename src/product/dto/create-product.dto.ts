import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
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
}