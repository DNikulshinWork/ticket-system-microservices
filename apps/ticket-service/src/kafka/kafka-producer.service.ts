import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { logger } from '@repo/logger';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  onModuleInit() {
    logger.info('Kafka Producer Client initialized successfully');
  }

  emitTicketCreated(ticketData: any) {
    logger.info({ ticketId: ticketData.id, title: ticketData.title }, 'Emitting TICKET_CREATED event to Kafka');
    
    // Метод emit отправляет сообщение и сразу возвращает управление (fire-and-forget)
    this.kafkaClient.emit('TICKET_CREATED', {
      key: ticketData.id, // Ключ для партиционирования (все события одного тикета попадут в одну партицию)
      value: ticketData,
    });
  }
}