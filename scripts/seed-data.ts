import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ProductService } from '../src/produtos/produtos.service';

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);

  const produtos = [
    {
      name: 'Maçã Fuji',
      description: 'Maçã Fuji fresca e crocante, ideal para consumo in natura',
      price: 5.99,
      category: 'Frutas',
      stock: 100,
      isActive: true,
    },
    {
      name: 'Banana Nanica',
      description: 'Banana nanica madura, rica em potássio',
      price: 3.50,
      category: 'Frutas',
      stock: 80,
      isActive: true,
    },
    {
      name: 'Tomate Italiano',
      description: 'Tomate italiano fresco para saladas e molhos',
      price: 7.20,
      category: 'Verduras',
      stock: 60,
      isActive: true,
    },
    {
      name: 'Alface Americana',
      description: 'Alface americana crocante e fresquinha',
      price: 2.80,
      category: 'Verduras',
      stock: 40,
      isActive: true,
    },
    {
      name: 'Cenoura',
      description: 'Cenoura orgânica, rica em betacaroteno',
      price: 4.50,
      category: 'Legumes',
      stock: 70,
      isActive: true,
    },
    {
      name: 'Batata Inglesa',
      description: 'Batata inglesa para diversas preparações',
      price: 3.20,
      category: 'Legumes',
      stock: 90,
      isActive: true,
    },
  ];

  for (const produto of produtos) {
    try {
      await productService.create(produto);
      console.log(`✅ Produto criado: ${produto.name}`);
    } catch (error) {
      console.log(`❌ Erro ao criar produto ${produto.name}:`, error.message);
    }
  }

  await app.close();
  console.log('🌱 Dados de exemplo inseridos com sucesso!');
}