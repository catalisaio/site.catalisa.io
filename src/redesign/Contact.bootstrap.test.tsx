import {StrictMode} from 'react';
import {cleanup,render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import Contact,{prepareInitialSession} from './Contact';

beforeEach(()=>{vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();document.documentElement.removeAttribute('data-contact-bootstrap');});
describe('Contact initial session read',()=>{
  it('commits the anonymous introduction directly after one 401 read, including StrictMode',async()=>{
    const fetch=vi.fn().mockResolvedValue(new Response(JSON.stringify({code:'session_required'}),{status:401,headers:{'Content-Type':'application/json'}}));vi.stubGlobal('fetch',fetch);
    document.documentElement.setAttribute('data-contact-bootstrap','');await prepareInitialSession();
    render(<StrictMode><MemoryRouter initialEntries={['/contato']}><Contact/></MemoryRouter></StrictMode>);
    expect(screen.getByRole('heading',{level:1,name:/Converse sobre o que sua empresa precisa/})).toBeVisible();
    expect(screen.queryByText('Retomando sua conversa…')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute('data-contact-bootstrap');expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('commits a returning visitor directly to the saved step without an introductory frame or a second read',async()=>{
    const saved={session:{sessionRef:'session_test',briefVersion:1,identityStatus:'anonymous',leadStatus:'none'},briefing:{idea:'Agendamento para a clínica'},messages:[],availableChannels:['here']};
    const fetch=vi.fn().mockResolvedValue(new Response(JSON.stringify(saved),{status:200,headers:{'Content-Type':'application/json'}}));vi.stubGlobal('fetch',fetch);
    await prepareInitialSession();render(<StrictMode><MemoryRouter initialEntries={['/contato']}><Contact/></MemoryRouter></StrictMode>);
    expect(screen.queryByRole('heading',{level:1,name:/Converse sobre o que sua empresa precisa/})).not.toBeInTheDocument();
    expect(document.querySelector('.z-view-context')).toBeVisible();expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('keeps a failed read recoverable instead of accepting it as a new visitor',async()=>{
    const fetch=vi.fn().mockResolvedValue(new Response(JSON.stringify({code:'persistence_unavailable',message:'Serviço indisponível'}),{status:503,headers:{'Content-Type':'application/json'}}));vi.stubGlobal('fetch',fetch);
    await prepareInitialSession();render(<MemoryRouter initialEntries={['/contato']}><Contact/></MemoryRouter>);
    expect(screen.getByRole('heading',{level:1,name:'Vamos retomar de onde parou.'})).toBeVisible();
    expect(screen.getByRole('button',{name:'Tentar retomar'})).toBeEnabled();expect(screen.getByRole('alert')).toHaveTextContent('Serviço indisponível');expect(fetch).toHaveBeenCalledTimes(1);
  });
});
