import type { GameState } from '../types'
import type { GameRepository } from './types'
import { exportSaveToJson, importSaveFromJson } from './serialization'

export const DEFAULT_LOCAL_STORAGE_KEY = 'codora_game_save_v1'

export class LocalStorageAdapter implements GameRepository {
  private key: string

  constructor(key = DEFAULT_LOCAL_STORAGE_KEY) {
    this.key = key
  }

  async load(): Promise<GameState | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    try {
      const raw = window.localStorage.getItem(this.key)
      if (!raw) return null
      return importSaveFromJson(raw)
    } catch {
      return null
    }
  }

  async save(state: GameState): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      const json = exportSaveToJson(state)
      window.localStorage.setItem(this.key, json)
    } catch (error) {
      console.warn('LocalStorageAdapter: Failed to persist game state', error)
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      window.localStorage.removeItem(this.key)
    } catch (error) {
      console.warn('LocalStorageAdapter: Failed to remove game state', error)
    }
  }
}
