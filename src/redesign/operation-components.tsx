import{localizeData as __siteData}from"./i18n/runtime";
import {t as __siteT} from "./i18n/runtime";
import { createContext, useContext, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { RedesignFrame } from './foundation-components';
import __siteBase_captures from './data/operation-captures.json';
import './operations.css';
const captures=__siteData(__siteBase_captures,{translateKeys:["type","origin"]});


export interface Capture {file:string;product:string;title:string;desc:string;type:string;origin:string;width:number;height:number}
const GalleryContext = createContext<(file: string, opener: HTMLButtonElement) => void>(() => {});

export function OperationFrame({ title, children, items=captures }: { title: string; children: ReactNode; items?: Capture[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState<Capture | null>(null);
  const [actualSize, setActualSize] = useState(false);
  const gallery = items.filter(item => item.product === current?.product);
  const index = gallery.findIndex(item => item.file === current?.file);
  function move(offset: number) { setCurrent(gallery[(index + offset + gallery.length) % gallery.length]); setActualSize(false); }
  return <GalleryContext.Provider value={(file, trigger) => {
    const capture = items.find(item => item.file === file);
    if (!capture) return;
    opener.current = trigger; setCurrent(capture); setActualSize(false); dialog.current?.showModal();
  }}><RedesignFrame title={title}>{children}</RedesignFrame><dialog className="c-site c-capture-dialog" ref={dialog} aria-labelledby="c-capture-title" onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => {
    if (event.key === 'ArrowLeft' && gallery.length > 1) { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight' && gallery.length > 1) { event.preventDefault(); move(1); }
  }}><header><div><span className="c-eyebrow">{current?.type} / {__siteT("Referência de interface")}</span><h2 id="c-capture-title">{current?.title}</h2></div><button autoFocus aria-label={__siteT("Fechar imagem")} onClick={() => dialog.current?.close()}>{__siteT("Fechar ×")}</button></header><div className="c-capture-toolbar"><button disabled={gallery.length < 2} aria-label={__siteT("Imagem anterior")} onClick={() => move(-1)}>←</button><span aria-live="polite">{index + 1} / {gallery.length}</span><button disabled={gallery.length < 2} aria-label={__siteT("Próxima imagem")} onClick={() => move(1)}>→</button><button aria-pressed={!actualSize} onClick={() => setActualSize(false)}>{__siteT("Ajustar")}</button><button aria-pressed={actualSize} onClick={() => setActualSize(true)}>100%</button></div><div className={`c-capture-viewport${actualSize ? ' c-capture-actual' : ''}`} tabIndex={0} aria-label={__siteT("Imagem ampliada; use a rolagem para explorar")}>{current && <img src={`/redesign/screens/${current.file}`} alt={current.desc} width={current.width} height={current.height} />}</div><footer><p>{current?.desc}</p><small>{current?.origin}</small></footer></dialog></GalleryContext.Provider>;
}

export function CaptureButton({ file, label, className, children }: { file: string; label: string; className?: string; children: ReactNode }) {
  const open = useContext(GalleryContext);
  return <button type="button" className={className} aria-label={label} data-capture-file={file} onClick={event => open(file, event.currentTarget)}>{children}</button>;
}

export function OperationPause({ paused, toggle, className }: { paused: boolean; toggle: () => void; className?: string }) {
  return <button className={className} aria-pressed={paused} onClick={toggle}>{paused ? __siteT("▶ Retomar movimento") : __siteT("Ⅱ Pausar movimento")}</button>;
}

export function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (value: number) => void, prefix: string) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + count) % count;
  select(next); document.getElementById(prefix + next)?.focus();
}
