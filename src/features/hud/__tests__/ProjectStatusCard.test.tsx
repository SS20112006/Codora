import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectStatusCard } from '../ProjectStatusCard'
import type { ActiveProjectState } from '@/features/state/types'

describe('ProjectStatusCard Component', () => {
  it('renders default study sprint when activeProject is null', () => {
    render(
      <ProjectStatusCard
        activeProject={null}
        status="idle"
        mode="focus"
        timeLeft={1500}
        duration={1500}
        formattedTime="25:00"
      />
    )

    expect(screen.getByText('Sprint de Foco Livre (Algoritmos & Estudo)')).toBeInTheDocument()
    expect(screen.getByTestId('project-status-pill')).toHaveTextContent('Aguardar Início')
    expect(screen.getByTestId('time-remaining-feedback')).toHaveTextContent('25m 0s restantes')
  })

  it('renders active project title, financial rewards, and free tier badge', () => {
    const activeProject: ActiveProjectState = {
      contractId: 'contract-algo-1',
      title: 'Resolução de Exercícios de Grafos',
      durationMinutes: 25,
      stakedAmount: 0,
      baseReward: 35,
      baseXp: 80,
      isFreeTier: true,
      startedAt: '2026-10-09T00:00:00.000Z',
    }

    render(
      <ProjectStatusCard
        activeProject={activeProject}
        status="running"
        mode="focus"
        timeLeft={1200}
        duration={1500}
        formattedTime="20:00"
      />
    )

    expect(screen.getByText('Resolução de Exercícios de Grafos')).toBeInTheDocument()
    expect(screen.getByText('Free Tier')).toBeInTheDocument()
    expect(screen.getByText('+35 DevCoins')).toBeInTheDocument()
    expect(screen.getByText('+80 XP')).toBeInTheDocument()
    expect(screen.getByTestId('project-status-pill')).toHaveTextContent('Em Progresso')
    expect(screen.getByTestId('time-remaining-feedback')).toHaveTextContent('20m 0s restantes')
  })

  it('renders emergency pause status and remaining feedback properly', () => {
    render(
      <ProjectStatusCard
        activeProject={null}
        status="emergency_pause"
        mode="focus"
        timeLeft={600}
        duration={1500}
        formattedTime="10:00"
      />
    )

    expect(screen.getByTestId('project-status-pill')).toHaveTextContent(
      'Pausa de Emergência'
    )
    expect(screen.getByTestId('time-remaining-feedback')).toHaveTextContent('10m 0s restantes')
  })
})
