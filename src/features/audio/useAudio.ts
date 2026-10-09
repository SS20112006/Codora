import { useEffect, useCallback } from 'react'
import { useGameStore } from '@/features/state'
import { audioEngine } from './audioEngine'
import type { SoundEffectType, LoFiTrackId } from './types'

export function useAudio() {
  const audioSettings = useGameStore((state) => state.settings.audio)
  const updateAudioSettings = useGameStore((state) => state.updateAudioSettings)

  // Sync state changes with the AudioEngine
  useEffect(() => {
    audioEngine.setMasterVolume(audioSettings.masterVolume)
    audioEngine.setMasterMuted(audioSettings.isMuted)

    audioEngine.setMusicVolume(audioSettings.musicVolume)
    audioEngine.setMusicMuted(Boolean(audioSettings.musicMuted))

    audioEngine.setAmbientVolume(audioSettings.ambientVolume)
    audioEngine.setAmbientMuted(Boolean(audioSettings.ambientMuted))

    audioEngine.setSfxVolume(audioSettings.sfxVolume)
    audioEngine.setSfxMuted(Boolean(audioSettings.sfxMuted))

    if (audioSettings.ambient) {
      if (audioSettings.ambient.rainVolume !== undefined) {
        audioEngine.setRainVolume(audioSettings.ambient.rainVolume)
      }
      if (audioSettings.ambient.rainMuted !== undefined) {
        audioEngine.setRainMuted(audioSettings.ambient.rainMuted)
      }
      if (audioSettings.ambient.rainActive !== undefined) {
        audioEngine.setRainActive(audioSettings.ambient.rainActive)
      }

      if (audioSettings.ambient.keyboardVolume !== undefined) {
        audioEngine.setKeyboardVolume(audioSettings.ambient.keyboardVolume)
      }
      if (audioSettings.ambient.keyboardMuted !== undefined) {
        audioEngine.setKeyboardMuted(audioSettings.ambient.keyboardMuted)
      }
      if (audioSettings.ambient.keyboardActive !== undefined) {
        audioEngine.setKeyboardActive(audioSettings.ambient.keyboardActive)
      }

      if (audioSettings.ambient.cafeVolume !== undefined) {
        audioEngine.setCafeVolume(audioSettings.ambient.cafeVolume)
      }
      if (audioSettings.ambient.cafeMuted !== undefined) {
        audioEngine.setCafeMuted(audioSettings.ambient.cafeMuted)
      }
      if (audioSettings.ambient.cafeActive !== undefined) {
        audioEngine.setCafeActive(audioSettings.ambient.cafeActive)
      }
    }

    if (audioSettings.musicTrack) {
      audioEngine.setTrack(audioSettings.musicTrack)
    }

    if (audioSettings.isMusicPlaying) {
      audioEngine.startMusic(audioSettings.musicTrack)
    } else {
      audioEngine.pauseMusic()
    }
  }, [audioSettings])

  const playSfx = useCallback((type: SoundEffectType) => {
    audioEngine.playSfx(type)
  }, [])

  const setMasterVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ masterVolume: volume })
    },
    [updateAudioSettings]
  )

  const toggleMasterMute = useCallback(() => {
    updateAudioSettings({ isMuted: !audioSettings.isMuted })
  }, [audioSettings.isMuted, updateAudioSettings])

  const setMusicVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ musicVolume: volume })
    },
    [updateAudioSettings]
  )

  const toggleMusicMute = useCallback(() => {
    updateAudioSettings({ musicMuted: !audioSettings.musicMuted })
  }, [audioSettings.musicMuted, updateAudioSettings])

  const toggleMusic = useCallback(() => {
    const nextPlaying = !audioSettings.isMusicPlaying
    updateAudioSettings({ isMusicPlaying: nextPlaying })
  }, [audioSettings.isMusicPlaying, updateAudioSettings])

  const setMusicTrack = useCallback(
    (track: LoFiTrackId) => {
      updateAudioSettings({ musicTrack: track })
    },
    [updateAudioSettings]
  )

  const setAmbientVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ ambientVolume: volume })
    },
    [updateAudioSettings]
  )

  const toggleAmbientMute = useCallback(() => {
    updateAudioSettings({ ambientMuted: !audioSettings.ambientMuted })
  }, [audioSettings.ambientMuted, updateAudioSettings])

  const setSfxVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ sfxVolume: volume })
    },
    [updateAudioSettings]
  )

  const toggleSfxMute = useCallback(() => {
    updateAudioSettings({ sfxMuted: !audioSettings.sfxMuted })
  }, [audioSettings.sfxMuted, updateAudioSettings])

  // Granular Ambient Toggles & Volumes
  const toggleRain = useCallback(() => {
    const active = !audioSettings.ambient?.rainActive
    updateAudioSettings({ ambient: { rainActive: active } })
  }, [audioSettings.ambient?.rainActive, updateAudioSettings])

  const setRainVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ ambient: { rainVolume: volume } })
    },
    [updateAudioSettings]
  )

  const toggleRainMute = useCallback(() => {
    const muted = !audioSettings.ambient?.rainMuted
    updateAudioSettings({ ambient: { rainMuted: muted } })
  }, [audioSettings.ambient?.rainMuted, updateAudioSettings])

  const toggleKeyboard = useCallback(() => {
    const active = !audioSettings.ambient?.keyboardActive
    updateAudioSettings({ ambient: { keyboardActive: active } })
  }, [audioSettings.ambient?.keyboardActive, updateAudioSettings])

  const setKeyboardVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ ambient: { keyboardVolume: volume } })
    },
    [updateAudioSettings]
  )

  const toggleKeyboardMute = useCallback(() => {
    const muted = !audioSettings.ambient?.keyboardMuted
    updateAudioSettings({ ambient: { keyboardMuted: muted } })
  }, [audioSettings.ambient?.keyboardMuted, updateAudioSettings])

  const toggleCafe = useCallback(() => {
    const active = !audioSettings.ambient?.cafeActive
    updateAudioSettings({ ambient: { cafeActive: active } })
  }, [audioSettings.ambient?.cafeActive, updateAudioSettings])

  const setCafeVolume = useCallback(
    (volume: number) => {
      updateAudioSettings({ ambient: { cafeVolume: volume } })
    },
    [updateAudioSettings]
  )

  const toggleCafeMute = useCallback(() => {
    const muted = !audioSettings.ambient?.cafeMuted
    updateAudioSettings({ ambient: { cafeMuted: muted } })
  }, [audioSettings.ambient?.cafeMuted, updateAudioSettings])

  return {
    audioSettings,
    playSfx,
    setMasterVolume,
    toggleMasterMute,
    setMusicVolume,
    toggleMusicMute,
    toggleMusic,
    setMusicTrack,
    setAmbientVolume,
    toggleAmbientMute,
    setSfxVolume,
    toggleSfxMute,
    // Ambient channel controls
    toggleRain,
    setRainVolume,
    toggleRainMute,
    toggleKeyboard,
    setKeyboardVolume,
    toggleKeyboardMute,
    toggleCafe,
    setCafeVolume,
    toggleCafeMute,
  }
}
