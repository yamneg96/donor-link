# ==================================================
# DonorLink API - Production Dockerfile
# ==================================================

# ==================================================
# BASE STAGE
# ==================================================
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat wget

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# ==================================================
# DEPENDENCIES STAGE
# ==================================================
FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/api/package.json ./apps/api/package.json

COPY packages ./packages

RUN pnpm install --frozen-lockfile

# ==================================================
# BUILDER STAGE
# ==================================================
FROM dependencies AS builder

COPY . .

RUN pnpm --filter api build

# ==================================================
# PRODUCTION STAGE
# ==================================================
FROM base AS production

ENV NODE_ENV=production

RUN addgroup -S donorlink && adduser -S donorlink -G donorlink

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api

RUN mkdir -p logs uploads && \
  chown -R donorlink:donorlink /app

USER donorlink

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=5 \
  CMD wget --spider -q http://localhost:5000/api/v1/health || exit 1

CMD ["node", "dist/server.js"]