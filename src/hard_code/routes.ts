import * as express from "express";

import { authMiddleware } from "../middlewares/auth.middeleware";
import { managmentSeed } from "./controller";

export const hardCode: express.IRouter = express.Router();
hardCode.post("/migrate", authMiddleware, managmentSeed);
