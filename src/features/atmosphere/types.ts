export type WindowLightingMode = 'realtime' | 'day' | 'sunset' | 'night'
export type RoomAmbience = 'day' | 'sunset' | 'night'

export interface AtmosphereModeOption {
  id: WindowLightingMode
  label: string
  shortLabel: string
  description: string
}
