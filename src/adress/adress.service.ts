import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-adress.dto';
import { UpdateAddressDto } from './dto/update-adress.dto';
import { Address } from './entities/adress.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });
    return await this.addressRepository.save(address);
  }

  async findAllByUser(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado ou não pertence ao usuário.`);
    }
    return address;
  }

  async update(id: number, userId: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id, userId);
    this.addressRepository.merge(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async remove(id: number, userId: number): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.addressRepository.remove(address);
  }
}