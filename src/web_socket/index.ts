import { IncomingMessage } from "http";
import { Server } from "ws";
import * as jwt from "jsonwebtoken";
import { create } from "./dialog/service";

const userConnections = new Map();

export function connection(
  ws: Server,
  request: IncomingMessage,
  client: jwt.JwtPayload
) {
  userConnections.set(client, ws);
  ws.on("message", (rawMessageBuff) => {
    const rawMessage = rawMessageBuff.toString();
    const parseMessage = JSON.parse(rawMessage);
    switch (parseMessage.type) {
      case "createDialog":
        create(parseMessage, client, ws);
        break;
      default:
        console.log("err type");
        break;
    }
  });
  ws.on("close", () => {
    userConnections.delete(client);
  });
}
