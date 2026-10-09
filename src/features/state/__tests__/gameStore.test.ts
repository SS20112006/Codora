import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from '../store'
import { MemoryAdapter } from '../storage/memoryAdapter'
import type { ProjectCancellationResult, ProjectCompletionResult, ProjectContract } from '@/features/economy/types'

describe('Zustand Global Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().resetToDefaults()
  })

  describe('Initial State', () => {
    it('initializes with default player profile and settings', () => {
      const state = useGameStore.getState()
      expect(state.profile.name).toBe('Dev')
      expect(state.profile.devCoins).toBe(0)
      expect(state.profile.level).toBe(1)
      expect(state.profile.role).toBe('student')
      expect(state.profile.stage).toBe('stage_1_university')
      expect(state.inventory.ownedItemIds).toContain('desk_dorm_wood')
      expect(state.inventory.equipped.desk).toBe('desk_dorm_wood')
      expect(state.settings.audio.masterVolume).toBe(0.8)
      expect(state.settings.lightingMode).toBe('realtime')
      expect(state.activeProject).toBeNull()
    })
  })

  describe('Coins & XP Progression', () => {
    it('adds coins and updates earned stats', () => {
      const store = useGameStore.getState()
      store.addCoins(100)

      expect(useGameStore.getState().profile.devCoins).toBe(100)
      expect(useGameStore.getState().stats.totalDevCoinsEarned).toBe(100)
    })

    it('spends coins when balance is sufficient and tracks spent stats', () => {
      const store = useGameStore.getState()
      store.addCoins(100)

      const success = store.spendCoins(40)
      expect(success).toBe(true)
      expect(useGameStore.getState().profile.devCoins).toBe(60)
      expect(useGameStore.getState().stats.totalDevCoinsSpent).toBe(40)
    })

    it('refuses to spend coins when balance is insufficient', () => {
      const store = useGameStore.getState()
      store.addCoins(25)

      const success = store.spendCoins(50)
      expect(success).toBe(false)
      expect(useGameStore.getState().profile.devCoins).toBe(25)
      expect(useGameStore.getState().stats.totalDevCoinsSpent).toBe(0)
    })

    it('adds XP and automatically recalculates level and career roles', () => {
      const store = useGameStore.getState()
      expect(store.profile.level).toBe(1)
      expect(store.profile.role).toBe('student')

      // Adding 1500 XP should level up player
      store.addXp(1500)

      const updated = useGameStore.getState()
      expect(updated.profile.totalXp).toBe(1500)
      expect(updated.profile.level).toBeGreaterThan(1)
      expect(['student', 'intern', 'junior']).toContain(updated.profile.role)
    })

    it('updates daily streak correctly for consecutive days', () => {
      const store = useGameStore.getState()
      expect(store.profile.streakDays).toBe(0)

      store.updateStreak('2026-10-08')
      expect(useGameStore.getState().profile.streakDays).toBe(1)
      expect(useGameStore.getState().stats.highestStreakDays).toBe(1)

      // Same day should not increase streak
      store.updateStreak('2026-10-08')
      expect(useGameStore.getState().profile.streakDays).toBe(1)

      // Consecutive next day increases streak
      store.updateStreak('2026-10-09')
      expect(useGameStore.getState().profile.streakDays).toBe(2)
      expect(useGameStore.getState().stats.highestStreakDays).toBe(2)

      // Missed day resets streak to 1
      store.updateStreak('2026-10-15')
      expect(useGameStore.getState().profile.streakDays).toBe(1)
      expect(useGameStore.getState().stats.highestStreakDays).toBe(2)
    })
  })

  describe('Project Staking and Completion Lifecycle', () => {
    const mockContract: ProjectContract = {
      id: 'proj_calculator',
      title: 'Console Calculator',
      description: 'Build a basic CLI calculator',
      durationMinutes: 25,
      stakeAmount: 50,
      baseReward: 75,
      baseXp: 120,
      isFreeTier: false,
    }

    it('starts a project and locks the staked amount', () => {
      const store = useGameStore.getState()
      store.addCoins(100)

      const started = store.startProject(mockContract)
      expect(started).toBe(true)

      const updated = useGameStore.getState()
      expect(updated.profile.devCoins).toBe(50) // 100 - 50 staked
      expect(updated.activeProject).not.toBeNull()
      expect(updated.activeProject?.contractId).toBe('proj_calculator')
      expect(updated.activeProject?.stakedAmount).toBe(50)
    })

    it('fails to start project if player cannot afford stake', () => {
      const store = useGameStore.getState()
      store.addCoins(20) // Only 20 coins, stake requires 50

      const started = store.startProject(mockContract)
      expect(started).toBe(false)
      expect(useGameStore.getState().activeProject).toBeNull()
    })

    it('completes active project and distributes payout, XP and updates stats', () => {
      const store = useGameStore.getState()
      store.addCoins(100)
      store.startProject(mockContract)

      const completionResult: ProjectCompletionResult = {
        grossReward: 75,
        stakeReturned: 50,
        netProfit: 25,
        totalPayout: 125,
        roiPercentage: 50,
        xpEarned: 120,
        multiplierApplied: 1.0,
      }

      store.completeActiveProject(completionResult)

      const updated = useGameStore.getState()
      expect(updated.activeProject).toBeNull()
      // Initial 100 - 50 stake + 125 total payout = 175
      expect(updated.profile.devCoins).toBe(175)
      expect(updated.profile.totalXp).toBe(120)
      expect(updated.stats.totalProjectsCompleted).toBe(1)
    })

    it('cancels/fails active project, returns refunded stake, and updates stats', () => {
      const store = useGameStore.getState()
      store.addCoins(100)
      store.startProject(mockContract)

      const cancellationResult: ProjectCancellationResult = {
        stakedAmount: 50,
        penaltyRate: 0.5,
        penaltyAmount: 25,
        refundedAmount: 25,
      }

      store.failActiveProject(cancellationResult)

      const updated = useGameStore.getState()
      expect(updated.activeProject).toBeNull()
      // 50 remaining + 25 refunded = 75
      expect(updated.profile.devCoins).toBe(75)
      expect(updated.stats.totalProjectsFailed).toBe(1)
    })

    it('initializes with a populated catalog of available contracts in the market', () => {
      const { availableContracts } = useGameStore.getState()
      expect(availableContracts.length).toBeGreaterThanOrEqual(3)
      expect(availableContracts.length).toBeLessThanOrEqual(4)
      availableContracts.forEach((contract) => {
        expect(contract.title).toBeTruthy()
        expect(contract.durationMinutes).toBeGreaterThan(0)
      })
    })

    it('refreshes the contracts market and updates available contracts list', () => {
      const store = useGameStore.getState()
      expect(store.availableContracts.length).toBeGreaterThan(0)

      store.refreshContractsMarket()

      const refreshed = useGameStore.getState().availableContracts
      expect(refreshed.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Inventory Management', () => {
    it('purchases and equips items when coins are available', () => {
      const store = useGameStore.getState()
      store.addCoins(500)

      const purchased = store.purchaseItem('chair_ergonomic', 300, 'chair')
      expect(purchased).toBe(true)

      const updated = useGameStore.getState()
      expect(updated.profile.devCoins).toBe(200)
      expect(updated.inventory.ownedItemIds).toContain('chair_ergonomic')
      expect(updated.inventory.equipped.chair).toBe('chair_ergonomic')
    })

    it('equips owned item and allows unequipping', () => {
      const store = useGameStore.getState()
      store.unlockItem('headphones_anc')

      const equipped = store.equipItem('headphones', 'headphones_anc')
      expect(equipped).toBe(true)
      expect(useGameStore.getState().inventory.equipped.headphones).toBe('headphones_anc')

      store.unequipItem('headphones')
      expect(useGameStore.getState().inventory.equipped.headphones).toBeUndefined()
    })

    it('rejects equipping items not owned', () => {
      const store = useGameStore.getState()
      const equipped = store.equipItem('monitor', 'monitor_ultrawide_49')
      expect(equipped).toBe(false)
      expect(useGameStore.getState().inventory.equipped.monitor).toBeUndefined()
    })
  })

  describe('Settings Management', () => {
    it('updates audio volumes and muting', () => {
      const store = useGameStore.getState()
      store.updateAudioSettings({ masterVolume: 0.5, isMuted: true })

      const { audio } = useGameStore.getState().settings
      expect(audio.masterVolume).toBe(0.5)
      expect(audio.isMuted).toBe(true)
      expect(audio.musicVolume).toBe(0.6) // Unchanged
    })

    it('updates lighting mode and timer config', () => {
      const store = useGameStore.getState()
      store.setLightingMode('sunset')
      store.updateTimerConfig({ isHardcore: true })

      const { settings } = useGameStore.getState()
      expect(settings.lightingMode).toBe('sunset')
      expect(settings.timer.isHardcore).toBe(true)
    })
  })

  describe('Persistence, Save / Load and JSON Export / Import', () => {
    it('hydrates state from a repository', async () => {
      const repository = new MemoryAdapter()
      const existing = useGameStore.getState().getSnapshot()
      existing.profile.name = 'HydratedHero'
      existing.profile.devCoins = 999
      await repository.save(existing)

      await useGameStore.getState().hydrate(repository)

      const state = useGameStore.getState()
      expect(state.profile.name).toBe('HydratedHero')
      expect(state.profile.devCoins).toBe(999)
      expect(state.isHydrated).toBe(true)
    })

    it('exports save JSON and imports it into store', async () => {
      const store = useGameStore.getState()
      store.addCoins(777)
      store.addXp(600)

      const exportedJson = store.exportSave()
      expect(typeof exportedJson).toBe('string')

      // Reset store
      store.resetToDefaults()
      expect(useGameStore.getState().profile.devCoins).toBe(0)

      // Import
      const success = await store.importSave(exportedJson, new MemoryAdapter())
      expect(success).toBe(true)

      const imported = useGameStore.getState()
      expect(imported.profile.devCoins).toBe(777)
      expect(imported.profile.totalXp).toBe(600)
    })
  })
})
