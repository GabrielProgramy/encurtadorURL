FROM node:24.14-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build


FROM node:24.14-slim AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/index.js"]