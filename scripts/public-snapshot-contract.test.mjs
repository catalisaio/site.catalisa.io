import {describe,expect,it} from 'vitest';
import {anonymousSnapshotApi} from './anonymous-snapshot-api.mjs';
import {publicSnapshotIssue,snapshotShellName} from './public-snapshot-contract.mjs';

describe('Anonymous local snapshot contract',()=>{
  it('uses the newly built entrypoint for a full run even when an old SPA shell exists',()=>{
    expect(snapshotShellName({partial:false,hasSpa:true})).toBe('index.html');
    expect(snapshotShellName({partial:false,hasSpa:false})).toBe('index.html');
    expect(snapshotShellName({partial:true,hasSpa:true})).toBe('spa.html');
    expect(snapshotShellName({partial:true,hasSpa:false})).toBe('index.html');
  });
  it('represents a new visitor as the real session read contract without creating a session',()=>{
    const response=anonymousSnapshotApi('/api/site/session');
    expect(response.status).toBe(401);expect(response.body.code).toBe('session_required');
    expect(response.headers['Content-Type']).toContain('application/json');
    expect(response.headers['Cache-Control']).toBe('no-store');expect(response.headers['Set-Cookie']).toBeUndefined();
  });
  it('keeps missing APIs and rejected writes explicit instead of returning the HTML shell',()=>{
    expect(anonymousSnapshotApi('/api/site/unknown').status).toBe(404);
    expect(anonymousSnapshotApi('/api/site/sessions','POST').status).toBe(405);
    expect(anonymousSnapshotApi('/contato')).toBeNull();
  });
  const contact={path:'/contato',h1:'Converse sobre o que sua empresa precisa.',busy:false,errors:[],controlReady:true};
  const lab={path:'/lab',h1:'Descreva sua ideia e explore um conceito de produto.',busy:false,errors:[],controlReady:true};
  it('accepts the public Contact introduction and a ready Lab form',()=>{
    expect(publicSnapshotIssue(contact)).toBeUndefined();expect(publicSnapshotIssue(lab)).toBeUndefined();
  });
  it('rejects the restoration-error heading previously captured as the Contact page',()=>{
    expect(publicSnapshotIssue({...contact,h1:'Vamos retomar de onde parou.'})).toMatch(/Contact snapshot/);
  });
  it('rejects a loading snapshot even when the Lab heading is already visible',()=>{
    expect(publicSnapshotIssue({...lab,busy:true})).toMatch(/loading/);
    expect(publicSnapshotIssue({...lab,controlReady:false})).toMatch(/disabled/);
  });
  it('rejects API failures on either public form instead of masking them as anonymous success',()=>{
    for(const state of [contact,lab])expect(publicSnapshotIssue({...state,errors:['Serviço indisponível']})).toContain('Serviço indisponível');
  });
  it('checks the actual translated public heading instead of accepting any localized H1',()=>{
    const translated={...contact,h1:'Geben wir Ihrem nächsten Gespräch eine Form.',expectedHeading:'Geben wir Ihrem nächsten Gespräch eine Form.'};
    expect(publicSnapshotIssue(translated)).toBeUndefined();
    expect(publicSnapshotIssue({...translated,h1:'Vorheriges Gespräch wiederherstellen'})).toMatch(/translated introduction/);
    expect(publicSnapshotIssue({...translated,busy:true})).toMatch(/loading/);
  });
});
