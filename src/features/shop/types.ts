import type { EconomyMultipliers } from '@/features/economy/types'
import type { InventorySlot } from '@/features/state/types'

export type ShopCategory = 'all' | 'hardware' | 'audio' | 'desk' | 'lighting'

export interface ShopItem {
  id: string
  name: string
  category: Exclude<ShopCategory, 'all'>
  slot: InventorySlot
  price: number
  description: string
  benefit: string
  multipliers: Partial<EconomyMultipliers>
  tag?: string
}

export interface ShopDrawerProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  onPurchaseSuccess?: (item: ShopItem) => void
}

export interface ShopItemCardProps {
  item: ShopItem
  isOwned: boolean
  isEquipped: boolean
  canAfford: boolean
  onPurchase: (item: ShopItem) => void
  onEquip: (item: ShopItem) => void
  onUnequip: (item: ShopItem) => void
  className?: string
}
