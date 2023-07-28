import * as express from "express";
import { user } from "./users/routes";
import { auth } from "./auth/router";
import { profile } from "./profile/router";

export const router: express.IRouter = express.Router();
router.use("/users", user);
router.use("/auth", auth);
router.use("/profile", profile);
