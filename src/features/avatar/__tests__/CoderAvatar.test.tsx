import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoderAvatar } from '../CoderAvatar'

describe('CoderAvatar Modular Component', () => {
  it('renders avatar container in SVG with accessibility labels and 2D profile outfit', () => {
    render(
      <svg>
        <CoderAvatar />
      </svg>
    )

    const avatar = screen.getByTestId('coder-avatar')
    expect(avatar).toBeInTheDocument()
    expect(screen.getByTestId('avatar-hoodie')).toBeInTheDocument()
    expect(screen.getByTestId('avatar-sweatpants')).toBeInTheDocument()
    expect(screen.getByTestId('avatar-footwear')).toBeInTheDocument()
    expect(screen.getByTestId('avatar-head')).toBeInTheDocument()
  })

  it('renders typing fast animation state when state is coding or isFocusing is true', () => {
    const { rerender } = render(
      <svg>
        <CoderAvatar state="coding" />
      </svg>
    )

    const avatarCoding = screen.getByTestId('coder-avatar')
    expect(avatarCoding).toHaveAttribute('data-avatar-state', 'coding')
    expect(screen.getByTestId('avatar-arms-typing')).toBeInTheDocument()

    rerender(
      <svg>
        <CoderAvatar isFocusing={true} />
      </svg>
    )

    const avatarFocusing = screen.getByTestId('coder-avatar')
    expect(avatarFocusing).toHaveAttribute('data-avatar-state', 'coding')
    expect(screen.getByTestId('avatar-arms-typing')).toBeInTheDocument()
  })

  it('renders resting / relaxed animation state when state is resting or isFocusing is false', () => {
    const { rerender } = render(
      <svg>
        <CoderAvatar state="resting" />
      </svg>
    )

    const avatarResting = screen.getByTestId('coder-avatar')
    expect(avatarResting).toHaveAttribute('data-avatar-state', 'resting')
    expect(screen.getByTestId('avatar-arms-resting')).toBeInTheDocument()

    rerender(
      <svg>
        <CoderAvatar isFocusing={false} />
      </svg>
    )

    const avatarPaused = screen.getByTestId('coder-avatar')
    expect(avatarPaused).toHaveAttribute('data-avatar-state', 'resting')
    expect(screen.getByTestId('avatar-arms-resting')).toBeInTheDocument()
  })

  it('supports modular accessories for head and body, and preset headphones', () => {
    render(
      <svg>
        <CoderAvatar
          hasHeadphones={true}
          accessories={{
            head: <circle data-testid="custom-head-gear" />,
            body: <rect data-testid="custom-badge" />,
            custom: <path data-testid="custom-charm" />,
          }}
        />
      </svg>
    )

    expect(screen.getByTestId('avatar-headphones')).toBeInTheDocument()
    expect(screen.getByTestId('custom-head-gear')).toBeInTheDocument()
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    expect(screen.getByTestId('custom-charm')).toBeInTheDocument()
  })

  it('renders different footwear styles: slides with socks, sneakers, and crocs', () => {
    const { rerender } = render(
      <svg>
        <CoderAvatar footwear="slides_with_socks" />
      </svg>
    )

    expect(screen.getByTestId('avatar-footwear-slides-socks')).toBeInTheDocument()

    rerender(
      <svg>
        <CoderAvatar footwear="sneakers" />
      </svg>
    )
    expect(screen.getByTestId('avatar-footwear-sneakers')).toBeInTheDocument()

    rerender(
      <svg>
        <CoderAvatar footwear="crocs" />
      </svg>
    )
    expect(screen.getByTestId('avatar-footwear-crocs')).toBeInTheDocument()
  })
})
