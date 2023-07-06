import { ZodTypeAny, z } from "zod";
import { ParamsType, ReqMessageDTO } from "./types";

export const listLastMessageSchema = z.object({
  type: z.string(),
  params: z.object({
    limit: z.number(),
    page: z.number(),
  }),
});

export const parseBufferToJson = (rawMessageBuff: Buffer) => {
  const rawMessage = rawMessageBuff.toString();
  return JSON.parse(rawMessage);
};

export const validateByZod = (
  data: ReqMessageDTO<ParamsType>,
  schema: ZodTypeAny
) => {
  schema.parse(data);
};
