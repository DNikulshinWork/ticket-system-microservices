import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  KAFKA_BROKER: z.string().default('localhost:9092'),
  PORT: z.string().default('3001'),
});

export type EnvSchema = z.infer<typeof envSchema>;