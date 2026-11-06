import type {ReactNode} from 'react';
import {RedesignFrame} from './foundation-components';
import {LocalizedLink as Link} from './i18n/navigation';
import {productLabel} from './i18n/product-label';
import {localizeData,t} from './i18n/runtime';
import {ProductArt} from './ProductArt';
import directory from './data/product-directory.json';
import './product-detail.css';

const highlights:Record<string,string[]>={
  banking:['Crie seu produto financeiro.','Conecte a experiência à operação.','Uma base compartilhada.'],
  credit:['Seu produto de crédito.','Suas regras.','Uma nova composição.'],
  med:['Atendimento e agenda','Vídeo e copiloto','Papéis diferentes'],
  juridico:['Acervo da casa','Rotina do escritório','Diferentes estruturas'],
  recrutamento:['Candidatura','Entrevista em vídeo','O ATS que você já usa'],
  biometrics:['Prova de vida','Integração','Política própria'],
  decision:['Motor de decisão','Esteira de dados','Integração em camadas'],
};
export function ProductDetailIntro({slug}:{slug:string}){
  const product=localizeData(directory).products.find(item=>item.slug===slug);
  if(!product)return null;
  const financial=slug==='banking'||slug==='credit';
  const longName=product.headline.split(/[\s-]+/).some(word=>word.length>14);
  return <div className={`p-detail p-detail--${slug}${longName?' p-detail--long-name':''}`}>
    <nav className="c-wrap p-detail-breadcrumb" aria-label={t('Localização')}><Link to="/produtos/">{t('Produtos')}</Link><span aria-hidden="true">/</span><span>{productLabel(product.name)}</span></nav>
    <section className="p-detail-hero"><div className="c-wrap p-detail-layout"><div className="p-detail-copy"><span className="c-eyebrow">{financial?(slug==='banking'?'CBP / ':'CCP / '):'CATALISA / '}{productLabel(product.name)}{' / '}{t(product.category)}</span><h1 className="c-hero-direct">{product.headline}</h1><p>{product.description}</p><div className="p-detail-actions">{product.siteUrl?<a className="p-detail-button" href={product.siteUrl} target="_blank" rel="noopener noreferrer">{t('Visitar site')}<span aria-hidden="true">↗</span></a>:<Link className="p-detail-button" to="/contato/">{t('Falar com a Catalisa')}<span aria-hidden="true">↗</span></Link>}<a className="p-detail-read" href="#product-overview">{t('Conhecer o produto')}<span aria-hidden="true">↓</span></a></div></div><div className={`p-detail-art p-detail-art--${slug}`} aria-hidden="true"><ProductArt product={slug}/><span className="p-detail-art-index">{financial?(slug==='banking'?'CBP':'CCP'):'catalisa.'}</span><span className="p-detail-art-dot"/></div></div></section>
    <section className="c-wrap p-detail-highlights" id="product-overview" aria-label={t('Conhecer o produto')}>{(highlights[slug]??[]).map((text,index)=><div key={text}><span>0{index+1}</span><h2>{t(text)}</h2></div>)}</section>
  </div>;
}
export function ProductMore({children}:{children:ReactNode}){return <div className="p-detail-more c-wrap"><div className="p-detail-expanded">{children}</div></div>;}
export default function ProductDetail({slug,children}:{slug:string;children:ReactNode}){
  const product=directory.products.find(item=>item.slug===slug);
  return <RedesignFrame title={productLabel(product?.name??'Produtos')}><ProductDetailIntro slug={slug}/><ProductMore>{children}</ProductMore></RedesignFrame>;
}
