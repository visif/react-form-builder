import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import {
  buildDraftStorageKey,
  clearDraftData,
  DEFAULT_DRAFT_IDLE_MINUTES,
  draftIdleDelayMs,
  hasDraft,
  mergeDraftSnapshot,
  readDraftFromStorage,
  readSessionIdleMs,
  SESSION_IDLE_MINUTES_WINDOW_KEY,
  useDraftPersistence,
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

describe('draft save timing', () => {
  beforeEach(() => {
    window.localStorage.clear()
    delete window[SESSION_IDLE_MINUTES_WINDOW_KEY]
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    window.localStorage.clear()
    delete window[SESSION_IDLE_MINUTES_WINDOW_KEY]
  })

  it('writes an idle draft 3 minutes before the session timeout', () => {
    expect(readSessionIdleMs()).toBe(DEFAULT_DRAFT_IDLE_MINUTES * 60 * 1000)
    expect(draftIdleDelayMs(30 * 60 * 1000)).toBe(27 * 60 * 1000)

    window[SESSION_IDLE_MINUTES_WINDOW_KEY] = 60
    expect(draftIdleDelayMs(readSessionIdleMs())).toBe(57 * 60 * 1000)
  })

  it('does not save or blur while the user is still typing', () => {
    const blur = vi.fn()
    const textarea = document.createElement('textarea')
    textarea.blur = blur
    document.body.appendChild(textarea)
    textarea.focus()

    const props = { formAction: '/forms/submit', taskId: 9 }
    const { result, unmount } = renderHook(() =>
      useDraftPersistence(
        props,
        () => [{ name: 'note', value: 'hello' }],
        () => ({ note: 'hello' })
      )
    )

    act(() => {
      result.current.handleFormInteraction()
    })
    act(() => {
      vi.advanceTimersByTime(30 * 1000)
    })

    expect(blur).not.toHaveBeenCalled()
    expect(readDraftFromStorage(props)).toBeNull()

    act(() => {
      vi.advanceTimersByTime(draftIdleDelayMs(readSessionIdleMs()) - 30 * 1000)
    })
    expect(readDraftFromStorage(props)).toEqual({ note: 'hello' })
    expect(blur).not.toHaveBeenCalled()

    unmount()
    textarea.remove()
  })

  it('saves when a field loses focus without moving focus itself', () => {
    const blur = vi.fn()
    const textarea = document.createElement('textarea')
    textarea.blur = blur
    document.body.appendChild(textarea)
    textarea.focus()

    const props = { formAction: '/forms/submit', taskId: 10 }
    const { result, unmount } = renderHook(() =>
      useDraftPersistence(
        props,
        () => [{ name: 'note', value: 'left' }],
        () => ({ note: 'left' })
      )
    )

    act(() => {
      result.current.handleFormBlur()
    })

    expect(readDraftFromStorage(props)).toEqual({ note: 'left' })
    expect(blur).not.toHaveBeenCalled()

    unmount()
    textarea.remove()
  })
})
