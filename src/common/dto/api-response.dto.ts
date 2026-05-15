import {
  ApiHideProperty,
  ApiProperty,
} from '@nestjs/swagger';

export class ApiResponseDto<T> {

  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: '2026-05-15T12:00:00.000Z',
  })
  timestamp: string;

  @ApiHideProperty()
  data: T;
}