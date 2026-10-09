import type { GameState } from '../types'
import type { GameRepository } from './types'

export class MemoryAdapter implements GameRepository {
  private state: GameState | null = null

  async load(): Promise<GameState | null> {
    return this.state ? JSON.parse(JSON.stringify(this.state)) : null
  }

  async save(state: GameState): Promise<void> {
    this.state = JSON.parse(JSON.stringify(state))
  }

  async clear(): Promise<void> {
    this.state = null
  }
}
