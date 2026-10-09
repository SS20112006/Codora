import type { CareerRole, CareerStage, ProjectContract } from '@/features/economy/types'
import { generateContractMarket } from '@/features/economy/contracts'
import { DEFAULT_TIMER_CONFIG, type TimerConfig } from '@/features/timer/types'

export type InventorySlot =
  | 'desk'
  | 'chair'
  | 'computer'
  | 'monitor'
  | 'keyboard'
  | 'headphones'
  | 'decoration'
  | 'clothing'
  | 'os'
  | 'ide'

export interface Inventory {
  ownedItemIds: string[]
  equipped: Partial<Record<InventorySlot, string>>
}

export type WindowLightingMode = 'realtime' | 'day' | 'sunset' | 'night'

export interface AudioSettings {
  masterVolume: number // 0 to 1
  musicVolume: number // 0 to 1
  ambientVolume: number // 0 to 1
  sfxVolume: number // 0 to 1
  isMuted: boolean
}

export interface GameSettings {
  audio: AudioSettings
  lightingMode: WindowLightingMode
  timer: TimerConfig
  notificationsEnabled: boolean
  autoStartBreaks: boolean
  idleEarningsEnabled: boolean
}

export interface PlayerProfile {
  name: string
  devCoins: number
  totalXp: number
  level: number
  role: CareerRole
  stage: CareerStage
  activeUsers: number
  streakDays: number
  lastActiveDate: string | null
  createdAt: string
  lastSavedAt: string
}

export interface PlayerStats {
  totalFocusSeconds: number
  totalSessionsCompleted: number
  totalProjectsCompleted: number
  totalProjectsFailed: number
  totalDevCoinsEarned: number
  totalDevCoinsSpent: number
  highestStreakDays: number
  flowStateCount: number
}

export interface ActiveProjectState {
  contractId: string
  title: string
  durationMinutes: number
  stakedAmount: number
  baseReward: number
  baseXp: number
  isFreeTier: boolean
  startedAt: string
}

export interface GameState {
  version: number
  profile: PlayerProfile
  inventory: Inventory
  settings: GameSettings
  stats: PlayerStats
  activeProject: ActiveProjectState | null
  availableContracts?: ProjectContract[]
}

export const CURRENT_GAME_STATE_VERSION = 1

export function createInitialGameState(name = 'Dev'): GameState {
  const timestamp = new Date().toISOString()

  return {
    version: CURRENT_GAME_STATE_VERSION,
    profile: {
      name,
      devCoins: 0,
      totalXp: 0,
      level: 1,
      role: 'student',
      stage: 'stage_1_university',
      activeUsers: 0,
      streakDays: 0,
      lastActiveDate: null,
      createdAt: timestamp,
      lastSavedAt: timestamp,
    },
    inventory: {
      ownedItemIds: [
        'desk_dorm_wood',
        'laptop_old',
        'chair_kitchen_stool',
        'keyboard_membrane',
        'os_basic',
        'ide_notepad',
      ],
      equipped: {
        desk: 'desk_dorm_wood',
        computer: 'laptop_old',
        chair: 'chair_kitchen_stool',
        keyboard: 'keyboard_membrane',
        os: 'os_basic',
        ide: 'ide_notepad',
      },
    },
    settings: {
      audio: {
        masterVolume: 0.8,
        musicVolume: 0.6,
        ambientVolume: 0.5,
        sfxVolume: 0.7,
        isMuted: false,
      },
      lightingMode: 'realtime',
      timer: { ...DEFAULT_TIMER_CONFIG },
      notificationsEnabled: true,
      autoStartBreaks: false,
      idleEarningsEnabled: true,
    },
    stats: {
      totalFocusSeconds: 0,
      totalSessionsCompleted: 0,
      totalProjectsCompleted: 0,
      totalProjectsFailed: 0,
      totalDevCoinsEarned: 0,
      totalDevCoinsSpent: 0,
      highestStreakDays: 0,
      flowStateCount: 0,
    },
    activeProject: null,
    availableContracts: generateContractMarket({ stage: 'stage_1_university', playerCoins: 0 }),
  }
}
