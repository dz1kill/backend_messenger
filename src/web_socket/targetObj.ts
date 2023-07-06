import { z } from "zod";

export const listLastMessageSchema = z.object({
  type: z.string(),
  params: z.object({
    limit: z.number(),
    page: z.number(),
  }),
});
