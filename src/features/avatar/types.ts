import type React from 'react'

export type AvatarState = 'coding' | 'resting' | 'idle'

export type AvatarFootwear = 'slides_with_socks' | 'sneakers' | 'crocs'

export interface AvatarAccessories {
  /** Head accessory (e.g. custom headphones, cap, beanie) */
  head?: React.ReactNode
  /** Body accessory (e.g. conference lanyard, chest badge, scarf) */
  body?: React.ReactNode
  /** Custom additional accessories positioned relative to avatar */
  custom?: React.ReactNode
}

export interface CoderAvatarProps {
  className?: string
  /** Active animation state: 'coding' (rapid typing), 'resting' (relaxed pause), 'idle' */
  state?: AvatarState
  /** Convenience flag: if true, forces 'coding' state; if false and state is omitted, defaults to 'resting' */
  isFocusing?: boolean
  /** Whether the avatar is wearing studio/gaming over-ear headphones */
  hasHeadphones?: boolean
  /** Footwear style: Harvard dorm classic slides with socks, sneakers, or crocs */
  footwear?: AvatarFootwear
  /** Primary hoodie color (defaults to classic college dark slate #1e293b) */
  hoodieColor?: string
  /** Modular accessories slots for head, body, or custom decor */
  accessories?: AvatarAccessories
  /** Optional SVG transform attribute */
  transform?: string
  /** Test identifier */
  'data-testid'?: string
}
