import { User } from "../models/user";
import * as jwt from "jsonwebtoken";

export async function addCientGroup(userConnections, ws, clientId: number) {
  const userGroup = await User.findOne({ where: { id: clientId } });
}
