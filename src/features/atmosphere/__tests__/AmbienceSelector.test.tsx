import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AmbienceSelector } from '../AmbienceSelector'
import { useGameStore } from '@/features/state'

describe('AmbienceSelector Component', () => {
  beforeEach(() => {
    useGameStore.getState().resetToDefaults()
  })

  it('renders all selectable ambience buttons with accessible labels', () => {
    render(<AmbienceSelector />)

    expect(screen.getByRole('button', { name: /Modo Automático/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sempre Noite Aconchegante/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sempre Pôr do Sol/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sempre Dia/i })).toBeInTheDocument()
  })

  it('indicates the active mode with aria-pressed attribute', () => {
    useGameStore.getState().setLightingMode('night')
    render(<AmbienceSelector />)

    const nightBtn = screen.getByRole('button', { name: /Sempre Noite Aconchegante/i })
    expect(nightBtn).toHaveAttribute('aria-pressed', 'true')

    const dayBtn = screen.getByRole('button', { name: /Sempre Dia/i })
    expect(dayBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('changes lighting mode in store when clicked', () => {
    render(<AmbienceSelector />)

    const sunsetBtn = screen.getByRole('button', { name: /Sempre Pôr do Sol/i })
    fireEvent.click(sunsetBtn)

    expect(useGameStore.getState().settings.lightingMode).toBe('sunset')

    const nightBtn = screen.getByRole('button', { name: /Sempre Noite Aconchegante/i })
    fireEvent.click(nightBtn)

    expect(useGameStore.getState().settings.lightingMode).toBe('night')
  })

  it('complies with Apple HIG touch target guidelines (min-touch-target)', () => {
    render(<AmbienceSelector />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-touch-target')
    })
  })
})
