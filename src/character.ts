import { art } from './assets.ts';
import { characterPose, type CharacterAnimation } from './character-animation.ts';

const CELL=627;
const HEIGHT=650;
const UNIT=85/CELL;

type Pose=ReturnType<typeof characterPose>;
let bodySource:HTMLImageElement|undefined;
const bodies=new Map<Pose,HTMLCanvasElement>();
let surface:HTMLCanvasElement|undefined;

function bodyFor(pose:Pose,body:HTMLImageElement) {
  if(bodySource!==body){
    bodies.clear();bodySource=body;
  }
  const cached=bodies.get(pose);if(cached)return cached;
  const canvas=document.createElement('canvas');canvas.width=CELL;canvas.height=HEIGHT;
  const painter=canvas.getContext('2d');if(!painter)return null;
  const x=pose==='blink'?CELL:0;
  const bodyY=pose==='happy'?604:pose==='blink'?2:0;
  // Use the complete painted spectral pose. Splicing two different paintings
  // below the collar produced a mismatch in the chest contour and shading.
  // The happy pose starts below the previous row's feet; preserve its alignment.
  const inset=pose==='happy'?46:0;
  painter.drawImage(body,x,bodyY+inset,CELL,HEIGHT-inset,
    0,inset,CELL,HEIGHT-inset);
  bodies.set(pose,canvas);return canvas;
}

/** Assemble the complete silhouette offscreen; apply the world glow only once. */
export function drawCharacter(
  ctx:CanvasRenderingContext2D,
  animation:CharacterAnimation,
  reducedMotion:boolean,
  moving:boolean,
  happyOverride=false,
) {
  const approved=art.characterAtlas,body=art.ghostBodyAtlas;
  if(!approved||!body)return;
  const pose=characterPose(animation,happyOverride);
  const sprite=bodyFor(pose,body);if(!sprite)return;
  if(!surface){surface=document.createElement('canvas');surface.width=640;surface.height=640;}
  const painter=surface.getContext('2d');if(!painter)return;
  painter.clearRect(0,0,640,640);
  painter.save();painter.translate(320,280);painter.scale(4,4);
  const happy=pose==='happy';
  const wag=reducedMotion?0:Math.sin(animation.elapsed*(happy?7:moving?5:3.4))*(happy?.10:moving?.075:.045);
  painter.save();
  // Lower attachment at the torso, rather than beside the head. Same in all contexts.
  painter.translate(-12,28);painter.rotate(wag);
  // The tail cell also includes the blink pose's feet along its top edge.
  // Crop only that empty margin/neighbor, preserving the tail's scale and pivot.
  const tailInset=123;
  painter.drawImage(approved,CELL,CELL+tailInset,CELL,CELL-tailInset,
    -50,-62+tailInset/CELL*80,70,(CELL-tailInset)/CELL*80);
  painter.restore();
  painter.drawImage(sprite,-35,-43,85,HEIGHT*UNIT);
  painter.restore();
  // Parent transforms, mirroring and shadow affect this single completed image.
  ctx.drawImage(surface,-80,-70,160,160);
}

