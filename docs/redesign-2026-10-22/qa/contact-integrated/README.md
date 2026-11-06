# Contato: geração e encaminhamento locais

Revalidação local de 24/10/2026, sem deploy. [Relatório integrado](verification.json) e capturas nesta pasta.

O teste usa a interface React real, BFF, SQLite, adaptador HTTP de agente Catalisa, validador JSON Schema, transporte assinado e callbacks. Os serviços externos são substituídos por contratos HTTP no loopback com dados fictícios. **Não houve inferência de IA real, cadastro CRM ou mensagem externa.** As capturas mostram estados de teste, não atendimentos reais.

Validado sequencialmente em 320, 390, 768 e 1440 px:

- Três respostas, nome e e-mail persistidos antes da geração; pelo menos um e-mail ou telefone é obrigatório.
- Conceito estruturado, telas clicáveis, capacidades com metadados do catálogo e jornada.
- Tabs com teclado, inclusão estruturada de revisão humana na versão 2, sem nova inferência, e retomada após reload. Revisão existente abre a etapa sem nova versão.
- `here` (320/1440), e-mail (390) e WhatsApp (768), validação de endereço e confirmação obrigatória.
- Contexto, conceito e refinamentos presentes no pacote recebido.
- Recebimento, entrega e atribuição separados; os dois últimos só após callbacks assinados.
- Quatro chamadas ao gerador de contrato (uma inicial por largura), quatro ajustes de revisão sem inferência e quatro encaminhamentos, sem duplicação.

Testes unitários cobrem owner incorreto, ferramentas operacionais, JSON inválido, slugs/IDs/referências inconsistentes, geração concorrente, versão antiga, timeout, recusa, isolamento e replay/ordem de eventos. O relatório anterior do teste original `verify-redesign.mjs --contact` é histórico e não foi revalidado nesta alteração. Isso não é validação de serviços reais ou aprovação visual de todos os estados.

Comandos pesados, **um por vez**:

```sh
npx tsc -b
npx tsx scripts/verify-contact-integrated.ts
node scripts/verify-redesign.mjs --contact
npm run test -- --maxWorkers=1
```

O harness fecha seu próprio servidor e navegador. Mantém o preview do usuário em http://localhost:5175/contato/.

O agente exclusivo de staging já está configurado localmente; sua estabilidade ainda precisa ser validada. Falta conectar o workflow/receptor real. Este relatório cobre somente os contratos locais. Configuração em [env.example](../../../../server/site/env.example), com [contrato de encaminhamento](../../../../server/site/handoff-contract.md). Migrações PostgreSQL não aplicadas; painel e building blocks sem alteração.
