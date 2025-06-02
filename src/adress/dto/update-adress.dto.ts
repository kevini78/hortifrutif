import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-adress.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}