# Contrato de encaminhamento do site

Implementado pelo adaptador do site e verificado com receptor HTTP de teste no loopback. **Não declara uma rota instalada na Catalisa.** O `/incoming-webhooks` consultado no produto oferece eventos de lead e não comprova este contrato com entrega/atribuição. É necessário configurar um workflow/receptor compatível para habilitar os canais reais.

## Saída para o receptor

`POST SITE_HANDOFF_URL`, com `HandoffPacket` de `types.ts`: referências provisórias do site, nome, canal/endereço, briefing versionado, histórico, conceito/versão e confirmação explícita com data. Nenhum telefone ou e-mail é inventado para criar lead CRM.

Headers:

- `Authorization: Bearer <SITE_HANDOFF_TOKEN>`
- `Idempotency-Key: <handoffRef>`
- `X-Catalisa-Timestamp`: epoch em segundos.
- `X-Catalisa-Signature`: HMAC-SHA256 hexadecimal minúsculo de `timestamp + '.' + corpoJSONExato`, usando `SITE_HANDOFF_SIGNING_SECRET`.

O receptor precisa autenticar e deduplicar persistentemente por `handoffRef` **antes** de criar lead, enviar canal ou solicitar atendimento. Tenant e fila/workflow são configuração do receptor. WhatsApp chega em E.164. E-mail e `here` precisam de um caminho real que não force a API de leads com telefone obrigatório.

ACK esperado, sem afirmar entrega:

```json
{"accepted":true,"handoffRef":"handoff_<uuid>"}
```

O site registra `queued` antes da chamada e mostra `accepted` após esse ACK válido. HTTP 4xx ou ACK explícito `accepted:false` levam a `failed`. Timeout, HTTP 5xx, corpo inválido ou confirmação divergente mantêm `queued`: o receptor pode ter aceitado sem devolver a resposta. Não há reenvio automático. Repetir a chave da operação devolve o registro existente sem executar o transporte novamente.

## Eventos de entrega e atendimento

`POST /api/internal/handoff-events`, assinado com `SITE_WEBHOOK_SECRET` pelo mesmo algoritmo. Não usa cookie de visitante nem autorização por Origin. Separar secrets de callbacks e de sessão; configurar valores aleatórios de pelo menos 32 bytes.

```json
{
  "eventId":"<uuid>",
  "handoffRef":"handoff_<uuid>",
  "sequence":1,
  "status":"delivered",
  "occurredAt":"2026-10-23T18:00:00.000Z"
}
```

Estados aceitos: `queued`, `delivered`, `assigned`, `failed`. Entrega exige evidência real do canal; `assigned` exige atribuição efetiva a uma pessoa. Receber um pacote ou iniciar workflow não equivale a entrega/atribuição.

Assinatura: janela de cinco minutos. `occurredAt`: janela inicial de 24 horas. IDs são únicos e a sequência cresce. Duplicata idêntica não reaplica evento; mesmo ID com dados diferentes, sequência antiga ou regressão são rejeitados. A sessão só é pesquisada depois de validar HMAC; sessões expiradas não são recuperadas pelo callback.

## Pendente para serviços reais

Selecionar/configurar agente exclusivo sem ferramentas operacionais e com conhecimento autorizado, credencial de serviço, modelo/orçamento, workflow/receptor, reconciliação CRM, semântica de entrega e atribuição por canal. Aplicar/validar migrações somente no banco selecionado do site. Nenhum recurso externo foi criado ou alterado por esta implementação local.
