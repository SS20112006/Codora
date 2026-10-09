import type { ProjectContract } from './types'

/**
 * Predefined free-tier contracts (0 DevCoins stake, modest payout, basic XP).
 * Specifically designed for beginners and bankruptcy rescue.
 */
export const FREE_TIER_PROJECTS: readonly ProjectContract[] = [
  {
    id: 'free_typo_fix',
    title: 'Correção de Typo Open-Source',
    description: 'Corrigir documentação e strings no README de uma biblioteca comunitária.',
    durationMinutes: 15,
    baseReward: 8,
    stakeAmount: 0,
    baseXp: 30,
    isFreeTier: true,
  },
  {
    id: 'free_bugfix_sprint',
    title: 'Exercício de Algoritmos & Bugfix',
    description: 'Resolver bugs triviais e testes unitários simples para treinar raciocínio.',
    durationMinutes: 25,
    baseReward: 15,
    stakeAmount: 0,
    baseXp: 50,
    isFreeTier: true,
  },
  {
    id: 'free_refactor_script',
    title: 'Script de Automação Interna',
    description: 'Escrever script bash / python para automatizar tarefas repetitivas.',
    durationMinutes: 45,
    baseReward: 25,
    stakeAmount: 0,
    baseXp: 80,
    isFreeTier: true,
  },
] as const

/**
 * Retrieves zero-stake rescue contracts available during bankruptcy or new game start.
 */
export function getBankruptcyRescueProjects(): ProjectContract[] {
  return [...FREE_TIER_PROJECTS]
}
