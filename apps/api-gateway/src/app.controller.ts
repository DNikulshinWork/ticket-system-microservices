import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('TICKET_SERVICE') private readonly ticketClient: ClientKafka,
  ) {}

  // КРИТИЧЕСКИ ВАЖНО: явно добавляем паттерн в список ожидаемых ответов NestJS
  onModuleInit() {
    this.ticketClient.subscribeToResponseOf('ticket.create');
  }

  @Post('tickets')
  async createTicket(@Body() body: { title: string; description: string; authorId: string }) {
    // Теперь send() сработает, так как reply-топик зарегистрирован
    return this.ticketClient.send('ticket.create', body);
  }
}