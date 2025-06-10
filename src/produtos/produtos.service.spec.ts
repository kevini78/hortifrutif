import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './produtos.service';
import { Product } from './entities/produto.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        category: 'Test Category',
        stock: 50,
      };

      const product = { id: 1, ...createProductDto };
      
      mockRepository.create.mockReturnValue(product);
      mockRepository.save.mockReturnValue(product);

      const result = await service.create(createProductDto);

      expect(result).toEqual(product);
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const product = { id: 1, name: 'Test Product' };
      mockRepository.findOne.mockReturnValue(product);

      const result = await service.findOne(1);

      expect(result).toEqual(product);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
