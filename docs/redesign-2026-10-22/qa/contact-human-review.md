# Correção da revisão humana — 24/10/2026

O botão regenerava o conceito inteiro pela IA e podia exceder os 25 segundos. No conceito salvo observado, já havia duas etapas marcadas com revisão humana; o clique era desnecessário. A versão anterior continuava salva.

Agora, se já houver revisão, “Ver revisão humana” abre a jornada na primeira etapa marcada, sem POST ou nova versão. A etapa explica a conferência humana prevista e que a prévia não aciona atendimento. Se não houver revisão, “Incluir revisão humana” solicita um ajuste estruturado ao BFF, preservando o conteúdo e a versão anterior; não chama o provedor. O ajuste passa pelo mesmo schema, controle de versão, persistência e idempotência. Em uma jornada com oito etapas, a revisão é incorporada à última, preservando todas as etapas. Texto livre continua usando IA.

Validação: 157 testes em dez arquivos; TypeScript; navegador nas larguras 320, 390, 768 e 1440, sequencialmente. O teste integrado confirma a versão 2, a seleção da revisão, reload, nenhum aumento nas chamadas ao gerador durante o ajuste, canais e callbacks locais. [Relatório](contact-integrated/verification.json). Os serviços desse teste são emulados por HTTP local; não comprovam entrega externa.

IA real: o cenário fictício “vender pelo whats / loja de roupas / vender mais” gerou um conceito. A primeira verificação do botão parou em uma expectativa incorreta do teste sobre o rótulo da etapa (já corrigida). Em uma tentativa seguinte, a geração inicial falhou com `provider_unavailable`. Os três cenários reais não foram concluídos; a estabilidade do serviço continua pendente. A correção do botão não depende desse serviço. Não houve aumento de timeout, retry automático de inferência ou simulação de resposta da IA no preview do usuário.

Preview mantido em http://localhost:5175/contato/. Sem deploy do site ou painel e sem alteração de código dos building blocks. O receptor real de Contato e o Lab continuam pendentes.
