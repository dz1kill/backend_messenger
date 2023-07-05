import { IncomingMessage } from "http";
import { Server } from "ws";
import * as jwt from "jsonwebtoken";
import { addCientGroup } from "./helper";

const userConnections = new Map();

export function connection(
  ws: Server,
  request: IncomingMessage,
  client: jwt.JwtPayload
) {
  userConnections.set(ws, client);
  addCientGroup(userConnections, ws, client.id);
  ws.on("message", (rawMessageBuff) => {
    const rawMessage = rawMessageBuff.toString();
    const parseMessage = JSON.parse(rawMessage);
    switch (parseMessage.type) {
      case "createDialog":
        break;
      default:
        console.log("err type");
        break;
    }
  });
  ws.on("close", () => {
    userConnections.delete(ws);
  });
}
