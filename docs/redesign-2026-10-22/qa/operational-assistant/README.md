# Assistente operacional — página interna

**Publicado e validado em produção:** https://catalisa.io/assistente-operacional · release `20261028-operational-assistant`. Todas as suítes públicas passaram; `production/published.json` consolida as provas.

Escopo aprovado em 28/10/2026: acrescentar uma página ao site real, com os componentes e os sete idiomas atuais. A Home, a narrativa institucional, a oferta principal e os serviços do painel permanecem preservados. A autorização de publicação foi confirmada pelo coordenador após revisão visual e staging.

Página: `/assistente-operacional`. Correspondentes: `/en/operational-assistant`, `/es/asistente-operativo`, `/fr/assistant-operationnel`, `/de/operativer-assistent`, `/nl/operationele-assistent` e `/da/driftsassistent`.

## Conteúdo e demonstração

“Consulte e opere seus sistemas com IA.” A experiência mostra uma negociação selecionada e o assistente lateral: consultar histórico com origem, solicitar mudança de etapa e conferir a ficha e o histórico atualizados. A mudança de Qualificação para Proposta enviada acontece somente em estado React local. O nome da etapa não representa envio de proposta, e-mail ou WhatsApp. Os registros são fictícios. O campo admite múltiplas linhas, reset e três pedidos traduzidos, além de instruções simples equivalentes. Pedidos fora do roteiro não executam tarefas reais.

O recurso aparece como experiência do painel, sustentada por contexto, integrações e permissões; não cria outro SKU nem torna Office requisito universal. CTA leva ao Contato real, sem self service ou envio automático. Analytics usa o mecanismo de consentimento existente e transmite apenas os enums das ações da demonstração, sem o texto digitado.

## Isolamento da release

Base pública: `20261027-hero-clarity`. O repositório compartilhado contém alterações anteriores não versionadas. Por isso o candidato publicado é montado a partir da release pública imutável, com `scripts/assemble-operational-assistant-release.mjs`, e não pela substituição integral pelo novo build.

- Os 680 blocos `<main>` anteriores permanecem byte a byte iguais.
- Os 504 documentos nativos mantêm seus scripts de entrada anteriores.
- Os 2.269 assets anteriores, incluindo os 297 arquivos do grafo ativo de módulos, conservam os bytes.
- Documentos legados, privados, o ZIP da marca e o backend anterior permanecem preservados.
- Cabeçalhos públicos existentes recebem dois links contextuais reais, nos menus Plataforma e completo. Uma extensão pequena de navegação reinsere os links após a montagem do React antigo. Não consulta APIs, grava dados ou altera funcionalidades.
- Somente as sete páginas novas usam o runtime novo. Ao sair delas para outra rota, a navegação documental restaura o runtime aprovado daquela rota.
- Acrescentam-se as sete imagens OG e as entradas correspondentes de sitemap, inventário e hosting.

O build integral foi usado para validar a nova página e gerar seus recursos; seus snapshots antigos não foram promovidos. Os primeiros relatórios de comparação AST em `.local/operational-assistant-integration` são diagnósticos de desenvolvimento, não a prova de isolamento do candidato final. A prova final é `final-runtime-isolation.json`.

## Arquivos principais

Implementação: `src/redesign/OperationalAssistant.tsx`, `operational-assistant.css`, nova rota em `App.tsx` e `i18n/routes.ts`, link contextual em `HeaderView.tsx` e metadados em `src/seo/redesign.ts`. As sete traduções foram acrescentadas sem alterar as chaves existentes; `translation-merge.json` registra o merge e o catálogo incremental registra a cobertura. O arquivo `Home.tsx` conserva o hash anterior.

Estratégia e roteiro: `docs/estrategia-oferta-componivel/assistente-operacional*.md`. O protótipo independente em `preview-operacional/` continua como referência, sem definir a navegação do site real.

## Evidências

`delta-assembly.json`, `final-artifact-comparison.json` e `final-runtime-isolation.json` explicam a mudança exata. `home-preservation/verification.json` compara conteúdo, geometria e tipografia após montagem efetiva do React, em sete idiomas e duas larguras. Os relatórios em `candidate/`, `staging/` e `production/` percorrem as quatro larguras, pedidos digitados, teclados, traduções e fronteiras entre os runtimes. As verificações HTTP conferem os bytes reais, formas com e sem barra, HTTPS, 404 e sessão anônima401. Nenhum contato ou mensagem real é enviado.

TypeScript, 32 testes de roteamento/SEO e 74 testes de analytics passaram. O build gerou 685 snapshots; o candidato passou na auditoria estática de 684 páginas com zero falhas. Os três avisos de títulos duplicados são idênticos aos da release anterior.

## Operação e rollback

Release preparada: `20261028-operational-assistant`. Staging usa18181; o candidato de produção usa o slot green18183. O upstream anterior18182 e sua release `20261027-hero-clarity` são mantidos. O script oficial de corte guarda a configuração anterior do edge e restaura18182 se a identidade HTTPS não confirmar a release.

Rollback, dentro do CT105, usando os arquivos privados arquivados no corte:

```sh
SITE_PRODUCTION_APPROVAL=20261028-operational-assistant \
SITE_PRODUCTION_APPROVAL_RECORD=/root/catalisa-site-cutovers/20261028-operational-assistant/approval.json \
SITE_PREVIOUS_PORT=18182 SITE_CANDIDATE_PORT=18183 \
bash /root/catalisa-site-cutovers/20261028-operational-assistant/site-production-cutover.sh \
20261028-operational-assistant --rollback
```

Não exige reconstruir assets, alterar dados, parar o serviço anterior ou trocar configuração do backend. Nenhum segredo integra este documento ou os relatórios públicos de QA.
