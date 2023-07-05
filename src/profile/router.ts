import * as express from "express";
import { authMiddleware } from "../middlewares/auth.middeleware";
import { updatePassword, updateUser, dropUser } from "./controller";

export const profile: express.IRouter = express.Router();

profile.patch("/update", authMiddleware, updateUser);
profile.patch("/change-password", authMiddleware, updatePassword);
profile.delete("/destroy", authMiddleware, dropUser);
