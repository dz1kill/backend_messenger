import { IncomingMessage } from "http";
import { Server } from "ws";
import * as jwt from "jsonwebtoken";

const connectionsUser = new Map();

export function connection(
  connection: Server,
  request: IncomingMessage,
  client: jwt.JwtPayload
) {
  connectionsUser.set(client, connection);

  connection.on("message", function message(rawMessageBuff) {
    const rawMessage = rawMessageBuff.toString();
    for (const client of connectionsUser.values()) {
      if (client === connection) continue;
      {
        client.send(rawMessage, { binary: false });
      }
    }
  });
  connection.on("close", function () {
    connectionsUser.delete(client);
  });
}
