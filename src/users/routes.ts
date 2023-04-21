import * as express from "express";
import { authMiddleware } from "../middlewares/auth.middeleware";
import {
  authorization,
  registration,
  updatePassword,
  updateUser,
  dropUser,
  findAllUser,
} from "./controller";

export const user: express.IRouter = express.Router();

user.post("/registration", registration);
user.post("/authorization", authorization);
user.patch("/update", authMiddleware, updateUser);
user.put("/update-password", authMiddleware, updatePassword);
user.get("/list", authMiddleware, findAllUser);
user.delete("/drop", authMiddleware, dropUser);
