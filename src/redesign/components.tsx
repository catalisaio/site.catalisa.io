import{LocalizedLink as Link,useSiteLocation as useLocation}from"./i18n/navigation";
import {t as __siteT} from "./i18n/runtime";
import { useEffect, useId, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

import { HeaderView } from './HeaderView';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Link className={`c-brand c-wordmark${compact ? ' c-brand-small' : ''}`} to="/" aria-label={__siteT("Catalisa — início")}>catalisa<span aria-hidden="true" /></Link>;
}

export function TextLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  const content = <>{children}<span aria-hidden="true">↗</span></>;
  return /^https?:/.test(to)
    ? <a className={`c-text-link ${className}`} href={to} target="_blank" rel="noopener noreferrer">{content}</a>
    : <Link className={`c-text-link ${className}`} to={to}>{content}</Link>;
}

export function Action({ children, busy = false, secondary = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean; secondary?: boolean }) {
  return <button type="button" {...props} disabled={props.disabled || busy} aria-busy={busy || undefined} className={`c-action${secondary ? ' c-action-secondary' : ''} ${props.className ?? ''}`}>{children}</button>;
}

export function Field({ label, help, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string; error?: string }) {
  const generated = useId();
  const id = props.id ?? generated;
  return <div className="c-field"><label htmlFor={id}>{label}</label>{help && <p id={`${id}-help`} className="c-field-help">{help}</p>}<input {...props} id={id} aria-invalid={!!error} aria-describedby={[help ? `${id}-help` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined} />{error && <p id={`${id}-error`} className="c-field-error">{error}</p>}</div>;
}

export function Status({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'error' }) {
  return <span className={`c-status c-status-${tone}`}><span aria-hidden="true">{tone === 'error' ? '!' : tone === 'success' ? '✓' : '○'}</span>{children}</span>;
}

export function Tabs({ label, items }: { label: string; items: { label: string; content: ReactNode }[] }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="c-tabs"><div role="tablist" aria-label={label}>{items.map((item, index) => <button key={item.label} ref={node => { buttons.current[index] = node; }} role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={index === selected} tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    setSelected(next); buttons.current[next]?.focus();
  }}>{item.label}</button>)}</div>{items.map((item, index) => <div key={item.label} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={index !== selected} tabIndex={0}>{item.content}</div>)}</div>;
}

export function MediaDialog({ trigger, title, children }: { trigger: ReactNode; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const id = useId();
  return <><button className="c-media-trigger" ref={opener} onClick={() => ref.current?.showModal()}>{trigger}</button><dialog className="c-dialog" ref={ref} aria-labelledby={id} onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) ref.current?.close(); }}><div className="c-dialog-top"><h2 id={id}>{title}</h2><button autoFocus onClick={() => ref.current?.close()} aria-label={__siteT("Fechar imagem")}>{__siteT("Fechar ×")}</button></div><div className="c-dialog-content">{children}</div></dialog></>;
}

export const platformLinks = [
  ['/arquitetura/', __siteT("Arquitetura"), __siteT("Princípios e camadas")], ['/capacidades/', __siteT("Building blocks"), __siteT("Capacidades modulares")],
  ['/studio/', 'Studio', __siteT("Construir e iterar")],
  ['/workflows/', __siteT("Workflows"), __siteT("Orquestração de processos")], ['/agentes/', __siteT("Agentes IA"), __siteT("Contexto e ferramentas")],
  ['/governanca/', __siteT("Governança"), __siteT("Permissões e evidências")], ['/desenvolvedores/', __siteT("Desenvolvedores"), __siteT("Guias e referências")],
  ['https://docs.catalisa.app/', __siteT("Referência de APIs"), __siteT("Contratos e documentação técnica")],
] as const;

export function SiteHeader() {
  const [menu, setMenu] = useState<'platform' | 'all' | null>(null);
  const root = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const id = useId();

  useEffect(() => { setMenu(null); }, [location.pathname]);
  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    // Keep the content width when locking background scroll for either menu.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    const close = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setMenu(null); };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(null); opener.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [...(root.current?.querySelectorAll<HTMLElement>('a, button') ?? [])].filter(el => el.getClientRects().length);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previousOverflow; document.body.style.paddingRight = previousPadding; document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', keydown); };
  }, [menu]);

  function toggle(value: 'platform' | 'all', element: HTMLButtonElement) { opener.current = element; setMenu(current => current === value ? null : value); }
  return <><a href="#c-main" className="c-skip">{__siteT("Pular para o conteúdo")}</a><HeaderView {...{menu,id,root,toggle}} closeMenu={()=>setMenu(null)} brand={<BrandMark/>}/></>;
}

export function SiteFooter() {
  return <footer className="c-footer"><div className="c-wrap"><BrandMark compact /><nav aria-label={__siteT("Rodapé")}>{[['/arquitetura/', __siteT("Plataforma")], ['/ecossistema/', __siteT("Ecossistema")], ['https://docs.catalisa.app/', __siteT("Documentação")], ['/press-kit/', __siteT("Press-kit")], ['/contato/', __siteT("Contato")], ['/mapa', __siteT("Mapa do site")]].map(([to, name]) => /^https?:/.test(to) ? <a key={to} href={to} rel="noopener noreferrer">{name}</a> : <Link key={to} to={to}>{name}</Link>)}</nav><small>{__siteT("© Catalisa")}</small></div></footer>;
}

export function SignalArt() {
  return <svg className="c-signal-art" viewBox="0 0 1440 330" role="img" aria-label={__siteT("Fragmentos se organizam em caminhos conectados")}><g>{Array.from({ length: 110 }, (_, i) => <line key={`line-${i}`} x1={(i * 71) % 540} y1={80 + (i * 37) % 190} x2={(i * 71) % 540 + 2} y2={82 + (i * 37) % 190} stroke="#574B5C" strokeOpacity={.25 + i % 5 * .1} />)}{Array.from({ length: 290 }, (_, i) => <circle key={i} cx={(i * 113) % 850} cy={165 + Math.sin(i * 47) * Math.max(8, 110 - (i * 113) % 850 * .12)} r={.8 + i % 3 * .3} fill="#5A4C63" opacity=".5" />)}</g><circle cx="1200" cy="145" r="58" fill="#FF7F36" /><g fill="none" strokeWidth="1.6">{[0, 1, 2, 3, 4].map(i => <path key={i} stroke={i === 3 ? '#E87D38' : '#8966AD'} d={`M360 ${135 + i * 14} C650 ${230 - i * 30},780 ${30 + i * 50},940 ${90 + i * 30} S1110 ${30 + i * 40},1200 ${110 + i * 23} S1330 ${145 + i * 20},1440 ${145 + i * 20}`} />)}</g></svg>;
}
