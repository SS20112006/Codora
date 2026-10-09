import { describe, it, expect } from 'vitest'
import {
  calculateMultiplier,
  calculateBaseReward,
  calculateStreakBonus,
  calculateProjectReward,
  calculateSessionXp,
  canAffordStake,
  lockStake,
  cancelStake,
  resolveCompletedProject,
  isBankrupt,
  getBankruptcyRescueProjects,
  FREE_TIER_PROJECTS,
  calculateLevelFromXp,
  getXpRequiredForLevel,
  getLevelProgress,
  getCareerStage,
  getCareerRole,
  type ProjectContract,
  type EconomyMultipliers,
} from '../index'

describe('Economy Engine - Formulas & Multipliers', () => {
  it('calculates default multiplier of 1.0 when all modifiers are zero', () => {
    const multipliers: EconomyMultipliers = {
      hardware: 0,
      software: 0,
      careerRole: 0,
      streak: 0,
    }
    expect(calculateMultiplier(multipliers)).toBe(1.0)
  })

  it('calculates composite multiplier: 1 + (Hardware + Software + Cargo + Streak)', () => {
    const multipliers: EconomyMultipliers = {
      hardware: 0.15, // +15%
      software: 0.10, // +10%
      careerRole: 0.25, // +25%
      streak: 0.10, // +10%
    }
    // 1 + (0.15 + 0.10 + 0.25 + 0.10) = 1.60
    expect(calculateMultiplier(multipliers)).toBeCloseTo(1.6, 4)
  })

  it('clamps negative multiplier values to 0 to prevent exploitative negative rates', () => {
    const multipliers = {
      hardware: -0.5,
      software: 0.2,
      careerRole: 0,
      streak: -0.1,
    }
    // 1 + 0.2 = 1.2
    expect(calculateMultiplier(multipliers)).toBeCloseTo(1.2, 4)
  })

  it('calculates streak bonus with deterministic cap', () => {
    // 0 days -> 0%
    expect(calculateStreakBonus(0)).toBe(0)
    // 5 days -> 5 * 2% = 10% (0.10)
    expect(calculateStreakBonus(5)).toBeCloseTo(0.10, 4)
    // 30 days -> capped at maximum bonus (e.g. 50% = 0.50)
    expect(calculateStreakBonus(30)).toBe(0.50)
    expect(calculateStreakBonus(100)).toBe(0.50)
    // negative days -> 0
    expect(calculateStreakBonus(-5)).toBe(0)
  })

  it('calculates base reward proportional to focus duration', () => {
    // 25 minutes standard Pomodoro with rate 1 coin/min = 25 coins
    expect(calculateBaseReward(25)).toBe(25)
    // 50 minutes = 50 coins
    expect(calculateBaseReward(50)).toBe(50)
    // Custom rate: 25 min * 2 coins/min = 50
    expect(calculateBaseReward(25, 2)).toBe(50)
    // 0 min -> 0 coins
    expect(calculateBaseReward(0)).toBe(0)
    // negative min -> 0 coins
    expect(calculateBaseReward(-10)).toBe(0)
  })

  it('calculates pure formula Retorno = Base(Tempo) * Multiplicadores(...) for paid contracts', () => {
    const contract: ProjectContract = {
      id: 'contract_junior_api',
      title: 'REST API Microservice',
      description: 'Build backend endpoints',
      durationMinutes: 25,
      baseReward: 100,
      stakeAmount: 50,
      baseXp: 120,
      isFreeTier: false,
    }

    const multipliers: EconomyMultipliers = {
      hardware: 0.1,
      software: 0.1,
      careerRole: 0.2,
      streak: 0.1, // total multiplier = 1 + 0.5 = 1.5
    }

    const result = calculateProjectReward({ contract, multipliers })

    // Gross reward = 100 * 1.5 = 150
    expect(result.grossReward).toBe(150)
    expect(result.stakeReturned).toBe(50)
    expect(result.netProfit).toBe(100) // 150 - 50 = 100
    expect(result.totalPayout).toBe(200) // 50 stake back + 150 reward = 200
    // ROI = (netProfit / stake) * 100 = (100 / 50) * 100 = 200%
    expect(result.roiPercentage).toBe(200)
    expect(result.multiplierApplied).toBe(1.5)
  })
})

describe('Economy Engine - Free Tier & Anti-Bankruptcy Protection', () => {
  it('provides predefined free tier projects with 0 DevCoins stake', () => {
    expect(FREE_TIER_PROJECTS.length).toBeGreaterThanOrEqual(2)
    FREE_TIER_PROJECTS.forEach((project) => {
      expect(project.stakeAmount).toBe(0)
      expect(project.isFreeTier).toBe(true)
      expect(project.baseReward).toBeGreaterThan(0)
      expect(project.baseXp).toBeGreaterThan(0)
    })
  })

  it('keeps free tier project rewards modest and immune to high-level multipliers (anti-spam balance)', () => {
    const freeProject = FREE_TIER_PROJECTS[0]!
    const highLevelMultipliers: EconomyMultipliers = {
      hardware: 1.5,
      software: 1.0,
      careerRole: 2.0,
      streak: 0.5, // total multiplier would be 6.0x
    }

    const result = calculateProjectReward({
      contract: freeProject,
      multipliers: highLevelMultipliers,
    })

    // Must NOT scale with multipliers: remains fixed modest reward
    expect(result.grossReward).toBe(freeProject.baseReward)
    expect(result.stakeReturned).toBe(0)
    expect(result.netProfit).toBe(freeProject.baseReward)
    expect(result.totalPayout).toBe(freeProject.baseReward)
    expect(result.roiPercentage).toBe(0) // Free tier has no monetary investment
    expect(result.multiplierApplied).toBe(1.0)
    expect(result.xpEarned).toBe(freeProject.baseXp)
  })

  it('correctly identifies bankruptcy state when coins are below minimum paid stake', () => {
    expect(isBankrupt(0, 50)).toBe(true)
    expect(isBankrupt(20, 50)).toBe(true)
    expect(isBankrupt(50, 50)).toBe(false)
    expect(isBankrupt(100, 50)).toBe(false)
  })

  it('retrieves bankruptcy rescue contracts that require 0 coins', () => {
    const rescueProjects = getBankruptcyRescueProjects()
    expect(rescueProjects.length).toBeGreaterThan(0)
    rescueProjects.forEach((proj) => {
      expect(proj.stakeAmount).toBe(0)
      expect(proj.isFreeTier).toBe(true)
    })
  })
})

describe('Economy Engine - Staking Logic & Risk of Loss', () => {
  it('checks if player can afford staking amount', () => {
    expect(canAffordStake(100, 50)).toBe(true)
    expect(canAffordStake(50, 50)).toBe(true)
    expect(canAffordStake(49, 50)).toBe(false)
    expect(canAffordStake(0, 0)).toBe(true) // Free tier always affordable
  })

  it('locks stake from player wallet balance', () => {
    const { remainingBalance, stakedAmount } = lockStake(150, 50)
    expect(remainingBalance).toBe(100)
    expect(stakedAmount).toBe(50)
  })

  it('throws error when attempting to lock more than available balance', () => {
    expect(() => lockStake(30, 50)).toThrow('Insufficient balance to lock stake')
  })

  it('resolves cancelled project with 100% loss of stake by default', () => {
    const result = cancelStake(100)
    expect(result.stakedAmount).toBe(100)
    expect(result.penaltyRate).toBe(1.0)
    expect(result.penaltyAmount).toBe(100)
    expect(result.refundedAmount).toBe(0)
  })

  it('supports custom penalty rate on cancellation if partial refund is configured', () => {
    const result = cancelStake(100, 0.6) // 60% penalty
    expect(result.stakedAmount).toBe(100)
    expect(result.penaltyRate).toBe(0.6)
    expect(result.penaltyAmount).toBe(60)
    expect(result.refundedAmount).toBe(40)
  })

  it('resolves completed project with full payout and balance addition', () => {
    const currentBalance = 200
    const contract: ProjectContract = {
      id: 'contract_algo',
      title: 'Algorithm Optimization',
      description: 'Optimize queries',
      durationMinutes: 25,
      baseReward: 80,
      stakeAmount: 40,
      baseXp: 100,
      isFreeTier: false,
    }

    const { newBalance, completionResult } = resolveCompletedProject({
      currentBalance,
      contract,
      multipliers: { hardware: 0.1, software: 0.1, careerRole: 0, streak: 0 },
    })

    // Multiplier = 1.2. Gross = 80 * 1.2 = 96. Total Payout = 40 (stake) + 96 = 136.
    // New Balance = 200 + 136 = 336
    expect(completionResult.grossReward).toBe(96)
    expect(completionResult.totalPayout).toBe(136)
    expect(newBalance).toBe(336)
    expect(completionResult.netProfit).toBe(56) // 96 - 40 = 56
  })
})

describe('Economy Engine - XP and Career Progression', () => {
  it('calculates session XP based on duration and multipliers for paid contracts', () => {
    // 25 mins -> 100 base XP. Multiplier 1.5 -> 150 XP
    const xp = calculateSessionXp({
      durationMinutes: 25,
      multipliers: { hardware: 0.1, software: 0.1, careerRole: 0.2, streak: 0.1 },
      isFreeTier: false,
    })
    expect(xp).toBe(150)
  })

  it('calculates session XP for free tier without bonus scaling', () => {
    const xp = calculateSessionXp({
      durationMinutes: 25,
      multipliers: { hardware: 1.0, software: 1.0, careerRole: 1.0, streak: 1.0 },
      isFreeTier: true,
      customBaseXp: 50,
    })
    expect(xp).toBe(50)
  })

  it('provides fast progression from Level 1 to Level 2 and progressive scaling thereafter', () => {
    expect(getXpRequiredForLevel(1)).toBe(0)
    expect(getXpRequiredForLevel(2)).toBe(200) // Fast transition from Stage 1 start
    expect(getXpRequiredForLevel(3)).toBe(500)
    expect(getXpRequiredForLevel(4)).toBe(1000)
    expect(getXpRequiredForLevel(5)).toBe(1800)
  })

  it('calculates correct player level from cumulative XP', () => {
    expect(calculateLevelFromXp(0)).toBe(1)
    expect(calculateLevelFromXp(199)).toBe(1)
    expect(calculateLevelFromXp(200)).toBe(2)
    expect(calculateLevelFromXp(499)).toBe(2)
    expect(calculateLevelFromXp(500)).toBe(3)
    expect(calculateLevelFromXp(1800)).toBe(5)
  })

  it('computes level progress bar metadata (current XP, next XP, percentage)', () => {
    const progress = getLevelProgress(350)
    // At 350 XP: Level 2 (200 to 500 XP).
    // Current in level = 150. Level span = 300. 150 / 300 = 50%
    expect(progress.level).toBe(2)
    expect(progress.stage).toBe('stage_1_university')
    expect(progress.currentLevelXp).toBe(150)
    expect(progress.nextLevelSpanXp).toBe(300)
    expect(progress.progressPercentage).toBe(50)
    expect(progress.totalXp).toBe(350)
  })

  it('maps levels to the 4 career stages accurately', () => {
    // Stage 1: Quarto Universitário (Levels 1 - 4)
    expect(getCareerStage(1)).toBe('stage_1_university')
    expect(getCareerStage(4)).toBe('stage_1_university')

    // Stage 2: Primeiro Home Office / Júnior (Levels 5 - 11)
    expect(getCareerStage(5)).toBe('stage_2_junior')
    expect(getCareerStage(11)).toBe('stage_2_junior')

    // Stage 3: Co-working / Startup (Levels 12 - 24)
    expect(getCareerStage(12)).toBe('stage_3_coworking')
    expect(getCareerStage(24)).toBe('stage_3_coworking')

    // Stage 4: Penthouse Tech Headquarters (Levels 25+)
    expect(getCareerStage(25)).toBe('stage_4_penthouse')
    expect(getCareerStage(50)).toBe('stage_4_penthouse')
  })

  it('maps levels to developer career titles', () => {
    expect(getCareerRole(1)).toBe('student')
    expect(getCareerRole(3)).toBe('intern')
    expect(getCareerRole(5)).toBe('junior')
    expect(getCareerRole(9)).toBe('mid_level')
    expect(getCareerRole(15)).toBe('senior')
    expect(getCareerRole(23)).toBe('tech_lead')
    expect(getCareerRole(31)).toBe('indie_founder')
  })

  it('handles edge cases across all formula branches', () => {
    // calculateMultiplier with no arguments
    expect(calculateMultiplier()).toBe(1.0)

    // calculateBaseReward with negative rate
    expect(calculateBaseReward(25, -2)).toBe(0)

    // calculateSessionXp defaults without customBaseXp
    expect(calculateSessionXp({ durationMinutes: 25, isFreeTier: true })).toBe(50) // 25 * 2
    expect(calculateSessionXp({ durationMinutes: 25, isFreeTier: false })).toBe(100) // 25 * 4

    // cancelStake penalty clamps
    expect(cancelStake(100, 1.5).penaltyRate).toBe(1.0)
    expect(cancelStake(100, -0.5).penaltyRate).toBe(0)
    expect(cancelStake(-50).stakedAmount).toBe(0)

    // lockStake with negative stake
    const lockedNegative = lockStake(100, -10)
    expect(lockedNegative.stakedAmount).toBe(0)
    expect(lockedNegative.remainingBalance).toBe(100)

    // isBankrupt default threshold
    expect(isBankrupt(49)).toBe(true)
    expect(isBankrupt(50)).toBe(false)

    // getXpRequiredForLevel edge levels
    expect(getXpRequiredForLevel(0)).toBe(0)
    expect(getXpRequiredForLevel(-5)).toBe(0)
    expect(getXpRequiredForLevel(120)).toBeGreaterThan(getXpRequiredForLevel(100))

    // calculateLevelFromXp with negative or 0
    expect(calculateLevelFromXp(-100)).toBe(1)

    // getLevelProgress with 0 or negative XP
    const zeroProgress = getLevelProgress(0)
    expect(zeroProgress.level).toBe(1)
    expect(zeroProgress.currentLevelXp).toBe(0)
    expect(zeroProgress.progressPercentage).toBe(0)

    const negProgress = getLevelProgress(-50)
    expect(negProgress.level).toBe(1)
    expect(negProgress.currentLevelXp).toBe(0)

    // calculateProjectReward without multipliers argument
    const freeProject = FREE_TIER_PROJECTS[0]!
    const defaultReward = calculateProjectReward({ contract: freeProject })
    expect(defaultReward.grossReward).toBe(freeProject.baseReward)
  })
})

