import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Rua do endereço', example: 'Rua das Flores' })
  @IsNotEmpty({ message: 'A rua não pode estar vazia' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'Número do endereço', example: '123' })
  @IsNotEmpty({ message: 'O número não pode estar vazio' })
  @IsString()
  number: string;

  @ApiProperty({ description: 'Complemento do endereço', example: 'Apto 101', required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ description: 'Bairro do endereço', example: 'Centro' })
  @IsNotEmpty({ message: 'O bairro não pode estar vazio' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ description: 'Cidade do endereço', example: 'São Paulo' })
  @IsNotEmpty({ message: 'A cidade não pode estar vazia' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado do endereço (sigla)', example: 'SP' })
  @IsNotEmpty({ message: 'O estado não pode estar vazio' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'CEP do endereço', example: '12345-678' })
  @IsNotEmpty({ message: 'O CEP não pode estar vazio' })
  @IsString()
  zipCode: string;
}
