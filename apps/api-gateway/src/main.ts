import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@repo/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для фронтенда
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.info('🚀 API Gateway is running on http://localhost:' + port);
}
bootstrap();