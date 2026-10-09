import React from 'react'

export interface Stage1RoomSlots {
  /** Slot for coder avatar (Task 07) */
  avatar?: React.ReactNode
  /** Slot for window ambience / day-night sky (Task 08) */
  windowAmbience?: React.ReactNode
  /** Slot for secondary monitor accessory (Task 12) */
  secondMonitor?: React.ReactNode
  /** Slot for desk lamp or monitor lightbar (Task 08/12) */
  deskLamp?: React.ReactNode
  /** Slot for coffee mug / drink accessory (Task 12) */
  coffeeMug?: React.ReactNode
  /** Slot for headphones hanging on chair or desk (Task 12) */
  headphones?: React.ReactNode
  /** Slot for wall decorations / posters */
  wallDecor?: React.ReactNode
  /** Slot for floor decorations / rug */
  floorDecor?: React.ReactNode
}

export interface Stage1DormRoomProps {
  className?: string
  /** Whether the user is actively in a focus sprint */
  isFocusing?: boolean
  /** Lighting ambience mode */
  ambience?: 'night' | 'day' | 'sunset'
  /** Custom slots for future modular upgrades */
  slots?: Stage1RoomSlots
  /** Test identifier */
  'data-testid'?: string
}
