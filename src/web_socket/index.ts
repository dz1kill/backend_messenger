import { IncomingMessage } from "http";
import WebSocket from "ws";
import { buildErrorResponse, parseBufferToJson } from "./helper";
import { processor } from "./processor";
import { ParamsType, ReqMessageDTO } from "./types";
import { JwtPayload } from "jsonwebtoken";

const userConnections: Map<JwtPayload, WebSocket> = new Map();

export function connection(
  ws: WebSocket,
  request: IncomingMessage,
  client: JwtPayload
) {
  userConnections.set(client, ws);

  ws.on("message", async (rawMessageBuff: Buffer) => {
    try {
      const parseMessage: ReqMessageDTO<ParamsType> =
        parseBufferToJson(rawMessageBuff);
      await processor(parseMessage, client, userConnections, ws);
    } catch (error) {
      const scope = "processor";
      buildErrorResponse(ws, error, scope);
    }
  });

  ws.on("close", () => {
    userConnections.delete(client);
  });

  ws.on("error", console.error);
}
