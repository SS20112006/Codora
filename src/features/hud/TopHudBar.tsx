import React from 'react'
import {
  Coins,
  Zap,
  Users,
  Flame,
  Terminal,
  Briefcase,
  Store,
  Trophy,
  Volume2,
  Settings,
} from 'lucide-react'
import { getLevelProgress } from '@/features/economy/levels'
import { AmbienceSelector } from '@/features/atmosphere'
import { getRoleLabel, getStageLabel } from './utils'
import type { TopHudBarProps, HudShortcutItem } from './types'

export const TopHudBar: React.FC<TopHudBarProps> = ({
  profile,
  onShortcutClick,
  className = '',
}) => {
  const xpProgress = getLevelProgress(profile.totalXp)

  const shortcuts: HudShortcutItem[] = [
    {
      id: 'contracts',
      label: 'Projetos',
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'shop',
      label: 'Loja',
      icon: <Store className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'achievements',
      label: 'Conquistas',
      icon: <Trophy className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'audio',
      label: 'Áudio',
      icon: <Volume2 className="w-4 h-4 text-violet-400" />,
    },
    {
      id: 'settings',
      label: 'Definições',
      icon: <Settings className="w-4 h-4 text-slate-300" />,
    },
  ]

  return (
    <header
      role="banner"
      aria-label="Barra Superior HUD"
      className={`border-b border-codora-border bg-codora-surface/85 backdrop-blur-md px-4 sm:px-6 py-2.5 sticky top-0 z-50 transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        {/* Brand & Stage Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-violet-500/20 to-emerald-500/20 border border-codora-border flex items-center justify-center shrink-0">
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

        {/* Ambience & Lighting Mode Selector */}
        <div className="order-3 md:order-2 flex items-center">
          <AmbienceSelector />
        </div>

        {/* Currency, Level, XP & Streak Stats */}
        <div className="order-2 md:order-3 flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* DevCoins Balance */}
          <div
            data-testid="hud-devcoins"
            className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3 py-1.5 rounded-lg text-sm"
          >
            <Coins className="w-4 h-4 text-codora-coin shrink-0" />
            <span className="font-semibold text-codora-text">{profile.devCoins}</span>
            <span className="text-xs text-codora-text-muted">DevCoins</span>
          </div>

          {/* Level & XP Progress Bar */}
          <div
            data-testid="hud-level-xp"
            className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3 py-1.5 rounded-lg text-sm"
          >
            <span
              data-testid="hud-level-badge"
              className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-bold text-xs border border-violet-500/30 shrink-0"
            >
              Nível {xpProgress.level}
            </span>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1 text-codora-text font-medium">
                  <Zap className="w-3 h-3 text-codora-xp shrink-0" />
                  <span className="font-semibold text-codora-text">{profile.totalXp}</span>
                  <span className="text-codora-text-muted">XP ({getRoleLabel(profile.role)})</span>
                </span>
                <span className="text-[10px] text-codora-text-muted">
                  {xpProgress.progressPercentage}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Progresso de XP para o próximo nível"
                aria-valuenow={xpProgress.progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-24 sm:w-28 h-1.5 bg-codora-surface border border-codora-border/60 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-300"
                  style={{ width: `${xpProgress.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Days */}
          <div
            data-testid="hud-streak"
            className="flex items-center gap-1.5 bg-codora-bg/60 border border-codora-border px-3 py-1.5 rounded-lg text-sm text-orange-400"
            title={`${profile.streakDays} dias de streak consecutivo`}
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20 shrink-0" />
            <span className="font-bold text-codora-text">{profile.streakDays}</span>
            <span className="text-xs text-codora-text-muted">
              {profile.streakDays === 1 ? 'dia' : 'dias'}
            </span>
          </div>

          {/* Active Users */}
          <div
            data-testid="hud-users"
            className="flex items-center gap-2 bg-codora-bg/60 border border-codora-border px-3 py-1.5 rounded-lg text-sm"
          >
            <Users className="w-4 h-4 text-codora-users shrink-0" />
            <span className="font-semibold text-codora-text">{profile.activeUsers}</span>
            <span className="text-xs text-codora-text-muted">Users</span>
          </div>

          {/* Shortcut Navigation Icons */}
          <nav
            aria-label="Atalhos Rápidos"
            className="flex items-center gap-1 pl-1 border-l border-codora-border/80"
          >
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut.id}
                type="button"
                aria-label={shortcut.label}
                title={shortcut.label}
                onClick={() => onShortcutClick?.(shortcut.id)}
                className="min-touch-target p-2 rounded-lg text-codora-text-muted hover:text-codora-text hover:bg-white/5 border border-transparent hover:border-codora-border transition active:scale-95 flex items-center justify-center cursor-pointer"
              >
                {shortcut.icon}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default TopHudBar
