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
    <div className="w-screen h-screen overflow-hidden bg-codora-bg text-codora-text font-sans relative select-none selection:bg-amber-500/20 selection:text-amber-300">
      {/* 1. Fullscreen Game Viewport (The Room Scene) */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-codora-bg">
        <Stage1DormRoom
          isFocusing={pomodoro.status === 'running'}
          ambience={effectiveAmbience}
          className="w-full h-full"
        />
      </div>

      {/* 2. In-Game Top HUD Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-auto">
        <TopHudBar
          profile={profile}
          onShortcutClick={(id) => {
            if (id === 'contracts') {
              setIsContractsDrawerOpen(true)
            }
          }}
        />
      </div>

      {/* 3. In-Game Bottom Floating HUD Controls & Pomodoro Clock Overlay */}
      <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-6 z-20 pointer-events-none flex justify-center">
        <div className="w-full max-w-7xl mx-auto pointer-events-auto">
          <HudOverlay
            pomodoro={pomodoro}
            activeProject={activeProject}
            onOpenContracts={() => setIsContractsDrawerOpen(true)}
          />
        </div>
      </div>

      {/* 4. Sliding In-Game Drawers & Overlays (Contracts, Shop, etc.) */}
      <ContractsDrawer
        isOpen={isContractsDrawerOpen}
        onClose={() => setIsContractsDrawerOpen(false)}
        onConfirmContract={(contract) => {
          pomodoro.startSessionWithDuration(contract.durationMinutes)
        }}
      />
    </div>
  )
}

export default App

