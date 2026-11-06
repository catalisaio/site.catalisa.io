import Ajv2020 from 'ajv/dist/2020.js';
import schema from './concept.schema.json';
import type { ConceptContent } from './concept-types';
import {conceptLocaleCopy} from '../../shared/site-concept-locale';
import type {ConceptLocale} from '../../shared/site-concept-locale';

export function conceptSchemaForLocale(locale:ConceptLocale='pt-BR'){
  const localized=structuredClone(schema);
  localized.properties.disclaimer.const=conceptLocaleCopy[locale].disclaimer;
  return localized;
}
const validators=new Map<ConceptLocale,ReturnType<Ajv2020['compile']>>();
function validator(locale:ConceptLocale){
  let validate=validators.get(locale);
  if(!validate){validate=new Ajv2020({strict:true,allErrors:false}).compile<ConceptContent>(conceptSchemaForLocale(locale));validators.set(locale,validate);}
  return validate;
}
export class IntegrationError extends Error {
  constructor(public code: string, message: string, public retryable = false, public diagnostic?: {stage:string;httpStatus?:number}) { super(message); }
}
/** Validate the entire schema, then cross-references. Never render model HTML or code. */
export function validateConcept(value: unknown,locale:ConceptLocale='pt-BR'): ConceptContent {
  if (!validator(locale)(value)) throw new IntegrationError('invalid_concept', 'A geração não retornou um conceito válido. Você pode tentar novamente.');
  const content = value as ConceptContent;
  const hasBlank=(entry:unknown):boolean=>typeof entry==='string'?!entry.trim():Array.isArray(entry)?entry.some(hasBlank):!!entry&&typeof entry==='object'?Object.values(entry).some(hasBlank):false;
  if(hasBlank(content))throw new IntegrationError('invalid_concept','A geração retornou campos vazios. Você pode tentar novamente.');
  const screens = new Set(content.screens.map(screen => screen.id));
  const steps = new Set(content.journey.map(step => step.id));
  const blocks = new Set(content.blocks.map(block => block.slug));
  if (screens.size !== content.screens.length || steps.size !== content.journey.length || blocks.size !== content.blocks.length || content.screens.some(screen => screen.action.nextScreenId !== null && !screens.has(screen.action.nextScreenId)) || content.journey.some(step => step.blockSlugs.some(slug => !blocks.has(slug)))) throw new IntegrationError('invalid_concept_references', 'O conceito retornou conexões inconsistentes. Você pode tentar novamente.');
  return content;
}
export const conceptSchema = schema;

/** Complete the redundant block index using capabilities explicitly named in the journey.
 * Never infer IDs or admit unknown capabilities: schema and reference validation still apply.
 */
export function completeReferencedBlocks(value: unknown,locale:ConceptLocale='pt-BR'): unknown {
  if (!validator(locale)(value)) return value;
  const content=structuredClone(value as ConceptContent),selected=new Set(content.blocks.map(block=>block.slug));
  // Some providers serialize the terminal sentinel as the JSON string "null".
  // It unambiguously means no next screen unless a real screen has that ID.
  // Other dangling references remain errors; never guess a destination.
  if(!content.screens.some(screen=>screen.id==='null'))for(const screen of content.screens)if(screen.action.nextScreenId==='null')screen.action.nextScreenId=null;
  for(const step of content.journey)for(const slug of step.blockSlugs){
    if(selected.has(slug))continue;
    content.blocks.push({slug,role:conceptLocaleCopy[locale].blockRole(step.label)});
    selected.add(slug);
  }
  return content;
}

/** A fixed edit to the exploratory journey does not require model inference. */
export function includeHumanReview(previous: ConceptContent,locale:ConceptLocale='pt-BR'): ConceptContent {
  const content = structuredClone(previous);
  if (content.journey.some(step => step.humanReview)) return content;
  const review = {
    id: 'human-review',
    label: conceptLocaleCopy[locale].reviewLabel,
    description: conceptLocaleCopy[locale].reviewDescription,
    blockSlugs: [],
    humanReview: true,
  };
  const ids = new Set(content.journey.map(step => step.id));
  for (let suffix = 1; ids.has(review.id); suffix++) review.id = 'human-review-' + suffix;
  if (content.journey.length < 8) content.journey.splice(content.journey.length - 1, 0, review);
  else {
    // Keep every existing step when the schema has no room for another one.
    const final = content.journey.at(-1)!;
    final.humanReview = true;
    final.description = final.description.slice(0, 130) + conceptLocaleCopy[locale].reviewSuffix;
  }
  return validateConcept(content,locale);
}
