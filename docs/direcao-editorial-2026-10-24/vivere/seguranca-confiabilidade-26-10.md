# Segurança e confiabilidade — o que entrou em 26/10/2026 (para materiais, apresentações e manuais)

Linguagem para cliente: o que o sistema GARANTE, nunca "tínhamos uma falha". Só afirme o que está marcado ✅ (na master
e/ou provado). O que está "em andamento" vai como "em implantação", com data.

## 1. Dinheiro só sai com tudo conferido de novo, na hora
- ✅ Antes de cada Pix, o servidor relê as garantias (cada guia e nota só pode garantir UMA operação), a trava, o termo
  aceito e os valores (até 1 centavo). Falhou qualquer coisa: nenhum Pix sai, e o motivo fica na mesa.
- ✅ Bens dados em garantia (rebanho, veículo, imóvel) são reservados pela CAPACIDADE: o mesmo bem não pode garantir mais
  do que vale. A primeira confirmação de capacidade exige duas pessoas.
- ✅ A operação tem um número único em todo o sistema (o app, a lista e o dinheiro falam do mesmo registro).

## 2. Ninguém sozinho aprova o que não pode
- ✅ Quatro olhos acima da alçada: uma pessoa aprova e OUTRA confirma; a mesma pessoa é recusada. A alçada é medida pelo
  valor de face, nunca acima da que a casa definiu. Padrão: só o responsável da casa (e quem ele liberar) confirma.
- ✅ A primeira aprovação vale só para a proposta exatamente como estava: se mudar valor, prazo, taxa, termo ou
  documento, ou se passarem 30 dias, ela perde a validade.
- ✅ Limites que recusam de verdade (simulação, proposta, aceite e mesa): teto por pedido, limite por cliente
  (padrão R$ 250 mil) e concentração por pagador.
- ✅ Análise que o motor manda para uma pessoa vai para uma pessoa (nunca sai aprovada sozinha); pedido travado ganha
  alerta e pode ser encerrado pela mesa.
- EM IMPLANTAÇÃO (26–30/10): toda decisão de crédito ASSINADA pelo servidor — da mesa e do motor —, conferida na oferta,
  no aceite e no Pix. Uma aprovação gravada fora do sistema não vira oferta nem pagamento. Já na master: a assinatura
  da mesa, do motor e do contrato (CCB); a seguir, a dos casos da mesa, a medição e a recusa ligada.

## 3. Instalação que não deixa casa pela metade
- ✅ Um pacote que precisa de outro (o canal de crédito precisa da Mesa) recusa a instalação com uma frase clara e sem
  efeito nenhum. Se a casa não tiver a Mesa, a análise cai na fila do painel em vez de sumir.
- ✅ Cada instalação em produção tem foto antes e depois e trilha; nada duplicado (provado na MedFund em 26/10).

## 4. Mudanças só em produção depois de provadas
- ✅ Staging antes de produção, sempre; trem diário para produção às 20h com o que passou nos testes do dia.
- ✅ CI com banco de dados de verdade: as mudanças de banco são aplicadas do zero em todo PR, e a diferença entre o
  banco e o código bloqueia o merge.
- ✅ Os testes de concorrência (dois pedidos disputando a mesma garantia ou o mesmo limite) rodam contra um Postgres real.
- ✅ 184 conjuntos de testes de crédito bloqueiam o merge (mesa, canal, regras, pacotes de crédito e de empréstimo e o
  motor dos fluxos).
- ✅ A trava de merge confere os testes da versão exata do PR e recusa se alguém publicar no meio.
- ✅ Revisão independente em todo PR (quem escreve não revisa).

## 5. Rede e dados
- ✅ Chamadas a endereços externos passam por uma proteção que recusa a rede interna e endereços de metadados (provado
  em staging em 26/10).
- ✅ Dados do sistema (reservas, aceites, assinaturas, trilha) só são gravados pelo servidor, com assinatura de sistema.
- ✅ Privacidade: relatório dos dados do cliente por e-mail, com tudo mascarado; apagar a biometria; recadastro do rosto.
- ✅ Avisos ao cliente uma vez por evento e por canal, com preferências respeitadas e trilha de cada entrega.

## Provas de 26/10 (para citar)
- Jornada completa em staging com assinatura dentro do app: aprovação na mesa 13:14 → aceite 13:16 → assinatura
  13:17 → Pix de R$ 9.426,52 às 13:22.
- Banco de produção conferido antes da subida: nenhuma mudança falhada, posse correta de tabelas e tipos.
