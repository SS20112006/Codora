import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Store,
  Coins,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useGameStore } from '@/features/state'
import { useAudio } from '@/features/audio'
import { SHOP_ITEMS, calculateEquippedMultipliers } from './items'
import { ShopItemCard } from './ShopItemCard'
import type { ShopCategory, ShopDrawerProps, ShopItem } from './types'

export const ShopDrawer: React.FC<ShopDrawerProps> = ({
  isOpen,
  onClose,
  className = '',
  onPurchaseSuccess,
}) => {
  const playerCoins = useGameStore((state) => state.profile.devCoins)
  const inventory = useGameStore((state) => state.inventory)
  const purchaseItem = useGameStore((state) => state.purchaseItem)
  const equipItem = useGameStore((state) => state.equipItem)
  const unequipItem = useGameStore((state) => state.unequipItem)

  const { playSfx } = useAudio()
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('all')

  // Close on Escape key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handlePurchase = (item: ShopItem) => {
    const success = purchaseItem(item.id, item.price, item.slot)
    if (success) {
      playSfx('coin')
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.([15])
        }
      } catch {
        // Safe degrade on environments without vibration support
      }
      onPurchaseSuccess?.(item)
    }
  }

  const handleEquip = (item: ShopItem) => {
    const success = equipItem(item.slot, item.id)
    if (success) {
      playSfx('click')
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate?.([10])
        }
      } catch {
        // Safe degrade
      }
    }
  }

  const handleUnequip = (item: ShopItem) => {
    unequipItem(item.slot)
    playSfx('click')
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([10])
      }
    } catch {
      // Safe degrade
    }
  }

  const filteredItems =
    selectedCategory === 'all'
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === selectedCategory)

  const activeMultipliers = calculateEquippedMultipliers(inventory.equipped)
  const hasAnyBonus =
    activeMultipliers.hardware > 0 || activeMultipliers.software > 0

  const categories: Array<{ id: ShopCategory; label: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'audio', label: 'Áudio' },
    { id: 'desk', label: 'Secretária' },
    { id: 'lighting', label: 'Iluminação' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Translucent Backdrop */}
          <motion.div
            key="shop-backdrop"
            data-testid="shop-drawer-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
          />

          {/* Smooth Sliding Drawer with Glassmorphism */}
          <motion.aside
            key="shop-drawer"
            data-testid="shop-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Loja de Hardware e Acessórios"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed top-0 right-0 h-full w-full max-w-lg bg-codora-surface/95 backdrop-blur-2xl border-l border-codora-border shadow-2xl z-50 flex flex-col text-codora-text ${className}`}
          >
            {/* Header: Title, Balance & Close */}
            <div className="p-4 sm:p-6 border-b border-codora-border bg-codora-surface/90 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold typography-display leading-tight text-codora-text tracking-tight">
                      Loja de Setup & Acessórios
                    </h3>
                    <p className="text-xs typography-text text-codora-text-muted">
                      Equipa o teu quarto e avatar para desbloquear bónus passivos
                    </p>
                  </div>
                </div>

                {/* Close Button (Apple HIG 44x44px target) */}
                <button
                  type="button"
                  data-testid="btn-close-shop-drawer"
                  aria-label="Fechar loja de acessórios"
                  onClick={onClose}
                  className="min-touch-target p-2.5 rounded-xl text-codora-text-muted hover:text-codora-text hover:bg-white/5 border border-transparent hover:border-codora-border transition active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Balance & Active Multiplier Summary */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-codora-border/50 flex-wrap">
                <div
                  data-testid="shop-player-balance"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-codora-bg/70 border border-codora-border text-xs"
                >
                  <Coins className="w-3.5 h-3.5 text-codora-coin shrink-0" />
                  <span className="text-codora-text-muted">Saldo Atual:</span>
                  <strong className="text-codora-text font-bold">
                    {playerCoins} DevCoins
                  </strong>
                </div>

                {hasAnyBonus && (
                  <div
                    data-testid="shop-active-multipliers-badge"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {activeMultipliers.hardware > 0 &&
                        `+${Math.round(activeMultipliers.hardware * 100)}% ROI Hardware`}
                      {activeMultipliers.hardware > 0 &&
                        activeMultipliers.software > 0 &&
                        ' | '}
                      {activeMultipliers.software > 0 &&
                        `+${Math.round(activeMultipliers.software * 100)}% XP`}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Filter Pills */}
              <div
                role="tablist"
                aria-label="Categorias da Loja"
                className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar"
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`min-touch-target px-3 py-1 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 shadow-sm'
                          : 'bg-codora-bg/60 text-codora-text-muted hover:text-codora-text hover:bg-white/5 border border-codora-border'
                      }`}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scrollable Items List */}
            <div
              data-testid="shop-items-list"
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isOwned = inventory.ownedItemIds.includes(item.id)
                  const isEquipped = inventory.equipped[item.slot] === item.id
                  const canAfford = playerCoins >= item.price

                  return (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      isOwned={isOwned}
                      isEquipped={isEquipped}
                      canAfford={canAfford}
                      onPurchase={handlePurchase}
                      onEquip={handleEquip}
                      onUnequip={handleUnequip}
                    />
                  )
                })
              ) : (
                <div className="py-12 text-center text-codora-text-muted space-y-3">
                  <Sparkles className="w-8 h-8 text-sky-400/50 mx-auto" />
                  <p className="text-sm">Nenhum item encontrado nesta categoria.</p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
