# Páginas, componentes e conteúdo

## Navegação
Topo: assinatura, Plataforma, Ecossistema, Perspectivas, CTA “Imagine seu produto”, Visão e menu completo. No mobile, marca, Lab e menu. O menu da plataforma deve continuar oferecendo Arquitetura, Building blocks, Composições, Studio, Workflows, Agentes IA, Governança, Desenvolvedores e referência de APIs, conforme o código atual. Lab também aparece como caminho de exploração.

A navegação não precisa expor todos os detalhes dos 39 building blocks; o catálogo organiza essa profundidade. Evitar dois nomes diferentes para a mesma rota: `/visao/` é **Visão**. A URL técnica `/capacidades/` tem rótulo editorial **Building blocks**.

## Famílias de página
| Família | Função | Composição dominante | Comportamento |
|---|---|---|---|
| Home | Apresentar a tese e abrir caminhos | Cidade financeira, editorial, capacidades, produtos | Navegação e explorações locais |
| Visão | Explicar o sentido da marca | Escultura geométrica, manifesto e princípios | Troca de princípio e estado visual |
| Arquitetura | Explicar composição e responsabilidades | Camadas, percursos, verticais e conexões | Abas, detalhes e exemplos |
| Building blocks | Ajudar a encontrar uma capacidade | Domínios, busca e grid | Busca e filtros locais |
| Detalhe de bloco | Traduzir documentação em contexto de negócio | Papel, exemplos, jornada e relações | Links de documentação e capacidades |
| Studio | Dar forma à construção | Atelier, perfis e interfaces contextualizadas | Atendimento, Crédito, Relacionamento, Banking e Copiloto |
| Workflows | Tornar o percurso compreensível | Construção visual, gatilho e exceção | Cenários e etapas locais |
| Agentes IA | Relacionar propósito, contexto e ferramenta | Lente e demonstração de atuação | Papéis e permissões simuladas |
| Governança | Explicar limites e responsabilidade | Equilíbrio, pedido/aprovação e histórico | Estados demonstrativos, sem autorização real |
| Desenvolvedores | Dar caminhos de adoção | Código, arquitetura e receitas | Modos e exemplos de contrato |
| Banking | Explicar titular, canais e operação | App/desktop/console, percurso e posição | Abas, saldo ilustrativo e modal de prints |
| Credit | Explicar o ciclo de crédito | Dossiê, jornada e acompanhamento | Etapas, pendências, modalidades e prints |
| Demais produtos | Contextualizar a composição | História setorial e capacidades | Links, limites e vitrines |
| Perspectivas | Ligar mercado, produto e arquitetura | Editorial visual com fontes | Filtros e exemplos de leitura |
| Contato | Transformar conversa em contexto útil | Conversa integrada à página e conceito | Briefing, nome, demo, revisão e continuidade |
| Lab | Imaginar um produto | Briefing e mesa visual | Modelos locais; adaptador de motor futuro |
| Press-kit | Distribuir os recursos da marca | Logo, c., aplicações e paleta | Downloads e cópia de cor |

## Componentes que merecem preservar identidade
- **Cidade financeira:** imagem de mundo construído, não diagrama de infraestrutura; arquivo `financial-city.webp`.
- **Catálogo:** grid de capacidades com domínios e filtros, em `platform.js` e `platform.css`.
- **Princípios de Visão:** formas e texto mudam juntos; `about.js` e `about.css`.
- **Workflows:** SVG e leitura por etapas; `workflows.js/css`. A execução é local, não roda workflows reais.
- **Agentes:** contexto, ferramenta e limite demonstrados juntos; `agents.js/css`.
- **Governança:** separação entre solicitar, revisar e aprovar; `governance.js/css`.
- **Galeria integrada:** origem, moldura, modal, zoom, navegação e retorno de foco; `experience.js/css`, com chamadas específicas em Banking/Credit/Studio.
- **Contato:** fluxo de identidade antes da demo; `contact.js`, `contact-demo.js` e seus CSS.
- **Lab:** `CATALISA_LAB_ENGINE` é ponto de extensão, não integração já instalada.
- **Press-kit:** `presskit.js/css` e `assets/brand/`. Preservar as exportações; conferir licenças e proporções.

## Conteúdo completo e inventário
`inventario-paginas.csv` lista as 69 rotas, família, título, H1, arquivo de referência e módulo principal. `conteudo-atual.json` mantém texto renderizado, headings, links, imagens e controles do HTML inicial de cada página. O HTML e o JS preservados em `reference/site/` continuam sendo a fonte de reprodução exata, incluindo conteúdos que só aparecem depois de interação.

A extração de texto não tenta reconstruir a semântica de toda ilustração. Alguns labels de SVG e captions aparecem junto do corpo. Para migrar, conferir a página visualmente e consultar o módulo responsável por seus estados.

## Mapa de implementação
`build.mjs` executa os módulos em uma VM, resolve `cPage()` e gera HTML para todas as rotas. O navegador recebe HTML pronto e scripts para interatividade. Módulos redefinem funções anteriores por wrappers, cuja ordem de carregamento importa. Esse mecanismo é suficiente como referência, mas não precisa ser reproduzido literalmente no framework de produção.

Ao migrar, converter cada família em componentes e dados explícitos. Evitar manter uma cadeia crescente de substituições globais de `cPage`. Criar camadas para conteúdo, estado, visual e serviços. Uma troca de stack não deve alterar os textos aprovados, as metáforas ou a hierarquia sem uma decisão registrada.
