import { ZodTypeAny, z } from "zod";
import {
  ParamsType,
  ParamsBuildSuccessResponse,
  ReqMessageDTO,
  ParramsResultSuccessResponse,
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
  scope: string
) => {
  ws.send(
    JSON.stringify({
      error: true,
      scope,
      message: error?.message,
    })
  );
};

export const buildSuccessResponse = (
  ws: WebSocket,
  result: ParramsResultSuccessResponse,
  type: string
) => {
  ws.send(
    JSON.stringify({
      type,
      success: true,
      params: {
        data: result.data,
        message: result.message,
      },
    })
  );
};
