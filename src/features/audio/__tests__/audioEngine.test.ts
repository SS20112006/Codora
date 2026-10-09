import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AudioEngine } from '../audioEngine'

// Create a robust Mock AudioContext for Web Audio API unit testing
function createMockAudioContext() {
  const destination = {}

  const mockGainNode = () => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      value: 1,
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  })

  const mockOscillatorNode = () => ({
    type: 'sine',
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })

  const mockBiquadFilter = () => ({
    type: 'lowpass',
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    Q: {
      setValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  })

  const mockBufferSource = () => ({
    buffer: null,
    loop: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })

  const mockBuffer = {
    getChannelData: vi.fn().mockReturnValue(new Float32Array(100)),
  }

  return {
    state: 'running',
    currentTime: 0,
    sampleRate: 44100,
    destination,
    createGain: vi.fn().mockImplementation(mockGainNode),
    createOscillator: vi.fn().mockImplementation(mockOscillatorNode),
    createBiquadFilter: vi.fn().mockImplementation(mockBiquadFilter),
    createBufferSource: vi.fn().mockImplementation(mockBufferSource),
    createBuffer: vi.fn().mockReturnValue(mockBuffer),
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  }
}

describe('AudioEngine Unit Tests', () => {
  let originalAudioContext: unknown

  beforeEach(() => {
    AudioEngine.resetInstance()
    originalAudioContext = window.AudioContext
  })

  afterEach(() => {
    AudioEngine.resetInstance()
    window.AudioContext = originalAudioContext as typeof AudioContext
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('handles environment without AudioContext gracefully without throwing', () => {
    // @ts-expect-error simulating environment without AudioContext
    delete window.AudioContext

    const engine = AudioEngine.getInstance()
    expect(engine.initContext()).toBeNull()

    // None of these should throw
    expect(() => engine.playCoinSound()).not.toThrow()
    expect(() => engine.playLevelUpSound()).not.toThrow()
    expect(() => engine.playClickSound()).not.toThrow()
    expect(() => engine.playAlarmSound()).not.toThrow()
    expect(() => engine.startMusic()).not.toThrow()
    expect(() => engine.pauseMusic()).not.toThrow()
    expect(() => engine.setRainActive(true)).not.toThrow()
    expect(() => engine.setKeyboardActive(true)).not.toThrow()
    expect(() => engine.setCafeActive(true)).not.toThrow()
  })

  it('initializes audio nodes when AudioContext is present', () => {
    const mockCtx = createMockAudioContext()
    window.AudioContext = vi.fn().mockImplementation(() => mockCtx) as unknown as typeof AudioContext

    const engine = AudioEngine.getInstance()
    const ctx = engine.initContext()

    expect(ctx).toBe(mockCtx)
    expect(mockCtx.createGain).toHaveBeenCalled()
  })

  it('adjusts volume and mute states across channels', () => {
    const mockCtx = createMockAudioContext()
    window.AudioContext = vi.fn().mockImplementation(() => mockCtx) as unknown as typeof AudioContext

    const engine = AudioEngine.getInstance()
    engine.initContext()

    expect(() => {
      engine.setMasterVolume(0.5)
      engine.setMasterMuted(true)
      engine.setMusicVolume(0.7)
      engine.setMusicMuted(false)
      engine.setAmbientVolume(0.4)
      engine.setAmbientMuted(true)
      engine.setSfxVolume(0.9)
      engine.setSfxMuted(false)
      engine.setRainVolume(0.3)
      engine.setRainMuted(true)
      engine.setKeyboardVolume(0.6)
      engine.setKeyboardMuted(false)
      engine.setCafeVolume(0.2)
      engine.setCafeMuted(true)
    }).not.toThrow()
  })

  it('plays tactile SFX with synthesized oscillators', () => {
    const mockCtx = createMockAudioContext()
    window.AudioContext = vi.fn().mockImplementation(() => mockCtx) as unknown as typeof AudioContext

    const engine = AudioEngine.getInstance()
    engine.initContext()

    engine.playSfx('coin')
    expect(mockCtx.createOscillator).toHaveBeenCalled()

    engine.playSfx('levelUp')
    expect(mockCtx.createOscillator).toHaveBeenCalled()

    engine.playSfx('click')
    expect(mockCtx.createOscillator).toHaveBeenCalled()

    engine.playSfx('alarm')
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('manages Lo-Fi music playback and tracks', () => {
    vi.useFakeTimers()
    const mockCtx = createMockAudioContext()
    window.AudioContext = vi.fn().mockImplementation(() => mockCtx) as unknown as typeof AudioContext

    const engine = AudioEngine.getInstance()
    expect(engine.getIsMusicPlaying()).toBe(false)
    expect(engine.getCurrentTrack()).toBe('chill')

    engine.setTrack('deepFocus')
    expect(engine.getCurrentTrack()).toBe('deepFocus')

    engine.startMusic()
    expect(engine.getIsMusicPlaying()).toBe(true)

    // Advances timer to trigger next chord
    vi.advanceTimersByTime(3500)
    expect(mockCtx.createOscillator).toHaveBeenCalled()

    engine.pauseMusic()
    expect(engine.getIsMusicPlaying()).toBe(false)

    // Toggle
    const playing = engine.toggleMusic()
    expect(playing).toBe(true)
    expect(engine.getIsMusicPlaying()).toBe(true)

    const stopped = engine.toggleMusic()
    expect(stopped).toBe(false)
    expect(engine.getIsMusicPlaying()).toBe(false)
  })

  it('manages ambient generators (rain, mechanical keyboard, cafe)', () => {
    vi.useFakeTimers()
    const mockCtx = createMockAudioContext()
    window.AudioContext = vi.fn().mockImplementation(() => mockCtx) as unknown as typeof AudioContext

    const engine = AudioEngine.getInstance()

    // Rain
    engine.setRainActive(true)
    expect(mockCtx.createBufferSource).toHaveBeenCalled()
    engine.setRainActive(false)

    // Keyboard
    engine.setKeyboardActive(true)
    vi.advanceTimersByTime(1200)
    engine.setKeyboardActive(false)

    // Café
    engine.setCafeActive(true)
    expect(mockCtx.createBufferSource).toHaveBeenCalled()
    engine.setCafeActive(false)
  })

  it('disposes resources cleanly', () => {
    const mockCtx = createMockAudioContext()
    window.AudioContext = vi.fn().mockImplementation(() => mockCtx) as unknown as typeof AudioContext

    const engine = AudioEngine.getInstance()
    engine.initContext()
    engine.startMusic()
    engine.setRainActive(true)

    engine.dispose()
    expect(engine.getIsMusicPlaying()).toBe(false)
    expect(mockCtx.close).toHaveBeenCalled()
  })
})
