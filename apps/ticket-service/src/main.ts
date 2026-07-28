import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { logger } from '@repo/logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        clientId: 'ticket-service-server',
      },
      consumer: {
        // Свежий groupId для сервера
        groupId: 'ticket-service-consumer-v2',
      },
    },
  });

  await app.listen();
  logger.info('🎫 Ticket Service is listening to Kafka messages...');
}
bootstrap();