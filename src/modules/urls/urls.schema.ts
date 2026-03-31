import { z } from "zod";

const urlResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.uuidv4(),
    full_url: z.url(),
    slug: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export const postUrlSchema = {
  body: z.object({
    full_url: z.url({ error: "Informe o campo com uma url válida!" }),
    slug: z
      .string({ error: "Informe o campo em formato de string" })
      .optional(),
  }),
  response: {
    201: urlResponseSchema,
    400: z.object({
      success: z.boolean(),
      message: z.string(),
      fields: z.array(
        z.object({
          field: z.string(),
          message: z.string(),
        }),
      ),
    }),
  },
};

export const putUrlSchema = {
  params: z.object({
    urlId: z.string(),
  }),
  body: z.object(
    {
      full_url: z.url("Informe uma url valida!").optional(),
      slug: z.string().optional(),
    },
    "Informe o body!",
  ),
  response: {
    200: urlResponseSchema,
    400: z.object({
      error: z.string(),
    }),
  },
};

export const getUrlSchema = {
  params: z.object({
    slug: z.string(),
  }),
  response: {
    301: z.object({
      fullURL: z.string(),
    }),
  },
};

export const deleteUrlSchema = {
  params: z.object({
    urlId: z.string(),
  }),
};
