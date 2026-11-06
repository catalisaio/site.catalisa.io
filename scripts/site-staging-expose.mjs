import { readFile, stat, mkdtemp, rm, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { stagingRoute } from './site-staging-config.mjs';

// Fixed hostname/router only; BasicAuth remains at the edge. Never sends access.json.
const args=Object.fromEntries(process.argv.slice(2).map(value=>value.replace(/^--/,'').split(/=(.*)/s).slice(0,2)));
const source=resolve(args.source||'.local/site/staging-https');
if(await readFile(join(source,'site-catalisa-staging.yml'),'utf8')!==stagingRoute)throw Error('Unexpected staging router configuration');
const users=await readFile(join(source,'site-staging.htpasswd'),'utf8');
if(!/^site-review:\$apr1\$[^\r\n]+\n$/.test(users)||((await stat(join(source,'site-staging.htpasswd'))).mode&0o777)!==0o600)throw Error('Expected private staging BasicAuth file');
console.info(JSON.stringify({hostname:'site-staging.catalisa.io',dns:'A177.104.184.38 TTL60 on PowerDNS CT123',edge:'Traefik CT105 new staging-only router',upstream:'http://172.10.0.202:18181',basicAuth:true,accessFileStaysLocal:true,productionUnchanged:true,apply:args.apply==='true'}));
if(args.apply!=='true')process.exit(0);
const quote=value=>"'"+value.replace(/'/g,"'\\''")+"'";
const run=(command,argv)=>new Promise((accept,reject)=>{
  const child=spawn(command,argv,{stdio:['ignore','pipe','pipe']});child.stdout.resume();child.stderr.resume();
  child.on('error',()=>reject(Error(command+' failed to start')));child.on('close',code=>code===0?accept():reject(Error(command+' failed (exit '+code+'); inspect staging-only DNS/edge state before retry')));
});
const ssh=script=>run('ssh',['-n','-o','BatchMode=yes','-o','ConnectTimeout=15','root@177.104.184.34',script]);
// Require the candidate healthy before any DNS mutation.
await ssh('pct exec 105 -- curl --fail --silent --max-time 10 http://172.10.0.202:18181/healthz');
await run('bash',['scripts/site-staging-dns.sh','--apply']);
const temporary=await mkdtemp(join(tmpdir(),'catalisa-site-edge-'));
const remote='/tmp/catalisa-site-staging-edge-'+process.pid;
let hostCreated=false,containerCreated=false;
try{
  for(const name of ['site-catalisa-staging.yml','site-staging.htpasswd'])await copyFile(join(source,name),join(temporary,name));
  await copyFile('scripts/site-staging-edge.sh',join(temporary,'site-staging-edge.sh'));
  await ssh('umask 077; mkdir '+quote(remote));hostCreated=true;
  await run('scp',['-q','-o','BatchMode=yes','-o','ConnectTimeout=15',join(temporary,'site-catalisa-staging.yml'),join(temporary,'site-staging.htpasswd'),join(temporary,'site-staging-edge.sh'),'root@177.104.184.34:'+remote+'/']);
  await ssh('pct exec 105 -- mkdir -m 700 '+quote(remote));containerCreated=true;
  for(const name of ['site-catalisa-staging.yml','site-staging.htpasswd','site-staging-edge.sh'])await ssh('pct push 105 '+quote(remote+'/'+name)+' '+quote(remote+'/'+name)+' --perms 0600');
  await ssh('pct exec 105 -- bash '+quote(remote+'/site-staging-edge.sh')+' '+quote(remote)+' --apply');
  console.info(JSON.stringify({applied:true,hostname:'site-staging.catalisa.io',productionUnchanged:true,next:'Wait for exact-host valid LE TLS; then browser with private local access.json. No TLS bypass.'}));
}finally{
  if(containerCreated)await ssh('pct exec 105 -- rm -rf -- '+quote(remote)).catch(()=>{});
  if(hostCreated)await ssh('rm -rf -- '+quote(remote)).catch(()=>{});
  await rm(temporary,{recursive:true,force:true});
}
