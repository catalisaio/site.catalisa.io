# Medição de desempenho e acessibilidade

`scripts/audit-site-quality.mjs` prepara uma medição sequencial no Chrome, com viewport390×844, escala3, toque, cache desabilitado, latência150ms, download1,6Mbps, upload750kbps e CPU4×. Cada navegação registra FCP, último candidato LCP observado, CLS por janela de sessão, carregamento de fontes, navegação, recursos e tarefas longas. É uma execução de laboratório, sem alegação de Core Web Vitals de campo, INP, Lighthouse, axe ou certificação WCAG. Essas dependências não estão instaladas.

As verificações de DOM cobrem linguagem, main/H1, nomes de controles, alternativas de imagens, imagens quebradas, referências ARIA, IDs repetidos, overflow, erros JavaScript e rastreadores opcionais conhecidos. O teclado exercita skip link, abertura por Enter, Tab/Shift+Tab, Escape, retorno do foco e ausência de deslocamento do H1 nos menus em390/1440px. Os limites de acessibilidade e os valores de desempenho são registrados separadamente no JSON; não existe um score fabricado de aprovação.

Preferir o HTTPS de staging com Caddy, compressão e serviços reais. A autenticação adiciona uma condição própria do staging e não equivale a latência de produção. O script não envia formulários nem executa IA ou mensagens.

```sh
node scripts/audit-site-quality.mjs --origin=https://site-staging.catalisa.io --credentials-file=.local/site/staging-https/access.json
```

Se necessário, `--host-map='MAP site-staging.catalisa.io 177.104.184.38'` resolve o nome no Chromium sem alterar o sistema nem ignorar TLS. Credenciais são lidas em memória e não entram no relatório. `verification.json` só existe depois da execução; este documento não declara aprovação antecipada.

## Fontes

[Compressão verificada](font-compression.json): os três TTFs fornecidos foram preservados e convertidos integralmente para WOFF2, sem subsetting. Total976.172→332.220bytes, redução66%. Foram comparados todos os2.871glifos de cada fonte, seus contornos/componentes, instruções, cmap, métricas e demais tabelas. O ZIP congelado não foi alterado. Regeneração manual: `PYTHONPATH=/tmp/catalisa-font-tools python3 scripts/prepare-redesign-fonts.py`, após disponibilizar fontTools e brotli como ferramentas de build. Produção não depende de Python.

O shell do novo site usa apenas as fontes locais. As páginas legadas preservadas carregam sua família Inter original ao entrar na aplicação de compatibilidade.
