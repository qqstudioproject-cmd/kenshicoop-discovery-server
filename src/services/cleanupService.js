const env = require("../config/env");
const registryService = require("./registryService");

let cleanupTimer = null;

function startCleanupLoop() {
  if (cleanupTimer !== null) {
    console.log("[DiscoveryServer] Cleanup loop already running");
    return;
  }

  cleanupTimer = setInterval(() => {
    const removed = registryService.pruneStaleWorlds(env.worldTtlMs);

    if (removed.length > 0) {
      console.log(
        `[DiscoveryServer] Cleanup removed ${removed.length} stale world(s)`
      );
    }
  }, env.cleanupIntervalMs);

  console.log(
    `[DiscoveryServer] Cleanup loop started | ttlMs=${env.worldTtlMs} | intervalMs=${env.cleanupIntervalMs}`
  );
}

function stopCleanupLoop() {
  if (cleanupTimer === null) {
    return;
  }

  clearInterval(cleanupTimer);
  cleanupTimer = null;

  console.log("[DiscoveryServer] Cleanup loop stopped");
}

module.exports = {
  startCleanupLoop,
  stopCleanupLoop
};
