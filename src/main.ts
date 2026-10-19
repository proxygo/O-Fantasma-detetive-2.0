import './style.css';
import './illustrated-ui.css';
import { brake, createState, investigate, nearestObject, answer, steer, update, type Vector, type Mode } from './game.ts';
import { objects, type ObjectId } from './investigation.ts';
import { guide } from './onboarding.ts';
import { loadArt } from './assets.ts';
import { render } from './render.ts';
import { drawCharacter } from './character.ts';
import { createCharacterAnimation, advanceCharacterAnimation, celebrateDiscovery } from './character-animation.ts';
// The site hosts these small controls so its existing API permissions remain unchanged.
if (location.hostname === 'proxygo.github.io' && location.pathname.startsWith('/O-Fantasma-detetive-2.0/')) {
  for (const frame of document.querySelectorAll<HTMLIFrameElement>('[data-community-widget]')) {
    frame.src = 'https://proxygo.com.br/fantasma-game-widget.html?mode=' + frame.dataset.communityWidget;
  }
} else {
  for (const frame of document.querySelectorAll<HTMLIFrameElement>('[data-community-widget]')) frame.hidden = true;
}
function element<T extends HTMLElement>(id:string):T {
  const result=document.getElementById(id);if(!result)throw new Error('Elemento ausente: '+id);return result as T;
}
const canvas=element<HTMLCanvasElement>('game');
const context=canvas.getContext('2d');if(!context)throw new Error('Canvas 2D indisponível.');
const ctx=context,dialog=element<HTMLDialogElement>('dialog'),onboarding=element<HTMLDialogElement>('onboarding');
let state=createState(),artReady=false,step=0;
let animation=createCharacterAnimation(),newClueDialogue=false;
let goToAnswer=false;
const portrait=element<HTMLCanvasElement>('clue-character').getContext('2d');
const guidePortrait=element<HTMLCanvasElement>('guide-character').getContext('2d');
let returnFocus:HTMLElement=canvas,guideFocus:HTMLElement=canvas;
let resumeMode:Mode='start';
const directions:Record<string,Vector>={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
const keyAliases:Record<string,string>={w:'ArrowUp',s:'ArrowDown',a:'ArrowLeft',d:'ArrowRight'};
const keys=new Set<string>();
const selector=element<HTMLSelectElement>('object-select');
for(const object of objects){const option=document.createElement('option');option.value=object.id;option.textContent=object.name;selector.append(option);}
function sync() {
  element('start-panel').hidden=state.mode!=='start';
  element('ending').hidden=state.mode!=='won';
  element<HTMLButtonElement>('inspect').disabled=state.mode!=='exploring';
  element<HTMLButtonElement>('start').disabled=!artReady;
  selector.disabled=state.mode!=='exploring';
  const modes:Record<Mode,string>={start:'Boas-vindas',exploring:'Explorando',dialog:'Lendo uma pista',paused:'Guia aberto · pausa',won:'Caso encerrado'};
  element('mode').textContent=modes[state.mode];
  element('progress').textContent=state.clues.length+' / '+objects.length+' pistas';
  element('note-title').textContent=state.clues.length+' de '+objects.length+' pistas';
  element('note-text').textContent=state.mode==='won'?'Caso encerrado. As quatro descobertas estão registradas aqui.':state.clues.length===4?'Todas reunidas. Escreva a resposta em “Resolver o mistério”.':state.clues.length?'Siga a indicação da última descoberta.':'Comece pela cadeira, à esquerda da biblioteca.';
  const list=element('clues');list.replaceChildren();
  for(const id of state.clues){
    const o=objects.find(o=>o.id===id)!;const li=document.createElement('li');
    const title=document.createElement('strong');title.textContent=o.name;
    const p=document.createElement('p');p.textContent=o.clue;li.append(title,p);list.append(li);
  }
  element<HTMLFieldSetElement>('answer-fields').disabled=state.mode!=='exploring'||state.clues.length<4;
  element('answer-lock').hidden=state.clues.length===4;
  for(const button of document.querySelectorAll<HTMLButtonElement>('.touch button'))button.disabled=state.mode!=='exploring';
}
function stop(){keys.clear();brake(state);}
function showStep(){
  const content=guide[step];
  element('onboarding-title').textContent=content.title;
  element('onboarding-body').textContent=content.body;
  // Local, authored content only. No external strings are inserted as HTML.
  element('onboarding-extra').innerHTML=content.extra;
  element('onboarding-progress').textContent='GUIA RÁPIDO · '+(step+1)+' DE '+guide.length;
  element<HTMLButtonElement>('onboarding-back').disabled=step===0;
  element('onboarding-next').textContent=step===guide.length-1?(resumeMode==='start'?'Começar a jogar':'Voltar ao jogo'):'Próximo';
  element('skip-onboarding').textContent=resumeMode==='start'?'Pular explicação':'Fechar guia';
  onboarding.querySelectorAll('.step-dots i').forEach((dot,index)=>dot.classList.toggle('active',index===step));
}
function openGuide(){
  if(onboarding.open||dialog.open||!artReady)return;
  guideFocus=document.activeElement instanceof HTMLElement?document.activeElement:canvas;
  resumeMode=state.mode;stop();state.mode='paused';step=0;showStep();sync();
  onboarding.showModal();element('onboarding-next').focus();
}
function finishGuide(){onboarding.close();}
onboarding.addEventListener('close',()=>{
  state.mode=resumeMode==='start'?'exploring':resumeMode;stop();sync();
  if(state.mode==='exploring'){canvas.focus();element('announcement').textContent=resumeMode==='start'?'Exploração iniciada. Comece pela cadeira, à esquerda.':'Guia fechado. Exploração retomada com suas pistas preservadas.';}
  else guideFocus.focus();
});
element('help').addEventListener('click',openGuide);
element('start').addEventListener('click',openGuide);
element('skip-onboarding').addEventListener('click',finishGuide);
element('onboarding-next').addEventListener('click',()=>{if(step===guide.length-1)finishGuide();else{step++;showStep();element('onboarding-title').focus();}});
element('onboarding-back').addEventListener('click',()=>{if(step>0){step--;showStep();element('onboarding-title').focus();}});
function openDialogue(id:ObjectId,accessible=false){
  const oldCount=state.clues.length;
  const object=investigate(state,id,accessible);if(!object)return;
  newClueDialogue=state.clues.length>oldCount;
  if(newClueDialogue)celebrateDiscovery(animation);
  else animation.happyRemaining=0;
  keys.clear();returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:canvas;
  element('dialog-eyebrow').textContent=state.clues.length===oldCount?'REVISITANDO UMA PISTA':'NOVA DESCOBERTA · '+state.clues.length+' DE 4';
  element('dialog-title').textContent=object.name;element('dialog-body').textContent=object.clue;
  element('close-dialog').textContent=state.clues.length===objects.length?'Ir para a resposta':'Continuar explorando';
  element('dialog-note').textContent=state.clues.length===objects.length?'Você reuniu as quatro pistas! Agora pode concluir o caso no caderno.':'A pista fica no caderno. A exploração está pausada.';
  element('announcement').textContent='Pista no caderno: '+object.name;sync();dialog.showModal();element('close-dialog').focus();
}
function reset(){
  state=createState();keys.clear();returnFocus=canvas;
  animation=createCharacterAnimation();newClueDialogue=false;goToAnswer=false;
  if(dialog.open)dialog.close();
  element<HTMLFormElement>('answer-form').reset();element('answer').removeAttribute('aria-invalid');element('answer-feedback').textContent='';element('announcement').textContent='';
  sync();element('start').focus();
}
element('restart').addEventListener('click',reset);element('play-again').addEventListener('click',reset);
element('inspect').addEventListener('click',()=>openDialogue(selector.value as ObjectId,true));
element('nearby-inspect').addEventListener('click',()=>{const object=nearestObject(state);if(object)openDialogue(object.id);});
element('close-dialog').addEventListener('click',()=>{goToAnswer=state.clues.length===objects.length;dialog.close();});
dialog.addEventListener('close',()=>{if(state.mode==='dialog'){state.mode='exploring';if(newClueDialogue)celebrateDiscovery(animation);}newClueDialogue=false;sync();if(goToAnswer&&state.mode==='exploring'){goToAnswer=false;element('answer').focus();}else if(state.mode==='start')element('start').focus();else if(returnFocus.id==='nearby-inspect')canvas.focus();else returnFocus.focus();});
element('answer').addEventListener('input',()=>{element('answer').removeAttribute('aria-invalid');element('answer-feedback').textContent='';});
element('answer-form').addEventListener('submit',event=>{
  event.preventDefault();stop();
  const result=answer(state,element<HTMLInputElement>('answer').value);
  if(result==='wrong'||result==='empty'){element('answer').setAttribute('aria-invalid','true');element('answer').focus();}
  element('answer-feedback').textContent=result==='wrong'?'Ainda não é essa. Releia as pistas e tente novamente.':result==='empty'?'Digite sua resposta.':result==='locked'?'Reúna as quatro pistas primeiro.':'';
  if(result==='correct'){element('ending-detail').textContent='Você reuniu as quatro pistas e encontrou a resposta: 42.';sync();element('play-again').focus();element('announcement').textContent='Investigação concluída!';}
});
canvas.addEventListener('keydown',event=>{
  const key=keyAliases[event.key.toLowerCase()]||event.key;
  if(directions[key]||event.code==='Space'||event.key==='Enter')event.preventDefault();
  if(state.mode!=='exploring')return;
  if(event.code==='Space'){stop();return;}
  if(event.key==='Enter'){const object=nearestObject(state);if(object&&!event.repeat)openDialogue(object.id);return;}
  if(directions[key]){keys.add(key);const v={x:0,y:0};for(const k of keys){v.x+=directions[k].x;v.y+=directions[k].y;}steer(state,v);}
});
canvas.addEventListener('keyup',event=>keys.delete(keyAliases[event.key.toLowerCase()]||event.key));
canvas.addEventListener('blur',()=>{keys.clear();});
window.addEventListener('blur',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
// Blur from the game must stop movement, but clicking Investigate must retain the nearby target.
document.addEventListener('focusin',event=>{if(event.target!==canvas)stop();});
const names:Record<string,string>={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(button=>button.addEventListener('click',()=>{canvas.focus();steer(state,directions[names[button.dataset.direction!]]);}));
element('brake').addEventListener('click',()=>{canvas.focus();stop();});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let previous=0,lastNearby='';
function frame(now:number){
  const dt=previous?(now-previous)/1000:0;
  update(state,dt);advanceCharacterAnimation(animation,dt,reducedMotion.matches);previous=now;
  const object=state.mode==='exploring'?nearestObject(state):null;
  const description=object?(state.clues.includes(object.id)?'Reexaminar · ':'Investigar · ')+object.name:state.mode==='exploring'?(state.clues.length?'Aproxime-se de um objeto para investigar.':'Comece pela cadeira, à esquerda da biblioteca.'):'';
  if(description!==lastNearby){lastNearby=description;element('nearby-description').textContent=description;}
  element<HTMLButtonElement>('nearby-inspect').disabled=!object;
  render(ctx,state,now/1000,reducedMotion.matches,animation);
  if(portrait && dialog.open){
    portrait.clearRect(0,0,200,150);
    portrait.save();portrait.translate(100,80);portrait.scale(1.45,1.45);
    drawCharacter(portrait,animation,reducedMotion.matches,false,newClueDialogue);
    portrait.restore();
  }
  if(guidePortrait && onboarding.open){
    guidePortrait.clearRect(0,0,200,150);
    guidePortrait.save();guidePortrait.translate(100,80);guidePortrait.scale(1.45,1.45);
    drawCharacter(guidePortrait,animation,reducedMotion.matches,false);
    guidePortrait.restore();
  }
  requestAnimationFrame(frame);
}
sync();requestAnimationFrame(frame);
loadArt().then(()=>{
  artReady=true;element('start').textContent='Entrar na biblioteca';
  element('asset-status').textContent='Um guia rápido ajuda você a começar.';sync();openGuide();
}).catch(()=>{
  element('asset-status').textContent='Não foi possível carregar as ilustrações. Recarregue a página para tentar novamente.';
});



