import type { GameState } from '../types'
import { IndexedDbAdapter } from './indexedDbAdapter'
import { LocalStorageAdapter } from './localStorageAdapter'
import { MemoryAdapter } from './memoryAdapter'
import type { GameRepository } from './types'

export interface LocalFirstRepositoryOptions {
  primary?: GameRepository
  secondary?: GameRepository
}

/**
 * Composite Local-First repository.
 * Attempts loading from primary (e.g. IndexedDB); if missing or failing, falls back to secondary (e.g. LocalStorage).
 * Dual-writes state to both tiers upon saving for resilience and migration safety.
 */
export class LocalFirstRepository implements GameRepository {
  private primary: GameRepository
  private secondary: GameRepository

  constructor(options?: LocalFirstRepositoryOptions) {
    if (options?.primary && options?.secondary) {
      this.primary = options.primary
      this.secondary = options.secondary
    } else {
      const hasIndexedDb = typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined'
      const hasLocalStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

      if (hasIndexedDb) {
        this.primary = options?.primary ?? new IndexedDbAdapter()
        this.secondary = options?.secondary ?? (hasLocalStorage ? new LocalStorageAdapter() : new MemoryAdapter())
      } else if (hasLocalStorage) {
        this.primary = options?.primary ?? new LocalStorageAdapter()
        this.secondary = options?.secondary ?? new MemoryAdapter()
      } else {
        this.primary = options?.primary ?? new MemoryAdapter()
        this.secondary = options?.secondary ?? new MemoryAdapter()
      }
    }
  }

  async load(): Promise<GameState | null> {
    try {
      const stateFromPrimary = await this.primary.load()
      if (stateFromPrimary) {
        return stateFromPrimary
      }
    } catch (err) {
      console.warn('LocalFirstRepository: Primary repository failed to load, trying fallback', err)
    }

    try {
      const stateFromSecondary = await this.secondary.load()
      if (stateFromSecondary) {
        // Backfill/migrate secondary state into primary
        this.primary.save(stateFromSecondary).catch(() => {})
        return stateFromSecondary
      }
    } catch (err) {
      console.warn('LocalFirstRepository: Secondary repository failed to load', err)
    }

    return null
  }

  async save(state: GameState): Promise<void> {
    const primarySave = this.primary.save(state).catch((err) => {
      console.warn('LocalFirstRepository: Primary save warning', err)
    })

    const secondarySave = this.secondary.save(state).catch((err) => {
      console.warn('LocalFirstRepository: Secondary save warning', err)
    })

    await Promise.all([primarySave, secondarySave])
  }

  async clear(): Promise<void> {
    await Promise.all([
      this.primary.clear().catch(() => {}),
      this.secondary.clear().catch(() => {}),
    ])
  }
}
