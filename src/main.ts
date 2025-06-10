import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuração de validação global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Filtros e Interceptors globais
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Servir arquivos estáticos (uploads)
  app.useStaticAssets('./uploads', {
    prefix: '/uploads/',
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Hortifruti API')
    .setDescription(`
      ## API para gerenciamento de hortifruti com carrinho de compras
      
      ### Funcionalidades:
      - ✅ CRUD completo de produtos
      - ✅ Upload de imagens
      - ✅ Sistema de carrinho por sessão
      - ✅ Pagamento fictício
      - ✅ Validações completas
      
      ### Como usar:
      1. Crie produtos usando POST /products
      2. Faça upload de imagens com POST /products/{id}/upload-image
      3. Adicione produtos ao carrinho com POST /cart/add
      4. Processe o pagamento com POST /payment/process
      
      ### Session ID:
      Use um identificador único por usuário (ex: "user-123", "session-abc")
    `)
    .setVersion('1.0')
    .addTag('products', 'Operações de produtos')
    .addTag('cart', 'Operações do carrinho')
    .addTag('payment', 'Operações de pagamento')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 API rodando em http://localhost:${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/api`);
  console.log(`📁 Upload de imagens: http://localhost:${port}/uploads/`);
}
bootstrap();
