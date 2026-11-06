# Contratos propostos, não instalados

`openapi.proposed.json` define o backend público do site e uma entrada privada de eventos. Não há URL de servidor de produção neste contrato. O próximo time deve mapear para serviços reais e acrescentar os detalhes de autenticação, limites e observabilidade do ambiente.

## Invariantes além do JSON Schema
- Sessão e referências são opacas; autorizar toda leitura e escrita. Nunca retornar dados de outra sessão por conhecer um ID.
- Bloquear geração enquanto as três respostas e a identidade/lead não estiverem persistidas. Lab pode iniciar exploração anônima se houver decisão específica; não aplicar silenciosamente a regra de Contato a todas as entradas.
- Sessão criada retorna cookie por Set-Cookie. O contrato não exige cookie anterior nessa operação. Aplicar proteção de abuso e validação de origem.
- Idempotency-Key vale para sessão/operação/payload; mesma chave e payload devolvem o resultado anterior, payload diferente retorna 409. Definir expiração da janela no ambiente.
- BriefVersion e baseConceptVersion controlam concorrência otimista. Edição de resposta incrementa versão; conceito registra sua versão de origem.
- GET de sessão devolve a projeção autorizada com respostas, histórico, canais habilitados e último conceito; uma sessão sem identidade ainda não possui identity. Limitar/paginar histórico além de 500 registros. PUT de briefing usa expectedVersion; preservar mensagens e registrar a edição como evento. Não apagar o histórico ao substituir a projeção do briefing.
- Canal `here` não exige address; email/whatsapp exigem endereço válido. Rejeitar canal não configurado. Validar conceptRef e conceptVersion como par quando presentes.
- Job succeeded exige concept; failed exige error; queued/running não retornam conceito final. Essas regras condicionais devem ser implementadas mesmo que o contrato de resposta mantenha os campos opcionais.
- Para cada tela, nextScreenId é null ou um ID de tela existente. IDs de tela e etapa são únicos. Slugs vêm da allowlist incluída, revalidada no ambiente. Maturidade deve vir do catálogo, nunca da opinião do modelo.
- Distinguir protocolo de entrega por canal de atribuição humana. Não inferir delivered ou assigned a partir de accepted.
- Webhook: pactuar algoritmo, serialização, timestamp e janela de replay com emissor real; validar em tempo constante, deduplicar eventId e controlar sequence. O nome de header é apenas proposta.
- Definir tamanho máximo de corpo, timeout, quotas, concorrência e retenção em configuração de servidor. Valores de comprimento/quantidade do schema são limites iniciais propostos, não limites oficiais da plataforma.

## Compatibilidade com o Lab existente
O adaptador atual `window.CATALISA_LAB_ENGINE` recebe `{briefing}` e espera `name`, `kind`, `title`, `description`, `roles`, `steps`, `items`, `action` e `note`, com quatro etapas. O schema de conceito deste handoff é mais completo e **não é drop-in**. Implementar um mapper no backend ou atualizar o renderer do Lab de forma versionada. `reference/site/docs/LAB-PROTOTYPE.md` preserva o contrato exato anterior.

O contato existente também usa estado e modelos próprios. Migrar para um estado compartilhado do BFF, preservando a experiência aprovada, em vez de tentar substituir suas variáveis por respostas HTTP de forma pontual.

## Fixture e verificação
`concept.example.json` usa somente dados fictícios. Valide contra `concept.schema.json` com a biblioteca JSON Schema adotada pelo repo; depois valide as invariantes acima. A verificação incluída usa JSON Schema completo quando a biblioteca está disponível; sem ela, executa checagens limitadas aos tipos, campos, tamanhos e enums usados neste schema, mais invariantes e cinco casos negativos. Não é um validador geral de OpenAPI/JSON Schema. Ela não chama IA nem serviços da Catalisa.
