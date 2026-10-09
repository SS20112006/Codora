import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContractCard } from '../ContractCard'
import type { ProjectContract } from '@/features/economy/types'

describe('ContractCard Component', () => {
  const sampleContract: ProjectContract = {
    id: 'test_aed_tree',
    title: 'Árvores Binárias de AED',
    description: 'Implementar rotações AVL e travessia em largura.',
    durationMinutes: 25,
    baseReward: 35,
    stakeAmount: 15,
    baseXp: 65,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Prof. Alberto (AED)',
    riskLevel: 'low',
    netProfit: 20,
    roiPercentage: 133,
  }

  const freeContract: ProjectContract = {
    id: 'test_free_typo',
    title: 'Correção de Typo Open-Source',
    description: 'Corrigir documentação no README.',
    durationMinutes: 15,
    baseReward: 8,
    stakeAmount: 0,
    baseXp: 30,
    isFreeTier: true,
    stage: 'stage_1_university',
    category: 'open_source',
    client: 'Comunidade Open Source',
    riskLevel: 'low',
    netProfit: 8,
  }

  it('renders contract title, description, duration, stake cost, estimated profit and XP', () => {
    const handleSelect = vi.fn()
    render(
      <ContractCard
        contract={sampleContract}
        playerCoins={50}
        onSelectContract={handleSelect}
      />
    )

    // Title and Client
    expect(screen.getByRole('heading', { name: 'Árvores Binárias de AED' })).toBeInTheDocument()
    expect(screen.getByText('Prof. Alberto (AED)')).toBeInTheDocument()
    expect(screen.getByText('Implementar rotações AVL e travessia em largura.')).toBeInTheDocument()

    // Duration (25 min)
    expect(screen.getByTestId('contract-duration')).toHaveTextContent('25 min')

    // Stake Cost (15 DevCoins)
    expect(screen.getByTestId('contract-stake')).toHaveTextContent('15 DevCoins')

    // Estimated Profit (+20 DevCoins)
    expect(screen.getByTestId('contract-profit')).toHaveTextContent('+20 DevCoins')

    // XP (+65 XP)
    expect(screen.getByTestId('contract-xp')).toHaveTextContent('+65 XP')

    // Action button
    const btn = screen.getByTestId('btn-select-contract-test_aed_tree')
    expect(btn).toBeInTheDocument()
    expect(btn).not.toBeDisabled()

    fireEvent.click(btn)
    expect(handleSelect).toHaveBeenCalledWith(sampleContract)
  })

  it('renders free tier badge and zero stake for free contracts', () => {
    const handleSelect = vi.fn()
    render(
      <ContractCard
        contract={freeContract}
        playerCoins={0}
        onSelectContract={handleSelect}
      />
    )

    expect(screen.getByText('Grátis')).toBeInTheDocument()
    expect(screen.getByTestId('contract-stake')).toHaveTextContent('Grátis (0)')
    expect(screen.getByText(/Iniciar Projeto Grátis \(15m\)/i)).toBeInTheDocument()

    const btn = screen.getByTestId('btn-select-contract-test_free_typo')
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(handleSelect).toHaveBeenCalledWith(freeContract)
  })

  it('disables action button and warns if player has insufficient coins for staking', () => {
    const handleSelect = vi.fn()
    render(
      <ContractCard
        contract={sampleContract}
        playerCoins={10} // Needs 15
        onSelectContract={handleSelect}
      />
    )

    expect(screen.getByTestId('insufficient-funds-warning')).toBeInTheDocument()
    expect(
      screen.getByText(/Saldo insuficiente \(10\/15 DevCoins necessários\)/i)
    ).toBeInTheDocument()

    const btn = screen.getByTestId('btn-select-contract-test_aed_tree')
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('shows warning when player already has an ongoing active project', () => {
    render(
      <ContractCard
        contract={sampleContract}
        playerCoins={100}
        hasActiveProject={true}
        onSelectContract={vi.fn()}
      />
    )

    expect(
      screen.getByText(/Atenção: Substituirá o projeto atualmente em progresso/i)
    ).toBeInTheDocument()
  })
})
