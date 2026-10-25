export function assertEnvironment(nodeVersion, npmUserAgent, configuredMajor) {
  const [major, minor] = nodeVersion.split('.').map(Number);
  const npmMajor = Number(npmUserAgent?.match(/^npm\/(\d+)\./)?.[1]);
  if (configuredMajor !== '22' || major !== 22 || minor < 12 || !Number.isInteger(minor)) {
    throw new Error('Use Node.js 22.12+ within 22.x; see .nvmrc and CONTRIBUTING.md.');
  }
  if (npmMajor !== 10) {
    throw new Error('Use npm 10.x and run this check through npm run verify:env.');
  }
}
