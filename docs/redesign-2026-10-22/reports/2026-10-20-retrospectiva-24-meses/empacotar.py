import hashlib
import json
import pathlib
import zipfile
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit


root = pathlib.Path(__file__).resolve().parent
verification = json.loads((root / 'verificacao.json').read_text())
assert verification['passed']
infographic_verification = json.loads((root / 'verificacao-infografico.json').read_text())
assert infographic_verification['passed']
identity_verification = json.loads((root / 'verificacao-identidade.json').read_text())
assert identity_verification['passed']
diligence_verification = json.loads((root / 'verificacao-diligencia.json').read_text())
assert diligence_verification['passed']
diligence = json.loads((root / 'diligencia-dados.json').read_text())
for name, sha in diligence['baseline'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == sha, name
timeline = next(item for item in verification['browser'] if item.get('version') == 'artistic-atlas-v3')

previous = json.loads((root / 'manifesto-sha256.json').read_text())
for name in ['dados.json', 'prs.csv', 'commits.csv', 'documentos.csv', 'modulos.csv']:
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == previous[name]['sha256'], name

delivery = json.loads((root / 'entrega.json').read_text())
delivery['design'] = {
    'version': 'bauhaus-transitoria-v1',
    'html': ['index', 'infografico', 'dossie', 'dashboard', 'cadeia-de-valor', 'timeline', 'relatorio-completo', 'developy', 'investidores', 'entrevistas', 'diligencia', 'diligencia-tecnica', 'diligencia-corporativa', 'diligencia-evidencias', 'homologacao'],
    'pdf': ['infografico', 'cadeia-de-valor', 'dashboard', 'relatorio-completo', 'developy', 'investidores', 'entrevistas', 'diligencia', 'diligencia-tecnica', 'diligencia-corporativa', 'diligencia-evidencias', 'homologacao'],
    'valueChain': {'stages': 6, 'stories': 37, 'distinctPrs': 220, 'presentationMode': True},
    'dashboardCharts': 22,
    'dashboardDataTables': 22,
    'sharedEditorialStyle': True,
    'identity': 'catalisa-transitoria-2026-10',
    'identityApprovedAt': '2026-10-21',
    'identityVerifiedPages': [item['name'] for item in identity_verification['pages']],
    'identityVerifiedPdfs': [item['name'] for item in identity_verification['pdfs']],
    'developyImpactCases': 9,
    'infrastructureStories': 14,
    'interviewCases': 10,
    'developyCodeFiles': 11,
    'constructionHistoryCompared': True,
    'pdfPageNumbers': all(item.get('pageNumbers') for item in verification['pdfs']),
    'infographic': {
        'version': 'bauhaus-infographic-v1',
        'stories': 110,
        'domains': 8,
        'pdfPages': infographic_verification['pdf']['pages'],
        'verifiedWidths': [item['viewport'] for item in infographic_verification['viewports']],
        'originalIndex': 'dossie.html',
        'localFonts': True,
        'browserVerified': True,
    },
}
delivery['pdfPages'] = {pathlib.Path(item['file']).stem: item['pages'] for item in verification['pdfs']}
delivery['pdfPages']['infografico'] = infographic_verification['pdf']['pages']
delivery['pdfPages'].update({pathlib.Path(item['file']).stem: item['pages'] for item in diligence_verification['pdfs']})
delivery['diligence'] = {
    'version': diligence['version'],
    'edition': diligence['edition'],
    'technicalCutoff': diligence['technicalCutoff'],
    'purpose': diligence['purpose'],
    'counts': diligence['counts'],
    'verified': True,
    'allVendorControlsAwaitBuyerEvaluation': True,
    'baselinePreserved': True,
    'accessModel': diligence['accessModel'],
}
delivery['timeline'] = {
    'version': 'artistic-atlas-v3',
    'milestones': timeline['milestones'],
    'chapters': 7,
    'stories': 110,
    'benchmarks': 4,
    'presentationMode': True,
    'filtersInDrawer': True,
    'filterStateInHash': True,
    'archiveLoadedOnDemand': True,
    'browserVerified': True,
}
(root / 'entrega.json').write_text(json.dumps(delivery, ensure_ascii=False, indent=2))

excluded = {'manifesto-sha256.json', 'dossie-catalisa.zip', 'dossie-catalisa.zip.partial'}
files = [item for item in sorted(root.iterdir()) if item.is_file() and item.name not in excluded]
manifest = {
    item.name: {
        'bytes': item.stat().st_size,
        'sha256': hashlib.sha256(item.read_bytes()).hexdigest(),
    }
    for item in files
}
(root / 'manifesto-sha256.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))

archive = root / 'dossie-catalisa.zip.partial'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=7) as output:
    for item in [*files, root / 'manifesto-sha256.json']:
        output.write(item, 'catalisa-retrospectiva/' + item.name)
with zipfile.ZipFile(archive) as output:
    assert output.testzip() is None
archive.replace(root / 'dossie-catalisa.zip')


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        self.ids.update(value for key, value in attrs if key == 'id')
        if tag == 'a':
            self.links.extend(
                value for key, value in attrs
                if key == 'href' and value
                and not value.startswith(('http:', 'https:', 'mailto:'))
            )


pages = {}
for item in root.glob('*.html'):
    parser = Links()
    parser.feed(item.read_text())
    pages[item] = parser

for item, parser in pages.items():
    for link in parser.links:
        parts = urlsplit(link)
        target = item.parent / unquote(parts.path) if parts.path else item
        assert target.exists(), (item.name, link)
        if parts.fragment and '=' not in parts.fragment:
            assert target in pages and unquote(parts.fragment) in pages[target].ids, (item.name, link)

for name, item in manifest.items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == item['sha256']

print(json.dumps({
    'files': len(manifest),
    'archiveBytes': (root / 'dossie-catalisa.zip').stat().st_size,
    'dataPreserved': True,
    'manifestVerified': True,
    'localLinksVerified': True,
}))
