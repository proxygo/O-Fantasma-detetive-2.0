import { objects, type ObjectId, type Obstacle } from './investigation.ts';
export type Vector = { x: number; y: number };
export type Mode = 'start' | 'exploring' | 'dialog' | 'paused' | 'won';
export type State = { position: Vector; velocity: Vector; facing: number; mode: Mode; clues: ObjectId[]; attempts: number };
export const WORLD = { width: 960, height: 600, radius: 20, left: 65, right: 895, top: 255, bottom: 558 };
export const SPEED = 155;
export function createState(): State {
  return { position: { x: 330, y: 420 }, velocity: { x: 0, y: 0 }, facing: 1, mode: 'start', clues: [], attempts: 0 };
}
export function steer(state: State, direction: Vector) {
  if (state.mode !== 'exploring') return;
  const length = Math.hypot(direction.x, direction.y);
  state.velocity = length ? { x: direction.x / length * SPEED, y: direction.y / length * SPEED } : { x: 0, y: 0 };
  if (direction.x) state.facing = Math.sign(direction.x);
}
export function brake(state: State) { state.velocity = { x: 0, y: 0 }; }
export function intersectsFootprint(position: Vector, rect: Obstacle) {
  const x = Math.max(rect.x, Math.min(position.x, rect.x + rect.width));
  const y = Math.max(rect.y, Math.min(position.y, rect.y + rect.height));
  return Math.hypot(position.x-x, position.y-y) < WORLD.radius;
}
function blocked(position: Vector) { return objects.some(o => o.obstacle && intersectsFootprint(position, o.obstacle)); }
export function update(state: State, seconds: number) {
  if (state.mode !== 'exploring') return;
  const dt = Math.max(0, Math.min(seconds, 0.05));
  const x = Math.max(WORLD.left, Math.min(WORLD.right, state.position.x + state.velocity.x * dt));
  const y = Math.max(WORLD.top, Math.min(WORLD.bottom, state.position.y + state.velocity.y * dt));
  // Separate axes allow sliding along furniture, instead of getting stuck on a diagonal.
  if (!blocked({ x, y: state.position.y })) state.position.x=x; else state.velocity.x=0;
  if (!blocked({ x: state.position.x, y })) state.position.y=y; else state.velocity.y=0;
  if (state.position.x===WORLD.left||state.position.x===WORLD.right)state.velocity.x=0;
  if (state.position.y===WORLD.top||state.position.y===WORLD.bottom)state.velocity.y=0;
}
export function nearestObject(state: State) {
  return objects.filter(o => Math.hypot(state.position.x-o.x,state.position.y-o.y)<110)
    .sort((a,b)=>Math.hypot(state.position.x-a.x,state.position.y-a.y)-Math.hypot(state.position.x-b.x,state.position.y-b.y))[0];
}
export function investigate(state: State, id: ObjectId, accessible = false) {
  if (state.mode !== 'exploring') return null;
  const object=objects.find(o=>o.id===id);
  if (!object || (!accessible && nearestObject(state)?.id !== id))return null;
  brake(state);state.mode='dialog';
  if (!state.clues.includes(id))state.clues.push(id);
  return object;
}
export function answer(state: State, value: string): 'locked'|'empty'|'wrong'|'correct' {
  if(state.mode!=='exploring'||state.clues.length!==objects.length)return 'locked';
  if(!value.trim())return 'empty';
  state.attempts++;
  if(value.trim()!=='42')return 'wrong';
  brake(state);state.mode='won';return 'correct';
}

