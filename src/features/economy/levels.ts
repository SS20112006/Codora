import type { CareerRole, CareerStage, LevelProgress } from './types'

// Cumulative XP thresholds for levels 1 to 50
const PRECOMPUTED_LEVEL_THRESHOLDS: number[] = [0, 200, 500, 1000, 1800]

// Fill progressively up to level 100 with smooth exponential growth
let currentThreshold = 1800
let delta = 1000
for (let lvl = 6; lvl <= 100; lvl++) {
  currentThreshold += Math.round(delta)
  PRECOMPUTED_LEVEL_THRESHOLDS.push(currentThreshold)
  delta *= 1.25
}

/**
 * Returns cumulative XP required to reach a specific level.
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  const index = level - 1
  const threshold = PRECOMPUTED_LEVEL_THRESHOLDS[index]
  if (threshold !== undefined) {
    return threshold
  }
  // Fallback formula for extreme levels beyond 100
  const lastKnown = PRECOMPUTED_LEVEL_THRESHOLDS[PRECOMPUTED_LEVEL_THRESHOLDS.length - 1] ?? 1800
  const extraLevels = level - PRECOMPUTED_LEVEL_THRESHOLDS.length
  return Math.round(lastKnown + extraLevels * 100_000)
}

/**
 * Calculates current level from total cumulative XP.
 */
export function calculateLevelFromXp(totalXp: number): number {
  if (totalXp <= 0) return 1

  let level = 1
  for (let i = 1; i < PRECOMPUTED_LEVEL_THRESHOLDS.length; i++) {
    const threshold = PRECOMPUTED_LEVEL_THRESHOLDS[i]
    if (threshold !== undefined && totalXp >= threshold) {
      level = i + 1
    } else {
      break
    }
  }

  return level
}

/**
 * Returns detailed progress information within current level.
 */
export function getLevelProgress(totalXp: number): LevelProgress {
  const safeXp = Math.max(0, totalXp)
  const level = calculateLevelFromXp(safeXp)
  const currentThreshold = getXpRequiredForLevel(level)
  const nextThreshold = getXpRequiredForLevel(level + 1)
  const nextLevelSpanXp = nextThreshold - currentThreshold
  const currentLevelXp = safeXp - currentThreshold
  const progressPercentage =
    nextLevelSpanXp > 0
      ? Math.min(100, Math.round((currentLevelXp / nextLevelSpanXp) * 100))
      : 100

  return {
    level,
    stage: getCareerStage(level),
    currentLevelXp,
    nextLevelSpanXp,
    progressPercentage,
    totalXp: safeXp,
  }
}

/**
 * Maps player career level to one of the 4 visual stage environments.
 * Stage 1: The Social Network Student Dorm (Levels 1 - 4)
 * Stage 2: First Home Office / Junior Dev (Levels 5 - 11)
 * Stage 3: Co-working / Startup Office (Levels 12 - 24)
 * Stage 4: Penthouse Tech Headquarters (Levels 25+)
 */
export function getCareerStage(level: number): CareerStage {
  if (level <= 4) return 'stage_1_university'
  if (level <= 11) return 'stage_2_junior'
  if (level <= 24) return 'stage_3_coworking'
  return 'stage_4_penthouse'
}

/**
 * Maps player career level to descriptive professional role title.
 */
export function getCareerRole(level: number): CareerRole {
  if (level <= 2) return 'student'
  if (level <= 4) return 'intern'
  if (level <= 8) return 'junior'
  if (level <= 14) return 'mid_level'
  if (level <= 22) return 'senior'
  if (level <= 30) return 'tech_lead'
  return 'indie_founder'
}
