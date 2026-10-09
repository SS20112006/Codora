import { create } from 'zustand'
import { calculateLevelFromXp, getCareerRole, getCareerStage } from '@/features/economy/levels'
import type {
  ProjectCancellationResult,
  ProjectCompletionResult,
  ProjectContract,
} from '@/features/economy/types'
import type { TimerConfig } from '@/features/timer/types'
import {
  CURRENT_GAME_STATE_VERSION,
  createInitialGameState,
  type ActiveProjectState,
  type AudioSettings,
  type GameSettings,
  type GameState,
  type Inventory,
  type InventorySlot,
  type PlayerProfile,
  type PlayerStats,
  type WindowLightingMode,
} from './types'
import type { GameRepository } from './storage/types'
import { LocalFirstRepository } from './storage/localFirstRepository'
import { exportSaveToJson, importSaveFromJson } from './storage/serialization'

export interface GameStoreState {
  version: number
  profile: PlayerProfile
  inventory: Inventory
  settings: GameSettings
  stats: PlayerStats
  activeProject: ActiveProjectState | null
  isHydrated: boolean
  isSaving: boolean

  // Currency & XP Progression
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  addXp: (amount: number) => void
  addActiveUsers: (amount: number) => void
  recordFocusTime: (seconds: number) => void
  recordFlowState: () => void
  updateStreak: (todayIsoDate?: string) => void

  // Projects Lifecycle
  startProject: (contract: ProjectContract) => boolean
  completeActiveProject: (result: ProjectCompletionResult) => void
  failActiveProject: (result?: ProjectCancellationResult) => void
  clearActiveProject: () => void

  // Inventory Management
  unlockItem: (itemId: string) => void
  purchaseItem: (itemId: string, price: number, slot?: InventorySlot) => boolean
  equipItem: (slot: InventorySlot, itemId: string) => boolean
  unequipItem: (slot: InventorySlot) => void

  // Settings Management
  updateSettings: (partial: Partial<GameSettings>) => void
  updateAudioSettings: (partial: Partial<AudioSettings>) => void
  setLightingMode: (mode: WindowLightingMode) => void
  updateTimerConfig: (partial: Partial<TimerConfig>) => void
  resetSettings: () => void

  // Persistence & Lifecycle
  hydrate: (repository?: GameRepository) => Promise<void>
  save: (repository?: GameRepository) => Promise<void>
  resetGame: (repository?: GameRepository) => Promise<void>
  resetToDefaults: () => void
  exportSave: () => string
  importSave: (jsonStr: string, repository?: GameRepository) => Promise<boolean>
  getSnapshot: () => GameState
}

const defaultRepo = new LocalFirstRepository()

export const useGameStore = create<GameStoreState>((set, get) => {
  const initial = createInitialGameState()

  return {
    version: CURRENT_GAME_STATE_VERSION,
    profile: initial.profile,
    inventory: initial.inventory,
    settings: initial.settings,
    stats: initial.stats,
    activeProject: initial.activeProject,
    isHydrated: false,
    isSaving: false,

    getSnapshot: (): GameState => {
      const state = get()
      return {
        version: state.version,
        profile: { ...state.profile },
        inventory: {
          ownedItemIds: [...state.inventory.ownedItemIds],
          equipped: { ...state.inventory.equipped },
        },
        settings: {
          audio: { ...state.settings.audio },
          lightingMode: state.settings.lightingMode,
          timer: { ...state.settings.timer },
          notificationsEnabled: state.settings.notificationsEnabled,
          autoStartBreaks: state.settings.autoStartBreaks,
          idleEarningsEnabled: state.settings.idleEarningsEnabled,
        },
        stats: { ...state.stats },
        activeProject: state.activeProject ? { ...state.activeProject } : null,
      }
    },

    addCoins: (amount: number) => {
      if (amount <= 0) return
      set((state) => ({
        profile: {
          ...state.profile,
          devCoins: Math.round(state.profile.devCoins + amount),
          lastSavedAt: new Date().toISOString(),
        },
        stats: {
          ...state.stats,
          totalDevCoinsEarned: Math.round(state.stats.totalDevCoinsEarned + amount),
        },
      }))
    },

    spendCoins: (amount: number): boolean => {
      if (amount <= 0) return true
      const currentCoins = get().profile.devCoins
      if (currentCoins < amount) {
        return false
      }

      set((state) => ({
        profile: {
          ...state.profile,
          devCoins: Math.round(state.profile.devCoins - amount),
          lastSavedAt: new Date().toISOString(),
        },
        stats: {
          ...state.stats,
          totalDevCoinsSpent: Math.round(state.stats.totalDevCoinsSpent + amount),
        },
      }))
      return true
    },

    addXp: (amount: number) => {
      if (amount <= 0) return
      set((state) => {
        const newTotalXp = Math.round(state.profile.totalXp + amount)
        const newLevel = calculateLevelFromXp(newTotalXp)
        const newRole = getCareerRole(newLevel)
        const newStage = getCareerStage(newLevel)

        return {
          profile: {
            ...state.profile,
            totalXp: newTotalXp,
            level: newLevel,
            role: newRole,
            stage: newStage,
            lastSavedAt: new Date().toISOString(),
          },
        }
      })
    },

    addActiveUsers: (amount: number) => {
      if (amount <= 0) return
      set((state) => ({
        profile: {
          ...state.profile,
          activeUsers: Math.round(state.profile.activeUsers + amount),
          lastSavedAt: new Date().toISOString(),
        },
      }))
    },

    recordFocusTime: (seconds: number) => {
      if (seconds <= 0) return
      set((state) => ({
        stats: {
          ...state.stats,
          totalFocusSeconds: Math.round(state.stats.totalFocusSeconds + seconds),
          totalSessionsCompleted: state.stats.totalSessionsCompleted + 1,
        },
      }))
    },

    recordFlowState: () => {
      set((state) => ({
        stats: {
          ...state.stats,
          flowStateCount: state.stats.flowStateCount + 1,
        },
      }))
    },

    updateStreak: (todayIsoDate?: string) => {
      const today: string = todayIsoDate ?? (new Date().toISOString().split('T')[0] || '')
      const { lastActiveDate, streakDays } = get().profile

      if (lastActiveDate === today) {
        return
      }

      let newStreak = 1
      if (lastActiveDate) {
        const last = new Date(lastActiveDate).getTime()
        const current = new Date(today).getTime()
        const dayDifference = Math.round((current - last) / (1000 * 60 * 60 * 24))

        if (dayDifference === 1) {
          newStreak = streakDays + 1
        } else if (dayDifference <= 0) {
          return
        }
      }

      set((state) => ({
        profile: {
          ...state.profile,
          streakDays: newStreak,
          lastActiveDate: today || null,
          lastSavedAt: new Date().toISOString(),
        },
        stats: {
          ...state.stats,
          highestStreakDays: Math.max(state.stats.highestStreakDays, newStreak),
        },
      }))
    },

    startProject: (contract: ProjectContract): boolean => {
      if (contract.stakeAmount > 0) {
        const affordable = get().spendCoins(contract.stakeAmount)
        if (!affordable) {
          return false
        }
      }

      set({
        activeProject: {
          contractId: contract.id,
          title: contract.title,
          durationMinutes: contract.durationMinutes,
          stakedAmount: contract.stakeAmount,
          baseReward: contract.baseReward,
          baseXp: contract.baseXp,
          isFreeTier: contract.isFreeTier,
          startedAt: new Date().toISOString(),
        },
      })

      return true
    },

    completeActiveProject: (result: ProjectCompletionResult) => {
      const { activeProject } = get()
      if (!activeProject) return

      // Payout coins & XP
      get().addCoins(result.totalPayout)
      get().addXp(result.xpEarned)

      set((state) => ({
        activeProject: null,
        stats: {
          ...state.stats,
          totalProjectsCompleted: state.stats.totalProjectsCompleted + 1,
        },
      }))
    },

    failActiveProject: (result?: ProjectCancellationResult) => {
      const { activeProject } = get()
      if (!activeProject) return

      // If there is any refunded amount returned to the player
      if (result && result.refundedAmount > 0) {
        get().addCoins(result.refundedAmount)
      }

      set((state) => ({
        activeProject: null,
        stats: {
          ...state.stats,
          totalProjectsFailed: state.stats.totalProjectsFailed + 1,
        },
      }))
    },

    clearActiveProject: () => {
      set({ activeProject: null })
    },

    unlockItem: (itemId: string) => {
      set((state) => {
        if (state.inventory.ownedItemIds.includes(itemId)) {
          return state
        }
        return {
          inventory: {
            ...state.inventory,
            ownedItemIds: [...state.inventory.ownedItemIds, itemId],
          },
        }
      })
    },

    purchaseItem: (itemId: string, price: number, slot?: InventorySlot): boolean => {
      if (get().inventory.ownedItemIds.includes(itemId)) {
        if (slot) {
          get().equipItem(slot, itemId)
        }
        return true
      }

      const spent = get().spendCoins(price)
      if (!spent) {
        return false
      }

      get().unlockItem(itemId)
      if (slot) {
        get().equipItem(slot, itemId)
      }
      return true
    },

    equipItem: (slot: InventorySlot, itemId: string): boolean => {
      const { inventory } = get()
      if (!inventory.ownedItemIds.includes(itemId)) {
        return false
      }

      set((state) => ({
        inventory: {
          ...state.inventory,
          equipped: {
            ...state.inventory.equipped,
            [slot]: itemId,
          },
        },
      }))
      return true
    },

    unequipItem: (slot: InventorySlot) => {
      set((state) => {
        const nextEquipped = { ...state.inventory.equipped }
        delete nextEquipped[slot]
        return {
          inventory: {
            ...state.inventory,
            equipped: nextEquipped,
          },
        }
      })
    },

    updateSettings: (partial: Partial<GameSettings>) => {
      set((state) => ({
        settings: {
          ...state.settings,
          ...partial,
        },
      }))
    },

    updateAudioSettings: (partial: Partial<AudioSettings>) => {
      set((state) => ({
        settings: {
          ...state.settings,
          audio: {
            ...state.settings.audio,
            ...partial,
          },
        },
      }))
    },

    setLightingMode: (mode: WindowLightingMode) => {
      set((state) => ({
        settings: {
          ...state.settings,
          lightingMode: mode,
        },
      }))
    },

    updateTimerConfig: (partial: Partial<TimerConfig>) => {
      set((state) => ({
        settings: {
          ...state.settings,
          timer: {
            ...state.settings.timer,
            ...partial,
          },
        },
      }))
    },

    resetSettings: () => {
      set(() => ({
        settings: createInitialGameState().settings,
      }))
    },

    hydrate: async (repository?: GameRepository) => {
      const repo = repository ?? defaultRepo
      try {
        const loaded = await repo.load()
        if (loaded) {
          set({
            version: loaded.version,
            profile: loaded.profile,
            inventory: loaded.inventory,
            settings: loaded.settings,
            stats: loaded.stats,
            activeProject: loaded.activeProject,
            isHydrated: true,
          })
          return
        }
      } catch (err) {
        console.warn('useGameStore: Failed to load from repository', err)
      }

      set({ isHydrated: true })
    },

    save: async (repository?: GameRepository) => {
      const repo = repository ?? defaultRepo
      set({ isSaving: true })
      try {
        const snapshot = get().getSnapshot()
        await repo.save(snapshot)
      } finally {
        set({ isSaving: false })
      }
    },

    resetGame: async (repository?: GameRepository) => {
      const repo = repository ?? defaultRepo
      await repo.clear()
      get().resetToDefaults()
    },

    resetToDefaults: () => {
      const initialReset = createInitialGameState()
      set({
        version: initialReset.version,
        profile: initialReset.profile,
        inventory: initialReset.inventory,
        settings: initialReset.settings,
        stats: initialReset.stats,
        activeProject: initialReset.activeProject,
        isHydrated: true,
        isSaving: false,
      })
    },

    exportSave: (): string => {
      const snapshot = get().getSnapshot()
      return exportSaveToJson(snapshot)
    },

    importSave: async (jsonStr: string, repository?: GameRepository): Promise<boolean> => {
      try {
        const validatedState = importSaveFromJson(jsonStr)
        const repo = repository ?? defaultRepo
        await repo.save(validatedState)

        set({
          version: validatedState.version,
          profile: validatedState.profile,
          inventory: validatedState.inventory,
          settings: validatedState.settings,
          stats: validatedState.stats,
          activeProject: validatedState.activeProject,
          isHydrated: true,
        })
        return true
      } catch (err) {
        console.warn('useGameStore: Failed to import save', err)
        return false
      }
    },
  }
})
