import type { FastifyInstance } from "fastify";
import { Redis } from "ioredis";
import fp from "fastify-plugin";

async function cacheDbConnector(fastify: FastifyInstance, options: Object) {
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT as string),
  });

  redis.on("error", (error: any) => {
    fastify.log.error("Erro de conexão com Redis: ", error as never);
  });

  fastify.decorate("cache", redis);

  fastify.addHook("onClose", async (instance: FastifyInstance) => {
    instance.log.info("Encerrando conexão Redis...");
    instance.cache.quit();
  });
}

export default fp(cacheDbConnector);
