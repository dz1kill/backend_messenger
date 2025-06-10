import * as config from "config";
import * as jwt from "jsonwebtoken";
import { wss } from "../index";
import { IncomingMessage } from "http";
import stream from "stream";

export const authMiddlewareWs = (
  request: IncomingMessage,
  socket: stream.Duplex,
  head: Buffer
) => {
  try {
    let token = null;
    if (request.headers.authorization) {
      const parts = request.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
    if (!token && request.headers["sec-websocket-protocol"]) {
      const protocols = request.headers["sec-websocket-protocol"];
      const protocolParts = protocols.split(",").map((p) => p.trim());
      if (protocolParts.length >= 2) {
        token = protocolParts[1];
      }
    }
    const data = jwt.verify(token, config.get("JWT.key"));
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, data);
    });
  } catch (err) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.close(4001, `${err.message}`);
    });
  }
};
