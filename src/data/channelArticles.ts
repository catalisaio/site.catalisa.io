/**
 * Channel articles: one long editorial page per thesis.
 * Native social posts are citations in `channels`, never separate pages.
 * Only absolute https URLs that already exist may be listed.
 */

export type ArticleLocale = 'pt' | 'en';

export type ChannelVoice = 'klederson' | 'catalisa';

export interface ChannelCitation {
  platform: string;
  /** Short public name of the network, e.g. "LinkedIn" or "X". */
  label: string;
  voice: ChannelVoice;
  /** Absolute https URL of the published post. Never a placeholder. */
  url: string;
  /** ISO date or datetime of the original post. */
  postedAt: string;
}

export interface LocalizedText {
  pt: string;
  en: string;
}

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string };

export interface RelatedPerspective {
  title: LocalizedText;
  url: LocalizedText;
}

export interface ChannelArticle {
  slug: string;
  date: string;
  series: LocalizedText;
  episode: number;
  title: LocalizedText;
  thesis: LocalizedText;
  excerpt: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  keywords: Record<ArticleLocale, string[]>;
  relatedPerspective?: RelatedPerspective;
  channels: ChannelCitation[];
  body: Record<ArticleLocale, ArticleBlock[]>;
}

const HTTPS_URL = /^https:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i;

const REJECTED_URL_TOKENS = [
  'example.com',
  'example.org',
  'example.net',
  'placeholder',
  'localhost',
  'seu-link',
  'todo',
  'changeme',
  'xxx',
];

/** True only for a real absolute https URL. Placeholders and bare http are rejected. */
export function isPublishedChannelUrl(url: string): boolean {
  if (typeof url !== 'string' || !HTTPS_URL.test(url)) return false;
  const lower = url.toLowerCase();
  return !REJECTED_URL_TOKENS.some((token) => lower.includes(token));
}

export function publishedChannels(article: ChannelArticle): ChannelCitation[] {
  return article.channels.filter((channel) => isPublishedChannelUrl(channel.url));
}

export function articleLocale(language: string | undefined): ArticleLocale {
  return language?.toLowerCase().startsWith('en') ? 'en' : 'pt';
}

export function articlePath(slug: string, locale: ArticleLocale): string {
  return locale === 'en' ? `/en/artigos/${slug}` : `/artigos/${slug}`;
}

export function articleIndexPath(locale: ArticleLocale): string {
  return locale === 'en' ? '/en/artigos' : '/artigos';
}

export function articleWordCount(article: ChannelArticle, locale: ArticleLocale): number {
  const text = article.body[locale]
    .map((block) => (block.type === 'list' ? block.items.join(' ') : block.text))
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export function articleReadingMinutes(article: ChannelArticle, locale: ArticleLocale): number {
  return Math.max(1, Math.round(articleWordCount(article, locale) / 200));
}

const episodeOneBodyPt: ArticleBlock[] = [
  {
    type: 'paragraph',
    text: 'A Pesquisa de Tecnologia Bancária da Febraban projeta R$ 50,4 bilhões de orçamento tecnológico para os bancos em 2026. O número descreve a escala do investimento. Não diz quanto desse esforço chega ao próximo produto no ar, nem recomenda uma arquitetura. A pergunta deste episódio é anterior ao catálogo: o que precisa estar de pé para uma jornada de crédito funcionar de ponta a ponta.',
  },
  {
    type: 'heading',
    text: 'Onde o projeto costuma parar',
  },
  {
    type: 'paragraph',
    text: 'Dois atrasos se repetem. No primeiro, o trabalho externo termina no diagnóstico e a construção entra na fila de quem sustenta o legado. No segundo, o mesmo trabalho tenta refazer o que quase todo projeto de crédito acaba precisando: motor de regras, assinatura e mesa de análise. A primeira conversa com o cliente final espera uma obra longa. Os dois ofícios são legítimos. Os dois adiam a esteira.',
  },
  {
    type: 'heading',
    text: 'Compor é escolher a primeira jornada',
  },
  {
    type: 'paragraph',
    text: 'O que muda de instituição para instituição é o relacionamento, o desenho da política e a implantação. O que se repete é a fundação. Compor é trazer essa fundação pronta e limitar a abertura a uma jornada de crédito, já com a marca de quem oferece o produto. Conta, Pix e outros canais só entram se a operação pedir, e entram sobre o mesmo fundamento. Não é uma proposta de recomeçar o banco. É uma fronteira pequena o bastante para ser vista.',
  },
  {
    type: 'paragraph',
    text: 'A leitura de arquitetura dessa fronteira — o que compartilhar, o que preservar e como conviver com o que já funciona — está na perspectiva “Modernizar sem recomeçar o banco”. Este artigo fica na tese. A análise da fronteira continua lá.',
  },
  {
    type: 'heading',
    text: 'A esteira, visível',
  },
  {
    type: 'paragraph',
    text: 'Numa demonstração da plataforma, com dados fictícios, a jornada cabe em quatro momentos. Nenhum deles é resultado de cliente e nenhum mede prazo de implantação.',
  },
  {
    type: 'list',
    items: [
      'A proposta e a simulação aparecem com a identidade visual da instituição.',
      'A decisão sai de tabelas DMN 1.3 versionadas, com trilha por operação.',
      'A formalização segue com assinatura eletrônica e certificado de conclusão.',
      'A mesa recebe o caso com motivo e histórico.',
    ],
  },
  {
    type: 'note',
    text: 'Demonstração da plataforma. Dados fictícios.',
  },
  {
    type: 'heading',
    text: 'O que fica com quem implanta',
  },
  {
    type: 'paragraph',
    text: 'Consultoria e integrador continuam com a política e com a implantação. A fundação não precisa ser reconstruída para que essa política tenha onde viver. A pergunta que o episódio deixa é concreta: no último desenho de crédito, o que travou primeiro, a política ou a construção da base?',
  },
];

const episodeOneBodyEn: ArticleBlock[] = [
  {
    type: 'paragraph',
    text: 'Febraban’s banking technology survey projects R$ 50.4 billion in technology budgets for Brazilian banks in 2026. The figure describes the scale of planned investment. It does not say how much of that effort becomes the next product in production, and it does not recommend an architecture. The question in this episode comes before the catalog: what has to be standing for a credit journey to work from end to end.',
  },
  {
    type: 'heading',
    text: 'Where the project usually stalls',
  },
  {
    type: 'paragraph',
    text: 'Two delays keep returning. In the first, outside work ends at the diagnosis and construction joins the queue of the team that keeps the legacy running. In the second, the same work tries to rebuild what almost every credit project eventually needs: a rules engine, signing, and an analysis desk. The first conversation with the end client waits on a long build. Both crafts are legitimate. Both postpone the pipeline.',
  },
  {
    type: 'heading',
    text: 'Composition means choosing the first journey',
  },
  {
    type: 'paragraph',
    text: 'What changes from one institution to another is the relationship, the design of the policy, and the implementation. What repeats is the foundation. Building by composition means bringing that foundation ready and limiting the opening to a single credit journey, already under the brand of the institution that offers the product. Account, Pix, and other channels come in only if the operation asks for them, and they come in on the same foundation. This is not a proposal to restart the bank. It is a boundary small enough to be seen.',
  },
  {
    type: 'paragraph',
    text: 'The architectural reading of that boundary — what to share, what to keep distinct, and how to coexist with what already works — is in the perspective “Modernize without rebuilding the bank from scratch.” This article stays with the thesis. The analysis of the boundary continues there.',
  },
  {
    type: 'heading',
    text: 'The pipeline, made visible',
  },
  {
    type: 'paragraph',
    text: 'In a platform demonstration, with fictional data, the journey fits in four moments. None of them is a client result, and none of them measures an implementation timeline.',
  },
  {
    type: 'list',
    items: [
      'The proposal and the simulation appear with the institution’s visual identity.',
      'The decision comes from versioned DMN 1.3 tables, with a trail per operation.',
      'Formalization continues with an electronic signature and a completion certificate.',
      'The desk receives the case with the reason and the history.',
    ],
  },
  {
    type: 'note',
    text: 'Platform demonstration. Fictional data.',
  },
  {
    type: 'heading',
    text: 'What stays with the team that implements',
  },
  {
    type: 'paragraph',
    text: 'Consultancies and integrators keep the policy and the implementation. The foundation does not need to be rebuilt for that policy to have a place to live. The question this episode leaves is concrete: in the last credit design, what stalled first, the policy or the construction of the base?',
  },
];

export const channelArticles: ChannelArticle[] = [
  {
    slug: 'construir-por-composicao',
    date: '2026-11-06',
    series: { pt: 'Esteira visível', en: 'Esteira visível' },
    episode: 1,
    title: { pt: 'Construir por composição', en: 'Build by composition' },
    thesis: {
      pt: 'A fundação que se repete entra pronta. A primeira entrega é uma jornada de crédito, com a marca da instituição.',
      en: 'The foundation that repeats arrives ready. The first delivery is one credit journey, under the institution’s brand.',
    },
    excerpt: {
      pt: 'Uma jornada de crédito, não o banco inteiro. Proposta, decisão versionada, formalização e mesa entram por composição, com a marca de quem oferece o produto.',
      en: 'One credit journey, not the whole bank. Proposal, versioned decision, formalization, and the desk arrive by composition, under the brand of the institution that offers the product.',
    },
    metaTitle: {
      pt: 'Construir por composição: a primeira jornada | Catalisa',
      en: 'Build by composition: the first journey | Catalisa',
    },
    metaDescription: {
      pt: 'Como uma jornada de crédito entra por composição: proposta, decisão versionada, formalização e mesa, com a marca da instituição.',
      en: 'How a credit journey arrives by composition: proposal, versioned decision, formalization, and desk, under the institution’s brand.',
    },
    keywords: {
      pt: ['crédito por composição', 'esteira de crédito', 'modernização bancária', 'DMN 1.3', 'jornada de crédito'],
      en: ['credit by composition', 'credit pipeline', 'banking modernization', 'DMN 1.3', 'credit journey'],
    },
    relatedPerspective: {
      title: {
        pt: 'Modernizar sem recomeçar o banco.',
        en: 'Modernize without rebuilding the bank from scratch.',
      },
      url: {
        pt: 'https://catalisa.io/perspectivas/construir-por-composicao',
        en: 'https://catalisa.io/en/perspectives/building-by-composition',
      },
    },
    channels: [
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        voice: 'klederson',
        url: 'https://www.linkedin.com/feed/update/urn:li:activity:7524442037891543041/',
        postedAt: '2026-11-06T12:06:19Z',
      },
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        voice: 'catalisa',
        url: 'https://www.linkedin.com/feed/update/urn:li:share:7524441529097281537/?actorCompanyId=88375615',
        postedAt: '2026-11-06',
      },
      {
        platform: 'x',
        label: 'X',
        voice: 'catalisa',
        url: 'https://x.com/catalisaio/status/2118678368094744899',
        postedAt: '2026-11-06T12:14:20Z',
      },
    ],
    body: { pt: episodeOneBodyPt, en: episodeOneBodyEn },
  },
];

export const channelArticleSlugs = channelArticles.map((article) => article.slug);

export function getChannelArticleBySlug(slug: string | undefined): ChannelArticle | undefined {
  if (!slug) return undefined;
  return channelArticles.find((article) => article.slug === slug);
}
