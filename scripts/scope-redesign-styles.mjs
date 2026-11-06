import fs from 'node:fs/promises';
import postcss from 'postcss';
import {referenceAssets} from './redesign-source.mjs';

/** Scope trusted reference CSS to a native family, preserving media and animation order. */
export async function scopeStyles({files,documents,root,output,insideMain=true}){
  const result=postcss.root();
  for(const {file,all=false} of files){
    const css=postcss.parse(await fs.readFile(`${referenceAssets}/connection/${file}.css`,'utf8'));
    const animations=new Map();
    css.walkAtRules('font-face',rule=>rule.remove());
    css.walkAtRules('keyframes',rule=>{const before=rule.params;rule.params=root.slice(1)+'-'+before;animations.set(before,rule.params);});
    css.walkRules(rule=>{
      if(rule.parent.type==='atrule'&&rule.parent.name==='keyframes')return;
      const selectors=rule.selectors.filter(selector=>{
        if(/^(?:html|body|:root)\b/.test(selector)||selector==='*')return false;
        if(all)return true;
        const query=selector.replace(/::[\w-]+(?:\([^)]*\))?/g,'').replace(/:(?:hover|focus-visible|focus|active)/g,'').replace(/\[aria-expanded=true\]/g,'[aria-expanded]');
        try{return documents.some(main=>main.matches(query)||main.querySelector(query));}catch{throw Error('Unsupported CSS selector: '+selector);}
      });
      if(!selectors.length){rule.remove();return;}
      rule.selectors=selectors.map(selector=>'.c-site '+root+' '+(insideMain?selector.replace(/^main\s+/, ''):selector).replace(/\.wrap\b/g,'.c-wrap').replace(/\.label\b/g,'.c-eyebrow').replace(/\.text-link\b/g,'.c-text-link'));
    });
    css.walkDecls(declaration=>{
      declaration.value=declaration.value.replace(/Inter,Arial/g,'var(--c-font)').replace(/var\(--(line|paper|ink|purple|muted|lavender)\)/g,(_,key)=>`var(--c-${({line:'rule',paper:'paper',ink:'ink',purple:'brand',muted:'body',lavender:'lavender'})[key]})`);
      for(const [before,after]of animations)declaration.value=declaration.value.replace(new RegExp(`\\b${before}\\b`,'g'),after);
    });
    css.walkAtRules(rule=>{if(rule.nodes?.length===0)rule.remove();});
    result.append(css.nodes);
  }
  await fs.writeFile(output,'/* Generated offline from immutable N01 CSS; scoped to '+root+'. */\n'+result.toString()+'\n');
}
