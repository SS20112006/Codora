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
})
