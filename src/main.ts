import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Balde de Carnada API')
    .setDescription('API documentation for Balde de Carnada backend system')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('stock', 'Stock management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('attendance', 'Attendance management endpoints')
    .addTag('reports', 'Report generation endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
