import html
import json
from urllib.parse import quote
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parents[1] / 'inspiracoes' / 'originais'
DATA = ROOT / 'referencias.json'


def record(filename, observation, use, connection, decision):
    entries = json.loads(DATA.read_text()) if DATA.exists() else []
    assert not any(entry['file'] == filename for entry in entries), filename
    entry = dict(id=len(entries) + 1, file=filename, observation=observation,
                 application=use, connection=connection, decision=decision)
    entries.append(entry)
    DATA.write_text(json.dumps(entries, ensure_ascii=False, indent=2))
    render(entries)


def render(entries=None):
    entries = entries or json.loads(DATA.read_text())
    assets = ROOT / 'miniaturas'
    assets.mkdir(exist_ok=True)
    cards = []
    for entry in entries:
        filename = entry['file']
        image = ''
        if Path(filename).suffix.lower() in ['.jpg', '.png', '.jpeg']:
            thumb = assets / f"{entry['id']:02}.jpg"
            if not thumb.exists():
                with Image.open(SOURCE / filename) as original:
                    original.thumbnail((560, 600))
                    original.convert('RGB').save(thumb, quality=84)
            image = f'<img src="miniaturas/{thumb.name}" alt="{html.escape(filename)}" loading="lazy">'
        original_link = '../../inspiracoes/originais/' + quote(filename)
        fields = ''.join(f'<dt>{label}</dt><dd>{html.escape(entry[key])}</dd>' for key, label in [
            ('observation', 'O que vejo'), ('application', 'Aplicação'),
            ('connection', 'Conexão com as anteriores'), ('decision', 'Decisão / revisão')])
        cards.append(f'<article id="ref-{entry["id"]}"><div>{image}</div><section><small>REFERÊNCIA {entry["id"]:02}</small><h2>{html.escape(filename)}</h2><p><a href="{original_link}">Abrir arquivo original ↗</a></p><dl>{fields}</dl></section></article>')
    (ROOT / 'referencias.html').write_text('''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Caderno de referências · Catalisa</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f4f0e8;color:#171320;font:16px/1.6 system-ui,sans-serif}header,main{max-width:1200px;margin:auto;padding:40px}h1{font-size:clamp(32px,6vw,72px);line-height:1.05;letter-spacing:-.05em}header p{max-width:760px}article{display:grid;grid-template-columns:320px 1fr;gap:36px;border-top:1px solid #c9c2ce;padding:32px 0}article>div{background:#e9e5df;display:flex;justify-content:center;align-items:flex-start;padding:16px}img{max-width:100%;max-height:440px;object-fit:contain}h2{font-size:22px;line-height:1.3;overflow-wrap:anywhere}small,dt{font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#734b9c;font-weight:700}dt{margin-top:16px}dd{margin:4px 0 0}a{color:#734b9c}@media(max-width:700px){header,main{padding:24px}article{grid-template-columns:1fr;gap:18px}article>div{max-height:340px}img{max-height:308px}}@media print{article{break-inside:avoid}}
    </style><header><small>CATALISA / ESTUDO VISUAL / 21.10.2026</small><h1>Uma ideia de cada vez.<br>Um sistema ao final.</h1><p>Caderno incremental da pasta Inspiracoes. Cada registro separa observação, aplicação, conexão e decisão. As imagens são referências de estudo local; a página final usa composição própria. As notas preservam diferenças, duplicatas e mudanças de direção.</p><p>''' + str(len(entries)) + ' referências anotadas · <a href="direcao.html">Síntese e decisões de projeto →</a></p></header><main>' + ''.join(cards) + '</main></html>')


if __name__ == '__main__':
    render()
