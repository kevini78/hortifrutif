  import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { User } from './entities/user.entity';

  @ApiTags('users')
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @ApiOperation({ summary: 'Registrar um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: User })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 409, description: 'Email já está em uso.' })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.usersService.create(createUserDto);
    }
  }