import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCharacterAnimation, celebrateDiscovery, advanceCharacterAnimation, characterPose, pawAngles } from '../src/character-animation.ts';

test('blink is short and returns to the neutral pose',()=>{
  const a=createCharacterAnimation();
  while(a.elapsed<3.1)advanceCharacterAnimation(a,.05,false);
  assert.equal(characterPose(a),'blink');
  for(let i=0;i<5;i++)advanceCharacterAnimation(a,.05,false);
  assert.equal(characterPose(a),'normal');
});
test('a clue gives priority to happiness and returns to neutral',()=>{
  const a=createCharacterAnimation();a.blinkRemaining=.1;celebrateDiscovery(a);
  assert.equal(characterPose(a),'happy');
  for(let i=0;i<50;i++)advanceCharacterAnimation(a,.05,false);
  assert.equal(characterPose(a),'normal');
  assert.equal(characterPose(a,true),'happy');
});
test('reduced motion suppresses blinks but keeps the discovery expression',()=>{
  const a=createCharacterAnimation();
  for(let i=0;i<90;i++)advanceCharacterAnimation(a,.05,true);
  assert.equal(a.blinkRemaining,0);
  celebrateDiscovery(a);assert.equal(characterPose(a),'happy');
});
test('reset creates a clean visual state without affecting gameplay data',()=>{
  const a=createCharacterAnimation();celebrateDiscovery(a);
  const fresh=createCharacterAnimation();assert.equal(characterPose(fresh),'normal');assert.equal(fresh.elapsed,0);
});
test('only two suspended front paws move gently and respect reduced motion',()=>{
  const a=createCharacterAnimation();a.elapsed=.7;
  const moving=pawAngles(a,true,false);
  assert.equal(moving.length,2);
  assert.ok(Math.abs(moving[0]+moving[1])<1e-12);
  for(const angle of moving)assert.ok(Math.abs(angle)<=.075);
  for(const angle of pawAngles(a,false,false))assert.ok(Math.abs(angle)<=.025);
  assert.deepEqual(pawAngles(a,true,true),[0,0]);
});
