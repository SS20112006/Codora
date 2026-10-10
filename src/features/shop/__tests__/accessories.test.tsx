import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  SecondMonitorAccessory,
  CoffeeMugAccessory,
  MonitorScreenBarAccessory,
  HeadphonesAccessory,
} from '../components/accessories'

describe('Equipped Accessories Components', () => {
  it('renders SecondMonitorAccessory with proper SVG structure and testid', () => {
    render(
      <svg>
        <SecondMonitorAccessory isFocusing={false} />
      </svg>
    )

    const monitor = screen.getByTestId('equipped-second-monitor')
    expect(monitor).toBeInTheDocument()
    expect(monitor).toHaveAttribute('aria-label', expect.stringContaining('Segundo Monitor'))
  })

  it('renders CoffeeMugAccessory with ceramic textures and steam', () => {
    render(
      <svg>
        <CoffeeMugAccessory isFocusing={true} />
      </svg>
    )

    const mug = screen.getByTestId('equipped-coffee-mug')
    expect(mug).toBeInTheDocument()
    expect(mug).toHaveAttribute('aria-label', expect.stringContaining('Caneca de Café'))
  })

  it('renders MonitorScreenBarAccessory with downlight illumination cone', () => {
    render(
      <svg>
        <MonitorScreenBarAccessory isFocusing={false} />
      </svg>
    )

    const screenbar = screen.getByTestId('equipped-screenbar-lamp')
    expect(screenbar).toBeInTheDocument()
    expect(screenbar).toHaveAttribute('aria-label', expect.stringContaining('ScreenBar'))
  })

  it('renders HeadphonesAccessory with stand and audio cable', () => {
    render(
      <svg>
        <HeadphonesAccessory />
      </svg>
    )

    const headphones = screen.getByTestId('equipped-headphones-accessory')
    expect(headphones).toBeInTheDocument()
    expect(headphones).toHaveAttribute('aria-label', expect.stringContaining('Headphones'))
  })
})
