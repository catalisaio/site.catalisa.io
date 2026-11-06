# Migração das famílias operacionais e Ecossistema

Rodada local de 22/10/2026. Nenhum deploy; painel e building blocks não alterados. O conteúdo final do handoff N01 permanece congelado e prevalece sobre funções intermediárias substituídas por wrappers.

## Implementação

`prepare-redesign-operations.mjs` e `prepare-redesign-ecosystem.mjs` convertem offline o HTML final em JSX com o compilador `compile-redesign-html.mjs`. Os estados ilustrativos usam funções da referência somente no gerador offline e tornam-se estados React declarativos. Não há `eval`, bindings globais ou `dangerouslySetInnerHTML` no runtime dessas páginas. CSS é isolado por família; os sete novos caminhos recebem metadados próprios e continuam sem indexação.

As 10 capturas operacionais mantêm os bytes, dimensões e origem no manifesto de assets. O diálogo nativo permite ampliar, ajustar/100%, avançar, voltar e fechar com Escape; devolve o foco ao botão de origem. Esses controles não executam operações do produto.

Correções observadas: a órbita decorativa de Studio interceptava cliques no protótipo; elementos decorativos nativos não interceptam o ponteiro. Foram corrigidos textos com contraste insuficiente, foco sobre fundo escuro, seletor de pausa e SVG `feDropShadow` que o parser HTML do gerador convertia para minúsculas. Capturas de QA carregam as imagens lazy antes do screenshot.

## Evidências

- [Famílias operacionais](verification.json): 16 medições em 320/390/768/1440 px; 300 comparações de estados (Studio 12, Workflows 42, Agentes 12 e Governança 9, em cada largura), teclado, cenários de falta/falha, permissão de preparação, aprovação por outra pessoa, reset, FAQ, pausa e galerias.
- [Capturas finais](visual-refresh.json): atualização nas duas larguras de imagem após as correções de contraste e carregamento; preserva o relatório funcional de 300 estados.
- [Composições e Ecossistema](../ecosystem/verification.json): 28 medições, 12 comparações dos três estados de composição, copy, destinos dos links, estrutura SVG, imagens, teclado e navegação até uma capacidade e de volta ao catálogo.
- [Contraste](../native/contrast.json): 112 medições em 56 rotas, sem falhas no texto HTML contra fundos sólidos computados. Exclui imagens, gradientes, SVG, pseudo-elementos e estados não medidos; não é certificação WCAG.
- Build completo em `/tmp/catalisa-operations-validated`: 250 HTMLs incluindo 404; [auditoria estática](seo/static-audit.json) de 193 URLs legadas públicas e 56 nativas sem indexação, sem falhas ou avisos. [Navegador do build](seo/browser-built.json): 36 verificações com e sem JS, sem exceções. TypeScript e 126 testes unitários passaram. A referência original voltou a passar com 69 rotas e checksums íntegros.

Nos testes operacionais, os cliques nativos usam ponteiro real. Na referência congelada, a escolha dos estados usa `node.click()` porque a órbita original obstrui parte dos controles. A referência não foi editada. A comparação prova o conteúdo dos estados; não atesta que todos os controles do protótipo original sejam operáveis por ponteiro.

As rotas têm implementação inicial revisada, não aprovação de lançamento. Integrações reais de assistente, persistência, lead e atendimento, revisão de fontes/alegações, performance mobile, aparelhos físicos, staging/CDN e liberação seletiva de indexação continuam pendentes.
