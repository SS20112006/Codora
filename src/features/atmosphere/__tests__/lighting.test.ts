import { describe, it, expect } from 'vitest'
import {
  resolveAmbienceFromDate,
  resolveEffectiveAmbience,
  isDeskLampActive,
  ATMOSPHERE_MODES,
} from '../lighting'

describe('Atmosphere Lighting Engine', () => {
  describe('resolveAmbienceFromDate (Modo Automático)', () => {
    it('returns "day" during clear daylight hours (e.g., 07:00 - 17:59)', () => {
      const morning = new Date('2026-10-09T08:00:00')
      const noon = new Date('2026-10-09T12:30:00')
      const afternoon = new Date('2026-10-09T17:45:00')

      expect(resolveAmbienceFromDate(morning)).toBe('day')
      expect(resolveAmbienceFromDate(noon)).toBe('day')
      expect(resolveAmbienceFromDate(afternoon)).toBe('day')
    })

    it('returns "sunset" during Golden Hour (e.g., 18:00 - 20:59)', () => {
      const sunsetStart = new Date('2026-10-09T18:00:00')
      const goldenHour = new Date('2026-10-09T19:30:00')
      const dusk = new Date('2026-10-09T20:59:59')

      expect(resolveAmbienceFromDate(sunsetStart)).toBe('sunset')
      expect(resolveAmbienceFromDate(goldenHour)).toBe('sunset')
      expect(resolveAmbienceFromDate(dusk)).toBe('sunset')
    })

    it('returns "night" during dark night hours (e.g., 21:00 - 06:59)', () => {
      const nightStart = new Date('2026-10-09T21:00:00')
      const midnight = new Date('2026-10-09T00:00:00')
      const lateNight = new Date('2026-10-09T03:15:00')
      const dawnBeforeDay = new Date('2026-10-09T06:59:59')

      expect(resolveAmbienceFromDate(nightStart)).toBe('night')
      expect(resolveAmbienceFromDate(midnight)).toBe('night')
      expect(resolveAmbienceFromDate(lateNight)).toBe('night')
      expect(resolveAmbienceFromDate(dawnBeforeDay)).toBe('night')
    })
  })

  describe('resolveEffectiveAmbience', () => {
    it('returns fixed modes regardless of system time', () => {
      const midnight = new Date('2026-10-09T02:00:00')
      const midday = new Date('2026-10-09T12:00:00')

      expect(resolveEffectiveAmbience('day', midnight)).toBe('day')
      expect(resolveEffectiveAmbience('sunset', midday)).toBe('sunset')
      expect(resolveEffectiveAmbience('night', midday)).toBe('night')
    })

    it('delegates to system clock when mode is "realtime"', () => {
      const midday = new Date('2026-10-09T14:00:00')
      const goldenHour = new Date('2026-10-09T19:00:00')
      const night = new Date('2026-10-09T23:00:00')

      expect(resolveEffectiveAmbience('realtime', midday)).toBe('day')
      expect(resolveEffectiveAmbience('realtime', goldenHour)).toBe('sunset')
      expect(resolveEffectiveAmbience('realtime', night)).toBe('night')
    })
  })

  describe('isDeskLampActive', () => {
    it('turns on the warm interior desk lamp at night', () => {
      expect(isDeskLampActive('night')).toBe(true)
    })

    it('keeps the desk lamp off during day', () => {
      expect(isDeskLampActive('day')).toBe(false)
    })
  })

  describe('ATMOSPHERE_MODES definitions', () => {
    it('contains all 4 required selectable options including manual modes and auto', () => {
      const ids = ATMOSPHERE_MODES.map((m) => m.id)
      expect(ids).toContain('realtime')
      expect(ids).toContain('night')
      expect(ids).toContain('sunset')
      expect(ids).toContain('day')

      const nightMode = ATMOSPHERE_MODES.find((m) => m.id === 'night')
      expect(nightMode?.label).toMatch(/Sempre Noite Aconchegante/i)

      const sunsetMode = ATMOSPHERE_MODES.find((m) => m.id === 'sunset')
      expect(sunsetMode?.label).toMatch(/Sempre Pôr do Sol/i)

      const dayMode = ATMOSPHERE_MODES.find((m) => m.id === 'day')
      expect(dayMode?.label).toMatch(/Sempre Dia/i)
    })
  })
})
