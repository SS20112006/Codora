import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  it('renders the Stage 1 college dorm room scene', () => {
    render(<App />)
    expect(
      screen.getByRole('img', { name: /Dormitório Universitário.*The Social Network/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('stage1-dorm-room')).toBeInTheDocument()
  })

  it('renders ambience controls in the HUD and switches room lighting mode', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: /Controlo de Iluminação e Ambiência/i })).toBeInTheDocument()

    const dayBtn = screen.getByRole('button', { name: /Sempre Dia/i })
    expect(dayBtn).toBeInTheDocument()

    fireEvent.click(dayBtn)

    // The desk lamp should now be turned off because it's daytime
    const lamp = screen.getByTestId('dorm-desk-lamp')
    expect(lamp).toHaveAttribute('data-lamp-on', 'false')

    // Click Siempre Noite Aconchegante
    const nightBtn = screen.getByRole('button', { name: /Sempre Noite Aconchegante/i })
    fireEvent.click(nightBtn)
    expect(lamp).toHaveAttribute('data-lamp-on', 'true')
  })

  it('opens contracts drawer via HUD shortcut and closes it', async () => {
    render(<App />)

    expect(screen.queryByTestId('contracts-drawer')).not.toBeInTheDocument()

    // Click "Projetos" shortcut on top hud bar
    const contractsShortcut = screen.getByRole('button', { name: 'Projetos' })
    fireEvent.click(contractsShortcut)

    expect(screen.getByTestId('contracts-drawer')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /Mercado de Contratos e Staking/i })).toBeInTheDocument()

    // Close drawer
    const closeBtn = screen.getByTestId('btn-close-contracts-drawer')
    fireEvent.click(closeBtn)
    await waitFor(() => {
      expect(screen.queryByTestId('contracts-drawer')).not.toBeInTheDocument()
    })
  })

  it('opens contracts drawer from status card and selects contract to start staking pomodoro', async () => {
    render(<App />)

    // Open drawer via status card button
    const openCardBtn = screen.getByTestId('btn-open-contracts-card')
    fireEvent.click(openCardBtn)

    expect(screen.getByTestId('contracts-drawer')).toBeInTheDocument()

    // Select the first free or available contract
    const selectButtons = screen.getAllByRole('button', {
      name: /(Bloquear .* e Iniciar Pomodoro|Iniciar Projeto Grátis)/i,
    })
    expect(selectButtons.length).toBeGreaterThan(0)

    fireEvent.click(selectButtons[0]!)

    // Drawer should close
    await waitFor(() => {
      expect(screen.queryByTestId('contracts-drawer')).not.toBeInTheDocument()
    })

    // Project should now be active
    expect(screen.getByText('Projeto Ativo')).toBeInTheDocument()
  })

  it('opens audio mixer modal via HUD shortcut and closes it', async () => {
    render(<App />)

    expect(screen.queryByTestId('audio-mixer-modal')).not.toBeInTheDocument()

    // Click "Áudio" shortcut on top hud bar
    const audioShortcut = screen.getByRole('button', { name: 'Áudio' })
    fireEvent.click(audioShortcut)

    expect(screen.getByTestId('audio-mixer-modal')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /Painel de Áudio e Misturador/i })).toBeInTheDocument()

    // Close mixer modal
    const closeBtn = screen.getByRole('button', { name: 'Fechar Misturador' })
    fireEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByTestId('audio-mixer-modal')).not.toBeInTheDocument()
    })
  })
})


