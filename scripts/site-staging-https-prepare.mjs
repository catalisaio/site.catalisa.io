import { stagingRoute } from './site-staging-config.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';

const output = resolve(process.argv.find(value => value.startsWith('--out='))?.slice(6) || '.local/site/staging-https');
await mkdir(output, { mode: 0o700 }); // Refuse to rotate an existing staging password accidentally.
const username = 'site-review';
const password = randomBytes(32).toString('base64url');
const hash = await new Promise((accept, reject) => {
  const child = spawn('openssl', ['passwd','-apr1','-stdin'], { stdio: ['pipe','pipe','pipe'] });
  let result = ''; child.stdout.on('data', part => { result += part.toString(); });
  child.stderr.resume(); child.on('error', reject);
  child.on('close', code => code === 0 ? accept(result.trim()) : reject(Error('Password hash generation failed')));
  child.stdin.end(password + '\n');
});
await writeFile(resolve(output, 'access.json'), JSON.stringify({ url: 'https://site-staging.catalisa.io', username, password }, null, 2) + '\n', { mode: 0o600 });
await writeFile(resolve(output, 'site-staging.htpasswd'), username + ':' + hash + '\n', { mode: 0o600 });
await writeFile(resolve(output, 'site-catalisa-staging.yml'), stagingRoute, { mode: 0o600 });
console.info(JSON.stringify({ output, hostname: 'site-staging.catalisa.io', accessFile: resolve(output, 'access.json'), valuesPrinted: false, deployed: false }));
