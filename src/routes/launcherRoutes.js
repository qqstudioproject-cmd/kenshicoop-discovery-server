const express = require("express");
const launcherController = require("../controllers/launcherController");

const router = express.Router();

router.get("/manifest.json", launcherController.getManifest);

module.exports = router;
