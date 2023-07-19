import { JwtPayload } from "jsonwebtoken";
import {
  addUserInGroup,
  latestMessageDialog,
  latestMessageGroup,
  listLastMessage,
  newGroup,
} from "./service";
import {
  addUserInGroupSchema,
  latestMessagesDialogSchema,
  latestMessagesGroupSchema,
  listLastMessageSchema,
  newGroupSchema,
  validateByZod,
} from "./helper";
import { ParamsType, ReqMessageDTO } from "./types";

export const processor = async (
  parsedMessage: ReqMessageDTO<ParamsType>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>
) => {
  switch (parsedMessage.type) {
    case "listLastMessage":
      validateByZod(parsedMessage, listLastMessageSchema);

      return await listLastMessage(parsedMessage, client);

    case "getlatestMessageDialog":
      validateByZod(parsedMessage, latestMessagesDialogSchema);

      return await latestMessageDialog(parsedMessage, client);

    case "getlatestMessageGroup":
      validateByZod(parsedMessage, latestMessagesGroupSchema);

      return await latestMessageGroup(parsedMessage, client);

    case "newGroup":
      validateByZod(parsedMessage, newGroupSchema);

      return await newGroup(parsedMessage, client);

    case "addUserInGroup":
      validateByZod(parsedMessage, addUserInGroupSchema);

      return addUserInGroup(parsedMessage, client, userConnections);

    default:
      throw { message: "There is no such type" };
  }
};
