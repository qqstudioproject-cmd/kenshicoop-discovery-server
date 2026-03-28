const DEFAULT_PORT = 3000;
const DEFAULT_WORLD_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const DEFAULT_CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_LAUNCHER_MANIFEST_VERSION = "1.0.0";
const DEFAULT_LAUNCHER_BASE_URL = "https://serv.qqstudio.pro/uploads/";
const DEFAULT_LAUNCHER_UPLOADS_DIR = "uploads";

function parsePositiveInt(value, fallbackValue) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallbackValue;
  }

  return parsed;
}

function parseNonEmptyString(value, fallbackValue) {
  if (typeof value !== "string") {
    return fallbackValue;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return fallbackValue;
  }

  return trimmed;
}

const env = {
  port: parsePositiveInt(process.env.PORT, DEFAULT_PORT),
  worldTtlMs: parsePositiveInt(process.env.WORLD_TTL_MS, DEFAULT_WORLD_TTL_MS),
  cleanupIntervalMs: parsePositiveInt(
    process.env.CLEANUP_INTERVAL_MS,
    DEFAULT_CLEANUP_INTERVAL_MS
  ),
  nodeEnv: process.env.NODE_ENV || "development",
  launcherManifestVersion: parseNonEmptyString(
    process.env.LAUNCHER_MANIFEST_VERSION,
    DEFAULT_LAUNCHER_MANIFEST_VERSION
  ),
  launcherBaseUrl: parseNonEmptyString(
    process.env.LAUNCHER_BASE_URL,
    DEFAULT_LAUNCHER_BASE_URL
  ),
  launcherUploadsDir: parseNonEmptyString(
    process.env.LAUNCHER_UPLOADS_DIR,
    DEFAULT_LAUNCHER_UPLOADS_DIR
  )
};

module.exports = env;
