export { primeirosPassosCourse } from './primeiros-passos';
export { dominandoLeadsCourse } from './dominando-leads';
export { agentesIACourse } from './agentes-ia';
export { construindoWorkflowsCourse } from './construindo-workflows';
export { customActionsCourse } from './custom-actions';
export { buildingBlocksCourse } from './building-blocks';
export { whatsappAvancadoCourse } from './whatsapp-avancado';
export { automacoesAvancadasCourse } from './automacoes-avancadas';

import { primeirosPassosCourse } from './primeiros-passos';
import { dominandoLeadsCourse } from './dominando-leads';
import { agentesIACourse } from './agentes-ia';
import { construindoWorkflowsCourse } from './construindo-workflows';
import { customActionsCourse } from './custom-actions';
import { buildingBlocksCourse } from './building-blocks';
import { whatsappAvancadoCourse } from './whatsapp-avancado';
import { automacoesAvancadasCourse } from './automacoes-avancadas';

import type { Course } from '../trainingCourses';

export const allCourses: Course[] = [
  primeirosPassosCourse,
  dominandoLeadsCourse,
  agentesIACourse,
  construindoWorkflowsCourse,
  customActionsCourse,
  buildingBlocksCourse,
  whatsappAvancadoCourse,
  automacoesAvancadasCourse,
];
