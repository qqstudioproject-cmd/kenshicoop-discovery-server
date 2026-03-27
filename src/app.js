const express = require("express");
const env = require("./config/env");
const registryService = require("./services/registryService");

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
      ttlMs: env.worldTtlMs,
      cleanupIntervalMs: env.cleanupIntervalMs
    });
  });

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
