import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    this.produtoRepository.merge(produto, updateProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
  }
}