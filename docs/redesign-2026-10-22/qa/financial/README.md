# Banking e Credit: migração local

As duas páginas foram convertidas do HTML final congelado de N01 para componentes React. O gerador offline `scripts/prepare-redesign-financial.mjs` extrai somente dados e artefatos da referência; controles e estados pertencem à aplicação nativa, sem injeção de HTML ou bindings legados no navegador.

## Evidências

- [Verificação funcional](verification.json): oito medições em 320/390/768/1440 px, 100 comparações de estados e oito conjuntos de interação. Banking: três canais, três camadas, quatro momentos e três posições ilustrativas. Credit: quatro etapas, três leituras do dossiê e cinco modalidades. Inclui setas/Home/End, próximo/reset, captura de cada contexto visível, ajuste/100%, navegação da galeria, Escape e retorno do foco.
- Os testes reproduziram os dois vídeos locais e verificaram tempo avançando, duração e pausa. São montagens visuais H.264 com 12 segundos e sem faixa de áudio, segundo `ffprobe`; não representam operação ao vivo.
- [Capturas finais](visual-refresh.json): atualização após os ajustes de contraste em 390/1440 px, preservando o relatório funcional de 100 estados.
- [Contraste de texto HTML](../native/contrast.json): 116 medições em 58 rotas, sem falhas contra o fundo sólido computado. O primeiro levantamento identificou textos de apoio claros demais; as correções escurecem textos em áreas claras e usam papel em áreas escuras. Não cobre imagens, gradientes, SVG, pseudo-elementos, todos os estados ou aparelhos físicos; não é certificação WCAG.
- TypeScript e 126 testes unitários passaram. As 16 capturas e os dois vídeos mantêm os bytes da referência; o manifesto de seleção passa a reunir 35 assets. Revisão de direitos, dados e alegações continua em H11.

## Integração e limites

As demonstrações não chamam serviços bancários, não decidem crédito nem executam movimentações. O texto mantém a distinção entre exemplo, protótipo, captura de staging e implementação. A galeria aceita uma coleção por família e preserva a coleção anterior do Studio, verificada depois da navegação pelas páginas novas.

O build completo precisa passar junto com a auditoria do artefato. Um timeout observado em `/capacidades/bureaus` interrompeu a geração corretamente; a rota passou isoladamente com o shell original. A execução do Chrome passou a desabilitar limitações de background e usar dois workers, mantendo todas as rotas e critérios de validação. O relatório final deve demonstrar a rodada completa; o diagnóstico de uma rota não o substitui.

O [prerender final](seo/prerender.json) passou com 252 HTMLs incluindo 404. A [auditoria estática](seo/static-audit.json) verificou 193 URLs legadas públicas e 58 nativas sem indexação, sem falhas ou avisos. Esses números incluem o acervo legado; o redesign tem 57 de 69 rotas com implementação inicial revisada.

O [navegador do artefato](seo/browser-built.json) passou em 40 verificações com e sem JavaScript, sem exceções. A [validação consolidada](validation.json) registra contagens, limites e hashes de origem desta rodada.

Nenhum deploy nesta execução. As páginas continuam sem indexação; revisão editorial, performance, integração real, staging/CDN e autorização de lançamento permanecem necessários.
