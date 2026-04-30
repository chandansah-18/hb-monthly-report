import { spawn } from "node:child_process";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const viteEntry = resolve(process.cwd(), "node_modules/vite/bin/vite.js");

const child = spawn(process.execPath, [viteEntry, ...args], {
  cwd: process.cwd(),
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
