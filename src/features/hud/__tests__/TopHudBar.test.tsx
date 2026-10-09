import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TopHudBar } from '../TopHudBar'
import type { PlayerProfile } from '@/features/state/types'

const mockProfile: PlayerProfile = {
  name: 'Dev Test',
  devCoins: 250,
  totalXp: 120,
  level: 1,
  role: 'student',
  stage: 'stage_1_university',
  activeUsers: 42,
  streakDays: 5,
  lastActiveDate: null,
  createdAt: '2026-10-09T00:00:00.000Z',
  lastSavedAt: '2026-10-09T00:00:00.000Z',
}

describe('TopHudBar Component', () => {
  it('renders brand title and current stage label', () => {
    render(<TopHudBar profile={mockProfile} />)
    expect(screen.getByRole('heading', { name: 'Codora', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Fase 1: Quarto Universitário')).toBeInTheDocument()
  })

  it('renders DevCoins balance with formatted value', () => {
    render(<TopHudBar profile={mockProfile} />)
    const coinsEl = screen.getByTestId('hud-devcoins')
    expect(coinsEl).toBeInTheDocument()
    expect(coinsEl).toHaveTextContent('250')
    expect(coinsEl).toHaveTextContent('DevCoins')
  })

  it('renders current level badge and XP progress bar', () => {
    render(<TopHudBar profile={mockProfile} />)
    expect(screen.getByTestId('hud-level-badge')).toHaveTextContent('Nível 1')
    expect(screen.getByText(/XP \(Estudante\)/i)).toBeInTheDocument()

    const progressBar = screen.getByRole('progressbar', {
      name: /Progresso de XP para o próximo nível/i,
    })
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow')
  })

  it('renders streak days counter with fire icon indicator', () => {
    render(<TopHudBar profile={mockProfile} />)
    const streakEl = screen.getByTestId('hud-streak')
    expect(streakEl).toBeInTheDocument()
    expect(streakEl).toHaveTextContent('5')
    expect(streakEl).toHaveTextContent('dias')
  })

  it('renders active users counter', () => {
    render(<TopHudBar profile={mockProfile} />)
    const usersEl = screen.getByTestId('hud-users')
    expect(usersEl).toBeInTheDocument()
    expect(usersEl).toHaveTextContent('42')
    expect(usersEl).toHaveTextContent('Users')
  })

  it('renders shortcut buttons and triggers callback on click', () => {
    const onShortcutClick = vi.fn()
    render(<TopHudBar profile={mockProfile} onShortcutClick={onShortcutClick} />)

    const projectsBtn = screen.getByRole('button', { name: 'Projetos' })
    const shopBtn = screen.getByRole('button', { name: 'Loja' })
    const achievementsBtn = screen.getByRole('button', { name: 'Conquistas' })
    const audioBtn = screen.getByRole('button', { name: 'Áudio' })
    const settingsBtn = screen.getByRole('button', { name: 'Definições' })

    expect(projectsBtn).toBeInTheDocument()
    expect(shopBtn).toBeInTheDocument()
    expect(achievementsBtn).toBeInTheDocument()
    expect(audioBtn).toBeInTheDocument()
    expect(settingsBtn).toBeInTheDocument()

    fireEvent.click(projectsBtn)
    expect(onShortcutClick).toHaveBeenCalledWith('contracts')

    fireEvent.click(shopBtn)
    expect(onShortcutClick).toHaveBeenCalledWith('shop')
  })
})
