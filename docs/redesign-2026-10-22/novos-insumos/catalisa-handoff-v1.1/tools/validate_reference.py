#!/usr/bin/env python3
"""Read-only validation of the included static reference. No network or dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,sys,subprocess,shutil
root=Path(__file__).resolve().parents[1];site=root/'reference/site';dist=site/'dist';errors=[]
class P(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.h1=0;self.refs=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='h1':self.h1+=1
  if a.get('id'):self.ids.append(a['id'])
  for k in ['href','src']:
   if a.get(k,'').startswith('/'):self.refs.append(urlsplit(a[k]).path)
routes=json.loads((dist/'assets/routes.json').read_text())
for r in routes:
 f=dist/r['url'].lstrip('/')/'index.html';p=P();p.feed(f.read_text())
 if p.h1!=1:errors.append(f"{r['url']}: H1={p.h1}")
 if len(p.ids)!=len(set(p.ids)):errors.append(f"{r['url']}: duplicate IDs")
 for v in p.refs:
  if not (dist/unquote(v).lstrip('/')).exists():errors.append(f"{r['url']}: missing {v}")
 if 'href="/visao/">Sobre' in f.read_text():errors.append('stale Sobre label')
if shutil.which('node'):
 for f in (dist/'assets').rglob('*.js'):
  p=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
  if p.returncode:errors.append(f'JS syntax: {f.relative_to(root)}')
else:print('Node unavailable: JS syntax check skipped.')
fixture=json.loads((root/'contracts/concept.example.json').read_text());schema=json.loads((root/'contracts/concept.schema.json').read_text())
try:
 import jsonschema
 jsonschema.Draft202012Validator.check_schema(schema);jsonschema.validate(fixture,schema)
 print('Concept JSON Schema: passed.')
except ImportError:print('jsonschema unavailable: general JSON Schema validation skipped; running bounded checks.');subprocess.run([sys.executable,str(root/'tools/validate_contracts.py')],check=True)
except Exception as e:errors.append('Concept JSON Schema: '+str(e))
ids=[s['id'] for s in fixture['screens']]
if len(ids)!=len(set(ids)):errors.append('Duplicate screen IDs')
if any(s['action']['nextScreenId'] not in ids+[None] for s in fixture['screens']):errors.append('Unknown next screen')
checks=root/'CHECKSUMS.sha256'
if checks.exists():
 for line in checks.read_text().splitlines():
  digest,name=line.split('  ',1);f=root/name
  if not f.exists() or hashlib.sha256(f.read_bytes()).hexdigest()!=digest:errors.append('Checksum mismatch: '+name)
print(json.dumps({'routes':len(routes),'errors':errors},ensure_ascii=False,indent=2));sys.exit(bool(errors))
