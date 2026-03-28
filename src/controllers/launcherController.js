const manifestService = require("../services/manifestService");

function getManifest(req, res) {
  try {
    const manifest = manifestService.buildManifest();

    return res.status(200).json(manifest);
  } catch (error) {
    console.error("[DiscoveryServer] Failed to build launcher manifest:", error);

    return res.status(500).json({
      status: "error",
      error: "ManifestBuildFailed",
      message: "Failed to build launcher manifest"
    });
  }
}

module.exports = {
  getManifest
};
