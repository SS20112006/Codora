import type { CareerRole, CareerStage } from '@/features/economy/types'

export const getRoleLabel = (role: CareerRole): string => {
  switch (role) {
    case 'student':
      return 'Estudante'
    case 'intern':
      return 'Estagiário'
    case 'junior':
      return 'Júnior'
    case 'mid_level':
      return 'Pleno'
    case 'senior':
      return 'Sénior'
    case 'tech_lead':
      return 'Tech Lead'
    case 'indie_founder':
      return 'Indie Founder'
  }
}

export const getStageLabel = (stage: CareerStage): string => {
  switch (stage) {
    case 'stage_1_university':
      return 'Fase 1: Quarto Universitário'
    case 'stage_2_junior':
      return 'Fase 2: Home Office Júnior'
    case 'stage_3_coworking':
      return 'Fase 3: Escritório Co-working'
    case 'stage_4_penthouse':
      return 'Fase 4: Penthouse Tech'
  }
}
