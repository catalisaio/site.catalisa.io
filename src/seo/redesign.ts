import catalog from '../redesign/data/catalog.json';
import editorial from '../redesign/data/editorial.json';
import { BASE_URL, normalizePath } from './routes';
import privacy from '../i18n/locales/pt-BR/privacy.json';
import terms from '../i18n/locales/pt-BR/terms.json';
import legacySeo from '../i18n/locales/pt-BR/seo.json';
import {enabledSiteLocales,siteLocaleInfo} from '../../shared/site-locale';
import type {SiteLocale} from '../../shared/site-locale';
import {localizeSitePath,parseSitePath} from '../redesign/i18n/routes';
import {translateForLocale} from '../redesign/i18n/runtime';
import {productSourceLabels} from '../redesign/i18n/product-label';

export interface RedesignPage {
  path: string;
  title: string;
  description: string;
  type?: 'CollectionPage' | 'WebPage';
  article?: { headline: string };
  basePath?: string;
  locale?: SiteLocale;
  nativeLegal?: boolean;
}

/** Search descriptions use the concrete responsibilities already visible in the curated catalog. */
const capabilityIntent:Record<string,string>={
 'ai-engine':'API de IA para texto, imagem e áudio',analytics:'analytics da jornada sem identificação pessoal','api-keys':'chaves de API com escopo e rotação','audit-trail':'trilha de auditoria por organização',baas:'Banking as a Service com contas e Pix',banking:'interface para seu aplicativo de banco digital','banking-product-portfolio':'catálogo de produtos financeiros',billing:'assinaturas, uso e faturamento',biometrics:'prova de vida e comparação facial',bureaus:'consulta a bureaus com cache','calculations-engine':'cálculo de parcelas, IOF e CET',calendar:'integração com Google Calendar e Outlook',cms:'gestão de conteúdo de aplicativos',commerce:'catálogo, estoque e pedidos',companies:'representação e poderes de empresas',customers:'cadastro de clientes com validação de CPF','data-extraction':'extração de documentos para JSON','data-store':'armazenamento de documentos JSON','decision-engine':'motor de decisão e regras DMN','decision-platform':'esteira de análise e decisão','document-template':'geração de contratos e documentos','e-signature':'assinatura eletrônica com trilha de eventos',email:'API para Gmail e Outlook','feature-flags':'controle de funcionalidades por segmento','file-storage':'armazenamento de arquivos no S3',iam:'identidade e gestão de permissões','meta-account':'gestão de Meta Business e WABA','open-finance':'dados bancários com consentimento',payments:'pagamentos por cartão, Pix e boleto',people:'contexto de identidade de pessoas','pricing-engine':'precificação de crédito por risco',products:'configuração de produtos de crédito',rooms:'vídeo, gravação e transcrição','service-attestations':'confirmação de serviços prestados',slack:'integração de mensagens com Slack',sso:'login com Google, Microsoft, GitHub e Meta','webhooks-engine':'webhooks com assinatura e retentativas',wpp:'WhatsApp no número da sua empresa','wpp-business':'WhatsApp Business API oficial da Meta',
};

// Only implemented routes belong here. Launch approval is separate from implementation.
export const redesignPages: RedesignPage[] = [
  { path: '/assistente-operacional', title: 'Assistente operacional: consulte e execute tarefas com IA | Catalisa', description: 'Consulte informações e execute tarefas nos sistemas conectados à sua empresa. Conheça o assistente no painel Catalisa e experimente uma demonstração ilustrativa.' },
  { path: '/contato', title: 'Contato: construa sua próxima conexão | Catalisa', description: 'Converse com a Catalisa sobre sua operação, explore uma proposta de composição e escolha como continuar o atendimento.' },
  { path: '/lab', title: 'Lab: explore composições com IA | Catalisa', description: 'Explore ideias de produtos com capacidades Catalisa, revise o conceito e experimente diferentes caminhos de composição com IA.' },
  { path: '/design-system', title: 'Sistema de identidade Catalisa', description: 'Guia de identidade, componentes e estados da plataforma Catalisa.' },
  { path: '/interfaces', title: 'Interfaces: capturas e contexto dos produtos | Catalisa', description: 'Explore interfaces de referência de Banking e Credit. Amplie as capturas para consultar os detalhes, a origem e o contexto de cada tela.' },
  { path: '/press-kit', title: 'Press-kit: marca, assinaturas e recursos oficiais | Catalisa', description: 'Baixe assinaturas, ícones e capas da Catalisa em SVG e PNG. Consulte a paleta aprovada e o guia de uso da marca.' },
  { path: '/fontes', title: 'Fontes e referências do conteúdo | Catalisa', description: 'Consulte as fontes e materiais de referência do site Catalisa, com caminhos para a documentação e os guias de cada produto.' },
  { path: '/mapa', title: 'Mapa do site: explore todas as conexões | Catalisa', description: 'Encontre os caminhos da plataforma, do ecossistema, das capacidades e dos recursos do site Catalisa.' },
  ...editorial.map(page=>({path:page.path,title:`${page.title} | Catalisa`,description:page.description??'Perspectivas da Catalisa sobre produtos, arquitetura e operação.',...(page.stateCount>0?{article:{headline:page.title}}:{type:'CollectionPage' as const})})),
  { path: '/design-system/home', title: 'Catalisa | Crie produtos e automações com IA', description: 'Crie produtos, agentes de IA e automações conectando identidade, dados, decisões e canais. Explore soluções financeiras, crédito e operações com a Catalisa.' },
  { path: '/studio', title: 'Studio: construir agentes e automações por composição | Catalisa', description: 'Conheça o espaço de construção da Catalisa: descreva a necessidade, revise o plano, conecte capacidades e acompanhe a evolução da jornada.' },
  { path: '/workflows', title: 'Workflows: automação de processos e jornadas | Catalisa', description: 'Entenda como eventos, condições e ações organizam a continuidade do trabalho. Explore percursos, dependências, exceções e revisão humana.' },
  { path: '/agentes', title: 'Agentes de IA: contexto, ferramentas e permissões | Catalisa', description: 'Explore papéis de agentes de IA no atendimento e na operação, com contexto autorizado, ferramentas selecionadas e limites de atuação.' },
  { path: '/governanca', title: 'Governança: permissões, revisão e evidências | Catalisa', description: 'Entenda como identidade, permissões, aprovação por segunda pessoa e registros conectam responsabilidade à operação na Catalisa.' },
  { path: '/composicoes', title: 'Composições: conecte capacidades em jornadas | Catalisa', description: 'Explore composições de atendimento, identidade e decisão. Entenda como capacidades com responsabilidades próprias participam de uma mesma jornada.' },
  { path: '/ecossistema', title: 'Ecossistema: produtos construídos com capacidades Catalisa', description: 'Conheça produtos e experiências que combinam capacidades Catalisa em contextos de banking, crédito, saúde, jurídico, identidade e decisão.', type: 'CollectionPage' },
  {path:'/produtos',title:'Produtos: explore o portfólio e as vitrines | Catalisa',description:'Conheça os produtos Catalisa e seus contextos de uso. Explore as vitrines e os detalhes de soluções financeiras, saúde, jurídico, biometria e decisão.',type:'CollectionPage'},
  { path: '/ecossistema/banking', title: 'Banking Platform: crie seu produto financeiro | Catalisa', description: 'Crie uma experiência financeira própria ou modernize a atual. Explore marca, canais e regras de operação com Banking, conforme o escopo e as integrações validadas.' },
  { path: '/ecossistema/credit', title: 'Credit Platform: desenhe seu produto de crédito | Catalisa', description: 'Crie um produto de crédito original ou redesenhe o existente. Explore público, modalidade, política e condições próprias, conectando construção e operação conforme o escopo validado.' },
  { path: '/ecossistema/med', title: 'Med: assistente de IA para clínicas | Catalisa', description: 'Conheça a composição Med: atendimento pelo WhatsApp, contexto e agenda para clínicas, com revisão humana e responsabilidade pelo prontuário.' },
  { path: '/ecossistema/juridico', title: 'Jurídico: triagem e contexto no atendimento | Catalisa', description: 'Explore a composição de atendimento jurídico pelo WhatsApp, com triagem, organização do contexto e análise sob responsabilidade da equipe.' },
  { path: '/ecossistema/biometrics', title: 'Biometrics: identidade, verificação e evidência | Catalisa', description: 'Entenda como sessão, captura, prova de vida e comparação facial se conectam na experiência Biometrics, preservando o contexto e a evidência da verificação.' },
  { path: '/ecossistema/decision', title: 'Decision: políticas versionadas e decisões rastreáveis | Catalisa', description: 'Explore o motor de decisão com políticas em DMN, versões publicadas e rastreabilidade, preservando a responsabilidade das fontes e das regras.' },
  { path: '/visao', title: 'Nossa visão: construir por composição | Catalisa', description: 'Conheça a visão da Catalisa sobre capacidades combináveis, autonomia e responsabilidade na construção de produtos e operações.' },
  { path: '/arquitetura', title: 'Arquitetura: crie produtos e modernize o legado | Catalisa', description: 'Crie produtos financeiros e jornadas de crédito por composição. Planeje a modernização ou substituição do legado por etapas, validando dados, integrações e continuidade da operação.' },
  { path: '/desenvolvedores', title: 'APIs, webhooks e integrações para desenvolvedores | Catalisa', description: 'Explore formas de integrar a Catalisa com APIs, eventos e building blocks. Veja exemplos de requisições e caminhos de adoção.' },
  { path: '/capacidades', title: 'Building blocks: biblioteca de capacidades | Catalisa', description: 'Explore capacidades de identidade, dados, IA, decisão e canais. Consulte exemplos de uso, estágio e documentação de cada building block.', type: 'CollectionPage' },
  ...catalog.blocks.map(block => ({ path: `/capacidades/${block.slug}`, title: `${block.name}: ${capabilityIntent[block.slug]??block.category.toLocaleLowerCase('pt-BR')} | Catalisa`, description: `${block.tagline}. Consulte aplicações, estágio e documentação.` })),
  {path:'/politica-privacidade',title:privacy.title,description:privacy.hero.subtitle,nativeLegal:true},
  {path:'/termos',title:terms.title,description:legacySeo.terms.description,nativeLegal:true},
];

export function getRedesignImage(page: RedesignPage) {
  const parsed=parseSitePath(page.path),basePath=page.basePath??parsed?.basePath??page.path;
  const locale=page.locale??parsed?.locale??'pt-BR';
  const slug=basePath==='/'||basePath==='/design-system/home'?'design-system-home':basePath.slice(1).replace(/\//g,'-');
  const prefix=locale==='pt-BR'?'':siteLocaleInfo[locale].prefix+'/';
  return `/og/redesign/${prefix}${slug}.png`;
}

export function getRedesignPage(path: string) {
  const parsed=parseSitePath(normalizePath(path));if(!parsed)return undefined;
  const sourcePath=parsed.basePath==='/'?'/design-system/home':parsed.basePath;
  const source=redesignPages.find(page=>page.path===sourcePath);if(!source)return undefined;
  const translate=(value:string)=>translateForLocale(parsed.locale,value);
  let title=translate(source.title);
  const product=catalog.products.find(item=>parsed.basePath===`/ecossistema/${item.slug}`);
  if(product&&productSourceLabels[product.name]&&source.title.startsWith(product.name+':')){const colon=title.indexOf(':');if(colon>=0)title=translate(productSourceLabels[product.name])+title.slice(colon);}
  return {...source,path:parsed.canonicalPath,basePath:parsed.basePath,locale:parsed.locale,title,description:translate(source.description),...(source.article?{article:{headline:translate(source.article.headline)}}:{})};
}

/** Emit only after the release gate has verified every enabled dictionary. */
export function getRedesignAlternates(basePath:string):Record<string,string>{
  return Object.fromEntries([...enabledSiteLocales.map(locale=>[siteLocaleInfo[locale].hreflang,localizeSitePath(basePath,locale)]),['x-default',localizeSitePath(basePath,'pt-BR')]]);
}

export function getRedesignGraph(page: RedesignPage) {
  const resolved=page.basePath&&page.locale?page:getRedesignPage(page.path)??page;
  const basePath=resolved.basePath??resolved.path,locale=resolved.locale??'pt-BR';
  const translate=(value:string)=>translateForLocale(locale,value);
  const local=(path:string)=>BASE_URL+localizeSitePath(path,locale);
  const url = BASE_URL + resolved.path;
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': `${BASE_URL}/#organization`, name: 'Catalisa', url: BASE_URL, logo: `${BASE_URL}/redesign/brand/catalisa-logo-principal.svg`,sameAs:['https://www.linkedin.com/company/catalisa-platform'] },
    { '@type': 'WebSite', '@id': `${BASE_URL}/#website`, url: BASE_URL, name: 'Catalisa',inLanguage:[...enabledSiteLocales], publisher: { '@id': `${BASE_URL}/#organization` } },
    { '@type': resolved.type ?? 'WebPage', '@id': `${url}#webpage`, url, name: resolved.title, description: resolved.description, inLanguage: locale, isPartOf: { '@id': `${BASE_URL}/#website` },about:{'@id':`${BASE_URL}/#organization`},primaryImageOfPage:{'@type':'ImageObject',url:BASE_URL+getRedesignImage(resolved),width:1200,height:630} },
  ];
  if (basePath !== '/' && !basePath.startsWith('/design-system')) {
    const block = catalog.blocks.find(item => basePath === `/capacidades/${item.slug}`);
    const crumbs = [{ name: 'Catalisa', item: local('/') }];
    if (block) crumbs.push({ name: translate('Building blocks'), item: local('/capacidades') });
    if(basePath.startsWith('/ecossistema/'))crumbs.push({name:translate('Ecossistema'),item:local('/ecossistema')});
    if(basePath.startsWith('/perspectivas/'))crumbs.push({name:translate('Perspectivas'),item:local('/perspectivas')});
    crumbs.push({ name: block?.name ?? resolved.title.split(' | ')[0], item: url });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })) });
    graph[2].breadcrumb={'@id':`${url}#breadcrumb`};
  }
  if (basePath === '/capacidades') graph.push({ '@type': 'ItemList', '@id': `${url}#catalog`, numberOfItems: catalog.blocks.length, itemListElement: catalog.blocks.map((block, i) => ({ '@type': 'ListItem', position: i + 1, name: block.name, url: local(`/capacidades/${block.slug}`) })) });
  if(basePath==='/produtos')graph.push({'@type':'ItemList','@id':`${url}#products`,numberOfItems:catalog.products.length,itemListElement:catalog.products.map((product,index)=>({'@type':'ListItem',position:index+1,name:translate(productSourceLabels[product.name]??product.name),url:local(`/ecossistema/${product.slug}`)}))});
  if(resolved.article)graph.push({'@type':'Article','@id':`${url}#article`,headline:resolved.article.headline,description:resolved.description,image:BASE_URL+getRedesignImage(resolved),inLanguage:locale,mainEntityOfPage:{'@id':`${url}#webpage`},author:{'@id':`${BASE_URL}/#organization`},publisher:{'@id':`${BASE_URL}/#organization`}});
  return { '@context': 'https://schema.org', '@graph': graph };
}
