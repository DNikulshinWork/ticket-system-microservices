import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TICKET_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
            clientId: 'api-gateway-client',
          },
          consumer: {
            groupId: 'api-gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}