const https = require('https');
const fs = require('fs');

const QUERIES = [
  // WhatsApp Marketing & Vendas - 15 buscas
  { term: "WhatsApp marketing vendas 2026", category: "whatsapp-marketing" },
  { term: "vender no WhatsApp IA automação", category: "whatsapp-marketing" },
  { term: "WhatsApp Business API implementação", category: "whatsapp-marketing" },
  { term: "vendas conversacional WhatsApp", category: "whatsapp-marketing" },
  { term: "WhatsApp conversão taxa fechamento", category: "whatsapp-marketing" },
  { term: "marketing WhatsApp pequenas empresas", category: "whatsapp-marketing" },
  { term: "WhatsApp profissional escalar negócio", category: "whatsapp-marketing" },
  { term: "WhatsApp API múltiplos atendentes", category: "whatsapp-marketing" },
  { term: "vendas pelo WhatsApp experiência", category: "whatsapp-marketing" },
  { term: "WhatsApp catálogo digital vendas", category: "whatsapp-marketing" },
  { term: "anúncios WhatsApp click to chat", category: "whatsapp-marketing" },
  { term: "whatsapp business broadcast mensagens", category: "whatsapp-marketing" },
  { term: "WhatsApp pagamento integração", category: "whatsapp-marketing" },
  { term: "vender no WhatsApp sem ser banido", category: "whatsapp-marketing" },
  { term: "WhatsApp marketing B2B empresas", category: "whatsapp-marketing" },

  // IA no Atendimento - 15 buscas
  { term: "IA atendimento cliente automação", category: "ia-atendimento" },
  { term: "chatbot WhatsApp inteligência artificial", category: "ia-atendimento" },
  { term: "agente IA suporte cliente", category: "ia-atendimento" },
  { term: "automatizar atendimento pequenas empresas", category: "ia-atendimento" },
  { term: "chatbot humanizado atendimento", category: "ia-atendimento" },
  { term: "IA reduzir custo atendimento", category: "ia-atendimento" },
  { term: "atendimento 24 horas IA chatbot", category: "ia-atendimento" },
  { term: "inteligência artificial resolver problemas cliente", category: "ia-atendimento" },
  { term: "IA resposta automática WhatsApp", category: "ia-atendimento" },
  { term: "chatbot qualifica leads automaticamente", category: "ia-atendimento" },
  { term: "assistente virtual atendimento", category: "ia-atendimento" },
  { term: "IA entiende contexto conversa cliente", category: "ia-atendimento" },
  { term: "atendimento automatizado escala", category: "ia-atendimento" },
  { term: "chatbot multilingual suporte", category: "ia-atendimento" },
  { term: "IA medir satisfação cliente", category: "ia-atendimento" },

  // Automação para PMEs - 15 buscas
  { term: "automatizar pequeno negócio IA", category: "automacao-pme" },
  { term: "pequena empresa tecnologia 2026", category: "automacao-pme" },
  { term: "MEI automação WhatsApp", category: "automacao-pme" },
  { term: "digitalização pequena empresa", category: "automacao-pme" },
  { term: "ferramentas ia small business brasil", category: "automacao-pme" },
  { term: "automação processos pequena empresa", category: "automacao-pme" },
  { term: "empreendedor tecnologia inovação", category: "automacao-pme" },
  { term: "soluções tecnológicas para pequenos negócios", category: "automacao-pme" },
  { term: "automatizar tarefas rotina negócio", category: "automacao-pme" },
  { term: "pequeno negócio competir tecnologia", category: "automacao-pme" },
  { term: "software gestão pequena empresa", category: "automacao-pme" },
  { term: "baixo custo tecnologia pequenas empresas", category: "automacao-pme" },
  { term: "escalar negócio sem contratar", category: "automacao-pme" },
  { term: "produtividade entrepreneur automação", category: "automacao-pme" },
  { term: "soluções SaaS pequenas empresas", category: "automacao-pme" },

  // CRM & Vendas - 12 buscas
  { term: "CRM whatsapp integração vendas", category: "crm-vendas" },
  { term: "automação follow up cliente", category: "crm-vendas" },
  { term: "pipeline vendas whatsapp", category: "crm-vendas" },
  { term: "qualificação leads automação", category: "crm-vendas" },
  { term: "gestão relacionamento cliente automation", category: "crm-vendas" },
  { term: "CRM pipeline automação", category: "crm-vendas" },
  { term: "vendas automação nutrição leads", category: "crm-vendas" },
  { term: "CRM histórico conversas", category: "crm-vendas" },
  { term: "automatizar proposta comercial", category: "crm-vendas" },
  { term: "vendas recorrente automação", category: "crm-vendas" },
  { term: "gestão prospects WhatsApp", category: "crm-vendas" },
  { term: "vendas omnichannel WhatsApp", category: "crm-vendas" },

  // Tendências 2026 - 12 buscas
  { term: "tendências marketing digital 2026", category: "tendencias" },
  { term: "marketing conversacional tendências", category: "tendencias" },
  { term: "futuro atendimento cliente IA", category: "tendencias" },
  { term: "whatsapp business futuro 2026", category: "tendencias" },
  { term: "meta ai empresa atendimento", category: "tendencias" },
  { term: "chat commerce brasil tendências", category: "tendencias" },
  { term: "conversational marketing 2026", category: "tendencias" },
  { term: "IA generativa vendas atendimento", category: "tendencias" },
  { term: "WhatsApp como canal principal vendas", category: "tendencias" },
  { term: "automação inteligente marketing", category: "tendencias" },
  { term: "customer experience WhatsApp", category: "tendencias" },
  { term: "real time marketing conversacional", category: "tendencias" },

  // Desafios & Problemas - 15 buscas
  { term: "problema atendimento cliente demanda", category: "desafios" },
  { term: "atender muitos clientes", category: "desafios" },
  { term: "falta tempo vender negocio", category: "desafios" },
  { term: "perder leads resposta lenta", category: "desafios" },
  { term: "equipe atendimento sobrecarregada", category: "desafios" },
  { term: "whatsapp múltiplos atendentes problema", category: "desafios" },
  { term: "mensagens perdidas negocio", category: "desafios" },
  { term: "cliente abandona carrinho WhatsApp", category: "desafios" },
  { term: "dificuldade escalar vendas", category: "desafios" },
  { term: "atendimento lento perdendo clientes", category: "desafios" },
  { term: "gestão múltiplos canais atendimento", category: "desafios" },
  { term: "custo alto equipe atendimento", category: "desafios" },
  { term: "sem controle vendas WhatsApp", category: "desafios" },
  { term: "chaotic mensagens cliente", category: "desafios" },
  { term: "time vendas desatento follow up", category: "desafios" },

  // Usos Específicos - 14 buscas
  { term: "WhatsApp clínica médica automação", category: "usoespecificos" },
  { term: "WhatsApp academia fitness", category: "usoespecificos" },
  { term: "WhatsApp imobiliária imóvel", category: "usoespecificos" },
  { term: "WhatsApp escritório advocacia", category: "usoespecificos" },
  { term: "WhatsApp restaurante delivery", category: "usoespecificos" },
  { term: "WhatsApp ecommerce ecommerce", category: "usoespecificos" },
  { term: "WhatsApp salão beleza estética", category: "usoespecificos" },
  { term: "WhatsApp escola curso Educação", category: "usoespecificos" },
  { term: "WhatsApp oficina mecânica", category: "usoespecificos" },
  { term: "WhatsApp transportadora logística", category: "usoespecificos" },
  { term: "WhatsApp corretor seguros", category: "usoespecificos" },
  { term: "WhatsApp consultório odontológico", category: "usoespecificos" },
  { term: "WhatsApp pet shop animais", category: "usoespecificos" },
  { term: "WhatsApp empresa construção civil", category: "usoespecificos" },
];

function encodeQuery(query) {
  return encodeURIComponent(query);
}

function generateSearchUrl(term, start = 0) {
  return `https://www.linkedin.com/feed/search/?keywords=${encodeQuery(term)}&origin=SWITCH_SEARCH_V2&pagingStart=${start}`;
}

function generateGoogleSearchUrl(term, start = 0) {
  const query = `site:linkedin.com/pulse ${term} OR site:linkedin.com/feed ${term}`;
  return `https://www.google.com/search?q=${encodeQuery(query)}&start=${start}`;
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  SCRIPT DE BUSCA - LinkedIn Posts para Ganchos Catalisa');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('URLs de busca geradas:\n');

QUERIES.forEach((q, index) => {
  const linkedInUrl = generateSearchUrl(q.term);
  const googleUrl = generateGoogleSearchUrl(q.term);
  
  console.log(`[${String(index + 1).padStart(2, '0')}] ${q.category.toUpperCase()}`);
  console.log(`    Termo: "${q.term}"`);
  console.log(`    LinkedIn: ${linkedInUrl}`);
  console.log(`    Google:   ${googleUrl}`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════');
console.log('\nRESUMO POR CATEGORIA:\n');

const categories = {};
QUERIES.forEach(q => {
  if (!categories[q.category]) {
    categories[q.category] = [];
  }
  categories[q.category].push(q.term);
});

Object.entries(categories).forEach(([cat, terms]) => {
  console.log(`📂 ${cat}: ${terms.length} buscas`);
});

console.log(`\nTotal: ${QUERIES.length} consultas`);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('\n💡 INSTRUÇÕES DE USO:');
console.log('───────────────────────────────────────────────────────────────');
console.log('1. Para buscar manualmente: COPY a URL e cole no navegador');
console.log('2. Para automatizar: Use a API do Google Custom Search ou');
console.log('   LinkedIn Sales Navigator API');
console.log('3. Recomendo usar Google Search primeiro para encontrar');
console.log('   artigos do LinkedIn Pulse (mais fáceis de analisar)');
console.log('\n═══════════════════════════════════════════════════════════════');

// Export for potential automation
module.exports = { QUERIES, generateSearchUrl, generateGoogleSearchUrl };

// Generate HTML file for easy analysis
function generateHTML() {
  const categories = {};
  QUERIES.forEach(q => {
    if (!categories[q.category]) {
      categories[q.category] = [];
    }
    categories[q.category].push(q);
  });

  let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buscas LinkedIn - Ganchos Catalisa</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
    h1 { color: #734B9C; margin-bottom: 20px; }
    .category { margin-bottom: 30px; background: #16213e; border-radius: 8px; padding: 15px; }
    .category h2 { color: #e94560; font-size: 1.2em; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 8px; }
    .query-item { background: #0f3460; margin: 10px 0; padding: 12px; border-radius: 6px; }
    .query-item:hover { background: #1a4a7a; }
    .query-term { font-weight: bold; color: #fff; margin-bottom: 8px; }
    .links { display: flex; gap: 10px; flex-wrap: wrap; }
    .links a { background: #734B9C; color: white; text-decoration: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; }
    .links a:hover { background: #8b5fc0; }
    .cat-badge { background: #e94560; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px; margin-left: 8px; }
    .stats { background: #16213e; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .stats span { margin-right: 20px; }
  </style>
</head>
<body>
  <h1>🔍 Buscas LinkedIn - Ganchos Catalisa</h1>
  <div class="stats">
    <span>Total: <strong>${QUERIES.length}</strong> consultas</span>
    ${Object.entries(categories).map(([cat, items]) => `<span>${cat}: <strong>${items.length}</strong></span>`).join('')}
  </div>
`;

  Object.entries(categories).forEach(([cat, items]) => {
    html += `<div class="category">
    <h2>${cat.replace('-', ' ').toUpperCase()} <span class="cat-badge">${items.length}</span></h2>`;
    
    items.forEach((q, idx) => {
      const googleUrl = generateGoogleSearchUrl(q.term);
      const linkedInUrl = generateSearchUrl(q.term);
      html += `<div class="query-item">
        <div class="query-term">${idx + 1}. ${q.term}</div>
        <div class="links">
          <a href="${linkedInUrl}" target="_blank">🔍 LinkedIn</a>
          <a href="${googleUrl}" target="_blank">🔍 Google Pulse</a>
        </div>
      </div>`;
    });
    
    html += `</div>`;
  });

  html += `</body></html>`;
  
  fs.writeFileSync('./linkedin-leads-buscas.html', html);
  console.log('\n✅ Arquivo HTML gerado: linkedin-leads-buscas.html');
}

// Run with --html flag to generate HTML
if (process.argv.includes('--html')) {
  generateHTML();
}