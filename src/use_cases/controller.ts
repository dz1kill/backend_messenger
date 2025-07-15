import { User } from "../models/user";
import * as express from "express";
import { findUserAndGroup, markMessageAsDeleted, newGroup } from "./service";

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

export async function markAsDeleted(req, res: express.Response) {
  try {
    const { id } = req.user;
    const { companionId } = req.body;
    const result = await markMessageAsDeleted(id, companionId);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function createGroup(req, res: express.Response) {
  try {
    const { id } = req.user;
    const { groupName, groupId, notificationMessage, messageId } = req.body;
    const result = await newGroup(
      id,
      groupName,
      groupId,
      notificationMessage,
      messageId
    );

    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}
