import { useCallback, useEffect, useRef, useState } from 'react'

import { withGeneratorLegacyKeys } from '../../../utils/propAliases'
import { convertAnswerData } from '../utils/formHelpers'

const DRAFT_AUTOSAVE_INTERVAL = 30 * 1000 // 30 seconds

export const buildDraftStorageKey = (incomingProps) => {
  const props = withGeneratorLegacyKeys(incomingProps || {})
  if (props.draftStorageKey) {
    return props.draftStorageKey
  }

  const parts = ['rfb_draft']

  // Include user id when available for per-user scoping
  if (props.draftStorageUserId) {
    parts.push(props.draftStorageUserId)
  } else if (typeof props.getActiveUserProperties === 'function') {
    try {
      const user = props.getActiveUserProperties()
      if (user && user.userId) {
        parts.push(user.userId)
      }
    } catch (_) {
      /* ignore */
    }
  }

  if (props.parentElementId) {
    parts.push(props.parentElementId)
  } else if (props.form_action) {
    parts.push(props.form_action)
  }

  if (props.task_id) {
    parts.push(props.task_id)
  }

  if (props.form_rev_id) {
    parts.push(props.form_rev_id)
  }

  if (!props.parentElementId && !props.form_action && !props.task_id && !props.form_rev_id) {
    parts.push('default')
  }

  return parts.join(':')
}

export const readDraftFromStorage = (props) => {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = window.localStorage.getItem(buildDraftStorageKey(props))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    // Treat an empty object as no draft
    if (Object.keys(parsed).length === 0) return null
    return parsed
  } catch (_) {
    return null
  }
}

// ─── Static helpers (mirror the class-component API) ────────────────────

export const clearDraftData = (props) => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const key = buildDraftStorageKey(props)
    window.localStorage.removeItem(key)
  } catch (_) {
    // Ignore
  }
}

export const hasDraft = (props) => readDraftFromStorage(props) !== null

// ─── Hook ───────────────────────────────────────────────────────────────

export const useDraftPersistence = (props, collectFormData) => {
  const draftIntervalRef = useRef(null)
  const draftClearedRef = useRef(false)
  const draftStartedRef = useRef(false)

  // Read draft once per mount (or when key-relevant props change)
  const draft = readDraftFromStorage(props)
  const ansData = convertAnswerData(props.answer_data)
  const mergedData = draft ? { ...ansData, ...draft } : ansData

  const [draftRestored, setDraftRestored] = useState(() => !!readDraftFromStorage(props))

  // Keep collectFormData ref stable for the interval callback
  const collectRef = useRef(collectFormData)
  collectRef.current = collectFormData

  // Keep props ref stable
  const propsRef = useRef(props)
  propsRef.current = props

  // ── Save draft ──────────────────────────────────────────────────────
  const saveDraft = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      const formData = collectRef.current(propsRef.current.data)
      const draftObj = convertAnswerData(formData)
      window.localStorage.setItem(buildDraftStorageKey(propsRef.current), JSON.stringify(draftObj))
    } catch (_) {
      // Ignore quota / security errors
    }
  }, [])

  // ── Start autosave (lazy – triggered on first interaction) ──────────
  const startDraftAutosave = useCallback(() => {
    if (draftStartedRef.current || draftClearedRef.current || propsRef.current.read_only) return
    draftStartedRef.current = true
    draftIntervalRef.current = setInterval(() => {
      saveDraft()
    }, DRAFT_AUTOSAVE_INTERVAL)
  }, [saveDraft])

  /**
   * Public flush – start autosave if needed, then write current values now.
   * Used by host apps (e.g. Don't Save) via ref.saveDraft().
   */
  const flushDraft = useCallback(() => {
    if (propsRef.current.read_only) return
    draftClearedRef.current = false
    if (!draftStartedRef.current) {
      startDraftAutosave()
    }
    saveDraft()
  }, [saveDraft, startDraftAutosave])

  // ── Handler to attach to <form onChange / onInput> ──────────────────
  const handleFormInteraction = useCallback(() => {
    if (!draftStartedRef.current) {
      startDraftAutosave()
    }
  }, [startDraftAutosave])

  // Signature2 uses click (not change/input), so start + flush immediately
  const handleSignature2Change = useCallback(() => {
    handleFormInteraction()
    saveDraft()
  }, [handleFormInteraction, saveDraft])

  // ── Clear draft ─────────────────────────────────────────────────────
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      window.localStorage.removeItem(buildDraftStorageKey(propsRef.current))
    } catch (_) {
      // Ignore
    }

    // Stop the autosave interval so it won't re-save the draft
    if (draftIntervalRef.current) {
      clearInterval(draftIntervalRef.current)
      draftIntervalRef.current = null
    }
    draftClearedRef.current = true
    setDraftRestored(false)
  }, [])

  // ── Cleanup on unmount ──────────────────────────────────────────────
  useEffect(() => () => {
      if (draftIntervalRef.current) {
        clearInterval(draftIntervalRef.current)
        draftIntervalRef.current = null
      }
      // Save one last time before unmounting so partial work is not lost
      if (!propsRef.current.read_only && !draftClearedRef.current && draftStartedRef.current) {
        saveDraft()
      }
    }, [saveDraft])

  return {
    /** Answer data merged with any restored draft */
    mergedAnswerData: mergedData,
    /** Whether a draft was restored from localStorage */
    draftRestored,
    /** Attach to <form onChange / onInput> to lazily start autosave */
    handleFormInteraction,
    /** Signature2 click → start autosave + flush immediately */
    handleSignature2Change,
    /** Public flush for host apps (ref.saveDraft) */
    saveDraft: flushDraft,
    /** Clear the draft (call on submit success or user action) */
    clearDraft,
  }
}
