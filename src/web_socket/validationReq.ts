import { listLastMessageSchema } from "./targetObj";
import { ParramListLastMessage, ReqMessageDTO } from "./type";

export const validlistLastMessage = (
  parseMessage: ReqMessageDTO<ParramListLastMessage>
) => {
  const resultValid = listLastMessageSchema.safeParse(parseMessage);

  if (resultValid.success === false) {
    throw { message: resultValid.error.issues, statusCode: 400 };
  }
};
