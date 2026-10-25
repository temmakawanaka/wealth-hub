import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inspectRepository } from './lib/repository-hygiene.mjs';
import { assertEnvironment } from './lib/environment.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'wealth-hub 日本語 space-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('accepts the supported Node/npm environment', () => {
  assert.doesNotThrow(() => assertEnvironment('22.12.0', 'npm/10.9.2 node/v22.12.0', '22'));
  assert.doesNotThrow(() => assertEnvironment('22.23.3', 'npm/10.9.9', '22'));
});

for (const version of ['20.19.0', '22.11.0', '24.0.0', '26.0.0', 'invalid']) {
  test(`rejects unsupported Node ${version}`, () => {
    assert.throws(() => assertEnvironment(version, 'npm/10.9.2', '22'));
  });
}

for (const agent of ['npm/9.0.0', 'npm/11.0.0', 'yarn/1.22.0', undefined]) {
  test(`rejects unsupported package manager ${agent}`, () => {
    assert.throws(() => assertEnvironment('22.16.0', agent, '22'));
  });
}

test('requires the version file and runtime policy to agree', () => {
  assert.throws(() => assertEnvironment('22.16.0', 'npm/10.9.2', '24'));
});

test('inspects nested files in a Japanese path with spaces', async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, 'src'));
  await writeFile(join(root, 'README.md'), '# Synthetic fixture\n');
  await writeFile(join(root, 'src', 'demo.ts'), 'export const demo = 1;\n');
  assert.equal(await inspectRepository(root), 2);
});

test('ignores dependency and generated directories', async (t) => {
  const root = await fixture(t);
  for (const name of ['.git', 'node_modules', 'dist', 'coverage']) {
    await mkdir(join(root, name));
    await writeFile(join(root, name, '.env'), 'SYNTHETIC_ONLY=demo\n');
  }
  assert.equal(await inspectRepository(root), 0);
});

for (const name of ['.env', '.env.local', 'id_rsa', 'credentials.json', 'demo.key']) {
  test(`rejects forbidden filename ${name}`, async (t) => {
    const root = await fixture(t);
    await writeFile(join(root, name), 'SYNTHETIC_ONLY\n');
    await assert.rejects(inspectRepository(root), /Potential credential file/);
  });
}

test('rejects CRLF in checked text files', async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, 'demo.ts'), 'export const demo = 1;\r\n');
  await assert.rejects(inspectRepository(root), /CRLF is not allowed/);
});

test('rejects directory links without following them', async (t) => {
  const root = await fixture(t);
  const target = await fixture(t);
  await symlink(target, join(root, 'linked'), 'junction');
  await assert.rejects(inspectRepository(root), /Unexpected symlink/);
});

test('CLI resolves its own root independently of the working directory', async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, 'scripts', 'lib'), { recursive: true });
  for (const name of ['verify-repo.mjs', 'lib/repository-hygiene.mjs']) {
    await copyFile(fileURLToPath(new URL(name, import.meta.url)), join(root, 'scripts', name));
  }
  const output = execFileSync(process.execPath, [join(root, 'scripts', 'verify-repo.mjs')], {
    cwd: tmpdir(),
    encoding: 'utf8',
  });
  assert.match(output, /Repository hygiene check passed \(2 text files\)/);
});
