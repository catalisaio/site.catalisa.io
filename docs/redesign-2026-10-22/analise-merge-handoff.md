# Reconciliação do protótipo v1.1 com o acervo Catalisa

Data: 22/10/2026. Insumo novo N01: [pacote preservado](novos-insumos/catalisa-handoff-v1.1/README.md). Origem: ZIP fornecido pelo usuário, com protótipo criado no ChatGPT. Este merge é de referências, conteúdo e decisões; não declara merge Git, publicação ou integração operacional.

## Direção resultante

O novo site apresenta a Catalisa como base de capacidades combináveis para construir produtos e conectar operações. Preservar a Home “A forma segue a conexão.”, a cidade financeira, a navegação por plataforma/ecossistema, Visão em `/visao/`, o Lab no topo e as composições distintas de cada página. Banking e Credit demonstram a relação entre capacidade, experiência e operação. A jornada comercial se aproxima do visitante por meio de uma ideia e de seu contexto.

O pedido atual autoriza implementar o redesign. A restrição histórica `notAuthorizedNow` no JSON de 21/10 descreve aquela entrega do relatório; não bloqueia o trabalho solicitado agora. A assinatura oficial continua sendo uma instrução explícita do `AGENTS.md` atual.

## Hierarquia das fontes

| Fonte | Autoridade neste trabalho | O que permanece histórico |
|---|---|---|
| Instrução atual do usuário + `AGENTS.md` | Escopo, fidelidade ao conteúdo, assinatura oficial | — |
| N01 v1.1 | Home, direção, navegação, conteúdo das 69 rotas, interações e sequência de contato | Mocks e contratos propostos não comprovam backend |
| Identidade aprovada em 21/10 | SVG oficial, roxo/amarelo, função da geometria e evidência contextual | Densidade e composição do relatório não são um template do site |
| 72 referências e análises | Princípios de composição, transformação, modularidade e mobile | Não são assets licenciados para publicação |
| `docs/site-v2` | Vocabulário de negócio, fronteiras, responsabilidade humana e cautela com alegações | Mote, árvore de seis etapas e sistema editorial serifado de agosto foram superados pelo protótipo fornecido |

## Conflitos e decisões

Atualização em 23/10/2026: D15 supera D04 e as menções à exceção de assinatura antiga em D13. As demais entradas preservam o histórico das decisões anteriores.

| ID | Conflito | Decisão e aplicação |
|---|---|---|
| D01 | Agosto propõe “Conversa vira decisão”; N01 aprova “A forma segue a conexão” | Preservar o título e a explicação da Home v1.1. O argumento operacional anterior permanece nas páginas pertinentes. |
| D02 | Agosto organiza tudo por seis etapas; N01 organiza plataforma e produtos | Adotar as 69 rotas do N01. Não impor seis etapas à agenda, IAM ou infraestrutura. |
| D03 | Agosto usa serifas/Instrument/IBM; outubro e N01 usam Inter | Inter local 400/500/600; títulos com a escala e o peso da referência. Não importar a densidade de títulos do relatório. |
| D04 | N01 redigita `catalisa` em `#56319A`; instrução atual exige SVG Catalisa. | Usar `public/brand/logo-full-color.svg`, roxo `#734B9C`, ponto `#FDC234`. Não promover o símbolo `c.` ou as exportações divergentes a marca oficial. A referência original permanece intacta. |
| D05 | Relatório usa papel `#F4F0E8`, laranja `#FE8342` e tinta `#171320`; N01 usa outras cenas | Conservar os tokens de marca; adotar papel de site `#F6F3EE`, grafite `#1A1D23`, laranja de cena `#F18A43`, lavanda `#E9E3EE`, profundo `#35213F` como papéis de composição. Não recolorir o bitmap da Home. |
| D06 | Agosto proíbe grades de capacidades; N01 aprova catálogo em grid | Preservar grid com domínio, busca, maturidade, vazio e limpar. Detalhes são explicação de negócio, com documentação no começo; não copiar documentação técnica inteira. |
| D07 | Agosto restringe sombras/raios; N01 usa materialidade e telas | Materialidade é localizada em cenas e molduras. Controles seguem sóbrios. A regra antiga não elimina a cidade, as interfaces ou as instalações aprovadas. |
| D08 | O relatório registra 42 diretórios; N01 seleciona 39 capacidades; agosto menciona 32 | São métricas de escopos/datas diferentes. “39 capacidades nesta seleção editorial” descreve o catálogo do pacote; nenhum desses números vira quantidade atual de serviços ou tração comercial. |
| D09 | N01 tem `noindex,nofollow`; o site atual tem SEO público | Manter previews e conteúdo individualizado fora de indexação. Corte de domínio, redirects, sitemap e indexação exigem migração completa e validação; não trocar metadados de toda a produção durante o estudo. |
| D10 | N01 simula lead, IA e entrega; objetivo exige serviços reais | Migrar a experiência para estado React e backend com adaptadores. Nunca manter timers como prova de cadastro, geração, entrega ou atribuição. H04–H10 permanecem requisitos. |
| D11 | Agosto exige modo escuro automático; N01 compõe cenas claras e profundas com intenção | Preservar as cenas e os fundos aprovados. Não aplicar recoloração automática baseada no sistema operacional à Home e aos produtos; um modo escuro integral exigiria uma composição própria e validação, não um filtro global. |
| D12 | Módulos intermediários contêm trechos substituídos por wrappers na geração final | O HTML final e os estados no navegador são a autoridade visual/editorial. Arquitetura usa o convite ao Lab e à clínica da Luna, conforme o HTML v1.1, em vez do exemplo de frotas que permaneceu no módulo intermediário. Os testes comparam a implementação nativa ao artefato renderizado. |
| D13 | Em 23/10 o usuário apontou muitas discrepâncias e rejeitou a impressão de adaptação do site antigo | Usar uma aplicação independente para o preview do novo site; comparar composição, tipografia e geometria com o HTML final. Rotas com código e testes técnicos não equivalem a aprovação visual. Preservar somente a exceção explícita da assinatura oficial. |
| D14 | A primeira frente de SEO acrescentou uma seção à Home aprovada | Retirar esse acréscimo da composição. Presença em busca deve aproveitar a estrutura sem impor novas seções ao desenho aprovado. As alternativas de hero pedidas em 23/10 continuam em discussão, sem escolha aplicada. |
| D15 | Usuário apontou que o press kit e os logos diferem do ZIP e confirmou que ele contém a identidade nova | Preservar a identidade e os arquivos de marca do ZIP no press kit do site novo, incluindo assinatura, símbolo, avatares, capas e paleta. A substituição feita por D04 estava desatualizada. Aplicação geral da identidade aos demais produtos e materiais é futura, não deve ser executada agora. Não modificar o relatório histórico, o painel ou os building blocks. |

## Relação com as inspirações

As relações abaixo usam as análises existentes, não alegam uma nova inspeção de todos os 72 originais. O [catálogo](catalogo-inspiracoes.md) mantém as anotações individuais.

| Referências | Princípio | Aplicação N01 e decisão de uso |
|---|---|---|
| 03, 04, 36, 56, 61 | Ruído encontra estrutura | Manter a transformação na segunda seção da Home; a cidade lidera a abertura aprovada. |
| 07, 11, 12, 15, 27, 30, 67 | Independência, decomposição e reuso | Arquitetura, biblioteca, composições e exemplos de produto. Partes têm rótulos/responsabilidades; não são contagem de esforço. |
| 01, 05, 10, 14, 25, 53, 59, 69 | Ritmo e hierarquia editorial | Intervalos, escala e famílias distintas; não usar os mesmos três cartões em todas as internas. |
| 06, 08, 20, 23, 37, 42 | Percurso e continuidade | Workflows e jornada de crédito; estados respondem aos controles, sem fingir execução real. |
| 13, 17, 32, 38, 57, 64 | Cor com função e profundidade localizada | Roxo organiza; laranja participa da cena; amarelo pontua; o SVG oficial mantém a marca. |
| 22, 29 | Reorganização móvel | Testar 320/390/768/1440; reordenar camadas, manter texto e controles, sem esconder vazamento globalmente. |
| 26, 27, 28 | Capacidade e aplicação | Catálogo apresenta responsabilidade; Banking/Credit apresentam uma experiência; demonstração não é produto instalado para o visitante. |

## Evidências abertas nesta etapa

Foram lidos o PDF completo por extração textual, as pranchas visuais das páginas 3 e 4, todos os documentos principais do handoff, o gerador, os validadores e os módulos centrais. Foram abertas no Chrome 14 rotas representativas: Home, Visão, catálogo, IAM, Arquitetura, Studio, Workflows, Agentes, Governança, Desenvolvedores, Banking, Credit, Lab e Contato. As capturas desktop/mobile e 56 medições estão em [qa/reference](qa/reference/inspection.json). São estados iniciais com movimento reduzido; não certificam todos os estados, contraste ou integração.

Também foram consultados os 72 registros individuais de `referencias.json`, com observação e decisão, e uma montagem das 70 miniaturas de imagens existentes. Isso permite conferir a relação visual entre transformação, camadas, campos de cor e reflow sem alegar uma nova inspeção integral dos originais em resolução plena ou das 12 páginas da proposta Gemini. Os registros 71/72 continuam tratados conforme a análise preservada; o PDF Gemini permanece não aprovado.

O validador original encontrou 69 rotas, um H1 por rota, vínculos locais existentes, JavaScript sintaticamente válido, fixture de conceito válido e checksums íntegros. Isso prova integridade do handoff; não prova produção.

## Mapa para o repositório

| Referência | Destino de implementação | Cuidado |
|---|---|---|
| `build.mjs` + wrappers `cPage` | Rotas React lazy + dados tipados por família | Não executar wrappers globais em produção |
| HTML/CSS da Home | Componentes de seção preservando ordem, copy, mídia e proporções | Comparação visual antes de substituir `/` |
| `design/tokens.*` | `src/redesign/tokens.css`, [styleguide](styleguide.md) | Tokens propostos foram reconciliados em D03–D05 |
| Navegação e rodapé | Componentes React, menu com foco e Escape, links reais | Preservar políticas e termos do site existente |
| `blocks.json`, `B_STORIES`, produtos | Dados editoriais versionados e componentes de catálogo/detalhe | Revalidar maturidade e fontes antes de indexar |
| `contact.js`, `contact-demo.js` | Máquina de estados, cliente BFF, renderer estruturado | Três respostas → nome → persistência → conceito → confirmação |
| `CATALISA_LAB_ENGINE` | Cliente de geração comum ao Contato | Nenhum segredo/tenant no browser |
| `contracts/*` | Contratos do site + adaptadores server-side | Propostas, ainda não verificadas contra ambiente instalado |
| `assets/connection`, `assets/screens` | Mídia selecionada em `public/redesign` | Não copiar todo `dist` ou fontes internas para publicação |
| `routes.json` | Mapa de migração e futuro registro SEO | Manter inglês, Academy, apresentações e URLs antigas até decidir redirects |

Stack verificado: React 19, Vite 7, TypeScript, Chakra 2, React Router, i18next; Netlify Functions já disponível, Supabase no legado, prerender por Puppeteer. Preservar essa infraestrutura. Alterações de pricing e outros arquivos que já estavam no worktree são independentes deste trabalho.

O [mapa das 69 rotas](mapa-migracao.json) aponta arquivo de referência, componente nativo quando existente, preview e colisão com rota legada. Estado atual: 1 Home em preview, 43 rotas nativas em staging local (catálogo/detalhes, Visão, Arquitetura e Desenvolvedores), 25 rotas ainda sem migração nativa. As demais rotas existentes do site não foram removidas.

## Próximas entregas obrigatórias

O [controle H01–H16](implementacao.md) mantém a abrangência original: todas as famílias e estados, backend, integração Catalisa, isolamento de sessão, persistência idempotente, geração/revisão de conceito, atendimento, privacidade, SEO, acessibilidade, performance e staging/rollback. Um styleguide ou preview isolado não encerra o objetivo.
