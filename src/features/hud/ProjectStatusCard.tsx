import React from 'react'
import {
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  XCircle,
  Coins,
  Zap,
} from 'lucide-react'
import type { ProjectStatusCardProps } from './types'

export const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  activeProject,
  status,
  mode,
  timeLeft,
  duration,
  formattedTime,
  onOpenContracts,
  className = '',
}) => {
  const progressPercent =
    duration > 0 ? Math.round(((duration - timeLeft) / duration) * 100) : 0

  const getStatusBadge = () => {
    switch (status) {
      case 'idle':
        return {
          label: 'Aguardar Início',
          color: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
          dot: 'bg-slate-400',
          icon: <PlayCircle className="w-3.5 h-3.5" />,
        }
      case 'running':
        return {
          label: 'Em Progresso',
          color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400 animate-pulse',
          icon: <PlayCircle className="w-3.5 h-3.5" />,
        }
      case 'paused':
        return {
          label: 'Pausado',
          color: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          icon: <PauseCircle className="w-3.5 h-3.5" />,
        }
      case 'emergency_pause':
        return {
          label: 'Pausa de Emergência',
          color: 'bg-orange-500/20 border-orange-500/40 text-orange-300 animate-pulse',
          dot: 'bg-orange-400 animate-ping',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
        }
      case 'completed':
        return {
          label: 'Concluído',
          color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        }
      case 'failed':
        return {
          label: 'Cancelado',
          color: 'bg-red-500/20 border-red-500/40 text-red-300',
          dot: 'bg-red-400',
          icon: <XCircle className="w-3.5 h-3.5" />,
        }
    }
  }

  const badge = getStatusBadge()

  const projectTitle = activeProject
    ? activeProject.title
    : mode === 'focus'
    ? 'Sprint de Foco Livre (Algoritmos & Estudo)'
    : mode === 'short_break'
    ? 'Pausa Curta Regenerativa'
    : 'Pausa Longa de Descanso'

  const remainingMinutes = Math.floor(timeLeft / 60)
  const remainingSeconds = timeLeft % 60
  const timeFeedbackText =
    timeLeft > 0
      ? `${remainingMinutes}m ${remainingSeconds}s restantes`
      : 'Tempo terminado!'

  return (
    <article
      data-testid="hud-project-status-card"
      aria-label="Indicador do Estado do Projeto"
      className={`rounded-2xl bg-codora-surface/85 border border-codora-border backdrop-blur-md p-4 shadow-lg text-codora-text transition-all ${className}`}
    >
      {/* Top row: Project category & status pill */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
        <div className="flex items-center gap-2 text-xs text-codora-text-muted">
          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">
            {activeProject ? 'Projeto Ativo' : 'Sessão em Curso'}
          </span>
          {activeProject?.isFreeTier && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              Free Tier
            </span>
          )}
        </div>

        {/* Status Pill */}
        <div
          data-testid="project-status-pill"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
        >
          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Project Title */}
      <div className="mb-3">
        <h3 className="text-base font-bold typography-display text-codora-text tracking-tight flex items-center gap-2">
          <span>{projectTitle}</span>
          {!activeProject && mode === 'focus' && (
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
          )}
        </h3>

        {/* Financials / Rewards preview if active project */}
        {activeProject ? (
          <div className="mt-1 flex items-center gap-3 text-xs text-codora-text-muted">
            <span className="flex items-center gap-1 text-codora-coin font-medium">
              <Coins className="w-3 h-3" />
              <span>+{activeProject.baseReward} DevCoins</span>
            </span>
            <span className="flex items-center gap-1 text-codora-xp font-medium">
              <Zap className="w-3 h-3" />
              <span>+{activeProject.baseXp} XP</span>
            </span>
            {activeProject.stakedAmount > 0 && (
              <span className="text-[11px] text-amber-400/80">
                (Staked: {activeProject.stakedAmount})
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Progress & Remaining Time Feedback */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-codora-text-muted">
          <span
            data-testid="time-remaining-feedback"
            className="flex items-center gap-1.5 font-medium text-codora-text"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeFeedbackText}</span>
            <span className="text-[11px] font-mono text-codora-text-muted">({formattedTime})</span>
          </span>
          <span className="font-semibold text-amber-400/90">{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div
          role="progressbar"
          aria-label="Progresso do tempo do projeto"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full h-2 bg-codora-bg border border-codora-border rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Open Contracts Market Action */}
      {onOpenContracts && (
        <div className="mt-3 pt-2 border-t border-codora-border/60">
          <button
            type="button"
            data-testid="btn-open-contracts-card"
            onClick={onOpenContracts}
            className="min-touch-target w-full px-3 py-2 rounded-xl text-xs font-semibold bg-codora-bg/80 hover:bg-amber-500/10 border border-codora-border hover:border-amber-500/30 text-codora-text-muted hover:text-amber-300 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeProject ? 'Trocar Contrato' : 'Selecionar Contrato & Staking'}</span>
          </button>
        </div>
      )}
    </article>
  )
}

export default ProjectStatusCard
