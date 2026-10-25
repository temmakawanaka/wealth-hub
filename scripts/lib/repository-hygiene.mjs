import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const forbiddenNames = [/^\.env(?:\.|$)/, /^id_(rsa|ed25519)$/, /^credentials(?:\.|$)/i];
const forbiddenExtensions = /\.(?:pem|p12|pfx|key)$/i;
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);

export async function inspectRepository(directory) {
  const root = resolve(directory);
  let checked = 0;
  async function inspect(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      const name = relative(root, path);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${name}`);
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) await inspect(path);
        continue;
      }
      if (!entry.isFile()) continue;
      if (
        forbiddenNames.some((pattern) => pattern.test(entry.name)) ||
        forbiddenExtensions.test(entry.name)
      ) {
        throw new Error(`Potential credential file: ${name}`);
      }
      if (!/\.(?:mjs|js|ts|tsx|json|html|css|md|yaml|yml|txt)$/.test(entry.name)) continue;
      if ((await readFile(path, 'utf8')).includes('\r')) {
        throw new Error(`CRLF is not allowed: ${name}`);
      }
      checked++;
    }
  }
  await inspect(root);
  return checked;
}
