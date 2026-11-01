import { spawnSync } from 'node:child_process';

if (!process.env.CHROMATIC_PROJECT_TOKEN) {
  console.error(
    'BLOCKED: Set CHROMATIC_PROJECT_TOKEN through a secure environment or CI secret after authorizing this destination.',
  );
  process.exit(1);
}
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run npm run chromatic.');
const result = spawnSync(
  process.execPath,
  [npmCli, 'exec', '--', 'chromatic', '--storybook-build-dir=packages/ui/storybook-static'],
  { stdio: 'inherit' },
);
process.exit(result.status ?? 1);
