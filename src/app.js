const express = require("express");
const path = require("path");

const env = require("./config/env");
const registryService = require("./services/registryService");
const worldsRoutes = require("./routes/worldsRoutes");
const worldsController = require("./controllers/worldsController");
const launcherRoutes = require("./routes/launcherRoutes");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).json({
      name: "kenshicoop-discovery-server",
      version: "0.1.0",
      status: "ok",
      message: "KenshiCoop discovery registry is running"
    });
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "kenshicoop-discovery-server",
      version: "0.1.0",
      environment: env.nodeEnv
    });
  });

  app.get("/registry/status", (req, res) => {
    res.status(200).json({
      status: "ok",
      worldCount: registryService.getWorldCount(),
      worldTtlMs: env.worldTtlMs,
      worldTtlDays: Number((env.worldTtlMs / (24 * 60 * 60 * 1000)).toFixed(2)),
      cleanupIntervalMs: env.cleanupIntervalMs
    });
  });

  app.get("/registry/debug", worldsController.getRegistryDebugInfo);

  app.use("/worlds", worldsRoutes);

  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.use("/launcher", launcherRoutes);

  app.use((req, res) => {
    res.status(404).json({
      status: "error",
      error: "NotFound",
      message: "Route not found"
    });
  });

  app.use((err, req, res, next) => {
    console.error("[DiscoveryServer] Unhandled error:", err);

    res.status(500).json({
      status: "error",
      error: "InternalServerError",
      message: "Unexpected server error"
    });
  });

  return app;
}

module.exports = createApp;
