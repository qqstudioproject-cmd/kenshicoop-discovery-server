const registryService = require("./registryService");
const { getNowMs } = require("../utils/time");

const chats = new Map();

function buildChatKey(worldName, advertisedAddress, advertisedPort) {
  return `${String(worldName || "").trim()}@@${String(advertisedAddress || "").trim()}@@${Number(advertisedPort) || 0}`;
}

function ensureChat(world) {
  const key = buildChatKey(world.worldName, world.advertisedAddress, world.advertisedPort);

  const existing = chats.get(key);
  if (existing) {
    return existing;
  }

  const chat = {
    worldName: world.worldName,
    advertisedAddress: world.advertisedAddress,
    advertisedPort: world.advertisedPort,
    messages: []
  };

  chats.set(key, chat);
  return chat;
}

function listMessages(input) {
  const world = registryService.findWorld(
    input.worldName,
    input.advertisedAddress,
    input.advertisedPort
  );

  if (!world) {
    return null;
  }

  const chat = ensureChat(world);
  return {
    worldName: chat.worldName,
    count: chat.messages.length,
    messages: chat.messages.map((message) => ({ ...message }))
  };
}

function appendMessage(input) {
  const world = registryService.findWorld(
    input.worldName,
    input.advertisedAddress,
    input.advertisedPort
  );

  if (!world) {
    return {
      ok: false,
      error: "WorldNotFound"
    };
  }

  const chat = ensureChat(world);

  const message = {
    coopNickname: input.coopNickname,
    messageText: input.messageText,
    createdAt: getNowMs()
  };

  chat.messages.push(message);

  return {
    ok: true,
    message,
    count: chat.messages.length
  };
}

function clearMessagesForWorld(worldName, advertisedAddress, advertisedPort) {
  const key = buildChatKey(worldName, advertisedAddress, advertisedPort);
  chats.delete(key);
}

module.exports = {
  listMessages,
  appendMessage,
  clearMessagesForWorld
};
