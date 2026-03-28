const lobbyService = require("../services/lobbyService");
const {
  validateLobbyLookupPayload,
  validateJoinLobbyPayload,
  validateLeaveLobbyPayload,
  validateRemoveLobbyPlayerPayload,
  validatePasswordSettingsPayload
} = require("../utils/validation");

function getLobbySnapshot(req, res) {
  const validation = validateLobbyLookupPayload(req.query || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const lobby = lobbyService.getLobbySnapshot(validation.value);
  if (!lobby) {
    return res.status(404).json({
      status: "error",
      error: "LobbyNotFound",
      message: "Lobby was not found"
    });
  }

  return res.status(200).json({
    status: "ok",
    lobby
  });
}

function joinLobby(req, res) {
  const validation = validateJoinLobbyPayload(req.body || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const result = lobbyService.joinLobby(validation.value);
  if (!result.ok) {
    return res.status(404).json({
      status: "error",
      error: result.error,
      message: "Lobby join failed"
    });
  }

  return res.status(200).json({
    status: "ok",
    lobby: result.lobby
  });
}

function leaveLobby(req, res) {
  const validation = validateLeaveLobbyPayload(req.body || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const result = lobbyService.leaveLobby(validation.value);
  if (!result.ok) {
    return res.status(404).json({
      status: "error",
      error: result.error,
      message: "Lobby leave failed"
    });
  }

  return res.status(200).json({
    status: "ok",
    lobby: result.lobby
  });
}

function removeLobbyPlayer(req, res) {
  const validation = validateRemoveLobbyPlayerPayload(req.body || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const result = lobbyService.removePlayer(validation.value);
  if (!result.ok) {
    return res.status(404).json({
      status: "error",
      error: result.error,
      message: "Remove lobby player failed"
    });
  }

  return res.status(200).json({
    status: "ok",
    lobby: result.lobby
  });
}

function updatePasswordSettings(req, res) {
  const validation = validatePasswordSettingsPayload(req.body || {});
  if (!validation.ok) {
    return res.status(400).json(validation.error);
  }

  const result = lobbyService.updatePasswordSettings(validation.value);
  if (!result.ok) {
    return res.status(404).json({
      status: "error",
      error: result.error,
      message: "Password settings update failed"
    });
  }

  return res.status(200).json({
    status: "ok",
    lobby: result.lobby
  });
}

module.exports = {
  getLobbySnapshot,
  joinLobby,
  leaveLobby,
  removeLobbyPlayer,
  updatePasswordSettings
};
