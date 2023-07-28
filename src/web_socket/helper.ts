import { ZodTypeAny, z } from "zod";
import {
  ParamsType,
  ReqMessageDTO,
  ParramsResultSuccessResponse,
  ParamsBuildSuccessResponse,
  ParamsBuildErroResponse,
} from "./types";
import { UserGroup } from "../models/group_user";
import WebSocket from "ws";

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

export const leaveGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.number(),
  }),
});

export const MessageInGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.number(),
    content: z.string(),
  }),
});

export const privateMessageSchema = z.object({
  type: z.string(),
  params: z.object({
    receiverId: z.number(),
    content: z.string(),
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

export const calcOffset = (page: number, limit: number) => (page - 1) * limit;

export const transformArrUserGroup = (usersInGroup: UserGroup[]) => {
  const userIds = [];
  usersInGroup.forEach((user) => {
    userIds.push(user.userId);
  });
  return userIds;
};

export const buildErrorResponse = (
  ws: WebSocket,
  error: Error,
  type: string
) => {
  const buildResponse: ParamsBuildErroResponse = {
    error: true,
    type,
    message: error?.message,
  };
  ws.send(JSON.stringify(buildResponse));
};

export const buildSuccessResponse = (
  ws: WebSocket,
  params: ParramsResultSuccessResponse,
  type: string
) => {
  const buildResponse: ParamsBuildSuccessResponse = {
    type,
    success: true,
    params: {
      data: params.data || null,
      message: params.message || null,
      senderName: params.senderName || null,
    },
  };
  ws.send(JSON.stringify(buildResponse));
};
