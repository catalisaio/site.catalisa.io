export interface ContactDetails { email?:string;phone?:string }
/** Shared validation only. No credentials, storage or server code is imported here. */
export function parseContactDetails(input:{email?:unknown;phone?:unknown},options:{requireCountryCode?:boolean}={}):{ok:true;value:ContactDetails}|{ok:false;message:string}{
  if((input.email!==undefined&&typeof input.email!=='string')||(input.phone!==undefined&&typeof input.phone!=='string'))return{ok:false,message:'Informe um e-mail ou telefone válido.'};
  const email=(input.email as string|undefined)?.trim()||undefined;
  let phone=(input.phone as string|undefined)?.trim()||undefined;
  if(!email&&!phone)return{ok:false,message:'Informe pelo menos um e-mail ou telefone para contato.'};
  if(email&&(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return{ok:false,message:'Informe um e-mail válido.'};
  if(phone){
    if(phone.length>40||!/^[+\d\s().-]+$/.test(phone))return{ok:false,message:'Informe um telefone válido, com DDD.'};
    phone=phone.replace(/[\s().-]/g,'');
    if(options.requireCountryCode&&!phone.startsWith('+'))return{ok:false,message:'Informe o telefone com + e o código do país.'};
    if(!phone.startsWith('+')){
      if(/^\d{10,11}$/.test(phone))phone='+55'+phone;
      else if(/^55\d{10,11}$/.test(phone))phone='+'+phone;
    }
    if(!/^\+[1-9]\d{9,14}$/.test(phone))return{ok:false,message:'Informe o telefone com DDD. Para outro país, inclua + e o código do país.'};
  }
  return{ok:true,value:{...(email?{email}:{}),...(phone?{phone}:{})}};
}
