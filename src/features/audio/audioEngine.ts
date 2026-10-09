import type { SoundEffectType, LoFiTrackId } from './types'

// Note frequency helper (Hz)
const NOTE_FREQS: Record<string, number> = {
  C2: 65.41,
  'C#2': 69.3,
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  'F#2': 92.5,
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  'C#3': 138.59,
  'D#3': 155.56,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  'F#3': 185.0,
  G3: 196.0,
  'G#3': 207.65,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
  E5: 659.25,
  G5: 783.99,
  'G#5': 830.61,
  B5: 987.77,
  C6: 1046.5,
  E6: 1318.51,
}

const CHORD_PROGRESSIONS: Record<LoFiTrackId, { chords: string[][]; tempoSec: number }> = {
  chill: {
    tempoSec: 2.8,
    chords: [
      ['D3', 'F3', 'A3', 'C4', 'E4'], // Dm9
      ['G2', 'F3', 'B3', 'E4'], // G13
      ['C3', 'E3', 'G3', 'B3', 'D4'], // Cmaj9
      ['A2', 'G3', 'C#4', 'F4'], // A7alt
    ],
  },
  deepFocus: {
    tempoSec: 3.2,
    chords: [
      ['A2', 'C3', 'E3', 'G3'], // Am7
      ['E2', 'G2', 'B2', 'D3'], // Em7
      ['F2', 'A2', 'C3', 'E3'], // Fmaj7
      ['G2', 'B2', 'D3', 'E3'], // G6
    ],
  },
  midnight: {
    tempoSec: 2.6,
    chords: [
      ['F#2', 'A2', 'C#3', 'E3', 'G#3'], // F#m9
      ['B2', 'D#3', 'A3', 'C#4'], // B9
      ['E2', 'G#2', 'B2', 'D#3', 'F#3'], // Emaj9
      ['C#2', 'B2', 'E3', 'G#3'], // C#m7
    ],
  },
}

export class AudioEngine {
  private static instance: AudioEngine | null = null

  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private musicBus: GainNode | null = null
  private sfxBus: GainNode | null = null
  private rainBus: GainNode | null = null
  private keyboardBus: GainNode | null = null
  private cafeBus: GainNode | null = null

  // Volumes & Mute States
  private masterVolume = 0.8
  private isMasterMuted = false
  private musicVolume = 0.6
  private isMusicMuted = false
  private ambientVolume = 0.5
  private isAmbientMuted = false
  private sfxVolume = 0.7
  private isSfxMuted = false

  // Channel Sub-Volumes
  private rainVolume = 0.5
  private isRainMuted = false
  private isRainActive = false

  private keyboardVolume = 0.5
  private isKeyboardMuted = false
  private isKeyboardActive = false

  private cafeVolume = 0.4
  private isCafeMuted = false
  private isCafeActive = false

  // Lo-Fi Player State
  private isMusicPlaying = false
  private currentTrack: LoFiTrackId = 'chill'
  private musicIntervalId: ReturnType<typeof setInterval> | null = null
  private chordIndex = 0
  private vinylNode: AudioBufferSourceNode | null = null

  // Ambient Generator Nodes
  private rainSource: AudioBufferSourceNode | null = null
  private cafeSource: AudioBufferSourceNode | null = null
  private keyboardIntervalId: ReturnType<typeof setInterval> | null = null
  private cafeClinkIntervalId: ReturnType<typeof setInterval> | null = null

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  /**
   * Resets singleton for testing.
   */
  public static resetInstance(): void {
    if (AudioEngine.instance) {
      AudioEngine.instance.dispose()
      AudioEngine.instance = null
    }
  }

  private constructor() {
    // Lazily initialized when needed
  }

  /**
   * Ensures Web Audio AudioContext and graph nodes are initialized.
   */
  public initContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return this.ctx
    }

    if (typeof window === 'undefined') return null

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) return null

    try {
      this.ctx = new AudioContextClass()

      // Master Gain
      this.masterGain = this.ctx.createGain()
      this.masterGain.connect(this.ctx.destination)

      // Sub-Buses
      this.musicBus = this.ctx.createGain()
      this.musicBus.connect(this.masterGain)

      this.sfxBus = this.ctx.createGain()
      this.sfxBus.connect(this.masterGain)

      this.rainBus = this.ctx.createGain()
      this.rainBus.connect(this.masterGain)

      this.keyboardBus = this.ctx.createGain()
      this.keyboardBus.connect(this.masterGain)

      this.cafeBus = this.ctx.createGain()
      this.cafeBus.connect(this.masterGain)

      this.applyGains()
      return this.ctx
    } catch {
      return null
    }
  }

  // ----------------------------------------------------
  // Volume and Mute Controls
  // ----------------------------------------------------

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setMasterMuted(muted: boolean): void {
    this.isMasterMuted = muted
    this.applyGains()
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setMusicMuted(muted: boolean): void {
    this.isMusicMuted = muted
    this.applyGains()
  }

  public setAmbientVolume(vol: number): void {
    this.ambientVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setAmbientMuted(muted: boolean): void {
    this.isAmbientMuted = muted
    this.applyGains()
  }

  public setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setSfxMuted(muted: boolean): void {
    this.isSfxMuted = muted
    this.applyGains()
  }

  public setRainVolume(vol: number): void {
    this.rainVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setRainMuted(muted: boolean): void {
    this.isRainMuted = muted
    this.applyGains()
  }

  public setKeyboardVolume(vol: number): void {
    this.keyboardVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setKeyboardMuted(muted: boolean): void {
    this.isKeyboardMuted = muted
    this.applyGains()
  }

  public setCafeVolume(vol: number): void {
    this.cafeVolume = Math.max(0, Math.min(1, vol))
    this.applyGains()
  }

  public setCafeMuted(muted: boolean): void {
    this.isCafeMuted = muted
    this.applyGains()
  }

  private applyGains(): void {
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const masterEffective = this.isMasterMuted ? 0 : this.masterVolume

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(masterEffective, now)
    }

    if (this.musicBus) {
      const musicEffective = this.isMusicMuted ? 0 : this.musicVolume
      this.musicBus.gain.setValueAtTime(musicEffective, now)
    }

    if (this.sfxBus) {
      const sfxEffective = this.isSfxMuted ? 0 : this.sfxVolume
      this.sfxBus.gain.setValueAtTime(sfxEffective, now)
    }

    const ambientEffectiveMaster = this.isAmbientMuted ? 0 : this.ambientVolume

    if (this.rainBus) {
      const rainEffective =
        this.isRainMuted || !this.isRainActive ? 0 : this.rainVolume * ambientEffectiveMaster
      this.rainBus.gain.setValueAtTime(rainEffective, now)
    }

    if (this.keyboardBus) {
      const kbEffective =
        this.isKeyboardMuted || !this.isKeyboardActive ? 0 : this.keyboardVolume * ambientEffectiveMaster
      this.keyboardBus.gain.setValueAtTime(kbEffective, now)
    }

    if (this.cafeBus) {
      const cafeEffective =
        this.isCafeMuted || !this.isCafeActive ? 0 : this.cafeVolume * ambientEffectiveMaster
      this.cafeBus.gain.setValueAtTime(cafeEffective, now)
    }
  }

  // ----------------------------------------------------
  // Lo-Fi Music Synthesizer
  // ----------------------------------------------------

  public setTrack(track: LoFiTrackId): void {
    this.currentTrack = track
    this.chordIndex = 0
  }

  public getCurrentTrack(): LoFiTrackId {
    return this.currentTrack
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying
  }

  public startMusic(track?: LoFiTrackId): void {
    this.initContext()
    if (!this.ctx) return

    if (track) {
      this.currentTrack = track
    }

    if (this.isMusicPlaying) {
      return
    }

    this.isMusicPlaying = true
    this.chordIndex = 0

    // Start subtle procedural vinyl crackle
    this.startVinylLoop()

    // Play immediate first chord
    this.playNextLoFiChord()

    const config = CHORD_PROGRESSIONS[this.currentTrack]
    this.musicIntervalId = setInterval(() => {
      this.playNextLoFiChord()
    }, config.tempoSec * 1000)
  }

  public pauseMusic(): void {
    this.isMusicPlaying = false
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId)
      this.musicIntervalId = null
    }
    this.stopVinylLoop()
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.pauseMusic()
      return false
    } else {
      this.startMusic()
      return true
    }
  }

  private playNextLoFiChord(): void {
    if (!this.ctx || !this.musicBus || !this.isMusicPlaying) return

    const config = CHORD_PROGRESSIONS[this.currentTrack]
    const chords = config.chords
    const chord = chords[this.chordIndex % chords.length]
    if (!chord) return
    this.chordIndex++

    const now = this.ctx.currentTime

    // Synthesize warm Electric Piano / Rhodes voices for each note in chord
    chord.forEach((noteName, idx) => {
      const freq = NOTE_FREQS[noteName]
      if (!freq || !this.ctx || !this.musicBus) return

      // Slight humanized timing offset for strum effect
      const strumOffset = idx * 0.035
      const noteTime = now + strumOffset

      // 1. Primary oscillator (triangle wave)
      const osc1 = this.ctx.createOscillator()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(freq, noteTime)

      // 2. Secondary oscillator (sine wave with warm detune)
      const osc2 = this.ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(freq * 1.002, noteTime)

      // Warm lowpass filter
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1100, noteTime)
      filter.frequency.exponentialRampToValueAtTime(600, noteTime + 2.2)

      // Note envelope
      const noteGain = this.ctx.createGain()
      noteGain.gain.setValueAtTime(0, noteTime)
      noteGain.gain.linearRampToValueAtTime(0.08, noteTime + 0.05)
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 2.4)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(noteGain)
      noteGain.connect(this.musicBus)

      osc1.start(noteTime)
      osc2.start(noteTime)
      osc1.stop(noteTime + 2.5)
      osc2.stop(noteTime + 2.5)
    })
  }

  private startVinylLoop(): void {
    if (!this.ctx || !this.musicBus || this.vinylNode) return

    try {
      // Procedural warm vinyl noise buffer (2 seconds loop)
      const bufferSize = this.ctx.sampleRate * 2
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        // Soft noise with random tiny crackle pops
        const noise = (Math.random() * 2 - 1) * 0.015
        const isCrackle = Math.random() < 0.0003
        data[i] = isCrackle ? (Math.random() * 2 - 1) * 0.08 : noise
      }

      this.vinylNode = this.ctx.createBufferSource()
      this.vinylNode.buffer = buffer
      this.vinylNode.loop = true

      const vinylFilter = this.ctx.createBiquadFilter()
      vinylFilter.type = 'bandpass'
      vinylFilter.frequency.setValueAtTime(1200, this.ctx.currentTime)
      vinylFilter.Q.setValueAtTime(1.5, this.ctx.currentTime)

      const vinylGain = this.ctx.createGain()
      vinylGain.gain.setValueAtTime(0.3, this.ctx.currentTime)

      this.vinylNode.connect(vinylFilter)
      vinylFilter.connect(vinylGain)
      vinylGain.connect(this.musicBus)

      this.vinylNode.start()
    } catch {
      // Safe fallback
    }
  }

  private stopVinylLoop(): void {
    if (this.vinylNode) {
      try {
        this.vinylNode.stop()
        this.vinylNode.disconnect()
      } catch {
        // ignore
      }
      this.vinylNode = null
    }
  }

  // ----------------------------------------------------
  // Ambient Sound Generators
  // ----------------------------------------------------

  public setRainActive(active: boolean): void {
    this.isRainActive = active
    this.applyGains()

    if (active) {
      this.startRainNode()
    } else {
      this.stopRainNode()
    }
  }

  private startRainNode(): void {
    this.initContext()
    if (!this.ctx || !this.rainBus || this.rainSource) return

    try {
      // 3-second looping pink noise buffer for rainfall
      const bufferSize = this.ctx.sampleRate * 3
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      let b0 = 0
      let b1 = 0
      let b2 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.04
      }

      this.rainSource = this.ctx.createBufferSource()
      this.rainSource.buffer = buffer
      this.rainSource.loop = true

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(950, this.ctx.currentTime)

      this.rainSource.connect(filter)
      filter.connect(this.rainBus)
      this.rainSource.start()
    } catch {
      // Safe fallback
    }
  }

  private stopRainNode(): void {
    if (this.rainSource) {
      try {
        this.rainSource.stop()
        this.rainSource.disconnect()
      } catch {
        // ignore
      }
      this.rainSource = null
    }
  }

  public setKeyboardActive(active: boolean): void {
    this.isKeyboardActive = active
    this.applyGains()

    if (active) {
      this.startKeyboardSequence()
    } else {
      this.stopKeyboardSequence()
    }
  }

  private startKeyboardSequence(): void {
    this.initContext()
    if (this.keyboardIntervalId) return

    const scheduleBurst = () => {
      if (!this.isKeyboardActive) return

      // Simulate a burst of 2 to 6 keypresses with random typing speed
      const keystrokeCount = 2 + Math.floor(Math.random() * 5)
      for (let i = 0; i < keystrokeCount; i++) {
        const delayMs = i * (80 + Math.random() * 70)
        setTimeout(() => {
          if (this.isKeyboardActive) {
            this.playMechanicalKeystroke()
          }
        }, delayMs)
      }

      // Next typing burst in 0.8s to 2.2s
      const nextDelay = 800 + Math.random() * 1400
      this.keyboardIntervalId = setTimeout(scheduleBurst, nextDelay)
    }

    scheduleBurst()
  }

  private stopKeyboardSequence(): void {
    if (this.keyboardIntervalId) {
      clearTimeout(this.keyboardIntervalId)
      this.keyboardIntervalId = null
    }
  }

  private playMechanicalKeystroke(): void {
    if (!this.ctx || !this.keyboardBus) return

    const now = this.ctx.currentTime

    // 1. High switch click (crisp tactile click)
    const oscClick = this.ctx.createOscillator()
    oscClick.type = 'triangle'
    const clickFreq = 1800 + Math.random() * 800
    oscClick.frequency.setValueAtTime(clickFreq, now)

    const clickGain = this.ctx.createGain()
    clickGain.gain.setValueAtTime(0.04, now)
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

    oscClick.connect(clickGain)
    clickGain.connect(this.keyboardBus)

    // 2. Bottom-out thud (plastic cap bottoming out)
    const oscThud = this.ctx.createOscillator()
    oscThud.type = 'sine'
    const thudFreq = 220 + Math.random() * 60
    oscThud.frequency.setValueAtTime(thudFreq, now)

    const thudGain = this.ctx.createGain()
    thudGain.gain.setValueAtTime(0.06, now)
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

    oscThud.connect(thudGain)
    thudGain.connect(this.keyboardBus)

    oscClick.start(now)
    oscThud.start(now)
    oscClick.stop(now + 0.02)
    oscThud.stop(now + 0.04)
  }

  public setCafeActive(active: boolean): void {
    this.isCafeActive = active
    this.applyGains()

    if (active) {
      this.startCafeAmbience()
    } else {
      this.stopCafeAmbience()
    }
  }

  private startCafeAmbience(): void {
    this.initContext()
    if (!this.ctx || !this.cafeBus || this.cafeSource) return

    try {
      // 4-second warm low rumble (diffuse coffee shop reverberation)
      const bufferSize = this.ctx.sampleRate * 4
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.03
      }

      this.cafeSource = this.ctx.createBufferSource()
      this.cafeSource.buffer = buffer
      this.cafeSource.loop = true

      const lowpass = this.ctx.createBiquadFilter()
      lowpass.type = 'lowpass'
      lowpass.frequency.setValueAtTime(220, this.ctx.currentTime)

      this.cafeSource.connect(lowpass)
      lowpass.connect(this.cafeBus)
      this.cafeSource.start()

      // Random occasional coffee cup / spoon gentle ping
      const scheduleCupPing = () => {
        if (!this.isCafeActive) return
        this.playCafeCupPing()
        const nextDelay = 3500 + Math.random() * 5000
        this.cafeClinkIntervalId = setTimeout(scheduleCupPing, nextDelay)
      }
      this.cafeClinkIntervalId = setTimeout(scheduleCupPing, 2000)
    } catch {
      // Safe fallback
    }
  }

  private stopCafeAmbience(): void {
    if (this.cafeSource) {
      try {
        this.cafeSource.stop()
        this.cafeSource.disconnect()
      } catch {
        // ignore
      }
      this.cafeSource = null
    }
    if (this.cafeClinkIntervalId) {
      clearTimeout(this.cafeClinkIntervalId)
      this.cafeClinkIntervalId = null
    }
  }

  private playCafeCupPing(): void {
    if (!this.ctx || !this.cafeBus || !this.isCafeActive) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    const pingFreq = 2600 + Math.random() * 400
    osc.frequency.setValueAtTime(pingFreq, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.02, now)
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.3)

    osc.connect(gain)
    gain.connect(this.cafeBus)

    osc.start(now)
    osc.stop(now + 0.35)
  }

  // ----------------------------------------------------
  // Tactile Sound Effects (SFX)
  // ----------------------------------------------------

  public playSfx(type: SoundEffectType): void {
    this.initContext()
    if (!this.ctx || !this.sfxBus) return

    switch (type) {
      case 'coin':
        this.playCoinSound()
        break
      case 'levelUp':
        this.playLevelUpSound()
        break
      case 'click':
        this.playClickSound()
        break
      case 'alarm':
        this.playAlarmSound()
        break
    }
  }

  public playCoinSound(): void {
    this.initContext()
    if (!this.ctx || !this.sfxBus) return

    const now = this.ctx.currentTime

    // Two bright bell tones: B5 (987.77 Hz) -> E6 (1318.51 Hz)
    const tones = [
      { freq: 987.77, start: now, dur: 0.18 },
      { freq: 1318.51, start: now + 0.07, dur: 0.28 },
    ]

    tones.forEach(({ freq, start, dur }) => {
      if (!this.ctx || !this.sfxBus) return
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.12, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)

      osc.connect(gain)
      gain.connect(this.sfxBus)

      osc.start(start)
      osc.stop(start + dur + 0.05)
    })
  }

  public playLevelUpSound(): void {
    this.initContext()
    if (!this.ctx || !this.sfxBus) return

    const now = this.ctx.currentTime

    // Upbeat celebratory 4-note arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [
      { freq: 523.25, time: now },
      { freq: 659.25, time: now + 0.09 },
      { freq: 783.99, time: now + 0.18 },
      { freq: 1046.5, time: now + 0.27 },
    ]

    notes.forEach(({ freq, time }, idx) => {
      if (!this.ctx || !this.sfxBus) return
      const isLast = idx === notes.length - 1
      const dur = isLast ? 0.6 : 0.2

      const osc = this.ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, time)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.14, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur)

      osc.connect(gain)
      gain.connect(this.sfxBus)

      osc.start(time)
      osc.stop(time + dur + 0.05)
    })
  }

  public playClickSound(): void {
    this.initContext()
    if (!this.ctx || !this.sfxBus) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1400, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.07, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

    osc.connect(gain)
    gain.connect(this.sfxBus)

    osc.start(now)
    osc.stop(now + 0.03)
  }

  public playAlarmSound(): void {
    this.initContext()
    if (!this.ctx || !this.sfxBus) return

    const now = this.ctx.currentTime

    // Gentle, warm relaxing chime chord (A4 -> C#5 -> E5)
    const chord = [
      { freq: 440.0, offset: 0, dur: 1.4 },
      { freq: 554.37, offset: 0.08, dur: 1.5 },
      { freq: 659.25, offset: 0.16, dur: 1.8 },
    ]

    chord.forEach(({ freq, offset, dur }) => {
      if (!this.ctx || !this.sfxBus) return
      const t = now + offset
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1600, t)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.12, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.sfxBus)

      osc.start(t)
      osc.stop(t + dur + 0.1)
    })
  }

  // ----------------------------------------------------
  // Teardown / Cleanup
  // ----------------------------------------------------

  public dispose(): void {
    this.pauseMusic()
    this.setRainActive(false)
    this.setKeyboardActive(false)
    this.setCafeActive(false)

    if (this.ctx) {
      try {
        this.ctx.close()
      } catch {
        // ignore
      }
      this.ctx = null
    }
  }
}

export const audioEngine = AudioEngine.getInstance()
