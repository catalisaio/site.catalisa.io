#!/usr/bin/env node
// Valida um storyboard.json antes do render. Sem dependências, para o Claude rodar sozinho.
// Uso: node scripts/validate.mjs <job-dir> [--target 30]
// Sai com 0 se ok; senão imprime os problemas (um por linha) e sai com 1.

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? '.');
const ti = process.argv.indexOf('--target');
const target = ti > 0 ? Number(process.argv[ti + 1]) : undefined;
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);
const info = (m) => console.log(`INFO ${m}`);

let sb;
try {
	sb = JSON.parse(readFileSync(join(dir, 'storyboard.json'), 'utf8'));
} catch (e) {
	console.log(`ERRO storyboard.json ilegível: ${e.message}`);
	process.exit(1);
}

const FORMATS = ['16:9', '9:16', '1:1', '4:5'];
const TYPES = ['hook', 'screen', 'features', 'broll', 'people', 'kinetic', 'stat', 'chat', 'beforeAfter', 'device', 'cta', 'flow', 'world', 'pedestal', 'collage'];
const TRANSITIONS = ['fade', 'slide', 'zoom', 'whip', 'cut', 'push', 'line', 'dive'];
const CAPTIONS = ['box', 'bold', 'karaoke'];
const THEMES = ['dark', 'light', 'bold', 'glass', 'paper', 'deep'];
// Catálogo do Mundo Catalisa (espelha remotion/world/places.ts, characters.ts e rig.ts).
const PLACES = { praca: ['heroi', 'chegada', 'aerea', 'fecho'], banking: ['heroi', 'celular', 'monolitos'], credit: ['heroi', 'percurso', 'mesa'], decisao: ['heroi'], identidade: ['heroi'], studio: ['heroi'], plantao: ['heroi', 'ombro', 'close'], fazenda: ['heroi', 'rebanho'] };
const PEOPLE = ['helena', 'camila', 'marina', 'rafael', 'antonio', 'operador'];
const ACTIONS = ['idle', 'walk', 'walkPhone', 'phone', 'typing', 'wave'];
// Transição padrão por vibe (espelha VIBES em remotion/types.ts).
const VIBE_TRANSITION = { energetic: 0.25, calm: 0.7, premium: 0.6, playful: 0.35, trust: 0.5 };
const DEVICES = ['laptop', 'monitor', 'tablet', 'phone'];
const quad = (q) => Array.isArray(q) && q.length === 4 && q.every((p) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === 'number' && v >= -0.05 && v <= 1.05));
const hex = (c) => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c);
const box = (b) => b && ['x', 'y', 'w', 'h'].every((k) => typeof b[k] === 'number' && b[k] >= 0 && b[k] <= 1) && b.x + b.w <= 1.001 && b.y + b.h <= 1.001 && b.w > 0.005 && b.h > 0.005;
const file = (p) => typeof p === 'string' && (/^https?:/.test(p) || existsSync(join(dir, p)));

if (sb.version !== 1) err('version deve ser 1');
if (!Array.isArray(sb.formats) || !sb.formats.length || sb.formats.some((f) => !FORMATS.includes(f))) err(`formats deve ser lista não vazia de ${FORMATS.join(', ')}`);
if (!sb.brand?.name) err('brand.name obrigatório');
for (const k of ['primary', 'accent', 'background', 'text']) if (!hex(sb.brand?.colors?.[k])) err(`brand.colors.${k} deve ser hex #rrggbb`);
if (sb.brand?.logo && !file(sb.brand.logo)) err(`brand.logo não existe: ${sb.brand.logo}`);
if (sb.brand?.logoLight && !file(sb.brand.logoLight)) err(`brand.logoLight não existe: ${sb.brand.logoLight}`);
if (sb.music && !file(sb.music)) err(`music não existe: ${sb.music}`);
for (const k of ['font', 'headingFont']) if (sb.brand?.[k] && !/^[\w \-]+$/.test(sb.brand[k])) err(`brand.${k} deve ser só o nome da família (ex.: "Inter"), sem vírgulas nem aspas`);
if (sb.transitionStyle && !TRANSITIONS.includes(sb.transitionStyle)) err(`transitionStyle inválido; use ${TRANSITIONS.join('|')}`);
if (sb.captionStyle && !CAPTIONS.includes(sb.captionStyle)) err(`captionStyle inválido; use ${CAPTIONS.join('|')}`);
for (const k of ['whoosh', 'pop']) if (sb.sfx?.[k] && !file(sb.sfx[k])) err(`sfx.${k} não existe: ${sb.sfx[k]}`);
if (sb.look) {
	const L = sb.look, one = (k, list) => L[k] === undefined || list.includes(L[k]) || err(`look.${k} inválido; use ${list.join('|')}`);
	one('device', ['light', 'dark', 'none']); one('browser', ['clean', 'mac', 'none']); one('chat', ['brand', 'whatsapp', 'neutral']);
	if (L.headingWeight !== undefined && !(L.headingWeight >= 300 && L.headingWeight <= 900)) err('look.headingWeight deve ficar entre 300 e 900');
	if (L.tracking !== undefined && !(L.tracking >= -0.08 && L.tracking <= 0.1)) err('look.tracking deve ficar entre -0.08 e 0.1 (em)');
}
if (sb.theme && !THEMES.includes(sb.theme)) err(`theme inválido (${sb.theme}); use ${THEMES.join('|')}`);
if (sb.vibe && !(sb.vibe in VIBE_TRANSITION)) err(`vibe inválida (${sb.vibe}); use ${Object.keys(VIBE_TRANSITION).join('|')}`);

const scenes = Array.isArray(sb.scenes) ? sb.scenes : (err('scenes deve ser lista'), []);
if (scenes.length < 2) err('pelo menos 2 cenas');
if (scenes.filter((s) => s.inset).length > 1) warn('a janela flutuante (inset) pode aparecer em no máximo UMA cena por vídeo; nas outras, corte para a tela cheia (screen/device) ou use speak com o personagem no canto');
const ids = new Set();
const vertical = sb.formats?.includes('9:16');
scenes.forEach((s, i) => {
	const at = `cena ${s.id ?? i}`;
	if (!s.id || ids.has(s.id)) err(`${at}: id ausente ou repetido`);
	ids.add(s.id);
	if (!TYPES.includes(s.type)) err(`${at}: type inválido (${s.type}); use ${TYPES.join('|')}`);
	if (s.vo !== undefined && (typeof s.vo !== 'string' || s.vo.split(/\s+/).length > 32)) err(`${at}: vo deve ser texto de até 32 palavras (uma ou duas frases por cena)`);
	if (s.speak && s.type !== 'broll' && (!s.prompt || !s.vo)) err(`${at}: speak precisa de prompt (a imagem do personagem) e de vo (o que ele fala)`);
	if (s.bubble && !file(s.bubble)) err(`${at}: bubble não existe (${s.bubble})`);
	if (s.voAudio && !file(s.voAudio)) err(`${at}: voAudio não existe (${s.voAudio})`);
	if (s.bgVideo && !file(s.bgVideo)) err(`${at}: bgVideo não existe (${s.bgVideo})`);
	if (s.enter && !TRANSITIONS.includes(s.enter)) err(`${at}: enter inválido; use ${TRANSITIONS.join('|')}`);
	if (typeof s.duration !== 'number' || s.duration < 1.2 || s.duration > 12) err(`${at}: duration entre 1.2 e 12 segundos`);
	const cap = s.caption ?? '';
	if (cap.length > (vertical ? 48 : 70)) err(`${at}: caption com ${cap.length} caracteres (máx ${vertical ? 48 : 70}${vertical ? ' porque há 9:16' : ''})`);
	switch (s.type) {
		case 'hook':
			if (!s.headline) err(`${at}: hook precisa de headline`);
			else if (s.headline.split(/\s+/).length > 9) warn(`${at}: headline longa (${s.headline.split(/\s+/).length} palavras); ideal ≤ 8`);
			break;
		case 'screen':
			if (!file(s.image)) err(`${at}: image não existe (${s.image})`);
			if (s.imageMobile && !file(s.imageMobile)) err(`${at}: imageMobile não existe (${s.imageMobile})`);
			if (s.focus && !box(s.focus)) err(`${at}: focus inválido (x,y,w,h entre 0 e 1, dentro da imagem)`);
			if (s.focusMobile && !box(s.focusMobile)) err(`${at}: focusMobile inválido`);
			if (s.typing && !s.focus) err(`${at}: typing exige focus`);
			if (vertical && !s.imageMobile) warn(`${at}: sem imageMobile; em 9:16 o print desktop fica pequeno`);
			if (vertical && s.imageMobile && s.focus && !s.focusMobile) warn(`${at}: tem focus mas não focusMobile; em 9:16 não haverá zoom`);
			if (s.duration < 2.5) warn(`${at}: tela com menos de 2.5s fica difícil de ler`);
			break;
		case 'features':
			if (!s.title || !Array.isArray(s.items) || s.items.length < 2 || s.items.length > 5) err(`${at}: features precisa de title e 2–5 items`);
			break;
		case 'broll':
			if (!s.video && !s.prompt && !s.search && !s.stock) err(`${at}: broll precisa de video (arquivo), search/stock (filmagem real) ou prompt (para gerar)`);
			if (s.video && !file(s.video)) err(`${at}: video não existe (${s.video})`);
			if (!s.video) warn(`${at}: broll ainda sem vídeo; será pulado no render se não for baixado/gerado`);
			if (s.search && !/^[a-z0-9 -]{3,40}$/i.test(s.search)) err(`${at}: search deve ser 1–3 palavras em inglês (ex.: "doctor laptop")`);
			if (s.headline && s.headline.split(/\s+/).length > 9) warn(`${at}: headline sobre filmagem com mais de 9 palavras; encurte`);
			if (s.speak && (!s.prompt || !s.vo)) err(`${at}: speak precisa de prompt (a imagem do personagem) e de vo (o que ele fala)`);
			if (s.inset && !file(s.inset)) err(`${at}: inset não existe (${s.inset})`);
			if (s.inset && s.headline && s.headline.split(/\s+/).length > 6) warn(`${at}: com inset o título fica embaixo da tela; use até 6 palavras`);
			if (s.align && !['left', 'right'].includes(s.align)) err(`${at}: align deve ser left|right`);
			if (s.speed && (s.speed < 0.4 || s.speed > 1.5)) err(`${at}: speed deve ficar entre 0.4 e 1.5`);
			break;
		case 'people':
			if (!s.prompt || s.prompt.length < 30) err(`${at}: people precisa de prompt (EN) descrevendo quem, onde e fazendo o quê`);
			if (s.device && !DEVICES.includes(s.device)) err(`${at}: device inválido; use ${DEVICES.join('|')}`);
			if (!s.screen) warn(`${at}: sem screen; a tela do aparelho vai mostrar só a foto`);
			else if (!file(s.screen)) err(`${at}: screen não existe (${s.screen})`);
			for (const k of ['image', 'imageMobile']) if (s[k] && !file(s[k])) err(`${at}: ${k} não existe (${s[k]})`);
			if (s.quad && !quad(s.quad)) err(`${at}: quad inválido (4 pontos [x,y] entre 0 e 1)`);
			if (s.quadMobile && !quad(s.quadMobile)) err(`${at}: quadMobile inválido`);
			if (!s.image && !s.imageMobile) info(`${at}: foto será gerada na etapa "pessoas"`);
			if (s.duration < 2.5) warn(`${at}: cena com pessoas com menos de 2.5s quase não é percebida`);
			break;
		case 'kinetic':
			if (!Array.isArray(s.lines) || !s.lines.length || s.lines.length > 5) err(`${at}: kinetic precisa de 1–5 lines`);
			else s.lines.forEach((l, j) => { if (l.split(/\s+/).length > 5) warn(`${at}: frase ${j + 1} com mais de 4–5 palavras perde o impacto`); });
			if (s.lines && s.duration / s.lines.length < 0.7) err(`${at}: cada frase precisa de pelo menos 0,7s (duration ÷ lines)`);
			if (s.bg && !['theme', 'brand', 'accent', 'flip'].includes(s.bg)) err(`${at}: bg inválido`);
			break;
		case 'stat':
			if (typeof s.value !== 'number' || !s.label) err(`${at}: stat precisa de value (número) e label`);
			break;
		case 'chat':
			if (!s.contact || !Array.isArray(s.messages) || s.messages.length < 2 || s.messages.length > 7) err(`${at}: chat precisa de contact e 2–7 messages`);
			else if (s.messages.some((m) => !['me', 'them'].includes(m.from) || !m.text)) err(`${at}: cada mensagem precisa de from (me|them) e text`);
			else if (s.messages.some((m) => m.text.length > 90)) warn(`${at}: mensagem longa (>90 caracteres) fica pequena no celular`);
			if (s.messages && s.duration / s.messages.length < 0.9) err(`${at}: dê pelo menos 0,9s por mensagem`);
			break;
		case 'beforeAfter':
			for (const k of ['before', 'after']) if (!s[k]?.label || !Array.isArray(s[k]?.items) || s[k].items.length < 1 || s[k].items.length > 4) err(`${at}: ${k} precisa de label e 1–4 items`);
			if (s.duration < 4) warn(`${at}: antes × depois pede pelo menos 4s`);
			break;
		case 'device':
			if (!file(s.image)) err(`${at}: image não existe (${s.image})`);
			if (s.imageMobile && !file(s.imageMobile)) err(`${at}: imageMobile não existe (${s.imageMobile})`);
			if (s.toasts && (!Array.isArray(s.toasts) || s.toasts.length > 3 || s.toasts.some((t) => !t.title))) err(`${at}: toasts: até 3, cada um com title`);
			break;
		case 'cta':
			if (!s.headline) err(`${at}: cta precisa de headline`);
			break;
		case 'flow':
			if (!Array.isArray(s.steps) || s.steps.length < 2 || s.steps.length > 6) err(`${at}: flow precisa de 2–6 steps`);
			else s.steps.forEach((st, k) => {
				if (!file(st.image)) err(`${at}: passo ${k + 1}: image não existe (${st.image})`);
				if (st.tap && !(st.tap.x >= 0 && st.tap.x <= 1 && st.tap.y >= 0 && st.tap.y <= 1)) err(`${at}: passo ${k + 1}: tap fora da imagem (x, y entre 0 e 1)`);
				if (st.typing && !box(st.typing.box)) err(`${at}: passo ${k + 1}: typing.box inválido`);
			});
			if (s.steps && s.duration / s.steps.length < 1.4) warn(`${at}: menos de 1,4 s por passo fica corrido`);
			break;
		case 'pedestal':
			if (!s.image && !s.imageMobile) err(`${at}: pedestal precisa de image (monitor) e/ou imageMobile (celular)`);
			for (const k of ['image', 'imageMobile']) if (s[k] && !file(s[k])) err(`${at}: ${k} não existe (${s[k]})`);
			if (s.focus && !['monitor', 'phone', 'both'].includes(s.focus)) err(`${at}: focus deve ser monitor|phone|both`);
			break;
		case 'collage': {
			const KINDS = ['shape', 'photo', 'video', 'phone', 'screen', 'line'], SHAPES = ['rect', 'circle', 'arch', 'half'], ENTERS = ['up', 'down', 'left', 'right', 'grow', 'reveal', 'fade', 'none', 'wipe', 'spin'];
			for (const [key, list] of [['layers', s.layers], ['layersMobile', s.layersMobile]]) {
				if (list === undefined && key === 'layersMobile') continue;
				if (!Array.isArray(list) || !list.length || list.length > 14) { err(`${at}: ${key} precisa de 1–14 peças`); continue; }
				list.forEach((l, k) => {
					const w = `${at}: ${key}[${k}]`;
					if (!KINDS.includes(l.kind)) err(`${w}: kind deve ser ${KINDS.join('|')}`);
					if (l.shape && !SHAPES.includes(l.shape)) err(`${w}: shape deve ser ${SHAPES.join('|')}`);
					if (l.enter && !ENTERS.includes(l.enter)) err(`${w}: enter deve ser ${ENTERS.join('|')}`);
					if (!Array.isArray(l.box) || l.box.length !== 4 || l.box.some((v) => typeof v !== 'number') || l.box[2] <= 0 || l.box[3] <= 0) err(`${w}: box deve ser [x, y, largura, altura] em px do quadro de referência`);
					if (l.kind === 'shape' && !hex(l.color)) err(`${w}: shape precisa de color #rrggbb`);
					if (l.kind !== 'shape' && l.kind !== 'line' && !file(l.src)) err(`${w}: src não existe (${l.src})`);
					if (l.at !== undefined && !(l.at >= 0 && l.at < s.duration)) err(`${w}: at deve ficar dentro da cena`);
				});
			}
			if (s.headline && s.headline.split('\n').some((ln) => ln.length > 26)) warn(`${at}: linha do título com mais de 26 caracteres pode não caber; quebre com \\n`);
			break;
		}
		case 'world':
			if (!PLACES[s.place]) err(`${at}: place inválido (${s.place}); use ${Object.keys(PLACES).join('|')}`);
			else if (s.camera && !PLACES[s.place].includes(s.camera)) err(`${at}: câmera ${s.camera} não existe em ${s.place}; use ${PLACES[s.place].join('|')}`);
			for (const c of s.cast ?? []) {
				if (!PEOPLE.includes(c.who)) err(`${at}: personagem desconhecido (${c.who}); use ${PEOPLE.join('|')}`);
				if (c.action && !ACTIONS.includes(c.action)) err(`${at}: ação desconhecida (${c.action}); use ${ACTIONS.join('|')}`);
			}
			if (s.screen && !file(s.screen)) err(`${at}: screen não existe (${s.screen})`);
			break;
	}
});
if (scenes.length) {
	if (!['hook', 'screen', 'broll', 'people', 'kinetic', 'stat', 'beforeAfter', 'chat', 'device', 'world', 'flow'].includes(scenes[0].type)) warn('a primeira cena deveria ser um gancho (hook) ou algo visual forte');
	if (scenes[0].duration > 3.5) warn('o gancho deve resolver em até 3s');
	if (scenes.at(-1).type !== 'cta') warn('a última cena deveria ser cta');
	const tr = sb.transition ?? VIBE_TRANSITION[sb.vibe ?? 'trust'];
	const total = scenes.reduce((a, s) => a + (s.duration || 0), 0) - tr * (scenes.length - 1);
	const tol = Math.max(3, target * 0.2);
	const spoken = scenes.some((s) => s.voAudio);
	// Com a locução já gravada, quem manda na duração é a fala: vira aviso, não erro.
	if (target && Math.abs(total - target) > tol) (spoken ? warn : err)(`duração total ${total.toFixed(1)}s, alvo ${target}s (tolerância ±${tol.toFixed(1)}s)`);
	// Antes de gravar, estima a fala (~2,6 palavras por segundo + respiros) para o roteiro não estourar depois.
	if (target && !spoken && scenes.some((s) => s.vo)) {
		const est = scenes.reduce((a, s) => a + Math.max(s.duration ?? 0, s.vo ? s.vo.split(/\s+/).length / 2.6 + 0.75 + tr : 0), 0) - tr * (scenes.length - 1);
		if (est - target > tol) err(`a locução é longa demais: o vídeo ficaria com ~${est.toFixed(0)}s para um alvo de ${target}s. Encurte as falas (${Math.round(target * 2.1)} palavras no total, no máximo) ou tire cenas`);
	}
	console.log(`INFO duração total ${total.toFixed(1)}s em ${scenes.length} cenas`);
}
warns.forEach((w) => console.log(`AVISO ${w}`));
errors.forEach((e) => console.log(`ERRO ${e}`));
console.log(errors.length ? `INVÁLIDO (${errors.length} erros)` : 'OK');
process.exit(errors.length ? 1 : 0);
