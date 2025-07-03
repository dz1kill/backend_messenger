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
    cursorCreatedAt: z.string().nullable(),
  }),
});

export const latestMessagesDialogSchema = z.object({
  type: z.string(),
  params: z.object({
    receiverId: z.string().uuid(),
    limit: z.number(),
    cursorCreatedAt: z.string().nullable(),
  }),
});

export const latestMessagesGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.string().uuid(),
    limit: z.number(),
    cursorCreatedAt: z.string().nullable(),
  }),
});

export const newGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.string().uuid(),
    groupName: z.string(),
  }),
});

export const addUserInGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

export const leaveGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    groupId: z.string().uuid(),
  }),
});

export const MessageInGroupSchema = z.object({
  type: z.string(),
  params: z.object({
    messageId: z.string().uuid(),
    groupId: z.string().uuid(),
    content: z.string(),
  }),
});

export const privateMessageSchema = z.object({
  type: z.string(),
  params: z.object({
    messageId: z.string().uuid(),
    receiverId: z.string().uuid(),
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
      item: params.item || null,
      data: params.data || null,
      isBroadcast: params.isBroadcast || false,
    },
  };
  ws.send(JSON.stringify(buildResponse));
};
