import collections
import os
import csv
import datetime
import hashlib
import importlib.util
import json
import pathlib
import re
import subprocess

spec = importlib.util.spec_from_file_location('collector', str(pathlib.Path(__file__).with_name('coletar.py')))
# Keep the collector's CLI independent of this reproducible analysis.
ROOT = pathlib.Path(os.environ.get('CATALISA_CORPUS_DIR', '/tmp/catalisa-retrospectiva-20261020'))
OUT = pathlib.Path(__file__).resolve().parent
OUT.mkdir(parents=True, exist_ok=True)
REPOS = {'wpp': '/home/klederson/Projects/wpp.bb.catalisa.io', 'bb': '/home/klederson/Projects/building-blocks-v2', 'developy': '/home/klederson/Projects/developy.cloud'}
CATEGORIES = [
 ('credito', 'Plataforma e produtos de crédito', r'credit|crédito|antecipa|receivab|consign|consórc|consorc|cedente|boleta|desembolso|liquida|medfund|fiduc|rural.loan|personal.loan|payroll.loan|pega.plant'),
 ('banking', 'Plataforma bancária e BaaS', r'banking|bancári|bancari|baas|pix|ted\b|bank|saldo|fund.account'),
 ('decision', 'Decision e decisão auditável', r'decision|decisão|decisao|\bdmn\b|\bfeel\b|mesa|veredito|champion|challenger'),
 ('garantias', 'Garantias, lastro e instrumentos', r'garantia|collateral|gravame|lastro|\blien\b|rebanho|livestock|covenant|\bcpr\b|debênt|debent|ccb\b|instrument|property|vehicle'),
 ('formalizacao', 'Formalização e assinatura', r'formaliza|assinatura|e.signature|esignature|opensign|signing|signature|document.template|termo|contrato.mestre'),
 ('carteira', 'Carteira, provisão e pós crédito', r'provis|\bscr\b|aging|carteira|portfolio|renegoc|novação|novacao|monitor.*crédito|monitor.*credit|parcela|installment'),
 ('cobranca', 'Cobrança e recebimentos', r'cobran|cobrança|collections|boleto|régua|regua|pagamento|payment|merchant.charg'),
 ('ai_core', 'AI Core e provedores', r'ai.core|llm|multi.model|multi.provider|litellm|ollama|anthropic|openai|gemini|qwen|grok|provider.factory|token.account|prompt.cach'),
 ('assistant', 'Assistant, agentes e orquestração', r'ai.assistant|assistant|assistente|ai.orchestr|\bagent|\bagente|intent.router|skill|ai.insight|plan.mode|builder'),
 ('rag', 'RAG, conhecimento e conectores', r'conhecimento|knowledge|\brag\b|pgvector|embedding|chunk|semantic|vetori|database.connector|conector|data.extraction'),
 ('copiloto', 'Copiloto, vídeo e atendimento', r'copilot|copiloto|\brooms\b|video.meeting|videoch|vídeo|livekit|transcri|scribe|meeting.bot|teleconsulta|atendiment'),
 ('wpp', 'WhatsApp e canais de comunicação', r'\bwpp\b|whatsapp|baileys|cloud.api|meta.business|meta.account|jid|\blid\b|pairing|otp|qr.code|mensage|message|webhook'),
 ('workflow', 'Workflows e plataforma de automação', r'workflow|gatilho|trigger|\bdag\b|interpol|custom.action|action.handler|delay|buffer.message|dispatch.event|template|pacote|packages'),
 ('crm', 'CRM, relacionamento e metas', r'\bcrm\b|\blead|funil|pipeline|goal|metas|okr|routine|rotina|capture.link|user.profile|activities|consultoria'),
 ('identidade', 'Identidade, IAM e biometria', r'\biam\b|aegis|biometr|face.engine|onboarding|kyc|people|companies|pessoa|empresa|auth|login|role|papéis|permiss|access.grant|four.eyes|quatro.olhos|totp|otp|subaccount'),
 ('seguranca', 'Segurança e isolamento', r'secur|seguran|tenant|isolat|ssrf|idor|rce|xss|csp|sops|age\b|secret|segredo|cript|crypto|credential|credencial|jwt|hmac|mtls|tls|audit|compliance|lgpd|iso42001|mass.assignment|rate.limit'),
 ('ha', 'HA, escala, resiliência e desempenho', r'\bha\b|escal|scal|replica|affinity|afinidade|standby|patroni|failover|high.availability|pool|perf\b|performance|latência|latency|cache|concor|concorr|resilien|reconcil|auto.cura|self.heal|idempoten|lock|retry|redis.stream|bullmq|backpressure|circuit|memory|memória|timeout|não.bloque|non.block'),
 ('infra', 'Infraestrutura, rede e serviços gerenciados', r'proxmox|\bforge\b|\bmesh\b|\blaunch\b|\batlas\b|\bspark\b|\btide\b|\bflux\b|\bnexus\b|\bherald\b|\bignite\b|\bbeacon\b|\bcourier\b|\bharbor\b|\blxc\b|\bipam\b|ipv[46]|\bdns\b|traefik|haproxy|firewall|vnet|network|infra|storage|backup|restore|pbs|ceph|dnat|nat\b|certificate|certificado'),
 ('deploy', 'Entrega, CI CD e migrações', r'deploy|release|cutover|swarm|kubernetes|\bk3s\b|argocd|kamal|terraform|atlantis|\bci\b|runner|ghcr|registry|\bship\b|migration|migra|template.build|build.template|boot|docker'),
 ('observabilidade', 'Observabilidade e operação', r'observ|\bpulse\b|\bradar\b|\bsignal\b|otel|opentelemetry|telemetr|sentry|metric|métrica|health|saúde|trace|logs|diagnós|diagnos|alert|inciden|instrumentation|monitor'),
 ('dados', 'Dados, documentos e auditoria', r'data.store|datastore|jsonb|banco.de.dados|database|postgres|prisma|mysql|sql.server|drizzle|audit.trail|audit|file.storage|storage|document|export|import|reten|retention|csv|xlsx|pdf|pii'),
 ('monetizacao', 'Monetização e autosserviço', r'billing|cobran|fatura|invoice|checkout|stripe|subscription|assinatura|plano|precifica|pricing|payment|paywall|entitle|franquia|cota|quota|meter|usage|usage|trial|saved.card|off.session|onboarding'),
 ('integracoes', 'Integrações externas e SDKs', r'\bsdk\b|recruitcrm|mercado.livre|\bml\b|vtex|calendar|outlook|gmail|email|e.mail|mailgun|slack|open.finance|bureaus|celcoin|qi.tech|fitbank|traccar|pega.plant|api.key|sso'),
 ('ux', 'Experiência, design e acessibilidade', r'\bui\b|\bux\b|frontend|painel.cliente\)|panel.ui|design|theme|tema|token|datatable|styleguide|casca|shell|portal|console|hotsite|vitrine|revamp|moléc|molec|atomic|mobile|a11y|acessib|bilíng|biling|i18n|tour|wizard|canvas|modal'),
 ('verticais', 'Verticais e soluções comerciais', r'juríd|jurid|legal|clinic|clínic|\bmed\b|personal|trainer|recrut|recruit|ágora|agora|seguro|alper|fiduc|facila|petshop|adega|chria|yarok|consorcio|consórc|consign|antecip|garantia|rural|banking|biometr|decision|medfund'),
 ('qualidade', 'Qualidade e engenharia de produto', r'\btest|\bteste|jest|vitest|playwright|e2e|smoke|lint|typecheck|eslint|validat|valida|guard|catraca|coverage|cobertura|contract|parity|paridade|regression|regress'),
 ('documentacao', 'Documentação, pesquisa e estratégia', r'^docs|doc\b|documenta|readme|runbook|handoff|guia|plano|plan\b|spec|strategy|estrat|research|pesquisa|relatório|relatorio|report|dossiê|inventário|inventario|mapa|aprendizado|lições|licoes'),
 ('evolucao', 'Manutenção, simplificação e evolução', r'refactor|chore|cleanup|limpeza|remove|remov|legacy|legado|deprecat|rename|renome|migrat|revert|restaur|restore|dead.code|código.morto|depend|bump|version'),
]

def tags(title, paths=''):
    matched = [key for key, label, pat in CATEGORIES if re.search(pat, title, re.I)]
    if not matched:
        matched = [key for key, label, pat in CATEGORIES if re.search(pat, paths, re.I)][:5]
    return matched or ['evolucao']

redactions = collections.Counter()
CLIENT_NAMES = [
    (r'med[\s_-]*fund', 'operacao-saude'),
    (r'banco[\s_-]*pine', 'instituicao-financeira'),
    (r'\bpine\b', 'instituicao-financeira'),
    (r'p[aá]ssaro[\s_-]*marr[oó][mn]', 'operacao-transporte'),
    (r'yarok', 'consultoria'),
    (r'fiduc', 'operacao-investimentos'),
    (r'chria(?:[\s_-]*partners)?', 'consultoria-parceira'),
    (r'alper', 'operacao-seguros'),
    (r'facila', 'operacao-digital'),
    (r'medpay', 'operacao-recebiveis'),
    (r'pega[\s_-]*plant[aã]o', 'fonte-escalas'),
    (r'\bpega\b', 'fonte-escalas'),
]

def anonymize(value):
    if not isinstance(value, str): return value
    for pattern, replacement in CLIENT_NAMES:
        value, n = re.subn(pattern, replacement, value, flags=re.I)
        redactions['clientNames'] += n
    return value

def clean(value):
    if not isinstance(value, str): return value
    value = re.sub(r'(?i)Marcelo\s+Santos', '[nome omitido]', value)
    value = re.sub(r'(?i)\bMarcelo\b', '[nome omitido]', value)
    patterns = [r'\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{30,}|sk-(?:proj-)?[A-Za-z0-9_-]{24,}|xox[baprs]-[A-Za-z0-9-]{20,}|AKIA[0-9A-Z]{16})\b', r'\beyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\b', r'(?i)(?:postgres(?:ql)?|mysql|redis|rediss)://[^\s\x60<>]+', r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----']
    for pattern in patterns:
        value, n = re.subn(pattern, '[credencial suprimida]', value)
        redactions['tokens'] += n
    # Historical reports occasionally include concrete secrets in env snippets.
    value, n = re.subn(r'(?im)(\b(?:password|passwd|senha|api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|[A-Z_]*(?:SECRET|PASSWORD|MASTER_KEY|PRIVATE_KEY|API_KEY))[\x60\"\']*\s*[:=]\s*)([^\s,;\n]{8,})', r'\1[valor suprimido]', value)
    redactions['assignments'] += n
    return anonymize(value)

def git(key, args):
    return subprocess.run(['git', *args], cwd=REPOS[key], capture_output=True, text=True, check=True).stdout

dataset = {'period': {'start': '2024-10-20', 'end': '2026-10-20', 'timezone': 'America/Sao_Paulo'}, 'categories': [{'id': k, 'label': v} for k,v,_ in CATEGORIES], 'repositories': [], 'prs': [], 'commits': [], 'docs': [], 'modules': [], 'files': [], 'releases': []}
for key in REPOS:
    raw = ROOT / key
    snap = json.loads((raw / 'snapshot.json').read_text())
    ref = snap['sha']
    base = 'https://github.com/' + snap['repo']
    cs = json.loads((raw / 'commits-private.json').read_text())
    allshas = set(git(key, ['rev-list', ref]).splitlines())
    tree = json.loads((raw / 'tree.json').read_text())
    paths = {f['path'] for f in tree}
    snapshot = {**snap, 'key':key, 'testFiles':sum(bool(re.search(r'\.(spec|test)\.[cm]?[jt]sx?$', f['path'])) for f in tree)}
    prs = json.loads((raw / 'prs-all-private.json').read_text())
    dataset['repositories'].append(snapshot)
    for p in prs:
        dates = [p.get(k) for k in ['createdAt', 'mergedAt', 'closedAt'] if p.get(k)]
        if not any('2024-10-20T03:00:00Z' <= d < '2026-10-21T03:00:00Z' for d in dates): continue
        merge = (p.get('mergeCommit') or {}).get('oid')
        integrated = bool(merge and merge in allshas)
        known = bool(merge and subprocess.run(['git','cat-file','-e',merge],cwd=REPOS[key],capture_output=True).returncode==0)
        files = []
        if known:
            lines = git(key, ['diff-tree', '--root', '-m', '--no-commit-id', '--name-status', '-r', '--no-renames', merge + '^1', merge]).splitlines()
            for line in lines:
                bits=line.split('\t',1)
                if len(bits)==2:files.append({'status':bits[0],'path':bits[1]})
        date = (p['mergedAt'] or p['closedAt'] or p['createdAt'])
        localdate = datetime.datetime.fromisoformat(date.replace('Z','+00:00')).astimezone(datetime.timezone(datetime.timedelta(hours=-3))).date().isoformat()
        item = {k:p[k] for k in ['number','title','body','createdAt','updatedAt','mergedAt','closedAt','state','url','baseRefName','headRefName','additions','deletions','changedFiles']}
        item.update({'repo':key,'id':key+'#'+str(p['number']),'date':localdate,'month':localdate[:7],'mergeSha':merge,'integrated':integrated,'status':'Integrado à principal' if integrated else ('Mesclado em outro ramo' if p['state']=='MERGED' else ('Aberto' if p['state']=='OPEN' else 'Fechado sem merge')),'mergeDiffAvailable':known,'files':files,'categories':tags(p['title'], ' '.join(f['path'] for f in files)),'type':(re.match(r'^([a-z]+)(?:\(|:)',p['title']) or [None,'outro'])[1]})
        item['body']=clean(item['body']);item['title']=clean(item['title'])
        dataset['prs'].append(item)
    for c in cs:
        item = {k:v for k,v in c.items() if k not in ['author','email']}
        date = datetime.datetime.fromisoformat(c['committedAt']).astimezone(datetime.timezone(datetime.timedelta(hours=-3))).date().isoformat()
        item.update({'repo':key,'id':key+':'+c['sha'],'date':date,'url':base+'/commit/'+c['sha'],'month':date[:7],'categories':tags(c['title'],' '.join(f['path'] for f in c['files'])),'status':'Integrado à principal' if c['integrated'] else 'Ramo local ou remoto disponível'})
        item['body']=clean(item['body']);item['title']=clean(item['title'])
        dataset['commits'].append(item)
    for d in json.loads((raw / 'docs.json').read_text()):
        dataset['docs'].append({**d,'repo':key,'id':key+':'+d['path'],'title':clean(d['headings'][0].lstrip('# ').strip() if d['headings'] else pathlib.Path(d['path']).name),'headings':[clean(h) for h in d['headings']],'url':base+'/blob/'+ref+'/'+d['path'],'categories':tags(d['path']+' '+' '.join(d['headings'][:3])),'status':'Presente na principal','historical':False})
    # Index historical documents, including removed and renamed paths.
    current_docs={d['path'] for d in dataset['docs'] if d['repo']==key}
    history={}
    for c in sorted(cs,key=lambda x:x['committedAt']):
        for f in c['files']:
            p=f['path']
            if p.lower().endswith(('.md','.mdx','.rst','.adoc')) and p not in current_docs and not any(q in p.lower() for q in ['.claude/','.agents/','.codex/','node_modules']):history[p]=(c,f['status'])
    for p,(c,status) in history.items():
        sha=c['parents'][0] if status=='D' and c['parents'] else c['sha']
        dataset['docs'].append({'repo':key,'id':key+':'+p,'path':p,'title':pathlib.Path(p).name,'headings':[],'url':base+'/blob/'+sha+'/'+p,'categories':tags(p),'status':'Documento histórico; última alteração '+c['date'],'historical':True,'lastChangeSha':c['sha'],'integrated':c['integrated']})
    for f in tree:
        dataset['files'].append({**f,'repo':key,'url':base+'/blob/'+ref+'/'+f['path']})
    groups=collections.defaultdict(list)
    for f in tree:
        p=f['path'];parts=p.split('/')
        mod=None
        if key=='bb' and len(parts)>2 and parts[0]=='src' and parts[1]!='shared':mod='/'.join(parts[:2])
        if key=='wpp' and p.startswith('apps/painel-cliente-api/src/modules/') and len(parts)>5:mod='/'.join(parts[:5])
        if key=='developy' and p.startswith('apps/web/src/lib/server/') and len(parts)>6:mod='/'.join(parts[:6])
        if mod:groups[mod].append(f)
    for mod, fs in sorted(groups.items()):
        readme=mod+'/README.md'
        text=git(key,['show',ref+':'+readme]) if readme in paths else ''
        heading=next((l.lstrip('# ').strip() for l in text.splitlines() if l.startswith('# ')),mod.split('/')[-1])
        front={}
        if text.startswith('---'):
            for field in ['id','nome','categoria','tagline','status','escopo','porta','endpoints','entidades','provedores','desde']:
                m=re.search(r'^  '+field+r':\s*(.*)$',text,re.M)
                if m:front[field]=m.group(1).strip('"')
        dataset['modules'].append({'repo':key,'id':key+':'+mod,'path':mod,'name':mod.split('/')[-1],'title':heading,'files':len(fs),'testFiles':sum(bool(re.search(r'\.(spec|test)\.[jt]sx?$',f['path'])) for f in fs),'readme':readme if text else None,'metadata':front,'url':base+'/tree/'+ref+'/'+mod,'categories':tags(mod+' '+heading),'readmeHeadings':[clean(l) for l in text.splitlines() if l.startswith('#')][:40]})
    releases=json.loads((raw/'releases.json').read_text())
    for release in releases:
        dataset['releases'].append({'repo':key,'name':release['name'],'tag':release['tag_name'],'publishedAt':release['published_at'],'url':release['html_url'],'body':clean(release.get('body') or '')})

dataset['prs'].sort(key=lambda p:(p['date'],p['repo'],p['number']))
dataset['commits'].sort(key=lambda p:(p['date'],p['repo'],p['sha']))
summary={'prs':len(dataset['prs']),'mergedPrs':sum(p['state']=='MERGED' for p in dataset['prs']),'integratedPrs':sum(p['integrated'] for p in dataset['prs']),'mergedOtherBranchPrs':[p['id'] for p in dataset['prs'] if p['state']=='MERGED' and not p['integrated']],'openPrs':sum(p['state']=='OPEN' for p in dataset['prs']),'closedPrs':sum(p['state']=='CLOSED' for p in dataset['prs']),'commits':len(dataset['commits']),'integratedCommits':sum(c['integrated'] for c in dataset['commits']),'docsCurrent':sum(not d['historical'] for d in dataset['docs']),'docsHistorical':sum(d['historical'] for d in dataset['docs']),'files':len(dataset['files']),'testFiles':sum(r['testFiles'] for r in dataset['repositories']),'modules':len(dataset['modules']),'redactions':dict(redactions)}
dataset['summary']=summary
(OUT/'dados.json').write_text(json.dumps(dataset,ensure_ascii=False,separators=(',',':')))
(OUT/'cobertura.json').write_text(json.dumps({'summary':summary,'repositories':dataset['repositories'],'countsByRepo':{k:{'states':dict(collections.Counter(p['state'] for p in dataset['prs'] if p['repo']==k)),'integration':dict(collections.Counter(p['status'] for p in dataset['prs'] if p['repo']==k)),'knownMergeDiff':sum(p['mergeDiffAvailable'] for p in dataset['prs'] if p['repo']==k)} for k in REPOS}},ensure_ascii=False,indent=2))
def safe_csv(s):
    s='' if s is None else str(s)
    return "'"+s if s.startswith(('=','+','-','@','\t','\r')) else s
for name,items,fields in [('prs',dataset['prs'],['id','date','repo','number','title','state','status','baseRefName','headRefName','categories','url','mergeSha','additions','deletions','changedFiles','body']),('commits',dataset['commits'],['repo','date','sha','title','integrated','categories','url','body']),('documentos',dataset['docs'],['repo','path','title','historical','status','categories','url']),('modulos',dataset['modules'],['repo','name','path','files','testFiles','categories','url'])]:
    with (OUT/(name+'.csv')).open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
        for item in items:w.writerow({field:safe_csv(' | '.join(item[field]) if isinstance(item.get(field),list) else item.get(field)) for field in fields})
print(json.dumps(summary,ensure_ascii=False))
