import { Message } from "../models/message";

export type ReqMessageDTO<T> = {
  type: string;
  params: T;
};
export type ParramListLastMessage = {
  limit: number;
  page: number;
};

export type ParramLastMessagesDialog = {
  receiverId: number;
  limit: number;
  page: number;
};

export type ParramLastMessagesGroup = {
  groupId: number;
  limit: number;
  page: number;
};

export type ParramNewGroup = {
  groupName: string;
};

export type ParramAddUserInGroup = {
  userId: number;
  groupId: number;
};

export type ParramLeaveGroup = {
  groupId: number;
};

export type ParramMessageGroup = {
  groupId: number;
  content: string;
};

export type ParamsType = ParramListLastMessage &
  ParramLastMessagesDialog &
  ParramLastMessagesGroup &
  ParramNewGroup &
  ParramAddUserInGroup &
  ParramMessageGroup;

export type ParamsbuildSuccessResponse = {
  messages: string | Message[];
};
