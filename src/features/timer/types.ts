export type TimerMode = 'focus' | 'short_break' | 'long_break'

export type TimerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'emergency_pause'
  | 'completed'
  | 'failed'

export interface TimerConfig {
  /** Focus session duration in seconds (default: 25 * 60 = 1500) */
  focusDuration: number
  /** Short break duration in seconds (default: 5 * 60 = 300) */
  shortBreakDuration: number
  /** Long break duration in seconds (default: 15 * 60 = 900) */
  longBreakDuration: number
  /** Sessions before triggering long break (default: 4) */
  longBreakInterval: number
  /** Hardcore mode: no pauses permitted, emergency pause disabled */
  isHardcore: boolean
  /** Emergency pause duration in seconds (3 to 5 minutes: 180 - 300, default: 180) */
  emergencyDuration: number
  /** Whether emergency pause is allowed when not in hardcore mode (default: true) */
  allowEmergencyPause: boolean
  /** Whether regular pause is allowed (default: true) */
  allowNormalPause: boolean
}

export interface TimerSnapshot {
  status: TimerStatus
  mode: TimerMode
  timeLeft: number
  duration: number
  emergencyTimeLeft: number
  emergencyDuration: number
  sessionsCompleted: number
  isHardcore: boolean
  progress: number // 0 to 1 (0 = just started, 1 = completed)
  emergencyProgress: number // 0 to 1
  canPause: boolean
  canEmergencyPause: boolean
  canResume: boolean
}

export type WorkerInMessage =
  | { type: 'START'; duration: number; intervalMs?: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; timeLeft: number }
  | { type: 'START_EMERGENCY'; duration: number }
  | { type: 'RESUME_FROM_EMERGENCY' }
  | { type: 'STOP' }
  | { type: 'RESET'; duration: number }

export type WorkerOutMessage =
  | { type: 'TICK'; timeLeft: number; elapsed: number }
  | { type: 'EMERGENCY_TICK'; emergencyTimeLeft: number; elapsed: number }
  | { type: 'COMPLETE' }
  | { type: 'EMERGENCY_EXPIRED' }

export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  focusDuration: 25 * 60, // 25 minutes
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
  longBreakInterval: 4,
  isHardcore: false,
  emergencyDuration: 3 * 60, // 3 minutes (180s)
  allowEmergencyPause: true,
  allowNormalPause: true,
}
