import { Module } from '@nestjs/common';
import { AddressService } from './adress.service';
import { AddressController } from './adress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/adress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}