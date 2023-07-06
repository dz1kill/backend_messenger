import { IncomingMessage } from "http";
import * as jwt from "jsonwebtoken";
import WebSocket from "ws";
import { parseBufferToJson } from "./helper";
import { processingRequest } from "./processing_request";
import { addAllGroupUser } from "./service";

const userConnections = new Map();

export function connection(
  ws: WebSocket,
  request: IncomingMessage,
  client: jwt.JwtPayload
) {
  userConnections.set(ws, client);
  addAllGroupUser(client);
  ws.on("message", async (rawMessageBuff: Buffer) => {
    try {
      const parseMessage: Object = parseBufferToJson(rawMessageBuff);
      const result = await processingRequest(parseMessage, client);
      ws.send(
        JSON.stringify({
          statusCode: result.statusCode || 500,
          messages: result.messages,
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          statusCode: error.statusCode || 500,
          messages: error.message || "Server error",
        })
      );
    }
  });
  ws.on("close", () => {
    userConnections.delete(ws);
  });
  ws.on("error", console.error);
}
