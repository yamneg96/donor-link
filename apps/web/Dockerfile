# ==================================================
# DonorLink Web App Dockerfile
# ==================================================

# ==================================================
# BUILDER
# ==================================================
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/web/package.json ./apps/web/package.json

COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter web build

# ==================================================
# PRODUCTION
# ==================================================
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]