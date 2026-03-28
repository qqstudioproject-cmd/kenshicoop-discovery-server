const DEFAULT_PORT = 3000;
const DEFAULT_WORLD_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEFAULT_CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function parsePositiveInt(value, fallbackValue) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallbackValue;
  }

  return parsed;
}

const env = {
  port: parsePositiveInt(process.env.PORT, DEFAULT_PORT),
  worldTtlMs: parsePositiveInt(process.env.WORLD_TTL_MS, DEFAULT_WORLD_TTL_MS),
  cleanupIntervalMs: parsePositiveInt(
    process.env.CLEANUP_INTERVAL_MS,
    DEFAULT_CLEANUP_INTERVAL_MS
  ),
  nodeEnv: process.env.NODE_ENV || "development"
};

module.exports = env;
