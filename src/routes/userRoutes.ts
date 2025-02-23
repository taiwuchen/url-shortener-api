import { Router, Request, Response, NextFunction } from "express";
import pool from "../database";

const router = Router();

// User Registration
router.post(
  "/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }
    try {
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, password]
      );
      res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
      console.error("Error registering user:", error);
      // Handle duplicate username error (PostgreSQL error code 23505)
      if (error.code === "23505") {
        res.status(400).json({ error: "Username already exists" });
      } else {
        next(error);
      }
    }
  }
);

// User Login
router.post(
  "/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );
      if (result.rows.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
      } else {
        res.status(200).json({ message: "User logged in successfully" });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      next(error);
    }
  }
);

export default router;
