import * as express from "express";
import { useСases } from "./use_cases/routes";
import { auth } from "./auth/router";
import { profile } from "./profile/router";
import { hardCode } from "./hard_code/routes";

export const router: express.IRouter = express.Router();
router.use("/use-cases", useСases);
router.use("/auth", auth);
router.use("/profile", profile);
router.use("/hard-code", hardCode);
