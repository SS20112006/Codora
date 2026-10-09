import React, { useEffect } from 'react'
import {
  Coins,
  Zap,
  Users,
  Timer,
  Terminal,
  CheckCircle2,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Flame,
  Coffee,
  XCircle,
} from 'lucide-react'
import { usePomodoro } from './features/timer'
import { useGameStore } from './features/state'
import type { CareerRole, CareerStage } from './features/economy'

export const App: React.FC = () => {
  const profile = useGameStore((state) => state.profile)
  const hydrate = useGameStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const devCoins = profile.devCoins
  const devXp = profile.totalXp
  const activeUsers = profile.activeUsers

  const getRoleLabel = (role: CareerRole) => {
    switch (role) {
      case 'student':
        return 'Estudante'
      case 'intern':
        return 'Estagiário'
      case 'junior':
        return 'Júnior'
      case 'mid_level':
        return 'Pleno'
      case 'senior':
        return 'Sénior'
      case 'tech_lead':
        return 'Tech Lead'
      case 'indie_founder':
        return 'Indie Founder'
    }
  }

  const getStageLabel = (stage: CareerStage) => {
    switch (stage) {
      case 'stage_1_university':
        return 'Fase 1: Quarto Universitário'
      case 'stage_2_junior':
        return 'Fase 2: Home Office Júnior'
      case 'stage_3_coworking':
        return 'Fase 3: Escritório Co-working'
      case 'stage_4_penthouse':
        return 'Fase 4: Penthouse Tech'
    }
  }

  const {
    status,
    mode,
    timeLeft,
    duration,
    formattedTime,
    formattedEmergencyTime,
    isHardcore,
    canPause,
    canEmergencyPause,
    canResume,
    sessionsCompleted,
    start,
    pause,
    resume,
    startEmergencyPause,
    resumeFromEmergency,
    reset,
    abandon,
    setHardcore,
    setMode,
  } = usePomodoro()

  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return 'Foco (Sprint)'
      case 'short_break':
        return 'Pausa Curta'
      case 'long_break':
        return 'Pausa Longa'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'idle':
        return 'Pronto para arrancar'
      case 'running':
        return 'A decorrer (Sprint Ativo)'
      case 'paused':
        return 'Em Pausa'
      case 'emergency_pause':
        return 'Pausa de Emergência Ativa'
      case 'completed':
        return 'Sessão Concluída!'
      case 'failed':
        return 'Sessão Falhada'
    }
  }

  const progressPercent =
    duration > 0 ? Math.round(((duration - timeLeft) / duration) * 100) : 0

  return (
    <div className="min-h-screen bg-codora-bg text-codora-text font-sans flex flex-col selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navigation / HUD Bar */}
      <header className="border-b border-codora-border bg-codora-surface/80 backdrop-blur-md px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-violet-500/20 to-emerald-500/20 border border-codora-border flex items-center justify-center">
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold typography-display leading-tight text-codora-text tracking-tight">
                Codora
              </h1>
              <p className="text-xs typography-text text-codora-text-muted">
                {getStageLabel(profile.stage)}
              </p>
            </div>
          </div>

          {/* Currency / Stats Indicators */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3.5 py-1.5 rounded-lg text-sm">
              <Coins className="w-4 h-4 text-codora-coin" />
              <span className="font-semibold text-codora-text">{devCoins}</span>
              <span className="text-xs text-codora-text-muted">DevCoins</span>
            </div>

            <div className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3.5 py-1.5 rounded-lg text-sm">
              <Zap className="w-4 h-4 text-codora-xp" />
              <span className="font-semibold text-codora-text">{devXp}</span>
              <span className="text-xs text-codora-text-muted">XP ({getRoleLabel(profile.role)})</span>
            </div>

            <div className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3.5 py-1.5 rounded-lg text-sm">
              <Users className="w-4 h-4 text-codora-users" />
              <span className="font-semibold text-codora-text">{activeUsers}</span>
              <span className="text-xs text-codora-text-muted">Users</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content / Stage Placeholder */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6 justify-center">
        <section className="bg-codora-surface/60 border border-codora-border rounded-2xl p-8 backdrop-blur-sm text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dedicated Web Worker Pomodoro Engine Ativo</span>
            </div>

            <h2 className="text-3xl font-extrabold typography-display text-codora-text">
              O Simulador de Carreira Alimentado por Foco
            </h2>

            <p className="typography-text text-codora-text-muted text-base leading-relaxed max-w-xl">
              Transforma o teu tempo de estudo e programação em progressão real:
              investe DevCoins, corre Pomodoros no quarto de dormitório e evolui até à tua Penthouse.
            </p>

            {/* Timer HUD Display */}
            <div className="my-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-codora-bg/80 border border-codora-border text-amber-400">
                  {getModeLabel()}
                </span>
                <span className="text-xs text-codora-text-muted">
                  Sessões concluídas: <strong className="text-codora-text">{sessionsCompleted}</strong>
                </span>
              </div>

              {/* Huge Timer Digits */}
              <div className="text-6xl font-black typography-display tracking-tight text-codora-text font-mono mt-1">
                {formattedTime}
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-codora-bg/80 border border-codora-border rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Emergency Pause Countdown Warning */}
              {status === 'emergency_pause' && (
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pausa de Emergência: <strong>{formattedEmergencyTime}</strong> restantes!</span>
                </div>
              )}

              {/* Failed Notice */}
              {status === 'failed' && (
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>Sessão cancelada ou expirada. Podes recomeçar a qualquer momento.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
              {status === 'idle' || status === 'completed' || status === 'failed' ? (
                <button
                  type="button"
                  onClick={start}
                  className="min-touch-target px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Iniciar Sprint Gratuito (25m)</span>
                </button>
              ) : null}

              {status === 'running' && canPause && (
                <button
                  type="button"
                  onClick={pause}
                  className="min-touch-target px-5 py-2.5 rounded-xl bg-codora-bg border border-codora-border text-codora-text font-semibold flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pausar Sessão</span>
                </button>
              )}

              {status === 'paused' && canResume && (
                <button
                  type="button"
                  onClick={resume}
                  className="min-touch-target px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Retomar Foco</span>
                </button>
              )}

              {status === 'running' && canEmergencyPause && (
                <button
                  type="button"
                  onClick={startEmergencyPause}
                  className="min-touch-target px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold flex items-center justify-center gap-2 hover:bg-amber-500/20 active:scale-95 transition cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pausa de Emergência (3m)</span>
                </button>
              )}

              {status === 'emergency_pause' && (
                <button
                  type="button"
                  onClick={resumeFromEmergency}
                  className="min-touch-target px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Retomar da Emergência</span>
                </button>
              )}

              {(status === 'running' || status === 'paused' || status === 'emergency_pause') && (
                <button
                  type="button"
                  onClick={abandon}
                  className="min-touch-target px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Desistir</span>
                </button>
              )}

              {status !== 'idle' && (
                <button
                  type="button"
                  onClick={reset}
                  className="min-touch-target px-4 py-2.5 rounded-xl bg-codora-bg border border-codora-border text-codora-text-muted hover:text-codora-text font-medium flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar</span>
                </button>
              )}
            </div>

            {/* Mode & Hardcore Switch Controls */}
            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap text-xs typography-text">
              <button
                type="button"
                onClick={() => setHardcore(!isHardcore)}
                className={`min-touch-target px-3.5 py-1.5 rounded-lg border flex items-center gap-2 transition cursor-pointer ${
                  isHardcore
                    ? 'bg-red-500/20 border-red-500/40 text-red-300 font-bold'
                    : 'bg-codora-bg border-codora-border text-codora-text-muted hover:text-codora-text'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isHardcore ? 'text-red-400' : 'text-slate-400'}`} />
                <span>Modo Hardcore: {isHardcore ? 'ATIVADO' : 'Desativado'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('short_break')}
                className="min-touch-target px-3 py-1.5 rounded-lg bg-codora-bg border border-codora-border text-codora-text-muted hover:text-codora-text flex items-center gap-1.5 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pausa Curta (5m)</span>
              </button>
            </div>

            {/* Quick Status Pill */}
            <div className="mt-4 flex items-center gap-2 text-xs typography-text text-codora-text-muted bg-codora-bg/80 border border-codora-border px-4 py-2 rounded-xl">
              <Timer className="w-4 h-4 text-orange-400" />
              <span>
                Status do Cronómetro: <strong className="text-codora-text">{getStatusLabel()}</strong>
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-codora-border px-6 py-4 text-center text-xs text-codora-text-muted typography-text">
        <p>Codora — React 19 + TypeScript + Vite + Tailwind CSS + Vitest</p>
      </footer>
    </div>
  )
}

export default App
