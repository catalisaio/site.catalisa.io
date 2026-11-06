# Trabalho após a publicação do site

## Urgente — geração no Contato e no Lab

Solicitado pelo usuário em 26/10/2026: executar **depois do site no ar**, nos dois fluxos. A geração está lenta; o consumo elevado de tokens é uma suspeita a medir, não um valor já apurado. Esta otimização não faz parte do corte atual de publicação.

- [ ] Medir tempo de ponta a ponta e por etapa: salvar contexto, solicitar IA, validar a saída e abrir o conceito. Comparar p50/p95 de Contato, Lab e refinamento.
- [ ] Instrumentar tokens de entrada/saída, chamadas por conceito e custo real, sem registrar dados pessoais ou conteúdo de conversas em analytics.
- [ ] Reduzir contexto e catálogo enviados ao modelo e tamanho da saída, mantendo a qualidade do conceito e a validação de conexões.
- [ ] Avaliar modelo e configuração apropriados para cada operação, com comparação de custo, latência e qualidade em cenários reais curtos.
- [ ] Eliminar chamadas redundantes e reprocessamento. Preservar idempotência, recuperação de conexão e versões salvas.
- [ ] Validar os ganhos nos dois fluxos, incluindo refinamento, erros e retomada; definir metas a partir da medição inicial.

Critério de conclusão: apresentar comparação antes/depois de latência, tokens e custo, com a mesma bateria de cenários de qualidade. Não reduzir garantias de persistência ou publicar conceitos inválidos para encurtar a espera.
