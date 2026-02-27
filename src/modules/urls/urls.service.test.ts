import { UrlsSevices } from "./urls.service.ts";

import type { Urls } from "../../../generated/prisma/client.ts";

const fixedShortCode = "ADc1";

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
  fullURL: "XXXXXXXXXXXXXXXXXXXXXX",
  totalClicks: 0,
};

const mockCreatedUrl = {
  id: "id1",
  ...mockUrlToCreate,
  shortCode: fixedShortCode,
  totalClicks: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUrls: Urls = {
  id: "id1",
  fullURL: "XXXXXXXXXXXXXXXXXXXXXX",
  shortCode: fixedShortCode,
  totalClicks: 0,
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
    generateSpy.mockReturnValue(fixedShortCode);

    mockPrisma.urls.create.mockResolvedValue(mockCreatedUrl);

    const result = await UrlsSevices.create(mockPrisma as any, mockUrlToCreate);

    expect(generateSpy).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockCreatedUrl);
    expect(mockPrisma.urls.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.urls.create).toHaveBeenCalledWith({
      data: {
        fullURL: mockCreatedUrl.fullURL,
        shortCode: mockCreatedUrl.shortCode,
        totalClicks: mockCreatedUrl.totalClicks,
      },
    });

    expect(mockCache.get).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();
  });

  it("should be able a find url by short code by cache", async () => {
    mockCache.get.mockResolvedValue(mockUrls.fullURL);

    const result = await UrlsSevices.findByCode(
      mockPrisma as any,
      mockCache as any,
      fixedShortCode
    );

    expect(result).toEqual(mockUrls.fullURL);
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
      fixedShortCode
    );

    expect(result).toEqual(mockUrls.fullURL);
    expect(mockCache.get).toHaveBeenCalledTimes(1);
    expect(mockCache.set).toHaveBeenCalledTimes(1);
    expect(mockPrisma.urls.findFirst).toHaveBeenCalledTimes(1);
  });
});
