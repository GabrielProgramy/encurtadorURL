import type { Redis } from "ioredis";
import type { PrismaClient, Urls, Prisma } from "../../../generated/prisma";
import MyErrorClass from "../../utils/MyErrorClass";

type UrlCreateData = Prisma.UrlsCreateInput;
export type UrlUpdateData = {
  id: string;
  full_url?: string;
  slug?: string;
};

export const UrlsSevices = {
  async generateCode(prisma: PrismaClient, slug?: string) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = slug || "";
    let isDone = false;

    while (!isDone) {
      if (!slug) {
        code = "";
        let i = 0;
        while (i <= 5) {
          const index = Math.floor(Math.random() * characters.length);

          code += characters[index];
          i++;
        }
      }

      const existsCode = await prisma.urls.findFirst({
        where: {
          slug: code,
        },
      });

      if (existsCode && slug)
        throw new MyErrorClass("O código personalizado já existe!", 409);

      if (!existsCode) isDone = true;
    }

    return code;
  },

  async create(prisma: PrismaClient, urlData: UrlCreateData): Promise<Urls> {
    const existsUrl = await prisma.urls.findFirst({
      where: {
        full_url: urlData.full_url,
      },
    });

    const slug: string = await this.generateCode(prisma, urlData.slug);

    if (existsUrl) return existsUrl;

    const newUrlData = {
      full_url: urlData.full_url,
      slug,
    };

    const newUrl = await prisma.urls.create({
      data: newUrlData,
    });

    console.log(newUrl);
    return newUrl;
  },

  async findById(prisma: PrismaClient, id: string) {
    const existsUrl = await prisma.urls.findFirst({
      where: {
        id,
      },
    });

    if (!existsUrl) throw new MyErrorClass("URL inexistente!", 404);

    return existsUrl;
  },

  async findByCode(
    prisma: PrismaClient,
    cache: Redis,
    slug: string,
  ): Promise<string | null> {
    const cachedUrl = await cache.get(slug);

    if (cachedUrl) return cachedUrl;

    const url = await prisma.urls.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!url) return null;

    const cacheData = JSON.stringify({ full_url: url.full_url, urlId: url.id });

    await cache.set(slug, cacheData, "EX", 60 * 60 * 24);

    return cacheData;
  },

  async findAll(prisma: PrismaClient) {
    const urls = await prisma.urls.findMany({
      relationLoadStrategy: "join",
      include: {
        _count: true,
      },
    });

    return urls.map(({ _count, ...url }) => {
      return {
        ...url,
        totalClicks: _count.urlMetrics,
      };
    });
  },

  async update(prisma: PrismaClient, { id, ...updateData }: UrlUpdateData) {
    await this.findById(prisma, id);

    const urlUpdated = await prisma.urls.update({
      where: {
        id,
      },
      data: updateData,
    });

    return urlUpdated;
  },

  async delete(prisma: PrismaClient, id: string) {
    await prisma.urls.delete({
      where: {
        id,
      },
    });
  },
};
