#!/usr/bin/env python3
"""Validate the concept fixture against the bounded schema vocabulary used here.
Not a general JSON Schema or OpenAPI validator. No network or dependencies.
"""
from pathlib import Path
import json,copy
root=Path(__file__).resolve().parents[1]
schema=json.loads((root/'contracts/concept.schema.json').read_text())
fixture=json.loads((root/'contracts/concept.example.json').read_text())
def validate(v,s,path='$'):
 t=s.get('type');allowed=t if isinstance(t,list) else [t] if t else []
 def matches(t):return {'object':isinstance(v,dict),'array':isinstance(v,list),'string':isinstance(v,str),'boolean':isinstance(v,bool),'integer':isinstance(v,int) and not isinstance(v,bool),'null':v is None,'number':isinstance(v,(int,float)) and not isinstance(v,bool)}.get(t,False)
 if allowed and not any(matches(t) for t in allowed):raise ValueError(path+': wrong type')
 if 'const' in s and v!=s['const']:raise ValueError(path+': invalid const')
 if 'enum' in s and v not in s['enum']:raise ValueError(path+': outside allowlist')
 if isinstance(v,str):
  if len(v)<s.get('minLength',0) or len(v)>s.get('maxLength',float('inf')):raise ValueError(path+': string length')
 if isinstance(v,list):
  if len(v)<s.get('minItems',0) or len(v)>s.get('maxItems',float('inf')):raise ValueError(path+': item count')
  for i,x in enumerate(v):validate(x,s.get('items',{}),f'{path}[{i}]')
 if isinstance(v,dict):
  missing=set(s.get('required',[]))-v.keys()
  if missing:raise ValueError(path+': missing '+str(missing))
  props=s.get('properties',{})
  if s.get('additionalProperties') is False and set(v)-props.keys():raise ValueError(path+': unknown properties')
  for k,x in v.items():
   if k in props:validate(x,props[k],path+'.'+k)
 if isinstance(v,(int,float)) and not isinstance(v,bool):
  if v<s.get('minimum',float('-inf')):raise ValueError(path+': below minimum')
def invariant(v):
 ids=[x['id'] for x in v['screens']]
 if len(ids)!=len(set(ids)):raise ValueError('duplicate screen IDs')
 if any(x['action']['nextScreenId'] not in ids+[None] for x in v['screens']):raise ValueError('unknown next screen')
 j=[x['id'] for x in v['journey']]
 if len(j)!=len(set(j)):raise ValueError('duplicate journey IDs')
validate(fixture,schema);invariant(fixture)
negative=[]
x=copy.deepcopy(fixture);x['blocks'][0]['slug']='unknown-block';negative.append(x)
x=copy.deepcopy(fixture);x['screens'][0]['action']['nextScreenId']='unknown';negative.append(x)
x=copy.deepcopy(fixture);del x['limitations'];negative.append(x)
x=copy.deepcopy(fixture);x['unexpected']='field';negative.append(x)
x=copy.deepcopy(fixture);x['journey'][0]['humanReview']='yes';negative.append(x)
for i,x in enumerate(negative):
 try:validate(x,schema);invariant(x)
 except ValueError:continue
 raise SystemExit(f'Negative fixture {i} incorrectly accepted')
print('Concept fixture + 5 negative cases: passed (bounded schema checks + relationship invariants).')
