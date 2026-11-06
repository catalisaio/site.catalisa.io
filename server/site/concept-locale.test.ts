// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {conceptSchema,conceptSchemaForLocale,validateConcept,completeReferencedBlocks,includeHumanReview} from './concept';
import {conceptLocaleCopy,validConceptLocale} from '../../shared/site-concept-locale';
import type {ConceptLocale} from '../../shared/site-concept-locale';
import {enabledSiteLocales} from '../../shared/site-locale';
import type {ConceptContent} from './concept-types';

const fixture=JSON.parse(readFileSync('docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json','utf8')) as ConceptContent;
const locales=Object.keys(conceptLocaleCopy) as ConceptLocale[];
describe('localized concept contract',()=>{
 it('uses exactly the seven enabled website languages and preserves the original Portuguese schema',()=>{
  expect([...locales].sort()).toEqual([...enabledSiteLocales].sort());expect(conceptSchemaForLocale()).toEqual(conceptSchema);
  expect(validConceptLocale('fr-FR')).toBe(true);expect(validConceptLocale('lb-LU')).toBe(false);
 });
 it.each(locales)('accepts only the exact %s disclaimer without changing keys, IDs, slugs or schema version',locale=>{
  const value={...structuredClone(fixture),disclaimer:conceptLocaleCopy[locale].disclaimer},localizedSchema=conceptSchemaForLocale(locale);
  expect(validateConcept(value,locale)).toEqual(value);expect(localizedSchema.properties.disclaimer.const).toBe(value.disclaimer);
  const structural=structuredClone(localizedSchema);structural.properties.disclaimer.const=conceptSchema.properties.disclaimer.const;expect(structural).toEqual(conceptSchema);
  const wrong=locales.find(other=>other!==locale)!;
  expect(()=>validateConcept({...value,disclaimer:conceptLocaleCopy[wrong].disclaimer},locale)).toThrow();expect(()=>validateConcept({...value,disclaimer:'<script>alert(1)</script>'},locale)).toThrow();
  const badSlug=structuredClone(value);badSlug.blocks[0].slug='translated-capability';expect(()=>validateConcept(badSlug,locale)).toThrow();
  const badReference=structuredClone(value);badReference.screens[0].action.nextScreenId='translated-screen';expect(()=>validateConcept(badReference,locale)).toThrow();
  expect(()=>validateConcept({...value,html:'<p>Additional generated markup</p>'},locale)).toThrow();
  // Returning a schema to one call cannot mutate another call's literal.
  localizedSchema.properties.disclaimer.const='changed by a caller';expect(conceptSchemaForLocale(locale).properties.disclaimer.const).toBe(value.disclaimer);
 });
 it.each(locales)('uses %s fixed review and fallback block text while preserving existing content',locale=>{
  const value={...structuredClone(fixture),disclaimer:conceptLocaleCopy[locale].disclaimer};value.journey.forEach(step=>{step.humanReview=false;});
  const reviewed=includeHumanReview(value,locale);expect(validateConcept(reviewed,locale)).toEqual(reviewed);expect(reviewed.journey.at(-2)?.label).toBe(conceptLocaleCopy[locale].reviewLabel);expect(reviewed.screens).toEqual(value.screens);expect(reviewed.summary).toBe(value.summary);expect(value.journey.every(step=>!step.humanReview)).toBe(true);
  const full=structuredClone(value);full.journey=Array.from({length:8},(_,index)=>({...value.journey[0],id:'step-'+index,description:'x'.repeat(350),humanReview:false}));
  const fullReview=includeHumanReview(full,locale);expect(fullReview.journey).toHaveLength(8);expect(fullReview.journey.slice(0,7)).toEqual(full.journey.slice(0,7));expect(fullReview.journey[7].description).toContain(conceptLocaleCopy[locale].reviewSuffix.trim());expect(validateConcept(fullReview,locale)).toEqual(fullReview);
  const missing=structuredClone(value);missing.blocks=missing.blocks.filter(block=>block.slug!==value.journey[0].blockSlugs[0]);
  // The fixture has two selected blocks; removing one keeps its index schema valid.
  const completed=completeReferencedBlocks(missing,locale) as ConceptContent;expect(validateConcept(completed,locale)).toEqual(completed);
  expect(completed.blocks.find(block=>block.slug===value.journey[0].blockSlugs[0])?.role).toBe(conceptLocaleCopy[locale].blockRole(value.journey[0].label));
 });
});
