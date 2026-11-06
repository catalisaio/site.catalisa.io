# Última medição da Home r2

Execução real em `https://site-staging.catalisa.io`, protegida por BasicAuth e noindex, na revisão r2 com o mesmo artefato preparado para produção. Módulo observado: `/assets/index-DF_ROU9L.js`. Não houve alteração no domínio público.

| Medida | Resultado |
|---|---:|
| LCP |3.032ms |
| LCP anterior sem preload |3.272ms |
| Baseline inicial |5.792ms |
| CLS |0,021034 |
| FCP |1.208ms |
| Recursos transferidos |499.960bytes |

O preload foi utilizado: a imagem LCP `/redesign/financial-city.webp` passou a ser descoberta pelo link do head (`initiator=link`). Ela manteve113.386bytes, dimensões e pixels. Os testes do helper verificam idempotência, preservação da composição e seleção responsiva. A regra está no pré-renderizador, sem edição manual do JavaScript compilado.

Não houve exceção JavaScript, overflow, imagem/fonte quebrada, rastreador externo ou download dos chunks legados monitorados. Esta invocação mediu apenas a Home; o teclado e os demais fluxos já têm evidências separadas na revisão de produção e nos smokes finais r2.

O LCP permaneceu acima da referência de2,5s. Portanto, esta frente não declara100% de desempenho nem certificação Core Web Vitals. São duas medições individuais de laboratório, com cache frio, viewport390×844,150ms de RTT,1,6Mbps e CPU4×, incluindo as condições do HTTPS/BasicAuth de staging; não representam aparelho físico ou tráfego de campo. A melhoria observada não garante posicionamento em busca.

A otimização encerra nesta revisão, conforme o escopo combinado. Os resultados completos estão em [verification.json](verification.json); o estado geral, as aprovações pendentes e os hashes estão em [acceptance-r2.json](../release/acceptance-r2.json).
