import React from 'react'
import {
  Clock,
  Coins,
  Zap,
  TrendingUp,
  AlertCircle,
  Building,
  ShieldCheck,
} from 'lucide-react'
import type { ContractCardProps } from './types'

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  playerCoins,
  hasActiveProject = false,
  onSelectContract,
  disabled = false,
  className = '',
}) => {
  const isAffordable = playerCoins >= contract.stakeAmount
  const netProfit =
    contract.netProfit !== undefined
      ? contract.netProfit
      : contract.baseReward - contract.stakeAmount

  const getRiskBadge = () => {
    switch (contract.riskLevel) {
      case 'low':
        return {
          label: 'Risco Baixo',
          className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        }
      case 'medium':
        return {
          label: 'Risco Moderado',
          className: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        }
      case 'high':
        return {
          label: 'Alto Risco',
          className: 'bg-red-500/10 border-red-500/30 text-red-400',
        }
      default:
        return {
          label: 'Risco Padrão',
          className: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
        }
    }
  }

  const riskBadge = getRiskBadge()
  const canStart = isAffordable && !disabled

  return (
    <article
      data-testid={`contract-card-${contract.id}`}
      aria-label={`Contrato: ${contract.title}`}
      className={`rounded-2xl border border-codora-border bg-codora-surface/80 hover:bg-codora-surface hover:border-codora-border/80 transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-md backdrop-blur-md relative overflow-hidden group ${className}`}
    >
      {/* Top Header: Client & Risk Tag */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-codora-text-muted font-medium">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[180px]">{contract.client}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {contract.isFreeTier && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                Grátis
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${riskBadge.className}`}
            >
              {riskBadge.label}
            </span>
          </div>
        </div>

        {/* Contract Title */}
        <h4 className="text-base sm:text-lg font-bold typography-display text-codora-text tracking-tight group-hover:text-amber-400 transition-colors">
          {contract.title}
        </h4>

        {/* Description */}
        <p className="mt-1 text-xs typography-text text-codora-text-muted leading-relaxed line-clamp-2">
          {contract.description}
        </p>
      </div>

      {/* Metrics Grid: Duration, Stake Cost, Estimated Profit & XP */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-codora-border/60 text-xs">
        {/* Duration in Minutes */}
        <div
          data-testid="contract-duration"
          className="flex items-center gap-2 p-2 rounded-xl bg-codora-bg/60 border border-codora-border/70"
        >
          <Clock className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-codora-text-muted uppercase tracking-wider font-semibold">
              Duração
            </span>
            <span className="font-bold text-codora-text">
              {contract.durationMinutes} min
            </span>
          </div>
        </div>

        {/* Stake Entry Cost */}
        <div
          data-testid="contract-stake"
          className={`flex items-center gap-2 p-2 rounded-xl border ${
            contract.stakeAmount > 0
              ? 'bg-amber-500/5 border-amber-500/30'
              : 'bg-emerald-500/5 border-emerald-500/30'
          }`}
        >
          <Coins
            className={`w-4 h-4 shrink-0 ${
              contract.stakeAmount > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-codora-text-muted uppercase tracking-wider font-semibold">
              Entrada / Stake
            </span>
            <span
              className={`font-bold ${
                contract.stakeAmount > 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {contract.stakeAmount > 0 ? `${contract.stakeAmount} DevCoins` : 'Grátis (0)'}
            </span>
          </div>
        </div>

        {/* Estimated Profit */}
        <div
          data-testid="contract-profit"
          className="flex items-center gap-2 p-2 rounded-xl bg-codora-bg/60 border border-codora-border/70"
        >
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-codora-text-muted uppercase tracking-wider font-semibold">
              Lucro Estimado
            </span>
            <span className="font-bold text-emerald-400">
              +{netProfit} DevCoins
              {contract.roiPercentage !== undefined && contract.roiPercentage > 0 && (
                <span className="text-[10px] font-normal text-emerald-300 ml-1">
                  ({contract.roiPercentage}%)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* XP Reward */}
        <div
          data-testid="contract-xp"
          className="flex items-center gap-2 p-2 rounded-xl bg-codora-bg/60 border border-codora-border/70"
        >
          <Zap className="w-4 h-4 text-violet-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-codora-text-muted uppercase tracking-wider font-semibold">
              Experiência
            </span>
            <span className="font-bold text-violet-300">+{contract.baseXp} XP</span>
          </div>
        </div>
      </div>

      {/* Insufficient Funds Warning */}
      {!isAffordable && (
        <div
          data-testid="insufficient-funds-warning"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            Saldo insuficiente ({playerCoins}/{contract.stakeAmount} DevCoins necessários).
          </span>
        </div>
      )}

      {/* Action Button: Staking & Start Pomodoro */}
      <div className="pt-1">
        <button
          type="button"
          data-testid={`btn-select-contract-${contract.id}`}
          disabled={!canStart}
          onClick={() => onSelectContract(contract)}
          className={`min-touch-target w-full px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
            !canStart
              ? 'bg-codora-surface border border-codora-border text-codora-text-muted cursor-not-allowed opacity-50'
              : contract.stakeAmount > 0
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
          }`}
        >
          {contract.stakeAmount > 0 ? (
            <>
              <Coins className="w-4 h-4 fill-current shrink-0" />
              <span>Bloquear {contract.stakeAmount} e Iniciar Pomodoro</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Iniciar Projeto Grátis ({contract.durationMinutes}m)</span>
            </>
          )}
        </button>

        {hasActiveProject && canStart && (
          <p className="mt-1 text-[11px] text-center text-amber-400/80">
            Atenção: Substituirá o projeto atualmente em progresso.
          </p>
        )}
      </div>
    </article>
  )
}

export default ContractCard
