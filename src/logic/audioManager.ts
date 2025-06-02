// Chess Game Audio Manager
// Handles all sound effects using Web Audio API

export interface AudioSettings {
  volume: number; // 0-1
  enabled: boolean;
}

export type SoundType =
  | 'move' // Regular piece movement
  | 'capture' // Piece capture
  | 'check' // King in check
  | 'checkmate' // Game over - checkmate
  | 'stalemate' // Game over - stalemate
  | 'promotion' // Pawn promotion
  | 'selection' // Piece selection (subtle)
  | 'gameStart' // Game beginning
  | 'illegal'; // Illegal move attempt

class AudioManager {
  private audioContext: AudioContext | null = null;
  private settings: AudioSettings = {
    volume: 0.6,
    enabled: true,
  };

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    try {
      // Create AudioContext (modern browsers)
      type AudioContextConstructor = typeof AudioContext;
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioContextConstructor })
          .webkitAudioContext;
      this.audioContext = new AudioContextClass();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.settings.enabled = false;
    }
  }

  // Resume audio context if suspended (required by some browsers)
  private async ensureAudioContext() {
    if (!this.audioContext || !this.settings.enabled) return false;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    return true;
  }

  // Generate and play a tone with specific characteristics
  private async playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 1
  ) {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    // Create oscillator and gain nodes
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set oscillator properties
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );

    // Set volume envelope (ADSR-like)
    const now = this.audioContext.currentTime;
    const attack = Math.min(0.01, duration * 0.1);
    const decay = Math.min(0.1, duration * 0.3);
    const sustain = 0.3;
    const release = Math.min(0.2, duration * 0.4);

    // Ensure envelope phases don't exceed duration
    const totalEnvelopeTime = attack + decay + release;
    const sustainTime = Math.max(0, duration - totalEnvelopeTime);
    const releaseStartTime = now + attack + decay + sustainTime;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(
      volume * this.settings.volume,
      now + attack
    );
    gainNode.gain.linearRampToValueAtTime(
      sustain * volume * this.settings.volume,
      now + attack + decay
    );
    gainNode.gain.setValueAtTime(
      sustain * volume * this.settings.volume,
      releaseStartTime
    );
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Start and stop oscillator
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Generate more complex sounds using multiple tones
  private async playChord(
    frequencies: number[],
    duration: number,
    type: OscillatorType = 'sine'
  ) {
    const promises = frequencies.map(
      freq => this.playTone(freq, duration, type, 0.3) // Lower volume for each tone in chord
    );
    await Promise.all(promises);
  }

  // Play sound effects for different chess events
  async playSound(soundType: SoundType) {
    if (!this.settings.enabled) return;

    switch (soundType) {
      case 'move':
        // Subtle wooden piece movement sound
        await this.playTone(220, 0.15, 'triangle', 0.4);
        break;

      case 'capture':
        // Sharp capture sound with metallic tone
        await this.playTone(330, 0.08, 'square', 0.6);
        setTimeout(() => this.playTone(220, 0.12, 'triangle', 0.4), 50);
        break;

      case 'check':
        // Dramatic warning sound
        await this.playTone(523, 0.2, 'sine', 0.7); // High C
        setTimeout(() => this.playTone(440, 0.3, 'sine', 0.5), 100); // A
        break;

      case 'checkmate':
        // Triumphant/final chord progression
        await this.playChord([262, 330, 392], 0.8); // C major
        setTimeout(() => this.playChord([196, 247, 294], 1.2), 400); // G major (lower)
        break;

      case 'stalemate':
        // Neutral, inconclusive sound
        await this.playTone(294, 0.4, 'sine', 0.5); // D
        setTimeout(() => this.playTone(277, 0.6, 'sine', 0.4), 200); // C#
        break;

      case 'promotion': {
        // Ascending triumphant sound
        const promotionNotes = [262, 330, 392, 523]; // C, E, G, C (octave)
        for (let i = 0; i < promotionNotes.length; i++) {
          setTimeout(
            () => this.playTone(promotionNotes[i], 0.2, 'triangle', 0.5),
            i * 100
          );
        }
        break;
      }

      case 'selection':
        // Very subtle selection click
        await this.playTone(880, 0.05, 'sine', 0.2);
        break;

      case 'gameStart':
        // Welcome sound - gentle chord
        await this.playChord([196, 247, 294, 370], 1.0); // G major 7
        break;

      case 'illegal':
        // Error/invalid move sound
        await this.playTone(150, 0.1, 'square', 0.3);
        setTimeout(() => this.playTone(120, 0.15, 'square', 0.3), 80);
        break;

      default:
        console.warn(`Unknown sound type: ${soundType}`);
    }
  }

  // Settings management
  setVolume(volume: number) {
    this.settings.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.settings.volume;
  }

  setEnabled(enabled: boolean) {
    this.settings.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.settings.enabled;
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  // Test all sounds (useful for debugging)
  async testAllSounds() {
    const sounds: SoundType[] = [
      'move',
      'capture',
      'check',
      'checkmate',
      'stalemate',
      'promotion',
      'selection',
      'gameStart',
      'illegal',
    ];

    for (let i = 0; i < sounds.length; i++) {
      setTimeout(() => {
        console.log(`Testing sound: ${sounds[i]}`);
        this.playSound(sounds[i]);
      }, i * 1500);
    }
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
export default audioManager;
