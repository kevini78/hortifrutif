import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-produto.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}