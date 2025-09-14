import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(express.json({ limit: "16kb" })); // limit - Optnl.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // serving static files.

app.use(
  // cors config.
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// routes
import healthCheckRouter from "./routes/healthCheck.route.js";
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (_, res) => {
  res.send("Welcome to HomePage ✅");
});

export default app;
