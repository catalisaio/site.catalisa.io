# Direção visual e sistema de estilo

## Conceito
Minimalismo Bauhaus interpretado para uma plataforma contemporânea: geometria legível, intenção na composição, hierarquia forte e espaço disponível. A intensidade vem de uma peça visual expressiva e de mudanças de ritmo. Não depende de multiplicar elementos, efeitos ou cartões.

A experiência deve ter momentos quase artísticos, mas continuar orientando o olhar. Uma seção pode ser rica em SVG e outra quase só tipográfica. O vazio faz parte do sistema, não é conteúdo faltando.

## Paleta adotada no site
| Papel | HEX | Uso |
|---|---|---|
| Roxo da assinatura | #56319A | Marca e algumas aplicações do press-kit |
| Roxo de apoio | #734B9C | Ações, estrutura e referência recorrente no CSS |
| Amarelo do ponto | #FDC234 | Assinatura e acentos pontuais |
| Laranja expressivo | #F18A43 | Contraponto de energia e aplicações da marca |
| Papel | #F6F3EE | Fundo principal, áreas de leitura |
| Grafite | #1A1D23 | Texto e aplicações escuras |

Esses valores são os apresentados pelo press-kit desta implementação. Não confundir com um manual corporativo imutável. A assinatura em minúsculas e as exportações atuais devem ser conciliadas com os arquivos oficiais mantidos pela Catalisa.

## Cores de cena
Lavandas, lilases, papéis quentes e roxos profundos aparecem nas páginas. Exemplos reais: #E9E3EE no sistema global; #EEE8DF e #ED9E62 na Visão; #35213F no hero de Credit; #D9C8E4 em cenários de interfaces. Essas cores são variações expressivas, não novas cores primárias.

Recomendação para produção: mapear as cores recorrentes para papéis semânticos e preservar exceções justificadas por cena. O `design/tokens.json` é uma proposta de consolidação; não é uma extração perfeita de todos os valores existentes.

Não usar amarelo ou laranja pequeno sobre papel para texto crítico. Não supor que combinações claras do protótipo passam contraste. O relatório de contrastes identifica exemplos que precisam de ajuste preservando a intenção visual.

## Tipografia
Inter é a família do site. A referência fornece arquivos locais de pesos 400, 500 e 600. Títulos usam peso leve ou regular, espaçamento apertado e linhas curtas. Textos explicam a ideia com entrelinha confortável. Metadados monoespaçados são secundários e não devem carregar uma informação essencial em tamanho microscópico.

Recomendação: corpo principal entre 16 e 18 px; metadados que precisam ser lidos entre 12 e 14 px; entradas de formulário com 16 px no mobile. O CSS atual ainda contém legendas menores em cenas e prints; revisar sem ampliar indiscriminadamente todo texto de uma interface ilustrada.

## Composição e ritmo
- Alternar aberturas tipográficas, imagem integrada, cenas SVG e áreas escuras.
- Usar grade como estrutura, não como obrigação de fazer tudo em cards.
- Reservar uma mensagem dominante por seção; grupos de apoio ficam subordinados.
- Variar relações de largura e posição. Editorial assimétrico, catálogo e demonstração funcional pedem composições diferentes.
- Manter alinhamentos, margens, cor e tipografia como sinais de família.

O wrapper global usa largura de 88,6% e limite de 1600 px no desktop. Em telas menores, a margem passa a valores fixos. Isso descreve a referência; o repo de produção pode converter para tokens e containers equivalentes sem alterar o resultado visual.

## Geometria
Círculos, arcos, quadrantes, planos, linhas e volumes representam conexão, capacidade, caminho, evidência ou continuidade. Cada figura deve ter uma função na narrativa. Evitar repetir a mesma escultura em todas as páginas só para dar aparência de sistema.

Home usa a cidade financeira; Visão organiza formas independentes; Workflows usa uma construção de percursos; Agentes trabalha foco/contexto; Governança equilibra responsabilidades; Credit trabalha dossiê e continuidade; Banking conecta canais e operação. Preservar essa diferença de metáforas.

## Imagens
A imagem principal da Home representa um produto financeiro como pequena cidade. Manter estilo, cores, composição espacial e sentido de ecossistema. Um novo asset deve preservar materialidade, luz e contraste da família, sem introduzir um banco de imagens corporativo genérico.

Prints de produto precisam de moldura, escala, legenda e papel no conteúdo. Integrar em desktop, app, painel ou cena; permitir ampliação quando a leitura exigir. Preservar proporção e não recortar dados necessários à explicação. Diferenciar captura implementada, protótipo e ilustração. Consultar os metadados já presentes no código.

## SVG e animação
Preferir SVG nativo para relações arquiteturais, estados e componentes que precisam responder à interação. Imagens raster são adequadas para materialidade e cenas mais ricas. Não desenhar texto técnico pequeno dentro de uma imagem gerada.

Movimento deve orientar continuidade, foco ou transformação. Ambientações lentas podem repetir; transições de estado devem responder ao controle. Nunca usar movimento como única indicação de status. Respeitar `prefers-reduced-motion`, oferecer pausa nos visuais contínuos que a referência já controla e manter a leitura estável.

## Vídeo
Os vídeos existentes de Banking e Credit são montagens curtas de telas, não execução ao vivo. Manter a identificação. Produção pode substituir por gravações atuais, com roteiro, poster, controles, legenda e transcrição quando houver fala ou informação sonora. Evitar autoplay com som e downloads pesados no início da página.

## Mobile
Preservar composição e ordem de leitura; não encolher tudo. Reorganizar grids, reduzir ornamentos, manter títulos inteiros e disponibilizar controles confortáveis. Uma galeria precisa caber na altura útil, manter fechar visível e oferecer zoom com rolagem controlada. Diagramas extensos podem ter uma visão resumida e aprofundamento; não esconder informação relevante com overflow global.

## Antipadrões rejeitados
Hero idêntico em todas as páginas; três cards de benefícios em todas as seções; uma mesma animação de complexidade reciclada; excesso de texto antes da primeira demonstração; combinações de cor que parecem vivas mas tornam a leitura fraca; dashboard solto no papel; excesso simultâneo de títulos, chips, bordas e legendas; CSS que oculta o vazamento sem reorganizar o componente.
