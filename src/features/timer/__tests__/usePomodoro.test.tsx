import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePomodoro, formatSecondsToMMSS } from '../usePomodoro'

describe('formatSecondsToMMSS', () => {
  it('formats seconds into mm:ss string', () => {
    expect(formatSecondsToMMSS(0)).toBe('00:00')
    expect(formatSecondsToMMSS(59)).toBe('00:59')
    expect(formatSecondsToMMSS(60)).toBe('01:00')
    expect(formatSecondsToMMSS(1500)).toBe('25:00')
    expect(formatSecondsToMMSS(180)).toBe('03:00')
  })
})

describe('usePomodoro Hook', () => {
  it('provides default idle pomodoro state and formatters', () => {
    const { result } = renderHook(() =>
      usePomodoro({ focusDuration: 1500, emergencyDuration: 180 })
    )

    expect(result.current.status).toBe('idle')
    expect(result.current.mode).toBe('focus')
    expect(result.current.timeLeft).toBe(1500)
    expect(result.current.formattedTime).toBe('25:00')
    expect(result.current.formattedEmergencyTime).toBe('03:00')
    expect(result.current.isHardcore).toBe(false)
  })

  it('starts, pauses, and resumes via hook actions', () => {
    const { result } = renderHook(() =>
      usePomodoro({ focusDuration: 1500, allowNormalPause: true })
    )

    act(() => {
      result.current.start()
    })
    expect(result.current.status).toBe('running')

    act(() => {
      result.current.pause()
    })
    expect(result.current.status).toBe('paused')

    act(() => {
      result.current.resume()
    })
    expect(result.current.status).toBe('running')
  })

  it('triggers emergency pause and handles hardcore toggle', () => {
    const { result } = renderHook(() =>
      usePomodoro({ focusDuration: 1500, emergencyDuration: 180 })
    )

    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.startEmergencyPause()
    })
    expect(result.current.status).toBe('emergency_pause')

    act(() => {
      result.current.resumeFromEmergency()
    })
    expect(result.current.status).toBe('running')

    act(() => {
      result.current.setHardcore(true)
    })
    expect(result.current.isHardcore).toBe(true)
    expect(result.current.canEmergencyPause).toBe(false)
  })
})
