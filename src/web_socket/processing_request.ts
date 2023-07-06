import { JwtPayload } from "jsonwebtoken";
import { listLastMessage } from "./service";
import { validlistLastMessage } from "./validationReq";

export const processingRequest = async (parseMessage, client: JwtPayload) => {
  switch (parseMessage.type) {
    case "listLastMessage":
      validlistLastMessage(parseMessage);
      return await listLastMessage(parseMessage, client);
    default:
      console.log("err type");
      break;
  }
};
