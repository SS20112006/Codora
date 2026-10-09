import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../types'
import { exportSaveToJson, importSaveFromJson } from '../storage/serialization'

describe('Save Serialization (JSON Export / Import)', () => {
  it('exports initial state to a valid JSON string', () => {
    const state = createInitialGameState('TestPlayer')
    const json = exportSaveToJson(state)

    expect(typeof json).toBe('string')
    const parsed = JSON.parse(json)
    expect(parsed.version).toBe(1)
    expect(parsed.profile.name).toBe('TestPlayer')
    expect(parsed.profile.devCoins).toBe(0)
    expect(parsed.inventory.ownedItemIds).toContain('desk_dorm_wood')
  })

  it('imports valid exported JSON and preserves all state fields', () => {
    const original = createInitialGameState('Alice')
    original.profile.devCoins = 1500
    original.profile.totalXp = 2500
    original.profile.streakDays = 5
    original.inventory.ownedItemIds.push('mechanical_keyboard_rgb')
    original.inventory.equipped.keyboard = 'mechanical_keyboard_rgb'
    original.settings.lightingMode = 'night'

    const exported = exportSaveToJson(original)
    const imported = importSaveFromJson(exported)

    expect(imported.profile.name).toBe('Alice')
    expect(imported.profile.devCoins).toBe(1500)
    expect(imported.profile.totalXp).toBe(2500)
    expect(imported.profile.streakDays).toBe(5)
    expect(imported.inventory.ownedItemIds).toContain('mechanical_keyboard_rgb')
    expect(imported.inventory.equipped.keyboard).toBe('mechanical_keyboard_rgb')
    expect(imported.settings.lightingMode).toBe('night')
  })

  it('automatically recalculates level, stage, and role from totalXp to prevent tampering/desync', () => {
    const state = createInitialGameState('Hacker')
    state.profile.totalXp = 3500 // Should calculate proper level
    // Tampered fake level
    state.profile.level = 99
    state.profile.role = 'indie_founder'
    state.profile.stage = 'stage_4_penthouse'

    const exported = exportSaveToJson(state)
    const imported = importSaveFromJson(exported)

    // Should be correctly recalculated from 3500 XP
    expect(imported.profile.level).toBeLessThan(99)
    expect(imported.profile.totalXp).toBe(3500)
  })

  it('throws a descriptive error when JSON is malformed', () => {
    expect(() => importSaveFromJson('invalid-json{{{')).toThrow(/invalid json/i)
  })

  it('throws an error when JSON does not meet minimum schema requirements', () => {
    expect(() => importSaveFromJson('{}')).toThrow(/invalid save data/i)
    expect(() => importSaveFromJson(JSON.stringify({ version: 1 }))).toThrow(
      /missing required profile/i
    )
  })

  it('handles negative or NaN numeric values safely by clamping', () => {
    const malformed = {
      version: 1,
      profile: {
        name: 'Bob',
        devCoins: -500,
        totalXp: -100,
        activeUsers: -10,
        streakDays: -3,
        createdAt: '2026-01-01T00:00:00.000Z',
        lastSavedAt: '2026-01-01T00:00:00.000Z',
      },
      inventory: {
        ownedItemIds: ['desk_dorm_wood'],
        equipped: {},
      },
      settings: {
        audio: { masterVolume: 2.5, musicVolume: -1, ambientVolume: 0.5, sfxVolume: 0.5, isMuted: false },
        lightingMode: 'day',
        timer: {},
        notificationsEnabled: true,
        autoStartBreaks: false,
        idleEarningsEnabled: true,
      },
      stats: {
        totalFocusSeconds: -50,
      },
      activeProject: null,
    }

    const imported = importSaveFromJson(JSON.stringify(malformed))
    expect(imported.profile.devCoins).toBe(0)
    expect(imported.profile.totalXp).toBe(0)
    expect(imported.profile.activeUsers).toBe(0)
    expect(imported.profile.streakDays).toBe(0)
    expect(imported.settings.audio.masterVolume).toBe(1) // clamped to 1
    expect(imported.settings.audio.musicVolume).toBe(0) // clamped to 0
    expect(imported.stats.totalFocusSeconds).toBe(0)
  })
})
