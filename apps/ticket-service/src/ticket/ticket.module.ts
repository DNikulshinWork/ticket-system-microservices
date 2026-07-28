import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Module({
  imports: [
    // Kafka клиент ТОЛЬКО для продюсера (без consumer groupId)
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
            clientId: 'ticket-service-producer',
          },
        },
      },
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService, PrismaService, KafkaProducerService],
  exports: [TicketService],
})
export class TicketModule {}