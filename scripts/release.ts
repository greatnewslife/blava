import { execSync } from 'child_process';

const { version: oldVersion } = await import('../package.json');

execSync('npx bumpp', { stdio: 'inherit' });

const { version } = await import('../package.json');

if (oldVersion === version) {
  console.log('canceled');
  process.exit();
}
