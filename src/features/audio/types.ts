import type { LoFiTrackId, AmbientChannelsState, AudioSettings } from '@/features/state/types'

export type SoundEffectType = 'coin' | 'levelUp' | 'click' | 'alarm'

export type AmbientSoundType = 'rain' | 'keyboard' | 'cafe'

export interface LoFiTrackInfo {
  id: LoFiTrackId
  title: string
  bpm: number
  description: string
}

export const LOFI_TRACKS: Record<LoFiTrackId, LoFiTrackInfo> = {
  chill: {
    id: 'chill',
    title: 'Chill Hop Vibes',
    bpm: 72,
    description: 'Acordes suaves de Rhodes jazz e texturas quentes de vinil.',
  },
  deepFocus: {
    id: 'deepFocus',
    title: 'Foco Profundo',
    bpm: 64,
    description: 'Progressão harmónica meditativa e envolvente para concentração máxima.',
  },
  midnight: {
    id: 'midnight',
    title: 'Sessão da Madrugada',
    bpm: 78,
    description: 'Vibe noturna intimista com graves aveludados e notas sonhadoras.',
  },
}

export interface AudioMixerModalProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export type { LoFiTrackId, AmbientChannelsState, AudioSettings }
