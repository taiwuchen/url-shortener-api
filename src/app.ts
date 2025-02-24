import express from "express";
import { initializeDatabase } from "./database";
import userRoutes from "./routes/userRoutes";
import urlRoutes from "./routes/urlRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
app.use(express.json());

// Mount modular routes
app.use("/", userRoutes);
app.use("/", urlRoutes);
app.use("/", adminRoutes);

initializeDatabase().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

export default app;