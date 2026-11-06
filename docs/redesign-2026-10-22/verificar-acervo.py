"""Verifica a transferência local sem consultar serviços ou executar deploy."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent
DESIGN = ROOT / 'design/entregas-bauhaus'
REPORT = ROOT / 'reports/2026-10-20-retrospectiva-24-meses'
ORIGINALS = ROOT / 'inspiracoes/originais'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('href', 'src') and value:
                self.urls.append(value)


references = json.loads((DESIGN / 'referencias.json').read_text())
provenance = json.loads((ROOT / 'proveniencia.json').read_text())
errors = []
checked_links = 0
external_dependencies = set()


def check_link(source, url):
    global checked_links
    if url.startswith(('#', '/', '//')):
        return
    split = urlsplit(url)
    if split.scheme or not split.path:
        return
    path = (source.parent / unquote(split.path)).resolve()
    if path == ROOT / 'verificacao-transferencia.json':
        return  # Gerado pela própria execução ao concluir as conferências.
    checked_links += 1
    if not path.exists():
        errors.append(f'{source.relative_to(ROOT)}: destino ausente {url}')


assert len(references) == 72
assert sorted(r['id'] for r in references) == list(range(1, 73))
assert len({r['file'] for r in references}) == 72
assert len([p for p in ORIGINALS.iterdir() if p.is_file()]) == 72
for reference in references:
    assert (ORIGINALS / reference['file']).is_file(), reference['file']
    for field in ('observation', 'application', 'connection', 'decision'):
        assert reference[field].strip(), (reference['id'], field)

for record in provenance['files']:
    target = ROOT / record['destination']
    assert target.is_file(), record['destination']
    if record['set'] in ('inspiracoes-originais', 'apoio-da-analise'):
        assert sha(target) == record['source_sha256'], record['destination']

for path in [*REPORT.glob('*.html'), *DESIGN.glob('*.html')]:
    parser = Assets()
    parser.feed(path.read_text())
    for url in parser.urls:
        check_link(path, url)

for path in [*REPORT.glob('*.css'), *DESIGN.glob('*.css')]:
    pattern = r'url\(\s*([\x22\x27])(.*?)\1\s*\)|url\(\s*([^\x22\x27()\s][^()]*)\s*\)'
    for match in re.finditer(pattern, path.read_text(), re.S):
        check_link(path, (match.group(2) or match.group(3)).strip())

for path in ROOT.rglob('*.md'):
    if 'inspiracoes' in path.relative_to(ROOT).parts:
        continue
    for url in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        check_link(path, url)

for path in REPORT.glob('*.mjs'):
    for specifier in re.findall(r"^import .*? from ['\x22]([^'\x22]+)['\x22]", path.read_text(), re.M):
        if specifier.startswith('.'):
            check_link(path, specifier)
        elif not specifier.startswith('node:'):
            external_dependencies.add(specifier)

identity = json.loads((DESIGN / 'identidade-transitoria.json').read_text())
assert identity['status'] == 'aprovada pelo usuário'
assert identity['palette'] == {
    'primary': '#734B9C', 'secondary': '#FDC234',
    'complementaryAccent': '#FE8342', 'paper': '#F4F0E8', 'ink': '#171320',
}
assert (DESIGN / 'identidade-transitoria.css').read_bytes() == (REPORT / 'identidade-transitoria.css').read_bytes()
assert (DESIGN / 'logo-full-color.svg').read_bytes() == (REPORT / 'catalisa-logo.svg').read_bytes()
for name in ('infografico-inter-regular.ttf', 'infografico-inter-bold.ttf'):
    assert (DESIGN / name).read_bytes() == (REPORT / name).read_bytes()

summary = json.loads((REPORT / 'dashboard-data.json').read_text())
assert len(summary['stories']) == 110
frozen_baseline = json.loads((REPORT / 'diligencia-dados.json').read_text())['baseline']
for name, digest in frozen_baseline.items():
    assert sha(REPORT / name) == digest, f'Corpus congelado alterado: {name}'

legacy = Path('/home/klederson/Downloads/Inspiracoes')
if legacy.exists():
    assert legacy.resolve() == ORIGINALS.resolve()

result = {
    'passed': not errors,
    'owner': 'site.catalisa.io',
    'references': len(references),
    'topLevelOriginalFiles': 72,
    'copiedOrMovedSourceFiles': len(provenance['files']),
    'historicalStories': len(summary['stories']),
    'frozenBaselineFilesPreserved': len(frozen_baseline),
    'localLinksChecked': checked_links,
    'missingLocalLinks': errors,
    'identityAndOfficialLogoPreserved': True,
    'localFontsPreserved': True,
    'historicalBrowserVerifierDependencies': sorted(external_dependencies),
    'scope': 'Integridade da transferência, documentação, vínculos locais e corpus congelado. Sem novo ensaio de produto, navegador ou produção.',
}
(ROOT / 'verificacao-transferencia.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
assert not errors, '\n'.join(errors)

for record in provenance['files']:
    record['local_sha256'] = sha(ROOT / record['destination'])
    record['adapted'] = record['local_sha256'] != record['source_sha256']
(ROOT / 'proveniencia.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n')

manifest = {
    p.relative_to(ROOT).as_posix(): {'bytes': p.stat().st_size, 'sha256': sha(p)}
    for p in sorted(ROOT.rglob('*'))
    if p.is_file() and '__pycache__' not in p.parts
    and p.name != 'manifesto-transferencia-sha256.json'
}
(ROOT / 'manifesto-transferencia-sha256.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
