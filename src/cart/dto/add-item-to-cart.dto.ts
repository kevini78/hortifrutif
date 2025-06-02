import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCartDto {
  @ApiProperty({ description: 'ID do produto a ser adicionado', example: 1 })
  @IsNotEmpty({ message: 'O ID do produto não pode estar vazio' })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro' })
  produtoId: number;

  @ApiProperty({ description: 'Quantidade do produto a ser adicionada', example: 2, default: 1 })
  @IsNotEmpty({ message: 'A quantidade não pode estar vazia' })
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade deve ser pelo menos 1' })
  quantidade: number;
}