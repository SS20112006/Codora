import React from 'react'

export interface HeadphonesAccessoryProps {
  className?: string
  transform?: string
  'data-testid'?: string
}

export const HeadphonesAccessory: React.FC<HeadphonesAccessoryProps> = ({
  className = '',
  transform = 'translate(680, 325)',
  'data-testid': testId = 'equipped-headphones-accessory',
}) => {
  return (
    <g
      id="equipped-headphones-accessory"
      data-testid={testId}
      transform={transform}
      className={`headphones-accessory transition-all duration-300 ${className}`}
      role="img"
      aria-label="Headphones Estúdio Pro equipamento e suporte na secretária"
    >
      <defs>
        {/* Headphone Stand Metallic Gradient */}
        <linearGradient id="headphoneStandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Audio Cable Gradient */}
        <linearGradient id="audioCableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Desk Surface Contact Shadow */}
      <ellipse cx="15" cy="18" rx="14" ry="3.5" fill="#1e1005" opacity="0.5" />

      {/* 1. Minimalist Aluminum Audio Stand / Headphone Hook */}
      <ellipse cx="15" cy="17" rx="12" ry="3" fill="url(#headphoneStandGrad)" stroke="#1e293b" strokeWidth="0.8" />
      <line x1="15" y1="17" x2="15" y2="2" stroke="url(#headphoneStandGrad)" strokeWidth="3" strokeLinecap="round" />
      {/* Top Curved Resting Cradle */}
      <path
        d="M 8 2 Q 15 -3 22 2"
        stroke="#475569"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. Coiled Braided Studio Audio Cable draping over desk toward laptop */}
      <path
        d="M 12 15 Q -10 18 -40 12 Q -80 8 -130 0"
        stroke="url(#audioCableGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* 3. Gold-Plated 3.5mm TRS Studio Jack Adapter */}
      <rect x="-135" y="-1.5" width="6" height="3" rx="0.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
      <rect x="-138" y="-1" width="3" height="2" rx="0.3" fill="#cbd5e1" />

      {/* 4. Audio Status Indicator LED (Studio Monitoring Active) */}
      <circle cx="15" cy="14" r="1.2" fill="#a855f7" filter="drop-shadow(0 0 2px rgba(168, 85, 247, 0.9))" />
    </g>
  )
}
