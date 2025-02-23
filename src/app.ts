import express from "express";
import shortid from "shortid";
import pool from './database';
import { initializeDatabase } from './database';

const app = express();
app.use(express.json());

// Route to shorten a URL
app.post("/shorten", async (req, res) => {
  const { originalUrl, userId } = req.body; // Extracting originalUrl and userId from the request body
  const shortCode = shortid.generate();

  try {
    await pool.query(
      // Inserting into the database
      `INSERT INTO urls (short_code, original_url, user_id) VALUES ($1, $2, $3)`,
      [shortCode, originalUrl, userId]
    );
    res.status(201).json({ shortUrl: `http://localhost:3000/${shortCode}` });
  } catch (error) {
    console.error('Error inserting URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to redirect to the original URL based on the short code
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params; // Access route parameters defined in the URL path

  try {
    const result = await pool.query(
      `SELECT original_url FROM urls WHERE short_code = $1`,
      [shortCode]
    );
    if (result.rows.length > 0) {
      const originalUrl = result.rows[0].original_url;
      res.redirect(originalUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error('Error retrieving URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

initializeDatabase().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});

export default app;