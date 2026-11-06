import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const catalog=JSON.parse(await readFile('src/redesign/data/catalog.json','utf8'));
const reviews=JSON.parse(await readFile('docs/redesign-2026-10-22/editorial-review-register.json','utf8'));
const repo='/home/klederson/Projects/building-blocks-v2';
const checkedAt=new Date().toISOString(),items=[];
for(const block of catalog.blocks){
 const sourceDirectory=join(repo,'src',block.slug),readme=join(sourceDirectory,'README.md');
 let modulePresent=false,sourceEvidence=null;
 try{modulePresent=(await stat(sourceDirectory)).isDirectory();}catch{}
 try{const content=await readFile(readme,'utf8');let lastSourceCommitAt=null;try{lastSourceCommitAt=execFileSync('git',['-C',repo,'log','-1','--format=%cI','--','src/'+block.slug+'/README.md'],{encoding:'utf8',timeout:3000}).trim()||null;}catch{}
  sourceEvidence={path:readme,sha256:createHash('sha256').update(content).digest('hex'),lastSourceCommitAt,kind:'Repository documentation exists; no runtime test or delivery proof'};
 }catch{}
 const review=reviews.items.find(item=>item.id==='block:'+block.slug);
 items.push({slug:block.slug,name:block.name,declaredMaturity:block.status,declaredClaim:block.tagline,declaredSource:block.source,materialSnapshotAt:'2026-10-22',catalogItemSha256:createHash('sha256').update(JSON.stringify(block)).digest('hex'),checkedAt,modulePresent,sourceEvidence,sourceLinkHttpChecked:false,productionAvailabilityVerified:false,reviewOwner:review?.reviewOwner??null,ownerDecision:review?.ownerDecision??null,reviewState:review?.status??'missing-review-record',assessment:sourceEvidence?'Source document located; declared maturity/claim still require product-owner approval and scoped operational evidence':'No per-block README found at the expected source path; source and claim need manual review'});
}
if(items.length!==39||new Set(items.map(item=>item.slug)).size!==39)throw Error('Expected all39 unique handoff capabilities');
const report={checkedAt,scope:'Offline39-capability source/claim inventory; no product, block or public-site changes; no inference, HTTP source check or production capability tests',catalogSource:catalog.source,repository:repo,summary:{capabilities:items.length,sourceReadmes:items.filter(i=>i.sourceEvidence).length,moduleDirectories:items.filter(i=>i.modulePresent).length,approvedByProductOwner:items.filter(i=>i.ownerDecision?.status==='approved').length,runtimeAvailabilityVerified:0},items};
const directory='docs/redesign-2026-10-22/qa/capability-curation';await mkdir(directory,{recursive:true});
await writeFile(join(directory,'inventory.json'),JSON.stringify(report,null,2)+'\n');
const md=['# Curadoria das39 capacidades','',`Verificado em ${checkedAt}. Inventário de fontes e alegações; **não certifica disponibilidade em produção nem substitui aprovação do responsável de produto**. Nenhuma alteração nos blocos, painel ou composição pública.`, '',`Cobertura:39/39 itens; ${report.summary.sourceReadmes} READMEs encontrados no repositório de blocos; ${report.summary.moduleDirectories} diretórios de módulo; ${report.summary.approvedByProductOwner} decisões de aprovação registradas. Datas de commit indicam revisão do arquivo-fonte, não implantação. Links HTTP não foram exercitados nesta auditoria offline.`, '', '| Capacidade | Estágio declarado no handoff | Fonte no repositório | Último commit da fonte | Aprovação do responsável |','|---|---|---|---|---|',...items.map(i=>`| ${i.name} | ${i.declaredMaturity} | ${i.sourceEvidence?'src/'+i.slug+'/README.md':'README não localizado'} | ${i.sourceEvidence?.lastSourceCommitAt?.slice(0,10)??'não verificado'} | ${i.ownerDecision?.status??'pendente'} |`),'','Cada item do [inventário](inventory.json) inclui a frase pública exata, URL declarada, snapshot2026-10-22, hash do item, caminho/hash da documentação encontrada, data real do commit e decisão do registro editorial. “Produção”, “Beta” e “Alpha” são rótulos declarados do material recebido; existência de diretório/README não comprova funcionalidade, contratação, integração externa ou homologação.', '', 'As capturas em `resource-captures.json` identificam material histórico/protótipos e não são observação ao vivo. O registro `editorial-review-register.json` conserva responsáveis/decisões pendentes: `admin@catalisa.app` é contato operacional fornecido pelo usuário, não aprovação editorial presumida. Antes de declarar H11 concluído, revisar alegações/maturidade e registrar decisão sobre os hashes atuais.',''];
await writeFile(join(directory,'README.md'),md.join('\n'));
console.info(JSON.stringify({checkedAt,...report.summary,report:join(directory,'inventory.json'),productionCertification:false}));
