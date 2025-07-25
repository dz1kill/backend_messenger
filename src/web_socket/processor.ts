import { JwtPayload } from "jsonwebtoken";
import WebSocket from "ws";
import {
  addUserInGroup,
  deleteGroup,
  latestMessageDialog,
  latestMessageGroup,
  leaveGroup,
  listLastMessage,
  sendMessageGroup,
  sendPrivateMessage,
} from "./service";
import {
  MessageInGroupSchema,
  addUserInGroupSchema,
  buildErrorResponse,
  buildSuccessResponse,
  dropGroupSchema,
  latestMessagesDialogSchema,
  latestMessagesGroupSchema,
  leaveGroupSchema,
  listLastMessageSchema,
  privateMessageSchema,
  validateByZod,
} from "./helper";
import { ParamsType, ReqMessageDTO } from "./types";
import {
  ADD_USER_IN_GROUP,
  DROP_GROUP,
  GET_LATEST_MESSAGE_DIALOG,
  GET_LATEST_MESSAGE_GROUP,
  LEAVE_GROUP,
  LIST_LAST_MESSAGE,
  MESSAGE_IN_GROUP,
  PRIVATE_MESSAGE,
} from "./constants";

export const processor = async (
  parsedMessage: ReqMessageDTO<ParamsType>,
  client: JwtPayload,
  userConnections: Map<JwtPayload, WebSocket>,
  ws: WebSocket
) => {
  switch (parsedMessage.type) {
    case LIST_LAST_MESSAGE:
      try {
        validateByZod(parsedMessage, listLastMessageSchema);
        const result = await listLastMessage(parsedMessage, client);
        buildSuccessResponse(ws, result, LIST_LAST_MESSAGE);
      } catch (error) {
        buildErrorResponse(ws, error, LIST_LAST_MESSAGE);
      }
      break;

    case GET_LATEST_MESSAGE_DIALOG:
      try {
        validateByZod(parsedMessage, latestMessagesDialogSchema);
        const result = await latestMessageDialog(parsedMessage, client);
        buildSuccessResponse(ws, result, GET_LATEST_MESSAGE_DIALOG);
      } catch (error) {
        buildErrorResponse(ws, error, GET_LATEST_MESSAGE_DIALOG);
      }
      break;

    case GET_LATEST_MESSAGE_GROUP:
      try {
        validateByZod(parsedMessage, latestMessagesGroupSchema);

        const result = await latestMessageGroup(parsedMessage, client);

        buildSuccessResponse(ws, result, GET_LATEST_MESSAGE_GROUP);
      } catch (error) {
        buildErrorResponse(ws, error, GET_LATEST_MESSAGE_GROUP);
      }
      break;

    case ADD_USER_IN_GROUP:
      try {
        validateByZod(parsedMessage, addUserInGroupSchema);
        const result = await addUserInGroup(
          parsedMessage,
          client,
          userConnections
        );
        buildSuccessResponse(ws, result, ADD_USER_IN_GROUP);
      } catch (error) {
        buildErrorResponse(ws, error, ADD_USER_IN_GROUP);
      }

      break;

    case LEAVE_GROUP:
      try {
        validateByZod(parsedMessage, leaveGroupSchema);
        const result = await leaveGroup(parsedMessage, client, userConnections);
        buildSuccessResponse(ws, result, LEAVE_GROUP);
      } catch (error) {
        buildErrorResponse(ws, error, LEAVE_GROUP);
      }
      break;

    case MESSAGE_IN_GROUP:
      try {
        validateByZod(parsedMessage, MessageInGroupSchema);
        const result = await sendMessageGroup(
          parsedMessage,
          client,
          userConnections
        );
        buildSuccessResponse(ws, result, MESSAGE_IN_GROUP);
      } catch (error) {
        buildErrorResponse(ws, error, MESSAGE_IN_GROUP);
      }

      break;

    case PRIVATE_MESSAGE:
      try {
        validateByZod(parsedMessage, privateMessageSchema);
        const result = await sendPrivateMessage(
          parsedMessage,
          client,
          userConnections
        );
        buildSuccessResponse(ws, result, PRIVATE_MESSAGE);
      } catch (error) {
        buildErrorResponse(ws, error, PRIVATE_MESSAGE);
      }

      break;

    case DROP_GROUP:
      try {
        validateByZod(parsedMessage, dropGroupSchema);
        const result = await deleteGroup(
          parsedMessage,
          client,
          userConnections
        );
        buildSuccessResponse(ws, result, DROP_GROUP);
      } catch (error) {
        buildErrorResponse(ws, error, DROP_GROUP);
      }

      break;

    default:
      throw { message: "There is no such type" };
  }
};
