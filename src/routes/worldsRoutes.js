const express = require("express");
const worldsController = require("../controllers/worldsController");

const router = express.Router();

router.get("/", worldsController.listWorlds);
router.post("/register", worldsController.registerWorld);
router.post("/heartbeat", worldsController.heartbeatWorld);
router.post("/unregister", worldsController.unregisterWorld);

module.exports = router;
