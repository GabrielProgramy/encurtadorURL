import { UrlsSevices } from "./urls.service";

import type { Urls } from "../../../generated/prisma";

const fixedSlug: string = "ADc1";

const mockPrisma = {
  urls: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockUrlToCreate = {
  full_url: "XXXXXXXXXXXXXXXXXXXXXX",
  slug: "T4Asd",
};

const mockCreatedUrl = {
  id: "id1",
  ...mockUrlToCreate,
  slug: fixedSlug,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUrls: Urls = {
  id: "id1",
  full_url: "XXXXXXXXXXXXXXXXXXXXXX",
  slug: fixedSlug,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("UsersService", () => {
  const generateSpy = jest.spyOn(UrlsSevices, "generateCode");

  afterEach(() => {
    jest.clearAllMocks();

    generateSpy.mockRestore();
  });

  it("should be able a create new short url", async () => {
    generateSpy.mockReturnValue(
      new Promise((resolve, reject) => resolve(fixedSlug)),
    );

    mockPrisma.urls.create.mockResolvedValue(mockCreatedUrl);

    const result = await UrlsSevices.create(mockPrisma as any, mockUrlToCreate);

    expect(generateSpy).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockCreatedUrl);
    expect(mockPrisma.urls.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.urls.create).toHaveBeenCalledWith({
      data: {
        full_url: mockCreatedUrl.full_url,
        slug: mockCreatedUrl.slug,
      },
    });

    expect(mockCache.get).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it("should be able a find url by short code by cache", async () => {
    mockCache.get.mockResolvedValue(mockUrls.full_url);

    const result = await UrlsSevices.findByCode(
      mockPrisma as any,
      mockCache as any,
      fixedSlug,
    );

    expect(result).toEqual(mockUrls.full_url);
    expect(mockCache.get).toHaveBeenCalledTimes(1);
    expect(mockPrisma.urls.findFirst).not.toHaveBeenCalled();

    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it("should be possible to find the URL by its shortcode directly in the database and set it in the cache.", async () => {
    mockPrisma.urls.findFirst.mockResolvedValue(mockUrls);
    mockCache.get.mockResolvedValue(null);

    const result = await UrlsSevices.findByCode(
      mockPrisma as any,
      mockCache as any,
      fixedSlug,
    );

    const resultJSON = JSON.parse(result);

    expect(resultJSON.full_url).toEqual(mockUrls.full_url);
    expect(mockCache.get).toHaveBeenCalledTimes(1);
    expect(mockCache.set).toHaveBeenCalledTimes(1);
    expect(mockPrisma.urls.findFirst).toHaveBeenCalledTimes(1);
  });
});
