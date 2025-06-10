import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({ description: 'ID do produto', example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}