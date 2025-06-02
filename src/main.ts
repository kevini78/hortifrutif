import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Hortifruti API')
    .setDescription('API para o sistema de hortifruti CLI')
    .setVersion('1.0')
    .addTag('auth', 'Operações de Autenticação')
    .addTag('users', 'Operações de Usuários')
    .addTag('produtos', 'Operações de Produtos')
    .addTag('cart', 'Operações de Carrinho')
    .addTag('orders', 'Operações de Pedidos')
    .addTag('address', 'Operações de Endereços')
    .addTag('reviews', 'Operações de Avaliações')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(3000,'127.0.0.1');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();