import { Redis } from "ioredis";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const testPrisma = new PrismaClient({
  adapter,
});

export const testCache = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: 2,
});

export async function clearTestDbAndCache() {
  await testPrisma.urls.deleteMany();
  await testCache.flushdb();
}
