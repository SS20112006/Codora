import React from 'react'

export interface MonitorScreenBarAccessoryProps {
  isFocusing?: boolean
  className?: string
  transform?: string
  'data-testid'?: string
}

export const MonitorScreenBarAccessory: React.FC<MonitorScreenBarAccessoryProps> = ({
  isFocusing = false,
  className = '',
  transform = 'translate(472, 266)',
  'data-testid': testId = 'equipped-screenbar-lamp',
}) => {
  return (
    <g
      id="equipped-screenbar-lamp"
      data-testid={testId}
      transform={transform}
      className={`screenbar-lamp-accessory transition-all duration-300 ${className}`}
      role="img"
      aria-label="Lâmpada de Monitor ScreenBar LED equipada no ecrã"
    >
      <defs>
        {/* Aluminum Anodized Housing Gradient */}
        <linearGradient id="screenbarHousingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="30%" stopColor="#475569" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* LED Light Strip Warm Glow */}
        <linearGradient id="screenbarLedStripGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        {/* Asymmetrical Downward Light Cone */}
        <linearGradient id="screenbarDownlightGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity={isFocusing ? '0.75' : '0.55'} />
          <stop offset="35%" stopColor="#fed7aa" stopOpacity={isFocusing ? '0.35' : '0.22'} />
          <stop offset="100%" stopColor="#fdba74" stopOpacity="0" />
        </linearGradient>

        {/* Warm Pool of Light on Desk and Keyboard Surface */}
        <radialGradient id="screenbarDeskPoolGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity={isFocusing ? '0.6' : '0.4'} />
          <stop offset="65%" stopColor="#fed7aa" stopOpacity={isFocusing ? '0.25' : '0.12'} />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Downward Asymmetric Light Beam Cone hitting the desk/keyboard */}
      <polygon
        points="43,8 -25,72 110,72"
        fill="url(#screenbarDownlightGrad)"
        className="pointer-events-none transition-opacity duration-500"
      />

      {/* Pool of Warm Illumination on Keyboard Area */}
      <ellipse
        cx="43"
        cy="70"
        rx="68"
        ry="12"
        fill="url(#screenbarDeskPoolGrad)"
        className="pointer-events-none transition-opacity duration-500"
      />

      {/* 2. Patented Counterweight Gravity Mount Clamp (Clips firmly to display top) */}
      <g id="screenbar-gravity-clip">
        {/* Clamp Base / Pivot Ring */}
        <rect x="36" y="5" width="14" height="7" rx="2" fill="#0f172a" stroke="#020617" strokeWidth="0.8" />
        {/* Rear Counterweight Cylinder */}
        <rect x="38" y="7" width="10" height="9" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
        <line x1="39" y1="10" x2="47" y2="10" stroke="#475569" strokeWidth="0.8" />
      </g>

      {/* 3. Main Horizontal Cylindrical Aluminum Light Bar */}
      <rect
        x="0"
        y="0"
        width="86"
        height="6"
        rx="3"
        fill="url(#screenbarHousingGrad)"
        stroke="#0f172a"
        strokeWidth="0.8"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
      />

      {/* Top Metallic Bevel Highlight */}
      <line x1="2" y1="1" x2="84" y2="1" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />

      {/* 4. Downward High-CRI LED Strip Aperture */}
      <rect
        x="3"
        y="4.5"
        width="80"
        height="1.5"
        rx="0.5"
        fill="url(#screenbarLedStripGrad)"
        filter="drop-shadow(0 0 2px rgba(254, 240, 138, 0.9))"
      />

      {/* 5. Capacitive Touch Sensor Control Dial on Right Edge */}
      <circle cx="80" cy="3" r="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
      <circle cx="80" cy="3" r="0.6" fill="#ffffff" />
    </g>
  )
}
