import { readFile } from 'node:fs/promises';
import { assertEnvironment } from './lib/environment.mjs';

const major = (await readFile(new URL('../.nvmrc', import.meta.url), 'utf8')).trim();
assertEnvironment(process.versions.node, process.env.npm_config_user_agent, major);
console.log('Supported development environment: Node.js 22.x / npm 10.x.');
