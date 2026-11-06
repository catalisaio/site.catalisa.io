import fs from 'node:fs/promises';
import path from 'node:path';
import {parse} from 'dotenv';
const argument=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const directory=path.resolve(argument('dist')||'/tmp/catalisa-release-candidate');
const env=parse(await fs.readFile(argument('env-file')||'.env.local'));
const secrets=Object.entries(env).filter(([key,value])=>!key.startsWith('VITE_')&&/(?:TOKEN|SECRET|PASSWORD|SERVICE_ROLE_KEY|PRIVATE_KEY)$/i.test(key)&&value.length>=16).map(([key,value])=>({key,bytes:Buffer.from(value)}));
if(!secrets.length)throw Error('No server secrets available for the artifact leak check');
const findings=[];let scannedFiles=0;
async function inspect(directoryPath){
  for(const entry of await fs.readdir(directoryPath,{withFileTypes:true})){
    const file=path.join(directoryPath,entry.name),relative=path.relative(directory,file);
    if(entry.isSymbolicLink()){findings.push({file:relative,issue:'symlink'});continue;}
    if(/^\.env|^\.local$|^node_modules$|\.sqlite(?:-|$)|\.pem$|\.key$/.test(entry.name))findings.push({file:relative,issue:'private file'});
    if(entry.isDirectory())await inspect(file);
    else if(entry.isFile()){
      const content=await fs.readFile(file);scannedFiles++;
      for(const secret of secrets)if(content.includes(secret.bytes))findings.push({file:relative,secretName:secret.key});
    }
  }
}
await inspect(directory);
const report={generatedAt:new Date().toISOString(),passed:findings.length===0,scannedFiles,secretNamesChecked:secrets.map(secret=>secret.key),findings,scope:'Private-file names and exact configured server secret values in the complete frontend artifact. Secret values never logged; this is not a general secret-discovery or penetration test.'};
const output=path.resolve(argument('output')||'docs/redesign-2026-10-22/qa/release/private-artifact.json');await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));
console.info(JSON.stringify(report));if(findings.length)process.exitCode=1;
