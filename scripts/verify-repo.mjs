import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url);
const forbiddenNames = [/^\.env(?:\.|$)/, /^id_(rsa|ed25519)$/, /^credentials(?:\.|$)/i];
const forbiddenExtensions = /\.(?:pem|p12|pfx|key)$/i;
const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage"]);
let checked = 0;

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${entry.name}`);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) await inspect(join(directory, entry.name));
      continue;
    }
    if (!entry.isFile()) continue;
    const path = join(directory, entry.name);
    const name = relative(new URL(".", root).pathname, path);
    if (forbiddenNames.some(pattern => pattern.test(entry.name)) || forbiddenExtensions.test(entry.name)) {
      throw new Error(`Potential credential file: ${name}`);
    }
    if (!/\.(?:mjs|js|ts|tsx|json|html|css|md|yaml|yml|txt)$/.test(entry.name)) continue;
    if ((await readFile(path, "utf8")).includes("\r")) throw new Error(`CRLF is not allowed: ${name}`);
    checked++;
  }
}
await inspect(new URL(".", root).pathname);
console.log(`Repository hygiene check passed (${checked} text files).`);
