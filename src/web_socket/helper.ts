import { ZodTypeAny, z } from "zod";
import { ParamsType, ReqMessageDTO } from "./types";

export const listLastMessageSchema = z.object({
  type: z.string(),
  params: z.object({
    limit: z.number(),
    page: z.number(),
  }),
});

export const latestMessagesDialogSchema = z.object({
  type: z.string(),
  params: z.object({
    receiverId: z.number(),
    limit: z.number(),
    page: z.number(),
  }),
});

export const latestMessagesGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.number(),
    limit: z.number(),
    page: z.number(),
  }),
});

export const newGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupName: z.string(),
  }),
});

export const addUserInGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.number(),
    userId: z.number(),
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
