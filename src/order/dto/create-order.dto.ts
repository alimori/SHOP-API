import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {

  @ApiProperty({
    example: 1,
    description: 'Product ID to order',
  })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of product',
  })
  quantity: number;
}