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
  message: string;
  messageId: string;
  groupName: string;
};

export type ParramMessageGroup = {
  messageId: string;
  groupId: string;
  content: string;
  groupName: string;
};

export type ParramPrivateMessage = {
  messageId: string;
  receiverId: string;
  content: string;
};

export type ParamsType = ParramListLastMessage &
  ParramLastMessagesDialog &
  ParramLastMessagesGroup &
  ParramNewGroup &
  ParramAddUserInGroup &
  ParramMessageGroup &
  ParramPrivateMessage &
  ParramLeaveGroup;

export interface ResDataListLastMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  receiverId: string | null;
  receiverName: string | null;
  groupId: string | null;
  groupName: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ResDatalatestMessageDialog {
  messageId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
}

export interface ResDataLatestMessageGroup {
  messageId: string;
  senderId: string;
  senderName: string;
  groupId: string;
  groupName: string;
  content: string;
  createdAt: string;
}

export interface ResItemPrivateMessage {
  messageId: string;
  message: string;
  senderName: string;
  senderId: string;
  createdAt: string;
}

export interface ResItemGroupMessage {
  groupId: string;
  groupName: string;
  messageId: string;
  message: string;
  senderName: string;
  senderLastName: string;
  senderId: string;
  createdAt: string;
}

type MessageData =
  | ResDataListLastMessage[]
  | ResDatalatestMessageDialog[]
  | ResDataLatestMessageGroup[];

type MessageItem = ResItemPrivateMessage | ResItemGroupMessage | {};

export type ParramsResultSuccessResponse = {
  item?: MessageItem | null;
  data?: MessageData | null;
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
