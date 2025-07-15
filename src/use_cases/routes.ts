import * as express from "express";

import {
  createGroup,
  findAllUser,
  markAsDeleted,
  searchUserAndGroup,
} from "./controller";
import { authMiddleware } from "../middlewares/auth.middeleware";

export const useСases: express.IRouter = express.Router();
useСases.get("/find-all", findAllUser);
useСases.get("/search", authMiddleware, searchUserAndGroup);
useСases.post("/mark-as-deleted", authMiddleware, markAsDeleted);
useСases.post("/create-group", authMiddleware, createGroup);
