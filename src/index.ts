import "dotenv/config";
import fastify from "fastify";
import dbConnector from "./plugins/db-connector.ts";
import cacheDbConnector from "./plugins/cacheDb.connector.ts";
import urlRoutes from "./modules/urls/index.ts";

const server = fastify({
  logger: true,
});

async function start() {
  try {
    server.register(dbConnector);
    server.register(cacheDbConnector);
    server.register(urlRoutes, { prefix: "/urls" });

    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
