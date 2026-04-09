import { spawn } from "node:child_process";

const cwd = new URL("..", import.meta.url);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const buildWatchEnv = {
  ...process.env,
  REMOTE_FEDERATION_DEBUG: "1",
  REMOTE_FEDERATION_WATCH: "1",
};

const children = [
  spawn(npmCommand, ["run", "build:watch"], {
    cwd,
    env: buildWatchEnv,
    stdio: "inherit",
  }),
  spawn(npmCommand, ["run", "preview"], {
    cwd,
    stdio: "inherit",
  }),
];

const shutdown = (signal = "SIGTERM") => {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
};

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    shutdown(signal);
    process.exit(0);
  });
}

for (const child of children) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      shutdown();
      process.exit(code);
    }
  });
}
