class SoundManager {
  audioContext: AudioContext | null = null;
  enabled: boolean = true;
  masterVolume: number = 0.3;

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3, slide: number | null = null) {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    if (slide) {
      oscillator.frequency.exponentialRampToValueAtTime(slide, this.audioContext.currentTime + duration);
    }
    
    gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  jump() { this.playTone(200, 0.15, 'square', 0.3, 600); }
  collect() {
    this.playTone(523, 0.1, 'square', 0.25);
    setTimeout(() => this.playTone(659, 0.1, 'square', 0.25), 50);
    setTimeout(() => this.playTone(784, 0.15, 'square', 0.25), 100);
  }
  powerup() {
    this.playTone(400, 0.1, 'sine', 0.3, 800);
    setTimeout(() => this.playTone(600, 0.1, 'sine', 0.3, 1200), 100);
    setTimeout(() => this.playTone(800, 0.2, 'sine', 0.3, 1600), 200);
  }
  milestone() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.15, 'square', 0.2), i * 80));
  }
  pass() {
    this.playTone(880, 0.08, 'square', 0.2);
    setTimeout(() => this.playTone(1100, 0.1, 'square', 0.2), 60);
  }
  hit() {
    this.playTone(150, 0.3, 'sawtooth', 0.4, 50);
    setTimeout(() => this.playTone(100, 0.2, 'square', 0.3, 30), 100);
  }
  gameOver() {
    const notes = [400, 350, 300, 250, 200];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.2, 'square', 0.25), i * 150));
  }
  start() {
    const notes = [262, 330, 392, 523, 659, 784];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.1, 'square', 0.2), i * 50));
  }
  combo() { this.playTone(600, 0.1, 'triangle', 0.25, 900); }
  shield() {
    this.playTone(300, 0.3, 'sine', 0.2);
    this.playTone(450, 0.3, 'sine', 0.15);
    this.playTone(600, 0.3, 'sine', 0.1);
  }
  rocket() { this.playTone(200, 0.5, 'sawtooth', 0.2, 2000); }
  diamond() {
    const notes = [1047, 1319, 1568, 2093];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.15, 'sine', 0.15), i * 60));
  }
  coffee() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playTone(400 + i * 100, 0.05, 'square', 0.2), i * 40);
    }
  }
  marginCall() {
    this.playTone(800, 0.1, 'square', 0.4);
    setTimeout(() => this.playTone(600, 0.1, 'square', 0.4), 100);
    setTimeout(() => this.playTone(800, 0.1, 'square', 0.4), 200);
    setTimeout(() => this.playTone(600, 0.15, 'square', 0.4), 300);
  }
  ice() {
    this.playTone(2000, 0.3, 'sine', 0.2, 500);
    setTimeout(() => this.playTone(1500, 0.2, 'sine', 0.15), 100);
  }
  whale() {
    this.playTone(100, 0.5, 'sine', 0.3, 50);
    setTimeout(() => this.playTone(80, 0.3, 'sine', 0.2), 200);
  }
  fomo() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playTone(600 + i * 200, 0.1, 'sawtooth', 0.15), i * 50);
    }
  }
  quote() { this.playTone(1000, 0.05, 'sine', 0.1); }
  buffett() {
    const notes = [523, 784, 1047, 784, 523];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.2, 'sine', 0.25), i * 120));
  }
  buffettCollect() {
    const notes = [262, 330, 392, 523, 659, 784, 1047, 1319];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.15, 'sine', 0.3), i * 60));
  }
  bossCall() {
    this.playTone(1200, 0.15, 'square', 0.3);
    setTimeout(() => this.playTone(1400, 0.15, 'square', 0.3), 200);
  }
  bossTap() { this.playTone(800, 0.05, 'square', 0.2); }
  bossSuccess() {
    this.playTone(600, 0.1, 'sine', 0.3, 1200);
    setTimeout(() => this.playTone(800, 0.2, 'sine', 0.3), 100);
  }
  bossFail() { this.playTone(200, 0.5, 'sawtooth', 0.4, 100); }
  marketMoverAlert() {
    this.playTone(880, 0.08, 'sine', 0.3);
    setTimeout(() => this.playTone(1100, 0.08, 'sine', 0.3), 80);
    setTimeout(() => this.playTone(1320, 0.12, 'sine', 0.25), 160);
  }
  marketPump() {
    const notes = [400, 500, 600, 800, 1000];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.08, 'square', 0.2), i * 40));
  }
  marketDump() {
    const notes = [800, 600, 400, 300, 200];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.1, 'sawtooth', 0.25), i * 60));
  }
  marketChaos() {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.playTone(300 + Math.random() * 800, 0.05, 'square', 0.15), i * 30);
    }
  }
  newHighScore() {
    const notes = [523, 659, 784, 1047, 1319, 1568, 2093];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.2, 'sine', 0.3), i * 100));
  }
  leaderboardEntry() {
    const notes = [392, 523, 659, 784];
    notes.forEach((note, i) => setTimeout(() => this.playTone(note, 0.15, 'triangle', 0.25), i * 80));
  }
  buttonClick() { this.playTone(600, 0.08, 'square', 0.2); }
  toggle() { this.enabled = !this.enabled; return this.enabled; }
}

export const soundManager = new SoundManager();