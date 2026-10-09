import { useEffect, useState, useMemo, useCallback } from 'react'
import { useGameStore } from '@/features/state'
import {
  ATMOSPHERE_MODES,
  isDeskLampActive,
  resolveEffectiveAmbience,
} from './lighting'
import type { RoomAmbience, WindowLightingMode } from './types'

export function useAtmosphere() {
  const lightingMode = useGameStore((state) => state.settings.lightingMode)
  const setStoreLightingMode = useGameStore((state) => state.setLightingMode)

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date())

  // If in realtime mode, update periodically to track system clock transitions
  useEffect(() => {
    if (lightingMode !== 'realtime') return

    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 30_000) // check every 30s

    return () => clearInterval(interval)
  }, [lightingMode])

  const effectiveAmbience: RoomAmbience = useMemo(
    () => resolveEffectiveAmbience(lightingMode, currentDate),
    [lightingMode, currentDate]
  )

  const isDeskLampOn = useMemo(
    () => isDeskLampActive(effectiveAmbience),
    [effectiveAmbience]
  )

  const setLightingMode = useCallback(
    (mode: WindowLightingMode) => {
      setStoreLightingMode(mode)
    },
    [setStoreLightingMode]
  )

  const currentModeOption = useMemo(
    () => ATMOSPHERE_MODES.find((m) => m.id === lightingMode) ?? ATMOSPHERE_MODES[0],
    [lightingMode]
  )

  return {
    lightingMode,
    effectiveAmbience,
    isDeskLampOn,
    setLightingMode,
    currentModeOption,
    modes: ATMOSPHERE_MODES,
  }
}
