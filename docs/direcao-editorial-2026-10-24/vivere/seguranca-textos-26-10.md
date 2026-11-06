# Segurança e confiabilidade — textos para os materiais

26/10/2026 · Português do Brasil.

**Fonte exclusiva das garantias:** [Segurança e confiabilidade — 26/10](seguranca-confiabilidade-26-10.md), itens marcados com ✅. Os lastros abaixo são referências editoriais internas; seção e posição do item identificam a evidência na fonte. Títulos, corpos e notas estão redigidos para uso nos materiais.

## 1. Para a apresentação master (E9)

Seis lâminas sugeridas para o capítulo de segurança. Os IDs identificam esta proposta de redação.

### 1. Dinheiro só sai com tudo conferido de novo

**ID sugerido:** `seg-desembolso`

**Título:** Antes do Pix, cada condição é conferida de novo.

**Corpo:** Antes de cada Pix, o sistema confere novamente as garantias, a trava da operação, o termo aceito e os valores, até o centavo. Qualquer divergência impede o pagamento e deixa o motivo disponível para a mesa. Um número único identifica a mesma operação no aplicativo, na lista e no pagamento.

**Notas do apresentador:** O banco precisa confiar nas condições existentes no momento em que o dinheiro sai. O sistema garante uma nova conferência antes de cada Pix: verifica as garantias, a trava, o termo aceito e a correspondência dos valores até o centavo. Cada guia e cada nota só podem garantir uma operação. Se qualquer condição falhar, o pagamento é impedido e a mesa encontra o motivo para conduzir o caso. O número único da operação mantém a referência comum entre a experiência no aplicativo, o acompanhamento da equipe e o pagamento.

**Lastro:** Fonte, §1, itens ✅ 1 e 3: conferência antes de cada Pix, exclusividade de guia e nota, bloqueio com motivo e número único da operação.

### 2. Ninguém sozinho aprova o que não pode

**ID sugerido:** `seg-aprovacao`

**Título:** A aprovação respeita a alçada e a proposta.

**Corpo:**

- Acima da alçada, medida pelo valor de face, uma pessoa aprova e outra autorizada confirma; o sistema recusa a confirmação pela mesma pessoa.
- Mudanças em valor, prazo, taxa, termo ou documento invalidam a primeira aprovação; ela também vence em 30 dias.
- Limites por pedido, cliente e pagador recusam excessos em todas as etapas previstas; análises encaminhadas a uma pessoa exigem sua decisão.

**Notas do apresentador:** A instituição mantém o controle sobre quem pode confirmar uma aprovação e até qual valor. O sistema mede a alçada pelo valor de face e respeita o teto definido pela casa. Acima dela, exige duas pessoas distintas; por padrão, a confirmação cabe ao responsável da instituição e a quem ele autorizar. A primeira aprovação fica vinculada à proposta examinada e perde validade com alterações ou após 30 dias. Limites são aplicados na simulação, proposta, aceite e mesa. Casos destinados à análise humana permanecem com uma pessoa; pedidos travados geram alerta e podem ser encerrados pela mesa.

**Lastro:** Fonte, §2, quatro itens ✅: quatro olhos e alçada pelo valor de face; validade da primeira aprovação; limites efetivos; encaminhamento humano, alerta e encerramento pela mesa.

### 3. Garantias reservadas pela capacidade

**ID sugerido:** `seg-capacidade`

**Título:** Cada bem garante até o valor que comporta.

**Corpo:** O sistema reserva a capacidade dos bens dados em garantia, impedindo que o mesmo bem garanta mais do que vale. A primeira confirmação dessa capacidade exige duas pessoas. Cada guia e cada nota ficam vinculadas a uma única operação.

**Notas do apresentador:** O banco precisa saber quanto de uma garantia está comprometido ao examinar uma nova operação. Para bens como rebanho, veículo e imóvel, o sistema garante a reserva pela capacidade: o mesmo bem não pode sustentar compromissos acima do seu valor. A primeira confirmação dessa capacidade exige duas pessoas, distribuindo a responsabilidade pela referência utilizada. Para guias e notas, a regra é a exclusividade por operação. Esses controles permitem distinguir o valor disponível de um bem da vinculação exclusiva de um documento, preservando o controle da instituição sobre as garantias utilizadas.

**Lastro:** Fonte, §1, itens ✅ 1 e 2: exclusividade de guias e notas; reserva de bens pela capacidade e primeira confirmação por duas pessoas.

### 4. Instalação sem casa pela metade

**ID sugerido:** `seg-instalacao`

**Título:** A instalação respeita o que a operação precisa.

**Corpo:** Quando falta um componente obrigatório, o sistema recusa a instalação sem alterar o ambiente e explica o motivo. Análises destinadas à Mesa, quando ela não está disponível na instituição, seguem para a fila do painel. Cada instalação em produção tem registro do antes e do depois, trilha e proteção contra duplicação.

**Notas do apresentador:** Ao instalar uma solução, a instituição precisa preservar a continuidade da operação e saber o que foi alterado. O sistema garante que um pacote dependente de outro seja recusado quando o requisito estiver ausente, com explicação clara e sem efeitos sobre o ambiente. O canal de crédito, por exemplo, exige a Mesa para ser instalado. Para o encaminhamento de análises, a ausência da Mesa na instituição leva os casos à fila do painel. Cada instalação em produção preserva o registro anterior e posterior, com trilha e sem duplicar a instalação.

**Lastro:** Fonte, §3, dois itens ✅: recusa de instalação por dependência, fila alternativa no painel e registros de cada instalação em produção sem duplicação.

### 5. Mudanças só em produção depois de provadas

**ID sugerido:** `seg-mudancas`

**Título:** Cada mudança precisa provar que pode entrar.

**Corpo:** Toda mudança passa por um ambiente de validação antes da produção e por revisão de outra pessoa. Testes automáticos com banco de dados real bloqueiam qualquer mudança que não passe, incluindo pedidos que disputam a mesma garantia ou o mesmo limite. A liberação exige os testes da versão exata que será incorporada e é recusada se outra publicação ocorrer durante a conferência.

**Notas do apresentador:** A confiança do banco também depende de como o sistema evolui. Toda mudança passa pelo ambiente de validação antes da produção, com revisão independente de quem a escreveu. Testes automáticos com banco de dados real bloqueiam qualquer mudança que não passe. As verificações incluem a aplicação das alterações de dados desde uma base vazia, a correspondência entre os dados e as regras do sistema, os fluxos de crédito e a disputa simultânea pela mesma garantia ou limite. A conferência exige resultados da versão exata da mudança e recusa a liberação se outra publicação ocorrer durante esse processo.

**Lastro:** Fonte, §4, seis itens ✅: validação anterior à produção; testes das alterações de dados; testes de disputa simultânea; testes dos fluxos de crédito; conferência da versão exata e recusa diante de publicação durante a conferência; revisão independente.

### 6. Rede e dados

**ID sugerido:** `seg-rede-dados`

**Título:** Dados protegidos. Comunicação com controle.

**Corpo:**

- Chamadas externas são impedidas de alcançar a rede interna e informações de configuração da infraestrutura.
- Reservas, aceites, assinaturas e trilha só recebem gravações do próprio sistema, com origem autenticada.
- O cliente dispõe de relatório por e-mail com dados mascarados, exclusão da biometria e recadastro facial; avisos respeitam preferências, têm registro de entrega e são enviados uma vez por evento e por canal.

**Notas do apresentador:** O sistema garante controles sobre os destinos das chamadas externas e a origem dos registros da operação. Chamadas externas são bloqueadas quando tentam alcançar a rede interna ou informações de configuração da infraestrutura. Reservas, aceites, assinaturas e trilha só podem ser gravados pelo próprio sistema, com origem autenticada. O cliente dispõe de relatório dos seus dados por e-mail com informações mascaradas, além de exclusão da biometria e recadastro do rosto. A comunicação segue as preferências do cliente: cada aviso é enviado uma vez por evento e por canal, com trilha de cada entrega para acompanhamento.

**Lastro:** Fonte, §5, quatro itens ✅: proteção dos destinos externos; gravação de dados pelo servidor com assinatura de sistema; recursos de privacidade; avisos por evento e canal, preferências e trilha de entrega.

## 2. Para E6 — segurança e governança — e brochure

Texto comum para página web e brochure, organizado nos mesmos seis temas.

### Antes do dinheiro sair, tudo é conferido de novo

Antes de cada Pix, o sistema confere novamente as garantias, a trava da operação, o termo aceito e os valores, até o centavo. Cada guia e cada nota só podem garantir uma operação. Qualquer divergência impede o pagamento e deixa o motivo disponível para a mesa. Um número único acompanha a operação no aplicativo, na lista e no pagamento, dando ao banco uma referência comum para conferência.

### Quem decide respeita a alçada e a proposta

Acima da alçada, medida pelo valor de face e limitada ao teto da instituição, o sistema exige aprovação e confirmação por pessoas diferentes; por padrão, só o responsável da casa e quem ele autorizar podem confirmar. A primeira aprovação perde validade se mudar valor, prazo, taxa, termo ou documento, ou após 30 dias. Limites por pedido, cliente e concentração por pagador recusam excessos na simulação, na proposta, no aceite e na mesa. Análises destinadas a uma pessoa exigem sua decisão, e pedidos travados geram alerta e podem ser encerrados pela mesa.

### A garantia respeita a capacidade do bem

O sistema reserva a capacidade de bens dados em garantia, como rebanho, veículo e imóvel, impedindo que o mesmo bem garanta mais do que vale. A primeira confirmação dessa capacidade exige duas pessoas. Guias e notas têm vinculação exclusiva a uma operação, mantendo claro para o banco o que está comprometido em cada caso.

### A instalação preserva a continuidade da operação

Quando uma solução depende de um componente ausente, o sistema recusa a instalação sem alterar o ambiente e apresenta uma explicação clara. O canal de crédito, por exemplo, exige a Mesa para ser instalado. Se a instituição não dispõe da Mesa, as análises seguem para a fila do painel, preservando o encaminhamento dos casos. Cada instalação em produção tem registro do antes e do depois, trilha e proteção contra duplicação, dando à instituição condições de conferir o que foi instalado.

### Cada mudança é provada antes da produção

Toda mudança passa por um ambiente de validação antes da produção e por revisão de outra pessoa. Testes automáticos com banco de dados real bloqueiam qualquer mudança que não passe, verificando as alterações de dados, sua correspondência com as regras do sistema e os fluxos de crédito. Os testes também verificam pedidos simultâneos que disputam a mesma garantia ou o mesmo limite. A liberação exige os resultados da versão exata que será incorporada e é recusada se outra publicação ocorrer durante a conferência.

### Rede, dados e comunicação sob controle

O sistema bloqueia chamadas externas que tentem alcançar a rede interna ou informações de configuração da infraestrutura. Reservas, aceites, assinaturas e trilha só podem ser gravados pelo próprio sistema, com origem autenticada. O cliente dispõe de relatório dos seus dados por e-mail com informações mascaradas, exclusão da biometria e recadastro facial. Os avisos respeitam suas preferências, são enviados uma vez por evento e por canal e mantêm trilha de cada entrega, dando à instituição condições de acompanhar a comunicação.

**Lastro editorial interno do bloco:** as seis seções seguem, na mesma ordem, os lastros das seis lâminas do bloco 1.

## 3. Para o material da demo — uso interno

### O que o sistema garante

- **Pix condicionado à conferência:** garantias, trava, termo e valores são relidos antes de cada pagamento; divergências bloqueiam a saída e deixam o motivo na mesa, com um número único da operação.
- **Aprovação dentro da regra:** quatro olhos acima da alçada pelo valor de face; mudanças na proposta ou 30 dias invalidam a primeira aprovação; limites recusam excessos e casos destinados à análise humana exigem uma pessoa.
- **Garantias com capacidade reservada:** nenhum bem garante mais do que vale; a primeira confirmação exige duas pessoas; cada guia e nota garantem uma única operação.
- **Instalação completa e rastreável:** dependências ausentes impedem a instalação sem efeitos; análises sem Mesa seguem à fila do painel; produção tem registro antes e depois, trilha e nenhuma duplicação.
- **Mudanças provadas antes da produção:** ambiente de validação, revisão independente e testes automáticos com banco de dados real bloqueiam qualquer mudança que não passe, inclusive disputas por garantia ou limite; a conferência exige a versão exata e recusa publicação concorrente.
- **Destinos externos controlados:** chamadas externas são impedidas de alcançar a rede interna e informações de configuração da infraestrutura.
- **Origem dos registros e privacidade:** reservas, aceites, assinaturas e trilha só são gravados pelo sistema, com origem autenticada; relatório por e-mail com dados mascarados, exclusão da biometria e recadastro facial estão disponíveis.
- **Avisos com controle de entrega:** uma vez por evento e por canal, respeitando preferências e mantendo trilha de cada entrega.

**Lastro editorial interno do bloco:** itens 1–5 correspondem aos lastros das lâminas 1–5; itens 6–8 correspondem aos quatro itens ✅ da §5 da fonte, reunidos na lâmina 6.
