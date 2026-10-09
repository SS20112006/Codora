import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AudioMixerModal } from '../AudioMixerModal'
import { useGameStore } from '@/features/state'
import { audioEngine } from '../audioEngine'

describe('AudioMixerModal Component', () => {
  beforeEach(() => {
    useGameStore.getState().resetToDefaults()
    vi.restoreAllMocks()
  })

  it('does not render modal dialog when isOpen is false', () => {
    render(<AudioMixerModal isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog', { name: 'Painel de Áudio e Misturador' })).not.toBeInTheDocument()
  })

  it('renders modal dialog when isOpen is true with Apple HIG & accessibility attributes', () => {
    render(<AudioMixerModal isOpen={true} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: 'Painel de Áudio e Misturador' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    expect(screen.getByRole('heading', { name: 'Misturador de Áudio' })).toBeInTheDocument()
    expect(screen.getByTestId('mixer-channel-master')).toBeInTheDocument()
    expect(screen.getByTestId('mixer-channel-music')).toBeInTheDocument()
    expect(screen.getByTestId('mixer-channel-ambient')).toBeInTheDocument()
    expect(screen.getByTestId('mixer-channel-sfx')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<AudioMixerModal isOpen={true} onClose={onClose} />)

    const closeBtn = screen.getByRole('button', { name: 'Fechar Misturador' })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<AudioMixerModal isOpen={true} onClose={onClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('controls master volume and master mute', () => {
    render(<AudioMixerModal isOpen={true} onClose={vi.fn()} />)

    const masterSlider = screen.getByRole('slider', { name: 'Controlo de Volume Geral' })
    fireEvent.change(masterSlider, { target: { value: '0.4' } })
    expect(useGameStore.getState().settings.audio.masterVolume).toBe(0.4)

    const muteBtn = screen.getByRole('button', { name: 'Silenciar Tudo' })
    fireEvent.click(muteBtn)
    expect(useGameStore.getState().settings.audio.isMuted).toBe(true)

    const unmuteBtn = screen.getByRole('button', { name: 'Ativar Som Geral' })
    fireEvent.click(unmuteBtn)
    expect(useGameStore.getState().settings.audio.isMuted).toBe(false)
  })

  it('controls Lo-Fi music playback, track selection, and volume', () => {
    render(<AudioMixerModal isOpen={true} onClose={vi.fn()} />)

    // Play/Pause
    const playBtn = screen.getByRole('button', { name: 'Tocar Lo-Fi' })
    fireEvent.click(playBtn)
    expect(useGameStore.getState().settings.audio.isMusicPlaying).toBe(true)

    // Select track
    const trackBtn = screen.getByRole('button', { name: 'Foco Profundo' })
    fireEvent.click(trackBtn)
    expect(useGameStore.getState().settings.audio.musicTrack).toBe('deepFocus')

    // Music volume
    const musicSlider = screen.getByRole('slider', { name: 'Volume Música Lo-Fi' })
    fireEvent.change(musicSlider, { target: { value: '0.85' } })
    expect(useGameStore.getState().settings.audio.musicVolume).toBe(0.85)

    // Music mute
    const musicMuteBtn = screen.getByRole('button', { name: 'Silenciar Música' })
    fireEvent.click(musicMuteBtn)
    expect(useGameStore.getState().settings.audio.musicMuted).toBe(true)
  })

  it('controls ambient subchannels for rain, keyboard, and cafe', () => {
    render(<AudioMixerModal isOpen={true} onClose={vi.fn()} />)

    // Rain toggle and volume
    const rainToggle = screen.getByRole('button', { name: 'Ativar Chuva' })
    fireEvent.click(rainToggle)
    expect(useGameStore.getState().settings.audio.ambient?.rainActive).toBe(true)

    const rainSlider = screen.getByRole('slider', { name: 'Volume de Chuva' })
    fireEvent.change(rainSlider, { target: { value: '0.75' } })
    expect(useGameStore.getState().settings.audio.ambient?.rainVolume).toBe(0.75)

    // Keyboard toggle and mute
    const kbToggle = screen.getByRole('button', { name: 'Ativar Teclado' })
    fireEvent.click(kbToggle)
    expect(useGameStore.getState().settings.audio.ambient?.keyboardActive).toBe(true)

    const kbMute = screen.getByRole('button', { name: 'Mutar Teclado' })
    fireEvent.click(kbMute)
    expect(useGameStore.getState().settings.audio.ambient?.keyboardMuted).toBe(true)

    // Café toggle and volume
    const cafeToggle = screen.getByRole('button', { name: 'Ativar Café' })
    fireEvent.click(cafeToggle)
    expect(useGameStore.getState().settings.audio.ambient?.cafeActive).toBe(true)

    const cafeSlider = screen.getByRole('slider', { name: 'Volume de Café' })
    fireEvent.change(cafeSlider, { target: { value: '0.3' } })
    expect(useGameStore.getState().settings.audio.ambient?.cafeVolume).toBe(0.3)
  })

  it('triggers interactive SFX tests on button click', () => {
    const playSfxSpy = vi.spyOn(audioEngine, 'playSfx').mockImplementation(() => {})

    render(<AudioMixerModal isOpen={true} onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Testar Som de Moedas' }))
    expect(playSfxSpy).toHaveBeenCalledWith('coin')

    fireEvent.click(screen.getByRole('button', { name: 'Testar Som de Level Up' }))
    expect(playSfxSpy).toHaveBeenCalledWith('levelUp')

    fireEvent.click(screen.getByRole('button', { name: 'Testar Som de Clique' }))
    expect(playSfxSpy).toHaveBeenCalledWith('click')

    fireEvent.click(screen.getByRole('button', { name: 'Testar Som de Alarme' }))
    expect(playSfxSpy).toHaveBeenCalledWith('alarm')
  })
})
