import { JwtPayload } from "jsonwebtoken";
import { listLastMessage } from "./service";
import { listLastMessageSchema, validateByZod } from "./helper";
import { ParamsType, ReqMessageDTO } from "./types";

export const processor = async (
  parsedMessage: ReqMessageDTO<ParamsType>,
  client: JwtPayload
) => {
  switch (parsedMessage.type) {
    case "listLastMessage":
      validateByZod(parsedMessage, listLastMessageSchema);

      return await listLastMessage(parsedMessage, client);

    default:
      throw { message: "Type error" };
  }
};
