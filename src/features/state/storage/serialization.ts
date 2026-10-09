import { getCareerRole, getCareerStage, calculateLevelFromXp } from '@/features/economy/levels'
import { DEFAULT_TIMER_CONFIG } from '@/features/timer/types'
import {
  CURRENT_GAME_STATE_VERSION,
  createInitialGameState,
  type GameState,
  type WindowLightingMode,
} from '../types'

/**
 * Serializes GameState to a formatted JSON string.
 */
export function exportSaveToJson(state: GameState): string {
  const payload: GameState = {
    ...state,
    version: CURRENT_GAME_STATE_VERSION,
    profile: {
      ...state.profile,
      lastSavedAt: new Date().toISOString(),
    },
  }
  return JSON.stringify(payload, null, 2)
}

function clampNumber(value: unknown, min: number, max = Infinity, fallback = 0): number {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return fallback
  }
  return Math.min(Math.max(value, min), max)
}

/**
 * Parses and strictly validates a JSON string into a valid GameState.
 * Recalculates level, role, and stage from cumulative XP to maintain system integrity.
 */
export function importSaveFromJson(jsonString: string): GameState {
  let raw: unknown
  try {
    raw = JSON.parse(jsonString)
  } catch (error) {
    throw new Error(`Invalid JSON format: ${(error as Error).message}`)
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid save data: Expected a JSON object')
  }

  const data = raw as Record<string, unknown>

  if (!data.profile || typeof data.profile !== 'object') {
    throw new Error('Invalid save data: Missing required profile object')
  }

  const defaultState = createInitialGameState()
  const rawProfile = data.profile as Record<string, unknown>

  const safeTotalXp = clampNumber(rawProfile.totalXp, 0)
  const safeLevel = calculateLevelFromXp(safeTotalXp)
  const safeStage = getCareerStage(safeLevel)
  const safeRole = getCareerRole(safeLevel)

  const profile = {
    name: typeof rawProfile.name === 'string' && rawProfile.name.trim() ? rawProfile.name.trim() : 'Dev',
    devCoins: clampNumber(rawProfile.devCoins, 0),
    totalXp: safeTotalXp,
    level: safeLevel,
    role: safeRole,
    stage: safeStage,
    activeUsers: clampNumber(rawProfile.activeUsers, 0),
    streakDays: clampNumber(rawProfile.streakDays, 0),
    lastActiveDate: typeof rawProfile.lastActiveDate === 'string' ? rawProfile.lastActiveDate : null,
    createdAt: typeof rawProfile.createdAt === 'string' ? rawProfile.createdAt : defaultState.profile.createdAt,
    lastSavedAt: new Date().toISOString(),
  }

  const rawInventory = (typeof data.inventory === 'object' && data.inventory !== null)
    ? (data.inventory as Record<string, unknown>)
    : {}

  const ownedItemIds = Array.isArray(rawInventory.ownedItemIds)
    ? (rawInventory.ownedItemIds.filter((id) => typeof id === 'string') as string[])
    : [...defaultState.inventory.ownedItemIds]

  const rawEquipped = (typeof rawInventory.equipped === 'object' && rawInventory.equipped !== null)
    ? (rawInventory.equipped as Record<string, unknown>)
    : {}

  const equipped: Record<string, string> = {}
  for (const [slot, id] of Object.entries(rawEquipped)) {
    if (typeof id === 'string') {
      equipped[slot] = id
    }
  }

  const rawSettings = (typeof data.settings === 'object' && data.settings !== null)
    ? (data.settings as Record<string, unknown>)
    : {}

  const rawAudio = (typeof rawSettings.audio === 'object' && rawSettings.audio !== null)
    ? (rawSettings.audio as Record<string, unknown>)
    : {}

  const validLightingModes: WindowLightingMode[] = ['realtime', 'day', 'sunset', 'night']
  const rawLighting = rawSettings.lightingMode as WindowLightingMode
  const lightingMode: WindowLightingMode = validLightingModes.includes(rawLighting)
    ? rawLighting
    : defaultState.settings.lightingMode

  const audio = {
    masterVolume: clampNumber(rawAudio.masterVolume, 0, 1, 0.8),
    musicVolume: clampNumber(rawAudio.musicVolume, 0, 1, 0.6),
    ambientVolume: clampNumber(rawAudio.ambientVolume, 0, 1, 0.5),
    sfxVolume: clampNumber(rawAudio.sfxVolume, 0, 1, 0.7),
    isMuted: Boolean(rawAudio.isMuted),
  }

  const rawTimer = (typeof rawSettings.timer === 'object' && rawSettings.timer !== null)
    ? (rawSettings.timer as Record<string, unknown>)
    : {}

  const timer = {
    ...DEFAULT_TIMER_CONFIG,
    ...rawTimer,
  }

  const settings = {
    audio,
    lightingMode,
    timer,
    notificationsEnabled: rawSettings.notificationsEnabled !== undefined ? Boolean(rawSettings.notificationsEnabled) : true,
    autoStartBreaks: rawSettings.autoStartBreaks !== undefined ? Boolean(rawSettings.autoStartBreaks) : false,
    idleEarningsEnabled: rawSettings.idleEarningsEnabled !== undefined ? Boolean(rawSettings.idleEarningsEnabled) : true,
  }

  const rawStats = (typeof data.stats === 'object' && data.stats !== null)
    ? (data.stats as Record<string, unknown>)
    : {}

  const stats = {
    totalFocusSeconds: clampNumber(rawStats.totalFocusSeconds, 0),
    totalSessionsCompleted: clampNumber(rawStats.totalSessionsCompleted, 0),
    totalProjectsCompleted: clampNumber(rawStats.totalProjectsCompleted, 0),
    totalProjectsFailed: clampNumber(rawStats.totalProjectsFailed, 0),
    totalDevCoinsEarned: clampNumber(rawStats.totalDevCoinsEarned, 0),
    totalDevCoinsSpent: clampNumber(rawStats.totalDevCoinsSpent, 0),
    highestStreakDays: clampNumber(rawStats.highestStreakDays, 0),
    flowStateCount: clampNumber(rawStats.flowStateCount, 0),
  }

  let activeProject = null
  if (data.activeProject && typeof data.activeProject === 'object') {
    const rawProj = data.activeProject as Record<string, unknown>
    if (typeof rawProj.contractId === 'string' && typeof rawProj.title === 'string') {
      activeProject = {
        contractId: rawProj.contractId,
        title: rawProj.title,
        durationMinutes: clampNumber(rawProj.durationMinutes, 1, 180, 25),
        stakedAmount: clampNumber(rawProj.stakedAmount, 0),
        baseReward: clampNumber(rawProj.baseReward, 0),
        baseXp: clampNumber(rawProj.baseXp, 0),
        isFreeTier: Boolean(rawProj.isFreeTier),
        startedAt: typeof rawProj.startedAt === 'string' ? rawProj.startedAt : new Date().toISOString(),
      }
    }
  }

  let availableContracts = defaultState.availableContracts
  if (Array.isArray(data.availableContracts) && data.availableContracts.length > 0) {
    availableContracts = data.availableContracts.filter(
      (c) => typeof c === 'object' && c !== null && typeof (c as Record<string, unknown>).id === 'string'
    ) as typeof defaultState.availableContracts
  }

  return {
    version: CURRENT_GAME_STATE_VERSION,
    profile,
    inventory: {
      ownedItemIds,
      equipped,
    },
    settings,
    stats,
    activeProject,
    availableContracts,
  }
}
