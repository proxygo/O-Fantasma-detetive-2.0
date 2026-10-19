import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createState, steer, update, investigate, nearestObject, brake, answer, SPEED, WORLD, intersectsFootprint } from '../src/game.ts';
import { objects } from '../src/investigation.ts';
test('diagonal normalized; movement independent of frame rate',()=>{const a=createState(),b=createState();a.mode=b.mode='exploring';steer(a,{x:1,y:1});assert.ok(Math.abs(Math.hypot(a.velocity.x,a.velocity.y)-SPEED)<.001);steer(a,{x:1,y:0});steer(b,{x:1,y:0});for(let i=0;i<60;i++)update(a,1/60);for(let i=0;i<120;i++)update(b,1/120);assert.ok(Math.abs(a.position.x-b.position.x)<.001);});
test('bounds and brake',()=>{const s=createState();s.mode='exploring';s.position.x=WORLD.right-1;steer(s,{x:1,y:0});update(s,.05);assert.equal(s.position.x,WORLD.right);assert.equal(s.velocity.x,0);steer(s,{x:0,y:1});brake(s);assert.deepEqual(s.velocity,{x:0,y:0});});
test('proximity and dialogue guard',()=>{const s=createState();s.mode='exploring';assert.equal(investigate(s,'shield'),null);s.position={x:470,y:275};assert.equal(nearestObject(s)?.id,'shield');assert.ok(investigate(s,'shield'));const p={...s.position};update(s,.05);assert.deepEqual(s.position,p);assert.equal(investigate(s,'chair',true),null);});
test('each object can be collected once in any order',()=>{const s=createState();s.mode='exploring';for(const o of [...objects].reverse()){assert.ok(investigate(s,o.id,true));s.mode='exploring';assert.ok(investigate(s,o.id,true));s.mode='exploring';}assert.equal(s.clues.length,4);});
test('cannot win without clues; wrong and empty answers preserve progress',()=>{const s=createState();s.mode='exploring';assert.equal(answer(s,'42'),'locked');for(const o of objects){investigate(s,o.id,true);s.mode='exploring';}assert.equal(answer(s,''),'empty');assert.equal(s.attempts,0);assert.equal(answer(s,'41'),'wrong');assert.equal(s.clues.length,4);assert.equal(s.mode,'exploring');assert.equal(answer(s,' 42 '),'correct');assert.equal(s.mode,'won');assert.equal(s.attempts,2);});
test('completed game cannot move or interact; replay starts clean',()=>{const s=createState();s.mode='exploring';for(const o of objects){investigate(s,o.id,true);s.mode='exploring';}answer(s,'42');const p={...s.position};steer(s,{x:1,y:0});update(s,.05);assert.deepEqual(s.position,p);assert.equal(investigate(s,'chair',true),null);assert.equal(answer(s,'42'),'locked');const fresh=createState();assert.deepEqual(fresh.clues,[]);assert.equal(fresh.mode,'start');assert.equal(fresh.attempts,0);});


test('furniture footprint blocks motion but leaves interaction reachable',()=>{
  const s=createState();s.mode='exploring';s.position={x:160,y:420};steer(s,{x:0,y:1});
  for(let i=0;i<30;i++)update(s,.016);
  assert.ok(s.position.y<443-WORLD.radius);
  assert.equal(nearestObject(s)?.id,'chair');
  assert.ok(investigate(s,'chair'));
});
test('paused guide cannot move, collect a clue or submit an answer',()=>{
  const s=createState();s.mode='exploring';steer(s,{x:1,y:0});brake(s);s.mode='paused';
  const position={...s.position};update(s,.05);steer(s,{x:0,y:1});
  assert.deepEqual(s.position,position);assert.equal(investigate(s,'chair',true),null);
  assert.equal(answer(s,'42'),'locked');assert.equal(s.clues.length,0);
});
test('all four interaction zones are reachable around furniture',()=>{
  const seen=new Set<string>();const queue=[{x:330,y:420}];const reached=new Set<string>();
  while(queue.length){
    const p=queue.shift()!;const key=p.x+','+p.y;if(seen.has(key))continue;seen.add(key);
    if(p.x<WORLD.left||p.x>WORLD.right||p.y<WORLD.top||p.y>WORLD.bottom)continue;
    if(objects.some(o=>o.obstacle&&intersectsFootprint(p,o.obstacle)))continue;
    for(const o of objects)if(Math.hypot(p.x-o.x,p.y-o.y)<100)reached.add(o.id);
    for(const [dx,dy] of [[10,0],[-10,0],[0,10],[0,-10]])queue.push({x:p.x+dx,y:p.y+dy});
  }
  assert.equal(reached.size,4);
});
