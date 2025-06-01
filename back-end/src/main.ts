import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://frontend:5173'], // Cho phép các origin này
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Phục vụ file tĩnh (cho thumbnail)
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(5000);
}
bootstrap();