const chatService = require("../services/chatService");
const {
  validateLobbyLookupPayload,
  validateAppendChatMessagePayload
} = require("../utils/validation");

function listChatMessages(req, res) {
  const validation = validateLobbyLookupPayload(req.query || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const chat = chatService.listMessages(validation.value);
  if (!chat) {
    return res.status(404).json({
      status: "error",
      error: "ChatNotFound",
      message: "Chat was not found"
    });
  }

  return res.status(200).json({
    status: "ok",
    worldName: chat.worldName,
    count: chat.count,
    messages: chat.messages
  });
}

function appendChatMessage(req, res) {
  const validation = validateAppendChatMessagePayload(req.body || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const result = chatService.appendMessage(validation.value);
  if (!result.ok) {
    return res.status(404).json({
      status: "error",
      error: result.error,
      message: "Append chat message failed"
    });
  }

  return res.status(201).json({
    status: "ok",
    message: result.message,
    count: result.count
  });
}

module.exports = {
  listChatMessages,
  appendChatMessage
};
