import type { AtmosphereModeOption, RoomAmbience, WindowLightingMode } from './types'

export const ATMOSPHERE_MODES: readonly AtmosphereModeOption[] = [
  {
    id: 'realtime',
    label: 'Modo Automático (Relógio)',
    shortLabel: 'Automático',
    description: 'Segue o relógio do sistema (Dia claro, Golden Hour, Noite escura com estrelas)',
  },
  {
    id: 'night',
    label: 'Sempre Noite Aconchegante',
    shortLabel: 'Noite',
    description: 'Céu noturno com estrelas, lua crescente e candeeiro com luz quente',
  },
  {
    id: 'sunset',
    label: 'Sempre Pôr do Sol',
    shortLabel: 'Pôr do Sol',
    description: 'Golden hour com céu quente alaranjado e luz suave',
  },
  {
    id: 'day',
    label: 'Sempre Dia',
    shortLabel: 'Dia',
    description: 'Luz natural de dia claro e sol radiante',
  },
] as const

/**
 * Resolves room ambience based on system time:
 * - 07:00 - 17:59: 'day' (Dia claro)
 * - 18:00 - 20:59: 'sunset' (Golden Hour)
 * - 21:00 - 06:59: 'night' (Noite escura com estrelas)
 */
export function resolveAmbienceFromDate(date: Date = new Date()): RoomAmbience {
  const hours = date.getHours()
  if (hours >= 7 && hours < 18) {
    return 'day'
  }
  if (hours >= 18 && hours < 21) {
    return 'sunset'
  }
  return 'night'
}

/**
 * Resolves the effective room ambience:
 * Either fixed manual mode or real-time computed from current clock.
 */
export function resolveEffectiveAmbience(
  mode: WindowLightingMode,
  date: Date = new Date()
): RoomAmbience {
  if (mode === 'realtime') {
    return resolveAmbienceFromDate(date)
  }
  return mode
}

/**
 * Determines whether the desk lamp should turn on with warm interior light:
 * Turns on during night ambience, creating a cozy warm working desk environment.
 */
export function isDeskLampActive(ambience: RoomAmbience): boolean {
  return ambience === 'night'
}
