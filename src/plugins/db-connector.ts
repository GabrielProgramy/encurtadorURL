import fp from "fastify-plugin";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import type { FastifyInstance } from "fastify";

async function dbConnector(fastify: FastifyInstance, options: Object) {
  const adapter = new PrismaPg({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`,
  });

  const prisma = new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

  try {
    await prisma.$connect();

    fastify.decorate("db", prisma);

    fastify.addHook("onClose", async (instance) => {
      instance.log.info("Desconectando prisma...");
      await instance.db.$disconnect();
    });
  } catch (error: any) {
    fastify.log.error("Falha ao conectar com o banco!", error as never);
  }
}

export default fp(dbConnector);
