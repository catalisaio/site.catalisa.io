# Styleguide do novo site Catalisa

Versão: site-2026.10 / 22/10/2026. Derivado do protótipo v1.1 fornecido pelo usuário, reconciliado com a identidade oficial e o acervo. [Decisões e origem](analise-merge-handoff.md). A referência visual exata permanece em [N01](novos-insumos/catalisa-handoff-v1.1/reference/site/). A aplicação viva começa em `/design-system`, no app React, sem indexação.

Aplicações nativas: `/design-system/home`, `/capacidades/` e os 39 detalhes, `/visao/`, `/arquitetura/` e `/desenvolvedores/`. A Home pública e as famílias restantes ainda não foram substituídas. [Cobertura e limites da implementação](implementacao.md).

## 1. Propósito e linguagem

“A forma segue a conexão.” A Catalisa apresenta capacidades combináveis que criam produtos, conectam operações e dão estrutura às ideias. O site é referência de marca e arquitetura; os produtos aprofundam o contexto comercial. Público: liderança de negócio, produto/arquitetura, desenvolvimento e operação. A primeira explicação é de negócio; o contrato técnico fica disponível por escolha.

Uma seção comunica uma ideia principal. O título pode ser expressivo; o parágrafo seguinte explica responsabilidade, contexto ou resultado. Usar “capacidade”, “composição”, “produto”, “workflow”, “agente”, “Studio” e “governança” com sentidos distintos. Exemplos são identificados como ilustrativos. Produção, Beta e Alpha expressam o recorte de uma fonte, nunca garantia da composição inteira.

Não publicar clientes, depoimentos, métricas ou certificações inventados. Não importar promessas de prazo ou preço de estudos antigos. Uma captura não comprova homologação; um evento recebido não comprova entrega; uma geração conceitual não cria um SaaS em produção.

## 2. Assinatura

**Atualização de 23/10/2026:** o usuário confirmou que os logos e o símbolo do ZIP são a identidade nova. As regras antigas dos dois parágrafos abaixo ficam superadas para o redesign. O press kit deve apresentar e distribuir as exportações de `reference/site/dist/assets/brand` intactas. A aplicação geral aos demais produtos e materiais fica adiada por instrução explícita. Não recolorir nem reconstruir os arquivos fornecidos; o relatório mantém sua identidade histórica.

Usar o [SVG oficial](../../public/brand/logo-full-color.svg), com proporção intrínseca, letras roxas e ponto amarelo. Nunca redigitar, distorcer, recolorir o ponto ou aplicar sombra. A assinatura em minúsculas e o símbolo `c.` do handoff ficam preservados como referência divergente, sem substituir a identidade oficial. A rota de press-kit precisa distribuir somente exportações reconciliadas.

No header, largura alvo 132 px desktop e 112 px mobile, limitada pelo espaço real do SVG, com área livre mínima equivalente à altura do ponto em todos os lados. No rodapé, 112 px. Link com nome acessível “Catalisa — início”; a imagem não duplica o nome se o link já o fornece. Sobre cenas escuras, usar uma base clara com área livre ou uma variante oficial validada; não improvisar nova assinatura.

## 3. Tokens de cor

| Token CSS | Valor | Função |
|---|---|---|
| `--c-brand` | `#734B9C` | Marca, ação principal, estrutura e foco |
| `--c-yellow` | `#FDC234` | Ponto oficial, ênfase e pequenos pontos de conexão |
| `--c-orange` | `#FE8342` | Acento complementar da identidade |
| `--c-paper` | `#F6F3EE` | Fundo principal do site, preserva a referência v1.1 |
| `--c-paper-report` | `#F4F0E8` | Procedência do relatório; uso em material desse contexto |
| `--c-ink` | `#1A1D23` | Texto principal do site |
| `--c-body` | `#62596A` | Prosa de apoio |
| `--c-muted` | `#716678` | Metadados legíveis sobre papel |
| `--c-rule` | `#CBC6C0` | Separação decorativa; não é borda suficiente para todo controle |
| `--c-control-border` | `#87778F` | Limite de inputs/controles sobre papel |
| `--c-lavender` | `#E9E3EE` | Campo de arquitetura e catálogo |
| `--c-warm` | `#EEE8DF` | Campo editorial quente |
| `--c-deep` | `#35213F` | Campo escuro de produto ou percurso |
| `--c-scene-orange` | `#F18A43` | Materialidade e volume das cenas do protótipo |
| `--c-scene-soft` | `#ED9E62` | Escultura da Visão e detalhes de cena |
| `--c-scene-purple` | `#B69BCF` | Volume e planos secundários |
| `--c-danger` | `#A12636` | Erro descrito também em texto |
| `--c-success` | `#356449` | Confirmação sustentada por estado real |

Cenas podem conservar cores locais do SVG/bitmap original, documentadas no módulo. Não transformar toda variação de luz em token global. Não recolorir a cidade para fazê-la coincidir com uma amostra plana.

Combinações de texto: tinta/corpo/roxo sobre papel; papel sobre profundo; tinta sobre amarelo/laranja. Laranja ou amarelo sobre papel não servem para texto crítico. Nunca usar apenas cor para maturidade, erro, seleção ou estado. Contraste alvo: 4,5:1 para texto normal; 3:1 para texto grande e componentes. Recalcular contra o primeiro fundo opaco de cada cena; o [relatório de exemplos](novos-insumos/catalisa-handoff-v1.1/design/contrast-examples.json) não cobre todo o site.

## 4. Tipografia

Inter local, pesos 400, 500 e 600 do pacote. Fontes publicadas como WOFF2 quando possível; nesta primeira aplicação, preservar TTF local com `font-display: swap`, sem rede externa. Verificar licença antes da distribuição pública final. Metadados: `ui-monospace, SFMono-Regular, Consolas, monospace`, sem nova fonte baixada.

| Papel | Desktop | Mobile | Regra |
|---|---|---|---|
| Home H1 | `clamp(64px,7.7vw,120px)` / .99, 500 | `clamp(48px,12.7vw,65px)` / 1.02 | Tracking -.065em; preservar as duas linhas do original |
| H1 interno | `clamp(48px,6.3vw,90px)` / 1.01 | 37–54 px conforme família | Frase completa, sem corte ou quebra forçada de palavra |
| H2 | `clamp(30px,3.3vw,51px)` / 1.08 | 30–36 px | Tracking -.055em |
| H3 | 24–34 px / 1.15 | 23–31 px | Peso 500; papel conforme composição |
| Prosa | 16–18 px / 1.6–1.8 | 16 px / 1.7 | Coluna de 55–72 caracteres |
| Navegação/controle | 14 px / 1.5 | 14–16 px | Área de toque, não a letra, define o alvo |
| Metadado/legenda | 12–14 px / 1.6 | mínimo 12 px | Não carregar instrução essencial em tipo microscópico |
| Input | 16 px / 1.5 | 16 px | Evita zoom de formulário no iOS |

Pesos e hierarquia leves do protótipo prevalecem sobre os títulos pesados do relatório. Ênfases em itálico de markup antigo são expressas por cor/peso, mantendo sans sem itálico. Não reduzir prosa para fazer uma cena caber. Labels essenciais dentro de SVG precisam de equivalente textual; legendas de prints não substituem descrição acessível.

## 5. Espaço e composição

Container desktop: 88,6% da viewport, máximo 1600 px. Até 700 px, margens de 22 px; até 360 px, 18 px. Componentes flex/grid têm `min-width: 0`. Espaços: 4, 8, 12, 16, 24, 32, 48, 64, 96 px; seção editorial em torno de 96 px desktop/48–64 px mobile. Exceções preservam as proporções visuais do N01.

Alternar: abertura tipográfica, imagem integrada, diagrama, faixa editorial, painel funcional, campo escuro. Consistência vem de alinhamentos, linguagem e ritmo. O catálogo usa grid; manifesto usa prosa/escultura; produto usa canais/telas/jornada. Não transformar o site em uma sequência uniforme de hero + três benefícios + CTA.

Desktop: header 100 px; intermediário 85 px; mobile 78 px. Menu pode rolar dentro da altura útil. Home móvel reorganiza texto, cidade, arquitetura e produtos verticalmente. Não aplicar `overflow-x:hidden` ao documento para esconder um erro. Overflow local deliberado só para código, tabelas ou zoom de mídia, com controle acessível.

## 6. Componentes e contratos

| Componente | Existe para | Estados e requisitos |
|---|---|---|
| `BrandMark` | Assinatura oficial navegável | Tamanho estável; SVG; nome acessível |
| `SiteHeader` | Plataforma, ecossistema, perspectivas, Visão e Lab | Menu por clique, `aria-expanded`, Escape, foco contido/retornado; Lab visível no mobile |
| `SiteFooter` | Caminhos e continuidade | Documentação, contato, marca, privacidade e termos reais |
| `TextLink` | Aprofundamento contextual | Seta decorativa; foco visível; externo com `noopener` quando abre aba |
| `Action` | Próxima ação dominante | Repouso, hover, foco, ocupado, impedido; ocupado não indica sucesso |
| `Field` | Resposta/identificação/filtro | Label persistente, ajuda, erro associado, 16 px, `autocomplete` apropriado |
| `Status` | Maturidade ou trabalho | Texto + símbolo; estado vindo de fonte/servidor, sem semântica só cromática |
| `Tabs` | Alternativas equivalentes | Setas, Home/End, foco móvel; painel ligado por IDs, seleção e texto/arte coerentes |
| `Accordion` | Abrir camada sem perder contexto | `<details>/<summary>` ou botão semântico; funciona por teclado |
| `CapabilityTile` | Encontrar responsabilidade | Domínio, nome, apoio, maturidade e link; grid com busca, limpar e vazio |
| `CapabilityDetail` | Avaliar uma peça no negócio | Papel + fonte + maturidade no início; exemplo, valor, dependências e limites |
| `ProductScene` | Conectar canais e operação | Telas com origem e escopo; dados ilustrativos identificados |
| `MediaDialog` | Ler prints em escala adequada | Fechar visível, Escape, foco, zoom, navegação, retorno ao disparador; altura útil móvel |
| `MotionControl` | Pausar ambiente contínuo | Botão com estado textual/`aria-pressed`; respeita movimento reduzido |
| `BriefingConversation` | Compreender ideia e contexto | Editar, voltar, erro, retomada autorizada e histórico |
| `ConceptRenderer` | Materializar o conceito estruturado | JSON validado; telas e jornada determinísticas; nunca HTML/JS do modelo |
| `DeliveryReview` | Confirmar canal/contexto | Não envia antes da confirmação; recebido/entregue/atribuído separados |
| `SourceNote` | Tornar uma prova verificável | Origem, data, unidade/escopo e link; ilustração não é case |

Raio de controles: 0–4 px; sem elevação decorativa em cada bloco. Sombras ficam em materialidade de cenas, screenshots e modais quando úteis. Ícones: SVG nativo, `currentColor`, nome acessível quando necessário. Não usar emoji como substituto de ícone de produto.

Botões e links de controle: alvo mínimo 44×44 px; foco 2 px de roxo com offset de 4 px em papel, ou amarelo em campo profundo. Disabled não depende apenas de opacidade. Mensagem de erro explica a recuperação e mantém a entrada. Loading anuncia trabalho; `aria-live="polite"` só para a mensagem curta, sem reler a página inteira.

## 7. Famílias e fidelidade

| Família | Mensagem/metáfora | Preserve |
|---|---|---|
| Home | “A forma segue a conexão.” / cidade financeira | Ordem das seções, copy, cidade, transformação, arquitetura, Banking/Credit, Studio, perspectivas, contato |
| Visão | “Dar forma ao que vem depois.” / escultura | Princípios trocam texto e forma; manifesto e relação com produtos |
| Arquitetura | Menos trabalho repetido / base recombinada | Verticais, responsabilidades e distinção motor/esteira |
| Catálogo + 39 detalhes | Peças com propósito / biblioteca | Grid, domínios, busca/maturidade, documentação inicial e casos de uso |
| Studio | Dê forma ao que precisa funcionar / atelier | Perfis distintos, interfaces e perguntas de construção |
| Workflows | O próximo passo tem um porquê / percursos | Gatilho, condição, paralelo, exceção e continuidade |
| Agentes | Entender contexto, agir com sentido / lente | Papel, ferramenta e limite juntos |
| Governança | Confiança tem estrutura / equilíbrio | Solicitar/revisar/aprovar e histórico visível |
| Desenvolvedores | Seu código, mais possibilidades / contrato | Adoção por API, modos e exemplos sem confundir com endpoint instalado |
| Banking | Uma conta, várias formas de operar | Titular/app/desktop/console, posição, jornada e origem das telas |
| Credit | Crédito tem começo, a operação continua | Política/mesa/modalidade/pendência/formalização/carteira |
| Ecossistema e demais produtos | Base comum, identidades próprias | Produtos por contexto, responsabilidades e fontes; sem falso case |
| Perspectivas + artigos | Pensar também é construir | Composições editoriais, fonte/data, filtros e leitura longa |
| Lab | O que você quer construir? | Briefing → representação visual, e não chat genérico |
| Contato | Dar forma à próxima conversa | Três respostas, nome, identidade persistida, resumo/conceito e continuidade |
| Press-kit, Interfaces, Fontes, Mapa | Recursos e orientação | Origem, links, downloads corretos e exposição seletiva |

Todas as 69 rotas constam no [inventário original](novos-insumos/catalisa-handoff-v1.1/inventario-paginas.csv). Preservar inglês, Academy, apresentações e rotas legais do site atual; o plano de redirects deve mapear cada mudança, sem fazer toda URL desconhecida retornar a Home com status 200.

## 8. Geometria, mídia e movimento

Círculo: contexto/foco; arco: continuidade; plano: capacidade/camada; conector: relação com origem e destino; volume: montagem de produto. Uma figura decorativa não deve simular medição. Usar SVG para relação e interação; raster para cidade, materialidade e cenas complexas. Nunca texto técnico pequeno numa imagem gerada.

A Home usa `financial-city.webp`, preservando luz, material e espaço. Screenshots mantêm proporção, descrição, data/origem, identificação de captura/protótipo e possibilidade de ampliar. Usar dimensões intrínsecas, poster e lazy loading abaixo da dobra. Só carregar vídeo/galeria maior após necessidade; sem áudio automático. As montagens de Banking/Credit são filmes de telas, não execução ao vivo.

Transição de estado: 180–400 ms. Ambiente: ciclo de aproximadamente 12 s com pausa. Traço pode revelar transformação; conteúdo e resultado existem desde o estado estático. `prefers-reduced-motion` remove ambiente e transições não essenciais. Não depender de hover, scroll preso, timer ou fim de animação para informação ou conclusão. Diálogo respeita altura útil e mantém o botão fechar acessível.

## 9. Contato, Lab e verdade dos estados

Sequência obrigatória: ideia → público/contexto → objetivo/direção → nome → identidade provisória + lead persistidos → resumo → conceito → ajustes → continuidade. Nome não identifica unicamente uma pessoa. Não antecipar e-mail obrigatório nem inventar endereço para satisfazer API. Persistir cada resposta e relacionar versões. Retomada exige sessão opaca autorizada; nenhuma recuperação por nome.

Estados de persistência: não iniciado / salvando / salvo / falhou. Estados de geração: aguardando / em fila / processando / pronto / falhou / expirou. Estados de atendimento: pedido confirmado / recebido / em fila / entregue / atribuído / falhou. A interface nunca avança para “salvo”, “pronto”, “entregue” ou “pessoa assumiu” com base em tempo decorrido.

Modelo retorna apenas JSON restrito com capacidades permitidas, telas, participantes, jornada e limites. Validar tamanho, slugs, IDs, referências e campos desconhecidos no servidor. Renderer usa nós/texto controlados. Alterações criam versão ligada ao briefing; resultado anterior fica no histórico como superado. Falha preserva respostas e permite retry idempotente.

Canal é escolha explícita. Mostrar o contexto que será enviado e pedir confirmação antes do encaminhamento. Envio usa outbox/estado persistido e adaptador real; webhook assinado e deduplicado confirma entrega/atribuição. Se um canal estiver indisponível, oferecer somente alternativa operacional verificada. Demonstração local precisa ser identificada e escolhida; não substituir silenciosamente uma falha de IA.

## 10. Dados, analytics e segurança

Tenant, credenciais e chamadas privadas ficam no BFF. Cookies de sessão HttpOnly, Secure e SameSite apropriado; autorização por sessão; validação de origem/CSRF, limites de tamanho/custo/frequência e timeout. Separar conteúdo de conversa de logs técnicos; guardar correlação e transições, não prompts brutos ou dados pessoais em ferramentas genéricas.

Eventos seguem [contracts/events.json](novos-insumos/catalisa-handoff-v1.1/contracts/events.json), após mapear para a instrumentação real. Medir início/conclusão de briefing, geração e intenção/resultado de encaminhamento com categorias agregadas. Não enviar nome, e-mail, telefone ou conversa para GTM/Clarity. Desabilitar captura de texto nas superfícies privadas. Finalidade, retenção, exclusão e acesso precisam constar da política real antes de habilitar coleta.

Conversas e conceitos privados: `noindex`, sem sitemap, sem URL pública de conteúdo e com isolamento de acesso. Noindex não é controle de autorização. Sessão e idempotência precisam de persistência compartilhada; memória da Function não basta.

## 11. Acessibilidade e responsividade

Validar 320, 390, 768 e 1440 px, zoom de 200%, teclado e movimento reduzido; validar aparelhos Safari/iOS e Chrome/Android antes do lançamento. Ordem DOM segue leitura. Um H1; regiões e hierarquia de headings; skip link; labels persistentes; erros associados; status anunciados; modais com foco/retorno; tabs com setas; mídia com controles e transcrição quando pertinente.

Conteúdo não desaparece apenas para eliminar overflow. Telas densas têm resumo legível e ampliação; rótulos essenciais fora da imagem. Cor não é a única pista. Testar todos os estados de galeria/menu/conversa; estado inicial sem overflow não comprova acessibilidade de uma família.

## 12. SEO, performance e publicação

Preservar HTML estático legível e a montagem interativa do projeto, títulos e descrições por rota, canônico e social. A [estratégia de SEO para busca e IA](seo-busca-e-ia.md) registra decisões, fontes, intenções e medição. O bloco explicativo da Home e o índice completo do catálogo complementam o conteúdo aprovado por solicitação de SEO de 22/10, sem substituir a manchete. Indexar somente páginas públicas revisadas. A versão inglesa não pode receber texto português por fallback silencioso. Registrar redirects e comportamento de 404. Preview do sistema fica fora do sitemap e sem indexação.

Carregar conteúdo, estilos e JS por família; evitar fontes duplicadas e todos os prints no primeiro load. Fazer preload somente da fonte/hero necessários. Medir LCP/CLS/INP no build e em dispositivo móvel; nenhuma meta é declarada atingida sem medição. Conservar dimensões, imports lazy e assets selecionados.

Staging primeiro, com dados fictícios e canais de teste. Conferir H01–H16, integração e falhas críticas, política, logs/alertas/fila e responsável. Corte de domínio e indexação em mudança separada; preservar build anterior e exercitar retorno. A existência do pacote ou deste guia não libera publicação.

## 13. Governança do sistema

Cada mudança registra data, fonte, conflito, decisão, componente e evidência. Atualizar tokens e amostras vivas na mesma alteração. Revisar conteúdo junto com layout, preservando a referência original e os hashes. Não afirmar revisão dos 72 originais ou produção real com base em screenshot, fixture ou teste estreito. O [controle de implementação](implementacao.md) distingue implementado, verificado e pendente.

Na migração de Studio, Workflows, Agentes, Governança e Composições, as demonstrações passam a ter estado React explícito. O compilador offline converte o HTML final e estados finitos em JSX; não executa os bindings legados nem injeta HTML no navegador. Capturas usam diálogo nativo com origem, legenda, ajuste/100%, navegação, Escape e retorno do foco. A navegação das tabs inclui setas, Home e End. [Evidências e limites desta rodada](qa/operations/README.md).
