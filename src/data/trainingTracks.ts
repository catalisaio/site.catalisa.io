export interface LearningTrack {
  slug: string;
  name: string;
  description: string;
  colorScheme: string;
  icon: string;
  courseSlugs: string[];
  totalXP: number;
  certificateSlug?: string;
}

export const tracks: LearningTrack[] = [
  {
    slug: 'basico',
    name: 'Trilha Basica',
    description: 'Domine os fundamentos da plataforma Catalisa. Ideal para novos clientes que querem comecar a usar o painel com confianca.',
    colorScheme: 'blue',
    icon: 'book-open',
    courseSlugs: ['primeiros-passos', 'dominando-leads', 'agentes-ia', 'construindo-workflows'],
    totalXP: 700,
    certificateSlug: 'operador-catalisa',
  },
  {
    slug: 'avancado',
    name: 'Trilha Avancada',
    description: 'Aprofunde-se em integracoes, automacoes complexas e recursos avancados. Para parceiros e usuarios experientes.',
    colorScheme: 'purple',
    icon: 'trending-up',
    courseSlugs: ['custom-actions', 'building-blocks', 'whatsapp-avancado', 'automacoes-avancadas'],
    totalXP: 900,
  },
  {
    slug: 'especialista',
    name: 'Trilha Especialista',
    description: 'Complete todos os cursos e torne-se um Especialista Catalisa certificado.',
    colorScheme: 'yellow',
    icon: 'award',
    courseSlugs: [
      'primeiros-passos', 'dominando-leads', 'agentes-ia', 'construindo-workflows',
      'custom-actions', 'building-blocks', 'whatsapp-avancado', 'automacoes-avancadas',
    ],
    totalXP: 1600,
    certificateSlug: 'especialista-catalisa',
  },
];

export function getTrack(slug: string): LearningTrack | undefined {
  return tracks.find(t => t.slug === slug);
}
