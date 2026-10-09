import type { ReactNode } from 'react'
import type { UsePomodoroReturn } from '@/features/timer'
import type { ActiveProjectState, PlayerProfile } from '@/features/state/types'

export type HudShortcutId = 'contracts' | 'shop' | 'achievements' | 'audio' | 'settings'

export interface HudShortcutItem {
  id: HudShortcutId | string
  label: string
  icon: ReactNode
  badge?: string | number
  onClick?: () => void
  disabled?: boolean
}

export interface TopHudBarProps {
  profile: PlayerProfile
  onShortcutClick?: (id: HudShortcutId | string) => void
  className?: string
}

export interface PomodoroClockWidgetProps {
  pomodoro: UsePomodoroReturn
  className?: string
  variant?: 'floating' | 'docked'
}

export interface ProjectStatusCardProps {
  activeProject: ActiveProjectState | null
  status: UsePomodoroReturn['status']
  mode: UsePomodoroReturn['mode']
  timeLeft: number
  duration: number
  formattedTime: string
  onOpenContracts?: () => void
  className?: string
}

export interface HudOverlayProps {
  pomodoro: UsePomodoroReturn
  activeProject: ActiveProjectState | null
  onOpenContracts?: () => void
  className?: string
}

