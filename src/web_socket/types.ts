export type ReqMessageDTO<T> = {
  type: string;
  params: T;
};
export type ParramListLastMessage = {
  limit: number;
  page: number;
};

export type ParamsType = ParramListLastMessage;
