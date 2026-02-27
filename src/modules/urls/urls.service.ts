import type { Redis } from "ioredis";
import type { Prisma } from "../../../generated/prisma/browser.ts";
import type { PrismaClient } from "../../../generated/prisma/client.ts";
import type { Urls } from "../../../generated/prisma/client.ts";

type UrlCreateData = Omit<Prisma.UrlsCreateInput, "shortCode" | "totalClicks">;

export const UrlsSevices = {
  generateCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = "";
    let i = 0;
    while (i <= 3) {
      const index = Math.floor(Math.random() * characters.length);

      code += characters[index];
      i++;
    }

    return code;
  },

  async create(prisma: PrismaClient, urlData: UrlCreateData): Promise<Urls> {
    const existsUrl = await prisma.urls.findFirst({
      where: {
        fullURL: urlData.fullURL,
      },
    });

    if (existsUrl) return existsUrl;

    const newUrlData = {
      fullURL: urlData.fullURL,
      shortCode: this.generateCode(),
      totalClicks: 0,
    };

    const newUrl = await prisma.urls.create({
      data: newUrlData,
    });

    return newUrl;
  },

  async findByCode(
    prisma: PrismaClient,
    cache: Redis,
    shortCode: string
  ): Promise<string> {
    const cachedUrl = await cache.get(shortCode);

    if (cachedUrl) return cachedUrl;

    const url = await prisma.urls.findFirst({
      where: {
        shortCode: shortCode,
      },
    });

    if (!url) return "";

    await cache.set(shortCode, url.fullURL, "EX", 60 * 60 * 24);

    return url.fullURL;
  },

  async update() {},

  async delete() {},
};
