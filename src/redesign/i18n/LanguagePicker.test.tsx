import{afterEach,describe,expect,it,vi}from'vitest';
import{cleanup,fireEvent,render,screen,within}from'@testing-library/react';
import{MemoryRouter}from'react-router-dom';
import{LanguagePicker,languageSwitchHref}from'./LanguagePicker';
vi.mock('./runtime',()=>({t:(source:string)=>(({'Escolher idioma':'Choose language','Idiomas disponíveis':'Available languages'} as Record<string,string>)[source]??source)}));
afterEach(()=>{cleanup();document.body.removeAttribute('style');localStorage.removeItem('catalisa_site_locale');});
function picker(path='/en/capabilities/decision-engine'){return render(<MemoryRouter initialEntries={[path]}><LanguagePicker/><button>Outside</button></MemoryRouter>);}

describe('language navigation URLs',()=>{
 it('keeps the same public page while removing conversation/auth state',()=>{
  expect(languageSwitchHref({pathname:'/en/contact',search:'?session=private&resume=secret&token=secret&utm_source=search&utm_campaign=launch&redirect=https%3A%2F%2Fevil.test',hash:'#briefing'},'de-DE',id=>id==='briefing')).toBe('/de/kontakt?utm_source=search&utm_campaign=launch#briefing');
  expect(languageSwitchHref({pathname:'/en/capabilities/decision-engine'},'pt-BR')).toBe('/capacidades/decision-engine');
 });
 it('drops missing/malformed anchors and refuses unsupported source pages',()=>{
  expect(languageSwitchHref({pathname:'/lab',hash:'#gone'},'nl-NL')).toBe('/nl/lab');
  expect(languageSwitchHref({pathname:'/lab',hash:'#%E0%A4'},'nl-NL',()=>true)).toBe('/nl/lab');
  expect(languageSwitchHref({pathname:'/treinamento'},'en-US')).toBeUndefined();
 });
});
describe('language picker disclosure',()=>{
 it('uses translated accessibility labels, autonyms and real same-subject anchors, including raw Portuguese',()=>{
  picker();const trigger=screen.getByRole('button',{name:'Choose language (English)'});expect(trigger).toHaveAttribute('aria-expanded','false');fireEvent.click(trigger);
  const nav=screen.getByRole('navigation',{name:'Available languages'});const links=within(nav).getAllByRole('link');expect(links).toHaveLength(7);
  expect(within(nav).getByRole('link',{name:'Português'})).toHaveAttribute('href','/capacidades/decision-engine');expect(within(nav).getByRole('link',{name:'English'})).toHaveAttribute('aria-current','page');expect(within(nav).getByRole('link',{name:'Deutsch'})).toHaveAttribute('href','/de/faehigkeiten/decision-engine');expect(within(nav).getByRole('link',{name:'Dansk'})).toHaveAttribute('lang','da-DK');expect(within(nav).getByRole('link',{name:'Français'})).toHaveAttribute('href','/fr/capacites/decision-engine');
 });
 it('focuses the current language on keyboard opening and returns focus on Escape',()=>{
  picker();const trigger=screen.getByRole('button',{name:'Choose language (English)'});expect(trigger).not.toHaveAttribute('aria-controls');trigger.focus();fireEvent.keyDown(trigger,{key:'ArrowDown'});expect(document.getElementById(trigger.getAttribute('aria-controls')!)).toBe(screen.getByRole('navigation',{name:'Available languages'}));expect(screen.getByRole('link',{name:'English'})).toHaveFocus();fireEvent.keyDown(document,{key:'Escape'});expect(trigger).toHaveFocus();expect(trigger).toHaveAttribute('aria-expanded','false');expect(trigger).not.toHaveAttribute('aria-controls');expect(screen.queryByRole('navigation')).toBeNull();
 });
 it('closes on outside interaction and focus leaving without changing body scrolling',()=>{
  document.body.style.overflow='scroll';picker();const trigger=screen.getByRole('button',{name:'Choose language (English)'});fireEvent.click(trigger);fireEvent.pointerDown(screen.getByRole('button',{name:'Outside'}));expect(screen.queryByRole('navigation')).toBeNull();expect(document.body.style.overflow).toBe('scroll');fireEvent.click(trigger);const current=screen.getByRole('link',{name:'English'});fireEvent.blur(current,{relatedTarget:screen.getByRole('button',{name:'Outside'})});expect(screen.queryByRole('navigation')).toBeNull();
 });
 it('renders no misleading language links outside the native public route inventory',()=>{
  picker('/treinamento');expect(screen.queryByRole('button',{name:/Choose language/})).toBeNull();
 });
 it('remembers an explicit Portuguese choice before normal document navigation, preventing a machine-language redirect loop',()=>{
  localStorage.setItem('catalisa_site_locale','de-DE');picker();fireEvent.click(screen.getByRole('button',{name:'Choose language (English)'}));const portuguese=screen.getByRole('link',{name:'Português'});portuguese.addEventListener('click',event=>event.preventDefault());fireEvent.click(portuguese);expect(localStorage.getItem('catalisa_site_locale')).toBe('pt-BR');expect(portuguese).toHaveAttribute('href','/capacidades/decision-engine');
 });
});
