import { calculateProjectReward } from './formulas'
import { isBankrupt } from './staking'
import type {
  CareerStage,
  ContractFinancials,
  EconomyMultipliers,
  MarketGenerationOptions,
  ProjectContract,
} from './types'

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
    stage: 'stage_1_university',
    category: 'open_source',
    client: 'Comunidade Open Source',
    riskLevel: 'low',
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
    stage: 'stage_1_university',
    category: 'university',
    client: 'Monitor da Cadeira',
    riskLevel: 'low',
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
    stage: 'stage_1_university',
    category: 'script',
    client: 'República de Estudantes',
    riskLevel: 'low',
  },
] as const

/**
 * Catálogo Contextual de Projetos da Fase 1 (Dormitório / Universidade)
 * Estilo Tuber Simulator:
 * - Trabalhos de faculdade
 * - Scripts simples
 * - Pequenos freelances para amigos
 */
export const STAGE_1_CONTRACT_CATALOG: readonly ProjectContract[] = [
  // --- TRABALHOS DE FACULDADE ---
  {
    id: 's1_uni_aed_tree',
    title: 'Árvores Binárias de AED',
    description: 'Implementar rotações AVL e travessia em largura para o trabalho prático.',
    durationMinutes: 25,
    baseReward: 35,
    stakeAmount: 15,
    baseXp: 65,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Prof. Alberto (AED)',
    riskLevel: 'low',
  },
  {
    id: 's1_uni_math_matrix',
    title: 'Calculadora de Matrizes em C',
    description: 'Resolver sistemas lineares com eliminação de Gauss e determinante.',
    durationMinutes: 15,
    baseReward: 22,
    stakeAmount: 10,
    baseXp: 40,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Departamento de Matemática',
    riskLevel: 'low',
  },
  {
    id: 's1_uni_so_scheduler',
    title: 'Escalonador Round-Robin em C',
    description: 'Simular troca de contexto preemptiva e filas de prioridade de processos.',
    durationMinutes: 50,
    baseReward: 95,
    stakeAmount: 40,
    baseXp: 160,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Cadeira de Sistemas Operativos',
    riskLevel: 'medium',
  },
  {
    id: 's1_uni_networks_socket',
    title: 'Servidor Socket TCP Multi-Client',
    description: 'Criar sala de chat em terminal com sockets POSIX e threads sincronizadas.',
    durationMinutes: 30,
    baseReward: 48,
    stakeAmount: 20,
    baseXp: 85,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Laboratório de Redes',
    riskLevel: 'medium',
  },
  {
    id: 's1_uni_db_schema',
    title: 'Modelação Relacional SQL & Normalização',
    description: 'Desenhar diagrama E/R na 3ª forma normal para a biblioteca da universidade.',
    durationMinutes: 20,
    baseReward: 28,
    stakeAmount: 12,
    baseXp: 50,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'university',
    client: 'Prof. Vasconcelos (Bases de Dados)',
    riskLevel: 'low',
  },

  // --- SCRIPTS SIMPLES ---
  {
    id: 's1_script_pdf_merge',
    title: 'Automação de Slides & PDFs em Python',
    description: 'Script para mesclar enunciados, comprimir e gerar sumários automáticos.',
    durationMinutes: 15,
    baseReward: 24,
    stakeAmount: 10,
    baseXp: 45,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'script',
    client: 'Colega de Quarto',
    riskLevel: 'low',
  },
  {
    id: 's1_script_scraper_grades',
    title: 'Web Scraper de Pautas Académicas',
    description: 'Bot que monitoriza a página do portal do aluno e avisa quando as notas saem.',
    durationMinutes: 25,
    baseReward: 42,
    stakeAmount: 18,
    baseXp: 75,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'script',
    client: 'Comissão de Curso',
    riskLevel: 'medium',
  },
  {
    id: 's1_script_discord_bot',
    title: 'Bot de Discord para a Guilda',
    description: 'Comandos de música, memes do curso e rolagem de dados em TypeScript.',
    durationMinutes: 30,
    baseReward: 55,
    stakeAmount: 25,
    baseXp: 95,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'script',
    client: 'Servidor Discord Académico',
    riskLevel: 'medium',
  },
  {
    id: 's1_script_backup_cron',
    title: 'Script de Backup Automático para USB',
    description: 'Automação rsync com deduplicação e alertas sonoros no macOS/Linux.',
    durationMinutes: 20,
    baseReward: 30,
    stakeAmount: 12,
    baseXp: 55,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'script',
    client: 'Colega de Laboratório',
    riskLevel: 'low',
  },

  // --- PEQUENOS FREELANCES PARA AMIGOS ---
  {
    id: 's1_free_designer_portfolio',
    title: 'Website Portfólio Minimalista',
    description: 'Página estática com animações suaves e galeria de fotos para amigo designer.',
    durationMinutes: 25,
    baseReward: 65,
    stakeAmount: 25,
    baseXp: 100,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'freelance',
    client: 'Tomás (Colega de Design)',
    riskLevel: 'medium',
  },
  {
    id: 's1_free_vintage_shop',
    title: 'Landing Page de Roupa Vintage',
    description: 'Criar montra responsiva com integração de WhatsApp para pedidos diretos.',
    durationMinutes: 45,
    baseReward: 110,
    stakeAmount: 45,
    baseXp: 180,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'freelance',
    client: 'Prima Sofia (Boutique)',
    riskLevel: 'high',
  },
  {
    id: 's1_free_cafe_qr',
    title: 'Menu Digital com QR Code',
    description: 'Cardápio digital mobile-first com filtros de alergénios para o café da esquina.',
    durationMinutes: 25,
    baseReward: 60,
    stakeAmount: 25,
    baseXp: 95,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'freelance',
    client: 'Café Central do Campus',
    riskLevel: 'medium',
  },
  {
    id: 's1_free_blog_fix',
    title: 'Conserto de CSS Responsivo de Blog',
    description: 'Corrigir overflow horizontal e menus colapsáveis quebrados em telemóveis.',
    durationMinutes: 15,
    baseReward: 32,
    stakeAmount: 12,
    baseXp: 50,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'freelance',
    client: 'Inês (Blogger de Livros)',
    riskLevel: 'low',
  },
  {
    id: 's1_free_shopify_setup',
    title: 'Configuração de Loja de Canecas',
    description: 'Personalizar tema e configurar domínio próprio para amigo da república.',
    durationMinutes: 50,
    baseReward: 135,
    stakeAmount: 55,
    baseXp: 210,
    isFreeTier: false,
    stage: 'stage_1_university',
    category: 'freelance',
    client: 'Pedro da República',
    riskLevel: 'high',
  },
] as const

/**
 * Stage catalogs mapping for current and future career milestones.
 */
export const STAGE_CONTRACT_CATALOGS: Record<CareerStage, readonly ProjectContract[]> = {
  stage_1_university: STAGE_1_CONTRACT_CATALOG,
  stage_2_junior: STAGE_1_CONTRACT_CATALOG, // Fallback to stage 1 until stage 2 is fleshed out in task 16
  stage_3_coworking: STAGE_1_CONTRACT_CATALOG, // Fallback until task 17
  stage_4_penthouse: STAGE_1_CONTRACT_CATALOG, // Fallback until task 18
}

/**
 * Retrieves all predefined contracts available for a given stage.
 */
export function getContractsForStage(stage: CareerStage = 'stage_1_university'): ProjectContract[] {
  const catalog = STAGE_CONTRACT_CATALOGS[stage] ?? STAGE_1_CONTRACT_CATALOG
  return [...catalog]
}

/**
 * Retrieves zero-stake rescue contracts available during bankruptcy or new game start.
 */
export function getBankruptcyRescueProjects(): ProjectContract[] {
  return [...FREE_TIER_PROJECTS]
}

/**
 * Evaluates full financials (gross reward, ROI, net profit, XP) for a contract.
 */
export function evaluateContractFinancials(
  contract: ProjectContract,
  multipliers: Partial<EconomyMultipliers> = {}
): ContractFinancials {
  const result = calculateProjectReward({ contract, multipliers })
  return {
    grossReward: result.grossReward,
    stakeReturned: result.stakeReturned,
    netProfit: result.netProfit,
    totalPayout: result.totalPayout,
    roiPercentage: result.roiPercentage,
    xpEarned: result.xpEarned,
    multiplierApplied: result.multiplierApplied,
  }
}

/**
 * Creates a dynamically adjusted contract with custom duration, risk and financial scaling.
 */
export function createDynamicContract(
  template: Partial<ProjectContract> & { id: string; title: string },
  options: {
    durationMinutes?: number
    stakeRate?: number
    roiRate?: number
    multipliers?: Partial<EconomyMultipliers>
  } = {}
): ProjectContract {
  const duration = Math.max(15, options.durationMinutes ?? template.durationMinutes ?? 25)
  const isFree = template.isFreeTier ?? false

  const baseStake = isFree ? 0 : Math.round(duration * (options.stakeRate ?? 1.0))
  const multiplier = options.roiRate ?? 1.5
  const baseReward = isFree
    ? Math.round(duration * 0.8)
    : Math.round(baseStake * multiplier)
  const baseXp = Math.round(duration * 3.5)

  const contract: ProjectContract = {
    id: template.id,
    title: template.title,
    description: template.description ?? 'Contrato de desenvolvimento focado e prático.',
    durationMinutes: duration,
    stakeAmount: baseStake,
    baseReward,
    baseXp,
    isFreeTier: isFree,
    stage: template.stage ?? 'stage_1_university',
    category: template.category ?? 'freelance',
    client: template.client ?? 'Cliente Local',
    riskLevel: template.riskLevel ?? 'medium',
  }

  const financials = evaluateContractFinancials(contract, options.multipliers)
  contract.netProfit = financials.netProfit
  contract.roiPercentage = financials.roiPercentage

  return contract
}

/**
 * PRNG pseudo-random generator for deterministic seeds.
 */
function createSeededRandom(seed: number | string): () => number {
  let hash = 0
  const str = String(seed)
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  let s = Math.abs(hash) || 123456789

  return function next(): number {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/**
 * Shuffles an array with an optional PRNG.
 */
function shuffle<T>(array: T[], randomFn: () => number): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1))
    const temp = result[i]!
    result[i] = result[j]!
    result[j] = temp
  }
  return result
}

/**
 * Sistema de mercado rotativo:
 * Gera 3 a 4 contratos com durações (curtas, médias, longas) e rentabilidades variadas.
 * Associa custo de staking e recompensas calculadas dinamicamente.
 */
export function generateContractMarket(
  options: MarketGenerationOptions = {}
): ProjectContract[] {
  const {
    stage = 'stage_1_university',
    playerCoins = 0,
    count = 4,
    seed,
    avoidContractIds = [],
    multipliers = {},
    forceIncludeFreeTier,
  } = options

  const randomFn = seed !== undefined ? createSeededRandom(seed) : Math.random
  const catalog = getContractsForStage(stage)
  const mustIncludeFreeTier =
    forceIncludeFreeTier || isBankrupt(playerCoins, 15) || playerCoins < 10

  // Filter out avoided contracts unless catalog is too small
  let eligible = catalog.filter((c) => !avoidContractIds.includes(c.id))
  if (eligible.length < count) {
    eligible = [...catalog]
  }

  // Partition by duration to guarantee variety
  const shortContracts = shuffle(
    eligible.filter((c) => c.durationMinutes <= 20),
    randomFn
  )
  const mediumContracts = shuffle(
    eligible.filter((c) => c.durationMinutes >= 25 && c.durationMinutes <= 30),
    randomFn
  )
  const longContracts = shuffle(
    eligible.filter((c) => c.durationMinutes >= 40),
    randomFn
  )

  const selected: ProjectContract[] = []
  const usedIds = new Set<string>()

  const addContract = (contract?: ProjectContract) => {
    if (contract && !usedIds.has(contract.id)) {
      selected.push(contract)
      usedIds.add(contract.id)
    }
  }

  // 1. If player is broke/bankrupt, guarantee a free tier contract in the market
  if (mustIncludeFreeTier) {
    const freePool = shuffle([...FREE_TIER_PROJECTS], randomFn)
    const freeContract = freePool.find((c) => !avoidContractIds.includes(c.id)) ?? freePool[0]
    addContract(freeContract)
  }

  // 2. Add at least 1 short contract
  addContract(shortContracts[0])

  // 3. Add at least 1 medium contract
  addContract(mediumContracts[0])

  // 4. Add at least 1 long contract
  addContract(longContracts[0])

  // 5. Fill remaining slots up to requested count
  const remainingPool = shuffle(
    eligible.filter((c) => !usedIds.has(c.id)),
    randomFn
  )

  for (const extra of remainingPool) {
    if (selected.length >= count) break
    addContract(extra)
  }

  // Fallback if still under target count
  if (selected.length < count) {
    for (const fallback of catalog) {
      if (selected.length >= count) break
      addContract(fallback)
    }
  }

  // Enrich contracts with dynamic financial valuation
  return selected.slice(0, count).map((contract) => {
    const financials = evaluateContractFinancials(contract, multipliers)
    return {
      ...contract,
      netProfit: financials.netProfit,
      roiPercentage: financials.roiPercentage,
    }
  })
}
