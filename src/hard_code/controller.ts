import { exec } from "child_process";
import { promisify } from "util";
import * as express from "express";

const execAsync = promisify(exec);

export async function managmentMigrate(req, res: express.Response) {
  try {
    const { param } = req.body;

    if (param === "undo") {
      const { stdout, stderr } = await execAsync(
        "npx sequelize-cli db:migrate:undo:all"
      );
      if (stderr) console.error("Undo all migrations error:", stderr);
      return res.status(200).json({
        message: "All migrations undone successfully",
        output: stdout,
      });
    } else if (param === "start") {
      const { stdout, stderr } = await execAsync(
        "npx sequelize-cli db:migrate"
      );
      return res
        .status(200)
        .json({ message: "Migrations completed successfully", output: stdout });
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
