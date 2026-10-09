import React, { useEffect, useState } from 'react'
import { usePomodoro } from './features/timer'
import { useGameStore } from './features/state'
import { Stage1DormRoom } from './features/room'
import { useAtmosphere } from './features/atmosphere'
import { TopHudBar, HudOverlay } from './features/hud'
import { ContractsDrawer } from './features/contracts'

export const App: React.FC = () => {
  const profile = useGameStore((state) => state.profile)
  const activeProject = useGameStore((state) => state.activeProject)
  const hydrate = useGameStore((state) => state.hydrate)
  const [isContractsDrawerOpen, setIsContractsDrawerOpen] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const { effectiveAmbience } = useAtmosphere()
  const pomodoro = usePomodoro()

  return (
    <div className="min-h-screen bg-codora-bg text-codora-text font-sans flex flex-col selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navigation HUD Bar (Task 09: DevCoins, Level, XP bar, Streak, Shortcuts) */}
      <TopHudBar
        profile={profile}
        onShortcutClick={(id) => {
          if (id === 'contracts') {
            setIsContractsDrawerOpen(true)
          }
        }}
      />

      {/* Main Content / Stage & Floating HUD Controls */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6 justify-center">
        {/* Stage 1 Dorm Room 2D SVG Scene */}
        <section aria-label="Cenário do Quarto Universitário" className="w-full relative">
          <Stage1DormRoom
            isFocusing={pomodoro.status === 'running'}
            ambience={effectiveAmbience}
          />
        </section>

        {/* Floating Minimalist HUD Overlay (Task 09: Project Status Card & Pomodoro Clock Widget) */}
        <section aria-label="Controlos HUD e Pomodoro" className="w-full">
          <HudOverlay
            pomodoro={pomodoro}
            activeProject={activeProject}
            onOpenContracts={() => setIsContractsDrawerOpen(true)}
          />
        </section>
      </main>

      {/* Translucent Contracts Selection & Staking Drawer (Task 10) */}
      <ContractsDrawer
        isOpen={isContractsDrawerOpen}
        onClose={() => setIsContractsDrawerOpen(false)}
        onConfirmContract={(contract) => {
          pomodoro.startSessionWithDuration(contract.durationMinutes)
        }}
      />

      {/* Footer */}
      <footer className="border-t border-codora-border px-6 py-4 text-center text-xs text-codora-text-muted typography-text">
        <p>Codora — React 19 + TypeScript + Vite + Tailwind CSS + Vitest</p>
      </footer>
    </div>
  )
}

export default App

