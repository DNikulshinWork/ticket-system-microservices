import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketService } from './ticket.service';
import { logger } from '@repo/logger';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @MessagePattern('ticket.create')
  async createTicket(@Payload() data: any) {
    logger.info('Received ticket.create message', data);
    return this.ticketService.create(data);
  }
}