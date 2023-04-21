import * as express from "express";
import { user } from "./users/routes";

export const router: express.IRouter = express.Router();
router.use("/user", user);
