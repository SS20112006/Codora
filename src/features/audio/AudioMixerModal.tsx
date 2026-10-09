import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Keyboard,
  Coffee,
  Music,
  Sparkles,
  Sliders,
  Coins,
  Zap,
  MousePointer,
  Bell,
} from 'lucide-react'
import { useAudio } from './useAudio'
import { LOFI_TRACKS, type AudioMixerModalProps, type LoFiTrackId } from './types'

export const AudioMixerModal: React.FC<AudioMixerModalProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const {
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
    toggleRain,
    setRainVolume,
    toggleRainMute,
    toggleKeyboard,
    setKeyboardVolume,
    toggleKeyboardMute,
    toggleCafe,
    setCafeVolume,
    toggleCafeMute,
  } = useAudio()

  // Close on Escape key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const currentTrackId: LoFiTrackId = audioSettings.musicTrack || 'chill'
  const currentTrackInfo = LOFI_TRACKS[currentTrackId]

  const ambient = {
    rainVolume: audioSettings.ambient?.rainVolume ?? 0.5,
    rainMuted: audioSettings.ambient?.rainMuted ?? false,
    rainActive: audioSettings.ambient?.rainActive ?? false,
    keyboardVolume: audioSettings.ambient?.keyboardVolume ?? 0.5,
    keyboardMuted: audioSettings.ambient?.keyboardMuted ?? false,
    keyboardActive: audioSettings.ambient?.keyboardActive ?? false,
    cafeVolume: audioSettings.ambient?.cafeVolume ?? 0.4,
    cafeMuted: audioSettings.ambient?.cafeMuted ?? false,
    cafeActive: audioSettings.ambient?.cafeActive ?? false,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 ${className}`}>
          {/* Translucent Backdrop */}
          <motion.div
            data-testid="audio-mixer-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Painel de Áudio e Misturador"
            data-testid="audio-mixer-modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-codora-surface/95 border border-codora-border/80 rounded-2xl shadow-2xl backdrop-blur-xl z-50 text-codora-text p-5 sm:p-7 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-codora-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold typography-display text-codora-text">
                    Misturador de Áudio
                  </h2>
                  <p className="text-xs sm:text-sm typography-text text-codora-text-muted">
                    Música Lo-Fi, sons ambientes e efeitos táteis para foco
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Fechar Misturador"
                onClick={onClose}
                className="min-touch-target p-2 rounded-xl text-codora-text-muted hover:text-codora-text hover:bg-white/5 border border-transparent hover:border-codora-border transition flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Master Channel Control */}
            <div
              data-testid="mixer-channel-master"
              className="bg-codora-bg/70 border border-codora-border rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {audioSettings.isMuted ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-amber-400" />
                  )}
                  <span className="font-semibold typography-text text-sm sm:text-base text-codora-text">
                    Volume Geral (Master)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-codora-text-muted">
                    {Math.round(audioSettings.masterVolume * 100)}%
                  </span>
                  <button
                    type="button"
                    aria-label={audioSettings.isMuted ? 'Ativar Som Geral' : 'Silenciar Tudo'}
                    onClick={toggleMasterMute}
                    className={`min-touch-target px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                      audioSettings.isMuted
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-white/5 border-codora-border text-codora-text hover:bg-white/10'
                    }`}
                  >
                    {audioSettings.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{audioSettings.isMuted ? 'Silenciado' : 'Mudo'}</span>
                  </button>
                </div>
              </div>

              <input
                type="range"
                aria-label="Controlo de Volume Geral"
                min="0"
                max="1"
                step="0.01"
                value={audioSettings.masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-codora-surface rounded-lg appearance-none"
              />
            </div>

            {/* 2. Lo-Fi Music Channel */}
            <div
              data-testid="mixer-channel-music"
              className="bg-codora-bg/70 border border-codora-border rounded-xl p-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold typography-text text-sm sm:text-base text-codora-text">
                      Música Lo-Fi Instrumental
                    </h3>
                    <p className="text-xs typography-text text-codora-text-muted">
                      {currentTrackInfo.title} • {currentTrackInfo.bpm} BPM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={audioSettings.isMusicPlaying ? 'Pausar Lo-Fi' : 'Tocar Lo-Fi'}
                    onClick={toggleMusic}
                    className={`min-touch-target px-4 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                      audioSettings.isMusicPlaying
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                        : 'bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30'
                    }`}
                  >
                    {audioSettings.isMusicPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Tocar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    aria-label={audioSettings.musicMuted ? 'Ativar Música' : 'Silenciar Música'}
                    onClick={toggleMusicMute}
                    className={`min-touch-target p-2 rounded-xl text-xs border transition flex items-center justify-center cursor-pointer ${
                      audioSettings.musicMuted
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-white/5 border-codora-border text-codora-text hover:bg-white/10'
                    }`}
                  >
                    {audioSettings.musicMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Track Selection Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {(Object.keys(LOFI_TRACKS) as LoFiTrackId[]).map((tId) => {
                  const track = LOFI_TRACKS[tId]
                  const isSelected = currentTrackId === tId
                  return (
                    <button
                      key={tId}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setMusicTrack(tId)}
                      className={`min-touch-target px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500/25 border-pink-500/60 text-pink-200'
                          : 'bg-codora-surface border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {track.title}
                    </button>
                  )
                })}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-codora-text-muted w-14 shrink-0">Volume</span>
                <input
                  type="range"
                  aria-label="Volume Música Lo-Fi"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioSettings.musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer h-1.5 bg-codora-surface rounded-lg appearance-none"
                />
                <span className="text-xs font-mono text-codora-text-muted w-10 text-right shrink-0">
                  {Math.round(audioSettings.musicVolume * 100)}%
                </span>
              </div>
            </div>

            {/* 3. Ambient Sounds Channel (Chuva, Teclado Mecânico, Café) */}
            <div
              data-testid="mixer-channel-ambient"
              className="bg-codora-bg/70 border border-codora-border rounded-xl p-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold typography-text text-sm sm:text-base text-codora-text">
                      Sons de Ambiente (Mixer Granular)
                    </h3>
                    <p className="text-xs typography-text text-codora-text-muted">
                      Camadas geradoras de imersão e concentração
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={audioSettings.ambientMuted ? 'Ativar Ambientes' : 'Silenciar Ambientes'}
                    onClick={toggleAmbientMute}
                    className={`min-touch-target p-2 rounded-xl text-xs border transition flex items-center justify-center cursor-pointer ${
                      audioSettings.ambientMuted
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-white/5 border-codora-border text-codora-text hover:bg-white/10'
                    }`}
                  >
                    {audioSettings.ambientMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Master Ambient Volume */}
              <div className="flex items-center gap-3 border-b border-codora-border/60 pb-3">
                <span className="text-xs text-codora-text-muted w-24 shrink-0">Volume Geral Amb.</span>
                <input
                  type="range"
                  aria-label="Volume Master de Ambientes"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioSettings.ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer h-1.5 bg-codora-surface rounded-lg appearance-none"
                />
                <span className="text-xs font-mono text-codora-text-muted w-10 text-right shrink-0">
                  {Math.round(audioSettings.ambientVolume * 100)}%
                </span>
              </div>

              {/* Granular Sub-Channels */}
              <div className="flex flex-col gap-3">
                {/* 3a. Chuva (Rain) */}
                <div
                  data-testid="ambient-subchannel-rain"
                  className="flex items-center justify-between gap-3 bg-codora-surface/60 p-2.5 rounded-lg border border-codora-border/70 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex items-center gap-2 sm:w-44 shrink-0">
                    <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-codora-text">Chuva na Janela</span>
                  </div>

                  <div className="flex items-center gap-2 grow w-full sm:w-auto">
                    <input
                      type="range"
                      aria-label="Volume de Chuva"
                      min="0"
                      max="1"
                      step="0.01"
                      value={ambient.rainVolume}
                      onChange={(e) => setRainVolume(parseFloat(e.target.value))}
                      className="grow accent-sky-400 cursor-pointer h-1.5 bg-codora-bg rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono text-codora-text-muted w-9 text-right shrink-0">
                      {Math.round(ambient.rainVolume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={ambient.rainActive ? 'Desativar Chuva' : 'Ativar Chuva'}
                      onClick={toggleRain}
                      className={`min-touch-target px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        ambient.rainActive
                          ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                          : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {ambient.rainActive ? 'Ligada' : 'Desligada'}
                    </button>
                    <button
                      type="button"
                      aria-label={ambient.rainMuted ? 'Desmutar Chuva' : 'Mutar Chuva'}
                      onClick={toggleRainMute}
                      className={`min-touch-target p-1.5 rounded-lg text-xs border transition flex items-center justify-center cursor-pointer ${
                        ambient.rainMuted
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {ambient.rainMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 3b. Teclado Mecânico (Mechanical Keyboard) */}
                <div
                  data-testid="ambient-subchannel-keyboard"
                  className="flex items-center justify-between gap-3 bg-codora-surface/60 p-2.5 rounded-lg border border-codora-border/70 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex items-center gap-2 sm:w-44 shrink-0">
                    <Keyboard className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-codora-text">Teclado Mecânico</span>
                  </div>

                  <div className="flex items-center gap-2 grow w-full sm:w-auto">
                    <input
                      type="range"
                      aria-label="Volume do Teclado Mecânico"
                      min="0"
                      max="1"
                      step="0.01"
                      value={ambient.keyboardVolume}
                      onChange={(e) => setKeyboardVolume(parseFloat(e.target.value))}
                      className="grow accent-emerald-400 cursor-pointer h-1.5 bg-codora-bg rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono text-codora-text-muted w-9 text-right shrink-0">
                      {Math.round(ambient.keyboardVolume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={ambient.keyboardActive ? 'Desativar Teclado' : 'Ativar Teclado'}
                      onClick={toggleKeyboard}
                      className={`min-touch-target px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        ambient.keyboardActive
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {ambient.keyboardActive ? 'Ligado' : 'Desligado'}
                    </button>
                    <button
                      type="button"
                      aria-label={ambient.keyboardMuted ? 'Desmutar Teclado' : 'Mutar Teclado'}
                      onClick={toggleKeyboardMute}
                      className={`min-touch-target p-1.5 rounded-lg text-xs border transition flex items-center justify-center cursor-pointer ${
                        ambient.keyboardMuted
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {ambient.keyboardMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 3c. Café (Coffee Shop) */}
                <div
                  data-testid="ambient-subchannel-cafe"
                  className="flex items-center justify-between gap-3 bg-codora-surface/60 p-2.5 rounded-lg border border-codora-border/70 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex items-center gap-2 sm:w-44 shrink-0">
                    <Coffee className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-codora-text">Café & Bistrô</span>
                  </div>

                  <div className="flex items-center gap-2 grow w-full sm:w-auto">
                    <input
                      type="range"
                      aria-label="Volume de Café"
                      min="0"
                      max="1"
                      step="0.01"
                      value={ambient.cafeVolume}
                      onChange={(e) => setCafeVolume(parseFloat(e.target.value))}
                      className="grow accent-amber-500 cursor-pointer h-1.5 bg-codora-bg rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono text-codora-text-muted w-9 text-right shrink-0">
                      {Math.round(ambient.cafeVolume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={ambient.cafeActive ? 'Desativar Café' : 'Ativar Café'}
                      onClick={toggleCafe}
                      className={`min-touch-target px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        ambient.cafeActive
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {ambient.cafeActive ? 'Ligado' : 'Desligado'}
                    </button>
                    <button
                      type="button"
                      aria-label={ambient.cafeMuted ? 'Desmutar Café' : 'Mutar Café'}
                      onClick={toggleCafeMute}
                      className={`min-touch-target p-1.5 rounded-lg text-xs border transition flex items-center justify-center cursor-pointer ${
                        ambient.cafeMuted
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                      }`}
                    >
                      {ambient.cafeMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Tactile Sound Effects (SFX) Channel */}
            <div
              data-testid="mixer-channel-sfx"
              className="bg-codora-bg/70 border border-codora-border rounded-xl p-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold typography-text text-sm sm:text-base text-codora-text">
                      Efeitos Sonoros Táteis (SFX)
                    </h3>
                    <p className="text-xs typography-text text-codora-text-muted">
                      Feedback auditivo de moedas, level up, cliques e alarme de pomodoro
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={audioSettings.sfxMuted ? 'Ativar SFX' : 'Silenciar SFX'}
                    onClick={toggleSfxMute}
                    className={`min-touch-target p-2 rounded-xl text-xs border transition flex items-center justify-center cursor-pointer ${
                      audioSettings.sfxMuted
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-white/5 border-codora-border text-codora-text hover:bg-white/10'
                    }`}
                  >
                    {audioSettings.sfxMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-codora-text-muted w-14 shrink-0">Volume</span>
                <input
                  type="range"
                  aria-label="Volume SFX"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioSettings.sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-codora-surface rounded-lg appearance-none"
                />
                <span className="text-xs font-mono text-codora-text-muted w-10 text-right shrink-0">
                  {Math.round(audioSettings.sfxVolume * 100)}%
                </span>
              </div>

              {/* SFX Interactive Preview Buttons */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-codora-text-muted font-medium">Testar Efeitos Táteis:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    aria-label="Testar Som de Moedas"
                    onClick={() => playSfx('coin')}
                    className="min-touch-target p-2.5 rounded-xl bg-codora-surface hover:bg-white/5 border border-codora-border/80 flex items-center justify-center gap-2 text-xs font-medium text-amber-300 transition active:scale-95 cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Moedas</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Testar Som de Level Up"
                    onClick={() => playSfx('levelUp')}
                    className="min-touch-target p-2.5 rounded-xl bg-codora-surface hover:bg-white/5 border border-codora-border/80 flex items-center justify-center gap-2 text-xs font-medium text-violet-300 transition active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>Level Up</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Testar Som de Clique"
                    onClick={() => playSfx('click')}
                    className="min-touch-target p-2.5 rounded-xl bg-codora-surface hover:bg-white/5 border border-codora-border/80 flex items-center justify-center gap-2 text-xs font-medium text-slate-300 transition active:scale-95 cursor-pointer"
                  >
                    <MousePointer className="w-4 h-4 text-slate-400" />
                    <span>Clique</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Testar Som de Alarme"
                    onClick={() => playSfx('alarm')}
                    className="min-touch-target p-2.5 rounded-xl bg-codora-surface hover:bg-white/5 border border-codora-border/80 flex items-center justify-center gap-2 text-xs font-medium text-sky-300 transition active:scale-95 cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-sky-400" />
                    <span>Alarme</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AudioMixerModal
