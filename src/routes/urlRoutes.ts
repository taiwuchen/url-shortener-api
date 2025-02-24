import { Router } from "express";
import shortid from "shortid";
import pool from "../database";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Route to shorten a URL (only accessible to logged-in users)
router.post("/shorten", authMiddleware, async (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = shortid.generate();

  try {
    await pool.query(
      "INSERT INTO urls (short_code, original_url) VALUES ($1, $2)",
      [shortCode, originalUrl]
    );
    res.status(201).json({ shortUrl: `http://localhost:3000/${shortCode}` });
  } catch (error) {
    console.error("Error inserting URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to redirect based on the short code
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );
    if (result.rows.length > 0) {
      const url = result.rows[0];
      
      // Insert an analytics record for this redirect:
      await pool.query(
        "INSERT INTO analytics (url_id, device, os, location) VALUES ($1, $2, $3, $4)",
        [url.id, req.headers["user-agent"] || "unknown", "unknown", "unknown"]
      );

      // Redirect to the original URL
      res.redirect(url.original_url);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error during redirect:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;