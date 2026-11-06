# Convites para criar produto próprio e modernizar o legado

Implementação editorial de 24/10/2026 a partir do pedido do usuário: “estou sentindo falta no site de discursos convidando a criar seu proprio produto financeiro, produtos de credito originais ou mesmo substituir o legado existente”.

Os novos textos ocupam títulos, parágrafos e CTAs existentes de Banking, Credit e Arquitetura. Nenhuma seção ou elemento de composição foi acrescentado. O hero principal da Home não foi alterado. A direção editorial de 24/10 foi lida como insumo; seus arquivos não foram alterados nem suas peças tratadas como aprovação de publicação.

## Textos e destinos

| Espaço | Texto implementado | Destino |
|---|---|---|
| Banking, introdução do hero | “Crie seu produto financeiro. Conecte a experiência à operação.” | — |
| Banking, premissa | “Crie uma experiência financeira própria ou modernize a atual. Defina marca, canais e regras de operação; a composição depende do escopo e das integrações validadas.” | — |
| Banking, conexão com crédito | “Sua conta pode se conectar a um produto de crédito próprio. Explore como proposta, aceite e acompanhamento podem compor essa jornada, conforme o escopo e as integrações.” | — |
| Banking, CTA para Credit | “Desenhe seu produto de crédito ↗” | `/ecossistema/credit/` |
| Banking, fechamento | “Crie seu produto financeiro com identidade.” | — |
| Banking, CTA de conversa | “Vamos criar seu produto ↗” | `/contato/` |
| Credit, introdução do hero | “Crie seu produto de crédito. Da proposta à vida da operação.” | — |
| Credit, introdução | “Crie um produto de crédito original ou redesenhe o existente: público, modalidade, política e condições próprias. Catálogo e mesa conectam construção e operação conforme o escopo validado.” | — |
| Credit, fechamento | “Seu produto de crédito. Suas regras. Uma nova composição.” | — |
| Credit, CTA para Banking | “Crie sua experiência financeira ↗” | `/ecossistema/banking/` |
| Credit, CTA de conversa | “Desenhe seu produto de crédito ↗” | `/contato/` |
| Arquitetura, introdução do hero | “Crie seu produto financeiro. Desenhe uma jornada de crédito original. Ou modernize o legado por etapas, reunindo capacidades, regras e integrações validadas.” | — |
| Arquitetura, evolução | “Para modernizar ou substituir um legado, comece por uma jornada delimitada. Adaptadores conectam o que permanece à nova composição, com contratos claros entre os sistemas.” | — |
| Arquitetura, validação da evolução | “Planeje a substituição por etapas. Cada avanço exige validar dados, equivalência funcional, integrações e continuidade da operação antes de retirar a parte anterior.” | — |
| Arquitetura, fechamento | “Crie o próximo produto. Evolua o que já existe.” | — |
| Arquitetura, parágrafo de fechamento | “Seu produto financeiro pode ter regras e experiência próprias. A modernização do legado também começa por um recorte: o que preservar, o que substituir e como validar cada etapa.” | — |
| Arquitetura, CTA de fechamento | “Planeje seu produto ou a modernização ↗” | `/contato/`, no lugar do antigo link para `/desenvolvedores/` |

Os textos convidam ao desenho e à conversa sobre o produto. Não prometem abertura de instituição financeira, aprovação de crédito, disponibilidade integral das modalidades, homologação automática ou migração sem esforço. Os blocos existentes de estágio, origem das capturas e limites da implantação permanecem.

## Rastreabilidade e regeneração

`src/redesign/data/financial-messaging.json` registra a decisão `financial-products-2026-10-24`, origem, data, seletores, HTML anterior e HTML novo. Os elementos nativos identificam a decisão e o trecho com `data-editorial-decision` e `data-editorial-copy`.

O gerador financeiro aplica as substituições por `scripts/redesign-editorial-overrides.mjs`. Ele exige um alvo único, confere o HTML anterior e bloqueia alteração da hierarquia dos elementos. Banking e Credit foram regenerados com essa fonte. Arquitetura é componente manual e importa os textos do mesmo JSON; o gerador de ilustrações/dados de fundação não o sobrescreve.

O HTML congelado do handoff permanece intacto. As diferenças de texto são intencionais e rastreadas, substituindo a copy anterior nos 17 espaços identificados. A composição segue a referência; as novas quebras de linha resultantes do texto ainda exigem inspeção visual nas quatro larguras.

## Verificação

[Evidência offline](verification.json): 11 substituições financeiras presentes nos componentes gerados e hierarquia de elementos idêntica nas duas páginas. Destinos dos CTAs conferidos; sintaxe dos scripts verificada. Sem navegador, build, TypeScript, backend ou alteração de SEO nesta frente.

Depois do próximo artefato, repetir a auditoria visual com a decisão editorial aplicada ao DOM da referência somente durante a comparação:

```sh
REDESIGN_VISUAL_PORT=<porta-do-artefato> REDESIGN_VISUAL_OUTPUT=/tmp/catalisa-editorial-final node scripts/audit-redesign-fidelity.mjs --families --editorial-decisions
```

`--editorial-decisions` aplica os novos textos e o novo destino de Arquitetura ao DOM aberto no navegador, preservando os arquivos congelados, e registra essa condição no JSON da evidência. Sem a flag, o script continua comparando a copy original e relata as diferenças esperadas. Não houve deploy nem aprovação visual final desta alteração.
