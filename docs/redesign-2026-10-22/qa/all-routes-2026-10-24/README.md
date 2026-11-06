# Auditoria pública e visual — 24/10/2026

Esta rodada encontrou e corrigiu diferenças reais de composição. Não representa aprovação visual final do usuário nem liberação de produção. Contato e Lab pertencem às frentes de integração; os resultados desses dois caminhos neste snapshot anterior não aprovam a versão atual.

## Ambiente e evidência

- Aplicação independente copiada para `/tmp/catalisa-visual-snapshot`, Vite em `127.0.0.1:5177`, cache próprio e `publicDir` do repositório somente para leitura. Nenhum acesso ao preview principal 5175.
- Referência congelada servida em `127.0.0.1:8176`. Nenhum arquivo da referência alterado.
- Um Chromium por vez, navegação sequencial, movimento reduzido, requisições externas bloqueadas. Sem IA, backend, build, TypeScript ou suites de testes nesta frente.
- [Matriz inicial](matrix.json): 69 rotas × 320/390/768/1440 = 276 medições, com texto, headings, geometria, seções, imagens e capturas representativas.
- [Integridade pública](public-route-integrity.json): 69 rotas, nenhum overflow horizontal, imagem visível quebrada, exceção JavaScript ou link interno de `main` sem rota correspondente nas 276 medições iniciais. Isso não valida destinos externos, âncoras ou todas as ações.
- [Segunda rodada](after/matrix.json): 31 rotas × quatro larguras, após a primeira correção de responsividade. As capturas iniciais e desta pasta são evidência intermediária; não retratam todas as correções posteriores.
- [Rodada direcionada](final/verification.json): oito famílias × quatro larguras após a correção da especificidade.
- [Confirmação final executada](confirmed/verification.json): oito famílias a 390/1440, após labels, símbolos e alvos de toque. A última correção do convite da Arquitetura foi posterior e ainda precisa ser executada no navegador.

## Correções

1. `writeScopedCss` preserva agora os overrides finais de `mobile.css` nas famílias Visão, Arquitetura, Desenvolvedores, Studio, Workflows, Agentes, Governança, Banking e Credit. A raiz adicionada pelo conversor usa `:where()`, preservando a especificidade original dos seletores; a ausência disso impedia regras mobile de vencer regras desktop.
2. Os seletores que começam em `main` são convertidos para alcançar o wrapper nativo dentro de `main`. O comportamento padrão de `scopeStyles` também foi corrigido; Home, recursos e editorial foram regenerados.
3. A base independente recebeu a regra mobile final da referência para labels: 10 px e margem inferior de 22 px. O override de 11 px em Operações foi removido. Antes, cada seção acumulava aproximadamente 5 px de desvio.
4. Breadcrumb, navegação de capacidades e links de Desenvolvedores/Arquitetura mantêm alvo de 44 px com pseudo-elemento, preservando a altura da composição desktop. Removidos aumentos tipográficos que alteravam a geometria sem corresponder ao HTML final.
5. O símbolo do atlas voltou às dimensões da referência, 80 px desktop e 90 px mobile; o override de 100 px acrescentava 50 px ao catálogo em 390 px. A nota editorial das capacidades voltou ao texto original, com a data de origem preservada em atributo de dados.
6. O status de clipboard vazio não reserva uma faixa adicional em Desenvolvedores.
7. O convite Lab de Arquitetura foi reconciliado com a cascata final `experience.css` → `architecture.css`: parágrafo com entrelinha 1.65, SVG com largura de 100% e limite de 460 px, layout mobile no breakpoint de 600 px e intervalo intermediário em 800 px. O SVG nativo e o SVG da referência foram comparados offline e são idênticos. Esta última correção aguarda medição no navegador.

## Resultado da última execução

Diferença máxima entre caixas dos headings; a altura total de `main` apresentou o mesmo delta ou menor.

| Família | 390 px | 1440 px |
|---|---:|---:|
| Agentes | 0 px | 0 px |
| Studio | 0 px | 0 px |
| Workflows | 0 px | 0 px |
| Visão | 0 px | 0 px |
| IAM | 0 px | 0 px |
| Catálogo | 0 px | 0 px |
| Desenvolvedores | 2 px | 0 px |
| Arquitetura, antes da última correção | 11,61 px | 32,19 px |

Na matriz inicial e na segunda rodada, Home, Interfaces, Fontes, Mapa, Press-kit e todas as seis páginas de Perspectivas coincidiram em texto/geometria nas quatro larguras. As demais famílias de Ecossistema tiveram diferenças pequenas de altura e alguns estados não foram revisitados nesta rodada final.

Interações exercitadas na última execução: menu mobile abre, fecha com Escape e devolve foco sem deslocar o H1; a galeria de Interfaces abre, fecha com Escape e devolve foco ao disparador. Sem exceções JavaScript. O campo informativo `editorial filter controls` não é teste dos filtros; os filtros editoriais e todos os demais estados não foram exercitados novamente nesta frente.

## Continuidade obrigatória

O navegador foi liberado para a frente de SEO/build. Depois do artefato de release, executar a comparação dirigida da Arquitetura e atualizar esta evidência. Atualizar o snapshot com o `foundations.css` atual se ainda usar a porta 5177:

```sh
cp src/redesign/foundations.css /tmp/catalisa-visual-snapshot/src/redesign/foundations.css
REDESIGN_VISUAL_OUTPUT=/tmp/catalisa-architecture-final node scripts/audit-redesign-fidelity.mjs --architecture
```

Para medir um servidor de artefato em outra porta, definir `REDESIGN_VISUAL_PORT`. `REDESIGN_REFERENCE_PORT` ajusta a referência; `--families` reduz a matriz às famílias e IAM. Sem flags, o script mede novamente as 69 rotas nas quatro larguras. O script gera evidência; não concede aprovação visual por contagem de rotas.

A versão final ainda precisa da comparação nas quatro larguras após todas as alterações concorrentes, revisão dos estados de cada família, confirmação visual do usuário e validação em staging. Browser desktop com viewport emulado não verifica Safari/iOS, teclado virtual, barras dinâmicas, toque em aparelho físico, leitores de tela reais nem desempenho em rede e hardware móveis. Nenhum deploy foi feito por esta frente.
