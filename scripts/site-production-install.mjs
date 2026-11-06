import{readFile,writeFile,lstat,readdir,realpath,mkdtemp,chmod,copyFile,rm}from'node:fs/promises';
import{resolve,join,basename,relative,isAbsolute}from'node:path';
import{createHash}from'node:crypto';
import{tmpdir}from'node:os';
import{spawn}from'node:child_process';
import{parseEnv}from'node:util';
import{checkArtifact,checkEnvironment}from'./site-release-preflight.mjs';

// Installs ONLY CT154's private production candidate. Edge, DNS, the current
// public website, the panel and building-block services are outside this script.
const args=Object.fromEntries(process.argv.slice(2).map(value=>value.replace(/^--/,'').split(/=(.*)/s).slice(0,2)));
const allowed=new Set(['release','staging-release','env-file','approval-record','apply']);
for(const key of Object.keys(args))if(!allowed.has(key))throw Error('Unknown installer argument: '+key);
if(!args.release||!args['staging-release']||!args['env-file'])throw Error('Use --release=PRODUCTION_DIRECTORY --staging-release=VALIDATED_STAGING_DIRECTORY --env-file=production-runtime.env [--approval-record=PRIVATE_JSON] [--apply=true]');
if(args.apply!==undefined&&!['true','false'].includes(args.apply))throw Error('--apply must be true or false');
const applying=args.apply==='true',release=resolve(args.release),stagingRelease=resolve(args['staging-release']),envFile=resolve(args['env-file']);
const sha256=value=>createHash('sha256').update(value).digest('hex');
const digestPattern=/^[a-f0-9]{64}$/;
const manifestBytes=await readFile(join(release,'release.json'));
const manifest=JSON.parse(manifestBytes.toString('utf8'));
const staging=JSON.parse(await readFile(join(stagingRelease,'release.json'),'utf8'));
if(manifest.productionSlot!==undefined&&manifest.productionSlot!=='green')throw Error('Unsupported production slot');
const productionSlot=manifest.productionSlot??'',port=productionSlot==='green'?18183:18182,project='catalisa-site-production'+(productionSlot==='green'?'-green':'');
if(manifest.target!=='production'||manifest.port!==port||manifest.bindHost!=='172.10.0.202'||manifest.edgePrivate!==true||manifest.reviewProductionArtifact!==false||manifest.httpsStaging!==false||typeof manifest.id!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(manifest.id))throw Error('Only prepared private-interface production releases on 172.10.0.202 on the matching default18182/green18183 slot are accepted');
if(staging.target!=='staging'||staging.port!==18181||staging.bindHost!=='172.10.0.202'||staging.reviewProductionArtifact!==true||staging.httpsStaging!==true||staging.id!==manifest.id)throw Error('Matching HTTPS production-artifact staging manifest required');
const treeSha256=(files,prefix)=>sha256(JSON.stringify(Object.fromEntries(Object.entries(files).filter(([name])=>name.startsWith(prefix+'/')).map(([name,hash])=>[name.slice(prefix.length+1),hash]).sort(([left],[right])=>left.localeCompare(right)))));
async function verifyRelease(directory,value){
 if(!(await lstat(directory)).isDirectory())throw Error('Release must be a real directory');
 if(!value.files||Array.isArray(value.files)||typeof value.files!=='object')throw Error('Invalid release file manifest');
 for(const[name,hash]of Object.entries(value.files))if(name.startsWith('/')||name.includes('\\')||name.split('/').some(part=>!part||part==='.'||part==='..')||/[\x00-\x1f]/.test(name)||name==='release.json'||!digestPattern.test(hash))throw Error('Unsafe release file manifest');
 const found=[];
 async function inspect(directory,prefix=''){
  for(const entry of await readdir(directory,{withFileTypes:true})){
   const name=prefix+entry.name,file=join(directory,entry.name);
   if(entry.isSymbolicLink()||!entry.isDirectory()&&!entry.isFile())throw Error('Unsupported release entry');
   if(entry.isDirectory())await inspect(file,name+'/');
   else if(name!=='release.json'){
    if(!Object.hasOwn(value.files,name)||sha256(await readFile(file))!==value.files[name])throw Error('Release integrity mismatch: '+name);
    found.push(name);
   }
  }
 }
 await inspect(directory);
 if(found.length!==Object.keys(value.files).length)throw Error('Release manifest contains absent files');
 for(const prefix of['public','server'])if(!digestPattern.test(value[prefix+'ArtifactSha256']??'')||treeSha256(value.files,prefix)!==value[prefix+'ArtifactSha256'])throw Error('Invalid '+prefix+' tree digest');
 for(const name of['site-server.mjs','package.json','package-lock.json'])if(!Object.hasOwn(value.files,'server/'+name))throw Error('Server package missing required file');
}
await verifyRelease(release,manifest);await verifyRelease(stagingRelease,staging);
for(const key of['publicArtifactSha256','serverArtifactSha256'])if(manifest[key]!==staging[key])throw Error('Production differs from the validated staging '+key);
if(basename(envFile)!=='production-runtime.env')throw Error('Use the private production-runtime.env source file');
const envStat=await lstat(envFile);if(!envStat.isFile()||(envStat.mode&0o777)!==0o600)throw Error('Private production env must be a regular file with mode600');
async function requireOutsideBuildContexts(file){const canonical=await realpath(file);for(const directory of[release,stagingRelease]){const inside=relative(await realpath(directory),canonical);if(!inside||inside!=='..'&&!inside.startsWith('../')&&!isAbsolute(inside))throw Error('Private files must be outside release/build contexts');}}
await requireOutsideBuildContexts(envFile);
const envBytes=await readFile(envFile),env=parseEnv(envBytes.toString('utf8'));
const failures=[...checkEnvironment(env,'production'),...await checkArtifact(join(release,'public'),'production')];
const caddy=await readFile(join(release,'Caddyfile'),'utf8'),compose=await readFile(join(release,'compose.yaml'),'utf8');
if(!caddy.includes('@unexpected_peer not remote_ip 172.10.0.105 172.10.0.202 127.0.0.1 ::1')||!caddy.includes('import /etc/caddy/site-hosting.caddy')||caddy.includes('site-review-hosting.caddy'))failures.push('private production Caddy guard missing');
if(!compose.includes('ports: ["172.10.0.202:'+port+':80"]')||!compose.includes('env_file: [../../runtime.env]')||!compose.includes('image: '+project+'-api:'+manifest.id.toLowerCase()))failures.push('production compose target differs');
if(failures.length)throw Error('Production preflight failed: '+failures.join(', '));
const releaseManifestSha256=sha256(manifestBytes);
let approvalBytes;
if(args['approval-record']){
 const file=resolve(args['approval-record']),fileStat=await lstat(file);
 if(!fileStat.isFile()||(fileStat.mode&0o777)!==0o600)throw Error('Approval record must be a regular file with mode600');
 await requireOutsideBuildContexts(file);
 approvalBytes=await readFile(file);const approval=JSON.parse(approvalBytes.toString('utf8'));
 const nonempty=value=>typeof value==='string'&&value.trim().length>0;
 const evidence=nonempty(approval.stagingEvidence)||Array.isArray(approval.stagingEvidence)&&approval.stagingEvidence.length>0&&approval.stagingEvidence.every(nonempty);
 if(approval.releaseId!==manifest.id||approval.userAuthorizedProduction!==true||approval.stagingValidated!==true||!nonempty(approval.userMessage)||!evidence||!nonempty(approval.authorizedAt)||!Number.isFinite(Date.parse(approval.authorizedAt))||Date.parse(approval.authorizedAt)>Date.now()+300000)throw Error('Explicit user production authorization and staging evidence required in approval record');
 if(productionSlot==='green'||approval.previousPort!==undefined||approval.candidatePort!==undefined){if(![8081,18182,18183].includes(approval.previousPort)||approval.candidatePort!==port||approval.previousPort===approval.candidatePort)throw Error('Approval record must bind the previous and candidate production ports');}
 for(const[key,wanted]of Object.entries({publicArtifactSha256:manifest.publicArtifactSha256,serverArtifactSha256:manifest.serverArtifactSha256,releaseManifestSha256}))if(approval[key]!==wanted)throw Error('Approval record digest mismatch: '+key);
}
if(applying&&!approvalBytes)throw Error('--apply=true requires --approval-record=PRIVATE_JSON with explicit user authorization');
const base='/opt/apps/'+project,destination=base+'/releases/'+manifest.id;
console.info(JSON.stringify({plan:{node:'177.104.184.34',container:154,target:'production',id:manifest.id,destination,port,productionSlot:productionSlot||'default',project,bindHost:'172.10.0.202',stagingArtifactMatches:true,publicArtifactSha256:manifest.publicArtifactSha256,serverArtifactSha256:manifest.serverArtifactSha256,releaseManifestSha256,privateEnv:'production-runtime.env -> outside release as runtime.env, mode600',dependencyInstall:'Docker Node22: npm ci --omit=dev --ignore-scripts',approvalRecorded:!!approvalBytes,publicCutover:false,dnsOrEdgeChanges:false,panelOrBuildingBlockChanges:false},apply:applying}));
if(!applying)process.exit(0);
const quote=value=>"'"+value.replace(/'/g,"'\\''")+"'";
const run=(command,argv)=>new Promise((accept,reject)=>{
 const child=spawn(command,argv,{stdio:['ignore','pipe','pipe']});
 // Runtime configuration and authorization contents never enter tool output.
 child.stdout.resume();child.stderr.resume();child.on('error',()=>reject(Error(command+' failed to start')));child.on('close',code=>code===0?accept():reject(Error(command+' failed (exit '+code+'); private production installation stopped')));
});
const sshCommand=script=>run('ssh',['-n','-o','BatchMode=yes','-o','ConnectTimeout=15','root@177.104.184.34',script]);
const temporary=await mkdtemp(join(tmpdir(),'catalisa-site-production-')),remote='/tmp/catalisa-site-production-'+manifest.id+'-'+process.pid;
let remoteCreated=false,containerCreated=false;
try{
 await run('tar',['-czf',join(temporary,'release.tar.gz'),'-C',release,'.']);await chmod(join(temporary,'release.tar.gz'),0o600);
 await writeFile(join(temporary,'production-runtime.env'),envBytes,{mode:0o600});await writeFile(join(temporary,'approval.json'),approvalBytes,{mode:0o600});
 await copyFile('scripts/site-release-activate.sh',join(temporary,'site-release-activate.sh'));await chmod(join(temporary,'site-release-activate.sh'),0o600);
 await sshCommand('umask 077; mkdir '+quote(remote));remoteCreated=true;
 const transportFiles=['release.tar.gz','production-runtime.env','approval.json','site-release-activate.sh'];
 await run('scp',['-q','-o','BatchMode=yes','-o','ConnectTimeout=15',...transportFiles.map(file=>join(temporary,file)),'root@177.104.184.34:'+remote+'/']);
 await sshCommand('pct exec 154 -- mkdir -m 700 '+quote(remote));containerCreated=true;
 for(const file of transportFiles)await sshCommand('pct push 154 '+quote(remote+'/'+file)+' '+quote(remote+'/'+file)+' --perms 0600');
 const install=`set -eu
umask 077
test ! -e ${quote(destination)}
mkdir -p ${quote(base+'/releases')}
if test -e ${quote(base+'/runtime.env')}; then
 test ! -L ${quote(base+'/runtime.env')}
 cmp -s ${quote(base+'/runtime.env')} ${quote(remote+'/production-runtime.env')} || { echo 'Existing production runtime differs; explicit configuration migration required'; exit 1; }
else
 install -m 600 ${quote(remote+'/production-runtime.env')} ${quote(base+'/runtime.env')}
fi
mkdir ${quote(destination)}
tar -xzf ${quote(remote+'/release.tar.gz')} -C ${quote(destination)}
python3 - ${quote(destination)} ${quote(releaseManifestSha256)} <<'PY'
import hashlib,json,pathlib,sys
base=pathlib.Path(sys.argv[1]); raw=(base/'release.json').read_bytes()
assert hashlib.sha256(raw).hexdigest()==sys.argv[2], 'Approved manifest digest mismatch'
m=json.loads(raw); found=set()
for p in base.rglob('*'):
 assert not p.is_symlink(), 'Release contains symlink'
 if p.is_dir(): continue
 assert p.is_file(), 'Unsupported release entry'
 name=p.relative_to(base).as_posix()
 if name=='release.json': continue
 assert name in m['files'], 'Unexpected release file'
 assert hashlib.sha256(p.read_bytes()).hexdigest()==m['files'][name], 'File digest mismatch'
 found.add(name)
assert found==set(m['files']), 'Release file set mismatch'
PY
mkdir -p -m 700 ${quote(base+'/approvals')}
chmod 700 ${quote(base+'/approvals')}
if test -e ${quote(base+'/approvals/'+manifest.id+'.json')}; then
 test ! -L ${quote(base+'/approvals/'+manifest.id+'.json')}
 test "$(stat -c %a ${quote(base+'/approvals/'+manifest.id+'.json')})" = 600
 cmp -s ${quote(base+'/approvals/'+manifest.id+'.json')} ${quote(remote+'/approval.json')}
else
 install -m 600 ${quote(remote+'/approval.json')} ${quote(base+'/approvals/'+manifest.id+'.json')}
fi
install -m 700 ${quote(remote+'/site-release-activate.sh')} ${quote(base+'/site-release-activate.sh')}
SITE_PRODUCTION_SLOT=${quote(productionSlot)} SITE_PRODUCTION_APPROVAL=${quote(manifest.id)} bash ${quote(base+'/site-release-activate.sh')} production ${quote(manifest.id)} --apply
`;
 await sshCommand('pct exec 154 -- sh -c '+quote(install));
 console.info(JSON.stringify({installed:true,id:manifest.id,target:'production',privateHealthVerified:true,approvalArchived:true,publicCutover:false,dnsOrEdgeChanges:false,panelOrBuildingBlockChanges:false,next:'Root validates the private candidate before a separately authorized edge cutover.'}));
}finally{
 if(containerCreated)await sshCommand('pct exec 154 -- rm -rf -- '+quote(remote)).catch(()=>{});
 if(remoteCreated)await sshCommand('rm -rf -- '+quote(remote)).catch(()=>{});
 await rm(temporary,{recursive:true,force:true});
}
