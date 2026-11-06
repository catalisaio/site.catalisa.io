# Site Catalisa

As instruções de arquitetura, comandos e padrões existentes estão em `CLAUDE.md`.

## Publicação

Orientação do usuário em 22/10/2026: não publicar em produção sem aviso e validação prévia em staging. Apresentar o resultado validado e obter autorização explícita antes do deploy de produção. Não publicar o painel nem alterar os building blocks como consequência de mudanças neste site.

## Preview local durante a implementação

O usuário pediu em 22/10/2026 um preview local contínuo no browser para testar as mudanças enquanto são feitas. Manter o servidor local ativo entre etapas, com HMR, e informar seu endereço. `VITE_REDESIGN_PREVIEW=1 npm run dev -- --host 127.0.0.1` mostra a Home nova em `/` somente em desenvolvimento; builds de produção preservam a rota principal existente até o corte autorizado. Não encerrar esse servidor na conclusão de uma etapa enquanto o usuário estiver usando o preview.

## Fidelidade do site novo

Atualização explícita do usuário em 23/10/2026: o ZIP contém a identidade nova, incluindo logos. Essa referência supera a exigência anterior de manter a assinatura antiga no redesign. Corrigir o press kit do site novo com os arquivos do ZIP. A aplicação geral da nova identidade aos demais produtos e materiais é trabalho futuro, não autorizado para execução agora. Não alterar o painel ou os building blocks.

O usuário reforçou em 23/10/2026 que o objetivo é construir o site novo real e apontou discrepâncias visuais. O preview usa a aplicação independente em `src/redesign/App.tsx`, sem tema, layouts ou fallback para páginas antigas. O HTML final do handoff orienta composição, hierarquia, espaçamento e estados. Para marca, vale a atualização de 23/10 acima.

Contagem de rotas com código, compilação e testes de interação não equivalem a aprovação visual. Comparar a renderização com a referência nas quatro larguras antes de declarar fidelidade. Não inserir seções extras na composição aprovada para atender SEO. Em 27/10/2026, o usuário definiu e aprovou a direção dos heros comerciais: ação concreta, entrega reconhecível, exemplos e próximo passo claro, inclusive para quem ainda não conhece a Catalisa. A versão `20261027-hero-clarity` foi validada em staging e publicada com autorização explícita; evidências em `docs/redesign-2026-10-22/qa/hero-clarity/` e `qa/release/hero-clarity-production-published.json`. Essa direção substitui as aberturas poéticas anteriores.

## Redesign e material de referência

O ponto de continuidade do redesign é `docs/redesign-2026-10-22/README.md`. Desde 22/10/2026 este repositório é o responsável pela evolução das inspirações, análises, identidade transitória e material do relatório ali reunidos.

Para esse trabalho, consultar a análise consolidada, as 72 referências e `design/entregas-bauhaus/identidade-transitoria.json` dentro daquela pasta. O logotipo principal oficial é Catalisa. roxo com ponto amarelo. A identidade do relatório foi aprovada em 21/10 e é a base para evoluir o novo site; a composição e a arquitetura de conteúdo do site seguem como trabalho de redesign.

O estudo anterior em `docs/site-v2` permanece como insumo de conteúdo e estratégia. Preservar a rastreabilidade das decisões ao combinar esse estudo, o relatório e novos materiais.
