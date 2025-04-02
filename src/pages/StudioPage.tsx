import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import ContactSection from '../components/home/ContactSection';
import StudioSection from '../components/home/StudioSection';
import StudioOrchestrationSection from '../components/home/StudioOrchestrationSection';
import { Code, BarChart2, Zap, GitMerge, Users, PieChart } from 'lucide-react';

const StudioPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section 
        className="py-28 relative bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url("/bg-blocks-004.jpeg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-main/70 to-primary-dark/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl">
            <div className="text-center mb-2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
                {t('studio.title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
                {t('studio.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Catalisa Studio Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark text-center">
              O que é o Catalisa Studio?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              O <strong>Catalisa Studio</strong> é a <strong>plataforma visual de backoffice da Catalisa</strong>, projetada para <strong>orquestrar, gerenciar, monitorar e inovar em produtos financeiros</strong> de maneira simplificada. Ele oferece uma <strong>interface intuitiva e low-code/no-code</strong> onde as equipes de negócio e tecnologia podem <strong>configurar fluxos financeiros complexos</strong> arrastando e conectando componentes, <strong>eliminando a necessidade de programação extensa</strong> em código. Pense no Studio como o <strong>centro de comando</strong> onde as ideias se transformam rapidamente em fluxos de negócio funcionais, impulsionando a inovação contínua no portfólio financeiro da sua instituição.
            </p>
            
            <ul className="space-y-3 text-lg text-gray-700 mb-6 list-disc pl-6">
              <li>Permite a <strong>criação visual de fluxos de processos bancários</strong> como aprovação de crédito, abertura de conta e pagamentos.</li>
              <li>Facilita a <strong>definição de regras de negócio e integrações</strong> sem a necessidade de escrever código manualmente.</li>
              <li><strong>Empodera as equipes de negócio e tecnologia</strong> a colaborarem na construção de soluções financeiras.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Studio Section */}
      <StudioSection />

      {/* Value Proposition Section */}
      <section className="py-16 bg-gradient-to-b from-primary-ultraLight to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark text-center">
              Proposta de Valor do Catalisa Studio
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              O Catalisa Studio oferece um valor significativo para instituições financeiras que buscam agilidade, inovação e eficiência em suas operações:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-light p-3 rounded-full mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">Aceleração do Time-to-Market</h3>
                </div>
                <p className="text-gray-700">Reduz drasticamente o tempo de desenvolvimento e lançamento de novas funcionalidades, simplificando tarefas complexas que antes exigiam codificação manual.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-light p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">Democratização da Inovação</h3>
                </div>
                <p className="text-gray-700">Permite que profissionais menos técnicos proponham e implementem alterações nos fluxos de produto através da interface visual, fomentando a criatividade e a rapidez na melhoria dos serviços.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-light p-3 rounded-full mr-4">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">Redução da Dependência de TI</h3>
                </div>
                <p className="text-gray-700">Empodera as equipes de negócio, permitindo que configurem e ajustem processos sem depender exclusivamente de equipes de desenvolvimento.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-light p-3 rounded-full mr-4">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">Otimização da Eficiência</h3>
                </div>
                <p className="text-gray-700">Simplifica a integração de sistemas e etapas diferentes do processo, tornando-a mais simples e padronizada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Orchestration Section */}
      <StudioOrchestrationSection />

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark text-center">
              Funcionalidades Chave do Catalisa Studio
            </h2>
            
            <div className="space-y-10">
              <div className="bg-primary-ultraLight p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-primary-dark">Editor Visual Low/No Code</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-accent-yellowPastel p-2 rounded-md mr-3 mt-1">
                      <Code className="h-4 w-4 text-accent-yellowText" />
                    </div>
                    <span>Interface intuitiva para <strong>arrastar e soltar componentes</strong>, desenhando fluxos completos de processos financeiros.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-accent-yellowPastel p-2 rounded-md mr-3 mt-1">
                      <Code className="h-4 w-4 text-accent-yellowText" />
                    </div>
                    <span>Permite a criação de fluxos desde etapas simples até processos complexos com múltiplas aprovações e integrações externas.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary-ultraLight p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-primary-dark">AI Modeler</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-accent-orangePastel p-2 rounded-md mr-3 mt-1">
                      <BarChart2 className="h-4 w-4 text-accent-orangeText" />
                    </div>
                    <span>Facilita a <strong>incorporação de modelos de inteligência artificial</strong> diretamente nos fluxos para avaliação de risco de crédito ou detecção de fraude.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-accent-orangePastel p-2 rounded-md mr-3 mt-1">
                      <BarChart2 className="h-4 w-4 text-accent-orangeText" />
                    </div>
                    <span>Democratiza o uso de AI, permitindo que analistas de negócio configurem e ajustem modelos interativamente.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary-ultraLight p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-primary-dark">Analytics Integrado e Controle de Versionamento</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-accent-bluePastel p-2 rounded-md mr-3 mt-1">
                      <GitMerge className="h-4 w-4 text-accent-blueText" />
                    </div>
                    <span><strong>Dashboards em tempo real</strong> exibem métricas críticas para tomada de decisão rápida e identificação de oportunidades de melhoria.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-accent-bluePastel p-2 rounded-md mr-3 mt-1">
                      <GitMerge className="h-4 w-4 text-accent-blueText" />
                    </div>
                    <span><strong>Controle de versão e histórico de alterações</strong> registram cada modificação, permitindo revisitar versões anteriores e garantir conformidade.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Integration with PaaS */}
      <section className="py-16 bg-gradient-to-b from-primary-ultraLight to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark text-center">
              Integração com a Catalisa PaaS
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              O verdadeiro poder do Catalisa Studio se manifesta em sua <strong>integração perfeita com a Catalisa PaaS</strong> (Plataforma como Serviço):
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Conexão Direta com Building Blocks</h3>
                <p className="text-gray-700">As orquestrações criadas no Studio consomem diretamente os módulos e APIs disponibilizados pela PaaS, garantindo que a lógica de negócio e as funcionalidades essenciais estejam centralizadas e sejam reutilizáveis.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Feedback e Evolução Contínua</h3>
                <p className="text-gray-700">Os dados coletados pelo Studio alimentam a melhoria dos building blocks da PaaS, criando um ciclo de aprimoramento contínuo.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Personalização e Adaptação Dinâmica</h3>
                <p className="text-gray-700">A flexibilidade do Studio permite que cada instituição personalize seus fluxos conforme suas necessidades específicas, mesmo utilizando módulos básicos compartilhados.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Ecossistema Integrado</h3>
                <p className="text-gray-700">A PaaS fornece a infraestrutura de serviços financeiros componíveis, escaláveis e seguros, enquanto o Studio atua como a ferramenta de orquestração e gerenciamento desses blocos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark text-center">
              Casos de Uso do Catalisa Studio
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary-ultraLight p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Criação de Produtos de Crédito Inovadores</h3>
                <p className="text-gray-700">Configurar fluxos que integram análise de risco, verificação de dados e aprovação automatizada para novos produtos de crédito.</p>
              </div>
              
              <div className="bg-primary-ultraLight p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Reengenharia de Processos Legados</h3>
                <p className="text-gray-700">Mapear e orquestrar a transição gradual de sistemas legados para soluções modernas, gerenciando toda a migração visualmente.</p>
              </div>
              
              <div className="bg-primary-ultraLight p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Gestão de Parcerias e Multicanal</h3>
                <p className="text-gray-700">Definir regras diferenciadas para diversos canais e parceiros, acompanhando o desempenho individual e ajustando ofertas dinamicamente.</p>
              </div>
              
              <div className="bg-primary-ultraLight p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Lançamento de Produtos de Refinanciamento</h3>
                <p className="text-gray-700">Integrar portabilidade de crédito e financiamento de carteira terceirizada em um único fluxo, reduzindo drasticamente o tempo de desenvolvimento.</p>
              </div>
              
              <div className="bg-primary-ultraLight p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Oferta de Serviços Financeiros por Varejistas</h3>
                <p className="text-gray-700">Orquestrar todo o processo de "compre agora, pague depois" desde a verificação de identidade até a formalização do crédito.</p>
              </div>
              
              <div className="bg-primary-ultraLight p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-primary-dark">Automação de Processos de Compliance</h3>
                <p className="text-gray-700">Implementar fluxos automatizados para verificação de conformidade, reduzindo riscos e acelerando processos de aprovação.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Strategic Impact */}
      <section className="py-16 bg-gradient-to-b from-primary-ultraLight to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark text-center">
              Impacto Estratégico do Catalisa Studio
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              A adoção do Catalisa Studio tem um impacto estratégico significativo nas instituições financeiras:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-primary-light p-2 rounded-full mr-4 mt-1">
                  <GitMerge className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">Melhor Governança dos Processos</h3>
                  <p className="text-gray-700">Rastreabilidade e controle de versão garantem uma visão clara do ciclo de vida dos produtos.</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-primary-light p-2 rounded-full mr-4 mt-1">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">Maior Agilidade Operacional</h3>
                  <p className="text-gray-700">Deploys automáticos e iteração rápida diminuem o tempo para corrigir falhas e lançar novos fluxos.</p>
                </div>
              </div>
              
              <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                <div className="bg-primary-light p-2 rounded-full mr-4 mt-1">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">Alinhamento entre TI e Negócio</h3>
                  <p className="text-gray-700">Centralização da criação e gerenciamento de orquestrações promove comunicação fluida e soluções alinhadas à estratégia corporativa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Conclusion */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-primary-dark">
              Conclusão
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              O Catalisa Studio é a peça chave para desbloquear a agilidade e a inovação no seu negócio financeiro. Ao oferecer uma plataforma visual e intuitiva para a criação, gestão e evolução de produtos financeiros, o Studio capacita suas equipes a responder rapidamente às demandas do mercado, otimizar processos e entregar experiências excepcionais aos seus clientes. Integrado à robustez e flexibilidade da Catalisa PaaS, o Studio representa o futuro da orquestração financeira na era digital.
            </p>
            
            <div className="mt-10">
              <a href="#contato" className="bg-primary-main hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg inline-flex items-center">
                Agende uma Demonstração <Zap className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default StudioPage;