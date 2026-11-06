#!/usr/bin/env node
// Renderiza o storyboard.json de um job em MP4, um arquivo por formato.
// Uso: node scripts/render.mjs --job jobs/<id> [--format 9:16] [--draft]
// Emite uma linha JSON por evento no stdout: {type: 'progress'|'done'|'error'|'log', ...}

import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getBundle as bundleOnce, glOption } from './_bundle.mjs';

// Transição padrão por vibe (espelha VIBES em remotion/types.ts).
const VIBE_TRANSITION = { energetic: 0.25, calm: 0.7, premium: 0.6, playful: 0.35, trust: 0.5 };

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || ['/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);

const emit = (o) => process.stdout.write(JSON.stringify(o) + '\n');
const args = Object.fromEntries(
	process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith('--') ? [...acc, [a.slice(2), arr[i + 1]?.startsWith('--') || arr[i + 1] === undefined ? true : arr[i + 1]]] : acc), []),
);
if (!args.job) {
	console.error('uso: render.mjs --job <dir> [--format 16:9|9:16|1:1] [--draft] [--theme t] [--vibe v] [--still <segundos> --out <arquivo.jpg> --scale 0.4]');
	process.exit(2);
}
const jobDir = resolve(args.job);
// --sb <arquivo>: roteiro alternativo (prévia de uma mudança ainda não salva), com os assets do mesmo job.
const sb = JSON.parse(readFileSync(typeof args.sb === 'string' ? resolve(args.sb) : join(jobDir, 'storyboard.json'), 'utf8'));
const formats = args.format ? [args.format] : sb.formats ?? ['16:9'];
// Sobrescritas para prévias (miniaturas de estilo/vibe na UI).
if (typeof args.theme === 'string') sb.theme = args.theme;
if (typeof args.vibe === 'string') sb.vibe = args.vibe;
const draft = !!args.draft;

// Tamanho real das imagens, para a moldura e o zoom baterem com o print.
function imageSize(file) {
	const b = readFileSync(file);
	if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
	if (b[0] === 0xff && b[1] === 0xd8) {
		let i = 2;
		while (i < b.length) {
			const m = b[i + 1];
			const len = b.readUInt16BE(i + 2);
			if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
			i += 2 + len;
		}
	}
	if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
		const chunk = b.toString('ascii', 12, 16);
		if (chunk === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
		if (chunk === 'VP8L') {
			const n = b.readUInt32LE(21);
			return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
		}
		if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
	}
	return undefined;
}

function check() {
	// b-roll sem vídeo gerado é pulado (o resto do vídeo continua valendo).
	// O mesmo vale para pessoas sem foto (geração gratuita pode falhar por cota).
	const pending = (s) => (s.type === 'broll' && !s.video) || (s.type === 'people' && !s.image && !s.imageMobile);
	const skipped = sb.scenes.filter(pending).map((s) => s.id);
	if (skipped.length) emit({ type: 'log', level: 'warn', message: `cenas sem vídeo/foto gerados, pulando: ${skipped.join(', ')}` });
	sb.scenes = sb.scenes.filter((s) => !pending(s));
	const missing = [];
	for (const s of sb.scenes) {
		for (const k of ['image', 'imageMobile', 'video', 'screen', 'voAudio', 'bgVideo', 'inset', 'bubble']) {
			if (s[k] && !/^https?:/.test(s[k]) && !existsSync(join(jobDir, s[k]))) missing.push(`${s.id}.${k}: ${s[k]}`);
		}
		if (s.type === 'screen' || s.type === 'people' || s.type === 'pedestal') {
			if (s.image && existsSync(join(jobDir, s.image))) s._size = imageSize(join(jobDir, s.image));
			if (s.imageMobile && existsSync(join(jobDir, s.imageMobile))) s._sizeMobile = imageSize(join(jobDir, s.imageMobile));
			if (s.screen && existsSync(join(jobDir, s.screen))) s._screenSize = imageSize(join(jobDir, s.screen));
		}
		// Navegação: cada passo precisa existir e ter o tamanho medido (rolagem e proporção do celular).
		if (s.type === 'flow') for (const st of s.steps ?? []) {
			if (!existsSync(join(jobDir, st.image))) missing.push(`${s.id}.steps: ${st.image}`);
			else st._size = imageSize(join(jobDir, st.image));
		}
		if (s.type === 'world' && s.screen && !existsSync(join(jobDir, s.screen))) missing.push(`${s.id}.screen: ${s.screen}`);
		// 9:16 sem foto vertical usa a horizontal (e vice-versa).
		if (s.type === 'people' && !s.image) { s.image = s.imageMobile; s.quad = s.quadMobile; s._size = s._sizeMobile; }
	}
	if (sb.music && !existsSync(join(jobDir, sb.music))) missing.push(`music: ${sb.music}`);
	for (const k of ['whoosh', 'pop']) if (sb.sfx?.[k] && !existsSync(join(jobDir, sb.sfx[k]))) missing.push(`sfx.${k}: ${sb.sfx[k]}`);
	if (missing.length) throw new Error(`arquivos ausentes: ${missing.join(', ')}`);
}

// Servidor estático mínimo para os assets do job (prints, clipes, música).
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.svg': 'image/svg+xml' };
function serve(dir) {
	return new Promise((ok) => {
		const srv = createServer((req, res) => {
			const p = normalize(join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
			if (!p.startsWith(dir) || !existsSync(p) || statSync(p).isDirectory()) return res.writeHead(404).end();
			const size = statSync(p).size;
			const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
			const head = { 'content-type': TYPES[extname(p).toLowerCase()] ?? 'application/octet-stream', 'accept-ranges': 'bytes', 'access-control-allow-origin': '*' };
			if (range) {
				const start = range[1] ? +range[1] : 0;
				const end = range[2] ? +range[2] : size - 1;
				res.writeHead(206, { ...head, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 });
				return createReadStream(p, { start, end }).pipe(res);
			}
			res.writeHead(200, { ...head, 'content-length': size });
			createReadStream(p).pipe(res);
		});
		srv.listen(0, '127.0.0.1', () => ok(srv));
	});
}

function chapters(fps) {
	const tr = sb.transition ?? VIBE_TRANSITION[sb.vibe ?? 'trust'];
	let t = 0;
	return sb.scenes.map((s, i) => {
		const c = { id: s.id, type: s.type, start: +t.toFixed(2), end: +(t + s.duration).toFixed(2), caption: s.caption ?? s.headline ?? s.title ?? '' };
		t += s.duration - (i < sb.scenes.length - 1 ? tr : 0);
		return c;
	});
}

try {
	check();
	const srv = await serve(jobDir);
	const assetBase = `http://127.0.0.1:${srv.address().port}`;
	const serveUrl = await bundleOnce(emit);
	// Cenas 3D (mundo low poly) precisam de WebGL de verdade.
	const has3d = sb.scenes.some((s) => s.type === 'world');
	const chromiumOptions = has3d ? { gl: glOption() } : {};
	// O mundo 3D roda por software: carregar e desenhar o primeiro quadro leva mais que os 30 s padrão, e cada aba pesa.
	const timeoutInMilliseconds = has3d ? 180000 : 30000;
	const outDir = join(jobDir, 'out');
	mkdirSync(outDir, { recursive: true });
	for (const format of formats) {
		const tag = format.replace(':', 'x');
		const inputProps = { format, fps: sb.fps ?? 30, brand: sb.brand, scenes: sb.scenes, assetBase, music: sb.music, musicVolume: sb.musicVolume, // Tudo explícito: o Remotion mescla com os defaultProps do demo.json e herdaria valores de lá.
			transition: sb.transition ?? VIBE_TRANSITION[sb.vibe ?? 'trust'], theme: sb.theme ?? 'dark', vibe: sb.vibe ?? 'trust',
			transitionStyle: sb.transitionStyle ?? 'fade', captionStyle: sb.captionStyle ?? 'box', sfx: sb.sfx ?? {}, bpm: sb.bpm, look: sb.look ?? {} };
		const composition = await selectComposition({ serveUrl, id: 'SaasVideo', inputProps, browserExecutable: CHROME, chromiumOptions, timeoutInMilliseconds });
		if (args.still !== undefined) {
			// Só um quadro: prévia rápida sem renderizar o vídeo.
			const output = resolve(typeof args.out === 'string' ? args.out : join(outDir, `${tag}.still.jpg`));
			const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(args.still) * composition.fps));
			await renderStill({ serveUrl, composition, inputProps, output, frame, browserExecutable: CHROME, imageFormat: 'jpeg', jpegQuality: 82, scale: Number(args.scale ?? 0.5), chromiumOptions });
			emit({ type: 'still', format, file: output });
			continue;
		}
		const raw = join(outDir, `${tag}${draft ? '.draft' : ''}.raw.mp4`);
		const out = join(outDir, `${tag}${draft ? '.draft' : ''}.mp4`);
		const t0 = Date.now();
		await renderMedia({
			serveUrl,
			composition,
			inputProps,
			codec: 'h264',
			outputLocation: raw,
			browserExecutable: CHROME,
			chromiumOptions,
			timeoutInMilliseconds,
			scale: draft ? 0.5 : 1,
			crf: draft ? 28 : 18,
			// No máximo 4 abas: metade dos núcleos travou a máquina num render longo com filmagem em 1080p (10/10/2026). RENDER_CONCURRENCY ajusta.
			concurrency: Number(process.env.RENDER_CONCURRENCY) || Math.max(1, Math.min(has3d ? 2 : 4, Math.floor((await import('node:os')).cpus().length / 2))),
			onProgress: ({ progress, renderedFrames, encodedFrames }) =>
				emit({ type: 'progress', stage: 'render', format, progress, renderedFrames, encodedFrames, totalFrames: composition.durationInFrames }),
		});
		// Áudio no padrão das redes (−14 LUFS, pico −1,5 dBTP) quando há música; senão só remuxa.
		const ff = sb.music || sb.scenes.some((s) => s.voAudio)
			? ['-y', '-v', 'error', '-i', raw, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]
			: ['-y', '-v', 'error', '-i', raw, '-c', 'copy', '-movflags', '+faststart', out];
		const r = spawnSync('ffmpeg', ff, { encoding: 'utf8' });
		if (r.status !== 0) throw new Error('ffmpeg: ' + r.stderr.slice(-500));
		spawnSync('rm', ['-f', raw]);
		const poster = join(outDir, `${tag}${draft ? '.draft' : ''}.jpg`);
		await renderStill({ serveUrl, composition, inputProps, output: poster, frame: Math.min(composition.durationInFrames - 1, Math.round((sb.fps ?? 30) * 1.2)), browserExecutable: CHROME, imageFormat: 'jpeg', scale: 0.5, chromiumOptions, timeoutInMilliseconds });
		writeFileSync(join(outDir, `${tag}.chapters.json`), JSON.stringify(chapters(sb.fps ?? 30), null, 2));
		emit({ type: 'done', format, file: out.slice(jobDir.length + 1), poster: poster.slice(jobDir.length + 1), seconds: +(composition.durationInFrames / composition.fps).toFixed(2), width: composition.width, height: composition.height, tookMs: Date.now() - t0 });
	}
	srv.close();
	process.exit(0);
} catch (e) {
	emit({ type: 'error', message: String(e?.message ?? e) });
	process.exit(1);
}
