# Agentes IA: página editorial

A rota `/agentes/` é renderizada por `dist/assets/connection/agents.js`, com estilos isolados em `agents.css`.

A demonstração de papéis (Atendimento, Copiloto, Banking e Crédito) é local: alterna consulta e preparação de ação. Não chama um modelo, não consulta dados reais e não altera operações. Os estados ilustram decisões de produto e acesso; não substituem controles do servidor.

Fontes consultadas em 22/10/2026:

- `https://catalisa.io/ai-agents/`.
- `docs/guides/agent_action_policy.md`.
- `docs/guides/agent_session_continuity.md`.
- `docs/guides/ai_agents_implementation.md`.

Os guias e capturas foram lidos no repositório `catalisaio/wpp.bb.catalisa.io`, commit `3fc7b15c9b16107d16770bf6412e99e957315681`.

Capturas: `apps/vitrine/src/assets/ss-agentes.jpg` (data original não informada) e `docs/design/revamp-v1/baseline-2026-07-30/modal-new-agent.png` (baseline de interface de 30/07/2026). São referências de interface, não prova de desempenho ou resultado de clientes.

A política documentada de custom actions depende de configuração e tem escopo próprio; a página não afirma que uma instrução em texto concede ou elimina permissões.
