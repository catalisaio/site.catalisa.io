# Catalisa Lab: protótipo e ponto de integração

Rota: `/lab/`. Código: `dist/assets/connection/experience.js`; apresentação: `experience.css`.

Sem motor instalado, o formulário escolhe um cenário demonstrativo local por palavras do briefing. O texto livre não é enviado nem persistido. Há quatro exemplos setoriais e uma composição genérica. O produto ilustrado não é criado nem publicado. A seleção de horário é uma simulação local, sem reserva real.

Para ligar o motor, defina `window.CATALISA_LAB_ENGINE` antes de o usuário enviar o formulário. Essa função assíncrona recebe `{ briefing: string }` e devolve o objeto abaixo. A função deve chamar seu backend; credenciais de provedores nunca ficam no navegador.

```js
window.CATALISA_LAB_ENGINE = async ({ briefing }) => {
  const response = await fetch('/api/lab/compose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ briefing })
  });
  if (!response.ok) throw new Error('composition-failed');
  return response.json();
};
```

Esse endpoint ainda não existe neste protótipo. Não adicionar esse adaptador até implementar o serviço e definir suas regras de acesso e uso.

Contrato da resposta:

```json
{
  "name": "Nome do produto",
  "kind": "Setor ou contexto",
  "title": "A proposta em uma frase",
  "description": "Descrição simples da jornada",
  "roles": ["Cliente", "Equipe", "Operação"],
  "steps": [
    ["Receber", "O cliente conta o que precisa.", "Comunicação", "wpp-business"],
    ["Organizar", "O pedido ganha contexto.", "Contexto", "data-store"],
    ["Combinar", "Um horário conecta as pessoas.", "Agenda", "calendar"],
    ["Continuar", "O relacionamento acompanha o atendimento.", "Clientes", "customers"]
  ],
  "items": ["Pedido ilustrativo", "Conversa ilustrativa", "Atendimento ilustrativo"],
  "action": "Experimentar a jornada",
  "note": "Composição exploratória. Valide disponibilidade e integrações."
}
```

A visualização atual valida 4 etapas, 3 participantes, 3 exemplos e slugs existentes no catálogo. Todos os textos são escapados antes de renderizar. Erros preservam o briefing e permitem nova tentativa. Não gerar alegações de clientes, métricas ou disponibilidade a partir do texto do usuário.

## Capturas das composições

`X_CAPTURE_META` registra a origem, o contexto e o SHA de cada uma das quatro capturas adicionadas nesta revisão. Foram lidas no repositório `catalisaio/wpp.bb.catalisa.io`, na branch padrão, em 22/10/2026. A consulta atual não muda a data original da captura: Banking usa o guia de 29/09/2026; Crédito usa o guia atualizado em 25/09/2026. As imagens anteriores permanecem identificadas como materiais de referência. A galeria suporta imagem inteira, ampliação, navegação por setas e fechamento por Escape, com retorno de foco.

## Conteúdo dos Building Blocks

`B_STORIES`, em `platform.js`, contém 39 leituras editoriais de exemplos da documentação pública de cada bloco. `source` e `sourceSection` mantêm o vínculo. São cenários de uso, não comprovação de resultado de clientes. A referência completa está no início e no fim de cada detalhe.
