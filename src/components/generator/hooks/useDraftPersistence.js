import { useCallback, useEffect, useRef, useState } from 'react'

import { withGeneratorLegacyKeys } from '../../../utils/propAliases'
import { convertAnswerData } from '../utils/formHelpers'

/** Same event and window key the app publishes when SessionTimeout is loaded or changed. */
export const SESSION_IDLE_MINUTES_EVENT = 'vdc-session-idle-minutes-changed'
export const SESSION_IDLE_MINUTES_WINDOW_KEY = '__vdcSessionIdleMinutes'
export const DEFAULT_DRAFT_IDLE_MINUTES = 30
/** Write the idle draft this long before the server session expires. */
export const DRAFT_IDLE_LEAD_MS = 3 * 60 * 1000

const positiveMinutes = (value) => {
  const minutes = Number(value)
  if (!Number.isFinite(minutes) || minutes <= 0) return null
  return minutes
}

/** Full session idle time in ms. Defaults to 30 minutes. */
export const readSessionIdleMs = () => {
  let minutes = DEFAULT_DRAFT_IDLE_MINUTES
  if (typeof window !== 'undefined') {
    const published = positiveMinutes(window[SESSION_IDLE_MINUTES_WINDOW_KEY])
    if (published) minutes = published
  }
  return minutes * 60 * 1000
}

/** Idle time before a draft write: session timeout minus 3 minutes. */
export const draftIdleDelayMs = (sessionIdleMs) => {
  const idle = Number(sessionIdleMs)
  const timeout = Number.isFinite(idle) && idle > 0 ? idle : readSessionIdleMs()
  return Math.max(0, timeout - DRAFT_IDLE_LEAD_MS)
}

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

const isFileFieldKey = (key) => {
  const lower = `${key || ''}`.toLowerCase()
  return (
    lower.startsWith('fileimage_') ||
    lower.startsWith('fileupload_') ||
    lower.startsWith('imageupload_')
  )
}

const stripDeadBlobFromValue = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }
  if (typeof value.blobUrl === 'string' && value.blobUrl.startsWith('blob:')) {
    return { ...value, blobUrl: '' }
  }
  return value
}

const hasServerFileValue = (value) => {
  if (!value || typeof value !== 'object') {
    return false
  }
  if (value.filePath) {
    return true
  }
  return Array.isArray(value.fileList) && value.fileList.length > 0
}

/** True when a collected value should replace what is already stored. */
export const isMeaningfulDraftValue = (value) => {
  if (value == null || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value !== 'object') return true
  if ('isSigned' in value) return Boolean(value.isSigned)
  if (Array.isArray(value.fileList)) return value.fileList.length > 0
  if ('filePath' in value && !('fileList' in value)) return Boolean(value.filePath)
  if ('formula' in value && 'value' in value) {
    return value.value !== '' && value.value != null
  }
  const keys = Object.keys(value)
  if (
    'value' in value &&
    keys.every((key) => key === 'value' || key === 'info' || key === 'blobUrl')
  ) {
    return value.value !== '' && value.value != null
  }
  return keys.length > 0
}

const sanitizeDraftValue = (key, value) =>
  isFileFieldKey(key) ? stripDeadBlobFromValue(value) : value

/**
 * Keep previously filled fields when a later collect only has the active field.
 * Edited values always win, including an intentional clear. Empty defaults do
 * not wipe a value already stored for a field the user has not touched.
 */
export const mergeDraftSnapshot = (existing, collected, edited) => {
  const result = {}
  Object.entries(existing || {}).forEach(([key, value]) => {
    result[key] = sanitizeDraftValue(key, value)
  })
  Object.entries(collected || {}).forEach(([key, value]) => {
    if (edited && Object.prototype.hasOwnProperty.call(edited, key)) return
    const next = sanitizeDraftValue(key, value)
    if (isMeaningfulDraftValue(next)) {
      result[key] = next
    }
  })
  Object.entries(edited || {}).forEach(([key, value]) => {
    result[key] = sanitizeDraftValue(key, value)
  })
  return result
}

/** Merge server answers with draft; never keep dead blob: preview URLs. */
export const mergeAnswerData = (serverAnswers, draft) => {
  const server = {}
  Object.entries(serverAnswers || {}).forEach(([key, value]) => {
    server[key] = isFileFieldKey(key) ? stripDeadBlobFromValue(value) : value
  })
  if (!draft) {
    return server
  }
  const merged = { ...server }
  Object.entries(draft).forEach(([key, value]) => {
    if (isFileFieldKey(key) && hasServerFileValue(server[key])) {
      return
    }
    merged[key] = isFileFieldKey(key) ? stripDeadBlobFromValue(value) : value
  })
  return merged
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

export const useDraftPersistence = (props, collectFormData, getEditedValues) => {
  const idleTimerRef = useRef(null)
  const lastActivityRef = useRef(0)
  const sessionIdleMsRef = useRef(readSessionIdleMs())
  const draftClearedRef = useRef(false)
  const draftStartedRef = useRef(false)
  const getEditedRef = useRef(getEditedValues)
  getEditedRef.current = getEditedValues

  // Read draft once per mount (or when key-relevant props change)
  const draft = readDraftFromStorage(props)
  const ansData = convertAnswerData(props.answer_data)
  const mergedData = mergeAnswerData(ansData, draft)

  const [draftRestored, setDraftRestored] = useState(() => !!readDraftFromStorage(props))

  // Keep collectFormData ref stable for the interval callback
  const collectRef = useRef(collectFormData)
  collectRef.current = collectFormData

  // Keep props ref stable
  const propsRef = useRef(props)
  propsRef.current = props

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [])

  // ── Save draft ──────────────────────────────────────────────────────
  // Does not blur the focused control. Typing must keep the caret.
  const saveDraft = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      const formData = collectRef.current(propsRef.current.data)
      const collected = convertAnswerData(formData)
      const existing = readDraftFromStorage(propsRef.current)
      const edited =
        typeof getEditedRef.current === 'function' ? getEditedRef.current() : null
      const draftObj = mergeDraftSnapshot(existing, collected, edited)
      window.localStorage.setItem(buildDraftStorageKey(propsRef.current), JSON.stringify(draftObj))
    } catch (_) {
      // Ignore quota / security errors
    }
  }, [])

  // One write after the user has been idle until 3 minutes before session timeout.
  const scheduleIdleSave = useCallback(() => {
    clearIdleTimer()
    if (!draftStartedRef.current || draftClearedRef.current || propsRef.current.read_only) return
    const delay = draftIdleDelayMs(sessionIdleMsRef.current)
    const elapsed = Date.now() - lastActivityRef.current
    const wait = Math.max(0, delay - elapsed)
    idleTimerRef.current = setTimeout(() => {
      idleTimerRef.current = null
      saveDraft()
    }, wait)
  }, [clearIdleTimer, saveDraft])

  const noteActivity = useCallback(() => {
    if (propsRef.current.read_only || draftClearedRef.current) return
    draftStartedRef.current = true
    lastActivityRef.current = Date.now()
    scheduleIdleSave()
  }, [scheduleIdleSave])

  /**
   * Public flush – write current values now. Used by host apps (e.g. Don't Save).
   * Does not move focus.
   */
  const flushDraft = useCallback(() => {
    if (propsRef.current.read_only) return
    draftClearedRef.current = false
    draftStartedRef.current = true
    lastActivityRef.current = Date.now()
    saveDraft()
    scheduleIdleSave()
  }, [saveDraft, scheduleIdleSave])

  // ── Typing resets the idle timer and does not write a draft ─────────
  const handleFormInteraction = useCallback(() => {
    noteActivity()
  }, [noteActivity])

  // A field lost focus. Its own blur handler has already committed the value.
  const handleFormBlur = useCallback(() => {
    if (propsRef.current.read_only || draftClearedRef.current) return
    draftStartedRef.current = true
    lastActivityRef.current = Date.now()
    saveDraft()
    scheduleIdleSave()
  }, [saveDraft, scheduleIdleSave])

  // Signature2 commits on click, which may not blur the control.
  const handleSignature2Change = useCallback(() => {
    noteActivity()
    saveDraft()
  }, [noteActivity, saveDraft])

  // ── Clear draft ─────────────────────────────────────────────────────
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      window.localStorage.removeItem(buildDraftStorageKey(propsRef.current))
    } catch (_) {
      // Ignore
    }

    clearIdleTimer()
    draftClearedRef.current = true
    setDraftRestored(false)
  }, [clearIdleTimer])

  useEffect(() => {
    sessionIdleMsRef.current = readSessionIdleMs()
    const onTimeoutChanged = (event) => {
      const minutes = positiveMinutes(event?.detail)
      if (!minutes) return
      sessionIdleMsRef.current = minutes * 60 * 1000
      if (draftStartedRef.current && !draftClearedRef.current) {
        scheduleIdleSave()
      }
    }
    window.addEventListener(SESSION_IDLE_MINUTES_EVENT, onTimeoutChanged)
    return () => {
      window.removeEventListener(SESSION_IDLE_MINUTES_EVENT, onTimeoutChanged)
    }
  }, [scheduleIdleSave])

  // ── Cleanup on unmount ──────────────────────────────────────────────
  useEffect(() => () => {
      clearIdleTimer()
      // Save one last time before unmounting so partial work is not lost
      if (!propsRef.current.read_only && !draftClearedRef.current && draftStartedRef.current) {
        saveDraft()
      }
    }, [clearIdleTimer, saveDraft])

  return {
    /** Answer data merged with any restored draft */
    mergedAnswerData: mergedData,
    /** Whether a draft was restored from localStorage */
    draftRestored,
    /** Attach to <form onChange / onInput>. Resets the idle timer; does not write. */
    handleFormInteraction,
    /** Attach to <form onBlur>. Writes the draft after a field leaves focus. */
    handleFormBlur,
    /** Signature2 click → write now without moving focus */
    handleSignature2Change,
    /** Public flush for host apps (ref.saveDraft) */
    saveDraft: flushDraft,
    /** Clear the draft (call on submit success or user action) */
    clearDraft,
  }
}
