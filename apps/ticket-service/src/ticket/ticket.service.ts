import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { logger } from '@repo/logger';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async create(data: { title: string; description: string; authorId: string }) {
    logger.info({ title: data.title, authorId: data.authorId }, 'Creating ticket in database');
    
    // 1. Сохраняем в БД
    const newTicket = await this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: data.authorId,
      },
    });

    // 2. Публикуем асинхронное событие в Kafka
    this.kafkaProducer.emitTicketCreated(newTicket);

    // 3. Возвращаем результат (для синхронного ответа через Redis API Gateway)
    return newTicket;
  }
}