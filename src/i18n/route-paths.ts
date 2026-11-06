// Pure route data: safe in native/bootstrap/build code without React or translation initialization.
/**
 * Route map: pt-BR path -> en-US path
 * pt-BR paths are the canonical URLs (no prefix).
 * en-US paths are prefixed with /en/.
 */
export const ptToEn: Record<string, string> = {
  '/': '/en',
  '/studio': '/en/studio',
  '/ai-agents': '/en/ai-agents',
  '/building-blocks': '/en/building-blocks',
  '/workflows': '/en/workflows',
  '/fintech': '/en/fintech',
  '/bancario': '/en/banking',
  '/seguros': '/en/insurance',
  '/varejo': '/en/retail',
  '/startups': '/en/startups',
  '/casos-de-uso': '/en/use-cases',
  '/contato': '/en/contact',
  '/demo': '/en/demo',
  '/politica-privacidade': '/en/privacy-policy',
  '/press-kit': '/en/press-kit',
  '/termos': '/en/terms',
  '/seguranca': '/en/security',
  '/como-funciona': '/en/how-it-works',
  '/integracoes/whatsapp': '/en/integrations/whatsapp',
  '/apps': '/en/apps',
  '/playbooks': '/en/playbooks',
  '/agentes-ia-whatsapp': '/en/ai-agents-whatsapp',
  '/insights': '/en/insights',
  '/insights/all': '/en/insights/all',
  '/apresentacao/comercial': '/en/presentation/commercial',
  '/apresentacao/investidor': '/en/presentation/investor',
  '/apresentacao/varejo': '/en/presentation/retail',
  '/apresentacao/fintech': '/en/presentation/fintech',
  '/apresentacao/seguros': '/en/presentation/insurance',
  '/transparencia-ia': '/en/ai-transparency',
  '/determinismo': '/en/determinism',
  '/treinamento': '/en/training',
  '/treinamento/login': '/en/training/login',
  '/apresentacao': '/en/presentation',
  '/apresentacao/login': '/en/presentation/login',
};

