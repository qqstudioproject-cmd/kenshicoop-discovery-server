const registryService = require("../services/registryService");
const {
  validateRegisterWorldPayload,
  validateHeartbeatPayload,
  validateUnregisterPayload
} = require("../utils/validation");

function listWorlds(req, res) {
  const worlds = registryService.getAllWorlds();

  res.status(200).json({
    status: "ok",
    count: worlds.length,
    worlds
  });
}

function registerWorld(req, res) {
  const validation = validateRegisterWorldPayload(req.body || {});
  if (!validation.ok) {
    res.status(400).json(validation.error);
    return;
  }

  const result = registryService.registerWorld(validation.value);

  res.status(result.created ? 201 : 200).json({
    status: "ok",
    created: result.created,
    world: result.world
  });
}

function heartbeatWorld(req, res) {
  const validation = validateHeartbeatPayload(req.body || {});
  if (!validation.ok) {
    res.status(400).json(validation.error);
    return;
  }

  const updatedWorld = registryService.heartbeatWorld(validation.value);

  if (!updatedWorld) {
    res.status(404).json({
      status: "error",
      error: "WorldNotFound",
      message: "World was not found for heartbeat"
    });
    return;
  }

  res.status(200).json({
    status: "ok",
    world: updatedWorld
  });
}

function unregisterWorld(req, res) {
  const validation = validateUnregisterPayload(req.body || {});
  if (!validation.ok) {
    res.status(400).json(validation.error);
    return;
  }

  const removed = registryService.unregisterWorld(validation.value);

  if (!removed) {
    res.status(404).json({
      status: "error",
      error: "WorldNotFound",
      message: "World was not found for unregister"
    });
    return;
  }

  res.status(200).json({
    status: "ok",
    removed: true
  });
}

module.exports = {
  listWorlds,
  registerWorld,
  heartbeatWorld,
  unregisterWorld
};
