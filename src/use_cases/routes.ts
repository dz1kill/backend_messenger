import * as express from "express";

import {
  createGroup,
  markAsDeleted,
  searchUserAndGroup,
  searchUsers,
} from "./controller";
import { authMiddleware } from "../middlewares/auth.middeleware";

export const useСases: express.IRouter = express.Router();
useСases.get("/search", authMiddleware, searchUserAndGroup);
useСases.post("/mark-as-deleted", authMiddleware, markAsDeleted);
useСases.post("/create-group", authMiddleware, createGroup);
useСases.get("/search-users", authMiddleware, searchUsers);
