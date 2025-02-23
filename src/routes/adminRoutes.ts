import { Router, Request, Response, NextFunction } from "express";
import pool from "../database";

const router = Router();

// Simple middleware to check for admin access using a custom header.
// For demonstration, a request must include header "x-admin-key" with value "secret"
const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers["x-admin-key"] === "secret") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admins only." });
  }
};

// Returns analytics data for shortened URLs.
router.get(
  "/admin/analytics",
  adminAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Example analytic query: total number of URLs shortened.
      const totalResult = await pool.query("SELECT COUNT(*) AS total_urls FROM urls");
      const totalUrls = totalResult.rows[0].total_urls;

      // Dummy responses for additional analytics metrics.
      const analyticsData = {
        totalUrls,
        requestsPerWeek: [
          // In a real system, you would query an analytics table grouping by week.
          { week: "2023-W40", count: 10 },
          { week: "2023-W41", count: 15 }
        ],
        requestsPerMonth: [
          // Similarly, group by month from an analytics table.
          { month: "2023-10", count: 40 }
        ],
        deviceDistribution: {
          desktop: 70,
          mobile: 25,
          tablet: 5
        },
        osDistribution: {
          Windows: 50,
          iOS: 30,
          Android: 20
        },
        geographicalDistribution: {
          USA: 40,
          Canada: 20,
          UK: 15,
          Germany: 10,
          Others: 15
        },
        additionalMetric1: "Example Metric 1 Value",
        additionalMetric2: "Example Metric 2 Value"
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      next(error);
    }
  }
);

export default router;