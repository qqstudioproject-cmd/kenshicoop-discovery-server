const registryService = require("./registryService");
const { getNowMs } = require("../utils/time");

const lobbies = new Map();

function buildLobbyKey(worldName, advertisedAddress, advertisedPort) {
  return `${String(worldName || "").trim()}@@${String(advertisedAddress || "").trim()}@@${Number(advertisedPort) || 0}`;
}

function clonePlayer(player) {
  return {
    coopNickname: player.coopNickname,
    pingMs: player.pingMs,
    isHost: player.isHost,
    joinedAt: player.joinedAt
  };
}

function cloneLobby(lobby) {
  return {
    worldId: lobby.worldId,
    worldName: lobby.worldName,
    worldSettings: lobby.worldSettings,
    hostNickname: lobby.hostNickname,
    hostSessionId: lobby.hostSessionId,
    advertisedAddress: lobby.advertisedAddress,
    advertisedPort: lobby.advertisedPort,
    passwordProtected: lobby.passwordProtected,
    worldPassword: lobby.worldPassword,
    protocolVersion: lobby.protocolVersion,
    players: lobby.players.map(clonePlayer),
    createdAt: lobby.createdAt,
    updatedAt: lobby.updatedAt
  };
}

function ensureLobbyFromWorld(world) {
  const key = buildLobbyKey(world.worldName, world.advertisedAddress, world.advertisedPort);
  const nowMs = getNowMs();

  const existing = lobbies.get(key);
  if (existing) {
    existing.worldSettings = world.worldSettings;
    existing.hostNickname = world.hostNickname;
    existing.hostSessionId = world.hostSessionId;
    existing.passwordProtected = world.passwordProtected;
    existing.protocolVersion = world.protocolVersion;
    existing.updatedAt = nowMs;
    return existing;
  }

  const lobby = {
    worldId: world.worldId,
    worldName: world.worldName,
    worldSettings: world.worldSettings,
    hostNickname: world.hostNickname,
    hostSessionId: world.hostSessionId,
    advertisedAddress: world.advertisedAddress,
    advertisedPort: world.advertisedPort,
    passwordProtected: world.passwordProtected,
    worldPassword: "",
    protocolVersion: world.protocolVersion,
    players: [
      {
        coopNickname: world.hostNickname,
        pingMs: 0,
        isHost: true,
        joinedAt: nowMs
      }
    ],
    createdAt: world.createdAt || nowMs,
    updatedAt: nowMs
  };

  lobbies.set(key, lobby);
  return lobby;
}

function getLobbySnapshot(input) {
  const world = registryService.findWorld(
    input.worldName,
    input.advertisedAddress,
    input.advertisedPort
  );

  if (!world) {
    return null;
  }

  const lobby = ensureLobbyFromWorld(world);
  return cloneLobby(lobby);
}

function joinLobby(input) {
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

  const lobby = ensureLobbyFromWorld(world);
  const nowMs = getNowMs();

  const existingPlayer = lobby.players.find(
    (player) => player.coopNickname === input.coopNickname
  );

  if (existingPlayer) {
    existingPlayer.pingMs = Number.isInteger(input.pingMs) ? input.pingMs : existingPlayer.pingMs;
  } else {
    lobby.players.push({
      coopNickname: input.coopNickname,
      pingMs: Number.isInteger(input.pingMs) ? input.pingMs : 0,
      isHost: false,
      joinedAt: nowMs
    });
  }

  lobby.updatedAt = nowMs;

  registryService.updateWorldPlayerCount(
    world.worldName,
    world.advertisedAddress,
    world.advertisedPort,
    lobby.players.length
  );

  return {
    ok: true,
    lobby: cloneLobby(lobby)
  };
}

function leaveLobby(input) {
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

  const key = buildLobbyKey(world.worldName, world.advertisedAddress, world.advertisedPort);
  const lobby = lobbies.get(key);

  if (!lobby) {
    return {
      ok: false,
      error: "LobbyNotFound"
    };
  }

  lobby.players = lobby.players.filter(
    (player) => player.coopNickname !== input.coopNickname
  );

  lobby.updatedAt = getNowMs();

  registryService.updateWorldPlayerCount(
    world.worldName,
    world.advertisedAddress,
    world.advertisedPort,
    lobby.players.length
  );

  return {
    ok: true,
    lobby: cloneLobby(lobby)
  };
}

function removePlayer(input) {
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

  const key = buildLobbyKey(world.worldName, world.advertisedAddress, world.advertisedPort);
  const lobby = lobbies.get(key);

  if (!lobby) {
    return {
      ok: false,
      error: "LobbyNotFound"
    };
  }

  lobby.players = lobby.players.filter(
    (player) => player.coopNickname !== input.targetCoopNickname
  );

  lobby.updatedAt = getNowMs();

  registryService.updateWorldPlayerCount(
    world.worldName,
    world.advertisedAddress,
    world.advertisedPort,
    lobby.players.length
  );

  return {
    ok: true,
    lobby: cloneLobby(lobby)
  };
}

function updatePasswordSettings(input) {
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

  const lobby = ensureLobbyFromWorld(world);

  lobby.passwordProtected = !input.disablePassword && String(input.worldPassword || "").trim().length > 0;
  lobby.worldPassword = lobby.passwordProtected ? String(input.worldPassword || "").trim() : "";
  lobby.updatedAt = getNowMs();

  registryService.updateWorldPasswordProtected(
    world.worldName,
    world.advertisedAddress,
    world.advertisedPort,
    lobby.passwordProtected
  );

  return {
    ok: true,
    lobby: cloneLobby(lobby)
  };
}

function deleteLobbyForWorld(worldName, advertisedAddress, advertisedPort) {
  const key = buildLobbyKey(worldName, advertisedAddress, advertisedPort);
  lobbies.delete(key);
}

module.exports = {
  getLobbySnapshot,
  joinLobby,
  leaveLobby,
  removePlayer,
  updatePasswordSettings,
  deleteLobbyForWorld
};
