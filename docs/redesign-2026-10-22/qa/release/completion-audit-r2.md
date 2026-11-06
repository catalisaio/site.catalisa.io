# Auditoria de conclusão da r2

Auditoria de 25/10/2026 contra o [backlog e gate originais](../../novos-insumos/catalisa-handoff-v1.1/docs/06-backlog-e-aceite.md), as [responsabilidades de produção](../../novos-insumos/catalisa-handoff-v1.1/docs/05-producao.md), o `AGENTS.md` e as correções explícitas do usuário. Não altera o candidato nem registra aprovação em nome de ninguém.

**A conclusão integral ainda não está comprovada.** Os testes funcionais da r2 passaram; o aceite editorial/visual, os testes físicos e a operação após o lançamento têm condições adicionais abaixo. `technicalFunctionalAcceptancePassed` no [estado atual](current-status.json) se limita ao seu nome: não significa aprovação de todos os gates.

Os 924 arquivos do pacote de staging e os 923 do pacote preparado de produção foram novamente conferidos contra os respectivos manifestos. A diferença é o overlay de proteção do staging, fora das árvores públicas/servidor. Essas duas árvores têm hashes idênticos entre ambientes. A produção não foi instalada ou publicada.

## H01–H16

| Item | Evidência inspecionada | Conclusão e condição restante |
|---|---|---|
| H01 — inventário e adaptação | [Implementação](../../implementacao.md), [rotas de release](release-routes.json), [HTTP r2](staging-http.json) | Inventário e migração técnicos registrados. Revisão do responsável integra o aceite final. |
| H02 — referência e baseline | [Rebuild da referência](../reference/rebuild.json), [marca original](brand-originals.json) | Referência/arquivos preservados; nova identidade do ZIP prevalece conforme o usuário. |
| H03 — navegação e famílias | [Matriz de 276 medições](../all-routes-2026-10-24/matrix.json), [correções direcionadas](../all-routes-2026-10-24/final/verification.json), [build r2](../production-artifact/validation.json) | Comparações técnicas e fluxos existem. A matriz anterior e os smokes finais não substituem o aceite visual humano da revisão. |
| H04 — APIs e tenant | [Produção real, sem deploy](../integrations/production-resources-real.json), [inbox real](../inbox-browser-staging/verification.json) | Owner, persistência, IA e atendimento próprios exercitados. |
| H05 — persistência | [Store real](../integrations/shared-store-real.json), [rollback](staging-rollback.json), smokes de Contato/Lab/inbox | CAS, isolamento, replay e retomada comprovados no escopo descrito. |
| H06 — identidade e lead | [Testes finais](../integrations/contact-direct-unit.json), [Contato direto real](../contact-direct-real-staging/verification.json) | Registro provisório do BFF e captura de nome + e-mail **ou** telefone comprovados. O encaminhamento operacional cria pacote no inbox exclusivo do site. Não há criação de lead no CRM nativo; essa adaptação é explícita e integra o aceite de negócio, sem alegar equivalência de IDs. |
| H07 — geração | [Três casos reais](../contact-real-staging/verification.json), [Lab real](../lab-real-staging/verification.json), testes de integração/schema | Geração, validação, timeout, replay e quotas implementados/verificados. Latência observada de 21–60s; não há promessa de rapidez ou disponibilidade universal. |
| H08 — renderer e versões | Contato real com refinamento, Lab com reload/continuidade e testes de operações | Telas, capacidades, jornada e versões exercitados; conceito exploratório não executa produto. |
| H09 — atendimento | [Inbox real r2](../inbox-browser-staging/verification.json), [Contato direto](../contact-direct-real-staging/verification.json) | Aceite, entrega após abertura, atribuição após claim e resposta/reload comprovados. Só o canal aqui no site está habilitado; não há envio de e-mail/WhatsApp. |
| H10 — backend público | [HTTP real](staging-http.json), [Node real](../integrations/standalone-real.json), testes de API/integrações/inbox | Origem, cookies, autorização, limites, CSP, validação e isolamento têm provas. Isso não equivale à definição de plantão e alertas de operação. |
| H11 — alegações e maturidade | [Inventário de 39 capacidades](../capability-curation/inventory.json), [39 links públicos reais](../capability-curation/public-doc-links.json), [registro editorial](../../editorial-review-register.json) | Documentação respondeu HTTP200 no destino correto, sem login/404 observado. Isso e fonte/hash não são aprovação de maturidade ou disponibilidade. Zero aprovações de produto registradas; depende dos responsáveis. |
| H12 — acessibilidade | [Contraste de texto HTML](../native/contrast.json), [teclado/menus](../site-quality-production-review/verification.json), [smokes finais](acceptance-r2.json) | Cobertura técnica parcial, com limites explícitos para imagens/SVG/gradientes/estados. Não há prova de Safari/iOS e Chrome/Android físicos nem certificação WCAG. |
| H13 — SEO/privacidade/domínio | Build r2 de 257 HTMLs, SEO de 256 páginas, HTTP/TLS/robots/redirects reais, rollback | Parte técnica exercitada. Aprovação do conteúdo/política e autorização de publicação continuam pendentes. |
| H14 — mercado | [Cinco sessões sintéticas reais](../market-insights/real-staging.json), validação de configuração da política | Implementação e agregados testados. Coleta real desligada; a política e sua ativação não foram aprovadas. |
| H15 — mídia e scripts | [Medição final da Home](../home-preload-production-review/verification.json), [sete rotas anteriores](../site-quality-production-review/verification.json) | Medição emulada, não aparelho físico. Home LCP 3,032s e CLS 0,021034; meta de 2,5s não atingida. Sem alegação de performance 100%. |
| H16 — rotina editorial | [83 itens com fonte/hash](../../editorial-review-register.json) | 83 itens sem decisão/responsável de revisão aceitos. Contato operacional informado não é atribuição editorial aceita. |

## Dez testes críticos

| Teste do handoff | Evidência que cobre o comportamento | Limite da prova |
|---|---|---|
| 1 — respostas, nome e replay | API/CAS/idempotência em `server/site/api.test.ts`; Contato real r2 | Identidade/lead provisórios pertencem ao BFF; CRM nativo não é criado. |
| 2 — interrupção e isolamento | Testes de API, store real, reload de Contato/Lab e inbox | Não recuperar histórico alheio está coberto por autorização por cookie. |
| 3 — falha de cadastro | Persistência/CAS e conflitos nos testes de API/store | Falha controlada no limite de persistência; não se provoca indisponibilidade do produto compartilhado. |
| 4 — timeout de IA | `contact-operations.test.ts`, inclusive integração que ignora abort | Falha injetada e orçamento verificados; geração real saudável e falha anterior preservada em relatório histórico. |
| 5 — saída inválida/script | Testes de schema e integrações; texto literal no inbox real | Não se aceita HTML executável do modelo; renderer React tipado. |
| 6 — revisão humana | Contato real: revisão estruturada sem IA; inbox real: atribuição observada | Acrescentar uma etapa de revisão ao conceito não significa que uma pessoa aprovou o produto. |
| 7 — briefing e versão | Testes de operações/API e refinamento real | Versões anteriores preservadas; pacote confirmado permanece na versão enviada. |
| 8 — canal ausente | Validação de canais nos testes de operações/inbox e snapshot real | E-mail/WhatsApp externos não habilitados; alternativa operacional é aqui no site. |
| 9 — evento duplicado/reordenado | Testes de operações/HMAC e CAS; inbox real | Webhook externo é adaptador desativado; no inbox selecionado, abertura/claim reais geram os eventos. |
| 10 — contexto para a equipe | Inbox real: login, abrir, assumir, responder e reload entre visitante/equipe | Prova de integração, não compromisso de atendimento por uma pessoa em plantão. |

## Gates de lançamento

| Gate | Estado comprovado |
|---|---|
| Nenhum P0 aberto sem exceção registrada | **Pendente:** H11/aceites de responsável não registrados. Não inventar exceção. |
| Sem placeholders, links quebrados, segredos ou falso envio | Auditorias de rotas/assets/bundle e encaminhamento real passaram nos escopos registrados. Isso não aprova alegações editoriais. |
| Baseline aprovado em quatro larguras + Safari/iOS e Chrome/Android físicos | **Parcial:** quatro larguras têm comparação/smokes em Chromium. Aprovação visual e aparelhos físicos não comprovados. |
| Conversas/demos privadas fora da indexação | Shells públicos anônimos, autorização de sessão, noindex nas rotas privadas e gate de staging verificados. |
| Recuperação e isolamento | Provas reais de store/reload/rollback/inbox mais testes de autorização. |
| Logs, alertas, fila e suporte monitorados | **Não comprovado integralmente:** `/healthz`, logs de inicialização/retenção e inbox existem. Não há evidência de responsável que aceitou monitorar, recebimento de alerta, cobertura da fila ou procedimento fora do horário aprovado. |
| Rollback exercitado com responsável identificado | Reversão real de staging passou e preservou conversa; plano de corte permanece no upstream antigo. Responsável de operação/aceite final ainda precisa confirmação. |

## O que permite encerrar o objetivo

1. Registrar o aceite visual/editorial e as decisões dos responsáveis, incluindo a adaptação de atendimento para o inbox do próprio site.
2. Comprovar os testes em aparelhos físicos exigidos ou registrar uma exceção explícita do responsável.
3. Confirmar quem assume fila, suporte, monitoração/alertas, procedimento fora do horário e rollback; exercitar a operação correspondente. Disponibilidade do endpoint não comprova monitoramento humano.
4. Registrar a decisão de política/ativação para H14, mantendo a coleta desligada enquanto ela faltar.
5. Obter autorização explícita antes de qualquer instalação/corte de produção. Ausência de resposta não é autorização.

Uma aprovação genérica dos testes não preenche automaticamente esses campos. O candidato r2 continua congelado; nenhuma dessas pendências autoriza deploy do painel, alteração de building blocks ou migração global de marca.
