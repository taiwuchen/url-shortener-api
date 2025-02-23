import { Router } from "express";
import shortid from "shortid";
import pool from "../database";

const router = Router();

// Route to shorten a URL
router.post("/shorten", async (req, res) => {
  const { originalUrl, userId } = req.body;
  const shortCode = shortid.generate();

  try {
    await pool.query(
      "INSERT INTO urls (short_code, original_url, user_id) VALUES ($1, $2, $3)",
      [shortCode, originalUrl, userId]
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
      "SELECT original_url FROM urls WHERE short_code = $1",
      [shortCode]
    );
    if (result.rows.length > 0) {
      const originalUrl = result.rows[0].original_url;
      res.redirect(originalUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error retrieving URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;