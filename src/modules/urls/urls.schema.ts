const urlResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    fullURL: { type: "string" },
    shortCode: { type: "string" },
    totalClicks: { type: "number" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};

export const postUrlSchema = {
  body: {
    type: "object",
    required: ["fullURL"],
    properties: {
      fullURL: { type: "string" },
    },
  },
  response: {
    201: urlResponseSchema,
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getUrlSchema = {
  params: {
    type: "object",
    required: ["shortCode"],
    properties: {
      shortCode: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        fullURL: { type: "string" },
      },
    },
  },
};
