import type {
  ProjectContract,
  ProjectCompletionResult,
  ProjectCancellationResult,
  EconomyMultipliers,
} from './types'
import { calculateProjectReward } from './formulas'

/**
 * Validates if the player's balance is sufficient to cover the required stake.
 */
export function canAffordStake(balance: number, stakeAmount: number): boolean {
  if (stakeAmount <= 0) return true
  return balance >= stakeAmount
}

/**
 * Deducts and locks stake coins from the player wallet.
 * Throws an Error if balance is insufficient.
 */
export function lockStake(
  balance: number,
  stakeAmount: number
): { remainingBalance: number; stakedAmount: number } {
  if (!canAffordStake(balance, stakeAmount)) {
    throw new Error('Insufficient balance to lock stake')
  }

  const sanitizedStake = Math.max(0, stakeAmount)
  return {
    remainingBalance: balance - sanitizedStake,
    stakedAmount: sanitizedStake,
  }
}

/**
 * Resolves a cancelled project with risk of loss.
 * By default penaltyRate is 1.0 (100% loss of initial stake).
 */
export function cancelStake(
  stakedAmount: number,
  penaltyRate = 1.0
): ProjectCancellationResult {
  const safeStake = Math.max(0, stakedAmount)
  const clampedPenaltyRate = Math.min(1.0, Math.max(0, penaltyRate))
  const penaltyAmount = Math.round(safeStake * clampedPenaltyRate)
  const refundedAmount = safeStake - penaltyAmount

  return {
    stakedAmount: safeStake,
    penaltyRate: clampedPenaltyRate,
    penaltyAmount,
    refundedAmount,
  }
}

/**
 * Resolves project completion by adding total payout to player balance.
 */
export function resolveCompletedProject(params: {
  currentBalance: number
  contract: ProjectContract
  multipliers?: Partial<EconomyMultipliers>
}): {
  newBalance: number
  completionResult: ProjectCompletionResult
} {
  const { currentBalance, contract, multipliers } = params
  const completionResult = calculateProjectReward({ contract, multipliers })
  const newBalance = currentBalance + completionResult.totalPayout

  return {
    newBalance,
    completionResult,
  }
}

/**
 * Checks whether the player is in bankruptcy (cannot afford the minimum paid stake).
 */
export function isBankrupt(balance: number, minRequiredStake = 50): boolean {
  return balance < minRequiredStake
}
