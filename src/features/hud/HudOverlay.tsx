import React from 'react'
import { ProjectStatusCard } from './ProjectStatusCard'
import { PomodoroClockWidget } from './PomodoroClockWidget'
import type { HudOverlayProps } from './types'

export const HudOverlay: React.FC<HudOverlayProps> = ({
  pomodoro,
  activeProject,
  onOpenContracts,
  className = '',
}) => {
  return (
    <div
      data-testid="hud-overlay"
      aria-label="Interface HUD Flutuante"
      className={`w-full flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-4 pointer-events-auto transition-all ${className}`}
    >
      {/* Floating Project Status & Time Remaining Card */}
      <div className="w-full lg:w-80 shrink-0">
        <ProjectStatusCard
          activeProject={activeProject}
          status={pomodoro.status}
          mode={pomodoro.mode}
          timeLeft={pomodoro.timeLeft}
          duration={pomodoro.duration}
          formattedTime={pomodoro.formattedTime}
          onOpenContracts={onOpenContracts}
        />
      </div>

      {/* Floating Pomodoro Clock & Controls Widget */}
      <div className="flex-1 max-w-xl mx-auto w-full">
        <PomodoroClockWidget pomodoro={pomodoro} />
      </div>
    </div>
  )
}

export default HudOverlay
