export type CareerStage =
  | 'stage_1_university'
  | 'stage_2_junior'
  | 'stage_3_coworking'
  | 'stage_4_penthouse'

export type CareerRole =
  | 'student'
  | 'intern'
  | 'junior'
  | 'mid_level'
  | 'senior'
  | 'tech_lead'
  | 'indie_founder'

export interface EconomyMultipliers {
  /** Hardware upgrades (e.g. 0.15 = +15%) */
  hardware: number
  /** Software and IDE enhancements (e.g. 0.10 = +10%) */
  software: number
  /** Career role multiplier based on current title/seniority */
  careerRole: number
  /** Daily streak consecutive sprint multiplier */
  streak: number
}

export interface ProjectContract {
  id: string
  title: string
  description: string
  durationMinutes: number
  baseReward: number
  stakeAmount: number
  baseXp: number
  isFreeTier: boolean
  minCareerRole?: CareerRole
}

export interface ProjectCompletionResult {
  /** Total coins earned as return for completing work */
  grossReward: number
  /** Initial stake refunded back to player */
  stakeReturned: number
  /** Net coins generated (grossReward - stakeAmount) */
  netProfit: number
  /** Total coins paid out upon completion (stakeReturned + grossReward) */
  totalPayout: number
  /** Return on investment percentage: (netProfit / stakeAmount) * 100 */
  roiPercentage: number
  /** Total XP earned */
  xpEarned: number
  /** Composite multiplier applied to the contract */
  multiplierApplied: number
}

export interface ProjectCancellationResult {
  /** Original stake locked */
  stakedAmount: number
  /** Penalty rate applied (0.0 to 1.0) */
  penaltyRate: number
  /** Coins forfeited as penalty */
  penaltyAmount: number
  /** Coins refunded back to player wallet */
  refundedAmount: number
}

export interface LevelProgress {
  level: number
  stage: CareerStage
  currentLevelXp: number
  nextLevelSpanXp: number
  progressPercentage: number
  totalXp: number
}
