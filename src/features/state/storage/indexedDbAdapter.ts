import type { GameState } from '../types'
import type { GameRepository } from './types'
import { exportSaveToJson, importSaveFromJson } from './serialization'

export const DB_NAME = 'codora_db'
export const DB_VERSION = 1
export const STORE_NAME = 'saves'
export const SAVE_KEY = 'active_save'

export class IndexedDbAdapter implements GameRepository {
  private dbPromise: Promise<IDBDatabase> | null = null

  private isSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined'
  }

  private getDb(): Promise<IDBDatabase> {
    if (!this.isSupported()) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'))
    }

    if (this.dbPromise) {
      return this.dbPromise
    }

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
          const db = request.result
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME)
          }
        }

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = () => {
          reject(request.error ?? new Error('Failed to open IndexedDB'))
        }
      } catch (err) {
        reject(err)
      }
    })

    return this.dbPromise
  }

  async load(): Promise<GameState | null> {
    if (!this.isSupported()) return null

    try {
      const db = await this.getDb()
      return new Promise<GameState | null>((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly')
          const store = tx.objectStore(STORE_NAME)
          const request = store.get(SAVE_KEY)

          request.onsuccess = () => {
            const raw = request.result
            if (!raw || typeof raw !== 'string') {
              resolve(null)
              return
            }
            try {
              const state = importSaveFromJson(raw)
              resolve(state)
            } catch {
              resolve(null)
            }
          }

          request.onerror = () => {
            resolve(null)
          }
        } catch {
          resolve(null)
        }
      })
    } catch {
      return null
    }
  }

  async save(state: GameState): Promise<void> {
    if (!this.isSupported()) return

    try {
      const db = await this.getDb()
      const json = exportSaveToJson(state)

      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite')
          const store = tx.objectStore(STORE_NAME)
          const request = store.put(json, SAVE_KEY)

          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        } catch (err) {
          reject(err)
        }
      })
    } catch (err) {
      console.warn('IndexedDbAdapter: save failed', err)
    }
  }

  async clear(): Promise<void> {
    if (!this.isSupported()) return

    try {
      const db = await this.getDb()
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite')
          const store = tx.objectStore(STORE_NAME)
          const request = store.delete(SAVE_KEY)

          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        } catch (err) {
          reject(err)
        }
      })
    } catch (err) {
      console.warn('IndexedDbAdapter: clear failed', err)
    }
  }
}
