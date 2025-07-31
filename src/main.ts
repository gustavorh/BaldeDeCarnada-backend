import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js frontend
      'http://localhost:3001', // Alternative port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    credentials: true, // Allow cookies and credentials
    preflightContinue: false,
    optionsSuccessStatus: 204, // Some legacy browsers choke on 204
  });

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

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
