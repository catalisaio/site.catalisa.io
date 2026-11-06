import{productLabel as __productLabel}from"./i18n/product-label";
import{LocalizedLink as Link}from"./i18n/navigation";
import {t as __siteT} from "./i18n/runtime";
import { useState } from 'react';

import { VisionSculpture } from './FoundationArt';
import { MotionControl, RedesignFrame } from './foundation-components';
import './base.css';
import './vision-reference.css';
import './foundations.css';

const principles = [
  [__siteT("Clareza"), __siteT("Entender antes de conectar."), __siteT("Cada capacidade tem um papel. Saber o que ela faz e onde termina ajuda a construir produtos mais compreensíveis para quem decide, cria e opera.")],
  [__siteT("Composição"), __siteT("Combinar para criar o próprio."), __siteT("Capacidades compartilhadas não precisam gerar produtos iguais. A combinação, a jornada e a experiência dão forma ao contexto de cada negócio.")],
  [__siteT("Responsabilidade"), __siteT("Autonomia com limites claros."), __siteT("Permissões, histórico e revisão humana ajudam a definir quem pode agir, acompanhar o que aconteceu e cuidar das decisões que importam.")],
] as const;

export default function Vision() {
  const [principle, setPrinciple] = useState(0);
  const [paused, setPaused] = useState(false);
  return <RedesignFrame title={__siteT("Visão — prévia do redesign")} paused={paused}>
    <article className="v-page">
      <section className="v-hero">
        <div className="c-wrap v-hero-grid">
          <div className="v-hero-copy">
            <span className="v-eyebrow">{__siteT("Visão da Catalisa")}</span>
            <h1 className="c-hero-direct">{__siteT("Conheça a plataforma por trás dos produtos Catalisa.")}</h1>
            <p>{__siteT("Criamos uma base de identidade, dados, IA e integrações para desenvolver produtos e automatizar operações. Cada produto mantém sua experiência e suas regras de negócio.")}</p>
            <a href="#v-perspectiva" className="c-text-link">{__siteT("Conheça nossa perspectiva ")}<span aria-hidden="true">↓</span></a>
          </div>
          <div className="v-hero-art"><VisionSculpture /><div className="v-art-caption"><span>{__siteT("01 — intenção")}</span><span>{__siteT("02 — conexão")}</span><span>{__siteT("03 — forma")}</span></div></div>
        </div>
        <div className="c-wrap v-hero-baseline"><span>{__siteT("Uma plataforma. Muitas possibilidades.")}</span><span>{__siteT("A forma segue a conexão.")}</span></div>
        <MotionControl paused={paused} toggle={() => setPaused(value => !value)} />
      </section>
      <section id="v-perspectiva" className="c-wrap v-statement">
        <span className="v-eyebrow">{__siteT("O ponto de partida")}</span><h2>{__siteT("Há ideias demais")}<br />{__siteT("esperando os sistemas")}<br /><em>{__siteT("se entenderem.")}</em></h2>
        <div className="v-statement-body"><span className="v-statement-glyph" aria-hidden="true">↗</span><div><p>{__siteT("Uma experiência simples para quem usa costuma exigir muitas conexões por trás. Pessoas, dados, decisões, pagamentos, documentos e conversas precisam trabalhar juntos.")}</p><p>{__siteT("A Catalisa existe para dar estrutura a essa construção. Organizamos capacidades que podem ser conectadas, reutilizadas e combinadas em produtos com uma identidade própria.")}</p></div></div>
      </section>
      <section className="v-principles"><div className="c-wrap">
        <div className="v-principles-heading"><span className="v-eyebrow">{__siteT("Nosso jeito de pensar")}</span><h2>{__siteT("Peças com propósito.")}<br />{__siteT("Conexões com sentido.")}</h2><p>{__siteT("Três ideias orientam a plataforma.")}<br />{__siteT("Explore cada uma.")}</p></div>
        <div className="v-principles-layout">
          <div className="v-principle-controls" role="group" aria-label={__siteT("Princípios da Catalisa")}>{principles.map(([label], index) => <button key={label} onClick={() => setPrinciple(index)} aria-pressed={principle === index}><span>0{index + 1}</span> {label} <b aria-hidden="true">↗</b></button>)}</div>
          <div className="v-principle-scene" data-mode={principle}><div className="v-principle-shapes" aria-hidden="true"><i /><i /><i /><i /></div><div className="v-principle-description" aria-live="polite"><h3>{principles[principle][1]}</h3><p>{principles[principle][2]}</p></div></div>
        </div>
      </div></section>
      <section className="v-evolution c-wrap"><div><span className="v-eyebrow">{__siteT("Uma base para evoluir")}</span><h2>{__siteT("O próximo passo")}<br />{__siteT("não precisa começar")}<br /><em>{__siteT("do zero.")}</em></h2></div><div className="v-evolution-body"><p>{__siteT("Um produto muda quando o negócio muda. Uma nova jornada, um novo canal, uma regra diferente. A estrutura precisa acompanhar esse movimento.")}</p><p>{__siteT("Building blocks organizam capacidades. Workflows conectam etapas. Agentes aproximam conversa e ação. Governança estabelece limites e mantém o histórico do que acontece.")}</p><Link className="c-text-link" to="/arquitetura/">{__siteT("Entenda a arquitetura ")}<span aria-hidden="true">↗</span></Link><div className="v-evolution-track" aria-hidden="true"><i /><span /><i /><span /><i /></div></div></section>
      <section className="v-products"><div className="c-wrap"><span className="v-eyebrow">{__siteT("A visão encontra o mundo")}</span><h2>{__siteT("Uma mesma origem.")}<br />{__siteT("Expressões próprias.")}</h2><p className="v-products-intro">{__siteT("Banking e Credit tornam essa ideia concreta: experiências diferentes construídas sobre capacidades da plataforma.")}</p><div className="v-product-pair">
        <Link className="v-product v-product-bank" to="/ecossistema/banking/"><div className="v-product-art" aria-hidden="true"><div className="v-bank-phone"><i /><span>{__productLabel("Banking Platform")}</span><b>↗</b><hr /><hr /><hr /></div><div className="v-bank-orbit" /></div><span className="v-eyebrow">{__productLabel("Banking Platform")}</span><h3>{__siteT("Uma relação.")}<br />{__siteT("Muitos pontos de contato.")}</h3><p>{__siteT("Aplicativo, desktop do titular e console de operação conectam a experiência de quem usa à rotina de quem cuida.")}</p><span className="c-text-link">{__siteT("Conheça Banking ↗")}</span></Link>
        <Link className="v-product v-product-credit" to="/ecossistema/credit/"><div className="v-product-art" aria-hidden="true"><div className="v-credit-paper"><span>{__productLabel("Credit Platform")}</span><i /><i /><i /><b>↗</b></div><div className="v-credit-ring" /></div><span className="v-eyebrow">{__productLabel("Credit Platform")}</span><h3>{__siteT("Da intenção")}<br />{__siteT("ao acompanhamento.")}</h3><p>{__siteT("Produto, política, formalização e operação se conectam para dar continuidade à jornada de crédito.")}</p><span className="c-text-link">{__siteT("Conheça Credit ↗")}</span></Link>
      </div></div></section>
      <section className="c-wrap v-human"><span className="v-eyebrow">{__siteT("Tecnologia a serviço de uma intenção")}</span><h2>{__siteT("Construir é conectar.")}<br /><em>{__siteT("O sentido vem das pessoas.")}</em></h2><div><p>{__siteT("A tecnologia amplia o que podemos fazer. As pessoas definem por que fazer, o que importa e quando é preciso olhar de novo.")}</p><p>{__siteT("Por isso, autonomia e responsabilidade fazem parte da mesma conversa na Catalisa: permissões, evidências e espaço para a decisão humana.")}</p></div><Link className="c-text-link" to="/governanca/">{__siteT("Como pensamos a governança ↗")}</Link></section>
      <section className="v-ending"><div className="c-wrap"><span className="v-eyebrow">{__siteT("O que você quer colocar no mundo?")}</span><h2>{__siteT("A próxima forma")}<br />{__siteT("começa com ")}<em>{__siteT("uma ideia.")}</em></h2><div><Link className="v-button" to="/lab/">{__siteT("Imagine seu produto ↗")}</Link><Link className="c-text-link" to="/contato/">{__siteT("Converse com a Catalisa ↗")}</Link></div><span className="v-ending-circle" aria-hidden="true" /></div></section>
    </article>
  </RedesignFrame>;
}
