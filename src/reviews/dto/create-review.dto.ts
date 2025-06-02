import { IsNotEmpty, IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID do pedido que está sendo avaliado', example: 1 })
  @IsNotEmpty({ message: 'O ID do pedido não pode estar vazio' })
  @IsInt({ message: 'O ID do pedido deve ser um número inteiro' })
  orderId: number;

  // If reviewing a specific product within the order, add productId:
  // @ApiProperty({ description: 'ID do produto específico sendo avaliado (opcional)', example: 5, required: false })
  // @IsOptional()
  // @IsInt()
  // productId?: number;

  @ApiProperty({ description: 'Nota da avaliação (1 a 5)', example: 5 })
  @IsNotEmpty({ message: 'A nota não pode estar vazia' })
  @IsInt({ message: 'A nota deve ser um número inteiro' })
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  rating: number;

  @ApiProperty({ description: 'Comentário da avaliação (opcional)', example: 'Ótimos produtos, entrega rápida!', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
