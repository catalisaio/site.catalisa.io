# Redesign do site Catalisa

**PUBLICADO — 27/10/2026, `20261027-hero-clarity`:** heros diretos em 20 entradas comerciais nos sete idiomas, com descrição concreta da entrega e próximos passos claros. Home, produtos, Banking, Credit, Studio, Workflows, Agentes, capacidades, arquitetura, integrações, governança, soluções, Contato e Lab foram revisados. [Revisão editorial](qa/hero-clarity/review.json), [560 combinações responsivas](qa/hero-clarity/browser.json) e [publicação comprovada](qa/release/hero-clarity-production-published.json): 140 aberturas públicas, 49 rotas HTTPS e 28 verificações de navegador passaram. API/configuração comercial preservadas; blue18182 ativo e green18183 anterior mantido para rollback. Esta entrada substitui o estado atual das revisões abaixo, que conservam o histórico.

**Análise comercial do CCP preservada:** [Flexible credit orchestration para comunicar e vender o CCP](analise-flexible-credit-orchestration.md) reúne conceito, demanda, números e fontes, concorrência, compradores, opções de hero/CTA, propostas para site, documentação e SEO, evidências técnicas e decisões pendentes. A análise aguarda validação do usuário; nenhuma proposta de comunicação foi aplicada. Este é o ponto permanente de retomada, substituindo os arquivos temporários perdidos no reinício.

**Estado atual — 26/10/2026 BRT (27/10 UTC):** produção permanece em `20261027-ga-realtime`, green18183; blue18182 anterior preservado para rollback. Google Analytics **Catalisa.io → Catalisa → Catalisa Site, `G-JYJWH17ZVX`** confirmado no [Realtime autenticado](qa/seo-detailed/recovery-ga-realtime-confirmed.json), após [consentimento e navegação reais](qa/seo-detailed/ga-production-consent-session.json). [Clarity autenticado](qa/seo-detailed/recovery-clarity-confirmed.json): produção `z4073yqv5z` mostra3 sessões, Dashboard e Heatmaps habilitados; staging `z40bi9hrk8` separado, habilitado e sem sessões no painel. O mapa Banking inspecionado ainda não tem cliques/rolagem. Os seis produtos continuam sem collapse; a análise comercial do CCP não foi aplicada. [Publicação vigente](qa/release/ga-realtime-production-published.json), [auditoria completa atual](qa/release/completion-audit-current.json) e [estado atual](qa/release/current-status.json).

**Próxima revisão validada somente em staging — `20261027-language-hints-r3`:** https://site-staging.catalisa.io corrige a referência acessível do seletor de idioma e os pré-carregamentos de módulos antigos, incluindo a identificação de módulos homônimos pelos exports públicos. Conteúdo, imagens, SEO, backend e comportamento de sessão preservados. [Aceite técnico](qa/release/language-hints-r3-staging-acceptance.json):49 rotas HTTPS,28 smokes de interface,12 checks de idioma nas quatro larguras e operação verificada; public/server preparados são idênticos entre stage/prod. [Comparação controlada do Contato](qa/loading-diagnosis/contact-hint-overlay.json): três amostras por variante indicaram medianaLCP4,84s→3,216s; isso não é garantia de ganho em produção. [Medição atual no HTTPS de staging](qa/loading-diagnosis/r3-staging-timeline.json) ainda apresentou variação e amostras acima2,5s. Publicação destas correções não autorizada. Aparelhos físicos e responsabilidades operacionais permanecem sem confirmação. As entradas seguintes preservam o histórico.

**PUBLICADO — 26/10/2026, `20261026-products-exhibition`:** [Produtos](https://catalisa.io/produtos) e os detalhes estão no ar, nos sete idiomas, com CBP/CCP em destaque e quatro soluções no capítulo “Além do financeiro”. Recrutamento foi retirado da vitrine, Home, menus, Ecossistema, mapa e SEO; seus sete endereços antigos redirecionam para Produtos. Idioma automático, novas imagens e retirada de Composições do menu também estão publicados. [Aceite desta publicação](qa/release/exhibition-production-published.json): 49 rotas HTTPS e 28 checks reais de browser em produção passaram. Contato e Lab passaram novamente com IA real na versão publicada (21.981s e 23.014s); dados fictícios e cookies foram limpos, sem encaminhamentos ou mensagens externas. Staging e produção têm os mesmos bytes; green18183 ativo, produção anterior18182 preservada para rollback. Sem deploy de painel/building blocks. O preview local continua ativo. As entradas abaixo são históricas; consulte o [estado atual](qa/release/current-status.json).

**Revisão visual local — Produtos, 26/10/2026:** [preview contínuo](http://localhost:5175/produtos), com CBP/CCP como plataformas financeiras centrais e cinco soluções em um capítulo separado “Além do financeiro”. Imagens, cores, composições próprias e detalhes com hero forte, resumo curto e aprofundamento opcional substituem a lista anterior. Os cinco sites verificados continuam acessíveis; CBP/CCP oferecem Contato como ação principal. [Estado da revisão](qa/products-exhibition/review-status.json): 104 testes e 46 cenários reais de browser passaram, nos sete idiomas da vitrine e quatro larguras. Esta composição aguarda avaliação visual conjunta: **não está no staging nem em produção**. Os pacotes citados abaixo preservam a composição anterior e não têm aceite visual.

**Candidato validado em staging — 26/10/2026, `20261026-products-language`:** [Produtos](https://site-staging.catalisa.io/produtos) reúne sete produtos e cinco vitrines públicas verificadas, nos sete idiomas. O pacote também remove Composições do menu, seleciona o idioma pela preferência do browser/sistema (fallback inglês, escolha manual persistente) e substitui o filme da Home por imagens existentes do material master. [Aceite completo](qa/release/products-language-staging-acceptance.json): 234 testes, 92 checks do artefato, 49 rotas HTTPS, 22 checks visuais em staging, 14 cenários reais de idioma e medição de cliques passaram. Produção continua em `20261026-multilingual`; o novo pacote está preparado e aguarda autorização após apresentação do staging, conforme AGENTS.md. Backend idêntico, sem mudanças no painel/building blocks. CAPTCHA ainda não ativado. Preview contínuo: http://localhost:5175/produtos.

As entradas abaixo preservam o histórico das revisões; o [estado atual](qa/release/current-status.json) separa produção publicada e próximo candidato.

**PUBLICADO em produção — 26/10/2026, `20261026-multilingual`:** https://catalisa.io já usa o site novo com português, inglês, alemão, espanhol, dinamarquês, neerlandês e francês. Publicação explicitamente autorizada pelo usuário após o staging; pacote público e servidor idênticos. [HTTP público:7idiomas/42rotas](qa/release/public-locales-production.json), [JS público:15checks](qa/release/production-browser-live.json), [IA real nos7idiomas](qa/integrations/site-locales-real-20261026T192144371Z-b16f36f6.json) e [correção linguística francesa confirmada](qa/integrations/site-locales-real-20261026T192716879Z-7630631d.json). Build678snapshots,191testes,SEO677páginas sem erros,92checks no artefato. Rollback original preservado; sem deploy do painel/building blocks. [Estado atual completo](qa/release/current-status.json). A melhoria urgente de latência/tokens/custo de Contato e Lab permanece no TODO pós-publicação solicitado.

**Preview local — seletor de idioma integrado em 26/10/2026:** o cabeçalho agora mostra PT/EN/DE/ES/DA/NL em http://localhost:5175/. [Verificação real no browser](qa/localization/language-picker/verification.json): quatro larguras (320/390/768/1440), seis trocas efetivas, permanência na página equivalente, teclado/Escape, fechamento externo e geometria estável. Nove testes unitários passaram. Esta verificação cobre o seletor; a revisão completa de traduções/SEO e das mídias continua pendente. Sem deploy desta alteração.

**Validação funcional atual — 26/10/2026, revisão `20261026-concept-null`:** disponível para teste manual em https://site-staging.catalisa.io, sem senha de entrada. [Aceite técnico desta revisão](qa/release/acceptance-concept-null.json): Contato real nos três cenários (16,933s / 13,950s / 14,927s), refinamento, Lab real (17,108s) com reload e continuidade, encaminhamento direto (4,941s), inbox autenticado, HTTPS e bytes exatos passaram. A [recuperação de resposta perdida](qa/release/network-response-replay.json) passou com o recibo real e zero novas gerações. O servidor normaliza somente o sentinela terminal `"null"` emitido como texto; referências desconhecidas continuam bloqueadas. Produção permanece sem publicação. SEO/analytics estão em revisão local e não integram essa versão funcional do staging.

**Correção de medição:** os tempos antigos do Lab (52,885s, 59,949s e a primeira medição de51,031s) incluíam cerca de30s de espera por um elemento de erro inexistente no próprio verificador. Não representam latência pura de geração e não devem servir de comparação de desempenho. A medição corrigida atual é17,108s.


**TODO urgente após a publicação, solicitado em 26/10:** [reduzir a latência, medir e diminuir tokens/custo da geração no Contato e no Lab](TODO-pos-publicacao.md). Adiado explicitamente para depois do site no ar; não confundir consumo suspeito com medição já realizada.

**Recuperação validada em 26/10/2026 — revisão `20261026-ai-recovery`:** o smoke real reproduziu o HTTP500 relatado pelo usuário. A API de staging não conseguia ler a configuração cifrada da credencial Anthropic conectada. Foi alterado somente o agente exclusivo do site para a credencial OpenAI já existente e legível da mesma conta, com prompt validado; ID do agente, cookies e conversas preservados. [Contato na mesma sessão que falhou](qa/contact-recovery-real-staging/verification.json) passou: geração 19,853s, revisão já existente 42ms, refinamento 14,840s, reload e quatro larguras. [Lab real](qa/lab-real-staging/verification.json) passou em 52,885s, com tela, reload e continuidade no Contato. [Aceite da recuperação](qa/release/acceptance-ai-recovery.json). A política PT/EN passou a descrever o provedor configurado entre os fornecedores listados. Build/257 snapshots/SEO/41 checks de navegador e TypeScript passaram. Produção, painel e building blocks não foram publicados/alterados; a checagem atual do agente de produção foi apenas de metadados e confirmou configuração legível. As evidências r2 abaixo são históricas. Os aceites humanos continuam pendentes.

Conferência de operação da revisão atual: [API/Caddy sem reinícios ou OOM e ciclo de retenção concluído](qa/release/staging-ops-status.json), com containers iniciados em26/10 às14:52 UTC. O [HTTP público sem senha](qa/release/staging-http-public.json) passou; a equipe mantém autenticação própria. A rodada histórica r2 de29h não é uptime desta revisão. Essa inspeção não é monitor recorrente, recebimento de alerta ou responsabilidade humana aceita.

**Acesso atualizado em 25/10/2026:** por pedido explícito do usuário, a senha de entrada do staging foi removida. Abra **https://site-staging.catalisa.io/** diretamente. HTTPS, noindex/no-store e autenticação própria da equipe foram preservados; [smoke HTTP sem senha](qa/release/staging-http-public.json) passou. O candidato r2 e a produção não foram alterados. Referências a BasicAuth abaixo descrevem a validação anterior.

Este é o ponto de continuidade do redesign em `site.catalisa.io`. O conjunto reúne as 72 inspirações, suas análises individuais, a identidade transitória aprovada e o relatório em que essa linguagem começou a ser aplicada. O protótipo v1.1 fornecido pelo usuário agora orienta o novo site; a reconciliação e a implementação estão em andamento.

## Continuidade com o protótipo v1.1

**Correção de marca em 23/10/2026:** o usuário esclareceu que o ZIP já contém a identidade nova, inclusive os logos. A regra anterior de substituir esses arquivos pela assinatura antiga está superada para o redesign. O press kit local usa os recursos fornecidos. A aplicação geral da identidade aos demais produtos e materiais fica para o futuro, conforme pedido explícito; não houve essa migração. O relatório e as decisões antigas abaixo permanecem como histórico, não como veto à nova identidade. Ver decisão D15 na análise do merge.

O ZIP fornecido pelo usuário foi preservado e extraído em [novos-insumos/catalisa-handoff-v1.1](novos-insumos/catalisa-handoff-v1.1/README.md), com [manifesto de recebimento](novos-insumos/recebimento-handoff.json). O protótipo orienta conteúdo, navegação e composição do novo site. Consultar agora:

- [Análise do merge e decisões](analise-merge-handoff.md), incluindo os conflitos de marca e os vínculos com o estudo de agosto e as 72 referências.
- [Styleguide completo](styleguide.md), com tokens, componentes, famílias, estados, acessibilidade e integrações.
- [Implementação, evidências e pendências H01–H16](implementacao.md). O objetivo segue aberto até a implementação e as integrações reais estarem verificadas.
- As 69 rotas do handoff têm implementação nativa. O ZIP e a identidade nova foram preservados; 17 textos existentes de Banking, Credit e Arquitetura receberam os convites a criar produtos próprios e modernizar o legado. [Rastreabilidade editorial](qa/financial-messaging/README.md).
- Contato, Lab e inbox têm evidência real com a conta indicada, persistência compartilhada e e-mail **ou** telefone. [Contato no Node de staging](qa/integrations/contact-node-staging.json): geração 21,636s, revisão estruturada sem IA 1,252s e refinamento 27,516s. [Atendimento no browser](qa/inbox-browser-staging/verification.json): login da equipe, abertura, atribuição, resposta e recuperação. Esses resultados não substituem a repetição da próxima revisão.
- [Recursos exclusivos de produção](qa/integrations/production-resources.json) foram preparados e [testados com dados fictícios](qa/integrations/production-resources-real.json): agente sem ferramentas, IA real 19,817s, store cifrado/CAS e resposta no inbox entre duas instâncias. **Não houve deploy do site em produção, troca de tráfego, deploy do painel ou dos building blocks.**
- [Medição de mercado](qa/market-insights/real-staging.json) passou no ambiente real com política de teste e limpeza dos dados fictícios. A coleta pública continua desligada, `SITE_MARKET_INSIGHTS_ENABLED=0`, aguardando a escolha do usuário. [Curadoria das 39 capacidades](qa/capability-curation/README.md) e [registro editorial de 83 itens](editorial-review-register.json) estão documentados; não há aprovação de responsável presumida.

**Estado em 26/10/2026 UTC:** o site anterior permanece público. O candidato do site novo está em **https://site-staging.catalisa.io**, servido por HTTPS válido e noindex, sem senha de entrada; a revisão instalada é `20261026-ai-recovery`. O [rollback real de staging](qa/release/staging-rollback.json) preservou a conversa/cookie e confirmou o hash público de produção inalterado. O acesso de revisão não exige usuário/senha; `.local/site/staging-https/access.json` registra o modo público.

A revisão `r2` está compilada e instalada: 257 HTMLs, auditoria de 256 URLs sem falhas/avisos, 41 verificações de navegador, 231 testes em 20 arquivos e TypeScript passaram. O [HTTP real de staging](qa/release/staging-http.json) confirmou o ID da release, os bytes exatos da Home, TLS e robots bloqueado. As árvores public/server do candidato preparado para produção são idênticas às revisadas no staging; isso ainda não constitui publicação pública.

O [Contato humano direto real](qa/contact-direct-real-staging/verification.json) passou: visitante sem sessão, nome e somente e-mail, confirmação explícita renovada após reload, um encaminhamento durável para o inbox do owner em 3,952s, zero chamadas de geração e zero jobs de IA. Os defaults têm origem SYSTEM; dados fictícios foram removidos. A tela de aceite foi capturada em 320/390/768/1440px.

[Contato com IA r2](qa/contact-real-staging/verification.json) passou nos três casos: loja 33,942s/revisão 1,921s, clínica 20,843s/revisão já presente 52ms, escola 32,958s/revisão 1,927s. O refinamento mantém catálogo/pedidos no WhatsApp e move somente as notificações para e-mail, com revisão humana. O [Lab final r2](qa/lab-real-staging/verification.json) também passou: conceito de matrícula via WhatsApp com três telas, geração real 59,949s no fluxo de UI, reload e continuidade no Contato preservando o conceito. O [inbox final r2](qa/inbox-browser-staging/verification.json) passou em quatro larguras: login/open/claim/reply/reload, logout 401, limpeza e zero erros de página. A medição final da Home também foi concluída; resultado e limitação estão abaixo. As gerações reais levaram cerca 21–34s no Contato e 60s no Lab nesta rodada, com loading e sem timeout; não se promete latência curta. Os relatórios anteriores continuam como evidência das revisões medidas; o aceite do usuário permanece separado das provas técnicas.

A [medição final da Home r2](qa/home-preload-production-review/verification.json) registrou **LCP 3,032s**, antes 3,272s, e CLS 0,021034. Melhorou, mas continua acima da meta 2,5s; o PASS de DOM não significa performance 100%. Na [rodada mobile anterior das demais rotas](qa/site-quality-production-review/verification.json), seis das sete ficaram abaixo de 2,5s, CLS do Contato 0,000245 e menus 0px. Chunks por rota, mapas puros, fontes 151.520B e preload persistente estão no artefato. São medições de laboratório, sem certificação de Core Web Vitals de campo ou aparelhos físicos.

O [aceite técnico-funcional consolidado r2](qa/release/acceptance-r2.json) e o [estado atual](qa/release/current-status.json) registram provas, hashes idênticos stage/prod preparado e produção pública intacta. **Pendências de decisão:** aceite visual/editorial do candidato e textos, autorização explícita antes da publicação e escolha do usuário antes de ativar H14. A coleta continua desligada; nenhum limite medido foi convertido em aprovação presumida.

Preview local contínuo: **http://localhost:5175/**, com HMR e aplicação nova independente; mantê-lo ativo. O [controle H01–H16](implementacao.md#h01h16) e o [procedimento operacional](producao-operacao.md) separam provas, pendências e autorização. O corte público continua exigindo apresentação do resultado validado e autorização explícita do usuário, conforme `AGENTS.md`. As alternativas do hero principal não foram escolhidas; a identidade dos outros produtos segue como trabalho futuro, não executado.

A [auditoria integral da r2](qa/release/completion-audit-r2.md) confere os 16 itens, os dez testes críticos e cada gate do handoff. A conclusão integral permanece sem comprovação: além do aceite editorial/visual, faltam evidência em Safari/iOS e Chrome/Android físicos e confirmação de responsabilidade/cobertura de monitoramento, alertas, fila e rollback. Os pacotes preparados têm todos os hashes conferidos e os [39 links públicos de documentação](qa/capability-curation/public-doc-links.json) responderam corretamente; isso não substitui essas condições. O `passed` funcional não deve ser apresentado como aprovação de lançamento.

Desde 22/10/2026, **o repositório do site é o responsável pela evolução deste material**. As cópias existentes em `wpp.bb.catalisa.io` ficam como registro histórico; não são necessárias para ler as páginas ou regenerar a apresentação a partir dos dados congelados desta pasta.

## Comece por aqui

1. [Análise das inspirações e aplicação ao site](analise-inspiracoes.md): síntese, relações entre referências, escolhas e adaptação para o redesign.
2. [Caderno visual das 72 referências](design/entregas-bauhaus/referencias.html): miniaturas, observação, aplicação, conexão e decisão por arquivo.
3. [Catálogo completo em Markdown](catalogo-inspiracoes.md): as mesmas anotações com links para todos os originais.
4. [Direção visual consolidada](design/entregas-bauhaus/direcao.html) e [registro da identidade aprovada](design/entregas-bauhaus/identidade-transitoria.json).
5. [Infográfico do relatório](reports/2026-10-20-retrospectiva-24-meses/infografico.html): primeira aplicação da linguagem. [PDF](reports/2026-10-20-retrospectiva-24-meses/infografico.pdf).
6. [Mapa do material do relatório](material-do-relatorio.md): páginas, fontes, dados, scripts e o que aproveitar no site.
7. [Roteiro de continuidade](continuidade.md): como combinar os novos insumos e seguir para o redesign.

## O que está aprovado

O registro de 21/10/2026 aprova a identidade transitória aplicada às páginas e PDFs do relatório: roxo `#734B9C`, amarelo `#FDC234`, laranja complementar `#FE8342`, papel `#F4F0E8`, tinta `#171320`, Inter e a assinatura oficial **Catalisa. em roxo com ponto amarelo**. A aprovação e a correção explícita do logotipo estão preservadas no JSON da identidade.

Essa aprovação fornece a base da identidade. O protótipo N01 define agora o desenho da Home, a navegação, as 69 rotas, o conteúdo e o sistema de interação de referência. Sua migração para o site real e as integrações seguem o [controle de implementação](implementacao.md). A identidade nova do ZIP prevalece para o site, conforme a correção de 23/10 no `AGENTS.md`; os registros de identidade anterior abaixo são históricos. O arquivo `Proposta GEMINI (NAO APROVADA AINDA).pdf` continua sendo um insumo não aprovado.

## Estrutura

```text
redesign-2026-10-22/
├── README.md
├── AGENTS.md
├── analise-inspiracoes.md
├── catalogo-inspiracoes.md
├── material-do-relatorio.md
├── continuidade.md
├── proveniencia.json
├── verificar-acervo.py
├── verificacao-transferencia.json
├── manifesto-transferencia-sha256.json
├── design/entregas-bauhaus/
│   ├── referencias.json / referencias.html
│   ├── direcao.html
│   ├── identidade-transitoria.json / identidade-transitoria.css
│   ├── logo-full-color.svg
│   ├── infografico-inter-*.ttf
│   ├── caderno.py
│   └── miniaturas/
├── inspiracoes/
│   ├── originais/                  # 72 arquivos principais e recursos do HTML salvo
│   └── apoio/                      # montagens e leituras antes mantidas em /tmp
├── reports/2026-10-20-retrospectiva-24-meses/
│   └── páginas, PDFs, dados, CSS, JS, fontes, scripts, verificações e hosting histórico
└── novos-insumos/
    └── README.md
```

## Consulta e regeneração

As páginas HTML do relatório e o caderno de referências podem ser abertos diretamente. O relatório contém fontes locais e seus scripts de apresentação; os links de evidência no GitHub continuam sujeitos ao acesso aos repositórios de origem.

Na raiz do repositório:

```bash
# Regenerar o caderno visual com suas imagens originais locais.
python3 docs/redesign-2026-10-22/design/entregas-bauhaus/caderno.py

# Regenerar as páginas do relatório a partir do corpus já congelado.
node docs/redesign-2026-10-22/reports/2026-10-20-retrospectiva-24-meses/gerar.mjs

# Conferir integridade, cobertura das referências e vínculos locais da transferência.
python3 docs/redesign-2026-10-22/verificar-acervo.py
```

O caderno usa Pillow. A geração HTML do relatório usa Node.js e seus módulos locais. Os verificadores históricos de navegador e a exportação de PDFs exigem Playwright, Chrome e ferramentas de PDF, conforme seus próprios scripts. A transferência não instala dependências nem executa publicação.

Recolher novamente os repositórios é uma operação distinta de regenerar a apresentação. Os coletores históricos mantêm dependências dos projetos e do corpus original; consulte [Material do relatório](material-do-relatorio.md#coleta-e-renderizacao-sao-operacoes-diferentes) antes de utilizá-los.

## Origem e integridade

- O estudo veio de `wpp.bb.catalisa.io/docs/design/entregas-bauhaus`.
- O relatório veio de `wpp.bb.catalisa.io/docs/reports/2026-10-20-retrospectiva-24-meses`.
- Os originais foram movidos de `~/Downloads/Inspiracoes` para `inspiracoes/originais`. O endereço antigo permanece como link simbólico para a nova localização.
- Os apoios `inspiracoes*` de `/tmp` foram movidos para `inspiracoes/apoio`.
- [proveniencia.json](proveniencia.json) registra origem, destino, tamanho e SHA-256 de cada arquivo transferido, incluindo as adaptações de portabilidade.
- O ZIP e os manifestos dentro do relatório são a entrega histórica de 21/10. O manifesto de transferência desta pasta registra a organização atual; são registros com finalidades diferentes.

O corpus técnico permanece no corte de **20/10/2026**. Sua data não se atualiza por ter mudado de repositório. Contagens de PRs, diretórios, frentes e arquivos de teste precisam conservar suas definições quando forem usadas como conteúdo do site.

## Relação com o trabalho anterior do site

O estudo [docs/site-v2](../site-v2/README.md), iniciado em agosto, foi preservado no lugar. Ele contém descoberta, argumentos da FICO, direções de conteúdo, propostas de navegação e protótipos. É um insumo para combinar com este acervo, não uma especificação automaticamente substituída pela identidade do relatório.

As alterações já existentes no código e os outros arquivos de trabalho do repositório continuam independentes deste pacote.
