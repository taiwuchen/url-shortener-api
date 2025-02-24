import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }

  try {
    // Ensure you have JWT_SECRET set in your .env file.
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    // Attach user data to the request (e.g., req.user)
    req.user = payload as string | jwt.JwtPayload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};