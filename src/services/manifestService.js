const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const env = require("../config/env");

const uploadsRoot = path.resolve(process.cwd(), "uploads");

function hashFileSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

function walkRecursive(currentDir, baseDir, results) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      walkRecursive(fullPath, baseDir, results);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const stats = fs.statSync(fullPath);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    results.push({
      Path: relativePath,
      Hash: hashFileSha256(fullPath),
      Size: stats.size
    });
  }
}

function buildManifest() {
  const files = [];

  if (!fs.existsSync(uploadsRoot)) {
    return {
      Version: env.launcherManifestVersion,
      BaseUrl: env.launcherBaseUrl,
      Files: []
    };
  }

  walkRecursive(uploadsRoot, uploadsRoot, files);

  files.sort((a, b) => a.Path.localeCompare(b.Path));

  return {
    Version: env.launcherManifestVersion,
    BaseUrl: env.launcherBaseUrl,
    Files: files
  };
}

module.exports = {
  buildManifest
};
