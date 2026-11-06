import{productLabel as __productLabel}from"../i18n/product-label";
import {CaptureButton} from '../operation-components';
import type {Capture} from '../operation-components';
import financialCaptures from '../data/financial-captures.json';
import operationCaptures from '../data/operation-captures.json';
import {t} from '../i18n/runtime';
import './product-showcase.css';

type ShowcaseProduct = 'banking' | 'studio';
type GalleryProduct = 'banking' | 'credit';
type DocumentedCapture = Capture & {source?: string; path?: string; sha?: string};

/** Only documented staging/published captures. No prototype or local candidate. */
const approvedFiles = {
  banking: ['bank-live-accounts.jpg', 'bank-live-holds.jpg'],
  studio: ['studio-builder.jpg', 'studio-canvas.png'],
  credit: ['credit-latest-agreements.png', 'credit-latest-covenants.png'],
} as const;

function selectedCaptures(product: ShowcaseProduct | GalleryProduct): DocumentedCapture[] {
  const inventory: DocumentedCapture[] = [...financialCaptures, ...operationCaptures];
  return approvedFiles[product].map(file => {
    const capture = inventory.find(item => item.file === file);
    if (!capture) throw new Error('Documented product capture is missing: ' + file);
    return capture;
  });
}

/** Pass these records to an existing OperationFrame when a restricted gallery is needed. */
export function getProductGalleryCaptures(product: GalleryProduct): Capture[] {
  return selectedCaptures(product).map(item => ({
    ...item, title: t(item.title), desc: t(item.desc), type: t(item.type), origin: t(item.origin),
  }));
}

function CaptureImage({capture, className}: {capture: DocumentedCapture; className?: string}) {
  return <img className={className} src={'/redesign/screens/' + capture.file}
    alt={t(capture.desc)} width={capture.width} height={capture.height}
    loading="lazy" decoding="async"/>;
}

/**
 * Static media composition for Home and ecosystem cards. Safe inside a Link:
 * no nested links/buttons, simulated UI, animation or generated screenshot.
 * Banking uses the implemented console: the old desktop/mobile references are
 * not silently relabelled as current production captures.
 */
export function ProductShowcase({product, variant = 'feature', className = ''}: {
  product: ShowcaseProduct; variant?: 'feature' | 'card'; className?: string;
}) {
  const captures = selectedCaptures(product);
  return <figure className={`c-product-showcase c-product-showcase--${product} c-product-showcase--${variant} ${className}`}>
    <div className="c-product-showcase__stage">
      <span className="c-product-showcase__orbit" aria-hidden="true"/>
      {captures.map((capture, index) => <div key={capture.file}
        className={`c-product-showcase__window c-product-showcase__window--${index}`}>
        <div className="c-product-showcase__chrome" aria-hidden="true">
          <span><i/><i/><i/></span><small>{product === 'studio' ? 'Catalisa Studio' : __productLabel("Banking Platform")}</small>
        </div>
        <CaptureImage capture={capture}/>
      </div>)}
    </div>
    <figcaption className="c-product-showcase__caption">
      <span>{product === 'studio' ? t('Capturas publicadas do Studio.') : t('Capturas do console implementado em staging.')}</span>
      <span>{t('Interfaces de referência; disponibilidade e configuração podem variar.')}</span>
    </figcaption>
  </figure>;
}

/**
 * Replaces a screenshot reel with inspectable, documented stills. Render inside
 * the existing OperationFrame so CaptureButton keeps the established native
 * dialog, keyboard navigation, zoom, focus return and provenance presentation.
 * This component does not create a nested page frame or another modal.
 */
export function ProductGallery({product, className = ''}: {product: GalleryProduct; className?: string}) {
  const captures = selectedCaptures(product);
  return <div className={`c-product-gallery ${className}`}>
    <div className={`c-product-gallery__editorial c-product-gallery__editorial--${product}`} aria-hidden="true">
      <img src={product === 'banking' ? '/redesign/media-v3/editorial-composition.jpg' : '/redesign/media-v3/editorial-executive.jpg'}
        alt="" width={1280} height={720} loading="lazy" decoding="async"/>
    </div>
    <div className="c-product-gallery__intro">
      <span>{t('Interfaces documentadas')}</span>
      <p>{t('Explore as capturas e amplie os detalhes.')}</p>
    </div>
    <div className="c-product-gallery__grid">
      {captures.map(capture => <figure className="c-product-gallery__item" key={capture.file}>
        <CaptureButton file={capture.file} label={t('Ampliar {value0}', {value0: t(capture.title)})}
          className="c-product-gallery__open">
          <CaptureImage capture={capture}/><span aria-hidden="true">↗</span>
        </CaptureButton>
        <figcaption>
          <strong>{t(capture.title)}</strong><p>{t(capture.desc)}</p>
          <small>{t(capture.origin)}</small>
          {capture.source && <a href={capture.source} target="_blank" rel="noopener noreferrer">{t('Origem da captura ↗')}</a>}
          {capture.path && <details><summary>{t('Referência preservada')}</summary>
            <code>{capture.path}</code>{capture.sha && <code>{capture.sha}</code>}
          </details>}
        </figcaption>
      </figure>)}
    </div>
    <p className="c-product-gallery__note">{t('Capturas de staging. Não são uma gravação de fluxo nem comprovam a publicação dessas interfaces em produção.')}</p>
  </div>;
}
