// Contrato entre o roteiro (storyboard.json, escrito pelo Claude) e o renderizador.
// Mantenha em sincronia com schemas/storyboard.schema.json.

export type Format = '16:9' | '9:16' | '1:1' | '4:5';

export const DIMENSIONS: Record<Format, { width: number; height: number }> = {
	'16:9': { width: 1920, height: 1080 },
	'9:16': { width: 1080, height: 1920 },
	'1:1': { width: 1080, height: 1080 },
	'4:5': { width: 1080, height: 1350 },
};

/** Região de interesse num print, em frações (0–1) da largura/altura da imagem. */
export type Box = { x: number; y: number; w: number; h: number };

export type Brand = {
	name: string;
	tagline?: string;
	url?: string;
	logo?: string; // caminho relativo à pasta do job
	/** Versão clara do logo, para fundo escuro e sobre filmagem. */
	logoLight?: string;
	colors: { primary: string; accent: string; background: string; text: string };
	/** Fonte do texto (nome de família do Google Fonts, ex.: "Inter"). Carregada no render. */
	font?: string;
	/** Fonte dos títulos, quando o site usa outra (ex.: "Spectral"). */
	headingFont?: string;
};

/** push = a próxima empurra a atual · line = o traço laranja da marca se desenha e abre a próxima · dive = a câmera mergulha na cena e sai na próxima. */
export type TransitionStyle = 'fade' | 'slide' | 'zoom' | 'whip' | 'cut' | 'push' | 'line' | 'dive';

type Base = {
	id: string;
	/** Duração em segundos. */
	duration: number;
	/** Legenda curta exibida na tela (PT-BR). */
	caption?: string;
	/** Transição de entrada desta cena (padrão: a do vídeo). */
	enter?: TransitionStyle;
	/** Locução (PT-BR) falada nesta cena. A etapa "locução" grava e ajusta `duration` à fala. */
	vo?: string;
	/** Arquivo da locução, preenchido pela etapa "locução". */
	voAudio?: string;
	/** Segundos antes de a fala começar (padrão 0,3). Cena dinâmica usa 0: a voz vem do próprio vídeo. */
	voLead?: number;
	/** Texto que a cena dinâmica falou ao ser gerada; enquanto for igual a `vo`, a voz não é regravada. */
	voFixed?: string;
	/** Filmagem desfocada ao fundo da cena (qualquer tipo). Preenchida por `bgStock`/`bgSearch`. */
	bgVideo?: string;
	bgStock?: string;
	bgSearch?: string;
	/** Personagem falando num círculo no canto (cenas que não são `broll`): pedido da imagem, referências e o vídeo gerado. */
	speak?: boolean;
	prompt?: string;
	refs?: string[];
	keyframe?: string;
	bubble?: string;
	/** Ilustração do site ao fundo (temas paper e deep): o texto fica de um lado, a ilustração do outro. */
	art?: StageArt;
};

/** Ilustrações do site novo da Catalisa (remotion/public/stage), usadas como palco e fundo de cartela. */
export type StageArt = 'city' | 'hero' | 'architecture' | 'studio' | 'pedestal';

export type HookScene = Base & { type: 'hook'; headline: string; sub?: string };

export type ScreenScene = Base & {
	type: 'screen';
	/** Print desktop (relativo à pasta do job). */
	image: string;
	/** Print mobile opcional; usado no lugar do desktop em 9:16. */
	imageMobile?: string;
	/** Onde dar zoom. Sem focus = Ken Burns suave na tela inteira. */
	focus?: Box;
	focusMobile?: Box;
	/** Mostra cursor e clique no centro do focus. */
	click?: boolean;
	/** Texto digitado no campo em foco (efeito de digitação). */
	typing?: string;
	frame?: 'browser' | 'phone' | 'none';
	urlBar?: string;
	/** Passo numerado de uma demo guiada ("1", "2"...), com rótulo curto. */
	step?: number;
	stepLabel?: string;
};

export type FeaturesScene = Base & {
	type: 'features';
	title: string;
	items: { icon?: string; text: string }[];
};

export type BrollScene = Base & {
	type: 'broll';
	/** Vídeo (mp4) relativo à pasta do job, ex.: clipe gerado pela Runway. */
	video?: string;
	/** Prompt (EN) para gerar o clipe na etapa de b-roll, quando ainda não há video. */
	prompt?: string;
	/** Busca (EN, 1–3 palavras) de filmagem real em banco gratuito; ou `stock` com o id do clipe. */
	search?: string;
	stock?: string;
	/** Título grande sobre a filmagem (estilo comercial) e rótulo pequeno acima dele. */
	headline?: string;
	kicker?: string;
	/** Lado do texto no 16:9 (o oposto de onde está a pessoa). */
	align?: 'left' | 'right';
	/** Segundo do clipe em que a cena começa e velocidade (0.5–1; menor = câmera lenta). */
	start?: number;
	speed?: number;
	/** Enquadramento do recorte (CSS object-position), ex.: "70% 30%". */
	position?: string;
	credit?: string;
	/** Print do produto flutuando ao lado da pessoa (janela de navegador): "gente usando o sistema". */
	inset?: string;
	/** true = o personagem FALA o `vo` olhando para a câmera, com a boca sincronizada (avatar). Exige `prompt` e `vo`. */
	speak?: boolean;
	/** true (com `speak`) = cena dinâmica: o personagem anda e fala, movimento e voz gerados juntos. Cara: ~120 créditos por 8 s. */
	dynamic?: boolean;
	/** Geração por IA: o que se mexe na cena (EN) e o quadro-chave gerado antes da animação. */
	motion?: string;
	keyframe?: string;
	/** Fotos de referência (elenco/cenário) para a geração por IA manter rosto e lugar. */
	refs?: string[];
};

export type CtaScene = Base & { type: 'cta'; headline: string; button?: string; url?: string };

/** Tipografia cinética: frases curtas que "batem" na tela, uma por vez. O coração do comercial. */
export type KineticScene = Base & {
	type: 'kinetic';
	/** 1–4 frases de até 4 palavras. Cada uma ocupa a tela sozinha. */
	lines: string[];
	/** Palavras destacadas na cor de destaque. */
	accent?: string[];
	/** Fundo: tema, cor da marca, destaque ou alternando a cada frase. */
	bg?: 'theme' | 'brand' | 'accent' | 'flip';
};

/** Número grande que conta até o valor (dado real do briefing/site). */
export type StatScene = Base & {
	type: 'stat';
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	label: string;
	sub?: string;
};

/** Conversa animada num celular (o produto atendendo no chat). */
export type ChatScene = Base & {
	type: 'chat';
	/** Nome no topo do chat (ex.: "Clínica Vida · Assistente"). */
	contact: string;
	messages: { from: 'me' | 'them'; text: string }[];
	/** Título ao lado do celular no 16:9. */
	headline?: string;
};

/** Antes × depois: caos (notificações empilhando) e calma (tudo resolvido). */
export type BeforeAfterScene = Base & {
	type: 'beforeAfter';
	before: { label: string; items: string[] };
	after: { label: string; items: string[] };
};

/** Aparelho em 3D girando devagar com a tela real e notificações saltando ao redor. */
export type DeviceScene = Base & {
	type: 'device';
	device?: 'laptop' | 'phone';
	image: string;
	imageMobile?: string;
	toasts?: { icon?: string; title: string; body?: string }[];
	headline?: string;
};

/** Quatro cantos da tela do aparelho na foto, em frações (0–1): sup-esq, sup-dir, inf-dir, inf-esq. */
export type Quad = [[number, number], [number, number], [number, number], [number, number]];

/**
 * Pessoas usando o produto: foto realista gerada por IA com a tela do aparelho em verde puro,
 * substituída no render pelo print REAL (screen) em perspectiva.
 */
export type PeopleScene = Base & {
	type: 'people';
	/** Prompt (EN) da foto: quem, onde, fazendo o quê. A etapa "pessoas" acrescenta a tela verde. */
	prompt: string;
	/** Aparelho cuja tela mostra o produto. */
	device?: 'laptop' | 'monitor' | 'tablet' | 'phone';
	/** Print que aparece na tela (relativo à pasta do job). */
	screen?: string;
	/** Foto horizontal (16:9 e 1:1) e vertical (9:16), preenchidas pela etapa "pessoas". */
	image?: string;
	quad?: Quad;
	imageMobile?: string;
	quadMobile?: Quad;
};

/** Um passo de navegação: a tela, onde o dedo (ou o cursor) toca, quanto rola e o que é digitado. */
export type FlowStep = {
	image: string;
	/** Ponto tocado no fim do passo, em frações (0–1) da imagem. Leva para o próximo passo. */
	tap?: { x: number; y: number };
	/** Quanto a tela rola durante o passo: 0 = nada, 1 = até o fim do print (só quando o print é mais alto que a tela). */
	scroll?: number;
	/** Texto digitado num campo (caixa em frações da imagem). */
	typing?: { box: Box; text: string };
	/** Legenda deste passo (substitui a da cena enquanto o passo está na tela). */
	caption?: string;
};

/** Navegação de verdade a partir de prints: cada passo entra empurrando o anterior, com toque, rolagem e digitação. */
export type FlowScene = Base & {
	type: 'flow';
	/** phone = celular (prints verticais); browser = navegador (prints de desktop). */
	device?: 'phone' | 'browser';
	steps: FlowStep[];
	/** Título ao lado do aparelho no 16:9. */
	headline?: string;
	kicker?: string;
	urlBar?: string;
};

/** O pedestal de concreto do site com o monitor e o celular mostrando as telas reais. */
export type PedestalScene = Base & {
	type: 'pedestal';
	/** Print de desktop (monitor) e de celular. */
	image?: string;
	imageMobile?: string;
	/** Para onde a câmera vai: o monitor, o celular ou os dois. */
	focus?: 'monitor' | 'phone' | 'both';
	headline?: string;
	kicker?: string;
};

/** Desktop e celular lado a lado, ligados por um traço (ex.: pede no computador, aprova no celular). */
export type SplitScene = Base & {
	type: 'split';
	image: string;
	imageMobile: string;
	/** Rótulos curtos acima de cada aparelho, ex.: ["Computador", "Celular"]. */
	labels?: [string, string];
	headline?: string;
};

/** Quem aparece num plano do mundo 3D e o que faz. Ids do catálogo em remotion/world (characters.ts, places.ts, rig.ts). */
export type WorldCast = {
	/** helena | camila | marina | rafael | antonio | operador */
	who: string;
	/** Ponto marcado do lugar onde começa (ou [x, y, z]). */
	spot?: string | [number, number, number];
	/** Ponto onde termina, para quem anda. */
	to?: string | [number, number, number];
	/** idle | walk | walkPhone | phone | typing | wave */
	action?: string;
	/** Direção para onde olha, em radianos. */
	face?: number;
};

/** Plano do Mundo Catalisa em 3D low poly, feito no próprio render (sem IA, sem crédito). */
export type WorldScene = Base & {
	type: 'world';
	/** praca | banking | credit | decisao | identidade | studio | plantao | fazenda */
	place: string;
	/** Câmera pronta do lugar (ex.: heroi, aerea, ombro). */
	camera?: string;
	cast?: WorldCast[];
	/** O Agente (ponto amarelo) acompanha o personagem deste índice. */
	agent?: number;
	/** Print que aparece no celular na mão (phone, walkPhone). */
	screen?: string;
	headline?: string;
	kicker?: string;
	align?: 'left' | 'right';
};

/**
 * Uma peça da colagem editorial: papel de cor chapada, foto recortada numa forma, celular ou tela com o print real.
 * `box` é [x, y, largura, altura] em pixels do quadro de referência: 1600×900 no 16:9 e 1080×1920 no 9:16.
 */
export type CollageLayer = {
	/** line = traço laranja que se desenha da esquerda para a direita (box: x, y, comprimento, espessura), com o ponto na ponta. */
	kind: 'shape' | 'photo' | 'video' | 'phone' | 'screen' | 'line';
	/** Recorte: retângulo, círculo, arco (semicírculo em cima) ou meia-lua (reta embaixo). */
	shape?: 'rect' | 'circle' | 'arch' | 'half';
	box: [number, number, number, number];
	/** Cor do papel (shape). */
	color?: string;
	/** Foto ou print, relativo à pasta do job. */
	src?: string;
	/** Ponto da foto que fica no centro do recorte (0–1), quanto ampliar e se espelha. */
	focus?: [number, number];
	zoom?: number;
	flip?: boolean;
	/** Como a peça entra: papel deslizando de um lado, crescendo do centro, revelando de baixo para cima ou surgindo. */
	/** wipe = cortina da esquerda para a direita; spin = a folha gira e assenta. */
	enter?: 'up' | 'down' | 'left' | 'right' | 'grow' | 'reveal' | 'fade' | 'none' | 'wipe' | 'spin';
	/** Foto em N tiras verticais que sobem uma a uma (2–8). */
	slices?: number;
	/** Segundo em que a peça começa a entrar. */
	at?: number;
	/** Deriva lateral lenta depois de encaixar (parallax), em px por segundo; negativo vai para a esquerda. */
	drift?: number;
	shadow?: boolean;
};

/** Colagem editorial Bauhaus: as peças se encaixam, o título entra linha a linha e a marca assina no rodapé. */
export type CollageScene = Base & {
	type: 'collage';
	/** Cor do papel de fundo. */
	bg?: string;
	layers: CollageLayer[];
	/** Composição própria para o 9:16 (sem ela, o vertical usa `layers` redimensionado). */
	layersMobile?: CollageLayer[];
	kicker?: string;
	headline?: string;
	sub?: string;
	/** Onde o texto começa ([x, y] no quadro de referência) e a cor dele. */
	textAt?: [number, number];
	textAtMobile?: [number, number];
	textColor?: string;
	/** Cor do rótulo do topo, quando ele fica sobre outro fundo que não o do título. */
	kickerColor?: string;
	/** No 9:16 a composição muda; o texto e a assinatura podem cair sobre outro fundo. */
	textColorMobile?: string;
	kickerColorMobile?: string;
	signMobile?: 'color' | 'light' | false;
	/** Tamanho do título no quadro de referência (padrão 70 no 16:9, 92 no 9:16). */
	size?: number;
	sizeMobile?: number;
	/** Segundo em que o texto entra. */
	textIn?: number;
	/** Assinatura da marca no rodapé: logo claro ou de cor. */
	sign?: 'color' | 'light' | false;
	/** Logo grande no lugar do título (cartela final). */
	logoBig?: boolean;
	/** Chamada sem promessa, abaixo do título (cartela final). */
	button?: string;
};

export type Scene = HookScene | ScreenScene | FeaturesScene | BrollScene | PeopleScene | KineticScene | StatScene | ChatScene | BeforeAfterScene | DeviceScene | CtaScene | FlowScene | PedestalScene | SplitScene | WorldScene | CollageScene;
export type CaptionStyle = 'box' | 'bold' | 'karaoke';

/** Estilo visual (cores, fundo, cartões). paper e deep: a estética de arquitetura do site da Catalisa (papel ou roxo profundo, títulos leves, sem gradiente). */
export type Theme = 'dark' | 'light' | 'bold' | 'glass' | 'paper' | 'deep';
/** Vibe: ritmo, transições e animação. */
export type Vibe = 'energetic' | 'calm' | 'premium' | 'playful' | 'trust';

/** Parâmetros de cada vibe. Duplicado em scripts/validate.mjs (só `transition`). */
export const VIBES: Record<Vibe, { transition: number; damping: number; stagger: number; push: number }> = {
	energetic: { transition: 0.25, damping: 200, stagger: 2, push: 1.12 },
	calm: { transition: 0.7, damping: 200, stagger: 4, push: 1.04 },
	premium: { transition: 0.6, damping: 200, stagger: 3, push: 1.06 },
	playful: { transition: 0.35, damping: 11, stagger: 3, push: 1.08 },
	trust: { transition: 0.5, damping: 200, stagger: 3, push: 1.05 },
};

/** Aparência configurável das molduras e dos títulos (o resto vem de `brand`, `theme` e `vibe`). */
export type Look = {
	/** Moldura de celular e notebook: clara (alumínio), escura (grafite) ou nenhuma. */
	device?: 'light' | 'dark' | 'none';
	/** Barra do navegador: limpa (endereço em pílula), mac (três bolinhas coloridas) ou nenhuma. */
	browser?: 'clean' | 'mac' | 'none';
	/** Conversa no celular: cores da marca, estilo WhatsApp ou neutro. */
	chat?: 'brand' | 'whatsapp' | 'neutral';
	/** Peso dos títulos (400–800) e espaçamento entre letras em em (ex.: -0.032). */
	headingWeight?: number;
	tracking?: number;
};

export type VideoProps = {
	format: Format;
	fps: number;
	brand: Brand;
	scenes: Scene[];
	/** Base de URL para os assets do job (preenchida pelo renderizador). */
	assetBase: string;
	music?: string;
	musicVolume?: number;
	/** Segundos de crossfade entre cenas (padrão: o da vibe). */
	transition?: number;
	theme?: Theme;
	vibe?: Vibe;
	/** Transição padrão entre cenas. */
	transitionStyle?: TransitionStyle;
	/** box = balão · bold = texto grande com sombra · karaoke = palavra a palavra estilo CapCut. */
	captionStyle?: CaptionStyle;
	look?: Look;
	/** Efeitos sonoros (whoosh nas transições, pop nos destaques). */
	sfx?: { whoosh?: string; pop?: string };
	/** Batida (bpm) da trilha, para os cortes caírem no tempo. */
	bpm?: number;
	/** Rótulo discreto nas cenas de tela, ex.: "Interface de referência · ambiente demonstrativo". */
	disclaimer?: string;
};
