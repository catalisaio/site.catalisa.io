import{productLabel as __productLabel}from"./i18n/product-label";
import{localizeData as __siteData}from"./i18n/runtime";
import{LocalizedLink as Link}from"./i18n/navigation";
import {t as __siteT} from "./i18n/runtime";
import { useId, useRef, useState } from 'react';

import { AdapterArt, ArchitectureAssembly, LabInvitationArt, ReuseArt, compositionArt } from './FoundationArt';
import { MotionControl, RedesignFrame } from './foundation-components';
import __siteBase_verticals from './data/architecture.json';
import __siteBase_messaging from './data/financial-messaging.json';
import './base.css';
import './architecture-reference.css';
import './foundations.css';
const verticals=__siteData(__siteBase_verticals);
const messaging=__siteData(__siteBase_messaging);


const buildSteps = [
  [__siteT("Definir"), __siteT("Quem usa, qual problema resolve e onde uma pessoa precisa decidir.")],
  [__siteT("Selecionar"), __siteT("Quais capacidades existentes atendem à jornada e quais precisam ser estendidas.")],
  [__siteT("Compor"), __siteT("Conectar operações, dados e integrações com as regras do contexto.")],
  [__siteT("Validar e evoluir"), __siteT("Testar contratos, permissões e a experiência completa antes de ampliar o uso.")],
] as const;
const platformCopy = messaging.platform;
const layers = [
  ['01', __siteT("Experiência e contexto"), __siteT("O produto fala a língua do negócio."), __siteT("Canais, interfaces, conhecimento e papéis definem como cada pessoa participa. Titular, analista de crédito e operador de backoffice acessam o mesmo fundamento a partir de papéis e experiências diferentes."), '/ecossistema/', __siteT("Conheça as verticais")],
  ['02', __siteT("Composição e jornadas"), __siteT("A ordem das ações também é produto."), __siteT("Workflows conectam capacidades, condições e pontos de revisão. A jornada define quando consultar, decidir, registrar ou encaminhar para uma pessoa."), '/workflows/', __siteT("Explore workflows")],
  ['03', __siteT("Capacidades de negócio"), __siteT("Responsabilidades prontas para se conectar."), __siteT("Dados, agenda, decisão, documentos e canais oferecem operações com fronteiras próprias. A mesma capacidade pode atender mais de uma composição."), '/capacidades/', __siteT("Explore building blocks")],
  ['04', __siteT("Integrações e operação"), __siteT("Conectar preservando responsabilidades."), __siteT("Adaptadores aproximam sistemas externos das capacidades. Identidade, permissões e registros atravessam a jornada como requisitos da operação."), '/governanca/', __siteT("Entenda a governança")],
] as const;

function Compositions() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const d = verticals[active];
  const Art = compositionArt[active];
  return <>
    <div className="a-tabs" role="tablist" aria-label={__siteT("Composições por vertical")}>{verticals.map((item, index) => <button key={item.name} ref={node => { tabs.current[index] = node; }} id={`${id}-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? verticals.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + verticals.length) % verticals.length;
      setActive(next); tabs.current[next]?.focus();
    }}><small>0{index + 1}</small>{__productLabel(item.name==='Banking'?'Banking Platform':item.name)}<span aria-hidden="true">↗</span></button>)}</div>
    <div id={`${id}-panel`} className="a-vertical" role="tabpanel" aria-labelledby={`${id}-${active}`} tabIndex={0}>
      <div className="a-composition-exhibit"><div className="a-exhibit-title"><span className="c-eyebrow">{__siteT("Composição ")}{String(active + 1).padStart(2, '0')}</span><span className="a-exhibit-status">{active < 3 ? __siteT("Ecossistema Catalisa") : __siteT("Possibilidade de composição")}</span></div><Art /><div className="a-map-legend"><span><i aria-hidden="true" />{__siteT("Capacidades reutilizáveis")}</span><span><i aria-hidden="true" />{__siteT("Jornada própria")}</span></div></div>
      <div className="a-vertical-copy"><span className="c-eyebrow">{__productLabel(d.name==='Banking'?'Banking Platform':d.name)} / {__siteT("Contexto de negócio")}</span><h3>{d.title}</h3><p>{d.copy}</p><div className="a-specific"><small>{__siteT("O QUE TORNA ESTA COMPOSIÇÃO ÚNICA")}</small><p>{d.specific}</p></div><ol className="a-steps">{d.steps.map((step, index) => <li key={step}><small>0{index + 1}</small>{step}</li>)}</ol>{d.note && <p className="a-case-note">{d.note}</p>}<Link className="c-text-link" to={d.url || `/ecossistema/${d.slug}/`}>{d.url ? __siteT("Explore as capacidades") : __siteT("Explore {value0}",{"value0":__productLabel(d.name==='Banking'?'Banking Platform':d.name)})} <span aria-hidden="true">↗</span></Link><p className="c-sr-only">{__siteT("Capacidades nesta composição: ")}{d.shared.join(', ')}.</p></div>
    </div>
  </>;
}

export default function Architecture() {
  const [paused, setPaused] = useState(false);
  return <RedesignFrame title={__siteT("Arquitetura — prévia do redesign")} paused={paused}><div className="a-page">
    <section className="a-hero"><div className="c-wrap a-hero-grid"><div><span className="c-eyebrow">{__siteT("Onde nasce a eficiência / Arquitetura Catalisa")}</span><h1 className="c-hero-direct">{__siteT("Crie produtos com uma base de tecnologia compartilhada.")}</h1><p data-editorial-decision={messaging.decision} data-editorial-copy="architecture-hero-intro">{__siteT("Reutilize identidade, dados, IA e integrações entre produtos. Mantenha as regras de cada negócio e modernize seus sistemas por etapas.")}</p><a className="c-text-link" href="#compor">{__siteT("Veja a composição em ação ")}<span aria-hidden="true">↓</span></a></div><div className="a-blueprint"><ArchitectureAssembly /><span className="a-caption">{__siteT("UMA BASE QUE SE REORGANIZA EM NOVAS POSSIBILIDADES.")}</span></div></div><div className="c-wrap a-hero-benefits">{[[__siteT("01 / REUTILIZAR"), __siteT("Capacidades que atravessam produtos.")], [__siteT("02 / COMPOR"), __siteT("Regras e experiências próprias para cada negócio.")], [__siteT("03 / EVOLUIR"), __siteT("Mudanças organizadas por responsabilidade.")]].map(([label, text]) => <div key={label}><span>{label}</span><p>{text}</p></div>)}</div><MotionControl paused={paused} toggle={() => setPaused(value => !value)} /></section>
    <section className="a-path-section"><div className="c-wrap"><span className="c-eyebrow">{__siteT("Da intenção à nova vertical")}</span><h2>{__siteT("Começar pelo que diferencia.")}<br />{__siteT("Compor o que sustenta.")}</h2><div className="a-build-path">{buildSteps.map(([title, text], index) => <article key={title}><span className="a-path-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <nav className="a-chapters c-wrap" aria-label={__siteT("Nesta página")}><a href="#fundamento">{__siteT("01 / O fundamento")}</a><a href="#camadas">{__siteT("02 / A arquitetura")}</a><a href="#compor">{__siteT("03 / As composições")}</a><a href="#evolucao">{__siteT("04 / A evolução")}</a></nav>
    <section className="a-section c-wrap" id="fundamento"><div className="a-section-head"><span className="c-eyebrow">{__siteT("Construir sobre o que já existe")}</span><h2>{__siteT("O valor não está apenas")}<br />{__siteT("em cada peça.")}<br /><em>{__siteT("Está em poder usá-la de novo.")}</em></h2></div><div className="a-two"><div className="a-prose"><p>{__siteT("Todo produto tem algo único. Mas identidade, dados, cálculo, políticas e documentos aparecem em muitas jornadas financeiras — e encontram novos usos em outros setores.")}</p><p>{__siteT("A Catalisa separa essas responsabilidades em building blocks. Cada um oferece uma capacidade que pode participar de jornadas diferentes. O esforço de produto se concentra nas regras, na experiência e nas conexões que tornam aquele negócio específico.")}</p><p className="a-callout">{__siteT("Uma identidade pode abrir uma conta,")}<br />{__siteT("iniciar uma proposta ou autorizar uma operação.")}</p></div><div><ReuseArt /><p className="a-caption">{__siteT("MESMA RESPONSABILIDADE. CONTEXTOS DIFERENTES.")}</p></div></div></section>
    <section className="a-layers" id="camadas"><div className="c-wrap a-two"><div><span className="c-eyebrow">{__siteT("Uma leitura da arquitetura")}</span><h2>{__siteT("Da experiência")}<br />{__siteT("ao fundamento.")}</h2><p>{__siteT("Quatro perspectivas ajudam a entender a composição. Não são uma topologia de implantação: são responsabilidades que se conectam para fazer o produto funcionar.")}</p><img src="/redesign/media-v2/architecture-composition.webp" width="1254" height="1254" alt={__siteT("Escultura explodida: partes independentes formam um conjunto")} className="a-layer-art" loading="lazy" /></div><div className="a-layer-stack">{layers.map(([number, title, summary, text, to, label], index) => <details key={number} open={index === 0}><summary><span>{number}</span><div><h3>{title}</h3><p>{summary}</p></div><b aria-hidden="true">+</b></summary><div className="a-layer-detail"><p>{text}</p><Link className="c-text-link" to={to}>{label} <span aria-hidden="true">↗</span></Link></div></details>)}</div></div></section>
    <section className="a-section c-wrap" id="compor"><div className="a-section-head"><span className="c-eyebrow">{__siteT("A arquitetura ganha contexto")}</span><h2>{__siteT("Troque o negócio.")}<br /><em>{__siteT("Reconheça a base.")}</em></h2><p>{__siteT("Banking, crédito e decisão mostram a profundidade da base. Copiloto e atendimento mostram como ela atravessa setores. Os mapas são conceituais; aplicações propostas e integrações a validar estão identificadas.")}</p></div><Compositions /></section>
    <section className="l-lab-invitation"><div className="c-wrap"><div><span className="c-eyebrow">{__siteT("Catalisa Lab / Imagine uma possibilidade")}</span><h2>{__siteT("Uma consulta para a Luna.")}<br />{__siteT("Uma ideia para o seu negócio.")}</h2><p>{__siteT("Do primeiro “tem horário?” ao atendimento marcado: veja como uma conversa simples pode conectar agenda, contexto e pessoas.")}</p><Link className="c-text-link" to="/lab/">{__siteT("Entre no Lab e imagine seu produto ")}<span aria-hidden="true">↗</span></Link></div><div className="l-invite-art" aria-hidden="true"><LabInvitationArt /></div></div></section>
    <section className="a-section c-wrap" id="evolucao"><div className="a-two"><div><span className="c-eyebrow">{__siteT("Mudar uma parte. Preservar o sentido.")}</span><h2>{__siteT("O produto não precisa")}<br />{__siteT("conhecer cada")}<br /><em>{__siteT("detalhe da conexão.")}</em></h2><p className="a-prose" data-editorial-decision={messaging.decision} data-editorial-copy="architecture-evolution-intro">{platformCopy.evolutionIntro}</p><p className="a-prose" data-editorial-decision={messaging.decision} data-editorial-copy="architecture-evolution-limits">{platformCopy.evolutionLimits}</p></div><div><AdapterArt /><div className="a-mini-note"><strong>{__siteT("A esteira busca. O motor decide.")}</strong><p>{__siteT("Decision Platform reúne fontes; Decision Engine aplica a política. Separar essas funções permite usar o motor com dados próprios ou compô-lo com uma esteira.")}</p><Link className="c-text-link" to="/ecossistema/decision/">{__siteT("Explore Decision ")}<span aria-hidden="true">↗</span></Link></div></div></div></section>
    <section className="a-section c-wrap a-closing"><span className="c-eyebrow">{__siteT("Complexidade com estrutura")}</span><h2 data-editorial-decision={messaging.decision} data-editorial-copy="architecture-closing-title">{platformCopy.closingTitle[0]}<br /><em>{platformCopy.closingTitle[1]}</em></h2><p data-editorial-decision={messaging.decision} data-editorial-copy="architecture-closing-copy">{platformCopy.closingCopy}</p><div>{[['/capacidades/', __siteT("Explore as capacidades")], ['/ecossistema/', __siteT("Conheça os produtos")], ['/contato/', platformCopy.contactCta]].map(([to, label]) => <Link key={to} className="c-text-link" to={to} {...(to==='/contato/'?{'data-editorial-decision':messaging.decision,'data-editorial-copy':'architecture-contact-cta'}:{})}>{label} <span aria-hidden="true">↗</span></Link>)}</div></section>
  </div></RedesignFrame>;
}
