import { User } from "../models/user";
import * as express from "express";

export async function findAllUser(req, res: express.Response) {
  try {
    const result = await User.findAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message || "Server error");
  }
}
