# Preparação de staging e produção

**Estado atual — 26/10/2026 BRT (27/10 UTC):** produção `20261027-ga-realtime` em green18183, rollback blue18182; Google Analytics confirmado no teste por coletor real e [Realtime autenticado](qa/seo-detailed/recovery-ga-realtime-confirmed.json). [Leitura autenticada do Clarity](qa/seo-detailed/recovery-clarity-confirmed.json): produção e staging têm Dashboard/Heatmaps habilitados; produção tinha3 sessões no filtro observado e o mapa Banking estava vazio. Staging atual `20261027-language-hints-r3`, com referência ARIA e pré-carregamentos corretos, incluindo módulos homônimos identificados pelos exports; [tecnicamente validado](qa/release/language-hints-r3-staging-acceptance.json). A publicação destas correções ainda não está autorizada. Pacote de produção apenas preparado, public/server idênticos ao staging e backend sem mudanças. Painel, building blocks e comunicação do CCP intactos. [Auditoria de conclusão](qa/release/completion-audit-current.json). As entradas abaixo são históricas.

Para repetir somente a inspeção operacional do site, sem imprimir env, logs brutos ou conversas:

```sh
ssh -o BatchMode=yes -o ConnectTimeout=12 root@177.104.184.34 'pct exec 154 -- python3 - --target production --slot green --release 20261027-ga-realtime' < scripts/site-ops-status.py
ssh -o BatchMode=yes -o ConnectTimeout=12 root@177.104.184.34 'pct exec 154 -- python3 - --target staging --release 20261027-language-hints-r3' < scripts/site-ops-status.py
```

O probe confere manifest/slot, os dois containers exclusivos, reinícios/OOM, readiness, sessão anônima401 e conclusão recente de retenção. Ele não instala monitor recorrente, envia alertas ou presume responsabilidade humana; as confirmações de operação e de aparelhos físicos foram solicitadas ao usuário.

**PUBLICADO — 26/10/2026, `20261026-products-exhibition`:** [Produtos](https://catalisa.io/produtos) e os detalhes estão no ar, nos sete idiomas, com CBP/CCP em destaque e quatro soluções no capítulo “Além do financeiro”. Recrutamento foi retirado da vitrine, Home, menus, Ecossistema, mapa e SEO; seus sete endereços antigos redirecionam para Produtos. Idioma automático, novas imagens e retirada de Composições do menu também estão publicados. [Aceite desta publicação](qa/release/exhibition-production-published.json): 49 rotas HTTPS e 28 checks reais de browser em produção passaram. Contato e Lab passaram novamente com IA real na versão publicada (21.981s e 23.014s); dados fictícios e cookies foram limpos, sem encaminhamentos ou mensagens externas. Staging e produção têm os mesmos bytes; green18183 ativo, produção anterior18182 preservada para rollback. Sem deploy de painel/building blocks. O preview local continua ativo. As entradas abaixo são históricas; consulte o [estado atual](qa/release/current-status.json).

**PUBLICADO em produção — 26/10/2026, `20261026-multilingual`:** https://catalisa.io já usa o site novo com português, inglês, alemão, espanhol, dinamarquês, neerlandês e francês. Publicação explicitamente autorizada pelo usuário após o staging; pacote público e servidor idênticos. [HTTP público:7idiomas/42rotas](qa/release/public-locales-production.json), [JS público:15checks](qa/release/production-browser-live.json), [IA real nos7idiomas](qa/integrations/site-locales-real-20261026T192144371Z-b16f36f6.json) e [correção linguística francesa confirmada](qa/integrations/site-locales-real-20261026T192716879Z-7630631d.json). Build678snapshots,191testes,SEO677páginas sem erros,92checks no artefato. Rollback original preservado; sem deploy do painel/building blocks. [Estado atual completo](qa/release/current-status.json). A melhoria urgente de latência/tokens/custo de Contato e Lab permanece no TODO pós-publicação solicitado.

**Validação funcional atual — 26/10/2026, revisão `20261026-concept-null`:** disponível para teste manual em https://site-staging.catalisa.io, sem senha de entrada. [Aceite técnico desta revisão](qa/release/acceptance-concept-null.json): Contato real nos três cenários (16,933s / 13,950s / 14,927s), refinamento, Lab real (17,108s) com reload e continuidade, encaminhamento direto (4,941s), inbox autenticado, HTTPS e bytes exatos passaram. A [recuperação de resposta perdida](qa/release/network-response-replay.json) passou com o recibo real e zero novas gerações. O servidor normaliza somente o sentinela terminal `"null"` emitido como texto; referências desconhecidas continuam bloqueadas. Produção permanece sem publicação. SEO/analytics estão em revisão local e não integram essa versão funcional do staging.

**Correção de medição:** os tempos antigos do Lab (52,885s, 59,949s e a primeira medição de51,031s) incluíam cerca de30s de espera por um elemento de erro inexistente no próprio verificador. Não representam latência pura de geração e não devem servir de comparação de desempenho. A medição corrigida atual é17,108s.


**Recuperação validada em 26/10/2026 — revisão `20261026-ai-recovery`:** o smoke real reproduziu o HTTP500 relatado pelo usuário. A API de staging não conseguia ler a configuração cifrada da credencial Anthropic conectada. Foi alterado somente o agente exclusivo do site para a credencial OpenAI já existente e legível da mesma conta, com prompt validado; ID do agente, cookies e conversas preservados. [Contato na mesma sessão que falhou](qa/contact-recovery-real-staging/verification.json) passou: geração 19,853s, revisão já existente 42ms, refinamento 14,840s, reload e quatro larguras. [Lab real](qa/lab-real-staging/verification.json) passou em 52,885s, com tela, reload e continuidade no Contato. [Aceite da recuperação](qa/release/acceptance-ai-recovery.json). A política PT/EN passou a descrever o provedor configurado entre os fornecedores listados. Build/257 snapshots/SEO/41 checks de navegador e TypeScript passaram. Produção, painel e building blocks não foram publicados/alterados; a checagem atual do agente de produção foi apenas de metadados e confirmou configuração legível. As evidências r2 abaixo são históricas. Os aceites humanos continuam pendentes.

**Acesso atualizado em 25/10/2026:** por pedido explícito do usuário, a senha de entrada do staging foi removida. Abra **https://site-staging.catalisa.io/** diretamente. HTTPS, noindex/no-store e autenticação própria da equipe foram preservados; [smoke HTTP sem senha](qa/release/staging-http-public.json) passou. O candidato r2 e a produção não foram alterados. Referências a BasicAuth abaixo descrevem a validação anterior.

A [auditoria de conclusão da r2](qa/release/completion-audit-r2.md) mantém os gates originais separados dos smokes funcionais. Antes do lançamento, confirmar responsável/cobertura para monitoramento, recebimento de alertas, fila, suporte fora do horário e rollback. Há logs de inicialização/retenção, endpoint de saúde e inbox funcional; não há evidência de alerta recebido ou responsabilidade operacional aceita. Safari/iOS e Chrome/Android físicos continuam sem prova. Nenhum desses gates é preenchido por autorização de teste técnico.

Atualizado em 26/10/2026 UTC. **Staging atual: `20261026-ai-recovery`, HTTPS/noindex, sem senha de entrada, em `https://site-staging.catalisa.io`. Site público anterior preservado; nenhum deploy de website em produção.** Recursos exclusivos de produção foram preparados e testados pela API, sem publicação ou troca de tráfego. A revisão `r2` foi compilada e instalada; Contato direto anônimo sem IA e HTTP real passaram. Os três casos reais do Contato com IA passaram; Lab e inbox finais passaram; a medição final da Home concluiu LCP 3,032s/CLS 0,021034, acima da meta 2,5s de LCP. O [aceite técnico consolidado](qa/release/acceptance-r2.json) registra esse limite e as provas atuais. Produção depende de apresentar o resultado e obter autorização explícita do usuário, conforme `AGENTS.md`.

Provas atuais e seu alcance:

| Evidência | Resultado comprovado | Limite |
|---|---|---|
| [HTTPS real atual](qa/release/staging-http-public.json) | ID da release e bytes exatos da Home, TLS, acesso sem senha, robots bloqueado, noindex/no-store, redirects/query/404 e BFF | A autenticação da equipe continua independente; aprovação humana permanece separada |
| [Contato direto real r2](qa/contact-direct-real-staging/verification.json) | Nome/e-mail somente, nova confirmação após reload, defaults SYSTEM, inbox do owner; 3,952s, zero chamadas/jobs IA e limpeza | Aceite capturado em 320/390/768/1440px; IA/Lab/inbox finais têm rodadas próprias |
| [Contato IA final r2](qa/contact-real-staging/verification.json) | Loja 33,942s, clínica 20,843s, escola 32,958s; revisão/reload e refinamento semântico passaram | Não é garantia de latência; os demais fluxos finais também passaram, com limites registrados |
| [Contato Node real anterior](qa/integrations/contact-node-staging.json) | Geração 21,636s, revisão estruturada sem IA 1,252s, refinamento 27,516s | Rodada de browser r2 posterior passou; falha anterior preservada em verification-before-node-fixes.json |
| [Lab real final r2](qa/lab-real-staging/verification.json) | Matrícula via WhatsApp, três telas, geração 59,949s incluindo UI, reload e continuação com mesmo conceito | Sem timeout nesta rodada; não é latência curta garantida |
| [Inbox browser final r2](qa/inbox-browser-staging/verification.json) | Login/open/claim/reply/reload, quatro larguras, logout 401, limpeza e zero pageerrors | Atendimento aqui no site; não foi envio por e-mail/WhatsApp |
| [Recursos próprios de produção](qa/integrations/production-resources.json) e [duas instâncias reais](qa/integrations/production-resources-real.json) | Agente sem ferramentas, token, três coleções cifradas, CAS/dedup, IA 19,817s e resposta no inbox | Sem website em produção, sem tráfego trocado, sem envio externo; dados fictícios removidos |
| [Rollback real de staging](qa/release/staging-rollback.json) | Conversa/cookie preservados em rollback/restauração; hash público idêntico antes/depois | Não foi um corte/rollback de produção |
| [Mercado em staging real](qa/market-insights/real-staging.json) | Cinco sessões, 17 eventos/dez tipos, recuperação, CAS/erase/k5 e limpeza; nenhuma 429 com ritmo controlado | Política era teste; coleta pública flag 0 e escolha do usuário pendente |
| [Home final r2](qa/home-preload-production-review/verification.json) | LCP 3,032s, antes 3,272s; CLS 0,021034; DOM passou | Meta2,5s não atingida; sem alegação de performance 100%, CWV de campo ou teste físico |
| [Demais métricas anteriores](qa/site-quality-production-review/verification.json) | Outras seis rotas abaixo de 2,5s; CLS Contato 0,000245; menus 0px | Rodada laboratorial anterior; não é certificação CWV/WCAG |

Árvore r2: 231 testes em 20 arquivos e TypeScript passaram; build 257 HTMLs, auditoria 256 URLs sem falhas/avisos e 41 checks de navegador. Fontes 151.520B, chunks por rota/mapas puros e preload persistente da Home estão no artefato. Todos os browsers funcionais finais de Contato IA/direto, Lab e inbox passaram. A medição final da Home também terminou: LCP 3,032s, acima da meta 2,5s; PASS de DOM não significa performance 100%. [H11: 39 capacidades](qa/capability-curation/README.md) e [H16: 83 itens](editorial-review-register.json) têm rastreabilidade, sem inventar responsável ou decisão editorial. Nenhuma escolha pendente do usuário foi inferida como aprovação.

## Hosting confirmado

### Conferência operacional em 26/10/2026

O [probe operacional real](qa/release/staging-ops-status.json) confirmou API e Caddy em execução há cerca de 29 horas, zero reinícios e nenhum OOM registrado. Foram observados 29 eventos de ciclo de retenção concluído; o último estava dentro da janela de duas horas, sem evento de falha posterior. Um ciclo concluído é trabalho limitado por lote/orçamento e não comprova a eliminação de todas as linhas expiradas.

Para repetir a inspeção sem imprimir env, tokens, logs brutos ou conteúdo de conversas:

```sh
ssh -o BatchMode=yes -o ConnectTimeout=15 root@177.104.184.34 'pct exec 154 -- python3 - 20261026-ai-recovery' < scripts/site-staging-ops-status.py
SITE_SMOKE_RELEASE=20261026-ai-recovery SITE_SMOKE_DIST=.local/site/releases/staging-20261026-ai-recovery/public node scripts/verify-site-staging-http.mjs
```

O probe devolve JSON e código de saída diferente de zero quando detecta serviço parado/OOM, falha de readiness, ausência de conclusão recente da retenção ou falha de retenção mais recente. Ele não cria monitor recorrente, não envia alertas e não representa responsabilidade humana aceita. Destino/recebimento de alertas, cobertura da fila, comportamento fora do horário e responsável por rollback continuam pendentes.

O site público **saiu do Netlify**. `.netlify/state.json` e `netlify.toml` são vestígios da configuração anterior; não demonstram onde o domínio publica hoje. A configuração lida no próprio servidor identifica o site como “ex-Netlify”.

| Componente | Estado observado por leitura |
|---|---|
| Público | `https://catalisa.io` HTTP200, IP `177.104.184.38`; `www.catalisa.io` compartilha router |
| Edge | SSH `root@177.104.184.34`, CT105, Traefik `catalisa-io-site@file`, arquivo `/opt/traefik/config/dynamic/catalisa-io.yml` |
| Serviço | `catalisa-io-svc@file` → `http://172.10.0.202:8081`, UP |
| Hosting | Mesmo nó, CT154 `marketing-prod-01`, IP `172.10.0.202` |
| Container atual | `catalisa-site`, imagem `caddy:2-alpine`, porta `8081:80` |
| Arquivos atuais | `/opt/apps/catalisa/Caddyfile`, `/opt/apps/catalisa/docker-compose.yml`, `/opt/apps/catalisa/dist` |
| Runtime do candidato | Docker Compose v5.1.3; Node22 e dependências do bundle instalados/verificados no staging isolado |
| Staging do site | `site-staging.catalisa.io` criado exclusivamente para revisão; HTTPS válido, noindex e acesso sem senha por pedido do usuário |
| Acesso | SSH de leitura funciona. GitHub keyring funciona fora sandbox, repositório `catalisaio/site.catalisa.io`, branch padrão `master` |

Não falta autenticação Netlify para esse caminho. GitHub não expõe deploy de hosting configurado nos metadados consultados; secrets listados apenas `E2E_TEST_EMAIL` e `E2E_TEST_PASSWORD`. Nenhum segredo foi lido ou registrado neste documento. Não executar scripts `deploy-painel*` ou modificar outros containers do CT154.

## Artefato e servidor

O BFF privado está em `server/site/standalone.ts`. Usa `siteRuntime(env,false)`, body até16KiB, bind loopback por padrão, porta8096 e IP de visitante aceito somente de proxies explicitamente confiáveis. O template Caddy sobrescreve `X-Real-IP`; BFF e Caddy compartilham namespace de rede, comunicando por loopback sem publicar porta da API. `/healthz` significa runtime inicializado; não comprova uma inferência nem entrega externa. A retenção Catalisa roda ao iniciar e de hora em hora com orçamento24s, sem conteúdo sensível em logs.

`scripts/build-site-server.mjs` empacota código/JSON e escreve um package.json só com dependências de runtime. Gerar lock antes de preparar o candidato. `scripts/site-release-prepare.mjs` exige o artefato novo, include Caddy gerado por SEO, lock e bundle; escreve checksums SHA256, Caddyfile, Dockerfile e Compose. Recusa sobrescrever release existente. Não contém credenciais.

Executar os trabalhos pesados sequencialmente, preservando o preview local:

```sh
npx tsc -b
VITE_SITE_RELEASE=redesign CONTEXT=deploy-preview npx vite build --emptyOutDir --outDir /tmp/catalisa-site-staging
VITE_SITE_RELEASE=redesign CONTEXT=deploy-preview SITE_DIST_DIR=/tmp/catalisa-site-staging npm run postbuild
node scripts/build-site-server.mjs
npm install --package-lock-only --ignore-scripts --prefix .local/site/server-dist
node scripts/site-release-preflight.mjs --target=staging --dist=/tmp/catalisa-site-staging --env-file=.local/site/staging-runtime.env
node scripts/site-release-prepare.mjs --target=staging --id=RELEASE_ID --dist=/tmp/catalisa-site-staging
```

O arquivo privado `staging-runtime.env` deve conter as configurações do site, sem copiar o ambiente de painel ou dos building blocks. O preflight só publica nomes de chaves ausentes/invalidas, nunca valores. Exige `SITE_STORE=catalisa`, coleção específica, origin/token/owner/agente Catalisa, `SITE_SESSION_SECRET` com pelo menos32 caracteres e `SITE_ALLOWED_ORIGINS`. Para atendimento humano persistido no próprio site, usar `SITE_HANDOFF_BACKEND=site-inbox`, `SITE_INBOX_COLLECTION=site_catalisa_inbox_v1` e `SITE_HANDOFF_CHANNELS=here`; isso aceita e-mail **ou** telefone e não anuncia entrega por e-mail/WhatsApp. O inbox deve ser provisionado na conta `admin@catalisa.app`, com `packet` e `staffSession` cifrados e coleção PII. Não exige URL nem segredos de um webhook que não utiliza. O adaptador HTTP alternativo exige seleção explícita `SITE_HANDOFF_BACKEND=http`, URL/token e os segredos de assinatura/webhook com pelo menos32 caracteres. Secret/cookies devem permanecer estáveis entre releases do mesmo ambiente; staging e produção usam configuração e coleção próprias. O backend Supabase continua opção de implementação, mas este procedimento usa o Data Store real já validado em staging.

## Instalação isolada, após o artefato ser validado

Preparar `/opt/apps/catalisa-site-staging/releases/RELEASE_ID` **dentro do CT154**, copiar o conteúdo da release preparada e o script de ativação. Guardar credenciais em `/opt/apps/catalisa-site-staging/runtime.env`, owner root e modo600. O env fica fora da pasta do artefato e do contexto do Docker build. A instalação isolada inicial foi executada em 20261025-0446; as revisões seguintes chegaram a 20261025-r2, com Node22/dependências e readiness exercitados no hosting real. Não sobrescrever diretórios de releases já existentes.

Exemplo de comandos no CT154 para revisar e ativar somente o candidato:

```sh
bash /opt/apps/catalisa-site-staging/site-release-activate.sh staging RELEASE_ID --plan
bash /opt/apps/catalisa-site-staging/site-release-activate.sh staging RELEASE_ID --apply
```

`--apply` ativa o projeto Compose `catalisa-site-staging`; com `--https-staging=true`, o bind é `172.10.0.202:18181`, restrito ao edge/self. Sem essa opção, o bind é `127.0.0.1:18181`; não altera `catalisa-site`, `8081`, domínio, DNS ou Traefik. Verifica hashes, modo do env, Compose e readiness; retorna ao candidato anterior se falhar. O endpoint de sessão sem cookie precisa retornar401 (não HTML/503), exercitando acesso ao store. Artefatos ficam preservados para rollback. Não interpretar esse smoke como teste completo de IA/CRM/entrega.

Para acesso HTTP de leitura, `node scripts/site-release-tunnel.mjs --target=staging` abre `http://127.0.0.1:18181/` por SSH no nó e relay Python3 dentro do CT154. Usa o acesso já verificado, sem exigir credencial SSH dentro do container nem expor listener público. O túnel é alternativa de diagnóstico; o aceite atual usa a origem HTTPS de staging, não forwarding HTTP. Alternativa: rodar `curl` dentro do CT154 via `pct exec 154`. O túnel HTTP não valida cookies Secure nem as jornadas reais de browser. A revisão completa exige HTTPS de staging com origem permitida própria; preparar rota exclusiva no edge depois da autorização de staging, sem trocar o router de produção. Antes dessa rota, revisar o bind/firewall e confiar exclusivamente no IP do edge ao extrair IP de visitante; nunca aceitar `X-Forwarded-For` de qualquer origem.

## Aceite e produção

- [x] Hosting isolado com TLS/BasicAuth/noindex/BFF e cookies reais exercitados; produção pública preservada.
- [x] Store compartilhado, inbox, IA do owner e recursos exclusivos de produção têm smokes reais com limpeza dos dados fictícios.
- [x] Rollback/restauração real de staging preservou conversa e confirmou hash público inalterado.
- [x] H14 real passou em cinco sessões fictícias; coleta pública permanece desligada, sem presumir aprovação da política.
- [x] Contato humano direto r2 real passou: visitante anônimo, nome/e-mail somente, confirmação após reload, owner/inbox, zero IA/jobs e limpeza.
- [x] Árvore r2 compilada: 257 HTMLs, SEO 256 sem falhas/avisos, browser 41 e testes 231/20/TSC; identidade e HTTP real da release conferidos.
- [x] Mesmos bytes public/server instalados no staging HTTPS protegido e preparados para produção; HTTP e Contato direto real conferidos.
- [x] Três cenários reais finais do Contato com IA passaram em r2, com revisão/reload e refinamento semanticamente conferido.
- [x] Lab final r2 real passou com geração 59,949s no fluxo de UI, reload e continuação no Contato.
- [x] Inbox browser final r2 passou em quatro larguras: login/open/claim/reply/reload, logout 401, limpeza e zero pageerrors.
- [x] Home final medida: LCP 3,032s (antes 3,272s), CLS 0,021034 e DOM passaram no escopo descrito; objetivo 2,5s **não** alcançado. Limitação registrada no aceite técnico, sem aprovação presumida.
- [ ] Registrar decisões editoriais de fonte/maturidade/responsável e escolha H14 ainda pendentes; não converter aprovação técnica em decisão do usuário.
- [ ] Apresentar URL, evidências e limites do candidato exato; obter autorização explícita antes do deploy/corte público.

O candidato de produção usa projeto `catalisa-site-production`, pasta `/opt/apps/catalisa-site-production` e porta 18182. `site-release-prepare.mjs --target=production --edge-private=true` publica somente em 172.10.0.202 e aplica a mesma allowlist exclusiva do edge 172.10.0.105/self que o staging; sem essa flag o bind continua loopback. O BFF permanece loopback no namespace do Caddy. O preparador cria o diretório pai e recusa sobrescrever uma release existente.

O script de corte `scripts/site-production-cutover.sh` foi preparado, **não executado**. Rodar dentro do CT105 com `RELEASE_ID --plan` só lê o router e mostra upstream atual/candidato/rollback. `--apply` ou `--rollback` exige `SITE_PRODUCTION_APPROVAL=RELEASE_ID` e `SITE_PRODUCTION_APPROVAL_RECORD` apontando a arquivo 600 contendo `releaseId`, `userAuthorizedProduction:true`, `stagingValidated:true`, `userMessage`, `stagingEvidence` e `authorizedAt` ISO. Essas flags/arquivo não substituem a autorização explícita real do usuário. O apply verifica health/BFF401 no 18182, preserva o original fora da pasta observada, troca somente o upstream 8081→18182 e exige observar o header `X-Catalisa-Site-Release` no HTTPS público; se não confirmar, restaura 8081 automaticamente. O rollback preserva containers e dados. Não reinicia o edge nem publica painel/blocos.

Preparação de recursos próprios: `node scripts/prepare-site-production-resources.mjs --plan` é offline e não cria nada. A opção `--apply=true` é uma etapa separada de provisionamento, condicionada aos smokes reais de staging presentes/passando; usa somente agente sem ferramentas, coleções cifradas exclusivas de sessões/inbox/métricas e token próprio do site. Não ativa métricas, não envia mensagens e não faz deploy. O provisionamento já passou e os recursos próprios foram exercitados: [resultado](qa/integrations/production-resources.json) e [smoke funcional real](qa/integrations/production-resources-real.json), com dados fictícios removidos. Isso não autoriza deploy do website ou alteração de tráfego. Não copiar IDs, tokens ou segredos de staging para produção.

```sh
node scripts/prepare-site-production-resources.mjs --plan
node scripts/site-release-preflight.mjs --target=production --dist=/tmp/catalisa-site-production --env-file=.local/site/production-runtime.env
node scripts/site-release-prepare.mjs --target=production --edge-private=true --id=RELEASE_ID --dist=/tmp/catalisa-site-production
# Dentro do CT105, somente leitura:
bash /PASTA_PRIVADA/site-production-cutover.sh RELEASE_ID --plan
```

[Aceite técnico consolidado](qa/release/acceptance-r2.json) e [estado atual](qa/release/current-status.json) fecham a evidência da revisão r2. As pendências agora exigem decisão humana: aceite visual/editorial, autorização explícita de publicação e escolha específica antes de ativar H14 (flag 0). A limitação de LCP e os tempos variáveis de IA permanecem registrados; não são convertidos em aprovação.

Identidade do candidato r2 revisado, idêntica no staging e no candidato preparado para produção:

| Árvore | SHA-256 |
|---|---|
| public | `948f85b14b796e50623068d7bf0c8f69818fad5b328e87df532d2b7e642724ff` |
| server | `a4eb20162dd086e470a02df120bdfdf5fc347bfd8dcd60e64365a62dd47a5dff` |

O plano somente leitura do CT105 confirmou o upstream legado 8081. O hash do corpo público segue `e446bf5b5f201e8db907a3186f022f07fb902c76c85a134c2904d560a8957735`; nenhuma publicação pública foi autorizada ou executada por este registro.

O artefato de produção precisa indexação habilitada; preflight recusa publicar o noindex do staging. Gerar em pasta limpa com `VITE_SITE_RELEASE=redesign VITE_SITE_INDEXING=enabled CONTEXT=production`, `vite build --emptyOutDir` e postbuild com o mesmo modo. O upstream atual `172.10.0.202:8081` permanece disponível para retorno.

Rollback de candidato (não muda o domínio público):

```sh
bash /opt/apps/catalisa-site-staging/site-release-activate.sh staging ID_DA_RELEASE_ANTERIOR --rollback
```

Rollback público, após um eventual corte autorizado: restaurar o serviço Traefik `catalisa-io-svc` ao upstream original `http://172.10.0.202:8081`, confirmar HTTP200 e comportamento legado. O site antigo fica intacto para essa finalidade; não parar/remover seu container. Rollback de código não desfaz entregas externas nem apaga dados; manter segredos/coleção e contratos compatíveis durante toda a janela de retorno.

## HTTPS real de staging, sem compartilhar a origem de produção

Na descoberta inicial, `catalisa.io/www` tinham certificado próprio e `site-staging.catalisa.io` ainda retornava o default do Traefik. Esse estado foi superado: o [smoke real](qa/release/staging-http.json) confirmou TLSv1.3 válido para o hostname de staging, com validade registrada até 23/01/2027, BasicAuth e noindex. Não ignorar erros TLS nem tomar o certificado da origem pública como prova do staging.

O caminho instalado usa **`https://site-staging.catalisa.io`**. DNS da zona `catalisa.io` é PowerDNS no CT123 em `root@177.104.184.35`; foi criado somente o registro esperado do staging. Na aplicação inicial, `pdnsutil` tratou NAME sem ponto final como relativo e criou o nome dobrado; o registro exclusivo desta sessão foi corrigido e o script usa NAME relativo `site-staging`. Não repetir a falha com o FQDN sem ponto final. Não há dependência de Netlify nem alteração de DNS/hosts local.

A rota nova é exclusiva de staging; o router público `catalisa-io-site` e upstream 8081 permanecem. Abaixo ficam os comandos de preparação/retirada para operação futura, não uma lista de passos ainda não executados.

Depois do artefato validado, preparar candidato de staging com bind na interface privada do CT154:

```sh
node scripts/site-release-prepare.mjs --target=staging --https-staging=true --id=RELEASE_ID --dist=/tmp/catalisa-release-candidate
node scripts/site-staging-https-prepare.mjs
bash scripts/site-staging-dns.sh --plan
```

Antes de copiar o env, configurar `SITE_ALLOWED_ORIGINS=https://site-staging.catalisa.io`. O candidato HTTPS publica a porta18181 somente em `172.10.0.202`. Caddy confia em `X-Forwarded-For` exclusivamente quando o peer é `172.10.0.105` (IP real confirmado do edge), faz parsing estrito da direita para a esquerda e sobrescreve `X-Real-IP` com `{client_ip}`. O BFF aceita essa informação somente de loopback. O Caddy também restringe peers ao edge e ao próprio CT154, necessário para healthchecks. Nunca usar `private_ranges` como proxy confiável.

Copiar para o CT154 somente release, script de ativação e runtime.env privado. Copiar para o CT105 uma pasta privada contendo `.local/site/staging-https/site-catalisa-staging.yml`, `site-staging.htpasswd` e `scripts/site-staging-edge.sh`; **não copiar access.json para o edge**. O container Traefik monta `/opt/traefik/config` como `/etc/traefik`, confirmado por inspect, portanto o usersFile gerado `/etc/traefik/site-staging.htpasswd` resolve corretamente.

O instalador local `scripts/site-staging-install.mjs` automatiza somente a cópia/ativação no CT154. Por padrão mostra o plano e não abre conexões. Confere preflight, origem HTTPS exata, env600 e todos os hashes, recusa arquivos extras/symlinks e releases existentes. `--apply=true` transmite o env em arquivo privado, fora do contexto de build, por SSH/`pct push`; não imprime valores. Se já existe `runtime.env`, exige conteúdo idêntico e não o substitui. O Docker instala dependências do bundle com `npm ci --omit=dev --ignore-scripts` usando o lock preparado. O instalador não altera DNS, edge, site público, painel ou blocos:

```sh
node scripts/site-staging-install.mjs --release=.local/site/releases/staging-RELEASE_ID --env-file=.local/site/staging-runtime.env
node scripts/site-staging-install.mjs --release=.local/site/releases/staging-RELEASE_ID --env-file=.local/site/staging-runtime.env --apply=true
```

O plano e a sintaxe do instalador não equivalem a um deploy: o resultado real só pode ser registrado após `--apply=true`, readiness e validação HTTPS.

### Revisar os mesmos bytes de produção no staging

O caminho explícito `--review-production-artifact=true` aceita um build com `indexing:true` **somente** com `--target=staging --https-staging=true`. O comportamento padrão continua exigindo `indexing:false` para staging. Nenhuma opção de revisão autoriza instalar ou publicar produção.

O preparador copia `public/` e o bundle `server/` sem modificar seus bytes; o manifest registra `reviewProductionArtifact:true`, hashes por arquivo e hashes agregados separados dessas duas árvores. A diferença de hosting fica fora de `public/`: Caddy de staging aplica `X-Robots-Tag:noindex,nofollow,noarchive` e `Cache-Control:no-store` de forma diferida, inclusive nas respostas de erro; `/robots.txt` responde `Disallow:/`. O edge preserva noindex/no-store; BasicAuth foi removido por pedido explícito do usuário. O runtime e a origem permanecem exclusivamente de staging. O instalador exige a flag explícita coerente com o manifest e verifica proteções, overlay e hashes antes de abrir conexões.

```sh
node scripts/site-release-preflight.mjs --target=staging --https-staging=true --review-production-artifact=true --dist=/tmp/catalisa-site-production --env-file=.local/site/staging-runtime.env
node scripts/site-release-prepare.mjs --target=staging --https-staging=true --review-production-artifact=true --id=REVIEW_ID --dist=/tmp/catalisa-site-production
node scripts/site-staging-install.mjs --release=.local/site/releases/staging-REVIEW_ID --env-file=.local/site/staging-runtime.env --review-production-artifact=true
# A instalação abaixo continua sendo somente staging:
node scripts/site-staging-install.mjs --release=.local/site/releases/staging-REVIEW_ID --env-file=.local/site/staging-runtime.env --review-production-artifact=true --apply=true
```

[Gates e hashes em fixtures locais](qa/release/review-production-artifact.json) passaram. [Caddy2 adapt/validate](qa/release/review-caddy-validate.json) passou usando somente stdin no container isolado de staging, sem reload ou escrita. Essas evidências não substituem validar HTTP real após instalar o candidato: exigir noindex/no-store em HTML, assets e404, robots bloqueado, acesso público de revisão e hashes de `public/server` idênticos ao candidato de produção. A autenticação independente da equipe deve continuar retornando401 sem cookie. A publicação em produção ainda depende da autorização explícita após essa revisão.

O segundo instalador, `scripts/site-staging-expose.mjs`, prepara o acesso HTTPS exclusivamente ao hostname fixo. Seu plano é local; `--apply=true` exige health do candidato a partir do CT105, aplica somente o registro DNS esperado e envia somente YAML/htpasswd/script de instalação para o edge. Confere o YAML byte a byte com o template fixo compartilhado; `access.json` permanece na máquina local. Não ignora certificado TLS nem substitui a validação posterior:

```sh
node scripts/site-staging-expose.mjs
node scripts/site-staging-expose.mjs --apply=true
```

Se uma etapa falhar, inspecionar DNS/rota existentes antes de repetir: o instalador do edge recusa sobrescrever arquivos já presentes. Um DNS criado, sozinho, não representa site ou HTTPS publicado.

Ordem de aplicação depois da autorização de staging:

1. Ativar apenas o candidato no CT154 usando `site-release-activate.sh staging RELEASE --apply`; confirmar health e sessão401 na interface privada.
2. Na máquina local, executar `bash scripts/site-staging-dns.sh --apply`. O script recusa registros diferentes, cria somente `site-staging.catalisa.io A177.104.184.38 TTL60`, incrementa SOA, notifica secundários e verifica os três autoritativos. Não altera apex, www, painel ou outros nomes.
3. No CT105, revisar `bash /PASTA_PRIVADA/site-staging-edge.sh /PASTA_PRIVADA --plan`; aplicar com `--apply`. Instala atomicamente **apenas** `/opt/traefik/config/dynamic/site-catalisa-staging.yml` e `/opt/traefik/config/site-staging.htpasswd`. Não reinicia Traefik nem toca `catalisa-io.yml`.
4. Traefik solicita automaticamente certificado LE por HTTP01, usando o resolver `letsencrypt` que atende o site atual. A autenticação de staging não bloqueia o challenge interno. Esperar certificado público válido para o nome exato antes de usar browser; não ignorar erros TLS.
5. Verificar router `catalisa-site-staging@file` enabled e serviço `catalisa-site-staging-svc@file` UP pela API edge; verificar certificado com `openssl s_client -connect 177.104.184.38:443 -servername site-staging.catalisa.io` e `openssl x509 -noout -dates -ext subjectAltName`.
6. Na instalação inicial histórica havia BasicAuth. No ambiente atual, abrir HTTPS sem usuário/senha: `.local/site/staging-https/access.json` registra `basicAuth:false`, respeitado pelo helper de smokes e pela auditoria de qualidade. Ao recriar o edge inicial, aplicar a remoção autorizada usando `scripts/site-staging-open.py` dentro do CT105 antes da validação final. Usar a origem HTTPS exata; cookies Secure e HttpOnly permanecem habilitados.

O middleware de staging impõe `X-Robots-Tag:noindex,nofollow,noarchive` e `Cache-Control:no-store`, incluindo respostas de autenticação. A rota específica `/api/internal/handoff-events` usa o mesmo hostname/serviço e dispensa BasicAuth para não impedir callbacks do workflow; continua exigindo a autenticação Bearer/assinatura/antirreplay do BFF. No backend atual `site-inbox`, entrega/atribuição vêm da abertura/claim reais da equipe; callbacks externos não são usados e seus segredos não são exigidos. Se selecionar o adaptador HTTP, testar rejeição sem assinatura e callback autorizado como aceite específico desse backend.

Se DNS recursivo ainda não propagou, depois da emissão TLS é possível testar sem mudar o sistema:

```sh
curl --resolve site-staging.catalisa.io:443:177.104.184.38 -I https://site-staging.catalisa.io/
# Deve retornar200 sem senha, noindex/no-store e apresentar certificado válido.
```

Chromium aceita `--host-resolver-rules=MAP site-staging.catalisa.io 177.104.184.38`; a URL continua HTTPS com o hostname real. Não usar `ignoreHTTPSErrors`. Credenciais devem ser carregadas do arquivo privado em memória, sem linha de comando nem logs. Isso verifica cookies/origem no domínio próprio mesmo antes do cache DNS expirar.

Retirada de staging: no CT105, `site-staging-edge.sh /PASTA_PRIVADA --remove` retira somente os arquivos de rota/auth para a pasta privada; depois `bash scripts/site-staging-dns.sh --remove` remove somente o A esperado e verifica autoritativos. Preservar certificados ACME; não reiniciar edge e não mexer no router público. O projeto Compose de staging pode ser parado separadamente quando não estiver sendo usado.

Fontes de operação consultadas: configuração real do hosting, [confiança de proxy Caddy](https://caddyserver.com/docs/caddyfile/options#trusted-proxies) e [PowerDNS pdnsutil](https://docs.powerdns.com/authoritative/manpages/pdnsutil.1.html). A [documentação Netlify](https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/) foi consultada antes de confirmar que o caminho público atual é outro; não usar deploy Netlify como validação do hosting Caddy.
