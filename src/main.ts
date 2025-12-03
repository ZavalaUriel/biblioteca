import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';

async function bootstrap() {
  dotenv.config({ path: '.env.dev' });

  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: process.env.MAX_REQUEST_SIZE ?? '10mb' }));
  app.use(
    urlencoded({
      extended: true,
      limit: process.env.MAX_REQUEST_SIZE ?? '10mb',
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5174',
      'http://10.115.128.134:3001',
      'http://localhost:5173',
      'http://10.115.128.131:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3003, '0.0.0.0');
}
bootstrap();
