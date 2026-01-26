import { useEffect, useState } from 'react'
import store from '../stores/store'

export const ACTION = {
  UNDO: 'undo',
  REDO: 'redo',
}

const useUndoRedo = () => {
  const [currentState, setCurrentState] = useState([])
  const [history, setHistory] = useState([currentState])
  const [index, setIndex] = useState(0)

  const updateState = (newState, historyIndex) => {
    let currentStateIndex = history.length
    setHistory((currentHistory) => {
      const newHistory = currentHistory
      currentStateIndex = newHistory.length
      return [...newHistory, [...newState]]
    })
    setIndex(() => currentStateIndex)
    setCurrentState(newState)
  }

  const undo = () => {
    if (index > 0) {
      setIndex(index - 1)
      setCurrentState(history[index - 1])
      store.dispatch('update', {
        data: history[index - 1] || [],
        action: ACTION.UNDO,
      })
    }
  }

  const redo = () => {
    if (index < history.length - 1) {
      setIndex(index + 1)
      setCurrentState(history[index + 1])
      store.dispatch('update', {
        data: history[index + 1] || [],
        action: ACTION.REDO,
      })
    }
  }

  // Example: Listen for keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        undo()
      } else if (event.ctrlKey && event.key === 'y') {
        redo()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [index, undo, redo])

  return {
    index,
    currentState,
    history,
    updateState,
    undo,
    redo,
  }
}

export default useUndoRedo
