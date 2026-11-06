# Catalisa — v1.1

A v1 aprovada permanece recuperável no histórico de versões do Sites. `releases/v1.json` registra o ID imutável, o commit e o hash do arquivo publicado antes desta revisão.

## Mudanças

- Sobre (`/visao/`): narrativa própria de marca, escultura SVG animada, manifesto, princípios interativos, composição, Banking/Credit e responsabilidade humana. Sem métricas ou histórico empresarial inventados.
- Mobile: leitura e espaçamento, títulos longos, grades e limites de largura, menus com rolagem e foco contido, alvos de toque, formulários com texto de 16 px, navegação por seções e galeria ampliada ajustada à altura disponível.
- Ajustes específicos em catálogo e detalhes, arquitetura, Studio, Workflows, Agentes, Desenvolvedores, perspectivas, press-kit, Banking, Credit, Lab e contato. As composições de desktop são mantidas, exceto a nova Sobre.

## Verificação

- 69 rotas × 3 larguras de iframe (320, 390 e 768 px): 207 medições de largura da página, contagem de H1 e palavras quebradas em títulos. Scrollbars clássicas reduzem a área interna disponível em 15 px. Tolerância de largura: 2 px, para bordas/arredondamentos.
- Resultado bruto em `docs/qa/mobile-v1.1.json`. Esta verificação mede layout inicial; não representa testes funcionais de todas as combinações de estado.
- Interações verificadas no navegador: princípios de Sobre; menu mobile e Escape; busca no catálogo retornando uma capacidade; modal de captura; contato com três respostas, nome antes do conceito e avanço de tela no produto demonstrativo.
- Geração de 69 páginas, sintaxe JavaScript e verificação estática de links/recursos locais, IDs únicos e um H1 por rota.
- Evidência visual em `docs/qa/sobre-v1.1.jpg`.

O protótipo de contato continua local e simulado. Não foram conectados IA, leads, canais ou atendimento real nesta revisão. Os testes foram feitos no Chromium disponibilizado no ambiente; não substituem uma rodada em dispositivos físicos iOS/Android.
