import { readFile, stat, mkdtemp, rm, copyFile, chmod, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { parseEnv } from 'node:util';
import { checkArtifact, checkEnvironment } from './site-release-preflight.mjs';
import { reviewHeaders, reviewRobots, reviewHostingInclude } from './site-review-caddy.mjs';

// Fixed scope: CT154's isolated staging candidate only. Never changes edge/DNS or production.
const args=Object.fromEntries(process.argv.slice(2).map(value=>value.replace(/^--/,'').split(/=(.*)/s).slice(0,2)));
if(!args.release||!args['env-file'])throw Error('Use --release=PREPARED_DIRECTORY --env-file=PRIVATE_ENV [--apply=true]');
const release=resolve(args.release),envFile=resolve(args['env-file']);
const manifest=JSON.parse(await readFile(join(release,'release.json'),'utf8'));
if(manifest.target!=='staging'||manifest.port!==18181||manifest.bindHost!=='172.10.0.202'||manifest.httpsStaging!==true||!/^[a-zA-Z0-9_-]{1,64}$/.test(manifest.id))throw Error('Only prepared private-interface HTTPS staging releases are accepted');
const reviewProductionArtifact=args['review-production-artifact']==='true';
if ((manifest.reviewProductionArtifact===true)!==reviewProductionArtifact)throw Error('Explicit production-artifact review flag must match the prepared staging manifest');
const env=parseEnv(await readFile(envFile,'utf8'));
const failures=[...checkEnvironment(env,'staging'),...await checkArtifact(join(release,'public'),'staging',{reviewProductionArtifact,httpsStaging:true})];
if(env.SITE_ALLOWED_ORIGINS!=='https://site-staging.catalisa.io')failures.push('HTTPS staging origin required');
if(((await stat(envFile)).mode&0o777)!==0o600)failures.push('private env must have mode600');
if(reviewProductionArtifact){
  const caddy=await readFile(join(release,'Caddyfile'),'utf8');
  if(!caddy.includes(reviewHeaders)||!caddy.includes(reviewRobots)||!caddy.includes('import /etc/caddy/site-review-hosting.caddy')||!caddy.includes('@unexpected_peer not remote_ip 172.10.0.105 172.10.0.202 127.0.0.1 ::1'))failures.push('staging production review Caddy protection missing');
  if(await readFile(join(release,'site-review-hosting.caddy'),'utf8')!==reviewHostingInclude(await readFile(join(release,'public/site-hosting.caddy'),'utf8')))failures.push('staging review hosting overlay differs');
  if(!/^[a-f0-9]{64}$/.test(manifest.publicArtifactSha256??'')||!/^[a-f0-9]{64}$/.test(manifest.serverArtifactSha256??''))failures.push('review requires public/server tree digests');
}
if(failures.length)throw Error('Staging preflight failed: '+failures.join(', '));
for(const name of ['site-server.mjs','package.json','package-lock.json'])await stat(join(release,'server',name));
const found=[];
async function inspect(directory,prefix=''){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const name=prefix+entry.name,path=join(directory,entry.name);
    if(entry.isSymbolicLink()||!entry.isDirectory()&&!entry.isFile())throw Error('Unsupported release entry');
    if(entry.isDirectory())await inspect(path,name+'/');
    else if(name!=='release.json'){
      if(!Object.hasOwn(manifest.files??{},name)||createHash('sha256').update(await readFile(path)).digest('hex')!==manifest.files[name])throw Error('Release integrity mismatch: '+name);
      found.push(name);
    }
  }
}
await inspect(release);
if(found.length!==Object.keys(manifest.files??{}).length)throw Error('Release manifest contains absent files');
if(reviewProductionArtifact){
  const treeSha256=prefix=>createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(manifest.files).filter(([name])=>name.startsWith(prefix+'/')).map(([name,hash])=>[name.slice(prefix.length+1),hash]).sort(([left],[right])=>left.localeCompare(right))))).digest('hex');
  if(treeSha256('public')!==manifest.publicArtifactSha256||treeSha256('server')!==manifest.serverArtifactSha256)throw Error('Review public/server tree digest mismatch');
}
const base='/opt/apps/catalisa-site-staging',destination=base+'/releases/'+manifest.id;
console.info(JSON.stringify({plan:{node:'177.104.184.34',container:154,target:'staging',id:manifest.id,destination,port:18181,bindHost:manifest.bindHost,reviewProductionArtifact,privateEnv:'outside release, mode600',dependencyInstall:'Docker Node22: npm ci --omit=dev --ignore-scripts',productionUnchanged:true,dnsOrEdgeChanges:false},apply:args.apply==='true'}));
if(args.apply!=='true')process.exit(0);
const quote=value=>"'"+value.replace(/'/g,"'\\''")+"'";
const run=(command,argv)=>new Promise((accept,reject)=>{
  const child=spawn(command,argv,{stdio:['ignore','pipe','pipe']});
  // Do not log child output: remote runtime files and npm environments are private.
  child.stdout.resume();child.stderr.resume();
  child.on('error',()=>reject(Error(command+' failed to start')));
  child.on('close',code=>code===0?accept():reject(Error(command+' failed (exit '+code+'); staging installation stopped')));
});
const sshCommand=script=>run('ssh',['-n','-o','BatchMode=yes','-o','ConnectTimeout=15','root@177.104.184.34',script]);
const temporary=await mkdtemp(join(tmpdir(),'catalisa-site-staging-'));
const remote='/tmp/catalisa-site-staging-'+manifest.id+'-'+process.pid;
const containerTemporary=remote;
let remoteCreated=false,containerCreated=false;
try{
  // A private archive keeps environment contents out of command lines and build context.
  await run('tar',['-czf',join(temporary,'release.tar.gz'),'-C',release,'.']);
  await chmod(join(temporary,'release.tar.gz'),0o600);
  await copyFile(envFile,join(temporary,'runtime.env'));await chmod(join(temporary,'runtime.env'),0o600);
  await copyFile('scripts/site-release-activate.sh',join(temporary,'site-release-activate.sh'));
  await sshCommand('umask 077; mkdir '+quote(remote));remoteCreated=true;
  await run('scp',['-q','-o','BatchMode=yes','-o','ConnectTimeout=15',join(temporary,'release.tar.gz'),join(temporary,'runtime.env'),join(temporary,'site-release-activate.sh'),'root@177.104.184.34:'+remote+'/']);
  await sshCommand('pct exec 154 -- mkdir -m 700 '+quote(containerTemporary));containerCreated=true;
  for(const file of ['release.tar.gz','runtime.env','site-release-activate.sh'])await sshCommand('pct push 154 '+quote(remote+'/'+file)+' '+quote(containerTemporary+'/'+file)+' --perms 0600');
  const install=`set -eu
umask 077
test ! -e ${quote(destination)}
mkdir -p ${quote(base+'/releases')}
if test -e ${quote(base+'/runtime.env')}; then
  cmp -s ${quote(base+'/runtime.env')} ${quote(containerTemporary+'/runtime.env')} || { echo 'Existing staging runtime differs; explicit configuration migration required'; exit 1; }
else
  install -m 600 ${quote(containerTemporary+'/runtime.env')} ${quote(base+'/runtime.env')}
fi
mkdir ${quote(destination)}
tar -xzf ${quote(containerTemporary+'/release.tar.gz')} -C ${quote(destination)}
install -m 700 ${quote(containerTemporary+'/site-release-activate.sh')} ${quote(base+'/site-release-activate.sh')}
bash ${quote(base+'/site-release-activate.sh')} staging ${quote(manifest.id)} --apply
`;
  await sshCommand('pct exec 154 -- sh -c '+quote(install));
  console.info(JSON.stringify({installed:true,id:manifest.id,target:'staging',privateHealthVerified:true,productionUnchanged:true,dnsOrEdgeChanges:false,next:'Apply staging-only DNS/edge after private health; validate public TLS before browser'}));
}finally{
  if(containerCreated)await sshCommand('pct exec 154 -- rm -rf -- '+quote(containerTemporary)).catch(()=>{});
  if(remoteCreated)await sshCommand('rm -rf -- '+quote(remote)).catch(()=>{});
  await rm(temporary,{recursive:true,force:true});
}
