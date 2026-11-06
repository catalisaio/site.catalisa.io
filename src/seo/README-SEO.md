# SEO — Catalisa

O site usa React/Vite e captura páginas com Puppeteer no build. O HTML estático inclui conteúdo principal, metadados e JSON-LD para leitores sem JavaScript. São snapshots do navegador, não saída de `react-dom/server`: o cliente monta a aplicação com `createRoot`, evitando a tentativa inválida de hidratar IDs/estado de animação capturados. Isso ainda exige medição de performance no lançamento.

## Fontes de verdade

- `routes.ts`: páginas legadas, par de idiomas, metadados de navegação e seleção de schemas.
- `build-pages.ts`: inventário único de HTML e sitemap, incluindo artigos e playbooks. Exclui áreas privadas; mantém previews fora do sitemap.
- `redesign.ts`: metadados e grafo das rotas nativas implementadas. Continuam `noindex` até seleção e lançamento.
- `src/i18n/locales/{pt-BR,en-US}/seo.json`: títulos e descrições legados. Comprimento deve favorecer legibilidade; não há garantia de exibição exata em resultados.

`SEOHead` cuida de title, descrição, robots, canonical, OG/Twitter e alternates. `LanguageLayout` administra páginas legadas; artigos, playbooks e listagens que têm metadados próprios não recebem um segundo SEOHead. `JsonLd` administra os scripts estruturados. `PreviewMeta` aplica o head completo das páginas nativas e preserva o bloqueio de indexação do redesign.

Quando uma rota nativa substitui um path legado, como `/studio` ou `/workflows`, o inventário usa a página nativa e sua política de `noindex`. O equivalente inglês legado continua com canônico próprio, mas deixa de anunciar a rota portuguesa sem indexação como tradução. A liberação futura deve revalidar a reciprocidade dos alternates.

Namespaces críticos precisam existir no idioma solicitado, inclusive `seo` e `home`. Um fallback pt-BR carregado não significa que o conteúdo inglês está pronto. `LanguageLayout` carrega explicitamente esses bundles antes de renderizar.

## Nova página

1. Implementar e montar a rota em `src/App.tsx`.
2. Para legado bilíngue, registrar o par em `routes.ts` e `useLocalizedPath.ts`, com traduções reais nos dois arquivos SEO. Páginas sem tradução usam o mesmo path no registro; não inventar `/en/...`.
3. Para redesign, cadastrar a página em `redesign.ts`, usando os metadados pelo `PreviewMeta`; implementação não implica autorização para indexar.
4. Usar dados estruturados somente para fatos e conteúdo presentes na página. Não inventar preço, avaliação, autoria ou métricas. Adicionar breadcrumbs visuais quando ajudarem a navegação.
5. Rodar build e auditoria. Não manter uma segunda lista manual no sitemap ou prerender.

## Pipeline

`npm run build` executa compilação, imagens sociais, sitemap, ZIP de marca, fallback de metadados de artigos, captura estática, regras de hosting e auditoria. As etapas estão ligadas por `&&`; falhas interrompem o build. `SITE_DIST_DIR` define a saída dos scripts quando Vite usa `--outDir`; `PUPPETEER_EXECUTABLE_PATH` pode selecionar o Chrome instalado.

`npm run check:seo` inspeciona o HTML pronto com JavaScript desativado no parser. Verifica canonical, robots, H1, descrição, idioma e título correspondente à tradução, JSON-LD, alternates, sitemap, links das capacidades e fallback de 404. Saídas: `prerender-report.json` e `seo-report.json` no diretório do build.

O prerender usa dois workers por padrão e desativa limitações de background do Chrome. `--workers=1` permite diagnóstico serial; `--route /caminho --shell=/caminho/do/build/spa.html` seleciona uma rota usando o shell original. Uma execução seletiva não valida o inventário completo: o build final sempre precisa passar em todas as rotas.

`node scripts/verify-redesign.mjs --seo --built-dir=/caminho/do/build` complementa com navegador: inicialização, navegação interna, metadados sem duplicação, conteúdo novo a 390/1440 px e páginas sem JS. O servidor é temporário e local. Não substitui a validação do CDN em staging.

`generate-hosting.ts` cria redirects permanentes para aliases conhecidos, mantém o shell das áreas autenticadas separado e configura 404 para URLs desconhecidas. Em contextos Netlify diferentes de `production`, gera também um header global de `noindex`.

## Publicação e acompanhamento

A orientação do usuário exige staging validado, aviso e autorização explícita antes de produção. Troca de domínio/Home, redirects e liberação de indexação precisam ser revisados juntos. Verificar tanto meta robots quanto `X-Robots-Tag`, além de robots.txt e acesso dos crawlers no CDN/WAF.

A estratégia editorial, prioridades e medição estão em [SEO para busca e IA](../../docs/redesign-2026-10-22/seo-busca-e-ia.md). Search Console, Bing Webmaster Tools, Rich Results e Core Web Vitals precisam de validação sobre as URLs publicadas. Pontuação de auditoria não equivale a posição ou citação em respostas de IA.

Analytics continua em `src/hooks/useAnalytics.ts`, com Consent Mode e a política existente. Eventos de interesse não comprovam criação de lead ou entrega de atendimento. Não enviar PII, conteúdo de conversas ou conceitos individualizados para analytics ou schemas públicos.

## Candidato do site independente (24/10/2026)

O build padrão preserva a Home antiga. O corte é explícito no artefato:

```sh
VITE_SITE_RELEASE=redesign CONTEXT=deploy-preview SITE_DIST_DIR=/tmp/catalisa-release-candidate npm run build -- --outDir /tmp/catalisa-release-candidate --emptyOutDir
```

Esse comando gera arquivos locais; não publica. A indexação do candidato permanece fechada no HTML e em `X-Robots-Tag`, e seu sitemap fica vazio. Somente o artefato com `VITE_SITE_RELEASE=redesign VITE_SITE_INDEXING=enabled CONTEXT=production` libera as páginas públicas. Esses flags não substituem staging validado e autorização explícita antes do deploy de produção.

O Vite grava `site-build.json`, usado por sitemap, prerender e regras de hosting. Assim os scripts não precisam inferir quais flags produziram o JavaScript. `release-routes.json` registra rotas nativas, compatibilidade, destinos 301 e prefixos autenticados. Um build antigo sem manifesto mantém compatibilidade com as flags do ambiente; não reutilizar seu diretório como candidato de release.

- `/` usa a Home independente; `/design-system/home` passa a redirecionar para `/`. A guia `/design-system` continua noindex.
- `/ai-agents`, `/apps`, `/building-blocks` e `/bancario` têm substitutos diretos em `/agentes`, `/ecossistema`, `/capacidades` e `/ecossistema/banking`. Os 301 são gerados somente no candidato.
- Inglês permanece nos URLs atuais e com conteúdo anterior; nenhuma tradução nova foi inventada. Não há hreflang entre conteúdo novo em português e conteúdo antigo em inglês.
- Insights, playbooks, páginas legais e especialistas sem substituto direto preservam conteúdo e URL. Não há redirecionamento de arquivos para a Home ou para artigos diferentes.
- Academy e apresentações preservam auth, convites e parâmetros sob `/treinamento`, `/en/training`, `/apresentacao` e `/en/presentation`; usam `spa.html`, continuam noindex e não participam do sitemap.
- O entrypoint carrega o app legado somente em caminhos explícitos de compatibilidade. Transições entre os apps recarregam o documento, isolando tema e CSS. Caminhos desconhecidos ficam no router novo e retornam HTTP 404 pelo hosting.

Os 144 arquivos de marca em `/redesign/brand` são distribuídos sem transformação. A auditoria de SEO confere SHA-256 contra os originais públicos e bloqueia o build se qualquer arquivo tiver sido alterado ou estiver ausente.

O prerender usa um worker por padrão (`PRERENDER_WORKERS=1`). Continua bloqueando envios, analytics e redes externas; snapshots não são comprovação das integrações. `check:seo` confere o inventário completo, meta, conteúdo sem JS, redirects e política de indexação; CDN, autenticação real e autorização de deploy exigem a validação de staging.

### Hosting Caddy real

O hosting ativo é Caddy atrás do Traefik; `netlify.toml` e `_redirects`/`_headers` ficam como compatibilidade. O pipeline gera também `site-hosting.caddy`, importado no bloco do site após os handles de API. Ele serve os arquivos em `/srv`, aplica os mesmos 301 e a política de indexação, mantém SPA somente para os prefixos autenticados e responde com o HTML de erro e status HTTP 404 nos demais caminhos inexistentes.

A URL canônica usa caminhos sem barra final. O include redireciona as barras finais das páginas inventariadas e desliga a canonização automática de diretórios do file server para evitar ciclos. Um `map` acrescenta a query original aos destinos 301 somente quando ela existe. Referências primárias: [map](https://caddyserver.com/docs/caddyfile/directives/map), [file_server](https://caddyserver.com/docs/caddyfile/directives/file_server), [handle_errors](https://caddyserver.com/docs/caddyfile/directives/handle_errors).

O teste de navegador local usa emulação do hosting. A aprovação do Caddy exige adicionalmente validar o include com a mesma versão instalada e conferir por HTTP aliases com query, barras finais, arquivos estáticos, logins autenticados e 404. A importação desse arquivo não configura nem publica APIs.
