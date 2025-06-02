import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  @IsEmail({}, { message: 'Formato de email inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @IsString()
  password: string;
}