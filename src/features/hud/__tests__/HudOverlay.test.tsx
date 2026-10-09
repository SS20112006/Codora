import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HudOverlay } from '../HudOverlay'
import type { UsePomodoroReturn } from '@/features/timer'

function createMockPomodoro(overrides: Partial<UsePomodoroReturn> = {}): UsePomodoroReturn {
  return {
    status: 'idle',
    mode: 'focus',
    timeLeft: 1500,
    duration: 1500,
    emergencyTimeLeft: 180,
    emergencyDuration: 180,
    progress: 0,
    emergencyProgress: 0,
    isHardcore: false,
    canPause: false,
    canEmergencyPause: false,
    canResume: false,
    sessionsCompleted: 0,
    formattedTime: '25:00',
    formattedEmergencyTime: '03:00',
    start: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    startEmergencyPause: vi.fn(),
    resumeFromEmergency: vi.fn(),
    reset: vi.fn(),
    abandon: vi.fn(),
    setMode: vi.fn(),
    setHardcore: vi.fn(),
    ...overrides,
  }
}

describe('HudOverlay Component', () => {
  it('renders both ProjectStatusCard and PomodoroClockWidget inside the overlay', () => {
    const pomodoro = createMockPomodoro()
    render(<HudOverlay pomodoro={pomodoro} activeProject={null} />)

    expect(screen.getByTestId('hud-overlay')).toBeInTheDocument()
    expect(screen.getByTestId('hud-project-status-card')).toBeInTheDocument()
    expect(screen.getByTestId('hud-pomodoro-clock-widget')).toBeInTheDocument()
  })
})
