import { useCallback, useEffect, useRef, useState } from 'react'

import store from '../contexts/FormBuilderContext'

export const ACTION = {
  UNDO: 'undo',
  REDO: 'redo',
}

/**
 * Deep clone an array of state objects so that history entries
 * are isolated from later in-place mutations.
 */
const cloneState = (state) => {
  try {
    return JSON.parse(JSON.stringify(state))
  } catch {
    return [...state]
  }
}

const useUndoRedo = () => {
  // Use refs for history and index so undo/redo always see
  // the latest values and avoid stale-closure bugs.
  const historyRef = useRef([[]])
  const indexRef = useRef(0)

  // A counter used solely to trigger re-renders after ref mutations.
  const [, setRenderTick] = useState(0)
  const triggerRender = useCallback(() => setRenderTick((n) => n + 1), [])

  const updateState = useCallback(
    (newState) => {
      // Truncate any "future" history beyond the current index,
      // then append the new state. This is the standard undo/redo
      // behaviour: making a new change after an undo discards the
      // redo stack.
      const truncated = historyRef.current.slice(0, indexRef.current + 1)
      const cloned = cloneState(newState)
      historyRef.current = [...truncated, cloned]
      indexRef.current = historyRef.current.length - 1
      triggerRender()
    },
    [triggerRender]
  )

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1
      const previousState = historyRef.current[indexRef.current] || []
      triggerRender()
      store.dispatch('update', {
        data: cloneState(previousState),
        action: ACTION.UNDO,
      })
    }
  }, [triggerRender])

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1
      const nextState = historyRef.current[indexRef.current] || []
      triggerRender()
      store.dispatch('update', {
        data: cloneState(nextState),
        action: ACTION.REDO,
      })
    }
  }, [triggerRender])

  // Keyboard shortcuts (Ctrl/Cmd+Z = undo, Ctrl/Cmd+Shift+Z / Ctrl/Cmd+Y = redo)
  useEffect(() => {
    const handleKeyPress = (event) => {
      const mod = event.ctrlKey || event.metaKey
      if (mod && event.key === 'z') {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
      } else if (mod && event.key === 'y') {
        event.preventDefault()
        redo()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [undo, redo])

  return {
    index: indexRef.current,
    currentState: historyRef.current[indexRef.current] || [],
    history: historyRef.current,
    updateState,
    undo,
    redo,
  }
}

export default useUndoRedo
