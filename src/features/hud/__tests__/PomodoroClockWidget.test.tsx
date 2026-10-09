import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PomodoroClockWidget } from '../PomodoroClockWidget'
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

describe('PomodoroClockWidget Component', () => {
  it('renders crisp digital clock digits and mode badge', () => {
    const mock = createMockPomodoro()
    render(<PomodoroClockWidget pomodoro={mock} />)

    expect(screen.getByTestId('pomodoro-digital-clock')).toHaveTextContent('25:00')
    expect(screen.getByTestId('pomodoro-mode-badge')).toHaveTextContent('Foco (Sprint)')
    expect(screen.getByText('Sessões concluídas:')).toBeInTheDocument()
  })

  it('renders start button when idle and invokes start on click', () => {
    const mock = createMockPomodoro({ status: 'idle' })
    render(<PomodoroClockWidget pomodoro={mock} />)

    const startBtn = screen.getByRole('button', { name: /Iniciar Sprint Gratuito/i })
    expect(startBtn).toBeInTheDocument()

    fireEvent.click(startBtn)
    expect(mock.start).toHaveBeenCalled()
  })

  it('renders emergency pause button when running and invokes callback', () => {
    const mock = createMockPomodoro({
      status: 'running',
      canPause: true,
      canEmergencyPause: true,
      formattedTime: '21:30',
    })
    render(<PomodoroClockWidget pomodoro={mock} />)

    const emergencyBtn = screen.getByRole('button', { name: /Pausa de Emergência/i })
    expect(emergencyBtn).toBeInTheDocument()

    fireEvent.click(emergencyBtn)
    expect(mock.startEmergencyPause).toHaveBeenCalled()
  })

  it('renders cancel button when running and invokes abandon on click', () => {
    const mock = createMockPomodoro({
      status: 'running',
      canPause: true,
    })
    render(<PomodoroClockWidget pomodoro={mock} />)

    const cancelBtn = screen.getByRole('button', { name: /Cancelar ou desistir do sprint/i })
    expect(cancelBtn).toBeInTheDocument()
    expect(cancelBtn).toHaveTextContent('Cancelar')

    fireEvent.click(cancelBtn)
    expect(mock.abandon).toHaveBeenCalled()
  })

  it('renders emergency pause banner and resume button when emergency_pause is active', () => {
    const mock = createMockPomodoro({
      status: 'emergency_pause',
      formattedEmergencyTime: '02:45',
    })
    render(<PomodoroClockWidget pomodoro={mock} />)

    expect(screen.getByTestId('emergency-pause-active-banner')).toHaveTextContent(
      'Pausa de Emergência: 02:45 restantes!'
    )

    const resumeEmergencyBtn = screen.getByRole('button', { name: /Retomar da Emergência/i })
    expect(resumeEmergencyBtn).toBeInTheDocument()

    fireEvent.click(resumeEmergencyBtn)
    expect(mock.resumeFromEmergency).toHaveBeenCalled()
  })

  it('toggles hardcore mode when clicked', () => {
    const mock = createMockPomodoro({ isHardcore: false })
    render(<PomodoroClockWidget pomodoro={mock} />)

    const hardcoreBtn = screen.getByRole('button', { name: /Modo Hardcore: Desativado/i })
    expect(hardcoreBtn).toBeInTheDocument()

    fireEvent.click(hardcoreBtn)
    expect(mock.setHardcore).toHaveBeenCalledWith(true)
  })
})
