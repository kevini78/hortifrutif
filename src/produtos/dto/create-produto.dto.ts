import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class CreateProdutoDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Maçã Gala' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Descrição detalhada do produto', example: 'Maçã Gala fresca, ideal para sucos e consumo in natura.', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Preço unitário do produto', example: 5.99 })
  @IsNotEmpty({ message: 'O preço não pode estar vazio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ser um número com até 2 casas decimais' })
  @Min(0.01, { message: 'O preço deve ser maior que zero' })
  preco: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100, default: 0 })
  @IsOptional()
  @IsInt({ message: 'O estoque deve ser um número inteiro' })
  @Min(0, { message: 'O estoque não pode ser negativo' })
  estoque?: number;
}
