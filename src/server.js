const http = require("http");
const createApp = require("./app");
const env = require("./config/env");
const cleanupService = require("./services/cleanupService");

const app = createApp();
const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(
    `[DiscoveryServer] Listening on port ${env.port} | env=${env.nodeEnv}`
  );

  cleanupService.startCleanupLoop();
});

server.on("error", (error) => {
  console.error("[DiscoveryServer] Server startup error:", error);
  process.exit(1);
});

function shutdown(signal) {
  console.log(`[DiscoveryServer] Shutdown requested | signal=${signal}`);

  cleanupService.stopCleanupLoop();

  server.close((error) => {
    if (error) {
      console.error("[DiscoveryServer] Shutdown error:", error);
      process.exit(1);
    }

    console.log("[DiscoveryServer] Shutdown complete");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
