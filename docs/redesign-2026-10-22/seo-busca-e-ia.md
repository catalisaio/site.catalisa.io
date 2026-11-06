# Presença em busca e respostas de IA

Diretriz do usuário em 22/10/2026: maximizar a presença da Catalisa em busca tradicional e em respostas com IA. Esta frente integra H13 e H16. Otimização técnica melhora descoberta e compreensão; posição, indexação e citações precisam ser medidas após publicação.

Estado em 25/10/2026: o candidato explícito contém 70 caminhos nativos (69 do handoff mais a guia de identidade) e 186 caminhos preservados de compatibilidade. As dez equivalências conhecidas têm redirects permanentes. A indexação está fechada globalmente no candidato; a liberação requer `VITE_SITE_RELEASE=redesign VITE_SITE_INDEXING=enabled CONTEXT=production`, depois de staging validado e autorização do usuário. O build final ainda será regenerado com as últimas alterações do Contato. As contagens e resultados nas rodadas abaixo são históricos.

## Decisões de implementação

- Um inventário em `src/seo/build-pages.ts` alimenta pré-renderização, sitemap e auditoria. Usa rotas reais da aplicação, artigos, playbooks e páginas nativas implementadas; não anuncia páginas ou traduções inexistentes. `/precos` não está montada no Router atual e sai da lista duplicada do sitemap; o trabalho de pricing existente é preservado.
- `src/seo/redesign.ts` define título, descrição, URL canônica, imagem social e grafo estruturado das rotas nativas implementadas, incluindo a guia de trabalho. O modo de publicação controla o inventário e a indexação. Não confundir implementação com aprovação para indexação.
- Nas rotas migradas que já existiam, como `/studio` e `/workflows`, o inventário usa a implementação nativa sem indexação. O legado inglês continua acessível com canônico próprio e sem anunciar uma tradução portuguesa `noindex`; os alternates devem ser revalidados na liberação pública.
- A leitura sem JS também mantém o texto visível quando uma animação de entrada havia sido capturada com opacidade zero. O shell específico do novo site remove GTM, Clarity e iframe de rastreamento até existir um fluxo nativo de preferências. Os servidores locais de snapshot representam apenas uma sessão anônima, sem criar dados ou mascarar falhas do staging real.
- O HTML entregue contém o texto principal e os metadados completos sem executar JavaScript. Falha de pré-renderização ou auditoria bloqueia o postbuild, que antes aceitava falhas silenciosamente. A captura usa somente GET/HEAD locais, sem analytics externo, chat ou envio de formulários.
- Sitemap contém somente URLs públicas canônicas, com alternates recíprocos quando a tradução existe. Não há `lastmod` atualizado artificialmente a cada build. Datas reais de artigos continuam nos dados editoriais.
- Organization e WebSite usam identificadores estáveis e a assinatura oficial. WebPage, BreadcrumbList e o catálogo ItemList descrevem conteúdo presente. Remove-se a oferta de software com preço zero: uma demo gratuita não comprova um produto gratuito. Remove-se também a contagem de palavras estimada como se fosse exata; artigos ingleses passam a identificar a própria URL e idioma.
- Metadados de artigos e listagens têm um único responsável. A inicialização do cliente descarta as cópias capturadas dos efeitos antes de reassumir a gestão do head, evitando acúmulo de JSON-LD. A auditoria no build revelou erro React 418 ao tentar hidratar snapshots do navegador como se fossem SSR; o cliente passa a montar a árvore interativa com `createRoot`. O HTML estático continua disponível para quem não executa JS; medir o custo de remontagem em H15.
- As 39 capacidades têm links HTML no índice completo do catálogo, independentemente de filtros ou do botão “Ver mais”. Não são inseridas seções na composição aprovada para atender SEO. O hero principal segue o handoff enquanto o usuário avalia alternativas. Os convites a criar produtos financeiros e de crédito e modernizar o legado foram aplicados em espaços existentes de Banking, Credit e Arquitetura, com rastreabilidade editorial.
- Imagens sociais por rota usam a assinatura SVG oficial e tokens aprovados, geradas no build em 1200×630. Não dependem de geração remota de imagem.
- Aliases conhecidos passam a redirects permanentes. Páginas públicas têm arquivos estáticos; paths autenticados usam um shell separado. URLs desconhecidas recebem fallback HTTP 404, sem tratar todo endereço como Home. A auditoria local inspeciona as regras; o status no CDN ainda precisa ser validado em staging.

## Conteúdo e intenção de busca

A tabela define prioridades editoriais, sem alegar volume de pesquisa ou posição observada. Os termos finais precisam ser confrontados com consultas reais do Search Console e Bing Webmaster Tools. Uma página deve responder bem ao assunto e encaminhar a avaliação do comprador, sem criar páginas repetidas para cada variação de palavra.

| Intenção | Página principal na arquitetura nova | Evidência/conteúdo necessário |
|---|---|---|
| O que é Catalisa; plataforma de capacidades combináveis | Home e `/visao` | Definição clara, público, composição e caminhos por tarefa |
| Agentes de IA para operações; agentes com ferramentas e supervisão | `/agentes` | Contexto, ferramentas permitidas, limites, intervenção humana e exemplo reproduzível |
| Automação de processos e workflows com IA | `/workflows` | Gatilho, fluxo, erro, retomada e contraste entre regra e geração |
| Criar produtos com IA e building blocks | `/studio` | Como sair da intenção para uma composição, condições e participação de quem constrói |
| IA por API para texto, imagem e áudio | `/capacidades/ai-engine` | Escopo, contrato, exemplos e disponibilidade documentada |
| WhatsApp Business API e automação conversacional | `/capacidades/wpp-business` e `/capacidades/wpp` | Explicar a responsabilidade de cada capacidade e o caminho de integração |
| Integração de sistemas por API, eventos e webhooks | `/desenvolvedores` | Exemplos que possam ser reproduzidos, autenticação e contratos com links |
| Arquitetura composable e independência de capacidades | `/arquitetura` | Responsabilidades, reuso, dependências e aplicações concretas |
| Governança de IA, permissões e aprovação humana | `/governanca` | Papéis, autorizações, auditoria e distinção entre demonstração e operação real |
| Motor de decisão e regras DMN | `/capacidades/decision-engine` | Política versionada, regra legível e exemplo com fonte |
| Originação de crédito e esteira de decisão | `/ecossistema/credit` | Etapas, capacidades envolvidas, fonte/data e limites da oferta |
| Plataforma bancária, Open Finance e BaaS | `/ecossistema/banking` e respectivas capacidades | Separar produto, integração e parceiro; disponibilidade comprovada |
| Como escolher e implementar; comparações e perguntas do comprador | `/perspectivas` e acervo `/insights` preservado | Autoria, revisão técnica, fontes primárias e experiência própria |

As páginas ainda pendentes na migração não entram no sitemap por constarem nesta tabela. O acervo legado continua acessível; mudanças futuras de slug exigem mapa de equivalência e 301 antes de remover URLs que já recebem tráfego. Não redirecionar artigos distintos indiscriminadamente para a Home.

Cada página de produto deve explicar o que resolve, para quem, como funciona, o que precisa ser integrado, disponibilidade e próximo passo. Exemplos precisam ser identificados como exemplos. Métricas de clientes exigem autorização e fonte; métricas do relatório conservam corte, unidade e cenário. Não atribuir autoria pessoal, certificação ou resultado comercial sem evidência.

## Acesso por buscadores e IA

A política pública `User-agent: * / Allow: /` já permite rastreadores de busca, incluindo Googlebot, Bingbot e OAI-SearchBot; não é necessário criar um grupo permissivo separado que acidentalmente ignore regras existentes. A revisão da CDN/WAF deve confirmar que bots legítimos conseguem acessar HTML, imagens e assets. Conversas, conceitos individualizados e áreas autenticadas continuam fora da indexação e não podem aparecer no sitemap nem em dados estruturados públicos.

Google relaciona presença em AI Mode/AI Overviews à qualidade e indexabilidade do conteúdo. OAI-SearchBot controla descoberta para busca no ChatGPT; a política de treinamento com GPTBot é independente. Este trabalho mantém a política anterior de treinamento e não presume que autorizar treinamento melhore posição. [Google: busca com IA](https://developers.google.com/search/docs/appearance/ai-features), [OpenAI: crawlers](https://developers.openai.com/api/docs/bots).

Não se adota `llms.txt` como mecanismo de ranking. O Google informa que não o utiliza para melhorar visibilidade; também não há schema especial para IA. A prioridade é conteúdo próprio, útil e acessível. [Guia oficial de otimização para IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Publicação e medição

Conforme orientação explícita do usuário, produção exige aviso, staging validado e autorização explícita. Nenhum deploy do painel ou alteração dos blocos faz parte deste trabalho de SEO. Os passos abaixo são pendências de lançamento, não ações já executadas.

1. Completar a migração, revisar fontes/alegações e mapear URLs antigas e equivalentes novas usando também dados de tráfego. Preservar o acervo e redirects úteis.
2. Validar em staging: HTML sem JS, metadados, status 200/301/404, canonical, hreflang, dados estruturados, imagens, caminhos autenticados e ausência de conteúdo privado. Staging/preview deve ter `X-Robots-Tag: noindex` global. Confirmar que funções e conversas não ficam públicas por efeitos de fallback.
3. Medir mobile e Core Web Vitals: LCP, INP e CLS. Otimizar recursos que impactam a experiência observada; o orçamento e a evidência entram em H15. O build frontend, isoladamente, não comprova performance real.
4. Apresentar staging e relatório. Somente na mudança de lançamento autorizada: selecionar rotas públicas, retirar o `noindex` dessas páginas **no HTML e nos headers**, manter áreas privadas e guia fora da busca, gerar sitemap e revalidar o artefato. Não deixar um bloqueio HTTP contradizer a meta de indexação.
5. Confirmar domínio e acesso ao Google Search Console e Bing Webmaster Tools. Validar a configuração de inclusão nas experiências generativas do Google indicada no guia atual; submeter sitemap e inspecionar URLs prioritárias. As ferramentas não estão conectadas nesta sessão; não há números de posicionamento ou cobertura validados.
6. Após o deploy autorizado, verificar domínio real/CDN e registrar o build e plano de retorno. Só então solicitar recrawl; IndexNow pode ser configurado para URLs públicas alteradas nos buscadores participantes, com chave própria. Isso não substitui qualidade nem garante indexação. [Bing: IndexNow](https://www.bing.com/webmasters/help/indexnow-0z209wby).
7. Acompanhar semanalmente consultas de marca e sem marca, páginas indexadas, impressões, cliques, CTR e conversões qualificadas. Search Console agrega tráfego dos recursos de IA no tipo Web; registrar essa limitação. Para Bing/Copilot, verificar páginas citadas e consultas de grounding no relatório AI Performance, quando disponível. Citação, clique e lead são métricas diferentes. [Bing: AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c).

Registrar baseline antes da troca e comparar janelas equivalentes de 28 dias, com anotações de lançamento e mudanças editoriais. Observações manuais de respostas de IA precisam guardar pergunta, data, idioma e links; uma resposta isolada não comprova posição estável.

## Validação reproduzível

`npm run build` agora encadeia as etapas com `&&`: imagens, sitemap, ZIP de marca, fallback de metadados, pré-renderização, regras de hosting e auditoria do HTML. `SITE_DIST_DIR` permite validar o pipeline em diretório temporário, preservando o `dist/index.html` que já estava removido. `PUPPETEER_EXECUTABLE_PATH` seleciona o Chrome local quando necessário.

`npm run check:seo` lê o build estático sem executar seus scripts e verifica inventário, canonical, robots, descrição, idioma, H1, JSON-LD, alternates, índice das capacidades e regras de 404. O relatório é escrito em `seo-report.json`; testes de navegador complementam inicialização e navegação. Os relatórios não comprovam indexação, posição ou comportamento efetivo da CDN.

Fontes anteriores preservadas: `docs/site-v2/05-plano.md` (roteiro de busca/redirects), `11-arquitetura-de-conteudo.md` (evitar páginas rasas e repetitivas), handoff `docs/05-producao.md` (SEO seletivo, staging e rollout reversível). Os arquivos congelados de referência permanecem intactos.

## Primeira etapa local de SEO em 22/10/2026

[Relatório consolidado](qa/seo/validation.json): build completo, 241 HTMLs incluindo 404, 195 URLs públicas legadas e 45 rotas nativas ainda sem indexação. A auditoria do HTML terminou com zero falhas e zero avisos; 125 testes passaram. O navegador passou 14 verificações sem erros, incluindo leitura sem JS e texto editorial visível sem executar animações. A regressão nativa registrou 168 medições de layout; o contraste de texto sobre fundo sólido teve 90 medições, dentro do escopo limitado do relatório.

Os testes também identificaram e corrigiram títulos ingleses que recebiam fallback português e erros de inicialização dos snapshots. O gerador de hosting foi exercitado localmente nos modos preview e produção para impedir que um header de staging sobreviva em um diretório reutilizado. “Modo produção” aqui é somente geração de arquivo local; não houve deploy. Esse relatório histórico tinha 25 rotas do protótipo pendentes e não valida alterações posteriores.

## Rodada com famílias operacionais e Ecossistema

Após adicionar 11 rotas, o pipeline completo em `/tmp/catalisa-operations-validated` gerou 250 HTMLs incluindo 404. A auditoria estática registrou 193 URLs legadas públicas e 56 rotas nativas sem indexação, sem falhas ou avisos. A redução das URLs legadas decorre da migração de Studio e Workflows; o total não representa 249 páginas novas do redesign.

[Navegador do build](qa/operations/seo/browser-built.json): 36 verificações com e sem JavaScript, sem exceções. As novas famílias receberam metadados e conteúdo estático, sem liberação de indexação. [Evidências da rodada](qa/operations/README.md). Naquele corte permaneciam 14 rotas do protótipo, além das integrações e da validação de lançamento. Nenhum deploy foi executado.

## Rodada com Banking e Credit

As duas páginas passam a integrar o mesmo inventário sem indexação, com títulos, descrições, canônicos, imagens sociais e grafo próprios. O build final em `/tmp/catalisa-financial-validated` gerou 252 HTMLs incluindo 404. [Auditoria estática](qa/financial/seo/static-audit.json): 193 URLs legadas públicas e 58 nativas sem indexação, sem falhas ou avisos. Esses totais incluem o acervo legado; o protótipo tem 57 de 69 rotas com implementação inicial revisada.

Um timeout em uma capacidade existente interrompeu corretamente uma repetição do build. A rota passou isoladamente com o shell original; a execução do Chrome foi ajustada para desativar limitações de background e usar dois workers, sem reduzir o inventário ou os critérios. A rodada completa posterior passou nas 252 páginas. [Evidências e limites](qa/financial/README.md).

O [navegador do build final](qa/financial/seo/browser-built.json) passou em 40 verificações com e sem JavaScript, sem exceções, incluindo Banking e Credit. Isso valida o artefato local, sem comprovar comportamento do CDN, indexação ou posicionamento.

Restam 12 rotas, integrações reais, revisão editorial, performance, staging/CDN e medição nas ferramentas de busca. Não houve deploy nem liberação de indexação.
