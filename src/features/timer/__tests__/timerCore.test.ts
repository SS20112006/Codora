import { describe, it, expect, beforeEach } from 'vitest'
import {
  PomodoroEngine,
  calculateDriftFreeRemaining,
} from '../timerCore'
import { DEFAULT_TIMER_CONFIG } from '../types'

describe('calculateDriftFreeRemaining', () => {
  it('accurately calculates remaining seconds without drift based on timestamps', () => {
    const startMs = 1000000
    const totalDuration = 1500 // 25 mins

    // 10 seconds later
    expect(calculateDriftFreeRemaining(startMs, startMs + 10000, totalDuration)).toBe(1490)

    // 123.456 seconds later
    expect(calculateDriftFreeRemaining(startMs, startMs + 123456, totalDuration)).toBe(1377)

    // elapsed time exceeds duration
    expect(calculateDriftFreeRemaining(startMs, startMs + 1600000, totalDuration)).toBe(0)
  })
})

describe('PomodoroEngine State Machine', () => {
  let engine: PomodoroEngine

  beforeEach(() => {
    engine = new PomodoroEngine(DEFAULT_TIMER_CONFIG)
  })

  it('initializes with idle state and focus mode defaults', () => {
    const snap = engine.getSnapshot()
    expect(snap.status).toBe('idle')
    expect(snap.mode).toBe('focus')
    expect(snap.timeLeft).toBe(1500)
    expect(snap.duration).toBe(1500)
    expect(snap.sessionsCompleted).toBe(0)
    expect(snap.isHardcore).toBe(false)
    expect(snap.canPause).toBe(false) // Cannot pause when idle
    expect(snap.canResume).toBe(false)
  })

  it('transitions from idle to running on start()', () => {
    const started = engine.start()
    expect(started).toBe(true)
    const snap = engine.getSnapshot()
    expect(snap.status).toBe('running')
    expect(snap.canPause).toBe(true)
  })

  it('updates timeLeft correctly on tick()', () => {
    engine.start()
    engine.tick(1495) // 5 seconds elapsed
    expect(engine.getSnapshot().timeLeft).toBe(1495)
    expect(engine.getSnapshot().progress).toBeCloseTo((1500 - 1495) / 1500)
  })

  it('completes focus session and switches to short break', () => {
    engine.start()
    engine.completeSession()

    const snap = engine.getSnapshot()
    expect(snap.status).toBe('completed')
    expect(snap.sessionsCompleted).toBe(1)
    expect(snap.mode).toBe('short_break')
    expect(snap.duration).toBe(300)
    expect(snap.timeLeft).toBe(300)
  })

  it('triggers long break after 4 completed focus sessions', () => {
    // 1st focus
    engine.start()
    engine.completeSession()
    expect(engine.getSnapshot().mode).toBe('short_break')
    expect(engine.getSnapshot().sessionsCompleted).toBe(1)

    // Complete short break -> next is focus
    engine.start()
    engine.completeSession()
    expect(engine.getSnapshot().mode).toBe('focus')

    // 2nd focus
    engine.start()
    engine.completeSession()
    expect(engine.getSnapshot().mode).toBe('short_break')
    expect(engine.getSnapshot().sessionsCompleted).toBe(2)

    // Complete short break
    engine.start()
    engine.completeSession()
    expect(engine.getSnapshot().mode).toBe('focus')

    // 3rd focus
    engine.start()
    engine.completeSession()
    expect(engine.getSnapshot().mode).toBe('short_break')
    expect(engine.getSnapshot().sessionsCompleted).toBe(3)

    // Complete short break
    engine.start()
    engine.completeSession()
    expect(engine.getSnapshot().mode).toBe('focus')

    // 4th focus
    engine.start()
    engine.completeSession()
    const snap = engine.getSnapshot()
    expect(snap.sessionsCompleted).toBe(4)
    expect(snap.mode).toBe('long_break')
    expect(snap.duration).toBe(900)
  })

  it('handles regular pause and resume in normal mode', () => {
    engine.start()
    engine.tick(1400)
    expect(engine.pause()).toBe(true)
    expect(engine.getSnapshot().status).toBe('paused')
    expect(engine.getSnapshot().canResume).toBe(true)

    expect(engine.resume()).toBe(true)
    expect(engine.getSnapshot().status).toBe('running')
    expect(engine.getSnapshot().timeLeft).toBe(1400)
  })

  describe('Hardcore Mode', () => {
    let hardcoreEngine: PomodoroEngine

    beforeEach(() => {
      hardcoreEngine = new PomodoroEngine({
        ...DEFAULT_TIMER_CONFIG,
        isHardcore: true,
      })
    })

    it('disallows pausing and emergency pausing', () => {
      hardcoreEngine.start()
      const snap = hardcoreEngine.getSnapshot()
      expect(snap.isHardcore).toBe(true)
      expect(snap.canPause).toBe(false)
      expect(snap.canEmergencyPause).toBe(false)

      expect(hardcoreEngine.pause()).toBe(false)
      expect(hardcoreEngine.startEmergencyPause()).toBe(false)
      expect(hardcoreEngine.getSnapshot().status).toBe('running')
    })

    it('transitions to failed if session is abandoned / aborted', () => {
      hardcoreEngine.start()
      hardcoreEngine.abandon()
      expect(hardcoreEngine.getSnapshot().status).toBe('failed')
    })
  })

  describe('Emergency Pause Mode', () => {
    it('activates emergency pause and handles countdown', () => {
      engine.start()
      engine.tick(1200)

      expect(engine.getSnapshot().canEmergencyPause).toBe(true)
      const success = engine.startEmergencyPause()
      expect(success).toBe(true)

      const pauseSnap = engine.getSnapshot()
      expect(pauseSnap.status).toBe('emergency_pause')
      expect(pauseSnap.emergencyTimeLeft).toBe(180) // 3 mins default
      expect(pauseSnap.timeLeft).toBe(1200) // Preserved session time

      // Tick emergency pause
      engine.tickEmergency(150)
      expect(engine.getSnapshot().emergencyTimeLeft).toBe(150)

      // Resume from emergency pause
      expect(engine.resumeFromEmergency()).toBe(true)
      const resumedSnap = engine.getSnapshot()
      expect(resumedSnap.status).toBe('running')
      expect(resumedSnap.timeLeft).toBe(1200)
    })

    it('transitions to failed when emergency pause expires', () => {
      engine.start()
      engine.startEmergencyPause()
      engine.expireEmergency()

      const snap = engine.getSnapshot()
      expect(snap.status).toBe('failed')
    })
  })

  describe('Reset and Mode Switching', () => {
    it('resets session back to idle state with current mode duration', () => {
      engine.start()
      engine.tick(1000)
      engine.reset()

      const snap = engine.getSnapshot()
      expect(snap.status).toBe('idle')
      expect(snap.timeLeft).toBe(1500)
    })

    it('allows manually switching mode to short_break or focus', () => {
      engine.setMode('short_break')
      expect(engine.getSnapshot().mode).toBe('short_break')
      expect(engine.getSnapshot().timeLeft).toBe(300)

      engine.setMode('long_break')
      expect(engine.getSnapshot().mode).toBe('long_break')
      expect(engine.getSnapshot().timeLeft).toBe(900)
    })
  })
})
