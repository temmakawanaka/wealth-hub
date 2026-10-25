import { fileURLToPath } from 'node:url';
import { inspectRepository } from './lib/repository-hygiene.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const checked = await inspectRepository(root);
console.log(`Repository hygiene check passed (${checked} text files).`);
