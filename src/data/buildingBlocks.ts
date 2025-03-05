export interface BuildingBlock {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  characteristics: string[];
  applicability: string[];
  benefits: string[];
  documentation: string;
  category: string;
  icon: string;
}

export const buildingBlocks: BuildingBlock[] = [
  {
    id: "audit-trail",
    title: "Audit Trail",
    short_description: "Histórico auditável de transações.",
    long_description: "Ferramenta que mantém um registro detalhado de todas as interações e transações realizadas, garantindo conformidade e rastreabilidade.",
    characteristics: ["Registro detalhado", "Segurança jurídica"],
    applicability: ["Auditorias regulatórias", "Monitoramento de conformidade"],
    benefits: ["Maior transparência", "Redução de riscos regulatórios"],
    documentation: "https://developers.catalisa.com.br/audit-trail",
    category: "Segurança e Compliance",
    icon: "FileText"
  },
  {
    id: "identity-access-management",
    title: "Identity and Access Management (IAM)",
    short_description: "Gerenciamento seguro de identidades e acessos.",
    long_description: "Plataforma de controle de acessos, autenticação multifator e monitoramento contínuo de usuários e permissões.",
    characteristics: ["Autenticação multifator", "Gestão centralizada"],
    applicability: ["Controle de acessos bancários", "Proteção contra fraudes"],
    benefits: ["Maior segurança", "Conformidade com LGPD e outras regulações"],
    documentation: "https://developers.catalisa.com.br/identity-access-management",
    category: "Segurança e Compliance",
    icon: "Shield"
  },
  {
    id: "nrt-data-platform",
    title: "NRT Data Platform",
    short_description: "Plataforma de dados em tempo real.",
    long_description: "Solução para processamento em tempo real de grandes volumes de dados transacionais, garantindo insights instantâneos para decisões financeiras.",
    characteristics: ["Análises em tempo real", "Escalabilidade"],
    applicability: ["Análise de transações financeiras", "Monitoramento de fraudes"],
    benefits: ["Agilidade na tomada de decisão", "Maior precisão nas análises"],
    documentation: "https://developers.catalisa.com.br/nrt-data-platform",
    category: "Dados e Analytics",
    icon: "BarChart2"
  },
  {
    id: "billing",
    title: "Billing",
    short_description: "Automação de faturamento e cobranças.",
    long_description: "Gestão eficiente de pagamentos e faturamentos recorrentes, garantindo controle e previsibilidade financeira.",
    characteristics: ["Gestão de cobranças", "Automação de pagamentos"],
    applicability: ["Gestão financeira", "Empresas de serviços recorrentes"],
    benefits: ["Redução de inadimplência", "Eficiência operacional"],
    documentation: "https://developers.catalisa.com.br/billing",
    category: "Operações Financeiras",
    icon: "CreditCard"
  },
  {
    id: "regulatory-decisions",
    title: "Regulatory Decisions",
    short_description: "Automação de decisões regulatórias.",
    long_description: "Plataforma para garantir que todas as operações financeiras estejam alinhadas com regulamentações vigentes.",
    characteristics: ["Monitoramento contínuo", "Integração com reguladores"],
    applicability: ["Compliance regulatório", "Conformidade bancária"],
    benefits: ["Redução de riscos legais", "Operações sempre em conformidade"],
    documentation: "https://developers.catalisa.com.br/regulatory-decisions",
    category: "Segurança e Compliance",
    icon: "CheckSquare"
  },
  {
    id: "risk-analysis",
    title: "Risk Analysis",
    short_description: "Análise de risco baseada em dados preditivos.",
    long_description: "Ferramenta de análise de risco que utiliza inteligência artificial e modelos estatísticos para prever inadimplências e fraudes.",
    characteristics: ["Análise preditiva", "Modelos estatísticos"],
    applicability: ["Gestão de crédito", "Monitoramento de portfólios financeiros"],
    benefits: ["Redução de perdas financeiras", "Tomada de decisão mais precisa"],
    documentation: "https://developers.catalisa.com.br/risk-analysis",
    category: "Dados e Analytics",
    icon: "TrendingUp"
  },
  {
    id: "vehicle-pricing",
    title: "Vehicle Pricing",
    short_description: "Precificação de veículos baseada em mercado.",
    long_description: "Solução para avaliação de preços de veículos em tempo real, considerando dados de mercado e históricos de transações.",
    characteristics: ["Análises em tempo real", "Modelagem de preços"],
    applicability: ["Avaliação de veículos", "Financiamento automotivo"],
    benefits: ["Decisões mais rápidas", "Precificação justa e precisa"],
    documentation: "https://developers.catalisa.com.br/vehicle-pricing",
    category: "Operações Financeiras",
    icon: "Truck"
  },
  {
    id: "payments",
    title: "Payments",
    short_description: "Plataforma para processamento de pagamentos.",
    long_description: "Solução completa para processamento de pagamentos, conciliando transações financeiras e garantindo segurança nas operações.",
    characteristics: ["Conciliação automatizada", "Múltiplos métodos de pagamento"],
    applicability: ["Quitação de dívidas", "Transações financeiras"],
    benefits: ["Segurança operacional", "Redução de fraudes"],
    documentation: "https://developers.catalisa.com.br/payments",
    category: "Operações Financeiras",
    icon: "DollarSign"
  },
  {
    id: "customer-portfolio-management",
    title: "Customer Portfolio Management",
    short_description: "Gestão estratégica de portfólios de clientes.",
    long_description: "Plataforma de gerenciamento de clientes, com insights personalizados para retenção e fidelização.",
    characteristics: ["Análises preditivas", "Segmentação de clientes"],
    applicability: ["Gestão de clientes", "Monitoramento de portfólios de crédito"],
    benefits: ["Melhoria na retenção", "Aumento da satisfação dos clientes"],
    documentation: "https://developers.catalisa.com.br/customer-portfolio-management",
    category: "Dados e Analytics",
    icon: "Users"
  },
  {
    id: "loan-pricing-management",
    title: "Loan Pricing Management",
    short_description: "Gestão dinâmica de precificação de crédito.",
    long_description: "Ferramenta para configuração de estratégias de precificação de crédito, permitindo ajustes personalizados conforme o perfil do cliente e condições de mercado.",
    characteristics: ["Precificação dinâmica", "Análise de risco integrada"],
    applicability: ["Crédito pessoal", "Financiamento automotivo"],
    benefits: ["Maximização de margem", "Redução de risco de inadimplência"],
    documentation: "https://developers.catalisa.com.br/loan-pricing-management",
    category: "Operações Financeiras",
    icon: "PieChart"
  },
  {
    id: "seller-management",
    title: "Seller Management",
    short_description: "Gestão de vendedores e parceiros comerciais.",
    long_description: "Gerenciamento centralizado de vendedores, incluindo condições comerciais, comissionamento e acompanhamento de desempenho.",
    characteristics: ["Gestão de parceiros", "Monitoramento de desempenho"],
    applicability: ["Redes de vendedores", "Distribuidores financeiros"],
    benefits: ["Aumento da eficiência operacional", "Melhoria no acompanhamento comercial"],
    documentation: "https://developers.catalisa.com.br/seller-management",
    category: "Operações Financeiras",
    icon: "UserCheck"
  },
  {
    id: "loan-conditions-management",
    title: "Loan Conditions Management",
    short_description: "Configuração dinâmica de condições de empréstimos.",
    long_description: "Gerenciamento flexível das condições de crédito, permitindo ajustes em taxas, prazos e regras conforme a estratégia do banco ou instituição financeira.",
    characteristics: ["Configuração flexível", "Monitoramento contínuo"],
    applicability: ["Contratos de financiamento", "Renegociação de crédito"],
    benefits: ["Maior controle sobre operações", "Adaptação a cenários regulatórios"],
    documentation: "https://developers.catalisa.com.br/loan-conditions-management",
    category: "Operações Financeiras",
    icon: "Settings"
  },
  {
    id: "auditable-files-storage",
    title: "Auditable Files Storage",
    short_description: "Armazenamento seguro de arquivos com trilha de auditoria.",
    long_description: "Sistema para armazenamento de arquivos e documentos com rastreabilidade, garantindo conformidade e segurança jurídica.",
    characteristics: ["Registro imutável", "Conformidade regulatória"],
    applicability: ["Contratos financeiros", "Auditorias regulatórias"],
    benefits: ["Maior transparência", "Redução de riscos de compliance"],
    documentation: "https://developers.catalisa.com.br/auditable-files-storage",
    category: "Segurança e Compliance",
    icon: "HardDrive"
  },
  {
    id: "vehicle-inspection",
    title: "Vehicle Inspection",
    short_description: "Automação de inspeções veiculares.",
    long_description: "Sistema para avaliação de condições de veículos, garantindo precisão na análise e agilidade nos processos de financiamento e seguro.",
    characteristics: ["Inspeção digital", "Relatórios automatizados"],
    applicability: ["Avaliação de veículos", "Seguro automotivo"],
    benefits: ["Redução do tempo de avaliação", "Aumento da confiabilidade das análises"],
    documentation: "https://developers.catalisa.com.br/vehicle-inspection",
    category: "Operações Financeiras",
    icon: "Clipboard"
  },
  {
    id: "face-recognition",
    title: "Face Recognition",
    short_description: "Validação biométrica via reconhecimento facial.",
    long_description: "Tecnologia de reconhecimento facial para autenticação segura, utilizada em processos de onboarding e prevenção de fraudes.",
    characteristics: ["Validação biométrica", "Prevenção de fraudes", "Autenticação segura"],
    applicability: ["Onboarding de clientes", "Autenticação em transações financeiras"],
    benefits: ["Redução de fraudes", "Melhoria na experiência do usuário", "Conformidade regulatória"],
    documentation: "https://developers.catalisa.com.br/face-recognition",
    category: "Segurança e Compliance",
    icon: "User"
  },
  {
    id: "document-validation",
    title: "Document Validation",
    short_description: "Validação automatizada de documentos financeiros.",
    long_description: "Verificação e autenticação de documentos em processos financeiros, garantindo conformidade regulatória e segurança.",
    characteristics: ["Análise automatizada", "Suporte a múltiplos tipos de documentos"],
    applicability: ["Processos de onboarding", "Validação documental em financiamentos"],
    benefits: ["Redução de erros e fraudes", "Eficiência operacional"],
    documentation: "https://developers.catalisa.com.br/document-validation",
    category: "Segurança e Compliance",
    icon: "FileCheck"
  },
  {
    id: "credit-analysis",
    title: "Credit Analysis",
    short_description: "Análise de risco de crédito baseada em dados preditivos.",
    long_description: "Ferramenta de análise de risco de crédito utilizando múltiplos bureaus e algoritmos de machine learning para decisões mais precisas.",
    characteristics: ["Integração com múltiplos bureaus", "Análise preditiva"],
    applicability: ["Concessão de crédito", "Refinanciamento de dívidas"],
    benefits: ["Decisões rápidas e precisas", "Mitigação de riscos"],
    documentation: "https://developers.catalisa.com.br/credit-analysis",
    category: "Dados e Analytics",
    icon: "Activity"
  },
  {
    id: "template-management",
    title: "Template Management",
    short_description: "Gerenciamento de templates de documentos.",
    long_description: "Ferramenta para criar e gerenciar templates padronizados para contratos e documentos financeiros.",
    characteristics: ["Personalização de templates", "Suporte a múltiplos idiomas"],
    applicability: ["Gestão de contratos", "Formalização digital"],
    benefits: ["Redução de erros", "Padronização de documentos"],
    documentation: "https://developers.catalisa.com.br/template-management",
    category: "Operações Financeiras",
    icon: "FileText"
  },
  {
    id: "loan-calculator",
    title: "Loan Calculator",
    short_description: "Simulação de crédito e cálculo de parcelas.",
    long_description: "Ferramenta que permite simular condições de crédito, taxas e prazos de pagamento de forma dinâmica.",
    characteristics: ["Cálculo de parcelas", "Simulação de juros"],
    applicability: ["Financiamento automotivo e imobiliário", "Refinanciamento"],
    benefits: ["Maior transparência", "Experiência personalizada"],
    documentation: "https://developers.catalisa.com.br/loan-calculator",
    category: "Operações Financeiras",
    icon: "Calculator"
  },
  {
    id: "decision-engine-flow",
    title: "Decision Engine: Flow",
    short_description: "Automação de regras de decisão via DMN.",
    long_description: "O Flow permite criar e executar regras de decisão de forma visual e simplificada, utilizando diagramas de sequência e fluxo. Ideal para automação de decisões estratégicas.",
    characteristics: ["Redução de tempo", "Transparência nas decisões", "Adaptação regulatória"],
    applicability: ["Decisões de crédito", "Políticas financeiras"],
    benefits: ["Processamento em tempo real", "Flexibilidade para múltiplos cenários"],
    documentation: "https://developers.catalisa.com.br/decision-engine-flow",
    category: "Dados e Analytics",
    icon: "GitBranch"
  },
  {
    id: "decision-engine-ai",
    title: "Decision Engine: AI",
    short_description: "Motor de decisão com IA integrada.",
    long_description: "Ferramenta que utiliza machine learning para aprimorar decisões de crédito e risco, integrando dados de múltiplos bureaus e análises preditivas.",
    characteristics: ["Modelos de IA", "Processamento em tempo real"],
    applicability: ["Concessão de crédito", "Refinanciamento"],
    benefits: ["Otimização de risco", "Decisões mais rápidas"],
    documentation: "https://developers.catalisa.com.br/decision-engine-ai",
    category: "Dados e Analytics",
    icon: "Cpu"
  },
  {
    id: "document-signature",
    title: "Document Signature",
    short_description: "Assinatura digital de documentos com validade jurídica.",
    long_description: "Permite autenticar documentos digitalmente, garantindo segurança, rastreabilidade e conformidade regulatória. Integra-se com múltiplos provedores de assinatura digital.",
    characteristics: ["Assinatura digital", "Segurança jurídica", "Integração com múltiplos provedores"],
    applicability: ["Contratos financeiros", "Formalização digital"],
    benefits: ["Redução de fraudes", "Processo 100% digital", "Automação de assinaturas"],
    documentation: "https://developers.catalisa.com.br/document-signature",
    category: "Segurança e Compliance",
    icon: "Edit3"
  }
];

export const getBlocksByCategory = () => {
  const categories: { [key: string]: BuildingBlock[] } = {};
  
  buildingBlocks.forEach(block => {
    if (!categories[block.category]) {
      categories[block.category] = [];
    }
    categories[block.category].push(block);
  });
  
  return categories;
};

export const getBlockById = (id: string): BuildingBlock | undefined => {
  return buildingBlocks.find(block => block.id === id);
};