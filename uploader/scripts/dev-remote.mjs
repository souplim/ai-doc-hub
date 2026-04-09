import { spawn } from "node:child_process";

/**
 * 이 스크립트는 개발 환경에서 원격 연합을 테스트하기 위해 빌드 감시와 프리뷰 서버를 동시에 실행합니다.
 * 빌드 감시는 소스 코드 변경을 감지하여 자동으로 빌드를 트리거하고, 프리뷰 서버는 빌드된 결과물을 제공합니다.
 * 이 스크립트를 사용하면 개발 중에 원격 연합의 변경 사항을 실시간으로 확인할 수 있습니다.
 * 종료 시에는 두 프로세스 모두 안전하게 종료됩니다.
 */
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
