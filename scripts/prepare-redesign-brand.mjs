import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

// User clarification, 23/10: the supplied ZIP contains the new identity.
// Preserve its exports and archive; the wider brand rollout is deferred.
export async function prepareBrandKit(){
  const source='docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/reference/site/dist/assets/brand';
  const folder='public/redesign/brand';
  await fs.mkdir(folder,{recursive:true});
  const entries=JSON.parse(await fs.readFile(path.join(source,'manifest.json'),'utf8'));
  const provenance=[];
  for(const file of (await fs.readdir(source)).sort()){
    const origin=path.join(source,file),bytes=await fs.readFile(origin);
    await fs.writeFile(path.join(folder,file),bytes);
    provenance.push({file,publicPath:'/redesign/brand/'+file,origin,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  const result={source,decision:'D15',entries,svgCount:provenance.filter(item=>item.file.endsWith('.svg')).length,pngCount:provenance.filter(item=>item.file.endsWith('.png')).length,provenance};
  await fs.writeFile('src/redesign/data/brand-kit.json',JSON.stringify(result,null,2)+'\n');
  return result;
}
