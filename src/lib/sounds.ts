// Windows Vista-style sound effects using Web Audio API

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  fadeOut = true
) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  if (fadeOut) {
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, volume = 0.05) {
  const ctx = getContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
  }

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

export const sounds = {
  // Classic Windows click sound — short percussive tick
  click() {
    playNoise(0.06, 0.08);
    playTone(800, 0.05, "square", 0.04);
  },

  // Button press — slightly more pronounced
  buttonPress() {
    playTone(600, 0.04, "square", 0.06);
    playNoise(0.04, 0.06);
    setTimeout(() => playTone(500, 0.03, "square", 0.03), 30);
  },

  // Window open — ascending chime like Vista
  windowOpen() {
    playTone(523, 0.15, "sine", 0.12); // C5
    setTimeout(() => playTone(659, 0.15, "sine", 0.10), 80); // E5
    setTimeout(() => playTone(784, 0.2, "sine", 0.08), 160); // G5
  },

  // Window close — descending tone
  windowClose() {
    playTone(659, 0.12, "sine", 0.10); // E5
    setTimeout(() => playTone(523, 0.12, "sine", 0.08), 70); // C5
    setTimeout(() => playTone(392, 0.18, "sine", 0.06), 140); // G4
  },

  // Window minimize
  minimize() {
    playTone(784, 0.08, "sine", 0.06);
    setTimeout(() => playTone(523, 0.12, "sine", 0.05), 60);
  },

  // Error/ding — classic Windows error
  error() {
    playTone(440, 0.3, "sine", 0.15);
    setTimeout(() => playTone(349, 0.4, "sine", 0.12), 200);
  },

  // Navigation click — subtle page change
  navigate() {
    playTone(1200, 0.04, "sine", 0.06);
    playNoise(0.03, 0.04);
  },

  // Hover — very subtle
  hover() {
    playTone(2000, 0.02, "sine", 0.02);
  },

  // Start menu open
  startMenu() {
    playTone(600, 0.08, "sine", 0.08);
    setTimeout(() => playTone(800, 0.08, "sine", 0.06), 50);
    setTimeout(() => playTone(1000, 0.12, "sine", 0.05), 100);
  },

  // Startup chime — Vista-inspired chord
  startup() {
    // C major chord with shimmer
    playTone(523, 0.6, "sine", 0.10); // C5
    playTone(659, 0.6, "sine", 0.08); // E5
    playTone(784, 0.6, "sine", 0.06); // G5
    setTimeout(() => {
      playTone(1047, 0.8, "sine", 0.05); // C6
      playTone(880, 0.8, "sine", 0.04); // A5
    }, 300);
  },

  // Expand/collapse
  expand() {
    playTone(700, 0.06, "sine", 0.05);
    setTimeout(() => playTone(900, 0.06, "sine", 0.04), 40);
  },

  collapse() {
    playTone(900, 0.06, "sine", 0.05);
    setTimeout(() => playTone(700, 0.06, "sine", 0.04), 40);
  },
};
