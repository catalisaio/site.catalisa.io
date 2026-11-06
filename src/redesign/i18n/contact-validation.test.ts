import{describe,expect,it,vi}from'vitest';
import{parseLocalizedContactDetails}from'./contact-validation';
const{translate,locale}=vi.hoisted(()=>({translate:vi.fn((source:string)=>'localized:'+source),locale:{value:'pt-BR'}}));
vi.mock('./runtime',()=>({t:translate,getLoadedSiteLocale:()=>locale.value}));
describe('trusted contact validation localization',()=>{
 it.each([
  [{},'Informe pelo menos um e-mail ou telefone para contato.'],
  [{email:42},'Informe um e-mail ou telefone válido.'],
  [{email:'incomplete@'},'Informe um e-mail válido.'],
  [{phone:'call-me'},'Informe um telefone válido, com DDD.'],
  [{phone:'+123'},'Informe o telefone com DDD. Para outro país, inclua + e o código do país.'],
 ])('translates only the fixed validator error for %o',(input,message)=>{translate.mockClear();expect(parseLocalizedContactDetails(input)).toEqual({ok:false,message:'localized:'+message});expect(translate).toHaveBeenCalledExactlyOnceWith(message);});
 it('preserves normalized visitor details and never sends them through the translator',()=>{
  translate.mockClear();expect(parseLocalizedContactDetails({email:'  person@example.com ',phone:'(11) 99999-9999'})).toEqual({ok:true,value:{email:'person@example.com',phone:'+5511999999999'}});expect(translate).not.toHaveBeenCalled();
 });
 it('accepts an international phone without requiring a Brazilian number',()=>{
  expect(parseLocalizedContactDetails({phone:'+45 12 34 56 78'})).toEqual({ok:true,value:{phone:'+4512345678'}});
 });
 it('requires explicit country codes abroad without silently prefixing Brazil',()=>{
  locale.value='de-DE';
  try{expect(parseLocalizedContactDetails({phone:'01761234567'})).toEqual({ok:false,message:'localized:Informe o telefone com + e o código do país.'});expect(parseLocalizedContactDetails({phone:'+49 176 1234567'})).toEqual({ok:true,value:{phone:'+491761234567'}});}finally{locale.value='pt-BR';}
 });
});
