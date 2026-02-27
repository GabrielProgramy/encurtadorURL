import type { Urls } from "../../generated/prisma/client.ts";
import { UrlsSevices } from "../../src/modules/urls/urls.service.ts";
import {
  clearTestDbAndCache,
  testCache,
  testPrisma,
} from "../config/test-setup.ts";

const testFullURL = "https://www.google.com";
let createdUrl: Urls;
let cacheKey: string;

describe("INTEGRAÇÃO: UsersService - Cache-Aside (Prisma+ Redis)", () => {
  beforeAll(async () => {
    await clearTestDbAndCache();
  });

  afterEach(async () => {
    await clearTestDbAndCache();
    jest.clearAllMocks();
  });

  it("deve buscar no BD na primeira vez e retornar do Cache na segunda", async () => {
    const urlToCreate = {
      fullURL: testFullURL,
      shortCode: "test-short-url",
      totalClicks: 0,
    };

    createdUrl = await testPrisma.urls.create({ data: urlToCreate });

    cacheKey = urlToCreate.shortCode;

    const firstResult = await UrlsSevices.findByCode(
      testPrisma,
      testCache,
      urlToCreate.fullURL
    );

    expect(firstResult).toEqual(testFullURL);

    const cachedData = await testCache.get(cacheKey);
    expect(cachedData).not.toBeNull();

    const prismaSpy = jest.spyOn(testPrisma.urls, "findFirst");

    const secondResult = await UrlsSevices.findByCode(
      testPrisma,
      testCache,
      urlToCreate.fullURL
    );

    expect(secondResult).toEqual(testFullURL);

    expect(prismaSpy).not.toHaveBeenCalled();

    prismaSpy.mockRestore();
  });
});
