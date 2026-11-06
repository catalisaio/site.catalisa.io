import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { renderInfographic } from './render-infografico.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const identitySource = path.resolve(dir, '../../design/entregas-bauhaus/identidade-transitoria.css');
if (fs.existsSync(identitySource)) fs.copyFileSync(identitySource, path.join(dir, 'identidade-transitoria.css'));
const logoSource = path.resolve(dir, '../../design/entregas-bauhaus/logo-full-color.svg');
if (fs.existsSync(logoSource)) fs.copyFileSync(logoSource, path.join(dir, 'catalisa-logo.svg'));
const dashboard = JSON.parse(fs.readFileSync(path.join(dir, 'dashboard-data.json'), 'utf8'));
const result = renderInfographic(dashboard);
if (!fs.existsSync(path.join(dir, 'dossie.html'))) {
  const previous = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  assert(previous.includes('data-design="editorial-atlas-v3"'), 'Preservar o índice anterior exige o HTML original.');
  fs.writeFileSync(path.join(dir, 'dossie.html'), previous);
}
for (const filename of ['index.html', 'infografico.html']) fs.writeFileSync(path.join(dir, filename), result.html);
const represented = result.model.groups.flatMap(group => group.stories.map(story => story.id));
assert.equal(represented.length, dashboard.stories.length);
assert.equal(new Set(represented).size, dashboard.stories.length);
const coverage = {
  version: 'bauhaus-infographic-v1', cutoff: dashboard.cutoff,
  source: 'dashboard-data.json', stories: represented.length,
  groups: result.model.groups.map(group => ({ id: group.id, title: group.title, stories: group.stories.map(story => story.id) })),
  originalIndex: 'dossie.html',
  sources: [
    { file: 'relatorio-completo.html', representedBy: 'Oito sínteses, todas as 110 frentes, limitações e método.' },
    { file: 'cadeia-de-valor.html', representedBy: 'Seis etapas com capacidade, passagem e controle.' },
    { file: 'dashboard.html', representedBy: 'Contagens do snapshot, três bases, distribuição mensal, estados e quatro ensaios.' },
    { file: 'timeline.html', representedBy: 'Sete capítulos, datas dos primeiros registros, gráfico mensal e link ao acervo.' },
    { file: 'developy.html', representedBy: '14 frentes, nove efeitos nos produtos, arquitetura e limites de continuidade.' },
    { file: 'investidores.html', representedBy: 'Ativos, distribuição, monetização e separação entre capacidade e tração.' },
    { file: 'entrevistas.html', representedBy: 'Autoria e dez temas de decisões técnicas com link para os casos.' },
  ],
  designReferences: '../../design/entregas-bauhaus/referencias.html',
};
fs.writeFileSync(path.join(dir, 'infografico-cobertura.json'), JSON.stringify(coverage, null, 2));
process.stdout.write(JSON.stringify({ htmlBytes: Buffer.byteLength(result.html), stories: represented.length, domains: result.model.groups.length, monthlyTotal: result.model.months.reduce((sum, month) => sum + month.total, 0) }) + '\n');
