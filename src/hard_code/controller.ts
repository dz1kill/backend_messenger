import * as express from "express";
import sequelize from "../models";
import { addSeed } from "./seed";

export async function managmentMigrate(req, res: express.Response) {
  try {
    const { param } = req.body;

    if (param === "undo") {
      await sequelize.sync({ force: false });
      await Promise.all(
        Object.values(sequelize.models).map((model) =>
          model.destroy({ truncate: true, cascade: true })
        )
      );
      return res.status(200).json({
        message: "All migrations undone successfully",
      });
    } else if (param === "start") {
      addSeed();

      return res
        .status(200)
        .json({ message: "Migrations completed successfully" });
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid parameter. Use "undo" or "start"' });
    }
  } catch (error) {
    console.error("Migration error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
      stderr: error.stderr || "",
      stdout: error.stdout || "",
    });
  }
}
