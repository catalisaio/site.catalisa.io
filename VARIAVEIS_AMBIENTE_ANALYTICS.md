# Guia de Variáveis de Ambiente para Analytics

Este documento explica como as variáveis de ambiente foram configuradas para gerenciar as configurações do Google Analytics (GA4) e Google Tag Manager (GTM) no projeto Catalisa.io.

## Variáveis Configuradas

As seguintes variáveis de ambiente foram adicionadas ao arquivo `.env`:

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `VITE_GA_MEASUREMENT_ID` | ID de medição do Google Analytics 4 | G-XXXXXXXXXX |
| `VITE_ANALYTICS_ENABLED` | Controla se o rastreamento está ativo | true |
| `VITE_APP_NAME` | Nome da aplicação (para propriedades do usuário) | Catalisa Platform |
| `VITE_APP_VERSION` | Versão da aplicação (para propriedades do usuário) | 1.0.0 |
| `VITE_GTM_CONTAINER_ID` | ID do contêiner do Google Tag Manager | GTM-XXXXXXX |

## Arquivos Atualizados

Para implementar esta abordagem, foram feitas alterações nos seguintes arquivos:

1. `.env` - Adicionadas as variáveis mencionadas acima
2. `src/vite-env.d.ts` - Adicionados tipos para as variáveis de ambiente
3. `index.html` - Substituídos valores hardcoded por referências às variáveis de ambiente
4. `src/lib/analytics.ts` - Atualizado para usar as variáveis de ambiente

## Como Configurar para Diferentes Ambientes

### Ambiente de Desenvolvimento

Para desenvolvimento local, você pode criar um arquivo `.env.local` (que não é versionado pelo git) com suas configurações específicas:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
VITE_ANALYTICS_ENABLED=false  # Desativa o rastreamento durante o desenvolvimento
VITE_APP_NAME=Catalisa Platform
VITE_APP_VERSION=1.0.0
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
```

### Ambiente de Teste/Staging

Para o ambiente de teste, crie um arquivo `.env.staging`:

```
VITE_GA_MEASUREMENT_ID=G-TESTXXXX  # ID específico para ambiente de teste
VITE_ANALYTICS_ENABLED=true
VITE_APP_NAME=Catalisa Platform
VITE_APP_VERSION=1.0.0
VITE_GTM_CONTAINER_ID=GTM-TESTXXX
```

### Ambiente de Produção

Para produção, crie um arquivo `.env.production`:

```
VITE_GA_MEASUREMENT_ID=G-PRODXXXX  # ID de produção real
VITE_ANALYTICS_ENABLED=true
VITE_APP_NAME=Catalisa Platform
VITE_APP_VERSION=1.0.0
VITE_GTM_CONTAINER_ID=GTM-PRODXXX
```

## Como Ativar/Desativar o Rastreamento

O rastreamento pode ser facilmente ativado ou desativado alterando a variável `VITE_ANALYTICS_ENABLED`:

- `VITE_ANALYTICS_ENABLED=true` - Ativa o rastreamento
- `VITE_ANALYTICS_ENABLED=false` - Desativa o rastreamento

Isso é útil para:
- Desenvolvimento local (sem enviar dados para o GA)
- Testes automatizados
- Debugging
- Implantações em ambientes específicos

## Como as Variáveis são Utilizadas no Código

### No HTML (index.html)

O arquivo `index.html` usa o formato `%NOME_VARIAVEL%` para substituição de variáveis:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '%VITE_GA_MEASUREMENT_ID%', {
    'send_page_view': true,
    'user_properties': {
      'app_name': '%VITE_APP_NAME%',
      'app_version': '%VITE_APP_VERSION%'
    }
  });
</script>
```

### No TypeScript (analytics.ts)

No código TypeScript, as variáveis são acessadas através de `import.meta.env`:

```typescript
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
const APP_NAME = import.meta.env.VITE_APP_NAME;
const APP_VERSION = import.meta.env.VITE_APP_VERSION;
```

A biblioteca `analytics.ts` verifica se o rastreamento está habilitado antes de enviar eventos:

```typescript
const isGtagLoaded = (): boolean => {
  return ANALYTICS_ENABLED && 
         typeof window !== 'undefined' && 
         typeof window.gtag === 'function';
};
```

## Benefícios Desta Abordagem

1. **Segurança**: IDs de rastreamento não estão hardcoded no repositório
2. **Flexibilidade**: Fácil alternar entre diferentes configurações para diferentes ambientes
3. **Manutenção**: Todas as configurações estão centralizadas em um único lugar
4. **Código mais limpo**: Sem valores hardcoded espalhados pelo código
5. **Consistência**: Garantia de que as mesmas configurações são usadas em toda a aplicação

## Implementação de GTM (Futuro)

Para implementar o Google Tag Manager no futuro, a variável `VITE_GTM_CONTAINER_ID` já está configurada. A implementação exigirá:

1. Adicionar o script do GTM no `index.html`
2. Configurar o GA4 através do GTM em vez de diretamente
3. Usar a camada de dados (dataLayer) para enviar eventos

## Observações

- Lembre-se de nunca compartilhar o arquivo `.env` com os IDs reais em repositórios públicos
- Para ambientes CI/CD, configure as variáveis de ambiente no serviço de CI/CD em vez de usar arquivos
- Utilize `.env.example` no repositório como modelo, com valores de exemplo para orientação