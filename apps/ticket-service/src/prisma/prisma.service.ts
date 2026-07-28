import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { logger } from '@repo/logger';
import type { EnvSchema } from '../env.schema';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService<EnvSchema>) {
    const connectionString = configService.get('DATABASE_URL', { infer: true });
    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    logger.info('Prisma connected to database successfully via adapter');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    logger.info('Prisma disconnected from database');
  }
}