import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddressService } from './adress.service';
import { CreateAddressDto } from './dto/create-adress.dto';
import { UpdateAddressDto } from './dto/update-adress.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Address } from './entities/adress.entity';

@ApiTags('address')
@Controller('address')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Criar um novo endereço para o usuário autenticado' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso.', type: Address })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Request() req, @Body() createAddressDto: CreateAddressDto): Promise<Address> {
    const userId = req.user.userId;
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de endereços retornada com sucesso.', type: [Address] })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(@Request() req): Promise<Address[]> {
    const userId = req.user.userId;
    return this.addressService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um endereço específico' })
  @ApiParam({ name: 'id', description: 'ID do endereço', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes do endereço retornados com sucesso.', type: Address })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado ou não pertence ao usuário.' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Address> {
    const userId = req.user.userId;
    return this.addressService.findOne(id, userId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Atualizar um endereço existente' })
  @ApiParam({ name: 'id', description: 'ID do endereço a ser atualizado', type: Number })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso.', type: Address })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado ou não pertence ao usuário.' })
  update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateAddressDto: UpdateAddressDto): Promise<Address> {
    const userId = req.user.userId;
    return this.addressService.update(id, userId, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um endereço' })
  @ApiParam({ name: 'id', description: 'ID do endereço a ser removido', type: Number })
  @ApiResponse({ status: 204, description: 'Endereço removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado ou não pertence ao usuário.' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
    const userId = req.user.userId;
    return this.addressService.remove(id, userId);
  }
}