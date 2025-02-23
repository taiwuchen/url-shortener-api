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
      // Total requests logged in analytics
      const totalResult = await pool.query("SELECT COUNT(*) AS total_requests FROM analytics");
      const totalRequests = totalResult.rows[0].total_requests;

      // Requests per week
      const weekResult = await pool.query(
        `SELECT date_trunc('week', request_time) AS week, COUNT(*) AS count 
         FROM analytics 
         GROUP BY week 
         ORDER BY week`
      );
      const requestsPerWeek = weekResult.rows.map(row => ({
        week: row.week,
        count: Number(row.count)
      }));

      // Requests per month
      const monthResult = await pool.query(
        `SELECT date_trunc('month', request_time) AS month, COUNT(*) AS count 
         FROM analytics 
         GROUP BY month 
         ORDER BY month`
      );
      const requestsPerMonth = monthResult.rows.map(row => ({
        month: row.month,
        count: Number(row.count)
      }));

      // Device distribution
      const deviceResult = await pool.query(
        `SELECT device, COUNT(*) AS count 
         FROM analytics 
         GROUP BY device`
      );
      const deviceDistribution: Record<string, number> = {};
      deviceResult.rows.forEach(row => {
        deviceDistribution[row.device || "unknown"] = Number(row.count);
      });

      // OS distribution
      const osResult = await pool.query(
        `SELECT os, COUNT(*) AS count 
         FROM analytics 
         GROUP BY os`
      );
      const osDistribution: Record<string, number> = {};
      osResult.rows.forEach(row => {
        osDistribution[row.os || "unknown"] = Number(row.count);
      });

      // Geographical distribution
      const geoResult = await pool.query(
        `SELECT location, COUNT(*) AS count 
         FROM analytics 
         GROUP BY location`
      );
      const geographicalDistribution: Record<string, number> = {};
      geoResult.rows.forEach(row => {
        geographicalDistribution[row.location || "unknown"] = Number(row.count);
      });

      // Additional metric example: Top 5 shortened URLs by request count
      const topUrlsResult = await pool.query(
        `SELECT u.short_code, COUNT(a.id) AS count 
         FROM analytics a 
         JOIN urls u ON a.url_id = u.id 
         GROUP BY u.short_code 
         ORDER BY count DESC 
         LIMIT 5`
      );

      const analyticsData = {
        totalRequests,
        requestsPerWeek,
        requestsPerMonth,
        deviceDistribution,
        osDistribution,
        geographicalDistribution,
        topUrls: topUrlsResult.rows,
};
      

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      next(error);
    }
  }
);

export default router;