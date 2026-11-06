# Baseline real do HTTPS staging

Medição em25/10/2026, no HTTPS autenticado real, com certificado válido. Chrome390×844, cache frio,150ms de latência,1,6Mbps e CPU4×. Uma navegação por rota, sem inferência de Core Web Vitals de campo ou INP.

| Rota | LCP medido | CLS | Recursos transferidos |
|---|---:|---:|---:|
| `/` | 5.79s | 0.021 | 1072KB |
| `/arquitetura` | 5.48s | 0.000 | 858KB |
| `/contato` | 4.85s | 0.128 | 761KB |
| `/lab` | 5.28s | 0.000 | 858KB |
| `/capacidades` | 1.34s | 0.000 | 857KB |
| `/ecossistema/banking` | 3.52s | 0.000 | 871KB |
| `/ecossistema/credit` | 3.80s | 0.000 | 817KB |

As verificações focadas de DOM e teclado passaram, sem exceções JavaScript, falhas de fontes/imagens, overflow ou rastreadores externos. Skip link, Enter, Tab/Shift+Tab, Escape e retorno do foco passaram em390/1440px; os dois menus não deslocaram o H1 (0px). O campo `passed` dessa rodada se refere a essas verificações, não à aprovação de desempenho.

A medição identificou um problema concreto: todas as rotas nativas baixavam chunks legados de Chakra (~112KB), ícones (~88KB), apresentações (~77KB), playbooks (~70KB), motion e i18n. O entrypoint importava helpers de rota que alcançavam o hook de tradução e o agrupamento automático dos chunks legados. A correção em source separa dados puros de caminho e limita o agrupamento manual a módulos explícitos. Ela ainda não integra este staging medido.

O Contato registrou CLS0,128 ao substituir o snapshot por loading e depois pela introdução. A correção preparada mantém a geometria estática, carrega a rota e lê a sessão uma vez antes do primeiro commit React, preserva loading para quem retorna e trata401/200/erro separadamente. Três testes de bootstrap e o teste do shell/no-JS passaram; a redução de CLS precisa ser medida no artefato novo.

Fontes Latin de151.520bytes com complemento integral e alias local Inter também aguardam o novo artefato. Esta baseline usava332.220bytes de fontes completas. Os originais e o ZIP não foram alterados.

É obrigatório repetir esta medição no artefato final em staging antes de declarar os problemas resolvidos. O script atualizado também reprova downloads legados e registra o módulo de entrada e os elementos/retângulos envolvidos em layout shifts.
