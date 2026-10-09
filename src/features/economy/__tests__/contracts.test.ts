import { describe, expect, it } from 'vitest'
import {
  STAGE_1_CONTRACT_CATALOG,
  FREE_TIER_PROJECTS,
  getContractsForStage,
  generateContractMarket,
  createDynamicContract,
  evaluateContractFinancials,
  getBankruptcyRescueProjects,
} from '../contracts'
import type { EconomyMultipliers, ProjectContract } from '../types'

describe('Contracts Catalog - Stage 1 (Dormitório / Universidade)', () => {
  it('contains university coursework, simple scripts, and freelance contracts for friends', () => {
    const universityContracts = STAGE_1_CONTRACT_CATALOG.filter((c) => c.category === 'university')
    const scriptContracts = STAGE_1_CONTRACT_CATALOG.filter((c) => c.category === 'script')
    const freelanceContracts = STAGE_1_CONTRACT_CATALOG.filter((c) => c.category === 'freelance')

    expect(universityContracts.length).toBeGreaterThanOrEqual(3)
    expect(scriptContracts.length).toBeGreaterThanOrEqual(3)
    expect(freelanceContracts.length).toBeGreaterThanOrEqual(3)
  })

  it('verifies all Stage 1 contracts have required fields, valid durations, and balanced economics', () => {
    STAGE_1_CONTRACT_CATALOG.forEach((contract) => {
      expect(contract.id).toBeTruthy()
      expect(contract.title).toBeTruthy()
      expect(contract.description).toBeTruthy()
      expect(contract.client).toBeTruthy()
      expect(contract.stage).toBe('stage_1_university')
      expect(contract.durationMinutes).toBeGreaterThanOrEqual(15)
      expect(contract.durationMinutes).toBeLessThanOrEqual(60)
      expect(contract.baseReward).toBeGreaterThan(0)
      expect(contract.baseXp).toBeGreaterThan(0)

      if (!contract.isFreeTier) {
        expect(contract.stakeAmount).toBeGreaterThan(0)
        expect(contract.baseReward).toBeGreaterThan(contract.stakeAmount)
      } else {
        expect(contract.stakeAmount).toBe(0)
      }
    })
  })

  it('retrieves stage contracts via getContractsForStage helper', () => {
    const stage1List = getContractsForStage('stage_1_university')
    expect(stage1List.length).toBeGreaterThanOrEqual(9)

    // Fallbacks to stage 1 if unknown or stage not yet fully implemented
    const unknownStage = getContractsForStage('stage_2_junior')
    expect(unknownStage.length).toBeGreaterThan(0)
  })
})

describe('Rotating Contract Market Engine (Tuber Simulator style)', () => {
  it('generates 3 to 4 contracts with varied durations and categories', () => {
    const market = generateContractMarket({ stage: 'stage_1_university', count: 4 })

    expect(market.length).toBe(4)

    // Should have varied durations
    const durations = market.map((c) => c.durationMinutes)
    const hasShort = durations.some((d) => d <= 20)
    const hasMedium = durations.some((d) => d >= 25 && d <= 30)
    const hasLong = durations.some((d) => d >= 40)

    expect(hasShort).toBe(true)
    expect(hasMedium).toBe(true)
    expect(hasLong).toBe(true)
  })

  it('guarantees unique contracts within the same generated batch', () => {
    const market = generateContractMarket({ count: 4, seed: 101 })
    const ids = market.map((c) => c.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(market.length)
  })

  it('supports avoiding contract IDs from the previous batch to ensure fresh rotation', () => {
    const firstMarket = generateContractMarket({ count: 3, seed: 1 })
    const firstIds = firstMarket.map((c) => c.id)

    const secondMarket = generateContractMarket({
      count: 3,
      seed: 2,
      avoidContractIds: firstIds,
    })

    const overlap = secondMarket.filter((c) => firstIds.includes(c.id))
    expect(overlap.length).toBeLessThan(firstMarket.length)
  })

  it('is deterministic when provided a fixed seed', () => {
    const marketA = generateContractMarket({ seed: 'codora-seed-42', count: 4 })
    const marketB = generateContractMarket({ seed: 'codora-seed-42', count: 4 })

    expect(marketA.map((c) => c.id)).toEqual(marketB.map((c) => c.id))
  })

  it('guarantees at least 1 free-tier / 0 stake contract if player has 0 coins or is bankrupt', () => {
    const bankruptMarket = generateContractMarket({
      stage: 'stage_1_university',
      playerCoins: 0,
      count: 4,
    })

    const hasAffordable = bankruptMarket.some((c) => c.stakeAmount === 0 || c.isFreeTier)
    expect(hasAffordable).toBe(true)
  })

  it('applies multipliers dynamically to calculate projected returns and ROI', () => {
    const multipliers: EconomyMultipliers = {
      hardware: 0.2, // +20%
      software: 0.1, // +10%
      careerRole: 0.1, // +10%
      streak: 0.1, // +10% -> total 1.5x
    }

    const market = generateContractMarket({
      stage: 'stage_1_university',
      count: 4,
      multipliers,
      seed: 1234,
    })

    market.forEach((contract) => {
      expect(contract.netProfit).toBeDefined()
      expect(contract.roiPercentage).toBeDefined()
      if (!contract.isFreeTier && contract.stakeAmount > 0) {
        expect(contract.roiPercentage).toBeGreaterThan(0)
      }
    })
  })
})

describe('Dynamic Pricing & Financial Evaluation', () => {
  const sampleContract: ProjectContract = {
    id: 'test_uni_project',
    title: 'Trabalho de BD',
    description: 'Modelagem relacional',
    durationMinutes: 25,
    baseReward: 60,
    stakeAmount: 30,
    baseXp: 80,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    riskLevel: 'medium',
  }

  it('evaluates contract financials with default multiplier', () => {
    const evalResult = evaluateContractFinancials(sampleContract)

    expect(evalResult.stakeReturned).toBe(30)
    expect(evalResult.grossReward).toBe(60)
    expect(evalResult.totalPayout).toBe(90) // 30 + 60
    expect(evalResult.netProfit).toBe(30) // 60 - 30
    expect(evalResult.roiPercentage).toBe(100) // (30 / 30) * 100
    expect(evalResult.xpEarned).toBe(80)
  })

  it('evaluates contract financials with custom economy multipliers', () => {
    const multipliers: EconomyMultipliers = {
      hardware: 0.25,
      software: 0.25,
      careerRole: 0.0,
      streak: 0.0, // total 1.5x
    }

    const evalResult = evaluateContractFinancials(sampleContract, multipliers)

    // Gross = 60 * 1.5 = 90
    expect(evalResult.grossReward).toBe(90)
    expect(evalResult.stakeReturned).toBe(30)
    expect(evalResult.totalPayout).toBe(120) // 30 + 90
    expect(evalResult.netProfit).toBe(60) // 90 - 30
    expect(evalResult.roiPercentage).toBe(200) // (60 / 30) * 100
    expect(evalResult.xpEarned).toBe(120) // 80 * 1.5
  })

  it('creates dynamic contract with customized duration and scaled rewards', () => {
    const dynamic = createDynamicContract(
      {
        id: 'dynamic_script',
        title: 'Script Dinâmico Custom',
        category: 'script',
        stage: 'stage_1_university',
        riskLevel: 'high',
      },
      {
        durationMinutes: 50,
        stakeRate: 1.2,
        roiRate: 1.5,
      }
    )

    expect(dynamic.durationMinutes).toBe(50)
    expect(dynamic.stakeAmount).toBeGreaterThan(0)
    expect(dynamic.baseReward).toBeGreaterThan(dynamic.stakeAmount)
    expect(dynamic.baseXp).toBeGreaterThan(0)
    expect(dynamic.isFreeTier).toBe(false)
  })

  it('preserves free-tier contracts in rescue lists', () => {
    const rescue = getBankruptcyRescueProjects()
    expect(rescue.length).toBe(FREE_TIER_PROJECTS.length)
    rescue.forEach((p) => {
      expect(p.isFreeTier).toBe(true)
      expect(p.stakeAmount).toBe(0)
    })
  })
})
