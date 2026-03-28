const MAX_WORLD_NAME_LENGTH = 64;
const MAX_HOST_NICKNAME_LENGTH = 64;
const MAX_WORLD_SETTINGS_LENGTH = 128;
const MAX_ADVERTISED_ADDRESS_LENGTH = 128;
const MAX_HOST_SESSION_ID_LENGTH = 64;

function normalizeTrimmedString(value) {
  return String(value ?? "").trim();
}

function isValidPort(value) {
  return Number.isInteger(value) && value >= 1 && value <= 65535;
}

function isValidNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function buildValidationError(message, details = []) {
  return {
    status: "error",
    error: "ValidationError",
    message,
    details
  };
}

function validateStringField({
  fieldName,
  value,
  required = false,
  maxLength = 64
}) {
  const normalized = normalizeTrimmedString(value);
  const errors = [];

  if (required && normalized.length === 0) {
    errors.push(`${fieldName} is required`);
  }

  if (normalized.length > maxLength) {
    errors.push(`${fieldName} exceeds max length of ${maxLength}`);
  }

  return {
    value: normalized,
    errors
  };
}

function validateRegisterWorldPayload(body) {
  const details = [];

  const worldName = validateStringField({
    fieldName: "worldName",
    value: body.worldName,
    required: true,
    maxLength: MAX_WORLD_NAME_LENGTH
  });
  details.push(...worldName.errors);

  const hostNickname = validateStringField({
    fieldName: "hostNickname",
    value: body.hostNickname,
    required: true,
    maxLength: MAX_HOST_NICKNAME_LENGTH
  });
  details.push(...hostNickname.errors);

  const worldSettings = validateStringField({
    fieldName: "worldSettings",
    value: body.worldSettings,
    required: true,
    maxLength: MAX_WORLD_SETTINGS_LENGTH
  });
  details.push(...worldSettings.errors);

  const advertisedAddress = validateStringField({
    fieldName: "advertisedAddress",
    value: body.advertisedAddress,
    required: true,
    maxLength: MAX_ADVERTISED_ADDRESS_LENGTH
  });
  details.push(...advertisedAddress.errors);

  const hostSessionId = validateStringField({
    fieldName: "hostSessionId",
    value: body.hostSessionId,
    required: true,
    maxLength: MAX_HOST_SESSION_ID_LENGTH
  });
  details.push(...hostSessionId.errors);

  const advertisedPort = Number(body.advertisedPort);
  if (!isValidPort(advertisedPort)) {
    details.push("advertisedPort must be an integer between 1 and 65535");
  }

  const playerCount = Number(body.playerCount);
  if (!Number.isInteger(playerCount) || playerCount < 0 || playerCount > 1024) {
    details.push("playerCount must be an integer between 0 and 1024");
  }

  const protocolVersion = Number(body.protocolVersion);
  if (!Number.isInteger(protocolVersion) || protocolVersion < 0 || protocolVersion > 65535) {
    details.push("protocolVersion must be an integer between 0 and 65535");
  }

  const passwordProtected = typeof body.passwordProtected === "boolean"
    ? body.passwordProtected
    : null;

  if (passwordProtected === null) {
    details.push("passwordProtected must be a boolean");
  }

  if (details.length > 0) {
    return {
      ok: false,
      error: buildValidationError("Invalid register world payload", details)
    };
  }

  return {
    ok: true,
    value: {
      worldName: worldName.value,
      hostNickname: hostNickname.value,
      worldSettings: worldSettings.value,
      passwordProtected,
      playerCount,
      advertisedAddress: advertisedAddress.value,
      advertisedPort,
      protocolVersion,
      hostSessionId: hostSessionId.value
    }
  };
}

function validateHeartbeatPayload(body) {
  const details = [];

  const worldName = validateStringField({
    fieldName: "worldName",
    value: body.worldName,
    required: true,
    maxLength: MAX_WORLD_NAME_LENGTH
  });
  details.push(...worldName.errors);

  const advertisedAddress = validateStringField({
    fieldName: "advertisedAddress",
    value: body.advertisedAddress,
    required: true,
    maxLength: MAX_ADVERTISED_ADDRESS_LENGTH
  });
  details.push(...advertisedAddress.errors);

  const hostSessionId = validateStringField({
    fieldName: "hostSessionId",
    value: body.hostSessionId,
    required: true,
    maxLength: MAX_HOST_SESSION_ID_LENGTH
  });
  details.push(...hostSessionId.errors);

  const advertisedPort = Number(body.advertisedPort);
  if (!isValidPort(advertisedPort)) {
    details.push("advertisedPort must be an integer between 1 and 65535");
  }

  const playerCount = Number(body.playerCount);
  if (!Number.isInteger(playerCount) || playerCount < 0 || playerCount > 1024) {
    details.push("playerCount must be an integer between 0 and 1024");
  }

  if (details.length > 0) {
    return {
      ok: false,
      error: buildValidationError("Invalid heartbeat payload", details)
    };
  }

  return {
    ok: true,
    value: {
      worldName: worldName.value,
      advertisedAddress: advertisedAddress.value,
      advertisedPort,
      playerCount,
      hostSessionId: hostSessionId.value
    }
  };
}

function validateUnregisterPayload(body) {
  const details = [];

  const worldName = validateStringField({
    fieldName: "worldName",
    value: body.worldName,
    required: true,
    maxLength: MAX_WORLD_NAME_LENGTH
  });
  details.push(...worldName.errors);

  const advertisedAddress = validateStringField({
    fieldName: "advertisedAddress",
    value: body.advertisedAddress,
    required: true,
    maxLength: MAX_ADVERTISED_ADDRESS_LENGTH
  });
  details.push(...advertisedAddress.errors);

  const hostSessionId = validateStringField({
    fieldName: "hostSessionId",
    value: body.hostSessionId,
    required: true,
    maxLength: MAX_HOST_SESSION_ID_LENGTH
  });
  details.push(...hostSessionId.errors);

  const advertisedPort = Number(body.advertisedPort);
  if (!isValidPort(advertisedPort)) {
    details.push("advertisedPort must be an integer between 1 and 65535");
  }

  if (details.length > 0) {
    return {
      ok: false,
      error: buildValidationError("Invalid unregister payload", details)
    };
  }

  return {
    ok: true,
    value: {
      worldName: worldName.value,
      advertisedAddress: advertisedAddress.value,
      advertisedPort,
      hostSessionId: hostSessionId.value
    }
  };
}

module.exports = {
  validateRegisterWorldPayload,
  validateHeartbeatPayload,
  validateUnregisterPayload
};
