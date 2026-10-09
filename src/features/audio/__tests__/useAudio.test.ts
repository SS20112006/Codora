import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudio } from '../useAudio'
import { useGameStore } from '@/features/state'
import { audioEngine } from '../audioEngine'

describe('useAudio Hook', () => {
  beforeEach(() => {
    useGameStore.getState().resetToDefaults()
    vi.restoreAllMocks()
  })

  it('provides current audio settings from store', () => {
    const { result } = renderHook(() => useAudio())
    expect(result.current.audioSettings.masterVolume).toBe(0.8)
    expect(result.current.audioSettings.isMuted).toBe(false)
    expect(result.current.audioSettings.musicVolume).toBe(0.6)
  })

  it('updates master volume and mute state', () => {
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.setMasterVolume(0.3)
    })
    expect(useGameStore.getState().settings.audio.masterVolume).toBe(0.3)

    act(() => {
      result.current.toggleMasterMute()
    })
    expect(useGameStore.getState().settings.audio.isMuted).toBe(true)
  })

  it('controls music and tracks', () => {
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.setMusicTrack('midnight')
    })
    expect(useGameStore.getState().settings.audio.musicTrack).toBe('midnight')

    act(() => {
      result.current.toggleMusic()
    })
    expect(useGameStore.getState().settings.audio.isMusicPlaying).toBe(true)

    act(() => {
      result.current.toggleMusic()
    })
    expect(useGameStore.getState().settings.audio.isMusicPlaying).toBe(false)
  })

  it('controls ambient subchannels', () => {
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.toggleRain()
    })
    expect(useGameStore.getState().settings.audio.ambient?.rainActive).toBe(true)

    act(() => {
      result.current.setRainVolume(0.9)
    })
    expect(useGameStore.getState().settings.audio.ambient?.rainVolume).toBe(0.9)

    act(() => {
      result.current.toggleRainMute()
    })
    expect(useGameStore.getState().settings.audio.ambient?.rainMuted).toBe(true)

    act(() => {
      result.current.toggleKeyboard()
    })
    expect(useGameStore.getState().settings.audio.ambient?.keyboardActive).toBe(true)

    act(() => {
      result.current.toggleCafe()
    })
    expect(useGameStore.getState().settings.audio.ambient?.cafeActive).toBe(true)
  })

  it('delegates SFX playing to audioEngine', () => {
    const playSfxSpy = vi.spyOn(audioEngine, 'playSfx').mockImplementation(() => {})
    const { result } = renderHook(() => useAudio())

    act(() => {
      result.current.playSfx('coin')
    })
    expect(playSfxSpy).toHaveBeenCalledWith('coin')
  })
})
