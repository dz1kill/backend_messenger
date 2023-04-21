import * as config from "config";
import * as jwt from "jsonwebtoken";
import { wss } from "../index";
import { IncomingMessage } from "http";
import stream from "stream";

export function authMiddlewareWs(
  request: IncomingMessage,
  socket: stream.Duplex,
  head: Buffer
) {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, config.get("JWT.key"));
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, data);
    });
  } catch (e) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
}
