const { getNowMs } = require("../utils/time");

const worlds = new Map();

function buildWorldKey(worldName, advertisedAddress, advertisedPort) {
  return `${worldName}@@${advertisedAddress}@@${advertisedPort}`;
}

function findWorld(worldName, advertisedAddress, advertisedPort) {
  const key = buildWorldKey(
    String(worldName || "").trim(),
    String(advertisedAddress || "").trim(),
    Number.isFinite(advertisedPort) ? advertisedPort : Number(advertisedPort) || 0
  );

  return worlds.get(key) || null;
}

function updateWorldPlayerCount(worldName, advertisedAddress, advertisedPort, playerCount) {
  const existing = findWorld(worldName, advertisedAddress, advertisedPort);
  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    playerCount,
    updatedAt: getNowMs(),
    lastSeenAt: getNowMs()
  };

  const key = buildWorldKey(updated.worldName, updated.advertisedAddress, updated.advertisedPort);
  worlds.set(key, updated);
  return updated;
}

function updateWorldPasswordProtected(worldName, advertisedAddress, advertisedPort, passwordProtected) {
  const existing = findWorld(worldName, advertisedAddress, advertisedPort);
  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    passwordProtected: Boolean(passwordProtected),
    updatedAt: getNowMs(),
    lastSeenAt: getNowMs()
  };

  const key = buildWorldKey(updated.worldName, updated.advertisedAddress, updated.advertisedPort);
  worlds.set(key, updated);
  return updated;
}

function normalizeWorldEntry(input) {
  const nowMs = getNowMs();

  const worldName = String(input.worldName || "").trim();
  const hostNickname = String(input.hostNickname || "").trim();
  const worldSettings = String(input.worldSettings || "").trim();
  const passwordProtected = Boolean(input.passwordProtected);
  const playerCount = Number.isFinite(input.playerCount) ? input.playerCount : 0;
  const advertisedAddress = String(input.advertisedAddress || "").trim();
  const advertisedPort = Number.isFinite(input.advertisedPort) ? input.advertisedPort : 0;
  const protocolVersion = Number.isFinite(input.protocolVersion) ? input.protocolVersion : 0;
  const hostSessionId = String(input.hostSessionId || "").trim();

  const worldId = buildWorldKey(worldName, advertisedAddress, advertisedPort);

  return {
    worldId,
    worldName,
    hostNickname,
    worldSettings,
    passwordProtected,
    playerCount,
    advertisedAddress,
    advertisedPort,
    protocolVersion,
    hostSessionId,
    createdAt: input.createdAt || nowMs,
    updatedAt: nowMs,
    lastSeenAt: nowMs
  };
}

function registerWorld(input) {
  const normalized = normalizeWorldEntry(input);
  const key = buildWorldKey(
    normalized.worldName,
    normalized.advertisedAddress,
    normalized.advertisedPort
  );

  const existing = worlds.get(key);
  if (existing) {
    const updated = {
      ...existing,
      worldId: existing.worldId,
      hostNickname: normalized.hostNickname,
      worldSettings: normalized.worldSettings,
      passwordProtected: normalized.passwordProtected,
      playerCount: normalized.playerCount,
      protocolVersion: normalized.protocolVersion,
      hostSessionId: normalized.hostSessionId,
      updatedAt: normalized.updatedAt,
      lastSeenAt: normalized.lastSeenAt
    };

    worlds.set(key, updated);
    return {
      created: false,
      world: updated
    };
  }

  worlds.set(key, normalized);

  return {
    created: true,
    world: normalized
  };
}

function heartbeatWorld(input) {
  const worldName = String(input.worldName || "").trim();
  const advertisedAddress = String(input.advertisedAddress || "").trim();
  const advertisedPort = Number.isFinite(input.advertisedPort) ? input.advertisedPort : 0;

  const key = buildWorldKey(worldName, advertisedAddress, advertisedPort);
  const existing = worlds.get(key);

  if (!existing) {
    return null;
  }

  const nowMs = getNowMs();
  const updated = {
    ...existing,
    playerCount: Number.isFinite(input.playerCount) ? input.playerCount : existing.playerCount,
    hostSessionId: String(input.hostSessionId || existing.hostSessionId || "").trim(),
    updatedAt: nowMs,
    lastSeenAt: nowMs
  };

  worlds.set(key, updated);
  return updated;
}

function unregisterWorld(input) {
  const worldName = String(input.worldName || "").trim();
  const advertisedAddress = String(input.advertisedAddress || "").trim();
  const advertisedPort = Number.isFinite(input.advertisedPort) ? input.advertisedPort : 0;

  const key = buildWorldKey(worldName, advertisedAddress, advertisedPort);
  const existing = worlds.get(key);

  if (!existing) {
    return false;
  }

  worlds.delete(key);
  return true;
}

function getAllWorlds() {
  return Array.from(worlds.values()).sort((a, b) => {
    return a.worldName.localeCompare(b.worldName);
  });
}

function getWorldCount() {
  return worlds.size;
}

function clearAllWorlds() {
  worlds.clear();
}

function pruneStaleWorlds(ttlMs) {
  const nowMs = getNowMs();
  const removed = [];

  for (const [key, world] of worlds.entries()) {
    if ((nowMs - world.lastSeenAt) > ttlMs) {
      removed.push(world);
      worlds.delete(key);
    }
  }

  return removed;
}

module.exports = {
  buildWorldKey,
  registerWorld,
  heartbeatWorld,
  unregisterWorld,
  getAllWorlds,
  getWorldCount,
  clearAllWorlds,
  pruneStaleWorlds,
  findWorld,
  updateWorldPlayerCount,
  updateWorldPasswordProtected,
};
