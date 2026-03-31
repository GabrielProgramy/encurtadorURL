import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { deleteUrlSchema, postUrlSchema, putUrlSchema } from "./urls.schema.js";
import { UrlsSevices, type UrlUpdateData } from "./urls.service.js";
import { UrlMetricsService } from "./urlMetrics.service.js";

async function urlRoutes(fastify: FastifyInstance, options: object) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post("/", { schema: postUrlSchema }, async (request, reply) => {
    const { full_url, slug } = request.body;

    const url = await UrlsSevices.create(app.db, {
      full_url,
      slug: slug || "",
    });

    reply.code(201).send({
      success: true,
      data: url,
    });
  });

  app.get("/:shortCode", async (request, reply) => {
    const { shortCode } = request.params as { shortCode: string };

    const urlStringData = await UrlsSevices.findByCode(
      app.db,
      app.cache,
      shortCode,
    );

    if (!urlStringData) {
      reply.code(404).send({ error: "URL não encontrada" });
    }

    const objectURL: { full_url: string; urlId: string } = JSON.parse(
      urlStringData as string,
    );

    await UrlMetricsService.create(app.db, {
      url_id: objectURL.urlId,
      ip_address: request.ip,
      referrer: request.headers.referer || "",
      user_agent: request.headers["user-agent"] || "",
    });

    reply.redirect(objectURL.full_url as string);
  });

  app.get("/", async (request, reply) => {
    const urls = await UrlsSevices.findAll(app.db);

    reply.status(200).send({
      success: true,
      data: urls,
    });
  });

  app.put("/:urlId", { schema: putUrlSchema }, async (request, reply) => {
    const { urlId } = request.params;

    const { full_url, slug } = request.body;

    const updatedData: UrlUpdateData = { id: urlId };

    if (full_url !== undefined) updatedData.full_url = full_url;
    if (slug !== undefined) updatedData.slug = slug;

    const updateUrl = await UrlsSevices.update(app.db, updatedData);

    reply.code(200).send({
      success: true,
      data: updateUrl,
    });
  });

  app.delete("/:urlId", { schema: deleteUrlSchema }, async (request, reply) => {
    const { urlId } = request.params;

    await UrlsSevices.delete(app.db, urlId);

    reply.status(204);
  });
}

export default urlRoutes;
