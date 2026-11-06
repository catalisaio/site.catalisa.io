import assert from 'node:assert/strict';
import {mkdir,mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {checkArtifact} from './site-release-preflight.mjs';
const temporary=await mkdtemp(join(tmpdir(),'site-review-release-'));
const directory=join(temporary,'artifact'),server=join(temporary,'server');
const checks=[];
function run(args,success=true){const value=spawnSync(process.execPath,args,{encoding:'utf8'});assert.equal(value.status===0,success,value.stderr||value.stdout);return value;}
try{
 await mkdir(directory);await mkdir(server);
 for(const name of ['index.html','404.html','robots.txt','sitemap.xml'])await writeFile(join(directory,name),'fixture-'+name);
 await writeFile(join(directory,'site-hosting.caddy'),'handle {\n root * /srv\n try_files {path} =404\n file_server\n}\nhandle_errors 404 {\n header X-Robots-Tag "noindex, nofollow"\n respond "fixture404" 404\n}\n');
 await writeFile(join(directory,'site-build.json'),JSON.stringify({redesign:true,indexing:true}));
 for(const name of ['site-server.mjs','package.json','package-lock.json'])await writeFile(join(server,name),'fixture-'+name);
 assert((await checkArtifact(directory,'staging')).includes('staging artifact allows indexing'));checks.push('default staging rejects production-indexable artifact');
 assert((await checkArtifact(directory,'staging',{reviewProductionArtifact:true})).includes('production artifact review requires HTTPS staging target'));checks.push('review requires HTTPS staging');
 assert((await checkArtifact(directory,'production',{reviewProductionArtifact:true,httpsStaging:true})).includes('production artifact review requires HTTPS staging target'));checks.push('review cannot target production');
 assert.deepEqual(await checkArtifact(directory,'production'),[]);assert.deepEqual(await checkArtifact(directory,'staging',{reviewProductionArtifact:true,httpsStaging:true}),[]);
 await writeFile(join(directory,'site-build.json'),JSON.stringify({redesign:true,indexing:false}));
 assert.deepEqual(await checkArtifact(directory,'staging'),[]);assert((await checkArtifact(directory,'staging',{reviewProductionArtifact:true,httpsStaging:true})).includes('production review artifact must enable indexing at build time'));checks.push('normal staging requires noindex; review requires production bytes');
 await writeFile(join(directory,'site-build.json'),JSON.stringify({redesign:true,indexing:true}));
 const review=join(temporary,'review'),production=join(temporary,'production');
 run(['scripts/site-release-prepare.mjs','--target=staging','--https-staging=true','--review-production-artifact=true','--id=fixture-review','--dist='+directory,'--server='+server,'--out='+review]);
 run(['scripts/site-release-prepare.mjs','--target=production','--edge-private=true','--id=fixture-production','--dist='+directory,'--server='+server,'--out='+production]);
 const reviewManifest=JSON.parse(await readFile(join(review,'release.json'),'utf8')),productionManifest=JSON.parse(await readFile(join(production,'release.json'),'utf8'));
 assert.equal(reviewManifest.publicArtifactSha256,productionManifest.publicArtifactSha256);assert.equal(reviewManifest.serverArtifactSha256,productionManifest.serverArtifactSha256);checks.push('prepared review and production public/server hashes match exactly');
 assert.equal(reviewManifest.target,'staging');assert.equal(reviewManifest.reviewProductionArtifact,true);assert.equal(reviewManifest.port,18181);assert.equal(reviewManifest.bindHost,'172.10.0.202');assert.equal(productionManifest.reviewProductionArtifact,false);assert.equal(productionManifest.port,18182);checks.push('separate target/port and explicit manifest protection');
 const envFile=join(temporary,'staging.env');await writeFile(envFile,Object.entries({SITE_SESSION_SECRET:'fixture-secret-'.repeat(4),SITE_ALLOWED_ORIGINS:'https://site-staging.catalisa.io',SITE_CATALISA_ORIGIN:'https://panel-api.wpp.bb.stg.catalisa.app',SITE_CATALISA_TOKEN:'fixture',SITE_CATALISA_OWNER_EMAIL:'admin@catalisa.app',SITE_CATALISA_AGENT_ID:'fixture',SITE_STORE:'catalisa',SITE_STORE_COLLECTION:'site_catalisa_sessions_v1',SITE_HANDOFF_BACKEND:'site-inbox',SITE_HANDOFF_CHANNELS:'here',SITE_INBOX_COLLECTION:'site_catalisa_inbox_v1'}).map(([key,value])=>key+'='+value).join('\n'),{mode:0o600});
 run(['scripts/site-staging-install.mjs','--release='+review,'--env-file='+envFile],false);
 const plan=run(['scripts/site-staging-install.mjs','--release='+review,'--env-file='+envFile,'--review-production-artifact=true']);assert.equal(JSON.parse(plan.stdout).plan.reviewProductionArtifact,true);checks.push('installer rejects implicit review and accepts explicit protected plan without network');
 await writeFile(join(review,'site-review-hosting.caddy'),'invalid overlay');run(['scripts/site-staging-install.mjs','--release='+review,'--env-file='+envFile,'--review-production-artifact=true'],false);checks.push('installer rejects modified protection overlay');
 // Green is an isolated second production slot, never a rebuild of the public blue project.
 const green=join(temporary,'green'),reviewGreen=join(temporary,'review-green');
 run(['scripts/site-release-prepare.mjs','--target=staging','--https-staging=true','--review-production-artifact=true','--id=fixture-green','--dist='+directory,'--server='+server,'--out='+reviewGreen]);
 run(['scripts/site-release-prepare.mjs','--target=production','--edge-private=true','--production-slot=green','--id=fixture-green','--dist='+directory,'--server='+server,'--out='+green]);
 run(['scripts/site-release-prepare.mjs','--target=staging','--production-slot=green','--dist='+directory,'--server='+server,'--out='+join(temporary,'rejected-stage-slot')],false);
 const greenManifestBytes=await readFile(join(green,'release.json')),greenManifest=JSON.parse(greenManifestBytes),greenCompose=await readFile(join(green,'compose.yaml'),'utf8');
 assert.equal(greenManifest.port,18183);assert.equal(greenManifest.productionSlot,'green');assert.match(greenCompose,/image: catalisa-site-production-green-api:fixture-green/);assert.match(greenCompose,/ports: \["172\.10\.0\.202:18183:80"\]/);assert.match(greenCompose,/env_file: \[\.\.\/\.\.\/runtime\.env\]/);
 const productionEnv=join(temporary,'production-runtime.env');await writeFile(productionEnv,(await readFile(envFile,'utf8')).replace('https://site-staging.catalisa.io','https://catalisa.io').replace('https://panel-api.wpp.bb.stg.catalisa.app','https://panel-api.wpp.bb.catalisa.app'),{mode:0o600});
 const installArgs=['scripts/site-production-install.mjs','--release='+green,'--staging-release='+reviewGreen,'--env-file='+productionEnv];
 const greenPlan=JSON.parse(run(installArgs).stdout);assert.equal(greenPlan.plan.port,18183);assert.equal(greenPlan.plan.project,'catalisa-site-production-green');assert.equal(greenPlan.plan.destination,'/opt/apps/catalisa-site-production-green/releases/fixture-green');
 run([...installArgs,'--apply=true'],false);checks.push('green fixture isolates port18183, image/project/private base and rejects apply without authorization');
 const approvalFile=join(temporary,'approval-green.json'),approval={releaseId:'fixture-green',userAuthorizedProduction:true,stagingValidated:true,userMessage:'Local fixture only; never applied',stagingEvidence:'Local equal public/server SHA fixture',authorizedAt:new Date().toISOString(),publicArtifactSha256:greenManifest.publicArtifactSha256,serverArtifactSha256:greenManifest.serverArtifactSha256,releaseManifestSha256:createHash('sha256').update(greenManifestBytes).digest('hex')};
 await writeFile(approvalFile,JSON.stringify(approval),{mode:0o600});run([...installArgs,'--approval-record='+approvalFile],false);
 approval.previousPort=18182;approval.candidatePort=18183;await writeFile(approvalFile,JSON.stringify(approval));assert.equal(JSON.parse(run([...installArgs,'--approval-record='+approvalFile]).stdout).plan.approvalRecorded,true);
 await writeFile(join(green,'release.json'),JSON.stringify({...greenManifest,port:18182}));run(installArgs,false);await writeFile(join(green,'release.json'),greenManifestBytes);
 await writeFile(join(green,'compose.yaml'),greenCompose+'\n# tampered');run(installArgs,false);await writeFile(join(green,'compose.yaml'),greenCompose);
 checks.push('green approval binds exact staged SHA, manifest SHA and18182→18183; slot/port and compose tampering rejected');
 // Execute only the extracted Python guards against temporary local router files.
 const cutover=await readFile('scripts/site-production-cutover.sh','utf8');
 assert.match(cutover,/--resolve catalisa\.io:443:127\.0\.0\.1/);
 function guard(marker,argv,success=true){const start=cutover.indexOf(marker);assert(start>=0);const begin=cutover.indexOf("<<'PY'\n",start)+7,end=cutover.indexOf('\nPY',begin);const body=cutover.slice(begin,end);const result=spawnSync('python3',['-c',body,...argv],{encoding:'utf8'});assert.equal(result.status===0,success,result.stderr);}
 const router=join(temporary,'router.yml'),backup=join(temporary,'backup.yml'),blue='http://172.10.0.202:18182',greenUrl='http://172.10.0.202:18183',old='http:\n  services:\n    catalisa-io-svc:\n      loadBalancer:\n        servers:\n          - url: '+blue+'\n';
 await writeFile(backup,old);await writeFile(router,old);
 const retryMarker='python3 - "$backup" "$route" "$previous" "$candidate"';guard(retryMarker,[backup,router,blue,greenUrl]);
 await writeFile(router,old.replace(blue,greenUrl));guard(retryMarker,[backup,router,blue,greenUrl]);
 await writeFile(router,old+'# unrelated change\n');guard(retryMarker,[backup,router,blue,greenUrl],false);
 const recordMarker='python3 - "$record" "$release" "$previous_port" "$candidate_port"';guard(recordMarker,[approvalFile,'fixture-green','18182','18183']);guard(recordMarker,[approvalFile,'fixture-green','18183','18182'],false);
 await writeFile(router,old.replace(blue,greenUrl));guard('python3 - "$route" "$previous" "$candidate" <<',[router,blue,greenUrl],false);
 assert.equal(spawnSync('bash',['-n','scripts/site-release-activate.sh','scripts/site-production-cutover.sh']).status,0);
 checks.push('cutover guards preserve blue rollback, allow identical confirmation retry, reject unrelated changes/reversed port approval/unrecorded cutover and retain trusted local443 TLS');
 const report={date:new Date().toISOString(),passed:true,scope:'Small local fixtures and command plans only; no build, browser, network, container or deployment. Caddy runtime validation is separate.',checks,remoteChanges:false};
 await mkdir('docs/redesign-2026-10-22/qa/release',{recursive:true});await writeFile('docs/redesign-2026-10-22/qa/release/review-production-artifact.json',JSON.stringify(report,null,2)+'\n');console.info(JSON.stringify(report));
}finally{await rm(temporary,{recursive:true,force:true});}
