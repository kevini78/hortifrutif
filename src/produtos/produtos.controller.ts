import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Produto } from './entities/produto.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.', type: Produto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.', type: [Produto] })
  findAll(): Promise<Produto[]> {
    return this.produtosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um produto específico' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes do produto retornados com sucesso.', type: Produto })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Atualizar um produto existente' })
  @ApiParam({ name: 'id', description: 'ID do produto a ser atualizado', type: Number })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.', type: Produto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiParam({ name: 'id', description: 'ID do produto a ser removido', type: Number })
  @ApiResponse({ status: 204, description: 'Produto removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.produtosService.remove(id);
  }
}