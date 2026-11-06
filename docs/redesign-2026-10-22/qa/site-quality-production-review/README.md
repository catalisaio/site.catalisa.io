# Desempenho no artefato de produção revisado em staging

Execução real no HTTPS autenticado de staging em25/10/2026, revisão20261025-prod-review. Todas as páginas usaram `/assets/index-CeDtICB3.js`. Mesmo perfil da baseline:390×844, cache frio,150ms,1,6Mbps, CPU4×. TLS/BasicAuth e as condições do staging fazem parte desta medição. Uma execução por rota; não representa dados de campo ou garantia de ranking.

| Rota | LCP anterior | LCP revisado | CLS revisado | Bytes antes → depois |
|---|---:|---:|---:|---:|
| `/` | 5.79s | 3.27s | 0.021034 | 1072→500KB |
| `/arquitetura` | 5.48s | 2.18s | 0.000000 | 858→286KB |
| `/contato` | 4.85s | 2.40s | 0.000245 | 761→250KB |
| `/lab` | 5.28s | 2.10s | 0.000000 | 858→286KB |
| `/capacidades` | 1.34s | 1.04s | 0.035756 | 857→394KB |
| `/ecossistema/banking` | 3.52s | 2.14s | 0.000466 | 871→359KB |
| `/ecossistema/credit` | 3.80s | 2.27s | 0.000137 | 817→414KB |

Os sete casos passaram nas verificações focadas de DOM, nomes/labels, referências ARIA, imagens/fontes, overflow e exceções. Não houve download dos chunks legados monitorados nem rastreadores externos. A inspeção ESM do artefato também confirma o App legado fora do grafo das17 páginas nativas.

Skip link, Enter, Tab/Shift+Tab, Escape e retorno do foco passaram em390/1440px. Menu mobile e os dois menus desktop deslocaram o H1 em0px. Esse ensaio não equivale a certificação WCAG ou teste em aparelhos físicos.

O CLS do Contato caiu de0,128450 para0,000245. O loading que preserva a geometria e a leitura única antes do primeiro commit foram verificados no código e no browser. O campo `passed` se refere às verificações funcionais/DOM/teclado; LCP e CLS são medições, sem score fabricado.

A Home permaneceu a rota mais lenta: LCP3,272s, candidato `/redesign/financial-city.webp` com113.386bytes. A mesma navegação carregou a imagem de Arquitetura100.566bytes, JS inicial66.690bytes e três fontes Latin151.520bytes. A última mudança autorizada acrescenta um preload persistente de imagem no HTML da Home, sem alterar JavaScript, imagem ou geometria; seu impacto ainda será medido no staging final.

As fontes Latin foram usadas e os SVGs podem reutilizar o alias local Inter. Catálogo e Credit também carregaram a face completa de400 para caracteres fora da faixa Latin; o fallback integral foi preservado intencionalmente. Nenhum glifo original foi removido da cobertura combinada.

Relatório completo: [verification.json](verification.json). A baseline anterior permanece em [site-quality-staging](../site-quality-staging/README.md). Não interpretar esta melhoria como publicação em produção; o domínio público não foi alterado por este ensaio.
