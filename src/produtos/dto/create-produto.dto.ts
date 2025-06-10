import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Maçã Fuji' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição do produto', example: 'Maçã Fuji fresca e doce' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Preço do produto', example: 5.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'Categoria do produto', example: 'Frutas' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({ description: 'Indica se o produto está ativo', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}