import type { Prisma } from "../../../generated/prisma";
import type { PrismaClient } from "../../../generated/prisma";
import MyErrorClass from "../../utils/MyErrorClass.js";

type UrlMetricsCreateData = Prisma.UrlMetricsCreateInput & { url_id: string };

export const UrlMetricsService = {
  async create(
    prisma: PrismaClient,
    { url_id, ...data }: UrlMetricsCreateData,
  ) {
    const metrics = await prisma.urlMetrics.create({
      data: {
        ...data,
        urls: { connect: { id: url_id } },
      },
    });

    return metrics;
  },

  async getMetricsByUrl(prisma: PrismaClient, urlId: string) {
    const existsUrl = await prisma.urls.findUnique({ where: { id: urlId } });

    if (!existsUrl) throw new MyErrorClass("URL INEXISTENTE, VERIFIQUE!", 404);

    const metrics = await prisma.urlMetrics.findMany({
      where: { url_id: urlId },
    });

    return metrics;
  },

  async deleteOne(prisma: PrismaClient, metricsId: string) {
    await prisma.urlMetrics.delete({
      where: {
        id: metricsId,
      },
    });
  },

  async deleteManyByUrl(prisma: PrismaClient, urlId: string) {
    await prisma.urlMetrics.deleteMany({
      where: {
        url_id: urlId,
      },
    });
  },
};
