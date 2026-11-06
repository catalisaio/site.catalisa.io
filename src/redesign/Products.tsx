import {RedesignFrame} from './foundation-components';
import {LocalizedLink as Link} from './i18n/navigation';
import {productLabel} from './i18n/product-label';
import {localizeData,t} from './i18n/runtime';
import {ProductArt} from './ProductArt';
import directory from './data/product-directory.json';
import './base.css';
import './products.css';

type Product=(typeof directory.products)[number];
function ProductLinks({product}:{product:Product}){
  return <div className="p-directory-actions">
    {product.siteUrl?<a className="p-product-button" href={product.siteUrl} target="_blank" rel="noopener noreferrer" aria-label={t('Visitar site')+': '+productLabel(product.name)+' · '+t('Abre em nova aba')}>{t('Visitar site')}<span aria-hidden="true">↗</span></a>
    :<Link className="p-product-button" to="/contato/" aria-label={t('Falar com a Catalisa')+': '+productLabel(product.name)}>{t('Falar com a Catalisa')}<span aria-hidden="true">↗</span></Link>}
    <Link className="p-product-detail" to={product.detailPath} aria-label={t('Conhecer o produto')+': '+productLabel(product.name)}>{t('Conhecer o produto')}<span aria-hidden="true">↗</span></Link>
  </div>;
}
function ProductCard({product,index}:{product:Product;index:number}){
  const financial=index<2;
  return <article className={`p-product p-product--${product.slug} ${financial?'p-product--financial':''}`} data-product={product.slug} id={`product-${product.slug}`}>
    <Link className="p-product-visual" to={product.detailPath} aria-label={t('Conhecer o produto')+': '+productLabel(product.name)}><ProductArt product={product.slug}/><span className="p-product-mark" aria-hidden="true">{financial?(index===0?'CBP':'CCP'):String(index+1).padStart(2,'0')}</span><span className="p-visual-arrow" aria-hidden="true">↗</span></Link>
    <div className="p-product-copy"><span className="c-eyebrow">{t(product.category)}</span><h3>{productLabel(product.name)}</h3><p>{product.description}</p><ProductLinks product={product}/></div>
  </article>;
}
export default function Products(){
  const data=localizeData(directory);
  return <RedesignFrame title={data.title}><div className="c-products">
    <section className="p-directory-hero"><div className="c-wrap p-hero-layout">
      <div className="p-hero-copy"><span className="c-eyebrow">{t('Ecossistema Catalisa')}</span><h1 className="c-hero-direct">{t("Encontre o produto para a sua operação.")}</h1><p>{data.intro}</p><a className="p-hero-link" href="#financial-products">{t('Conheça as soluções')}<span aria-hidden="true">↓</span></a></div>
      <div className="p-hero-art" aria-hidden="true"><span className="p-hero-orbit"/><img src="/redesign/media-v2/hero-composition.webp" alt="" width={1536} height={1024} fetchPriority="high"/><span className="p-hero-signature">catalisa<span>.</span></span><span className="p-hero-dot"/></div>
    </div><nav className="c-wrap p-product-index" aria-label={t('Nesta página')}><a href="#financial-products"><span>01</span>{t('Plataformas financeiras')}<span aria-hidden="true">↓</span></a><a href="#beyond-finance"><span>02</span>{t('Além do financeiro')}<span aria-hidden="true">↓</span></a></nav></section>
    <section className="p-financial-section c-wrap" id="financial-products"><div className="p-section-heading"><span className="c-eyebrow">01 / {t('Serviços financeiros')}</span><h2>{t('Seu produto financeiro.')}<br/><em>{t('Suas possibilidades.')}</em></h2></div><div className="p-financial-grid">{data.products.slice(0,2).map((product,index)=><ProductCard key={product.slug} product={product} index={index}/>)}</div></section>
    <section className="p-more-section" id="beyond-finance" aria-labelledby="other-products-title"><div className="c-wrap"><div className="p-section-heading"><span className="c-eyebrow">02 / {t('Além do financeiro')}</span><h2 id="other-products-title">{t('Outros contextos.')}<br/><em>{t('O mesmo potencial.')}</em></h2></div><div className="p-directory-grid">{data.products.slice(2).map((product,index)=><ProductCard key={product.slug} product={product} index={index+2}/>)}</div></div></section>
  </div></RedesignFrame>;
}
