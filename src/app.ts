import express from "express";
import shortid from "shortid";

const app = express();
app.use(express.json());

app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = shortid.generate();
  res.status(201).json({ shortUrl: `http://localhost:3000/${shortCode}` });
});

app.get("/:shortCode", (req, res) => {
  res.redirect("http://www.taiwuchen.com"); // Just for testing now...
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;