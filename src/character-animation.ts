export type CharacterAnimation = {
  elapsed: number;
  nextBlink: number;
  blinkRemaining: number;
  happyRemaining: number;
};
export function createCharacterAnimation(): CharacterAnimation {
  return { elapsed: 0, nextBlink: 3.1, blinkRemaining: 0, happyRemaining: 0 };
}
export function celebrateDiscovery(animation: CharacterAnimation) {
  animation.happyRemaining = 2.4;
  animation.blinkRemaining = 0;
}
export function advanceCharacterAnimation(animation: CharacterAnimation, seconds: number, reducedMotion: boolean) {
  const dt = Math.max(0, Math.min(seconds, .1));
  animation.elapsed += dt;
  animation.happyRemaining = Math.max(0, animation.happyRemaining - dt);
  animation.blinkRemaining = Math.max(0, animation.blinkRemaining - dt);
  if (animation.elapsed >= animation.nextBlink) {
    if (!reducedMotion && animation.happyRemaining === 0) animation.blinkRemaining = .16;
    // Different intervals keep the blink from looking like a metronome.
    animation.nextBlink = animation.elapsed + 3.8 + Math.sin(animation.elapsed * 1.7) * .8;
  }
}
export function characterPose(animation: CharacterAnimation, happyOverride = false): 'normal' | 'blink' | 'happy' {
  if (happyOverride || animation.happyRemaining > 0) return 'happy';
  return animation.blinkRemaining > 0 ? 'blink' : 'normal';
}

/** Two relaxed front paws: small floating arm movements, never a walking cycle. */
export function pawAngles(animation: CharacterAnimation, moving: boolean, reducedMotion: boolean): number[] {
  if (reducedMotion) return [0, 0];
  const phase=animation.elapsed*(moving?2.8:1.8);
  const amplitude=moving?.06:.025;
  return [0, Math.PI].map(offset=>Math.sin(phase+offset)*amplitude);
}

