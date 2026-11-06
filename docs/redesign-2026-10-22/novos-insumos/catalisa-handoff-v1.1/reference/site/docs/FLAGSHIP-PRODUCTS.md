# Banking e Credit — vitrines dos produtos

## Escopo
Refatoração dedicada de /ecossistema/banking/ e /ecossistema/credit/, preservando a identidade Catalisa com composições próprias. As legendas Banking também recebem contexto mais preciso na página de interfaces, que utiliza os mesmos metadados.

## Banking
Hero com app e desktop integrados a uma base SVG. Três pontos de vista com navegação por teclado: app, desktop e console. Arquitetura com foco em três responsabilidades. Percurso de uma operação pelo lado do titular e da equipe. Exemplo local de saldo sem reserva, com reserva e em conferência. Oito capturas distintas com modal, zoom e navegação; montagem de vídeo existente; capacidades e contexto de maturidade.

## Credit
Hero escuro com dossiê SVG animado e captura principal. Quatro momentos exploráveis: receber, avaliar, formalizar e acompanhar. Exemplo de leitura com informações reunidas, dado pendente e revisão humana. Cinco modalidades sobre uma base comum. Oito capturas distintas, incluindo acordos, monitoramento e portal do parceiro. Vídeo, capacidades e links cruzados com Banking.

## Fontes consultadas em 22/10/2026
- catalisaio/wpp.bb.catalisa.io, docs/design/conta-app/guia/index.html, blob f37423ed2a35d92bd5f77da7d8d3955a9c7ac877. Guia de 29/09/2026, distinguindo protótipos e console implementado.
- Mesmo repositório, docs/guides/credito-em-camadas-guia.md, blob 19d66f2346dba8ff949f4e0c6aff23c873c3139e. Guia atualizado em 25/09/2026, com camadas, percursos e limites.
- https://docs.catalisa.app/blocks/banking/ e /blocks/baas/: responsabilidades e estágios Alpha/Beta.
- assets/blocks.json: nomes, links e maturidades. platforms.js e experience.js: origem das capturas. Banking identifica os protótipos e a captura em aparelho de 09/10/2026.

## Limites
Interações locais e explicativas: não executam análise, autorização, cadastro de operação ou transação. Vídeos são montagens de referência. Capturas não são ao vivo. Uma interface não confirma disponibilidade completa nem homologação de parceiros.

## Verificação
Build de 69 páginas; sintaxe JS; referências locais; um h1 e IDs únicos por página. Desktop: abas e teclado, arquitetura, estados de saldo, modal e zoom. Mobile: 320 e 390 px, correção de transbordamento do percurso Banking, etapas, dossiê e galeria. Vídeos usam os MP4 existentes de 12 segundos, com controles nativos.
