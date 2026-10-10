import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShopDrawer } from '../ShopDrawer'
import { useGameStore } from '@/features/state'

describe('ShopDrawer Component', () => {
  beforeEach(() => {
    useGameStore.getState().resetToDefaults()
  })

  it('renders modal dialog when isOpen is true with Apple HIG and accessibility attributes', () => {
    render(<ShopDrawer isOpen={true} onClose={vi.fn()} />)

    const drawer = screen.getByTestId('shop-drawer')
    expect(drawer).toBeInTheDocument()
    expect(drawer).toHaveAttribute('role', 'dialog')
    expect(drawer).toHaveAttribute('aria-modal', 'true')
    expect(drawer).toHaveAttribute('aria-label', expect.stringContaining('Loja'))
  })

  it('does not render when isOpen is false', () => {
    render(<ShopDrawer isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByTestId('shop-drawer')).not.toBeInTheDocument()
  })

  it('renders player balance and lists all shop items', () => {
    useGameStore.setState({
      profile: {
        ...useGameStore.getState().profile,
        devCoins: 200,
      },
    })

    render(<ShopDrawer isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByTestId('shop-player-balance')).toHaveTextContent('200 DevCoins')
    expect(screen.getByTestId('shop-card-headphones_studio_pro')).toBeInTheDocument()
    expect(screen.getByTestId('shop-card-monitor_second_vertical')).toBeInTheDocument()
    expect(screen.getByTestId('shop-card-mug_artisan_coffee')).toBeInTheDocument()
    expect(screen.getByTestId('shop-card-lamp_monitor_screenbar')).toBeInTheDocument()
  })

  it('disables buy button if player has insufficient DevCoins', () => {
    useGameStore.setState({
      profile: {
        ...useGameStore.getState().profile,
        devCoins: 50, // Mug costs 75, Headphones cost 150
      },
    })

    render(<ShopDrawer isOpen={true} onClose={vi.fn()} />)

    const buyHeadphonesBtn = screen.getByTestId('btn-buy-headphones_studio_pro')
    expect(buyHeadphonesBtn).toBeDisabled()
    expect(buyHeadphonesBtn).toHaveTextContent('Saldo Insuficiente')

    const buyMugBtn = screen.getByTestId('btn-buy-mug_artisan_coffee')
    expect(buyMugBtn).toBeDisabled()
  })

  it('purchases, unlocks, and equips item when user has sufficient coins', () => {
    useGameStore.setState({
      profile: {
        ...useGameStore.getState().profile,
        devCoins: 350,
      },
    })

    const onPurchaseSuccess = vi.fn()
    render(
      <ShopDrawer
        isOpen={true}
        onClose={vi.fn()}
        onPurchaseSuccess={onPurchaseSuccess}
      />
    )

    const buyHeadphonesBtn = screen.getByTestId('btn-buy-headphones_studio_pro')
    expect(buyHeadphonesBtn).not.toBeDisabled()

    fireEvent.click(buyHeadphonesBtn)

    const state = useGameStore.getState()
    // Headphones cost 150 -> 350 - 150 = 200
    expect(state.profile.devCoins).toBe(200)
    expect(state.inventory.ownedItemIds).toContain('headphones_studio_pro')
    expect(state.inventory.equipped.headphones).toBe('headphones_studio_pro')
    expect(onPurchaseSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'headphones_studio_pro' })
    )
  })

  it('allows unequipping and equipping an owned accessory', () => {
    useGameStore.setState({
      inventory: {
        ownedItemIds: ['headphones_studio_pro'],
        equipped: {
          headphones: 'headphones_studio_pro',
        },
      },
    })

    render(<ShopDrawer isOpen={true} onClose={vi.fn()} />)

    // Should show unequip button
    const unequipBtn = screen.getByTestId('btn-unequip-headphones_studio_pro')
    expect(unequipBtn).toBeInTheDocument()

    fireEvent.click(unequipBtn)

    expect(useGameStore.getState().inventory.equipped.headphones).toBeUndefined()

    // Now should show equip button
    const equipBtn = screen.getByTestId('btn-equip-headphones_studio_pro')
    expect(equipBtn).toBeInTheDocument()

    fireEvent.click(equipBtn)
    expect(useGameStore.getState().inventory.equipped.headphones).toBe('headphones_studio_pro')
  })

  it('filters items by category tab', () => {
    render(<ShopDrawer isOpen={true} onClose={vi.fn()} />)

    // Filter to Áudio
    const audioTab = screen.getByRole('tab', { name: 'Áudio' })
    fireEvent.click(audioTab)

    expect(screen.getByTestId('shop-card-headphones_studio_pro')).toBeInTheDocument()
    expect(screen.queryByTestId('shop-card-monitor_second_vertical')).not.toBeInTheDocument()
    expect(screen.queryByTestId('shop-card-mug_artisan_coffee')).not.toBeInTheDocument()

    // Filter to Hardware
    const hardwareTab = screen.getByRole('tab', { name: 'Hardware' })
    fireEvent.click(hardwareTab)
    expect(screen.getByTestId('shop-card-monitor_second_vertical')).toBeInTheDocument()
    expect(screen.queryByTestId('shop-card-headphones_studio_pro')).not.toBeInTheDocument()
  })

  it('calls onClose when close button or Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<ShopDrawer isOpen={true} onClose={onClose} />)

    fireEvent.click(screen.getByTestId('btn-close-shop-drawer'))
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
