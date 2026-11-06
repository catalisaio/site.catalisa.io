# site.catalisa.io v2 — o novo site institucional

> **Estado:** descoberta fechada · três direções propostas · **nenhuma linha do site novo escrita**
> **Aberto em:** 27/08/2026
> **Origem:** pedido do dono, literal, registrado em `01-descoberta.md` §1.

Este diretório é o registro **completo** do processo — exploração, descoberta, conceito,
direções, decisões e implementação. Ele existe porque o playbook do hotsite
(`wpp.bb.catalisa.io/docs/guides/hotsite-playbook.md`) mediu o custo de pular fases: o
único hotsite que nasceu de uma frase, sem briefing, sem plano de design e sem mockup
aprovado, foi o único que o dono classificou como **ruim** — 78% de CSS morto, zero
imagens, um quinto do conteúdo dos irmãos.

**O site institucional é o maior dos hotsites.** Vale o método inteiro.

## Os documentos, na ordem de leitura

| | Documento | O que responde |
|---|---|---|
| 01 | [Descoberta](01-descoberta.md) | O pedido, o diagnóstico do site atual, e o inventário **medido** do que a Catalisa é hoje |
| 02 | [Conceito](02-conceito.md) | A tese central, a analogia do LEGO refinada, o ativo composto, a nomenclatura, e o que a página **não pode** prometer |
| 03 | [Benchmarks](03-benchmarks.md) | FICO, Microsoft, ServiceNow, Palantir, TOTVS, Stripe, Oracle, Sinqia — o que copiar e o que recusar |
| 04 | [As três direções](04-direcoes.md) | Conceito, público, gramática visual, mapa de páginas e roteiro de cada uma |
| 05 | [Plano de execução](05-plano.md) | As fases com catraca, até substituir o site atual |
| 06 | [Produtos possíveis](06-produtos-possiveis.md) | Ideias de produto ancoradas no que já existe, com o que falta e a unidade de cobrança |
| 07 | [Vis-à-vis com o site atual](07-vis-a-vis-site-atual.md) | O que morre, o que migra, o que estava certo — e as correções que bloqueiam publicação |
| 08 | [Estudo: FICO Platform](08-fico-platform-estudo.md) | A arquitetura de argumento da FICO, o que se copia, o que não — e a Direção D que nasceu dela |
| 09 | [O registro executivo](09-registro-executivo.md) | Por que as direções saíram "startup", as sete regras de registro e o correspondente visual |
| 10 | [Achados da memória](10-achados-do-memory.md) | Três correções factuais, o material novo que o site pode usar, e duas preferências permanentes do dono |
| 11 | [Arquitetura de conteúdo](11-arquitetura-de-conteudo.md) | As seis etapas testadas produto a produto, o mapa de subpáginas e a abordagem para as features |
| 12 | [A escala de papel](12-escala-papel.md) | Como estender o styleguide para o estilo tinta-e-papel sem inventar cor |
| 13 | [**Design system: o contrato**](13-design-system.md) | Normativo. Átomos, moléculas, componentes, regras, movimento e mídia — para quem for construir, humano ou IA |

## Os artefatos

| | onde | o que é |
|---|---|---|
| Direções | `artefatos/2026-08-27-direcoes.html` | mock navegável das quatro direções |
| Estudo FICO | `artefatos/2026-08-27-fico-platform-desmontada.html` | o estudo como artigo — **e a amostra do registro executivo** (`09`) |
| **Sistema visual** | `artefatos/2026-08-27-sistema-visual.html` | **o centralizador**: nove abas, 36 entradas documentadas. Versão viva do `13` |
| Esteira executiva | `artefatos/2026-08-27-esteira-executiva.html` | tentativa de home no registro executivo — superada no conteúdo |

O mock navegável das quatro direções é publicado como Artifact e o link fica registrado em
`04-direcoes.md` §0. Ele é **maquete de direção**, não o site: serve para escolher o
caminho, não para aprovar conteúdo. O artefato fiel — site inteiro, conteúdo final, mídia
final — é a fase F2 do plano, e vem depois da escolha.

## A regra que atravessa tudo

Da §5.7 do playbook, e ela **bloqueia publicação**: caso plausível não é caso factual.
Nenhum número inventado, nenhum cliente inventado, nenhum depoimento inventado. Onde não
houver medição, a página descreve a **condição**, não a quantidade. Todos os números deste
diretório foram contados no código e estão marcados com onde foram contados.
