import fp from "fastify-plugin";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";
import type { FastifyInstance } from "fastify";

async function dbConnector(fastify: FastifyInstance, options: Object) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

  const prisma = new PrismaClient({
    adapter,
    log: ["error", "info", "query", "warn"],
  });

  try {
    await prisma.$connect();

    fastify.decorate("db", prisma);

    fastify.addHook("onClose", async (instance) => {
      instance.log.info("Desconectando prisma...");
      await instance.db.$disconnect();
    });
  } catch (error: any) {
    fastify.log.error("Falha ao conectar com o banco!", error);
  }
}

export default fp(dbConnector);
