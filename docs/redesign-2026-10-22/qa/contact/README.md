# Contato — validação local de 23/10/2026

O [relatório do navegador](verification.json) passou em 320, 390, 768 e 1440 px, usando uma instância de Chrome e contextos sequenciais. As capturas `intro-native-*`, `intro-reference-*` e `summary-native-*` ficam nesta pasta.

Verificado: título e altura da composição inicial comparados ao HTML final, ausência de rolagem horizontal, três respostas persistidas, identidade provisória, retomada após reload, edição com histórico preservado e diálogo com Escape/retorno do foco. Em 390 px, a resposta HTTP é descartada depois do commit; a tentativa repetida mantém somente um registro.

Correções desta retomada:

- A regra mobile `main :where(button,...)` precisava alcançar o conteúdo já inserido dentro de `main`. Isso recuperou a área de toque e a geometria da referência.
- O campo de contexto continha um marcador dinâmico e era convertido antes de receber `value` e `onChange`. O conversor de Contato agora trata o campo antes do texto dinâmico.
- A verificação aguarda a pergunta seguinte antes de escolher sua sugestão.

O backend exercitado é o BFF local com SQLite persistente. O lead salvo é provisório do site; `leadStatus=pending` não significa cadastro concluído no CRM. Geração de conceito retorna 503 explícito enquanto não configurada, preservando a conversa. IA, renderer completo, atendimento/canais e banco compartilhado em staging seguem pendentes. Não houve deploy nem alteração no painel ou nos building blocks.

Comandos, um por vez para limitar memória:

```sh
node scripts/prepare-redesign-contact.mjs
node scripts/verify-redesign.mjs --contact
npx tsc -b
npm run test -- --maxWorkers=1
```

Manter o preview com HMR ativo em http://localhost:5175/contato/.
