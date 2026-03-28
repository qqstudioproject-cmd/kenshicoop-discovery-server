const express = require("express");
const lobbyController = require("../controllers/lobbyController");

const router = express.Router();

router.get("/", lobbyController.getLobbySnapshot);
router.post("/join", lobbyController.joinLobby);
router.post("/leave", lobbyController.leaveLobby);
router.post("/remove", lobbyController.removeLobbyPlayer);
router.post("/password", lobbyController.updatePasswordSettings);

module.exports = router;
