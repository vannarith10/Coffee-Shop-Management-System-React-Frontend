
let audioContext: AudioContext | null = null;
let isAudioUnlocked = false;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)
    ();
  }
  return audioContext;
}

export const unlockAudio = () : void => {
  if (isAudioUnlocked) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      console.log("Audio Unlocked!");
      isAudioUnlocked = true;
    });
  } else {
    isAudioUnlocked = true;
  }
};


export const setupAudioUnlock = (): void => {
  const events = ['click', 'touchstart', 'keydown'];
  
  const unlock = () => {
    unlockAudio();
    // Remove listeners after first interaction
    events.forEach(e => document.removeEventListener(e, unlock));
  };
  
  events.forEach(e => document.addEventListener(e, unlock, { once: true }));
};


// Helper to create oscillator with delay and duration
const createOscillator = (
  ctx: AudioContext,
  frequency: number,
  delaySeconds: number,
  durationSeconds: number,
  gainValue: number = 0.3
): void => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime + delaySeconds);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delaySeconds + durationSeconds);
  
  osc.start(ctx.currentTime + delaySeconds);
  osc.stop(ctx.currentTime + delaySeconds + durationSeconds);
};


// Play sound with unlock check
export const playSound = (type: 'new-order' | 'start' | 'complete' | 'notification' | 'price-change' | 'restock' | 'alert'): void => {
  const ctx = getAudioContext();
  
  // Try to resume if suspended (may fail if no user gesture yet)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {
      console.warn('Audio blocked: waiting for user interaction');
      return; // Silently fail, will work after user clicks
    });
  }
  
  // Create oscillator for different sounds
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Configure sound based on type
  switch (type) {
    case 'new-order':      
      createOscillator(ctx, 440, 0, 0.5);      // A4, starts immediately, 0.5s
      createOscillator(ctx, 554.37, 0.15, 0.5); // C#5, starts at 0.15s, 0.5s
      createOscillator(ctx, 659.25, 0.3, 0.6);   // E5, starts at 0.3s, 0.6s
      break;
      
    case 'start':
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      break;
      
    case 'complete':
      // Happy major chord arpeggio
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.4);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.4);
      });
      break;

      case 'price-change':
        // Soft UI confirmation sound
        createOscillator(ctx, 880, 0, 0.12, 0.2); // A5
        createOscillator(ctx, 1046.5, 0.08, 0.12, 0.2); // C6
        break;

      case 'restock':
        // Positive success tone (ascending)
        createOscillator(ctx, 392.0, 0, 0.2, 0.25);   // G4
        createOscillator(ctx, 523.25, 0.12, 0.25, 0.25); // C5
        createOscillator(ctx, 659.25, 0.24, 0.35, 0.25); // E5
        break;

      case 'alert':
        // Warning alert sound (two sharp beeps)
        createOscillator(ctx, 880, 0, 0.25, 0.35);
        createOscillator(ctx, 880, 0.35, 0.25, 0.35);
        break;

      
    default:
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
  }
};



/*
// const audioContext = typeof window !== 'undefined' 
//   ? new (window.AudioContext || (window as any).webkitAudioContext)() 
//   : null;

export const playSound = (type: 'start' | 'complete' | 'new-order' | 'notification' | 'price-change' | 'restock' | 'alert') => {
  if (!audioContext) return;

  const now = audioContext.currentTime;

  const createOscillator = (freq: number, start: number, duration: number, type: OscillatorType = 'sine') => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + start);
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.3, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
    osc.start(now + start);
    osc.stop(now + start + duration);
    return { osc, gain };
  };

  switch (type) {
    case 'start': // Barista: Start Preparing
      createOscillator(800, 0, 0.1);
      createOscillator(400, 0.05, 0.1);
      break;

    case 'complete': // Barista: Order Done
      createOscillator(523.25, 0, 0.3); // C5
      createOscillator(659.25, 0.1, 0.3); // E5
      break;

    case 'new-order': // Barista: New Order
      createOscillator(440, 0, 0.5);      // A4
      createOscillator(554.37, 0.15, 0.5); // C#5
      createOscillator(659.25, 0.3, 0.6);   // E5
      break;

    case 'notification': // Cashier: General update
      createOscillator(600, 0, 0.15);
      break;

    case 'price-change': // Cashier: Price updated
      createOscillator(880, 0, 0.1);    // A5
      createOscillator(1108.73, 0.08, 0.15); // C#6
      break;

    case 'restock': // Cashier: Back in stock
      createOscillator(523.25, 0, 0.2);   // C5
      createOscillator(659.25, 0.1, 0.2);  // E5
      createOscillator(783.99, 0.2, 0.3);  // G5
      break;

    case 'alert': // Cashier: Out of stock / Deleted
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
  }
};
*/

