> Escopo aprovado em 28/10/2026: integrar esta proposta como página interna do site real, em `/assistente-operacional`. A Home, a narrativa institucional e a oferta principal permanecem como estão. Este protótipo isolado é apenas a referência visual; a implementação real está em `src/redesign/OperationalAssistant.tsx`.

# Proposta visual — assistente operacional Catalisa

Criada em 28/10/2026 após o usuário autorizar uma frente paralela à revisão do Biometrics. Este artefato registra a proposta visual e a demonstração navegável aprovadas para uma página interna. A integração atual usa o cabeçalho, o rodapé e os idiomas reais do site em `/assistente-operacional`, sem substituir a Home ou reformular a oferta institucional. O painel e os building blocks permanecem fora deste trabalho; produção depende do corte conduzido pelo responsável pela release.

Página integrada: **http://127.0.0.1:5175/assistente-operacional**.

Protótipo de referência contínuo: **http://127.0.0.1:8142/**.

```sh
node docs/estrategia-oferta-componivel/preview-operacional/server.mjs
node docs/estrategia-oferta-componivel/preview-operacional/check.mjs
```

## A narrativa materializada

**Consulte e opere seus sistemas com IA.**

O apoio explica encontrar informações, executar tarefas nos sistemas conectados, usar a mesma tela e acompanhar o resultado. A demonstração leva esse argumento para o contexto de uma negociação, antes de apresentar plataforma, capacidades e produtos.

1. A negociação Projeto Aurora está aberta em Qualificação.
2. A pessoa pede um resumo do histórico. O assistente aponta a origem do resumo no próprio registro.
3. A pessoa pede para mover a oportunidade para Proposta enviada.
4. A ficha muda de etapa, o próximo passo é atualizado e um evento é incluído no histórico.
5. A pessoa confere o que foi feito no registro, além da resposta do assistente.

A demonstração pode ser percorrida pelos controles de história ou pelo campo de texto. O campo aceita múltiplas linhas com Shift+Enter e envio com Enter. As intenções aceitas são explícitas e locais, sem chamada a um modelo. Pedidos fora do roteiro recebem orientação sobre o exemplo. Perguntar sobre uma proposta não movimenta o registro; a alteração requer um pedido de ação reconhecido. Repetir a movimentação não duplica o evento. Recomeçar restaura estado, histórico e conversa.

O rótulo “Proposta enviada” é apenas o nome da etapa. A demonstração não encena envio de e-mail, WhatsApp ou proposta ao cliente. Todos os nomes, registros e acontecimentos são fictícios; não há execução de ações reais no CRM.

## Identidade e conteúdo

A marca, as três faces Inter e a imagem editorial são lidas do acervo atual em `public/redesign`. O logotipo é `catalisa-logo-principal.svg`, com ponto amarelo. O visual segue papel, roxo, amarelo, laranja, linhas editoriais e geometria funcional. A negociação e o assistente formam uma interface reconhecível; diagramas explicam contexto, integração e permissões.

A narrativa posterior esclarece a plataforma como sustentação da experiência e organiza Office, Atendimento, Banking e Credit por trabalho. Não transforma o assistente em outro SKU nem apresenta Office como requisito universal para os demais produtos. A incorporação em sistemas de terceiros depende da integração, distinguindo essa experiência do assistente já presente no painel Catalisa.

Textos e enquadramento estratégico estão em [assistente-operacional.md](../assistente-operacional.md) e [assistente-operacional-roteiro.md](../assistente-operacional-roteiro.md), mantidos pela frente de posicionamento. Esta aplicação é um estudo de apresentação, sem declaração de economia medida, cobertura universal de integração ou exclusividade diante de concorrentes.

## Validação e continuidade

`check.mjs` percorre 320, 390, 768 e 1440 pixels. Confere consulta com origem, alteração visível de etapa, histórico, próximo passo, reexecução sem duplicação, reset, solicitações digitadas, pedido não suportado, navegação por teclado, três estados da explicação da plataforma, links internos, carregamento e ausência de requisições externas. Artefato e capturas ficam em `qa/`.

O teste valida a demonstração local. Antes de usar uma gravação como prova do serviço, executar o mesmo roteiro no painel com dados sintéticos autorizados e conferir o estado no sistema. As ações e fontes de uma integração externa precisam de validação específica.

A implementação aprovada já está integrada como página interna React em `src/redesign/OperationalAssistant.tsx`, com estilos escopados, frame, cabeçalho, rodapé, navegação localizada, SEO e instrumentação reais. A Home e a oferta institucional permanecem preservadas. A validação integrada está em `scripts/verify-operational-assistant*.mjs`, com evidências em `docs/redesign-2026-10-22/qa/operational-assistant/`.

O protótipo independente desta pasta permanece como referência visual em 8142: nele, o servidor escuta apenas em loopback, bloqueia escrita e indexação e não expõe documentos ou configuração. Seus componentes próprios e links comerciais externos não definem a implementação real da página interna.
