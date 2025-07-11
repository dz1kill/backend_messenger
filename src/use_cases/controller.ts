import { User } from "../models/user";
import * as express from "express";
import { findUserAndGroup } from "./service";

export async function findAllUser(req, res: express.Response) {
  try {
    const result = await User.findAll();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function searchUserAndGroup(req, res: express.Response) {
  try {
    const { id } = req.user;
    const { searchText } = req.query;
    const result = await findUserAndGroup(id, searchText);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}
