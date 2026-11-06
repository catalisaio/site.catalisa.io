/** Refresh provenance without converting technical preparation into product approval. */
import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const file='docs/redesign-2026-10-22/editorial-review-register.json';
let previous={items:[]};try{previous=JSON.parse(await fs.readFile(file,'utf8'));}catch(reason){if(reason.code!=='ENOENT')throw reason;}
const old=new Map(previous.items.map(item=>[item.id,item]));
const preparedAt=new Date().toISOString(),items=[];
function add(id,kind,dataFile,entry,source,materialSnapshotAt){
 const evidenceSha256=createHash('sha256').update(JSON.stringify(entry)).digest('hex'),prior=old.get(id);
 const candidate=prior?.ownerDecision;
 const validDecision=candidate?.evidenceSha256===evidenceSha256&&['approved','rejected'].includes(candidate.status)&&typeof candidate.reviewedBy==='string'&&candidate.reviewedBy===prior.reviewOwner&&candidate.reviewedBy.trim()&&Number.isFinite(Date.parse(candidate.reviewedAt))&&Date.parse(candidate.reviewedAt)<=Date.now();
 const decision=validDecision?candidate:null;
 items.push({id,kind,dataFile,title:entry.name??entry.title??entry.path,source,materialSnapshotAt:materialSnapshotAt??null,evidenceSha256,operationalContact:'admin@catalisa.app',reviewOwner:prior?.reviewOwner??null,lastOwnerReviewAt:decision?.reviewedAt??null,sourceCheckedAt:prior?.evidenceSha256===evidenceSha256?prior?.sourceCheckedAt??null:null,status:decision?.status??'pending-owner-review',ownerDecision:decision,proposedReviewIntervalDays:30});
}
const catalogFile='src/redesign/data/catalog.json',catalog=JSON.parse(await fs.readFile(catalogFile,'utf8'));
for(const block of catalog.blocks)add('block:'+block.slug,'capability',catalogFile,block,block.source,'2026-10-22');
for(const family of ['financial','operation','resource']){const dataFile='src/redesign/data/'+family+'-captures.json';for(const capture of JSON.parse(await fs.readFile(dataFile,'utf8')))add('capture:'+family+':'+capture.file,'capture',dataFile,capture,capture.source??capture.origin,null);}
const editorialFile='src/redesign/data/editorial.json';for(const article of JSON.parse(await fs.readFile(editorialFile,'utf8')))add('editorial:'+article.path,'editorial',editorialFile,article,article.source??'Frozen handoff N01 / v1.1','2026-10-22');
await fs.writeFile(file,JSON.stringify({schemaVersion:1,preparedAt,status:'pending-owner-review',notice:'Operational contact was supplied by the user. It is not evidence of product approval or an accepted editorial assignment.',procedure:['Choose and confirm reviewOwner for each item.','Review source and exact content identified by evidenceSha256; record sourceCheckedAt.','Record ownerDecision {status,reviewedBy,reviewedAt,evidenceSha256}; statuses are approved or rejected.','Regeneration preserves a decision only while the exact source item hash matches. Changed material becomes pending again.','Review interval of 30 days is proposed and needs owner confirmation; do not silently refresh facts or maturity labels.'],items},null,2)+'\n');
console.log(JSON.stringify({file,items:items.length,pending:items.filter(item=>item.status==='pending-owner-review').length,productApprovalClaimed:false}));
