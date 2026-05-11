// export class CreateProductDto {
//   title: string;
//   price: number;
// }

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

  @ApiProperty({
    example: 'Laptop',
  })
  title: string;

  @ApiProperty({
    example: 1200,
  })
  price: number;
}