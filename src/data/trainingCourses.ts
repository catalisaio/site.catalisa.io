export interface Lesson {
  slug: string;
  titleKey: string;
  durationMin: number;
}

export interface Module {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  durationKey: string;
  modules: Module[];
  available: boolean;
  badge?: string;
}

export const courses: Course[] = [
  {
    slug: 'iso-42001-ai-ethics',
    titleKey: 'courses.iso42001.title',
    descriptionKey: 'courses.iso42001.description',
    durationKey: 'courses.iso42001.duration',
    available: true,
    badge: 'ISO 42001',
    modules: [
      {
        slug: 'fundamentos',
        titleKey: 'courses.iso42001.modules.fundamentals.title',
        descriptionKey: 'courses.iso42001.modules.fundamentals.description',
        lessons: [
          { slug: 'o-que-e-ia', titleKey: 'courses.iso42001.modules.fundamentals.lessons.whatIsAI', durationMin: 15 },
          { slug: 'principios-eticos', titleKey: 'courses.iso42001.modules.fundamentals.lessons.ethicalPrinciples', durationMin: 15 },
          { slug: 'iso42001-visao-geral', titleKey: 'courses.iso42001.modules.fundamentals.lessons.isoOverview', durationMin: 15 },
          { slug: 'seu-papel-no-aims', titleKey: 'courses.iso42001.modules.fundamentals.lessons.yourRole', durationMin: 15 },
        ],
      },
      {
        slug: 'fairness-bias',
        titleKey: 'courses.iso42001.modules.fairness.title',
        descriptionKey: 'courses.iso42001.modules.fairness.description',
        lessons: [
          { slug: 'tipos-de-bias', titleKey: 'courses.iso42001.modules.fairness.lessons.biasTypes', durationMin: 15 },
          { slug: 'impacto-decisoes', titleKey: 'courses.iso42001.modules.fairness.lessons.decisionImpact', durationMin: 15 },
          { slug: 'mitigacao-catalisa', titleKey: 'courses.iso42001.modules.fairness.lessons.mitigation', durationMin: 15 },
          { slug: 'testes-automatizados', titleKey: 'courses.iso42001.modules.fairness.lessons.automatedTests', durationMin: 15 },
        ],
      },
      {
        slug: 'protecao-dados',
        titleKey: 'courses.iso42001.modules.dataProtection.title',
        descriptionKey: 'courses.iso42001.modules.dataProtection.description',
        lessons: [
          { slug: 'pii-dados-sensiveis', titleKey: 'courses.iso42001.modules.dataProtection.lessons.pii', durationMin: 15 },
          { slug: 'pii-scrubber-service', titleKey: 'courses.iso42001.modules.dataProtection.lessons.scrubber', durationMin: 15 },
          { slug: 'direitos-titular', titleKey: 'courses.iso42001.modules.dataProtection.lessons.rights', durationMin: 15 },
          { slug: 'retencao-dados', titleKey: 'courses.iso42001.modules.dataProtection.lessons.retention', durationMin: 15 },
        ],
      },
      {
        slug: 'transparencia',
        titleKey: 'courses.iso42001.modules.transparency.title',
        descriptionKey: 'courses.iso42001.modules.transparency.description',
        lessons: [
          { slug: 'explicabilidade', titleKey: 'courses.iso42001.modules.transparency.lessons.explainability', durationMin: 15 },
          { slug: 'comunicacao-usuarios', titleKey: 'courses.iso42001.modules.transparency.lessons.userComms', durationMin: 15 },
          { slug: 'kill-switch', titleKey: 'courses.iso42001.modules.transparency.lessons.killSwitch', durationMin: 15 },
          { slug: 'resposta-incidentes', titleKey: 'courses.iso42001.modules.transparency.lessons.incidents', durationMin: 15 },
        ],
      },
      {
        slug: 'seguranca-ai',
        titleKey: 'courses.iso42001.modules.security.title',
        descriptionKey: 'courses.iso42001.modules.security.description',
        lessons: [
          { slug: 'prompt-injection', titleKey: 'courses.iso42001.modules.security.lessons.promptInjection', durationMin: 15 },
          { slug: 'rate-limiting', titleKey: 'courses.iso42001.modules.security.lessons.rateLimiting', durationMin: 15 },
          { slug: 'monitoramento', titleKey: 'courses.iso42001.modules.security.lessons.monitoring', durationMin: 15 },
          { slug: 'red-teaming', titleKey: 'courses.iso42001.modules.security.lessons.redTeaming', durationMin: 15 },
        ],
      },
    ],
  },
  {
    slug: 'iso-27001-infosec',
    titleKey: 'courses.iso27001.title',
    descriptionKey: 'courses.iso27001.description',
    durationKey: 'courses.iso27001.duration',
    available: false,
    badge: 'ISO 27001',
    modules: [],
  },
  {
    slug: 'lgpd-data-protection',
    titleKey: 'courses.lgpd.title',
    descriptionKey: 'courses.lgpd.description',
    durationKey: 'courses.lgpd.duration',
    available: false,
    badge: 'LGPD',
    modules: [],
  },
  {
    slug: 'iso-9001-quality',
    titleKey: 'courses.iso9001.title',
    descriptionKey: 'courses.iso9001.description',
    durationKey: 'courses.iso9001.duration',
    available: false,
    badge: 'ISO 9001',
    modules: [],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getModule(course: Course, moduleSlug: string): Module | undefined {
  return course.modules.find((m) => m.slug === moduleSlug);
}

export function getLesson(mod: Module, lessonSlug: string): Lesson | undefined {
  return mod.lessons.find((l) => l.slug === lessonSlug);
}

export function getTotalLessons(course: Course): number {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

export function getTotalDuration(course: Course): number {
  return course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + l.durationMin, 0),
    0,
  );
}
