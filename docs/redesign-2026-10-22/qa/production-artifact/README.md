# Artefato local em modo de produção

[Validação consolidada](validation.json),25/10/2026. Diretório `/tmp/catalisa-production-candidate`, compilado com `VITE_SITE_RELEASE=redesign VITE_SITE_INDEXING=enabled CONTEXT=production` e `--emptyOutDir`. Essa configuração gera um candidato indexável; não constitui autorização de deploy público.

TypeScript e Vite passaram. Duas rotas críticas foram pré-renderizadas primeiro (`/en` e `/contato`) para comprovar inicialização da compatibilidade e do app novo. Em seguida, o pipeline completo gerou257 HTMLs e a auditoria de256 páginas terminou sem falhas ou avisos. O sitemap contém255 URLs públicas. A guia e as áreas autenticadas permanecem fora da busca. Os144 arquivos de marca conferem com os originais.

O navegador passou41 verificações sem exceções, incluindo sessão anônima401, Contato/Lab prontos, conteúdo sem JavaScript, URLs preservadas, aliases, navegação entre aplicações, rotas autenticadas e HTTP404. As258 entradas HTML da aplicação e o shell usam o mesmo módulo atual. A inspeção de917 arquivos não encontrou arquivos privados nem os valores dos segredos configurados.

[A inspeção do grafo ESM emitido](native-bundle.json) percorre imports estáticos do bootstrap, do app novo e de seus17 módulos de páginas. A aplicação legada foi preservada fora desse grafo, sem marcadores dos frameworks antigos nos29 chunks da união nativa. O agrupamento automático do Rollup é usado no redesign; o build legado conserva sua estratégia anterior. Downloads reais e desempenho devem ser novamente medidos no staging atualizado.

O primeiro módulo da rota e seu CSS são preparados antes de substituir o snapshot. O Contato faz uma leitura limitada da sessão antes do primeiro commit React;401 mostra a introdução,200 retoma a etapa salva e falhas mantêm retry. O loading preserva a geometria do HTML público e não revela a introdução a quem está retomando. StrictMode não duplica essa leitura.Os testes direcionados passaram, e a suíte final congelada de231 testes também passou antes da geração r2. Nenhuma conversa privada foi inserida na pré-renderização.

Fontes Latin de151.520bytes e suas faixas Unicode complementares usam os arquivos completos preservados quando necessário. Os aliases Catalisa Inter e Inter compartilham as mesmas URLs, inclusive nos SVGs. [Evidência de contornos, métricas e cobertura](../site-quality/font-subsets.json). Originais e ZIP não foram alterados.

A geração atual é a r2, com fluxo direto para atendimento humano sem IA e preload de imagem da Home derivado pelo pré-renderizador. Não foi reutilizado HTML de outra compilação.

A r2 foi instalada no HTTPS de staging protegido, com bytes públicos e de servidor idênticos aos preparados para produção. Passaram os fluxos reais de atendimento direto sem IA, três contatos com IA/refinamento, Lab com reload/continuidade e inbox com login, abertura, atribuição, resposta, reload e logout. As evidências e os hashes finais estão em [acceptance-r2.json](../release/acceptance-r2.json).

A última medição da Home registrouLCP3,032s eCLS0,021034; o preload foi utilizado, mas o objetivo de2,5s não foi atingido nessa simulação. Não se declara100% de desempenho. [Relatório e limites](../home-preload-production-review/README.md).

Permanecem a aprovação visual/editorial e da política pelo responsável, autorização explícita antes de publicar em produção e decisão sobre a coleta real de insights de mercado (implementada/testada, ainda desativada). A produção permanece inalterada.
