import{t}from'./runtime';
/** Only visible website labels change; catalog names, slugs and API identifiers stay stable. */
export const productSourceLabels:Readonly<Record<string,string>>={
 'Med':'Saúde','Jurídico':'Jurídico','Recrutamento':'Recrutamento',
 'Biometrics':'Biometria','Decision':'Decisão',
 'Banking Platform':'Plataforma bancária','Credit Platform':'Plataforma de crédito',
};
export function productLabel(name:string){return t(productSourceLabels[name]??name);}
