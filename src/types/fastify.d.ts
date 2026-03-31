import { FastifyInstance } from "fastify";
import { PrismaClient } from "../../generated/prisma";
import { Redis } from "ioredis";

declare module "fastify" {
  export interface FastifyInstance {
    db: PrismaClient;
    cache: Redis;
  }
}
