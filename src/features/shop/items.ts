import type { EconomyMultipliers } from '@/features/economy/types'
import type { InventorySlot } from '@/features/state/types'
import type { ShopItem } from './types'

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'headphones_studio_pro',
    name: 'Headphones Estúdio Pro',
    category: 'audio',
    slot: 'headphones',
    price: 150,
    description:
      'Auscultadores circum-aurais de monitorização de estúdio com cancelamento passivo de ruído e acabamento premium. Visíveis no avatar.',
    benefit: '+10% Bónus de Foco & XP',
    multipliers: {
      software: 0.1,
    },
    tag: 'Áudio Pro',
  },
  {
    id: 'monitor_second_vertical',
    name: '2º Monitor Vertical 4K',
    category: 'hardware',
    slot: 'secondMonitor',
    price: 300,
    description:
      'Painel IPS pivot vertical com suporte articulado de precisão para debugger, terminal e documentação. Visível na secretária.',
    benefit: '+20% Bónus de Hardware (ROI)',
    multipliers: {
      hardware: 0.2,
    },
    tag: 'Produtividade',
  },
  {
    id: 'mug_artisan_coffee',
    name: 'Caneca de Café Artesanal',
    category: 'desk',
    slot: 'coffeeMug',
    price: 75,
    description:
      'Caneca de cerâmica vidrada de alta retenção térmica com expresso encorpado para sprints intensos de código. Visível na mesa.',
    benefit: '+5% Bónus de Produtividade',
    multipliers: {
      hardware: 0.05,
    },
    tag: 'Essencial',
  },
  {
    id: 'lamp_monitor_screenbar',
    name: 'Lâmpada de Monitor (ScreenBar)',
    category: 'lighting',
    slot: 'deskLamp',
    price: 200,
    description:
      'Barra de iluminação assimétrica LED anti-reflexo montada no monitor para conforto visual noturno e nitidez total.',
    benefit: '+10% Bónus de Hardware (ROI)',
    multipliers: {
      hardware: 0.1,
    },
    tag: 'Ergonomia',
  },
]

export const SHOP_ITEMS_BY_ID = new Map<string, ShopItem>(
  SHOP_ITEMS.map((item) => [item.id, item])
)

export function getShopItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS_BY_ID.get(id)
}

/**
 * Calculates aggregated passive bonuses from all equipped accessories.
 */
export function calculateEquippedMultipliers(
  equipped: Partial<Record<InventorySlot, string>>
): EconomyMultipliers {
  let hardware = 0
  let software = 0
  let careerRole = 0
  let streak = 0

  for (const [, itemId] of Object.entries(equipped)) {
    if (!itemId) continue
    const item = SHOP_ITEMS_BY_ID.get(itemId)
    if (!item) continue

    if (item.multipliers.hardware) hardware += item.multipliers.hardware
    if (item.multipliers.software) software += item.multipliers.software
    if (item.multipliers.careerRole) careerRole += item.multipliers.careerRole
    if (item.multipliers.streak) streak += item.multipliers.streak
  }

  return {
    hardware: Number(hardware.toFixed(3)),
    software: Number(software.toFixed(3)),
    careerRole: Number(careerRole.toFixed(3)),
    streak: Number(streak.toFixed(3)),
  }
}
