/**
 * VENNELA'S BIRTHDAY EXPERIENCE — AUDIO ENGINE (SWEET PASTEL SOUND DESIGN)
 * Dual-Mode: Web Audio API Procedural Synthesizer + HTML5 Audio Element Fallback
 * Features:
 * - Cute water-droplet / kalimba keypad tap sounds
 * - Gentle pastel bubble pops
 * - Shimmering fairy bells
 * - Sweet music box "Happy Birthday" melody
 * - Uplifting glockenspiel celebration fanfare
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.isMuted = false;
    this.isSfxMuted = false;
    this.isPlayingMusic = false;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.65;
    
    // Procedural melody state
    this.melodyTimeout = null;
    this.melodyNoteIndex = 0;
    this.synthLoopInterval = null;
    this.synthChordIndex = 0;

    // Visualizer listeners
    this.visualizerCallbacks = [];

    // HTML5 Audio Element for custom user songs (assets/audio/birthday-melody.mp3)
    this.htmlAudio = null;
    this.usingHtmlAudio = false;

    this.initAudioContext();
  }

  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    const audioEl = document.getElementById('bg-music-player');
    if (audioEl) {
      this.htmlAudio = audioEl;
      this.htmlAudio.volume = this.musicVolume;
      this.htmlAudio.addEventListener('error', () => {
        this.usingHtmlAudio = false;
      });
      if (this.htmlAudio.src && !this.htmlAudio.src.endsWith('/')) {
        this.htmlAudio.addEventListener('canplaythrough', () => {
          this.usingHtmlAudio = true;
        });
      }
    }
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  notifyVisualizer(intensity = 0.5) {
    this.visualizerCallbacks.forEach(cb => cb(intensity));
  }

  onVisualizerTick(cb) {
    this.visualizerCallbacks.push(cb);
  }

  /* ------------------------------------------------------------------------
     CUTE BABY-PINK PROCEDURAL SOUND EFFECTS
     ------------------------------------------------------------------------ */

  /**
   * Sweet water-droplet / kalimba pop for keypad digits
   */
  playKeypadBeep(digit = 1) {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    // Scale pitch delightfully with digits
    const baseFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51];
    const freq = baseFreqs[Math.abs(parseInt(digit, 10) || 0) % baseFreqs.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(freq * 1.2, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.04);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
    this.notifyVisualizer(0.4);
  }

  /**
   * Soft cute bubble pop
   */
  playClick() {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
    this.notifyVisualizer(0.25);
  }

  /**
   * Celestial fairy bell chimes (sweet pentatonic sparkle)
   */
  playSparkle() {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    const notes = [659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98]; // E5, G5, B5, D6, E6, G6
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.045);

      gain.gain.setValueAtTime(0, now + index * 0.045);
      gain.gain.linearRampToValueAtTime(0.22, now + index * 0.045 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.045 + 0.55);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + index * 0.045);
      osc.stop(now + index * 0.045 + 0.6);
    });
    this.notifyVisualizer(0.7);
  }

  /**
   * Joyful glockenspiel fanfare
   */
  playFanfare() {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    const chords = [
      [523.25, 659.25], // C5, E5
      [587.33, 698.46], // D5, F5
      [659.25, 783.99], // E5, G5
      [783.99, 1046.50, 1318.51] // G5, C6, E6
    ];

    const now = this.ctx.currentTime;
    chords.forEach((chord, cIdx) => {
      const time = now + cIdx * 0.14;
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        const dur = (cIdx === chords.length - 1) ? 1.2 : 0.22;
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(time);
        osc.stop(time + dur + 0.05);
      });
    });
    this.notifyVisualizer(0.85);
  }

  /**
   * Playful cute double "boop" wobble for wrong PIN
   */
  playError() {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    const now = this.ctx.currentTime;
    [320, 240].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.25, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.14);
    });
  }

  /**
   * Candle blow sound
   */
  playCandleBlow() {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    this.notifyVisualizer(0.5);

    setTimeout(() => {
      this.playSparkle();
    }, 260);
  }

  /**
   * Gift unwrap whoosh & shimmer
   */
  playBoxOpen() {
    if (this.isMuted || this.isSfxMuted || !this.ctx) return;
    this.resumeContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);

    setTimeout(() => {
      this.playSparkle();
      this.playFanfare();
    }, 220);
  }

  /* ------------------------------------------------------------------------
     PROCEDURAL "HAPPY BIRTHDAY" MUSIC-BOX TUNE
     ------------------------------------------------------------------------ */

  startHappyBirthdayMelody() {
    this.stopMusic();
    this.resumeContext();
    this.isPlayingMusic = true;

    const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

    const melody = [
      { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: A4, dur: 1.0 }, { note: G4, dur: 1.0 }, { note: C5, dur: 1.0 }, { note: B4, dur: 2.0 },
      { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: A4, dur: 1.0 }, { note: G4, dur: 1.0 }, { note: D5, dur: 1.0 }, { note: C5, dur: 2.0 },
      { note: G4, dur: 0.75 }, { note: G4, dur: 0.25 }, { note: G5, dur: 1.0 }, { note: E5, dur: 1.0 }, { note: C5, dur: 1.0 }, { note: B4, dur: 1.0 }, { note: A4, dur: 2.0 },
      { note: F5, dur: 0.75 }, { note: F5, dur: 0.25 }, { note: E5, dur: 1.0 }, { note: C5, dur: 1.0 }, { note: D5, dur: 1.0 }, { note: C5, dur: 2.5 }
    ];

    let noteIdx = 0;
    const tempo = 390;

    const playNextNote = () => {
      if (!this.isPlayingMusic || !this.ctx || this.isMuted) return;

      const item = melody[noteIdx];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.note, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(item.note * 2, now);

      const noteDuration = (item.dur * tempo) / 1000;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration + 0.6);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + noteDuration + 0.65);
      osc2.stop(now + noteDuration + 0.65);

      this.notifyVisualizer(0.65);

      noteIdx = (noteIdx + 1) % melody.length;
      const delay = (item.dur * tempo);
      this.melodyTimeout = setTimeout(playNextNote, delay);
    };

    playNextNote();
  }

  toggleMusic() {
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    this.resumeContext();
    this.isPlayingMusic = true;

    if (this.htmlAudio && this.usingHtmlAudio) {
      this.htmlAudio.play().catch(() => {
        this.startHappyBirthdayMelody();
      });
      return;
    }

    this.startHappyBirthdayMelody();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
    if (this.synthLoopInterval) {
      clearInterval(this.synthLoopInterval);
      this.synthLoopInterval = null;
    }
    this.notifyVisualizer(0);
  }

  setVolume(val) {
    const clamped = Math.max(0, Math.min(1, parseFloat(val)));
    this.musicVolume = clamped;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(clamped * 0.45, this.ctx.currentTime);
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = clamped;
    }
  }

  toggleSfx() {
    this.isSfxMuted = !this.isSfxMuted;
    return !this.isSfxMuted;
  }
}

// Global singleton instance
window.soundEngine = new SoundEngine();
