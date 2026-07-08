import { describe, expect, it, beforeEach, afterEach } from 'vitest'

import {
  buildDraftStorageKey,
  clearDraftData,
  hasDraft,
  readDraftFromStorage,
} from './useDraftPersistence'

describe('useDraftPersistence helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('builds a deterministic storage key from formAction/taskId', () => {
    expect(
      buildDraftStorageKey({
        formAction: '/forms/submit',
        taskId: 42,
      })
    ).toBe('rfb_draft:/forms/submit:42')
  })

  it('falls back to legacy snake_case draft key props', () => {
    expect(
      buildDraftStorageKey({
        form_action: '/legacy',
        task_id: 7,
      })
    ).toBe('rfb_draft:/legacy:7')
  })

  it('uses an explicit draftStorageKey when provided', () => {
    expect(buildDraftStorageKey({ draftStorageKey: 'custom-key' })).toBe('custom-key')
  })

  it('reads and clears drafts from localStorage', () => {
    const props = { formAction: '/forms/submit', taskId: 1 }
    const key = buildDraftStorageKey(props)
    window.localStorage.setItem(key, JSON.stringify({ field_a: 'saved' }))

    expect(hasDraft(props)).toBe(true)
    expect(readDraftFromStorage(props)).toEqual({ field_a: 'saved' })

    clearDraftData(props)
    expect(hasDraft(props)).toBe(false)
    expect(readDraftFromStorage(props)).toBeNull()
  })

  it('treats empty objects and invalid JSON as missing drafts', () => {
    const props = { formAction: '/forms/submit' }
    const key = buildDraftStorageKey(props)
    window.localStorage.setItem(key, '{}')
    expect(readDraftFromStorage(props)).toBeNull()

    window.localStorage.setItem(key, '{bad-json')
    expect(readDraftFromStorage(props)).toBeNull()
  })
})
