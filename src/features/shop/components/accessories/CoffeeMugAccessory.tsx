import React from 'react'

export interface CoffeeMugAccessoryProps {
  isFocusing?: boolean
  className?: string
  transform?: string
  'data-testid'?: string
}

export const CoffeeMugAccessory: React.FC<CoffeeMugAccessoryProps> = ({
  isFocusing = false,
  className = '',
  transform = 'translate(400, 314)',
  'data-testid': testId = 'equipped-coffee-mug',
}) => {
  return (
    <g
      id="equipped-coffee-mug"
      data-testid={testId}
      transform={transform}
      className={`coffee-mug-accessory transition-all duration-300 ${className}`}
      role="img"
      aria-label="Caneca de Café Artesanal equipada na secretária"
    >
      <defs>
        {/* Artisan Ceramic Glaze Gradient */}
        <linearGradient id="artisanCeramicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="40%" stopColor="#0d9488" />
          <stop offset="85%" stopColor="#115e59" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>

        {/* Coffee Liquid & Crema Swirl */}
        <linearGradient id="espressoCremaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#291002" />
        </linearGradient>

        {/* Ceramic Highlight */}
        <linearGradient id="mugHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Desk Surface Contact Shadow */}
      <ellipse cx="9" cy="22" rx="10" ry="2.5" fill="#1e1005" opacity="0.6" />

      {/* Ergonomic Curved Handle */}
      <path
        d="M 1 7 C -8 7 -8 18 1 18"
        fill="none"
        stroke="url(#artisanCeramicGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Handle subtle inner shadow */}
      <path
        d="M 1 8 C -6 8 -6 17 1 17"
        fill="none"
        stroke="#115e59"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Ceramic Mug Body */}
      <rect
        x="1"
        y="4"
        width="18"
        height="18"
        rx="2.5"
        fill="url(#artisanCeramicGrad)"
        stroke="#042f2e"
        strokeWidth="1"
      />

      {/* Ceramic Specular Highlight on Left Contour */}
      <path
        d="M 3 5 L 3 20"
        stroke="#5eead4"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Golden Brass Inlay Minimalist Coder Emblem: </> */}
      <path
        d="M 8 13 L 6 15 L 8 17 M 12 13 L 14 15 L 12 17 M 11 12 L 9 18"
        stroke="#fde047"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Mug Rim Lip */}
      <ellipse
        cx="10"
        cy="4.5"
        rx="8.5"
        ry="2.5"
        fill="#14b8a6"
        stroke="#042f2e"
        strokeWidth="0.8"
      />

      {/* Rich Espresso Liquid Surface */}
      <ellipse
        cx="10"
        cy="4.5"
        rx="7.5"
        ry="2"
        fill="url(#espressoCremaGrad)"
      />

      {/* Crema Heart / Latte Art Swirl */}
      <path
        d="M 8 4.5 Q 10 3.5 12 4.5 Q 10 5.5 8 4.5"
        stroke="#fbbf24"
        strokeWidth="0.8"
        fill="none"
        opacity="0.8"
      />

      {/* Steam Wisps (Rises gracefully, pulses when focusing) */}
      <g
        id="coffee-steam"
        className={isFocusing ? 'animate-pulse' : ''}
        opacity={isFocusing ? 0.75 : 0.4}
      >
        <path
          d="M 7 1 Q 9 -4 7 -9 M 11 2 Q 13 -3 11 -8 M 14 1 Q 16 -3 14 -7"
          stroke="#e0f2fe"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </g>
  )
}
