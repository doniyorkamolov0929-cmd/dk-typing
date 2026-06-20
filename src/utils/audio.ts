/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Native client-side Web Audio API synthesizer for instant mechanical clicks and tactile error buzzers.
// Completely offline, works 100% with PWA offline mode, zero network latency.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume context if suspended (common browser policy)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a synthesized mechanical click or classic sound
 * @param type 'blue' | 'brown' | 'typewriter' | 'beep'
 */
export function playKeySound(type: 'blue' | 'brown' | 'typewriter' | 'beep'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    if (type === 'blue') {
      // Cherry MX Blue: High frequency, dual stage click, clean metal ping
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1900, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(3000, now);
      osc2.frequency.exponentialRampToValueAtTime(1500, now + 0.01);
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.05);
      osc2.stop(now + 0.05);
      
    } else if (type === 'brown') {
      // Cherry MX Brown: Mid-low frequency, single soft thud, dampened feel
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.07);
      
    } else if (type === 'typewriter') {
      // Classic Typewriter: Wooden click + mechanical metallic punch
      const osc1 = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      const gain = ctx.createGain();
      
      // Dynamic noise simulation
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.exponentialRampToValueAtTime(250, now + 0.08);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      
      // Let's add a high-pitch metallic click
      const metalOsc = ctx.createOscillator();
      metalOsc.type = 'sine';
      metalOsc.frequency.setValueAtTime(2400, now);
      metalOsc.connect(gain);
      metalOsc.start(now);
      metalOsc.stop(now + 0.015);
      
      osc1.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.1);
      
    } else {
      // Standard pleasant beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch (error) {
    console.warn('Audio click synth failed:', error);
  }
}

/**
 * Play a synthesized low buzzer warning sound on typing mistake
 */
export function playErrorSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.13);
    
    // Low pass filter to make it soft and clean but distinct
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    console.warn('Audio error synth failed:', error);
  }
}
