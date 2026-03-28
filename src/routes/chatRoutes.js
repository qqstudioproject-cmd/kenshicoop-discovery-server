const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.get("/", chatController.listChatMessages);
router.post("/send", chatController.appendChatMessage);

module.exports = router;
