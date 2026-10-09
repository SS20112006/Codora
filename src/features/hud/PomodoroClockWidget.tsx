import React from 'react'
import {
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Flame,
  Coffee,
  XCircle,
  Timer,
} from 'lucide-react'
import type { PomodoroClockWidgetProps } from './types'

export const PomodoroClockWidget: React.FC<PomodoroClockWidgetProps> = ({
  pomodoro,
  className = '',
  variant = 'floating',
}) => {
  const {
    status,
    mode,
    duration,
    timeLeft,
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
  } = pomodoro

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
    <div
      data-testid="hud-pomodoro-clock-widget"
      role="region"
      aria-label="Widget do Relógio Pomodoro"
      className={`rounded-2xl border border-codora-border bg-codora-surface/90 backdrop-blur-md p-6 text-center relative overflow-hidden shadow-2xl transition-all ${
        variant === 'floating' ? 'shadow-amber-500/5' : ''
      } ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Mode Tag & Completed Sessions */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span
            data-testid="pomodoro-mode-badge"
            className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-codora-bg/90 border border-codora-border text-amber-400"
          >
            {getModeLabel()}
          </span>
          <span className="text-xs text-codora-text-muted">
            Sessões concluídas: <strong className="text-codora-text">{sessionsCompleted}</strong>
          </span>
        </div>

        {/* Crisp Digital Time Display */}
        <div
          data-testid="pomodoro-digital-clock"
          className="text-6xl sm:text-7xl font-black typography-display tracking-tight text-codora-text font-mono select-none my-1 drop-shadow-sm"
        >
          {formattedTime}
        </div>

        {/* Visual Progress Bar */}
        <div
          role="progressbar"
          aria-label="Progresso da sessão atual"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-64 max-w-full h-2 bg-codora-bg/90 border border-codora-border rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Emergency Pause Active Warning Notification */}
        {status === 'emergency_pause' && (
          <div
            data-testid="emergency-pause-active-banner"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Pausa de Emergência: <strong>{formattedEmergencyTime}</strong> restantes!
            </span>
          </div>
        )}

        {/* Failed / Abandoned Notice */}
        {status === 'failed' && (
          <div
            data-testid="failed-session-banner"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Sessão cancelada ou expirada. Podes recomeçar a qualquer momento.</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
          {/* Start Button */}
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

          {/* Normal Pause Button */}
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

          {/* Normal Resume Button */}
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

          {/* Emergency Pause Button */}
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

          {/* Resume from Emergency Pause Button */}
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

          {/* Cancelar / Desistir Button */}
          {(status === 'running' || status === 'paused' || status === 'emergency_pause') && (
            <button
              type="button"
              aria-label="Cancelar ou desistir do sprint"
              onClick={abandon}
              className="min-touch-target px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          )}

          {/* Reset Button */}
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

        {/* Hardcore Mode & Break Controls */}
        <div className="mt-3 flex items-center justify-center gap-3 flex-wrap text-xs typography-text">
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

        {/* Quick Status Info Pill */}
        <div className="mt-2 flex items-center gap-2 text-xs typography-text text-codora-text-muted bg-codora-bg/80 border border-codora-border px-3.5 py-1.5 rounded-xl">
          <Timer className="w-3.5 h-3.5 text-orange-400" />
          <span>
            Status do Cronómetro: <strong className="text-codora-text">{getStatusLabel()}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PomodoroClockWidget
