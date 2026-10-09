import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContractsDrawer } from '../ContractsDrawer'
import { useGameStore } from '@/features/state'
import type { ProjectContract } from '@/features/economy/types'

describe('ContractsDrawer Component', () => {
  const sampleContract: ProjectContract = {
    id: 'contract_test_drawer_1',
    title: 'Calculadora de Matrizes em C',
    description: 'Resolver sistemas lineares com eliminação de Gauss.',
    durationMinutes: 15,
    baseReward: 22,
    stakeAmount: 10,
    baseXp: 40,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Departamento de Matemática',
    riskLevel: 'low',
    netProfit: 12,
  }

  beforeEach(() => {
    useGameStore.getState().resetToDefaults()
    useGameStore.setState({
      profile: {
        ...useGameStore.getState().profile,
        devCoins: 50,
      },
      availableContracts: [sampleContract],
      activeProject: null,
    })
  })

  it('does not render drawer content when isOpen is false', () => {
    render(<ContractsDrawer isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByTestId('contracts-drawer')).not.toBeInTheDocument()
    expect(screen.queryByTestId('contracts-drawer-backdrop')).not.toBeInTheDocument()
  })

  it('renders modal dialog, backdrop, title, and player balance when isOpen is true', () => {
    render(<ContractsDrawer isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: /Mercado de Contratos e Staking/i })).toBeInTheDocument()
    expect(screen.getByTestId('contracts-drawer')).toBeInTheDocument()
    expect(screen.getByTestId('contracts-drawer-backdrop')).toBeInTheDocument()
    expect(screen.getByText('Mercado de Contratos')).toBeInTheDocument()
    expect(screen.getByTestId('drawer-player-balance')).toHaveTextContent('50 DevCoins')
  })

  it('calls onClose when clicking close button or backdrop', () => {
    const handleClose = vi.fn()
    render(<ContractsDrawer isOpen={true} onClose={handleClose} />)

    const closeBtn = screen.getByTestId('btn-close-contracts-drawer')
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)

    // Backdrop click
    const backdrop = screen.getByTestId('contracts-drawer-backdrop')
    fireEvent.click(backdrop)
    expect(handleClose).toHaveBeenCalledTimes(2)
  })

  it('closes on Escape key press', () => {
    const handleClose = vi.fn()
    render(<ContractsDrawer isOpen={true} onClose={handleClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('confirms contract staking, deducts player coins, and triggers onConfirmContract callback', () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()

    render(
      <ContractsDrawer
        isOpen={true}
        onClose={handleClose}
        onConfirmContract={handleConfirm}
      />
    )

    expect(useGameStore.getState().profile.devCoins).toBe(50)
    expect(useGameStore.getState().activeProject).toBeNull()

    const selectBtn = screen.getByTestId('btn-select-contract-contract_test_drawer_1')
    fireEvent.click(selectBtn)

    // Player coins should be deducted by stakeAmount (50 - 10 = 40)
    expect(useGameStore.getState().profile.devCoins).toBe(40)

    // Active project should be set
    expect(useGameStore.getState().activeProject).toEqual(
      expect.objectContaining({
        contractId: 'contract_test_drawer_1',
        title: 'Calculadora de Matrizes em C',
        durationMinutes: 15,
        stakedAmount: 10,
      })
    )

    // Confirm and close callbacks should be triggered
    expect(handleConfirm).toHaveBeenCalledWith(sampleContract)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('shows active project banner when a project is currently underway', () => {
    useGameStore.setState({
      activeProject: {
        contractId: 'existing_proj',
        title: 'Trabalho de AED',
        durationMinutes: 25,
        stakedAmount: 15,
        baseReward: 35,
        baseXp: 65,
        isFreeTier: false,
        startedAt: new Date().toISOString(),
      },
    })

    render(<ContractsDrawer isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByTestId('drawer-active-project-notice')).toBeInTheDocument()
    expect(screen.getByText(/Tens um projeto ativo: “Trabalho de AED”/i)).toBeInTheDocument()
  })
})
