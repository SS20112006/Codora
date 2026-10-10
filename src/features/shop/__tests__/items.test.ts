import { describe, it, expect } from 'vitest'
import {
  SHOP_ITEMS,
  getShopItemById,
  calculateEquippedMultipliers,
} from '../items'

describe('Shop Catalog and Multipliers', () => {
  it('contains all required items from acceptance criteria', () => {
    const itemIds = SHOP_ITEMS.map((item) => item.id)
    expect(itemIds).toContain('headphones_studio_pro')
    expect(itemIds).toContain('monitor_second_vertical')
    expect(itemIds).toContain('mug_artisan_coffee')
    expect(itemIds).toContain('lamp_monitor_screenbar')
  })

  it('correctly maps items to their respective inventory slots', () => {
    const headphones = getShopItemById('headphones_studio_pro')
    const monitor = getShopItemById('monitor_second_vertical')
    const mug = getShopItemById('mug_artisan_coffee')
    const lamp = getShopItemById('lamp_monitor_screenbar')

    expect(headphones?.slot).toBe('headphones')
    expect(monitor?.slot).toBe('secondMonitor')
    expect(mug?.slot).toBe('coffeeMug')
    expect(lamp?.slot).toBe('deskLamp')
  })

  it('calculates zero bonus when no items are equipped', () => {
    const multipliers = calculateEquippedMultipliers({})
    expect(multipliers.hardware).toBe(0)
    expect(multipliers.software).toBe(0)
    expect(multipliers.careerRole).toBe(0)
    expect(multipliers.streak).toBe(0)
  })

  it('aggregates multipliers from equipped accessories accurately', () => {
    const equipped = {
      headphones: 'headphones_studio_pro', // software +0.10
      secondMonitor: 'monitor_second_vertical', // hardware +0.20
      coffeeMug: 'mug_artisan_coffee', // hardware +0.05
      deskLamp: 'lamp_monitor_screenbar', // hardware +0.10
    }

    const multipliers = calculateEquippedMultipliers(equipped)
    expect(multipliers.software).toBe(0.1)
    expect(multipliers.hardware).toBe(0.35) // 0.20 + 0.05 + 0.10
  })

  it('safely handles unknown or empty equipped slots', () => {
    const equipped = {
      headphones: 'non_existent_item',
      secondMonitor: undefined,
    }

    const multipliers = calculateEquippedMultipliers(equipped)
    expect(multipliers.hardware).toBe(0)
    expect(multipliers.software).toBe(0)
  })
})
