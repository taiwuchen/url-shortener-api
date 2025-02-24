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

// Export the DB initialization promise so tests can await for schema readiness.
export const dbReady = initializeDatabase();

if (process.env.NODE_ENV !== "test") {
  dbReady
    .then(() => {
      app.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
    })
    .catch((error) => {
      console.error("Error initializing database schema:", error);
      process.exit(1);
    });
}

export default app;