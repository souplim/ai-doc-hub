const configuredServerUrl = import.meta.env.VITE_SERVER_URL?.trim();

export const AUTH_SERVER_URL = (
  configuredServerUrl || "http://localhost:3000"
).replace(/\/$/, "");
