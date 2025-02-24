import { Router, Request, Response, NextFunction } from "express";
import pool from "../database";
import jwt from "jsonwebtoken";

const router = Router();

// User Registration
router.post(
  "/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, adminPassword } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }
    // Reject any attempt to register an admin account
    if (adminPassword) {
      res.status(400).json({ error: "Admin registration is disabled" });
      return;
    }
    try {
      await pool.query(
        "INSERT INTO users (username, password, admin_password) VALUES ($1, $2, NULL)",
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
  "/login", 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, adminPassword } = req.body;
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
        return;
      }

      const user = result.rows[0];
      // Default as regular user
      let isAdmin = false;

      // Check if the user record has an admin password set and if the provided adminPassword matches
      if (user.admin_password !== null && adminPassword) {
        if (adminPassword === user.admin_password) {
          isAdmin = true;
        } else {
          res.status(401).json({ error: "Admin login rejected: Incorrect admin password" });
          return;
        }
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      
      const loginMessage = isAdmin
        ? "Admin logged in successfully"
        : "User logged in successfully";

      res.status(200).json({ message: loginMessage, token });
    } catch (error) {
      console.error("Error logging in:", error);
      next(error);
    }
  }
);

export default router;
