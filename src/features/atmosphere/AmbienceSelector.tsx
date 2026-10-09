import React from 'react'
import { Clock, Moon, Sun, Sunset } from 'lucide-react'
import { useAtmosphere } from './useAtmosphere'
import type { WindowLightingMode } from './types'

interface AmbienceSelectorProps {
  className?: string
}

export const AmbienceSelector: React.FC<AmbienceSelectorProps> = ({ className = '' }) => {
  const { lightingMode, setLightingMode, modes, effectiveAmbience } = useAtmosphere()

  const getModeIcon = (mode: WindowLightingMode) => {
    switch (mode) {
      case 'realtime':
        return <Clock className="w-4 h-4" />
      case 'night':
        return <Moon className="w-4 h-4 text-indigo-400" />
      case 'sunset':
        return <Sunset className="w-4 h-4 text-amber-400" />
      case 'day':
        return <Sun className="w-4 h-4 text-sky-400" />
    }
  }

  const getAmbienceBadge = () => {
    switch (effectiveAmbience) {
      case 'day':
        return 'Dia claro'
      case 'sunset':
        return 'Golden Hour'
      case 'night':
        return 'Noite com estrelas'
    }
  }

  return (
    <div
      role="region"
      aria-label="Controlo de Iluminação e Ambiência"
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-codora-surface/80 border border-codora-border backdrop-blur-md shadow-sm transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-1">
        {modes.map((mode) => {
          const isActive = lightingMode === mode.id
          return (
            <button
              key={mode.id}
              type="button"
              aria-label={mode.label}
              aria-pressed={isActive}
              title={`${mode.label} — ${mode.description}`}
              onClick={() => setLightingMode(mode.id)}
              className={`min-touch-target px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-codora-text-muted hover:text-codora-text hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="flex-shrink-0">{getModeIcon(mode.id)}</span>
              <span className="hidden sm:inline">{mode.shortLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Realtime Sub-badge Indicator */}
      {lightingMode === 'realtime' && (
        <span
          data-testid="effective-ambience-badge"
          className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-codora-bg/80 border border-codora-border text-amber-300/90 ml-1 transition-all duration-500"
        >
          {getAmbienceBadge()}
        </span>
      )}
    </div>
  )
}

export default AmbienceSelector
