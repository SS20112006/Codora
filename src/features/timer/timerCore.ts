import {
  DEFAULT_TIMER_CONFIG,
  TimerConfig,
  TimerMode,
  TimerSnapshot,
  TimerStatus,
} from './types'

/**
 * Calculates remaining seconds using high-precision timestamps, completely preventing
 * accumulated drift from browser timer throttling or event-loop delays.
 */
export function calculateDriftFreeRemaining(
  startTimestampMs: number,
  currentTimestampMs: number,
  totalDurationSeconds: number
): number {
  const elapsedMs = Math.max(0, currentTimestampMs - startTimestampMs)
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  return Math.max(0, totalDurationSeconds - elapsedSeconds)
}

export class PomodoroEngine {
  private config: TimerConfig
  private status: TimerStatus = 'idle'
  private mode: TimerMode = 'focus'
  private timeLeft: number
  private emergencyTimeLeft: number
  private sessionsCompleted = 0

  constructor(config?: Partial<TimerConfig>) {
    this.config = { ...DEFAULT_TIMER_CONFIG, ...config }
    this.timeLeft = this.config.focusDuration
    this.emergencyTimeLeft = this.config.emergencyDuration
  }

  public getSnapshot(): TimerSnapshot {
    const currentDuration = this.getDurationForMode(this.mode)
    const progress =
      currentDuration > 0
        ? Math.min(1, Math.max(0, (currentDuration - this.timeLeft) / currentDuration))
        : 0

    const emergencyProgress =
      this.config.emergencyDuration > 0
        ? Math.min(
            1,
            Math.max(
              0,
              (this.config.emergencyDuration - this.emergencyTimeLeft) /
                this.config.emergencyDuration
            )
          )
        : 0

    const isRunning = this.status === 'running'
    const isPaused = this.status === 'paused'
    const isEmergency = this.status === 'emergency_pause'

    const canPause =
      isRunning && !this.config.isHardcore && this.config.allowNormalPause
    const canEmergencyPause =
      isRunning &&
      this.mode === 'focus' &&
      !this.config.isHardcore &&
      this.config.allowEmergencyPause
    const canResume = isPaused || isEmergency

    return {
      status: this.status,
      mode: this.mode,
      timeLeft: this.timeLeft,
      duration: currentDuration,
      emergencyTimeLeft: this.emergencyTimeLeft,
      emergencyDuration: this.config.emergencyDuration,
      sessionsCompleted: this.sessionsCompleted,
      isHardcore: this.config.isHardcore,
      progress,
      emergencyProgress,
      canPause,
      canEmergencyPause,
      canResume,
    }
  }

  public getDurationForMode(mode: TimerMode): number {
    switch (mode) {
      case 'focus':
        return this.config.focusDuration
      case 'short_break':
        return this.config.shortBreakDuration
      case 'long_break':
        return this.config.longBreakDuration
    }
  }

  public start(): boolean {
    if (this.status === 'running') return false
    this.status = 'running'
    return true
  }

  public tick(remainingSeconds: number): void {
    if (this.status !== 'running') return
    this.timeLeft = Math.max(0, remainingSeconds)
    if (this.timeLeft === 0) {
      this.completeSession()
    }
  }

  public completeSession(): void {
    this.status = 'completed'
    this.timeLeft = 0

    if (this.mode === 'focus') {
      this.sessionsCompleted += 1
      const isLongBreak =
        this.sessionsCompleted % this.config.longBreakInterval === 0
      this.mode = isLongBreak ? 'long_break' : 'short_break'
      this.timeLeft = this.getDurationForMode(this.mode)
    } else {
      // Finished break -> ready for next focus sprint
      this.mode = 'focus'
      this.timeLeft = this.getDurationForMode('focus')
    }
  }

  public pause(): boolean {
    if (this.status !== 'running' || this.config.isHardcore) {
      return false
    }

    if (this.config.allowNormalPause) {
      this.status = 'paused'
      return true
    }

    if (this.config.allowEmergencyPause && this.mode === 'focus') {
      return this.startEmergencyPause()
    }

    return false
  }

  public resume(): boolean {
    if (this.status !== 'paused') return false
    this.status = 'running'
    return true
  }

  public startEmergencyPause(): boolean {
    if (
      this.status !== 'running' ||
      this.mode !== 'focus' ||
      this.config.isHardcore ||
      !this.config.allowEmergencyPause
    ) {
      return false
    }

    this.status = 'emergency_pause'
    this.emergencyTimeLeft = this.config.emergencyDuration
    return true
  }

  public tickEmergency(remainingSeconds: number): void {
    if (this.status !== 'emergency_pause') return
    this.emergencyTimeLeft = Math.max(0, remainingSeconds)
    if (this.emergencyTimeLeft === 0) {
      this.expireEmergency()
    }
  }

  public resumeFromEmergency(): boolean {
    if (this.status !== 'emergency_pause') return false
    this.status = 'running'
    this.emergencyTimeLeft = this.config.emergencyDuration
    return true
  }

  public expireEmergency(): void {
    if (this.status !== 'emergency_pause') return
    this.status = 'failed'
    this.emergencyTimeLeft = 0
  }

  public abandon(): void {
    this.status = 'failed'
  }

  public reset(): void {
    this.status = 'idle'
    this.timeLeft = this.getDurationForMode(this.mode)
    this.emergencyTimeLeft = this.config.emergencyDuration
  }

  public setMode(mode: TimerMode): void {
    this.mode = mode
    this.status = 'idle'
    this.timeLeft = this.getDurationForMode(mode)
    this.emergencyTimeLeft = this.config.emergencyDuration
  }

  public updateConfig(newConfig: Partial<TimerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (this.status === 'idle') {
      this.timeLeft = this.getDurationForMode(this.mode)
      this.emergencyTimeLeft = this.config.emergencyDuration
    }
  }

  public getConfig(): TimerConfig {
    return { ...this.config }
  }
}
