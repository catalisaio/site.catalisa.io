# Guia Completo de Configuração do Google Analytics 4 para Catalisa.io

Este guia fornece instruções detalhadas para configurar e utilizar o Google Analytics 4 (GA4) para o site Catalisa.io. O GA4 oferece recursos avançados de rastreamento de eventos, análise de jornadas do usuário e relatórios personalizados que ajudarão a entender melhor o comportamento dos visitantes e otimizar a conversão.

## Índice

1. [Criando uma Conta do Google Analytics](#1-criando-uma-conta-do-google-analytics)
2. [Configurando uma Propriedade do GA4](#2-configurando-uma-propriedade-do-ga4)
3. [Implementando o Código de Rastreamento](#3-implementando-o-código-de-rastreamento)
4. [Configurando Eventos Personalizados](#4-configurando-eventos-personalizados)
5. [Configurando Conversões](#5-configurando-conversões)
6. [Configurando Públicos Personalizados](#6-configurando-públicos-personalizados)
7. [Relatórios e Painéis](#7-relatórios-e-painéis)
8. [Integrações Avançadas](#8-integrações-avançadas)
9. [Monitoramento e Manutenção](#9-monitoramento-e-manutenção)

## 1. Criando uma Conta do Google Analytics

### Passos:

1. Acesse [analytics.google.com](https://analytics.google.com/) e faça login com sua conta Google
2. Clique em "Começar a medir"
3. Forneça um nome para sua conta (ex: "Catalisa")
4. Configure as opções de compartilhamento de dados conforme suas preferências
5. Clique em "Próximo"

## 2. Configurando uma Propriedade do GA4

### Passos:

1. Forneça um nome para a propriedade (ex: "Catalisa.io Website")
2. Selecione o fuso horário correto (geralmente "Brasília") e a moeda (BRL)
3. Clique em "Mostrar opções avançadas"
4. Ative "Criar uma propriedade do Universal Analytics"
5. Forneça a URL do site (https://catalisa.io)
6. Clique em "Próximo"
7. Preencha as informações sobre seu negócio
8. Clique em "Criar"

### Obtendo o ID de Medição (Measurement ID)

1. Na interface do GA4, vá para "Administrador" (ícone de engrenagem)
2. Na coluna "Propriedade", clique em "Fluxos de dados"
3. Clique no fluxo de dados da web que você criou
4. Copie o "ID de medição" (formato G-XXXXXXXXXX)
5. Este é o ID que você precisa substituir no código de rastreamento no arquivo `index.html` no lugar de "G-XXXXXXXXXX"

## 3. Implementando o Código de Rastreamento

O código de rastreamento já foi implementado no arquivo `index.html` e o utilitário de analytics em `src/lib/analytics.ts`. Você precisa apenas substituir o ID de medição pelo seu ID real.

### Substituindo o ID de Medição:

1. Abra o arquivo `index.html`
2. Localize a seguinte linha:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

3. Substitua `G-XXXXXXXXXX` pelo seu ID de medição
4. Faça o mesmo para a linha `gtag('config', 'G-XXXXXXXXXX', {`

### Verificando a Implementação:

1. Depois de implantar as alterações, acesse o site
2. No Google Analytics, vá para "Relatórios" > "Tempo real"
3. Você deve ver sua sessão ativa no relatório em tempo real
4. Também pode usar o Google Tag Assistant (extensão do Chrome) para verificar se o GA4 está sendo carregado corretamente

## 4. Configurando Eventos Personalizados

O GA4 funciona com base em eventos. Além dos eventos automáticos, implementamos eventos personalizados para rastrear interações específicas do site Catalisa.io.

### Eventos Automáticos:

O GA4 rastreia automaticamente:
- Visualizações de página
- Rolagem da página
- Cliques de saída
- Pesquisas no site
- Reproduções de vídeo

### Eventos Personalizados Implementados:

Os seguintes eventos personalizados foram implementados no arquivo `src/lib/analytics.ts`:

| Evento | Descrição | Parâmetros |
|--------|-----------|------------|
| `language_change` | Mudança de idioma | `from_language`, `to_language` |
| `cta_click` | Clique em botões de CTA | `cta_id`, `cta_text`, `destination` |
| `form_submit` | Envios de formulário | `form_id`, `form_name`, `success` |
| `block_view` | Visualização de Building Block | `block_id`, `block_name` |
| `podcast_action` | Ações do podcast | `podcast_id`, `podcast_name`, `action`, `time_position` |

### Configurando Eventos no Painel do GA4:

1. Vá para "Configure" > "Eventos" no painel do GA4
2. Clique em "Criar evento"
3. Dê um nome ao evento personalizado (deve corresponder ao nome do evento enviado pelo código)
4. Adicione condições conforme necessário
5. Clique em "Salvar"

## 5. Configurando Conversões

As conversões são eventos importantes que representam objetivos de negócio.

### Eventos Recomendados para Definir como Conversões:

- `conversion_contact_form_submission` (Envio do formulário de contato)
- `conversion_demo_scheduled` (Agendamento de demonstração)
- `conversion_whitepaper_download` (Download de whitepaper)

### Configurando Conversões no GA4:

1. Vá para "Configure" > "Conversões" no painel do GA4
2. Clique em "Nova conversão"
3. Selecione o evento que deseja marcar como conversão
4. Clique em "Salvar"

## 6. Configurando Públicos Personalizados

Os públicos ajudam a segmentar usuários com base em comportamentos específicos.

### Públicos Recomendados:

- Usuários que visualizaram Building Blocks específicos
- Usuários que iniciaram o agendamento de demo mas não concluíram
- Visitantes recorrentes (mais de 3 visitas)
- Usuários por idioma (segmentação por mercado)

### Configurando Públicos:

1. Vá para "Configure" > "Públicos" no painel do GA4
2. Clique em "Novo público"
3. Defina as condições para segmentação (ex: eventos, propriedades do usuário)
4. Dê um nome ao público e clique em "Salvar"

## 7. Relatórios e Painéis

O GA4 oferece relatórios padrão e recursos para criar painéis personalizados.

### Relatórios Recomendados:

1. **Exploração de Jornada do Usuário**:
   - Vá para "Explore" > "Nova exploração"
   - Selecione o modelo "Exploração de Jornada"
   - Configure para visualizar como os usuários navegam entre páginas principais

2. **Análise de Conversão**:
   - Vá para "Explore" > "Nova exploração"
   - Selecione o modelo "Funil"
   - Configure etapas da conversão (ex: Visita > Visualização do Building Block > Formulário de Contato > Agendamento de Demo)

3. **Análise de Usuários por Idioma**:
   - Vá para "Relatórios" > "Usuário" > "Demográficos"
   - Segmente por propriedade do usuário "language"

### Criando um Painel Personalizado:

1. Vá para "Relatórios" > "Visão geral"
2. Clique em "Personalizar relatórios"
3. Adicione os widgets relevantes (gráficos, tabelas)
4. Organize conforme necessário para obter insights rápidos

## 8. Integrações Avançadas

### Google Tag Manager (Recomendado):

Para implementação mais flexível, considere migrar para o Google Tag Manager:

1. Crie uma conta em [tagmanager.google.com](https://tagmanager.google.com/)
2. Configure um contêiner para o site
3. Adicione a tag do GA4 no GTM
4. Implemente o código do GTM no site
5. Use acionadores personalizados para eventos mais complexos

### Google Search Console:

Integre o Search Console para dados de SEO:

1. Configure o Search Console para o site
2. Vá para "Administrador" > "Configurações da propriedade" no GA4
3. Em "Conexões de produtos", conecte com o Search Console

### BigQuery (Análise Avançada):

Para análise profunda de dados:

1. Vá para "Administrador" > "Configurações da propriedade" > "Exportação de BigQuery"
2. Configure a exportação diária para o BigQuery
3. Use SQL para análises personalizadas e mais granulares

## 9. Monitoramento e Manutenção

### Verificações Regulares:

- **Semanalmente**:
  - Verifique os relatórios em tempo real para garantir que o rastreamento continua funcionando
  - Revise as principais métricas de conversão

- **Mensalmente**:
  - Analise tendências comparando com meses anteriores
  - Verifique se há quedas inexplicáveis no rastreamento
  - Atualize públicos e objetivos conforme necessário

- **Trimestralmente**:
  - Faça uma análise profunda dos dados
  - Identifique oportunidades de otimização
  - Atualize a estratégia de rastreamento conforme necessário

### Resolução de Problemas Comuns:

- **Eventos não aparecem no relatório em tempo real**:
  - Verifique o console JavaScript para erros
  - Confirme que o ID de medição está correto
  - Teste o evento usando o modo de depuração do GA4

- **Discrepâncias nos dados**:
  - Verifique se há bloqueadores de anúncios ou cookies
  - Confirme que o código está presente em todas as páginas
  - Verifique configurações de privacidade e consentimento

## Conclusão

Com esta configuração, o site Catalisa.io terá um rastreamento detalhado que permitirá:

1. Entender como os usuários navegam pelo site
2. Identificar gargalos no processo de conversão
3. Otimizar a experiência com base no comportamento real dos usuários
4. Medir o ROI das campanhas de marketing
5. Tomar decisões baseadas em dados para melhorias contínuas do site

Recomenda-se revisar e atualizar esta estratégia de analytics a cada 6 meses, à medida que o GA4 evolui e as necessidades de negócios se alteram.

---

## Recursos Adicionais

- [Documentação oficial do GA4](https://support.google.com/analytics/answer/10089681)
- [Migração do Universal Analytics para o GA4](https://support.google.com/analytics/answer/10032198)
- [Cursos gratuitos do Google Analytics Academy](https://analytics.google.com/analytics/academy/)