import type {
  EconomyMultipliers,
  ProjectContract,
  ProjectCompletionResult,
} from './types'

/**
 * Calculates the composite economic multiplier according to the formula:
 * Retorno = Base(Tempo) * Multiplicadores(Hardware + Software + Cargo + Streak)
 * Baseline is 1.0 (no buffs). Modifiers are clamped to >= 0 to protect against negative rates.
 */
export function calculateMultiplier(multipliers: Partial<EconomyMultipliers> = {}): number {
  const hardware = Math.max(0, multipliers.hardware ?? 0)
  const software = Math.max(0, multipliers.software ?? 0)
  const careerRole = Math.max(0, multipliers.careerRole ?? 0)
  const streak = Math.max(0, multipliers.streak ?? 0)

  return Number((1 + hardware + software + careerRole + streak).toFixed(4))
}

/**
 * Calculates daily streak bonus.
 * 2% per consecutive active day up to a max cap of 50% (0.50).
 */
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays <= 0) return 0
  const bonus = streakDays * 0.02
  return Math.min(0.5, Number(bonus.toFixed(4)))
}

/**
 * Calculates base coin reward proportional to focus duration.
 * @param durationMinutes Duration of the sprint in minutes
 * @param ratePerMinute Base coin earning rate per minute (default 1)
 */
export function calculateBaseReward(durationMinutes: number, ratePerMinute = 1): number {
  if (durationMinutes <= 0) return 0
  return Math.round(durationMinutes * Math.max(0, ratePerMinute))
}

/**
 * Calculates the full financial and XP return for a completed project contract.
 * Free-tier projects intentionally do not scale with advanced multipliers (anti-spam design).
 */
export function calculateProjectReward(params: {
  contract: ProjectContract
  multipliers?: Partial<EconomyMultipliers>
}): ProjectCompletionResult {
  const { contract, multipliers = {} } = params

  if (contract.isFreeTier) {
    return {
      grossReward: contract.baseReward,
      stakeReturned: 0,
      netProfit: contract.baseReward,
      totalPayout: contract.baseReward,
      roiPercentage: 0,
      xpEarned: contract.baseXp,
      multiplierApplied: 1.0,
    }
  }

  const multiplierApplied = calculateMultiplier(multipliers)
  const grossReward = Math.round(contract.baseReward * multiplierApplied)
  const stakeReturned = contract.stakeAmount
  const netProfit = grossReward - contract.stakeAmount
  const totalPayout = stakeReturned + grossReward
  const roiPercentage =
    contract.stakeAmount > 0 ? (netProfit / contract.stakeAmount) * 100 : 0
  const xpEarned = Math.round(contract.baseXp * multiplierApplied)

  return {
    grossReward,
    stakeReturned,
    netProfit,
    totalPayout,
    roiPercentage,
    xpEarned,
    multiplierApplied,
  }
}

/**
 * Calculates XP earned for a session based on focus minutes.
 */
export function calculateSessionXp(params: {
  durationMinutes: number
  multipliers?: Partial<EconomyMultipliers>
  isFreeTier?: boolean
  customBaseXp?: number
}): number {
  const { durationMinutes, multipliers = {}, isFreeTier = false, customBaseXp } = params

  if (isFreeTier) {
    return customBaseXp ?? Math.max(0, Math.round(durationMinutes * 2))
  }

  const baseXp = customBaseXp ?? Math.max(0, Math.round(durationMinutes * 4))
  const multiplier = calculateMultiplier(multipliers)
  return Math.round(baseXp * multiplier)
}
