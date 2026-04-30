import { spawn } from "node:child_process";
import { resolve } from "node:path";

function runNodeScript(scriptPath, args = []) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise(undefined);
        return;
      }

      rejectPromise(new Error(`Script failed with exit code ${code ?? 1}`));
    });
  });
}

const tscEntry = resolve(process.cwd(), "node_modules/typescript/bin/tsc");
const viteEntry = resolve(process.cwd(), "node_modules/vite/bin/vite.js");

try {
  await runNodeScript(tscEntry, ["-b"]);
  await runNodeScript(viteEntry, ["build"]);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
