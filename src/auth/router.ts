import * as express from "express";
import { authorization, registration } from "./controller";

export const auth: express.IRouter = express.Router();

auth.post("/sing-up", registration);
auth.post("/login", authorization);
