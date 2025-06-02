import { PartialType } from '@nestjs/swagger'; // Use PartialType from swagger for DTO inheritance
import { CreateProdutoDto } from './create-produto.dto';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {}

