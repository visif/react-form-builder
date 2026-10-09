import { describe, expect, it, beforeEach, afterEach } from 'vitest'

import {
  buildDraftStorageKey,
  clearDraftData,
  hasDraft,
  mergeDraftSnapshot,
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

  it('keeps earlier filled fields when the latest collect only has the active field', () => {
    const existing = { field_a: 'alpha', field_b: 'beta' }
    const collected = { field_a: '', field_b: '', field_c: '' }
    const edited = { field_c: 'gamma' }

    expect(mergeDraftSnapshot(existing, collected, edited)).toEqual({
      field_a: 'alpha',
      field_b: 'beta',
      field_c: 'gamma',
    })
  })

  it('lets an intentional clear replace a previously filled field', () => {
    expect(
      mergeDraftSnapshot({ field_a: 'alpha', field_b: 'beta' }, { field_a: '' }, { field_a: '' })
    ).toEqual({
      field_a: '',
      field_b: 'beta',
    })
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
