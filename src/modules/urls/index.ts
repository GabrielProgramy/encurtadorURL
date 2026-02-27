import type { FastifyInstance } from "fastify";
import { postUrlSchema } from "./urls.schema.ts";
import { UrlsSevices } from "./urls.service.ts";

async function urlRoutes(fastify: FastifyInstance, options: object) {
  fastify.post("/", { schema: postUrlSchema }, async (request, reply) => {
    try {
      const { fullURL } = request.body as { fullURL: string };

      const url = await UrlsSevices.create(fastify.db, {
        fullURL,
      });

      reply.code(201).send(url);
    } catch (error) {
      console.log(error);
      reply.code(400).send({ error: "Erro ao criar URL" });
    }
  });

  fastify.get("/:shortCode", async (request, reply) => {
    const { shortCode } = request.params as { shortCode: string };

    const url = await UrlsSevices.findByCode(
      fastify.db,
      fastify.cache,
      shortCode
    );

    if (!url) {
      reply.code(404).send({ error: "URL não encontrada" });
    }

    reply.redirect(url as string);
  });
}

export default urlRoutes;
