import { objects } from './investigation.ts';
import { WORLD, nearestObject, type State } from './game.ts';
import { art } from './assets.ts';
import { drawCharacter } from './character.ts';
import type { CharacterAnimation } from './character-animation.ts';
// Atlas source rectangles: cells stay in the original PNG. We select them while drawing.
const regions = [
  [120,66,471,529], [727,69,465,542], [207,635,281,566], [732,677,444,495]
];
function light(ctx:CanvasRenderingContext2D,x:number,y:number,r:number,color:string) {
  const gradient=ctx.createRadialGradient(x,y,0,x,y,r);
  gradient.addColorStop(0,color);gradient.addColorStop(1,'#e7b86a00');
  ctx.fillStyle=gradient;ctx.fillRect(x-r,y-r,r*2,r*2);
}
export function render(ctx:CanvasRenderingContext2D,state:State,time:number,reducedMotion:boolean,animation:CharacterAnimation) {
  ctx.clearRect(0,0,WORLD.width,WORLD.height);
  if(art.library)ctx.drawImage(art.library,0,0,960,600);
  else {ctx.fillStyle='#352c46';ctx.fillRect(0,0,960,600);}
  const active=state.mode==='exploring'?nearestObject(state):null;
  light(ctx,165,325,160,'#ffe4a01a');
  light(ctx,760,385,150,'#ffcc6c20');
  for(const object of objects) {
    if(object.id==='shield')continue;
    ctx.fillStyle='#21172940';ctx.beginPath();ctx.ellipse(object.x,object.y,object.width*.35,10,0,0,Math.PI*2);ctx.fill();
  }
  const drawProp=(object:typeof objects[number])=>{
    if(!art.props)return;
    const [sx,sy,sw,sh]=regions[object.cell];
    ctx.save();
    if(object.id!=='shield' && state.position.y<object.y && state.position.y>object.y-object.height && Math.abs(state.position.x-object.x)<object.width*.55)ctx.globalAlpha=.7;
    if(active?.id===object.id){ctx.shadowColor='#e7b86a';ctx.shadowBlur=10;}
    const displayY=object.id==='shield'?object.displayY:object.y;
    ctx.drawImage(art.props,sx,sy,sw,sh,object.x-object.width/2,displayY-object.height,object.width,object.height);
    ctx.restore();
  };
  const drawDog=()=>{
    const {x,y}=state.position;
    const moving=Math.hypot(state.velocity.x,state.velocity.y)>0&&state.mode==='exploring';
    const bob=reducedMotion?0:Math.sin(time*2.4)*(moving?4:2.5);
    ctx.fillStyle='#352c4630';ctx.beginPath();ctx.ellipse(x,y+3,26,6.5,0,0,Math.PI*2);ctx.fill();
    light(ctx,x,y-46,65,'#c8a5ff24');
    if(!art.characterAtlas)return;
    ctx.save();ctx.translate(x,y-61+bob);ctx.scale(state.facing,1);
    if(!reducedMotion)ctx.rotate(Math.sin(time*1.8)*.018);
    ctx.shadowColor='#d2b5ff';ctx.shadowBlur=9;
    drawCharacter(ctx,animation,reducedMotion,moving);ctx.restore();
  };
  // The shield belongs to the wall; furniture and character are sorted by foot position.
  objects.filter(o=>o.id==='shield').forEach(drawProp);
  const layers: {y:number;draw:()=>void}[]=objects.filter(o=>o.id!=='shield').map(o=>({y:o.y,draw:()=>drawProp(o)}));
  layers.push({y:state.position.y,draw:drawDog});layers.sort((a,b)=>a.y-b.y).forEach(l=>l.draw());
  if(state.mode==='exploring') {
    for(const object of objects) {
      if(active?.id!==object.id)continue;
      const y=(object.id==='shield'?object.displayY:object.y)-object.height-14;
      ctx.fillStyle='#f7f0df';ctx.beginPath();ctx.arc(object.x,y,11,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#352c46';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText(state.clues.includes(object.id)?'✓':'?',object.x,y+5);
    }
    if(!reducedMotion)for(let i=0;i<14;i++){
      const x=(i*83+Math.sin(time*.12+i)*12)%900+30;
      const y=260+(i*43%270)+Math.sin(time*.4+i)*7;
      ctx.globalAlpha=.08+(Math.sin(time*.7+i)+1)*.08;ctx.fillStyle='#ffe6b8';ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
}



