import type { GameState } from '../types'

export interface GameRepository {
  /** Loads the saved game state, or null if no save exists */
  load(): Promise<GameState | null>
  /** Persists the given game state */
  save(state: GameState): Promise<void>
  /** Clears/deletes the persistent game state */
  clear(): Promise<void>
}
