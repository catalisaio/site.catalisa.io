# Implementação e continuidade

**Validação funcional atual — 26/10/2026, revisão `20261026-concept-null`:** disponível para teste manual em https://site-staging.catalisa.io, sem senha de entrada. [Aceite técnico desta revisão](qa/release/acceptance-concept-null.json): Contato real nos três cenários (16,933s / 13,950s / 14,927s), refinamento, Lab real (17,108s) com reload e continuidade, encaminhamento direto (4,941s), inbox autenticado, HTTPS e bytes exatos passaram. A [recuperação de resposta perdida](qa/release/network-response-replay.json) passou com o recibo real e zero novas gerações. O servidor normaliza somente o sentinela terminal `"null"` emitido como texto; referências desconhecidas continuam bloqueadas. Produção permanece sem publicação. SEO/analytics estão em revisão local e não integram essa versão funcional do staging.

**Correção de medição:** os tempos antigos do Lab (52,885s, 59,949s e a primeira medição de51,031s) incluíam cerca de30s de espera por um elemento de erro inexistente no próprio verificador. Não representam latência pura de geração e não devem servir de comparação de desempenho. A medição corrigida atual é17,108s.


**Recuperação validada em 26/10/2026 — revisão `20261026-ai-recovery`:** o smoke real reproduziu o HTTP500 relatado pelo usuário. A API de staging não conseguia ler a configuração cifrada da credencial Anthropic conectada. Foi alterado somente o agente exclusivo do site para a credencial OpenAI já existente e legível da mesma conta, com prompt validado; ID do agente, cookies e conversas preservados. [Contato na mesma sessão que falhou](qa/contact-recovery-real-staging/verification.json) passou: geração 19,853s, revisão já existente 42ms, refinamento 14,840s, reload e quatro larguras. [Lab real](qa/lab-real-staging/verification.json) passou em 52,885s, com tela, reload e continuidade no Contato. [Aceite da recuperação](qa/release/acceptance-ai-recovery.json). A política PT/EN passou a descrever o provedor configurado entre os fornecedores listados. Build/257 snapshots/SEO/41 checks de navegador e TypeScript passaram. Produção, painel e building blocks não foram publicados/alterados; a checagem atual do agente de produção foi apenas de metadados e confirmou configuração legível. As evidências r2 abaixo são históricas. Os aceites humanos continuam pendentes.

Conferência de operação em **26/10/2026**: [API/Caddy estáveis há cerca de 29h, zero reinícios/OOM e 29 ciclos de retenção concluídos](qa/release/staging-ops-status.json). O [HTTP público sem senha](qa/release/staging-http-public.json) passou novamente; a equipe continua exigindo autenticação própria. Preview local restabelecido com HMR. Essa inspeção não é monitor recorrente, recebimento de alerta ou responsabilidade humana aceita.

**Acesso atualizado em 25/10/2026:** por pedido explícito do usuário, a senha de entrada do staging foi removida. Abra **https://site-staging.catalisa.io/** diretamente. HTTPS, noindex/no-store e autenticação própria da equipe foram preservados; [smoke HTTP sem senha](qa/release/staging-http-public.json) passou. O candidato r2 e a produção não foram alterados. Referências a BasicAuth abaixo descrevem a validação anterior.

Atualizado em 25/10/2026 (UTC). Objetivo completo: incorporar o ZIP, reconciliar materiais e estratégia, produzir styleguide completo e implementar o site novo real com as features e integrações Catalisa, incluindo assistente, contato, persistência e atendimento.

## Pedido editorial de produtos próprios e legado

Implementados 17 textos em espaços existentes de Banking, Credit e Arquitetura, convidando a criar o próprio produto financeiro, desenhar crédito original e modernizar/substituir o legado por etapas. Hierarquia preservada, sem seções extras; [decisão e evidência offline](qa/financial-messaging/README.md). O candidato r2 preserva a hierarquia; o aceite visual/editorial dos textos e quebras de linha permanece com o usuário. O hero principal da Home permanece sem nova alternativa escolhida.

## Onde estamos

Correção de marca de 23/10: o usuário confirmou a identidade nova do ZIP. O press kit local foi regenerado a partir do HTML final e dos arquivos originais de marca, sem reconstruir logos, símbolo, avatares, capas ou ZIP. A aplicação geral da identidade aos demais produtos e materiais permanece futura e não foi executada. Cabeçalho e rodapé também usam a assinatura nova; isso não representa migração dos demais produtos.

| Frente | Situação atual |
|---|---|
| Preview e aplicação | `src/redesign/App.tsx`, independente do legado; HMR em http://localhost:5175/ |
| Site público | Versão anterior preservada; nenhuma publicação do site novo em produção |
| Staging do site | `https://site-staging.catalisa.io`, revisão `20261026-ai-recovery`, HTTPS válido e noindex, sem senha de entrada. r2 compilada e instalada; todos os browsers funcionais finais passaram; Home final medida; meta de LCP não atingida |
| Painel/building blocks | Nenhuma alteração ou publicação de código como consequência deste site. Recursos exclusivos do site foram criados pelas APIs existentes |
| Interfaces e identidade | 69 rotas nativas; identidade e arquivos do ZIP preservados; novas mensagens financeiras em 17 espaços existentes. Build/SEO/browser técnico r2 passaram; smokes funcionais finais passaram; Home final medida; meta de LCP não atingida |
| Contato com IA | [Três casos finais r2](qa/contact-real-staging/verification.json) passaram: loja 33,942s, clínica 20,843s e escola 32,958s, com revisão/reload e refinamento coerente. Evidência Node anterior preservada em seu escopo |
| Contato humano direto | [Smoke real r2](qa/contact-direct-real-staging/verification.json) passou em 3,952s: visitante sem sessão, nome/e-mail somente, confirmação fresca após reload, inbox do owner, zero chamadas e zero jobs IA; defaults SYSTEM e limpeza comprovados |
| Lab | [Smoke final r2](qa/lab-real-staging/verification.json) passou: matrícula via WhatsApp, três telas, geração 59,949s no fluxo de UI, reload e continuidade no Contato preservando conceito; sem timeout nesta rodada |
| Inbox humano | [Browser final r2](qa/inbox-browser-staging/verification.json) passou em quatro larguras: login/open/claim/reply/reload, logout 401, limpeza e zero pageerrors. IAM/fila cifrada reais; sem telefone fictício ou e-mail/WhatsApp externo |
| Persistência | Store real compartilhado, CAS/replay/isolamento/retenção e migração 23 sessões/58 recibos comprovados. [Rollback real](qa/release/staging-rollback.json) preservou a conversa e o hash do site público |
| Recursos de produção | Agente próprio sem ferramentas, token e três coleções cifradas preparados; [smoke real de duas instâncias](qa/integrations/production-resources-real.json) passou, IA 19,817s e resposta no inbox. Nenhum deploy de website ou corte público |
| H14 e política | Implementação e smoke real com dados fictícios passaram; coleta pública desligada (`SITE_MARKET_INSIGHTS_ENABLED=0`), escolha do usuário pendente |
| Desempenho | [Home final r2](qa/home-preload-production-review/verification.json): LCP 3,032s (antes 3,272s), CLS 0,021034. Medição concluída, meta 2,5s não atingida; sem alegação de performance 100%. Outras seis rotas medidas anteriormente ficaram abaixo de 2,5s |
| Próximo marco | Apresentar o [aceite técnico r2](qa/release/acceptance-r2.json) com limites reais; obter aceite visual/editorial e autorização explícita de publicação. H14 fica desligado até escolha do usuário |

Publicação em produção exige staging validado, aviso e autorização explícita do usuário, conforme `AGENTS.md`. Provisionar recursos e rodar smoke fictício na API de produção não é publicar o website. O relato de publicações do painel por outra sessão não foi atribuído a esta execução.

## Estado verificável

- [HTTPS atual do hosting r2](qa/release/staging-http-public.json): confirmou ID da release e bytes da Home, TLS válido, acesso sem senha, robots bloqueado, noindex/no-store, rotas/redirects/404 e BFF/cookies/origem. O build indexável de produção é revisado sob proteção exclusiva do staging.
- [Contato direto r2](qa/contact-direct-real-staging/verification.json): nome/e-mail somente, nova confirmação após reload, defaults SYSTEM, owner/inbox e limpeza; aceite 3,952s, zero chamadas de geração e zero jobs IA. Aceite capturado a 320/390/768/1440px.
- Árvore final r2: 257 HTMLs, auditoria 256 URLs sem falhas/avisos, 41 checks de browser, 231 testes/20 arquivos e TypeScript passaram. Isso não substitui os smokes reais ainda em execução.
- [Contato com IA r2](qa/contact-real-staging/verification.json) passou nos três casos: loja 33,942s/revisão 1,921s, clínica 20,843s/revisão já presente 52ms, escola 32,958s/revisão 1,927s. O refinamento mantém catálogo/pedidos no WhatsApp e move somente as notificações para e-mail, com revisão humana. A rodada antiga com falhas foi preservada em [histórico anterior às correções Node](qa/contact-real-staging/verification-before-node-fixes.json).
- [Contato Node real anterior](qa/integrations/contact-node-staging.json): briefing fictício curto, geração 21,636s, revisão humana estruturada 1,252s sem nova IA e refinamento 27,516s, mantendo o canal principal e mudando as notificações pedidas. Limites medidos, não promessa de latência.
- [Lab final r2](qa/lab-real-staging/verification.json): matrícula via WhatsApp com três telas, geração real 59,949s incluindo UI, reload e continuação no Contato preservaram o conceito. Contato levou cerca 21–34s e Lab 60s, com loading e sem timeout nesta rodada; nenhuma promessa de latência curta.
- [Inbox real](qa/integrations/inbox-real.json) e [browser HTTPS](qa/inbox-browser-staging/verification.json): e-mail sem telefone, confirmação, entrega após abertura, atribuição após assumir, resposta, reload, isolamento, deduplicação e logout; sem envio externo.
- [Store compartilhado](qa/integrations/shared-store-real.json), [migração](qa/integrations/local-store-migration.json) e [preview](qa/integrations/preview-shared-store.json): duas instâncias, CAS/replay/retention e 23 sessões/58 recibos migrados com cookie/backup preservados.
- [Produção: provisionamento](qa/integrations/production-resources.json) e [prova funcional](qa/integrations/production-resources-real.json): owner confirmado, agente próprio sem ferramentas, três coleções cifradas com CAS/dedup, IA real 19,817s e resposta no inbox recuperada entre instâncias. Dados fictícios removidos; métrica pública segue desativada. Não houve deploy do website, tráfego alterado ou mensagem externa.
- [Rollback de staging](qa/release/staging-rollback.json): voltou à revisão anterior e restaurou a seguinte, preservando conversa/cookie. Hash do corpo público de produção idêntico antes/depois; nenhum router/container público alterado.
- [H14 real](qa/market-insights/real-staging.json): cinco sessões fictícias, 17 eventos dos dez tipos, outbox recuperável, CAS 200/409, dedup, exclusão, supressão com menos de cinco sujeitos e limpeza integral passaram. Execução ritmada sem 429; política era fixture de teste, não autorização do usuário.
- [H15 final da Home](qa/home-preload-production-review/verification.json): LCP 3,032s e CLS 0,021034; o preload melhorou o LCP anterior 3,272s, mas a meta 2,5s continua não atingida. O PASS cobre DOM no escopo medido, não performance 100%. [Rodada anterior das sete rotas](qa/site-quality-production-review/verification.json): outras seis abaixo de 2,5s, CLS Contato 0,000245 e menus 0px. Não há INP de campo, certificação WCAG ou validação em aparelhos físicos.
- [Aceite técnico consolidado](qa/release/acceptance-r2.json) e [estado atual](qa/release/current-status.json): todos os testes funcionais finais e hashes stage/prod preparado registrados; publicação pública não autorizada ou executada.
- [Fontes](qa/site-quality/font-subsets.json): 151.520B (-54,39%), contornos/instruções/métricas preservados e cobertura de 69 rotas mais código/SVG/dados/copys; fallback completo preservado.
- [H11](qa/capability-curation/README.md): 39 capacidades rastreadas; 33 fontes README no caminho esperado, seis Alpha sem README nesse caminho. [H16](editorial-review-register.json): 83 itens com fonte/hash e procedimento, todos aguardando responsável/decisão; contato operacional não constitui aprovação editorial.
- Identidade do artefato revisado: public SHA-256 `948f85b14b796e50623068d7bf0c8f69818fad5b328e87df532d2b7e642724ff`; server SHA-256 `a4eb20162dd086e470a02df120bdfdf5fc347bfd8dcd60e64365a62dd47a5dff`. As duas árvores são idênticas no staging e no candidato preparado para produção. O plano somente leitura no CT105 confirmou o upstream público legado 8081; hash público permanece `e446bf5b5f201e8db907a3186f022f07fb902c76c85a134c2904d560a8957735`.

Pendências atuais de decisão: aceite visual/editorial do candidato e textos; autorização explícita de publicação; escolha do usuário antes de qualquer coleta H14, hoje desligada. Limitações técnicas permanecem explícitas: Home LCP 3,032s acima de 2,5s, IA variável e ausência de prova em aparelhos físicos/CWV de campo. Nenhuma dessas limitações é aprovação presumida. O hero principal permanece sem nova alternativa escolhida.

As rodadas abaixo são históricas das respectivas versões. Afirmações antigas sobre Lab pendente, SQLite exclusivo, ausência de agente/inbox/coleções ou falta de deploy no staging não descrevem o estado atual.

### Histórico das rodadas anteriores

- [Banking e Credit](qa/financial/README.md): oito medições nas quatro larguras e 100 comparações de estados, com teclado, galerias, reprodução/pausa dos dois vídeos e navegação SPA; capturas finais atualizadas. TypeScript e 126 testes passaram. Contraste ampliado para 116 medições em 58 rotas, sem falhas no escopo medido. [Validação consolidada](qa/financial/validation.json).
- Build histórico: `/tmp/catalisa-financial-validated`, com 252 HTMLs incluindo 404; auditoria de 193 URLs legadas públicas e 58 nativas sem indexação, sem falhas ou avisos. [Navegador do artefato](qa/financial/seo/browser-built.json): 40 verificações com e sem JavaScript, sem exceções. Um timeout interrompeu uma tentativa anterior; a rota foi diagnosticada e a rodada completa posterior passou. Nenhum deploy; CDN e indexação não foram exercitados.
- Rodada anterior, operacional/Ecossistema: [Studio, Workflows, Agentes e Governança](qa/operations/verification.json) passaram em quatro larguras, com 300 comparações de estados e 16 medições de layout. [Composições e seis páginas de Ecossistema](qa/ecosystem/verification.json) passaram com 28 medições e 12 comparações dos estados de composição, incluindo links para fontes/capacidades, estrutura SVG, imagens, teclado e navegação SPA. Nada disso comprova integrações reais.
- Build anterior: `/tmp/catalisa-operations-validated`, com 250 HTMLs incluindo 404; auditoria de 193 URLs legadas públicas e 56 nativas sem indexação, sem falhas ou avisos. [Navegador desse artefato](qa/operations/seo/browser-built.json): 36 verificações, incluindo as 11 novas rotas com e sem JavaScript, sem exceções. Evidência histórica da rodada anterior.
- ZIP preservado, 312 arquivos extraídos em `novos-insumos/catalisa-handoff-v1.1`, com SHA-256 por arquivo e cópia do ZIP. Referência permanece congelada.
- Validador original: 69 rotas e checksums íntegros; fixtures válidos. QA visual inicial: 14 páginas, 4 larguras. [Evidência](qa/reference/inspection.json).
- [Análise do merge](analise-merge-handoff.md) e [styleguide](styleguide.md) consolidam direção, fontes e conflitos. A aprovação da Home vem do material fornecido; a reconciliação da assinatura vem do `AGENTS.md` atual.
- Implementação nativa em `src/redesign`, isolada do tema legado: guia viva, Home em `/design-system/home`, catálogo e 39 detalhes, Visão, Arquitetura, Desenvolvedores, Studio, Workflows, Agentes, Governança, Composições, Ecossistema e todos os seus detalhes, incluindo Banking e Credit. A Home principal ainda é a atual. Outras famílias continuam pendentes; não considerar o preview um site completo. Sem publicação ou corte de domínio nesta etapa.
- [QA nativo](qa/native/verification.json): 168 medições de layout, nas quatro larguras, com busca/filtros/vazio/carregamento do catálogo, fonte/maturidade/H1 dos 39 detalhes, menu, teclado, acordeão e diálogos. Chromium de desktop; não substitui aparelhos físicos, validação de todas as rotas ou testes de integração.
- Na etapa anterior de SEO, `npx tsc -b` e `npm run test` passaram com 125 testes. [Validação histórica dessa etapa](qa/seo/validation.json): pipeline completo em `/tmp/catalisa-seo-validated`, com 241 HTMLs incluindo 404; [auditoria estática](qa/seo/static-audit.json) de 195 URLs legadas públicas e 45 nativas sem indexação, sem falhas ou avisos. [Navegador](qa/seo/browser-built.json): 14 verificações, sem erros, incluindo inicialização, navegação e leitura sem JS. Esses números não representam 240 páginas novas do redesign nem validam automaticamente as quatro famílias adicionadas depois. O `dist/index.html` que já estava removido continua ausente; não houve deploy.
- [Comparação das novas famílias](qa/foundations/verification.json): Visão, Arquitetura e Desenvolvedores nas quatro larguras, com comparação do texto renderizado, três princípios, seis composições, três diagramas de adoção e seis combinações de API/linguagem. Inclui teclado, acordeão, pausa, clipboard com sucesso/falha e isolamento de CSS ao voltar ao catálogo. O HTML final do handoff prevalece sobre trechos intermediários substituídos por wrappers.
- [Mapeamento Catalisa](integracoes-catalisa.md): código do CRM/agentes, telefone obrigatório para lead real e necessidade de identidade provisória no site. [Leituras no staging](qa/integrations/staging-readonly.json) retornaram HTTP 200 para status de IA, metadados do agente candidato e captura pública. Não foram criados leads, conversas ou envios nem executada geração de IA.
- [Mapa de migração](mapa-migracao.json): 67 interfaces em revisão visual e duas rotas ainda pendentes de implementação real, Contato e Lab. A guia de trabalho é adicional; a Home da aplicação pública não foi trocada por esta execução.
- [Contraste de texto HTML](qa/native/contrast.json): 116 medições em 58 rotas, a 390/1440 px, sem falhas contra o fundo sólido computado após as correções. Não inclui leitura sobre imagens/gradientes, SVGs, pseudo-elementos ou todos os estados; não é certificação WCAG.
- O usuário indicou `admin@catalisa.app` para as integrações. A [consulta da conta no staging](qa/integrations/admin-staging-readonly.json) confirmou o owner e encontrou Atendimento Catalisa. Seu toolset inclui consulta de leads e envio; a próxima implementação prepara escopo próprio do site antes de qualquer conversa pública. Nenhum agente, lead, conversa ou envio foi criado.

## H01–H16

| ID | Estado atual | Prova / limite / trabalho restante |
|---|---|---|
| H01 | Inventário e migração técnicos implementados | Rotas legadas/nativas, sitemap, aliases e redirects com query têm auditoria e smoke HTTPS. Repetir inventário/SEO no build final; dados de tráfego não foram usados para presumir equivalentes |
| H02 | Acervo preservado/verificado | 69 rotas da referência, 312 arquivos e hashes; [rebuild congelado](qa/reference/rebuild.json). Identidade do ZIP prevalece; fonte original/brand não alterados |
| H03 | 69 interfaces; r2 instalada, aceite final aberto | Aplicação nativa independente, Contato direto sem IA já passou no staging. Contato IA/direct, Lab e inbox r2 passaram; Home final foi medida com limitação de LCP. Aceite visual/editorial e autorização de corte permanecem humanos |
| H04 | Recursos reais de staging e produção preparados | Agentes próprios Anthropic sem ferramentas; [prova de produção](qa/integrations/production-resources-real.json). Não equivale a deploy público ou garantia de modelo/latência pelo alias declarado |
| H05 | Store compartilhado e rollback comprovados | CAS/replay/isolamento/retenção, migração 23/58, recuperação entre instâncias e conversa preservada após rollback real. Produção usa recursos próprios |
| H06 | Coleta/identidade e caminho direto comprovados | Nome e e-mail **ou** telefone; r2 real com e-mail somente, nova confirmação após reload e defaults SYSTEM passou. Sem telefone fictício ou exigência dos dois |
| H07 | Três casos reais r2 passaram | Loja 33,942s, clínica 20,843s, escola 32,958s; novas revisões humanas 1,921s/1,927s sem inferência, revisão existente 52ms. Refinamento preservou WhatsApp principal e moveu só notificações para e-mail. Não é garantia de latência |
| H08 | Renderer/versionamento implementados | Telas/capacidades/jornada/refinamento/reload exercitados; dados exploratórios não executam produto. Repetir browser real da revisão final nas quatro larguras |
| H09 | Inbox real e UI de staging comprovados | Aceite durável, entrega após abertura, atribuição após claim, resposta/reload/isolamento/dedup. Contato direto e inbox final r2 passaram em quatro larguras, com logout 401, limpeza e zero pageerrors; sem envio externo |
| H10 | Controles reais exercitados; final revalidável | HTTPS, origem, cookies Secure/HttpOnly, CSP, limites de corpo, IAM/isolamento e quotas têm evidências. Backend atual usa inbox, não callback externo; não se declara certificação integral |
| H11 | Inventário 39 pronto; decisão editorial pendente | [Fonte, hash, snapshot, alegação e estágio por capacidade](qa/capability-curation/README.md); 33 READMEs localizados, seis Alpha fora do caminho esperado. Nenhuma aprovação de produto ou disponibilidade operacional inventada |
| H12 | Evidência técnica registrada; aceite visual humano pendente | Matriz 69×4 e correções anteriores; fluxos finais r2 e menus/teclado 0px exercitados. Não equivale à aprovação visual do usuário, teste físico ou certificação WCAG |
| H13 | Build/SEO técnico r2 passaram | 257 HTMLs, 256 URLs sem falhas/avisos e 41 checks de browser; HTTP real conferiu release/bytes/robots. Staging/prod preparado têm hashes idênticos. Tráfego público depende de conclusão dos demais aceites e autorização |
| H14 | Implementação real passou; coleta desligada | [Cinco sessões, 17 eventos/dez tipos, CAS/dedup/erase/k5/limpeza](qa/market-insights/real-staging.json). Flag 0; política de teste não autoriza ativação, decisão do usuário pendente |
| H15 | Medição final concluída; meta Home não atingida | Fontes 151KB/chunks por rota/preload. Home LCP 3,032s (antes 3,272s), CLS 0,021034; acima de 2,5s. Outras seis rotas anteriores abaixo de 2,5s. Sem alegação de performance 100% ou CWV de campo |
| H16 | Registro 83 pronto; responsáveis/aprovações pendentes | [Registro com fonte, snapshot/hash e procedimento](editorial-review-register.json); 83 decisões ainda pendentes, sem atribuição ou aprovação presumida |

## Decisões para publicação

A [auditoria de conclusão](qa/release/completion-audit-r2.md) diferencia prova funcional de cada gate original. Testes em aparelhos físicos e a operação de monitoramento/alertas/fila/rollback ainda não estão comprovados; não registrar esses itens como concluídos por existir um endpoint de saúde ou inbox funcional. Os [39 links públicos do catálogo](qa/capability-curation/public-doc-links.json) tiveram HTTP/conteúdo/destino conferidos, sem que isso aprove a maturidade dos produtos.

1. Apresentar o staging `20261025-r2` e o [aceite técnico consolidado](qa/release/acceptance-r2.json), com todos os browsers funcionais reais, hashes iguais ao candidato preparado de produção e limitações de performance/IA. A medição final da Home foi concluída; LCP 3,032s continua acima de 2,5s.
2. Registrar o aceite visual/editorial e a decisão sobre os textos/fontes/maturidade/responsáveis; não preencher decisões pendentes do usuário automaticamente.
3. Obter autorização explícita antes de instalar/publicar o site em produção. O upstream 8081 e o corpo público continuam intactos. H14 permanece desligado até uma escolha específica do usuário; ausência de resposta não autoriza ativação.

## Comandos

```sh
python3 docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/tools/validate_reference.py
VITE_REDESIGN_PREVIEW=1 npm run dev -- --host 127.0.0.1
# Sistema vivo em http://localhost:5175/design-system
npx tsc -b
npm run test
# Servidor da referência, somente local:
python3 -m http.server 8176 --bind 127.0.0.1 --directory docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/reference/site/dist
node scripts/inspect-redesign-reference.mjs
node scripts/prepare-redesign-catalog.mjs
node scripts/prepare-redesign-foundations.mjs
node scripts/prepare-redesign-developers.mjs
node scripts/verify-redesign.mjs
node scripts/verify-redesign.mjs --foundations
node scripts/prepare-redesign-operations.mjs
node scripts/verify-redesign.mjs --operations
node scripts/prepare-redesign-ecosystem.mjs
node scripts/verify-redesign.mjs --ecosystem
node scripts/prepare-redesign-financial.mjs
node scripts/verify-redesign.mjs --financial
node scripts/verify-redesign.mjs --contrast-only
node scripts/verify-redesign.mjs --seo --built-dir=/tmp/catalisa-seo-validated
npm run check:seo
node scripts/inspect-catalisa-staging.mjs
```

Não executar `install-handoff.sh` sobre o repositório: o pacote já foi importado preservando o acervo e as instruções. Não regenerar dentro da referência congelada; usar cópia temporária. Não restaurar nem sobrescrever as alterações de pricing, `CLAUDE.md`, `dist/index.html` ou outros arquivos que antecedem o trabalho.
