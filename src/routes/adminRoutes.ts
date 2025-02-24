import { Router, Request, Response, NextFunction } from "express";
import pool from "../database";
import { authMiddleware } from "../middleware/authMiddleware";
import { JwtPayload } from "jsonwebtoken";

const router = Router();

// Admin authorization middleware using JWT payload
const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as JwtPayload;
  if (user && user.isAdmin) {
    return next();
  } else {
    res.status(403).json({ error: "Forbidden: Admins only." });
    return;
  }
};

// Protect the admin analytics endpoint with both JWT and admin check.
router.get(
  "/admin/analytics",
  authMiddleware,
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

      // Additional Metric 1: Top 5 shortened URLs by request count
      const topUrlsResult = await pool.query(
        `SELECT u.short_code, COUNT(a.id) AS count 
         FROM analytics a 
         JOIN urls u ON a.url_id = u.id 
         GROUP BY u.short_code 
         ORDER BY count DESC 
         LIMIT 5`
      );

      // Additional Metric 2: Average requests per shortened URL
      const avgResult = await pool.query(
        `SELECT AVG(url_counts.count)::numeric(10,2) AS average_requests
         FROM (
           SELECT COUNT(*) AS count 
           FROM analytics 
           GROUP BY url_id
         ) AS url_counts`
      );
      const averageRequests = avgResult.rows[0]?.average_requests || 0;

      const analyticsData = {
        totalRequests,
        requestsPerWeek,
        requestsPerMonth,
        deviceDistribution,
        osDistribution,
        geographicalDistribution,
        topUrls: topUrlsResult.rows,
        averageRequests
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      next(error);
    }
  }
);

export default router;