import * as express from "express";

import { authMiddleware } from "../middlewares/auth.middeleware";
import { managmentMigrate } from "./controller";

export const hardCode: express.IRouter = express.Router();
hardCode.post("/migrate", authMiddleware, managmentMigrate);
