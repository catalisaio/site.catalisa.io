# Análise das inspirações para o redesign Catalisa

A direção mais consistente encontrada no acervo combina **transformação do ruído em estrutura, arquitetura modular explicada por camadas e composição editorial de informação**. Ela começou a formar um padrão concreto no relatório. Para o site, esse padrão precisa conectar uma promessa compreensível, exemplos de produto e uma próxima ação clara.

As 72 anotações individuais são preservadas integralmente no [catálogo](catalogo-inspiracoes.md) e no [caderno visual](design/entregas-bauhaus/referencias.html). As referências numeradas abaixo remetem a esses registros. As escolhas aprovadas da marca estão no [registro da identidade](design/entregas-bauhaus/identidade-transitoria.json); a organização de páginas e as interações propostas aqui são material para o próximo trabalho de redesign.

## Acervo e relações

O inventário contém 72 arquivos principais: 30 imagens com nomes descritivos, um `canvas.png` preto sem informação perceptível, 39 imagens com nomes de hash, a proposta Gemini em PDF e uma página salva do Pinterest. O PDF foi analisado nas suas 12 páginas. Os recursos da página salva foram mantidos junto ao HTML para conservar a captura.

Os nomes escolhidos pelo usuário ajudam a identificar prioridades: “HERO NOISE BECOME SIGNAL”, “EXCELENTE REPRESENTACAO DO CAOS SE ORGANIZANDO NA CATALISA” e “PERFEITA REPRESENTACAO BUILDING BLOCKS CONCEPT”. Esses nomes orientam a leitura do acervo; as decisões finais são as registradas na análise e nas aprovações posteriores.

Há duas relações importantes para não contar repetição como nova direção: as referências 03 e 04 são a mesma composição, e a imagem do garfo na referência 09 corresponde ao assunto principal da página Pinterest 72. O canvas 31 não fornece fundamento para inferir um layout.

## Transformação como argumento de abertura

As [referências 03 e 04](design/entregas-bauhaus/referencias.html#ref-3) mostram pontos dispersos atravessando estágios até formar um sinal organizado. A força dessa composição é apresentar origem, transformação e resultado em uma única imagem. As referências 36 e 56 acrescentam a relação entre dissolução e estrutura; a 61 mostra como variar a organização sem perder continuidade.

No relatório, isso se tornou “integrações → capacidades → produtos/operação”. Para o site, a mesma ideia pode explicar o que acontece quando uma empresa deixa de reconstruir integrações isoladas e passa a compor uma operação sobre capacidades compartilhadas. O texto precisa nomear a entrada e o resultado; o visitante não deve depender da animação para descobrir a oferta.

**Aplicação a explorar:** hero com uma transformação vetorial própria, título curto, explicação do produto em linguagem de negócio e um caminho para conhecer a operação ou ver uma demonstração. A primeira dobra deve continuar legível com movimento reduzido e em tela estreita.

**Revisão já registrada:** não repetir o caos como garfo, fios, frutas e vários aviões na mesma página. A referência 09 funciona como variação da ideia, mas 03 já contém a transformação completa. Partículas são metáfora visual; sua quantidade não representa usuários, requisições ou desempenho.

## Modularidade que revela dependências

As referências [07](design/entregas-bauhaus/referencias.html#ref-7), [11–12](design/entregas-bauhaus/referencias.html#ref-11), [15](design/entregas-bauhaus/referencias.html#ref-15), [27](design/entregas-bauhaus/referencias.html#ref-27), [30](design/entregas-bauhaus/referencias.html#ref-30) e [67](design/entregas-bauhaus/referencias.html#ref-67) formam a família de decomposição e recomposição. A leitura evoluiu de objetos voxelizados para uma vista explodida com rótulos. A referência 30 resolveu a escolha principal porque permite mostrar partes e suas relações.

O relatório materializou três bases: experiência/produto Catalisa, serviços reutilizáveis Building Blocks e infraestrutura Developy. Essa hierarquia é específica da arquitetura documentada. O visitante do site pode começar pelo produto ou pela operação que procura e depois aprofundar as camadas que os sustentam.

**Aplicação a explorar:** um diagrama em SVG com rótulos HTML próximos, mostrando um produto selecionado, suas capacidades e a operação que o sustenta. A seleção de outro exemplo pode evidenciar reutilização da base. Conexões precisam ter origem e destino claros; encaixe visual não equivale a integração automática com qualquer terceiro.

**Revisão já registrada:** cubos não são unidade de produto, serviço ou esforço. Os 42 diretórios BB do snapshot são uma métrica definida, não a confirmação dos “60+ blocos” sugeridos pela proposta Gemini. Não importar personagens, embalagens LEGO ou frutas como identidade do produto.

## Composição editorial e ritmo

As referências [01](design/entregas-bauhaus/referencias.html#ref-1), [05](design/entregas-bauhaus/referencias.html#ref-5), [10](design/entregas-bauhaus/referencias.html#ref-10), [14](design/entregas-bauhaus/referencias.html#ref-14), [16](design/entregas-bauhaus/referencias.html#ref-16), [25](design/entregas-bauhaus/referencias.html#ref-25), [53](design/entregas-bauhaus/referencias.html#ref-53), [59](design/entregas-bauhaus/referencias.html#ref-59) e [69](design/entregas-bauhaus/referencias.html#ref-69) combinam títulos grandes, numeração, linhas finas e campos de cor. A 25 oferece uma estrutura de página; a 61 corrige o risco de usar uma grade rígida em tudo.

O padrão do relatório alterna abertura, diagrama, faixas editoriais, visualizações e leituras detalhadas. O site pode conservar a hierarquia e variar densidade conforme a tarefa: compreender a proposta, reconhecer um caso, comparar aplicações ou iniciar contato. A informação comercial não precisa herdar a densidade de um dossiê técnico.

**Aplicação a explorar:** um sistema pequeno de composições reutilizáveis — hero, faixa de operação, diagrama de arquitetura, exemplo de produto, prova com fonte e chamada de continuidade. Conservar alinhamento, tipografia e espaçamento mesmo quando mudam fundo e proporções.

**Revisão já registrada:** rejeitar pseudocódigos, coordenadas, códigos de barras e números sem significado usados como decoração. Metadados explicam uma fonte ou um estado; o corpo de texto continua legível. Evitar a sequência inteira de cartões idênticos que reduz todas as ideias ao mesmo peso.

## Cor e assinatura da marca

A análise inicialmente explorou mais o laranja de várias inspirações. A correção explícita do usuário acrescentou o amarelo da Catalisa e reafirmou o logotipo principal. O registro aprovado de 21/10 prevalece sobre paletas sugeridas pelas imagens e pelo Gemini.

| Elemento | Valor aprovado | Função no padrão existente |
|---|---|---|
| Roxo | `#734B9C` | Marca, estrutura e títulos |
| Amarelo | `#FDC234` | Ponto do logotipo e destaques em composição com o roxo |
| Laranja | `#FE8342` | Acento complementar em percurso, ação e resultado |
| Papel | `#F4F0E8` | Superfície editorial clara |
| Tinta | `#171320` | Texto e campos escuros |
| Tipografia | Inter local | Títulos fortes e corpo com pesos e escalas distintos |
| Metadados | Monoespaçada | Datas, fontes e referências técnicas |

A [referência 13](design/entregas-bauhaus/referencias.html#ref-13) fornece a regra de destaque por exceção. As referências 17 e 37 acrescentam campos amplos e trilhas com função, sem exigir novas cores. A assinatura oficial está em [logo-full-color.svg](design/entregas-bauhaus/logo-full-color.svg), com origem em [public/brand](../../public/brand/logo-full-color.svg).

As cores não devem ser usadas como o único identificador de camada, estado ou série. A evolução do site pode aperfeiçoar o sistema, mas uma paleta de referência externa não deve se tornar uma mudança silenciosa da identidade aprovada.

## Profundidade, SVG e movimento

As referências 02, 18, 19, 38, 57 e 68 permitem sugerir volume com planos, cortes e conectores. A decisão do estudo foi concentrar profundidade em diagramas que expliquem dependências. As referências 06, 08, 20, 21, 23, 32, 42 e 46 ajudam a desenhar caminhos e continuidade.

**Aplicação a explorar:** movimento curto e orientado por uma passagem de estado — escolher produto, mostrar componentes, seguir uma etapa e chegar ao resultado. O estado estático também explica o sistema. Um diagrama de arquitetura pode ter profundidade; uma comparação quantitativa usa escalas e unidades legíveis.

O estudo dispensou WebGL e iluminação que segue o mouse porque não eram necessários para explicar o relatório. Essa é uma decisão de escopo daquele trabalho, a ser considerada na implementação do site junto de legibilidade, carregamento e manutenção. Nenhuma interação essencial pode depender de hover, de arrastar uma peça com precisão ou de um ciclo de animação terminar.

## Composição móvel e leitura acessível

As referências [22](design/entregas-bauhaus/referencias.html#ref-22) e [29](design/entregas-bauhaus/referencias.html#ref-29) exigem reorganização da composição. Reduzir toda a versão desktop manteria a densidade e tornaria os rótulos ilegíveis.

Para o site, camadas podem virar uma sequência vertical; a linha operacional pode ser dividida em etapas; tabelas e gráficos precisam de alternativa textual adequada; controles precisam funcionar por toque e teclado. Ordem de leitura, hierarquia e resultado permanecem claros com movimento reduzido e sem informação escondida apenas no hover.

O relatório contém capturas desktop/mobile e scripts de verificação históricos. Eles são evidência do trabalho anterior, não uma validação automática das futuras páginas do site.

## Capacidade, produto e prova

As referências 26 e 28 usam a relação objeto/sombra para mostrar potencial. Essa linguagem ajuda a separar a base técnica do que ela habilita, desde que o estado fique explícito. As referências 01, 10, 53 e 62 reforçam unidades, datas e marcos.

No site, uma seção de produtos precisa distinguir aplicação em demonstração, implementação, validação em determinado ambiente e operação comercial. Contagens de PRs ou arquivos de teste podem sustentar uma história de construção; não substituem adoção, receita, cobertura de testes ou SLA. Uma medição histórica de engenharia conserva seu cenário e sua fonte.

O relatório é útil como biblioteca de exemplos e evidências. O conteúdo comercial deve selecionar o que responde à pergunta do visitante e relacionar a afirmação à prova pertinente, sem publicar o inventário interno inteiro por padrão.

## A proposta Gemini

A [referência 71](design/entregas-bauhaus/referencias.html#ref-71) preserva o [PDF original não aprovado](inspiracoes/originais/Proposta%20GEMINI%20%28NAO%20APROVADA%20AINDA%29.pdf) e sua [extração textual](inspiracoes/apoio/inspiracoes-gemini.txt).

São insumos aproveitáveis: contraste de escala, composição técnica, arquitetura explodida, separação entre fundação e aplicações e uma transformação central. Precisam de revisão: navegação muito reduzida, interação dependente de hover, efeitos de luz sem função e a suposição de que todo produto citado já tem uma vitrine operacional.

O estudo rejeitou a substituição da primária por laranja, a alteração do ponto do logotipo, cores extras tomadas das referências e métricas sem base como “100% de clareza” ou prazos universais. A formulação “60+ blocos” não corresponde à métrica de 42 diretórios BB desse inventário. Preservar a proposta como exploração não significa aceitar suas afirmações.

## Mapa de aplicação ao site

| Problema de comunicação | Referências | Aplicação possível | Evidência ou decisão necessária |
|---|---|---|---|
| Explicar a transformação | 03, 04, 36, 56, 61 | Hero ruído → estrutura → operação | Qual promessa e qual audiência lideram a home |
| Explicar a composição | 07, 11, 12, 15, 30, 67 | Diagrama de produto, capacidades e infraestrutura | Produto-exemplo e limites reais das integrações |
| Dar ritmo à página | 01, 05, 10, 14, 25, 53, 59, 69 | Faixas editoriais e composições com densidades variadas | Conteúdo prioritário e hierarquia de navegação |
| Demonstrar progressão | 06, 08, 20, 23, 37, 42 | Sequência de etapas com resultado e controle | Jornada compreensível para o público selecionado |
| Manter personalidade | 13, 17, 32, 38, 57, 64 | Cor por função, escala e profundidade localizada | Compatibilidade com a marca aprovada |
| Explicar produtos possíveis | 26, 27, 28 | Base comum e aplicações com estados explícitos | Situação atual de cada aplicação selecionada |
| Funcionar no celular | 22, 29 | Reorganização vertical e controles legíveis | Verificação na implementação, com teclado e toque |
| Sustentar afirmações | 01, 10, 53, 62 | Prova contextual, fonte, data e unidade | Recorte e autorização de publicação de cada evidência |

## Relação com os estudos de agosto

O [conceito anterior](../site-v2/02-conceito.md), o [benchmark FICO](../site-v2/08-fico-platform-estudo.md) e a [Direção D](../site-v2/04-direcoes.md) exploraram argumentos de negócio e a organização por etapas da relação com o cliente. O usuário valorizou os argumentos da FICO e rejeitou seu visual corporativo.

Esse trabalho pode contribuir com a estrutura do argumento; o acervo de outubro contribui com uma linguagem visual já exercitada. Antes de combinar, reconciliar os nomes das etapas, o produto de entrada, a navegação e as métricas históricas. As seis estações conceituais do estudo de agosto e as seis etapas financeiras do relatório não são automaticamente a mesma taxonomia.

O próximo trabalho deve produzir uma composição própria: proposta de conteúdo, wireframe desktop/mobile, estados de interação e aplicação coerente da identidade. A história do relatório oferece matéria-prima; a home precisa conduzir o visitante à decisão que o site quer facilitar.
