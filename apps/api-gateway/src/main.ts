import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@repo/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.info('🚀 API Gateway is running on http://localhost:' + port);
}
bootstrap();