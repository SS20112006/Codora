import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stage1DormRoom } from '../Stage1DormRoom'

describe('Stage1DormRoom Scene Component', () => {
  it('renders the SVG container with proper accessibility attributes and viewBox', () => {
    render(<Stage1DormRoom />)
    const svg = screen.getByRole('img', { name: /Dormitório Universitário.*The Social Network/i })
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 960 540')
    expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')
  })

  it('renders all required scene elements per acceptance criteria', () => {
    render(<Stage1DormRoom />)

    // Window in the background
    expect(screen.getByTestId('dorm-window')).toBeInTheDocument()

    // Study desk
    expect(screen.getByTestId('dorm-desk')).toBeInTheDocument()

    // Initial starter laptop
    expect(screen.getByTestId('dorm-laptop')).toBeInTheDocument()

    // Exposed cables
    expect(screen.getByTestId('dorm-cables')).toBeInTheDocument()

    // Pizza box on the floor
    expect(screen.getByTestId('dorm-pizza-box')).toBeInTheDocument()

    // Soda can
    expect(screen.getByTestId('dorm-soda-can')).toBeInTheDocument()

    // Wall notes / algorithm scribbles
    expect(screen.getByTestId('dorm-wall-notes')).toBeInTheDocument()
  })

  it('renders the wall notes with iconic algorithms and sticky notes', () => {
    render(<Stage1DormRoom />)
    const wallNotes = screen.getByTestId('dorm-wall-notes')
    expect(wallNotes).toHaveTextContent(/FACEMASH|E_A|git commit/i)
  })

  it('supports future modular slots when provided', () => {
    render(
      <Stage1DormRoom
        slots={{
          avatar: <g data-testid="custom-avatar-mock" />,
          windowAmbience: <g data-testid="custom-window-ambience" />,
          secondMonitor: <g data-testid="custom-second-monitor" />,
          deskLamp: <g data-testid="custom-desk-lamp" />,
          coffeeMug: <g data-testid="custom-coffee-mug" />,
          headphones: <g data-testid="custom-headphones" />,
          wallDecor: <g data-testid="custom-poster" />,
          floorDecor: <g data-testid="custom-rug" />,
        }}
      />
    )

    expect(screen.getByTestId('custom-avatar-mock')).toBeInTheDocument()
    expect(screen.getByTestId('custom-window-ambience')).toBeInTheDocument()
    expect(screen.getByTestId('custom-second-monitor')).toBeInTheDocument()
    expect(screen.getByTestId('custom-desk-lamp')).toBeInTheDocument()
    expect(screen.getByTestId('custom-coffee-mug')).toBeInTheDocument()
    expect(screen.getByTestId('custom-headphones')).toBeInTheDocument()
    expect(screen.getByTestId('custom-poster')).toBeInTheDocument()
    expect(screen.getByTestId('custom-rug')).toBeInTheDocument()
  })

  it('renders active focus visual state when isFocusing is true', () => {
    const { rerender } = render(<Stage1DormRoom isFocusing={false} />)
    const laptopIdle = screen.getByTestId('dorm-laptop')
    expect(laptopIdle).not.toHaveClass('is-focusing')

    rerender(<Stage1DormRoom isFocusing={true} />)
    const laptopActive = screen.getByTestId('dorm-laptop')
    expect(laptopActive).toHaveClass('is-focusing')
  })

  it('renders default coder avatar and switches between typing and resting states', () => {
    const { rerender } = render(<Stage1DormRoom isFocusing={false} />)
    const avatar = screen.getByTestId('dorm-coder-avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('data-avatar-state', 'resting')

    rerender(<Stage1DormRoom isFocusing={true} />)
    expect(avatar).toHaveAttribute('data-avatar-state', 'coding')
  })

  it('renders desk lamp illuminated with warm light at night', () => {
    render(<Stage1DormRoom ambience="night" />)
    const lamp = screen.getByTestId('dorm-desk-lamp')
    expect(lamp).toBeInTheDocument()
    expect(lamp).toHaveAttribute('data-lamp-on', 'true')
  })

  it('turns off desk lamp during clear daylight', () => {
    render(<Stage1DormRoom ambience="day" />)
    const lamp = screen.getByTestId('dorm-desk-lamp')
    expect(lamp).toBeInTheDocument()
    expect(lamp).toHaveAttribute('data-lamp-on', 'false')
  })

  it('renders dynamic lighting atmospheric overlays corresponding to ambience', () => {
    const { rerender } = render(<Stage1DormRoom ambience="night" />)
    expect(screen.getByTestId('room-night-overlay')).toHaveAttribute('opacity', '0.18')
    expect(screen.getByTestId('room-sunset-overlay')).toHaveAttribute('opacity', '0')

    rerender(<Stage1DormRoom ambience="sunset" />)
    expect(screen.getByTestId('room-sunset-overlay')).toHaveAttribute('opacity', '0.08')
    expect(screen.getByTestId('room-sunset-beam')).toHaveAttribute('opacity', '0.8')

    rerender(<Stage1DormRoom ambience="day" />)
    expect(screen.getByTestId('room-day-overlay')).toHaveAttribute('opacity', '0.03')
    expect(screen.getByTestId('room-day-sunbeam')).toHaveAttribute('opacity', '0.75')
  })
})

