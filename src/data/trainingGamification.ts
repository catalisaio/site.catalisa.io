// XP Rules
export const XP_RULES = {
  LESSON_COMPLETE: 10,
  LESSON_WITH_QUIZ_PERFECT: 20,
  MODULE_COMPLETE: 50,
  COURSE_COMPLETE: 100,
  TRACK_COMPLETE: 250,
  QUIZ_FIRST_ATTEMPT_BONUS: 15,
  SANDBOX_COMPLETE: 25,
} as const;

// Badge Definitions
export interface BadgeDefinition {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: {
    type: 'lesson' | 'course' | 'track' | 'quiz' | 'custom';
    courseSlug?: string;
    trackSlug?: string;
    lessonCount?: number;
    quizPercentage?: number;
  };
}

export const badges: BadgeDefinition[] = [
  {
    slug: 'primeiro-passo',
    name: 'Primeiro Passo',
    description: 'Complete sua primeira licao',
    icon: 'star',
    color: 'yellow',
    criteria: { type: 'lesson', lessonCount: 1 },
  },
  {
    slug: 'explorador',
    name: 'Explorador',
    description: 'Complete o curso "Primeiros Passos"',
    icon: 'compass',
    color: 'blue',
    criteria: { type: 'course', courseSlug: 'primeiros-passos' },
  },
  {
    slug: 'mestre-leads',
    name: 'Mestre de Leads',
    description: 'Complete o curso "Dominando Leads"',
    icon: 'users',
    color: 'green',
    criteria: { type: 'course', courseSlug: 'dominando-leads' },
  },
  {
    slug: 'criador-agentes',
    name: 'Criador de Agentes',
    description: 'Complete o curso "Agentes IA"',
    icon: 'cpu',
    color: 'purple',
    criteria: { type: 'course', courseSlug: 'agentes-ia' },
  },
  {
    slug: 'arquiteto-workflows',
    name: 'Arquiteto de Workflows',
    description: 'Complete o curso "Workflows"',
    icon: 'git-branch',
    color: 'orange',
    criteria: { type: 'course', courseSlug: 'construindo-workflows' },
  },
  {
    slug: 'integrador',
    name: 'Integrador',
    description: 'Complete o curso "Custom Actions"',
    icon: 'globe',
    color: 'teal',
    criteria: { type: 'course', courseSlug: 'custom-actions' },
  },
  {
    slug: 'construtor',
    name: 'Construtor',
    description: 'Complete o curso "Building Blocks"',
    icon: 'layers',
    color: 'cyan',
    criteria: { type: 'course', courseSlug: 'building-blocks' },
  },
  {
    slug: 'whatsapp-pro',
    name: 'WhatsApp Pro',
    description: 'Complete o curso "WhatsApp Avancado"',
    icon: 'message-circle',
    color: 'green',
    criteria: { type: 'course', courseSlug: 'whatsapp-avancado' },
  },
  {
    slug: 'ai-power-user',
    name: 'AI Power User',
    description: 'Complete o curso "Automacoes Avancadas"',
    icon: 'zap',
    color: 'pink',
    criteria: { type: 'course', courseSlug: 'automacoes-avancadas' },
  },
  {
    slug: 'trilha-basica',
    name: 'Trilha Basica',
    description: 'Complete todos os 4 cursos da trilha basica',
    icon: 'award',
    color: 'blue',
    criteria: { type: 'track', trackSlug: 'basico' },
  },
  {
    slug: 'trilha-avancada',
    name: 'Trilha Avancada',
    description: 'Complete todos os 4 cursos da trilha avancada',
    icon: 'award',
    color: 'purple',
    criteria: { type: 'track', trackSlug: 'avancado' },
  },
  {
    slug: 'especialista-catalisa',
    name: 'Especialista Catalisa',
    description: 'Complete todos os 8 cursos',
    icon: 'trophy',
    color: 'yellow',
    criteria: { type: 'track', trackSlug: 'especialista' },
  },
  {
    slug: 'perfecionista',
    name: 'Perfecionista',
    description: '100% em todos os quizzes',
    icon: 'check-circle',
    color: 'green',
    criteria: { type: 'quiz', quizPercentage: 100 },
  },
];

// Certificate Definitions
export interface CertificateDefinition {
  slug: string;
  name: string;
  description: string;
  trackSlug: string;
  minQuizScore: number;
}

export const certificates: CertificateDefinition[] = [
  {
    slug: 'operador-catalisa',
    name: 'Operador Catalisa',
    description: 'Certificacao para operadores que completaram a trilha basica',
    trackSlug: 'basico',
    minQuizScore: 70,
  },
  {
    slug: 'especialista-catalisa',
    name: 'Especialista Catalisa',
    description: 'Certificacao para especialistas que dominam todas as funcionalidades',
    trackSlug: 'especialista',
    minQuizScore: 80,
  },
];
