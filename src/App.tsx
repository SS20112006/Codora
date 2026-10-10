import React, { useEffect, useState } from 'react'
import { usePomodoro } from './features/timer'
import { useGameStore } from './features/state'
import { Stage1DormRoom, type Stage1RoomSlots } from './features/room'
import { useAtmosphere } from './features/atmosphere'
import { TopHudBar, HudOverlay } from './features/hud'
import { ContractsDrawer } from './features/contracts'
import { AudioMixerModal, useAudio } from './features/audio'
import {
  ShopDrawer,
  SecondMonitorAccessory,
  CoffeeMugAccessory,
  MonitorScreenBarAccessory,
  HeadphonesAccessory,
  calculateEquippedMultipliers,
} from './features/shop'
import { calculateProjectReward } from './features/economy'

export const App: React.FC = () => {
  const profile = useGameStore((state) => state.profile)
  const inventory = useGameStore((state) => state.inventory)
  const activeProject = useGameStore((state) => state.activeProject)
  const completeActiveProject = useGameStore((state) => state.completeActiveProject)
  const hydrate = useGameStore((state) => state.hydrate)

  const [isContractsDrawerOpen, setIsContractsDrawerOpen] = useState(false)
  const [isAudioMixerOpen, setIsAudioMixerOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const { playSfx } = useAudio()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const { effectiveAmbience } = useAtmosphere()
  const pomodoro = usePomodoro()
  const isFocusing = pomodoro.status === 'running'

  // Trigger gentle pomodoro chime alarm and reward resolution when a session completes
  useEffect(() => {
    if (pomodoro.status === 'completed') {
      playSfx('alarm')

      // Resolve and payout active project with passive gear multipliers applied
      if (activeProject) {
        const equippedMultipliers = calculateEquippedMultipliers(inventory.equipped)
        const payout = calculateProjectReward({
          contract: {
            id: activeProject.contractId,
            title: activeProject.title,
            durationMinutes: activeProject.durationMinutes,
            stakeAmount: activeProject.stakedAmount,
            baseReward: activeProject.baseReward,
            baseXp: activeProject.baseXp,
            isFreeTier: activeProject.isFreeTier,
            description: '',
          },
          multipliers: equippedMultipliers,
        })
        completeActiveProject(payout)
      }
    }
  }, [
    pomodoro.status,
    playSfx,
    activeProject,
    inventory.equipped,
    completeActiveProject,
  ])

  // Construct modular scene slots based on equipped accessories
  const sceneSlots: Stage1RoomSlots = {
    headphones: inventory.equipped.headphones ? (
      <HeadphonesAccessory />
    ) : undefined,
    secondMonitor: inventory.equipped.secondMonitor ? (
      <SecondMonitorAccessory isFocusing={isFocusing} />
    ) : undefined,
    coffeeMug: inventory.equipped.coffeeMug ? (
      <CoffeeMugAccessory isFocusing={isFocusing} />
    ) : undefined,
    deskLamp: inventory.equipped.deskLamp ? (
      <MonitorScreenBarAccessory isFocusing={isFocusing} />
    ) : undefined,
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-codora-bg text-codora-text font-sans relative select-none selection:bg-amber-500/20 selection:text-amber-300">
      {/* 1. Fullscreen Game Viewport (The Room Scene with Equipped Accessories) */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-codora-bg">
        <Stage1DormRoom
          isFocusing={isFocusing}
          ambience={effectiveAmbience}
          slots={sceneSlots}
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
            } else if (id === 'audio') {
              setIsAudioMixerOpen(true)
            } else if (id === 'shop') {
              setIsShopOpen(true)
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
          playSfx('coin')
          pomodoro.startSessionWithDuration(contract.durationMinutes)
        }}
      />

      {/* 5. In-Game Audio Mixer Modal */}
      <AudioMixerModal
        isOpen={isAudioMixerOpen}
        onClose={() => setIsAudioMixerOpen(false)}
      />

      {/* 6. In-Game Hardware & Setup Upgrade Shop Drawer */}
      <ShopDrawer
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />
    </div>
  )
}

export default App
