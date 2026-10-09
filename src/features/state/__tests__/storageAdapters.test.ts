import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../types'
import { LocalStorageAdapter } from '../storage/localStorageAdapter'
import { MemoryAdapter } from '../storage/memoryAdapter'
import { LocalFirstRepository } from '../storage/localFirstRepository'

describe('Storage Adapters & Local-First Repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('LocalStorageAdapter', () => {
    it('saves and loads game state successfully', async () => {
      const adapter = new LocalStorageAdapter('test_key')
      const state = createInitialGameState('LocalPlayer')
      state.profile.devCoins = 500

      await adapter.save(state)
      const loaded = await adapter.load()

      expect(loaded).not.toBeNull()
      expect(loaded?.profile.name).toBe('LocalPlayer')
      expect(loaded?.profile.devCoins).toBe(500)
    })

    it('returns null when no data is saved', async () => {
      const adapter = new LocalStorageAdapter('empty_key')
      const loaded = await adapter.load()
      expect(loaded).toBeNull()
    })

    it('clears saved state', async () => {
      const adapter = new LocalStorageAdapter('test_key')
      await adapter.save(createInitialGameState())
      await adapter.clear()

      const loaded = await adapter.load()
      expect(loaded).toBeNull()
    })
  })

  describe('MemoryAdapter', () => {
    it('saves, loads and clears state in memory', async () => {
      const memory = new MemoryAdapter()
      expect(await memory.load()).toBeNull()

      const state = createInitialGameState('MemPlayer')
      await memory.save(state)

      const loaded = await memory.load()
      expect(loaded?.profile.name).toBe('MemPlayer')

      await memory.clear()
      expect(await memory.load()).toBeNull()
    })
  })

  describe('LocalFirstRepository', () => {
    it('uses fallback adapter seamlessly when primary is not available or empty', async () => {
      const primary = new MemoryAdapter()
      const fallback = new LocalStorageAdapter('fallback_key')

      // Save initial state into fallback
      const state = createInitialGameState('FallbackPlayer')
      state.profile.devCoins = 1200
      await fallback.save(state)

      const localFirst = new LocalFirstRepository({ primary, secondary: fallback })
      const loaded = await localFirst.load()

      expect(loaded).not.toBeNull()
      expect(loaded?.profile.name).toBe('FallbackPlayer')
      expect(loaded?.profile.devCoins).toBe(1200)

      // It should also have synced loaded state into primary
      const inPrimary = await primary.load()
      expect(inPrimary?.profile.name).toBe('FallbackPlayer')
    })

    it('saves to both primary and secondary repositories for redundancy', async () => {
      const primary = new MemoryAdapter()
      const secondary = new MemoryAdapter()

      const localFirst = new LocalFirstRepository({ primary, secondary })
      const state = createInitialGameState('DualPlayer')
      state.profile.totalXp = 800

      await localFirst.save(state)

      const fromPrimary = await primary.load()
      const fromSecondary = await secondary.load()

      expect(fromPrimary?.profile.name).toBe('DualPlayer')
      expect(fromSecondary?.profile.name).toBe('DualPlayer')
    })

    it('clears both repositories upon clear()', async () => {
      const primary = new MemoryAdapter()
      const secondary = new MemoryAdapter()
      const localFirst = new LocalFirstRepository({ primary, secondary })

      await localFirst.save(createInitialGameState())
      await localFirst.clear()

      expect(await primary.load()).toBeNull()
      expect(await secondary.load()).toBeNull()
    })
  })
})
