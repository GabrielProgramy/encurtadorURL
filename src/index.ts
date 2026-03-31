import "dotenv/config";
import fastify, { type FastifyError } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import dbConnector from "./plugins/db-connector";
import cacheDbConnector from "./plugins/cacheDb.connector";
import urlRoutes from "./modules/urls/index";
import MyErrorClass from "./utils/MyErrorClass";
import { ZodError } from "zod";

const server = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

async function start() {
  try {
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    server.setErrorHandler(
      (error: FastifyError | MyErrorClass, request, reply) => {
        request.log.error(error);

        if (error instanceof MyErrorClass)
          return reply.status(error.statusCode).send({
            success: false,
            message: error.message,
          });

        if ("code" in error) {
          if (error.code === "FST_ERR_VALIDATION" && error.validation) {
            return reply.status(400).send({
              success: false,
              message: "Erro de validação, verifique os campos!",
              fields: error.validation.map((validation) => {
                return {
                  field: validation.instancePath.replace("/", ""),
                  message: validation.message,
                };
              }),
            });
          }
        }

        reply.status(500).send({
          success: false,
          message: "Erro interno, verifique!",
        });
      },
    );
    server.register(dbConnector);
    server.register(cacheDbConnector);
    server.register(urlRoutes, { prefix: "/urls" });

    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running on port 3000");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
