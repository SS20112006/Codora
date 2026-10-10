import React from 'react'

export interface SecondMonitorAccessoryProps {
  isFocusing?: boolean
  className?: string
  transform?: string
  'data-testid'?: string
}

export const SecondMonitorAccessory: React.FC<SecondMonitorAccessoryProps> = ({
  isFocusing = false,
  className = '',
  transform = 'translate(600, 205)',
  'data-testid': testId = 'equipped-second-monitor',
}) => {
  return (
    <g
      id="equipped-second-monitor"
      data-testid={testId}
      transform={transform}
      className={`second-monitor-accessory transition-all duration-300 ${className}`}
      role="img"
      aria-label="Segundo Monitor Vertical 4K equipado na secretária"
    >
      <defs>
        {/* Monitor Arm Metallic Gradient */}
        <linearGradient id="monitorStandArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Screen Bezel Gradient */}
        <linearGradient id="monitorBezelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Vertical Screen Background Gradient */}
        <linearGradient id="verticalScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#050811" />
          <stop offset="100%" stopColor="#090e1a" />
        </linearGradient>

        {/* Screen Surface Reflection */}
        <linearGradient id="monitorGlassReflectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.01" />
        </linearGradient>

        {/* Secondary Screen Glow on Desk */}
        <radialGradient id="secondMonitorDeskGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity={isFocusing ? '0.35' : '0.18'} />
          <stop offset="60%" stopColor="#0ea5e9" stopOpacity={isFocusing ? '0.15' : '0.06'} />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Heavy Desk Mount Clamp and Articulated Gas-Spring Arm */}
      <g id="monitor-arm-stand">
        {/* Desk Edge Clamp (anchored to desk top surface y=131 in this local coordinate space) */}
        <rect x="26" y="125" width="16" height="14" rx="2" fill="#0f172a" stroke="#020617" strokeWidth="1" />
        <rect x="28" y="127" width="12" height="4" rx="1" fill="#475569" />

        {/* Lower Arm Segment */}
        <path
          d="M 34 125 L 34 85 Q 34 80 38 78 L 44 74"
          stroke="url(#monitorStandArmGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pivot Joint Ring */}
        <circle cx="34" cy="85" r="5" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
        <circle cx="34" cy="85" r="2" fill="#64748b" />

        {/* Upper Arm Segment to VESA Mount */}
        <path
          d="M 34 85 L 30 50 Q 29 44 32 40 L 36 38"
          stroke="url(#monitorStandArmGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* VESA Mount Plate behind screen */}
        <rect x="25" y="32" width="18" height="22" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      </g>

      {/* 2. Soft Ambient Glow Cast onto Desk Surface */}
      <ellipse
        cx="35"
        cy="133"
        rx="45"
        ry="10"
        fill="url(#secondMonitorDeskGlow)"
        className="pointer-events-none transition-opacity duration-500"
      />

      {/* 3. Outer Monitor Chassis / Bezel (Sleek Ultra-Thin Pivot Frame) */}
      <rect
        x="0"
        y="0"
        width="70"
        height="124"
        rx="4"
        fill="url(#monitorBezelGrad)"
        stroke="#334155"
        strokeWidth="1.2"
        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))"
      />

      {/* Inner Screen Display (Active IPS Panel) */}
      <rect
        x="3"
        y="3"
        width="64"
        height="118"
        rx="2"
        fill="url(#verticalScreenGrad)"
      />

      {/* 4. Display Content: Real-time Code Editor / Debug Terminal */}
      <g id="second-monitor-display-content" opacity={isFocusing ? 0.95 : 0.85}>
        {/* Terminal Header Bar */}
        <rect x="3" y="3" width="64" height="7" fill="#0f172a" />
        <circle cx="7" cy="6.5" r="1.2" fill="#ef4444" />
        <circle cx="11" cy="6.5" r="1.2" fill="#f59e0b" />
        <circle cx="15" cy="6.5" r="1.2" fill="#10b981" />
        <text x="21" y="8" fill="#64748b" fontSize="3.5" fontFamily="monospace">
          terminal.tsx
        </text>

        {/* Syntax-Highlighted Code Lines */}
        {/* Line 1: import */}
        <line x1="6" y1="15" x2="16" y2="15" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="19" y1="15" x2="38" y2="15" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Line 2: const & logic */}
        <line x1="6" y1="20" x2="14" y2="20" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="17" y1="20" x2="30" y2="20" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="33" y1="20" x2="52" y2="20" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />

        {/* Line 3: function call */}
        <line x1="9" y1="25" x2="26" y2="25" stroke="#2dd4bf" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="29" y1="25" x2="48" y2="25" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round" />

        {/* Line 4: array mapping */}
        <line x1="9" y1="30" x2="22" y2="30" stroke="#e879f9" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="25" y1="30" x2="42" y2="30" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Line 5: condition check */}
        <line x1="9" y1="35" x2="16" y2="35" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="19" y1="35" x2="35" y2="35" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />

        {/* Line 6: state dispatch */}
        <line x1="12" y1="40" x2="28" y2="40" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="31" y1="40" x2="55" y2="40" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />

        {/* Separator to Server Logs */}
        <line x1="6" y1="46" x2="64" y2="46" stroke="#1e293b" strokeWidth="0.8" />
        <text x="6" y="52" fill="#0ea5e9" fontSize="3.8" fontFamily="monospace" fontWeight="bold">
          [LOG] 200 OK :: /v1/pomodoro
        </text>

        {/* Server Log lines */}
        <line x1="6" y1="57" x2="35" y2="57" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
        <line x1="38" y1="57" x2="58" y2="57" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />

        <line x1="6" y1="62" x2="28" y2="62" stroke="#eab308" strokeWidth="1" strokeLinecap="round" />
        <line x1="31" y1="62" x2="62" y2="62" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />

        <line x1="6" y1="67" x2="42" y2="67" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />

        <line x1="6" y1="72" x2="24" y2="72" stroke="#ec4899" strokeWidth="1" strokeLinecap="round" />
        <line x1="27" y1="72" x2="52" y2="72" stroke="#a855f7" strokeWidth="1" strokeLinecap="round" />

        {/* Live Active Activity Pulse / Cursor */}
        <circle
          cx="8"
          cy="78"
          r="1.2"
          fill="#38bdf8"
          className={isFocusing ? 'animate-ping' : ''}
        />
        <line x1="12" y1="78" x2="30" y2="78" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Metrics graph at the bottom */}
        <path
          d="M 6 108 Q 18 96 28 102 T 48 94 T 64 98"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.2"
        />
        <text x="6" y="116" fill="#64748b" fontSize="3" fontFamily="monospace">
          CPU: 18%  MEM: 3.2GB
        </text>
      </g>

      {/* 5. Glass Reflection Overlay */}
      <polygon
        points="3,3 45,3 15,121 3,121"
        fill="url(#monitorGlassReflectionGrad)"
        className="pointer-events-none"
      />

      {/* 6. Power LED in Bottom Bezel */}
      <circle
        cx="35"
        cy="122"
        r="1"
        fill={isFocusing ? '#38bdf8' : '#10b981'}
        filter="drop-shadow(0 0 2px rgba(56, 189, 248, 0.8))"
      />
    </g>
  )
}
