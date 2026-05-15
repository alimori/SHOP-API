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


  @IsString()
  @IsNotEmpty()
  title: string;


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