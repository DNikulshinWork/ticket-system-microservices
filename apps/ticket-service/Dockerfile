FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm run build --filter @repo/logger --filter ticket-service

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/ticket-service/dist ./apps/ticket-service/dist
COPY --from=builder /app/packages/logger/dist ./packages/logger/dist
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/ticket-service/package.json ./apps/ticket-service/package.json
COPY --from=builder /app/packages/logger/package.json ./packages/logger/package.json
COPY --from=builder /app/apps/ticket-service/prisma ./apps/ticket-service/prisma
EXPOSE 3001
CMD ["pnpm", "run", "start:prod", "--filter", "ticket-service"]