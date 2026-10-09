import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Core Component', () => {
  it('renders header, title, and career phase', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Codora', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Fase 1: Quarto Universitário')).toBeInTheDocument()
  })

  it('renders the core currencies: DevCoins, XP and Users', () => {
    render(<App />)
    expect(screen.getByText('DevCoins')).toBeInTheDocument()
    expect(screen.getByText('XP (Estudante)')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('toggles sprint button state when clicked', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /Iniciar Sprint Gratuito/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByText(/Pronto para arrancar/i)).toBeInTheDocument()

    fireEvent.click(button)

    expect(screen.getByRole('button', { name: /Pausar Sessão/i })).toBeInTheDocument()
    expect(screen.getByText(/Sprint Ativo/i)).toBeInTheDocument()
  })

  it('renders timer countdown and handles emergency pause', () => {
    render(<App />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Foco (Sprint)')).toBeInTheDocument()

    // Start sprint
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sprint Gratuito/i }))

    // Emergency pause button should now be available
    const emergencyBtn = screen.getByRole('button', { name: /Pausa de Emergência/i })
    expect(emergencyBtn).toBeInTheDocument()

    fireEvent.click(emergencyBtn)
    expect(screen.getByText(/Pausa de Emergência:.*restantes!/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Retomar da Emergência/i })).toBeInTheDocument()
  })

  it('toggles hardcore mode', () => {
    render(<App />)
    const hardcoreBtn = screen.getByRole('button', { name: /Modo Hardcore: Desativado/i })
    expect(hardcoreBtn).toBeInTheDocument()

    fireEvent.click(hardcoreBtn)
    expect(screen.getByRole('button', { name: /Modo Hardcore: ATIVADO/i })).toBeInTheDocument()
  })
})
