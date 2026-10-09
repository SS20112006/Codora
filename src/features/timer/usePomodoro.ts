import { useEffect, useMemo, useState, useCallback } from 'react'
import { TimerWorkerClient } from './timerWorkerClient'
import { TimerConfig, TimerMode, TimerSnapshot } from './types'

export function formatSecondsToMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export interface UsePomodoroReturn extends TimerSnapshot {
  start: () => boolean
  pause: () => boolean
  resume: () => boolean
  startEmergencyPause: () => boolean
  resumeFromEmergency: () => boolean
  reset: () => void
  abandon: () => void
  setMode: (mode: TimerMode) => void
  setHardcore: (isHardcore: boolean) => void
  formattedTime: string
  formattedEmergencyTime: string
}

export function usePomodoro(
  initialConfig?: Partial<TimerConfig>,
  workerFactory?: () => Worker
): UsePomodoroReturn {
  const client = useMemo(
    () => new TimerWorkerClient(initialConfig, workerFactory),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [snapshot, setSnapshot] = useState<TimerSnapshot>(() =>
    client.getSnapshot()
  )

  useEffect(() => {
    const unsubscribe = client.subscribe(setSnapshot)
    return () => {
      unsubscribe()
      client.destroy()
    }
  }, [client])

  const start = useCallback(() => client.start(), [client])
  const pause = useCallback(() => client.pause(), [client])
  const resume = useCallback(() => client.resume(), [client])
  const startEmergencyPause = useCallback(
    () => client.startEmergencyPause(),
    [client]
  )
  const resumeFromEmergency = useCallback(
    () => client.resume(),
    [client]
  )
  const reset = useCallback(() => client.reset(), [client])
  const abandon = useCallback(() => client.abandon(), [client])
  const setMode = useCallback((m: TimerMode) => client.setMode(m), [client])
  const setHardcore = useCallback(
    (isHardcore: boolean) => client.updateConfig({ isHardcore }),
    [client]
  )

  const formattedTime = useMemo(
    () => formatSecondsToMMSS(snapshot.timeLeft),
    [snapshot.timeLeft]
  )

  const formattedEmergencyTime = useMemo(
    () => formatSecondsToMMSS(snapshot.emergencyTimeLeft),
    [snapshot.emergencyTimeLeft]
  )

  return {
    ...snapshot,
    start,
    pause,
    resume,
    startEmergencyPause,
    resumeFromEmergency,
    reset,
    abandon,
    setMode,
    setHardcore,
    formattedTime,
    formattedEmergencyTime,
  }
}
