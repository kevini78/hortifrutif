 import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';

  export class CreateUserDto {
    @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
    @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
    @IsNotEmpty({ message: 'O email não pode estar vazio' })
    @IsEmail({}, { message: 'Formato de email inválido' })
    email: string;

    @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
    @IsNotEmpty({ message: 'A senha não pode estar vazia' })
    @IsString()
    password: string;

    @ApiProperty({ description: 'Telefone do usuário', example: '1234567890', required: false })
    @IsOptional()
    @IsString()
    phone?: string;
  }