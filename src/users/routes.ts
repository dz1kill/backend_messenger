import * as express from "express";

import { findAllUser } from "./controller";

export const user: express.IRouter = express.Router();
user.get("/list", findAllUser);
