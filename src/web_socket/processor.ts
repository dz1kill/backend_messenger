import { JwtPayload } from "jsonwebtoken";
import WebSocket from "ws";
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
  userConnections: Map<JwtPayload, WebSocket>,
  ws: WebSocket
) => {
  switch (parsedMessage.type) {
    case "listLastMessage":
      try {
        validateByZod(parsedMessage, listLastMessageSchema);
        const result = await listLastMessage(parsedMessage, client);
        ws.send(
          JSON.stringify({
            messages: result.messages,
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            error: error.message || "processor.listLastMessage error",
          })
        );
      }

    case "getlatestMessageDialog":
      try {
        validateByZod(parsedMessage, latestMessagesDialogSchema);
        const result = await latestMessageDialog(parsedMessage, client);
        ws.send(
          JSON.stringify({
            messages: result.messages,
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            error: error.message || "processor.getlatestMessageDialog error",
          })
        );
      }

    case "getlatestMessageGroup":
      try {
        validateByZod(parsedMessage, latestMessagesGroupSchema);
        const result = await latestMessageGroup(parsedMessage, client);
        ws.send(
          JSON.stringify({
            messages: result.messages,
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            error: error.message || "processor.getlatestMessageGroup error",
          })
        );
      }

    case "newGroup":
      try {
        validateByZod(parsedMessage, newGroupSchema);
        const result = await newGroup(parsedMessage, client);
        ws.send(
          JSON.stringify({
            messages: result.messages,
          })
        );
      } catch (error) {
        ws.send(
          JSON.stringify({
            error: error.message || "processor.newGroup error",
          })
        );
      }

    case "addUserInGroup":
      try {
        validateByZod(parsedMessage, addUserInGroupSchema);
        addUserInGroup(parsedMessage, client, userConnections);
      } catch (error) {
        ws.send(
          JSON.stringify({
            error: error.message || "processor.addUserInGroup error",
          })
        );
      }

    default:
      throw { message: "There is no such type" };
  }
};
