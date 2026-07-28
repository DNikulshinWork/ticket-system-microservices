import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Используем process.env с fallback. 
    // Это позволяет prisma generate работать в CI, где DATABASE_URL еще не задан,
    // но при этом использует реальный URL из .env в локальной разработке и на проде.
    url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/ticket_db?schema=public",
  },
});