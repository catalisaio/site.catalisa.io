# Revisão técnica dos formulários e da política

Revisão de código em 24/10/2026, atualizada em 25/10. Não é validação jurídica. Nenhuma política legal foi alterada por esta revisão.

Atualização: o plugin de release remove agora GTM, Clarity e o iframe sem JavaScript tanto do release novo quanto do preview local independente. O build legado mantém o comportamento anterior. A transformação foi verificada com o HTML real em dois testes; a auditoria estática bloqueia trackers conhecidos remanescentes em HTMLs de release. A alteração ainda precisa entrar no build final e ser confirmada no navegador de staging. Os links dos formulários estão sendo tratados na frente de interface.

## Comportamento observado

- Contato cria sessão e salva a primeira resposta em `submit()` antes da coleta de nome/contato. O helper inicial não liga à política.
- Lab cria sessão e salva a ideia em `run()` antes do diálogo de identificação. O diálogo informa processamento por IA, mas não liga à política.
- `ContactReachability` solicita e-mail ou telefone sem link à política. A confirmação de encaminhamento solicita um aceite específico para levar o contexto à equipe; esse controle não representa uma autorização genérica para outros usos.
- A política existente em `/politica-privacidade` trata principalmente dados da plataforma. Ela não descreve especificamente a sessão anônima e a passagem do briefing do site ao atendimento.
- O BFF usa sessão de sete dias e cookie HttpOnly. Expiração lógica da sessão não comprova remoção física dos registros ou prazo de retenção de leads; não inserir promessa de exclusão em sete dias sem verificar o ciclo operacional completo.
- O shell fonte `index.html` contém GTM e Clarity para o build legado. O app novo não monta o componente legado `CookieConsent`; por isso a transformação específica do novo site remove essas integrações. A auditoria de navegador que bloqueia redes externas, isoladamente, não comprova comportamento real de rastreamento ou consentimento.

## Correção concreta proposta ao coordenador

1. Aviso factual e link no espaço de ajuda já existente antes do primeiro envio: “Sua ideia será salva em uma sessão deste site para retomar a conversa. Quando você pedir uma geração, o conteúdo informado será processado por IA. Consulte a Política de privacidade.”
2. Na coleta de identidade/contato: “Usaremos seu nome e contato para vincular o conceito à conversa e continuar sua solicitação.” Incluir o mesmo link à política.
3. Manter a confirmação de canal e contexto separada de qualquer escolha de marketing; acrescentar acesso à política ao lado do controle existente. Não inventar inscrição em marketing ou chamar o clique de uma base legal.
4. Desabilitar scripts/iframe de rastreamento não essencial no shell de release até uma decisão e um fluxo nativo de preferências estarem definidos. A disponibilidade do formulário não depende desses scripts.
5. Confirmar com os responsáveis a retenção efetiva do site e dos leads, destinatários e provedor de IA em operação, canal de direitos e fatos de infraestrutura antes de qualquer revisão da política legal. Não transportar automaticamente promessas da política antiga para uma implantação diferente.

Os avisos cabem nas áreas de ajuda/identificação existentes, sem criar seções para SEO. Uma mudança de texto ainda exige a revisão visual correspondente. O coordenador recebeu a proposta antes de qualquer implementação.
