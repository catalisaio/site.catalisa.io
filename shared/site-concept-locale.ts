import {validSiteLocale} from './site-locale';

/** Fixed contract literals; visitor data and generated text never select executable content. */
export const conceptLocaleCopy={
 'pt-BR':{
  disclaimer:'Conceito exploratório. Não constitui proposta final, aprovação ou produto publicado.',
  reviewLabel:'Revisão humana',
  reviewDescription:'Uma pessoa confere os dados e decide se o fluxo pode seguir para a confirmação final. Pendências voltam para ajuste. Esta etapa faz parte do conceito; nenhum atendimento foi acionado.',
  reviewSuffix:' Antes de prosseguir, uma pessoa confere os dados e libera a confirmação ou devolve para ajuste. Revisão conceitual; nenhum atendimento foi acionado.',
  reviewRequest:'Incluir revisão humana na jornada antes da confirmação final.',
  blockRole:(label:string)=>'Apoia a etapa “'+label+'”. Consulte a jornada para o contexto de uso.',
 },
 'en-US':{
  disclaimer:'Exploratory concept. This is not a final proposal, approval or published product.',
  reviewLabel:'Human review',
  reviewDescription:'A person checks the information and decides whether the flow can proceed to final confirmation. Issues return for adjustment. This step is part of the concept; no service has been initiated.',
  reviewSuffix:' Before proceeding, a person checks the information and authorizes confirmation or returns it for adjustment. Conceptual review; no service has been initiated.',
  reviewRequest:'Include human review in the journey before final confirmation.',
  blockRole:(label:string)=>'Supports the “'+label+'” step. See the journey for its intended use.',
 },
 'de-DE':{
  disclaimer:'Exploratives Konzept. Kein endgültiges Angebot, keine Genehmigung und kein veröffentlichtes Produkt.',
  reviewLabel:'Menschliche Prüfung',
  reviewDescription:'Eine Person prüft die Angaben und entscheidet, ob der Ablauf zur endgültigen Bestätigung fortgesetzt werden kann. Offene Punkte gehen zur Korrektur zurück. Dieser Schritt gehört zum Konzept; es wurde kein Service gestartet.',
  reviewSuffix:' Vor dem Fortfahren prüft eine Person die Angaben und gibt die Bestätigung frei oder fordert Korrekturen an. Konzeptionelle Prüfung; kein Service wurde gestartet.',
  reviewRequest:'Menschliche Prüfung vor der endgültigen Bestätigung in den Ablauf aufnehmen.',
  blockRole:(label:string)=>'Unterstützt den Schritt „'+label+'“. Der Ablauf beschreibt den vorgesehenen Einsatz.',
 },
 'es-ES':{
  disclaimer:'Concepto exploratorio. No constituye una propuesta final, una aprobación ni un producto publicado.',
  reviewLabel:'Revisión humana',
  reviewDescription:'Una persona comprueba los datos y decide si el flujo puede pasar a la confirmación final. Los asuntos pendientes vuelven para su ajuste. Esta etapa forma parte del concepto; no se ha iniciado ninguna atención.',
  reviewSuffix:' Antes de continuar, una persona comprueba los datos y autoriza la confirmación o solicita ajustes. Revisión conceptual; no se ha iniciado ninguna atención.',
  reviewRequest:'Incluir una revisión humana en el recorrido antes de la confirmación final.',
  blockRole:(label:string)=>'Apoya la etapa «'+label+'». Consulta el recorrido para conocer su uso previsto.',
 },
 'da-DK':{
  disclaimer:'Undersøgende koncept. Dette er ikke et endeligt tilbud, en godkendelse eller et offentliggjort produkt.',
  reviewLabel:'Menneskelig gennemgang',
  reviewDescription:'En person kontrollerer oplysningerne og afgør, om forløbet kan fortsætte til den endelige bekræftelse. Uafklarede punkter sendes tilbage til rettelse. Dette trin er en del af konceptet; ingen betjening er startet.',
  reviewSuffix:' Før forløbet fortsætter, kontrollerer en person oplysningerne og godkender bekræftelsen eller beder om rettelser. Konceptuel gennemgang; ingen betjening er startet.',
  reviewRequest:'Tilføj menneskelig gennemgang i forløbet før den endelige bekræftelse.',
  blockRole:(label:string)=>'Understøtter trinnet “'+label+'”. Se forløbet for den tilsigtede anvendelse.',
 },
 'nl-NL':{
  disclaimer:'Verkennend concept. Dit is geen definitief voorstel, goedkeuring of gepubliceerd product.',
  reviewLabel:'Menselijke controle',
  reviewDescription:'Een persoon controleert de gegevens en beslist of het proces door kan naar de definitieve bevestiging. Openstaande punten gaan terug voor aanpassing. Deze stap hoort bij het concept; er is geen dienstverlening gestart.',
  reviewSuffix:' Voordat het proces doorgaat, controleert een persoon de gegevens en keurt de bevestiging goed of vraagt om aanpassingen. Conceptuele controle; geen dienstverlening gestart.',
  reviewRequest:'Voeg menselijke controle toe vóór de definitieve bevestiging in het proces.',
  blockRole:(label:string)=>'Ondersteunt de stap ‘'+label+'’. Bekijk het proces voor het beoogde gebruik.',
 },
 'fr-FR':{
  disclaimer:'Concept exploratoire. Il ne constitue ni une proposition définitive, ni une approbation, ni un produit publié.',
  reviewLabel:'Vérification humaine',
  reviewDescription:'Une personne vérifie les informations et décide si le parcours peut passer à la confirmation finale. Les points en suspens sont renvoyés pour correction. Cette étape fait partie du concept ; aucun service n’a été sollicité.',
  reviewSuffix:' Avant de poursuivre, une personne vérifie les informations et autorise la confirmation ou demande des corrections. Vérification conceptuelle ; aucun service n’a été sollicité.',
  reviewRequest:'Inclure une vérification humaine dans le parcours avant la confirmation finale.',
  blockRole:(label:string)=>'Accompagne l’étape « '+label+' ». Consultez le parcours pour connaître son utilisation prévue.',
 },
}as const;
export type ConceptLocale=keyof typeof conceptLocaleCopy;
export type ConceptDisclaimer=(typeof conceptLocaleCopy)[ConceptLocale]['disclaimer'];
export function validConceptLocale(value:unknown):value is ConceptLocale{return validSiteLocale(value)&&Object.hasOwn(conceptLocaleCopy,value);}
