import { Message } from "../models/message";

export type ReqMessageDTO<T> = {
  type: string;
  params: T;
};
export type ParramListLastMessage = {
  limit: number;
  cursorCreatedAt: string | null;
};

export type ParramLastMessagesDialog = {
  receiverId: string;
  limit: number;
  cursorCreatedAt: string;
};

export type ParramLastMessagesGroup = {
  groupId: string;
  limit: number;
  cursorCreatedAt: string;
};

export type ParramNewGroup = {
  groupName: string;
  groupId: string;
};

export type ParramAddUserInGroup = {
  userId: string;
  groupId: string;
};

export type ParramLeaveGroup = {
  groupId: string;
};

export type ParramMessageGroup = {
  messageId: string;
  groupId: string;
  content: string;
};

export type ParramPrivateMessage = {
  messageId: string;
  receiverId: string;
  content: string;
};

type ParramsResData = Message[];

export type ParamsType = ParramListLastMessage &
  ParramLastMessagesDialog &
  ParramLastMessagesGroup &
  ParramNewGroup &
  ParramAddUserInGroup &
  ParramMessageGroup &
  ParramPrivateMessage;

export type ParramsResultSuccessResponse = {
  item?: {} | null;
  data?: ParramsResData | null;
  isBroadcast?: boolean;
};

export type ParamsBuildSuccessResponse = {
  type: string;
  success: true;
  params: ParramsResultSuccessResponse;
};

export type ParamsBuildErroResponse = {
  error: true;
  type: string;
  message: string;
};
