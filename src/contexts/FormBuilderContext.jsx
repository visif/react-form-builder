import React, { createContext, useCallback, useContext, useReducer, useRef } from 'react'

import { get, post } from '../utils/requests'

// Create context
const FormBuilderContext = createContext(null)

// Action types
const SET_DATA = 'SET_DATA'
const CREATE_ELEMENT = 'CREATE_ELEMENT'
const DELETE_ELEMENT = 'DELETE_ELEMENT'
const UPDATE_ORDER = 'UPDATE_ORDER'

// Reducer
function formBuilderReducer(state, action) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.payload.data,
        action: action.payload.action,
      }

    case CREATE_ELEMENT:
      return {
        ...state,
        data: [...state.data, action.payload],
      }

    case DELETE_ELEMENT: {
      const newData = state.data.filter((item) => item !== action.payload)
      return {
        ...state,
        data: newData,
      }
    }

    case UPDATE_ORDER:
      return {
        ...state,
        data: action.payload,
      }

    default:
      return state
  }
}

// Provider component
export function FormBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(formBuilderReducer, {
    data: [],
    action: undefined,
  })

  const saveUrlRef = useRef(null)
  const onPostRef = useRef(null)
  const onLoadRef = useRef(null)
  const subscribersRef = useRef([])

  // Notify subscribers when state changes
  React.useEffect(() => {
    subscribersRef.current.forEach((callback) => {
      callback({ payload: state })
    })
  }, [state])

  // Save data
  const saveData = useCallback((data, action) => {
    if (onPostRef.current) {
      onPostRef.current({ task_data: data, action })
    } else if (saveUrlRef.current) {
      post(saveUrlRef.current, { task_data: data, action })
    }
  }, [])

  // Actions
  const actions = {
    setData: useCallback(
      (data, shouldSave = false, action) => {
        dispatch({ type: SET_DATA, payload: { data, action } })
        if (shouldSave) {
          saveData(data, action)
        }
      },
      [saveData]
    ),

    load: useCallback(({ loadUrl, saveUrl, data = [], action }) => {
      saveUrlRef.current = saveUrl

      if (onLoadRef.current) {
        onLoadRef.current().then((loadedData) => {
          dispatch({ type: SET_DATA, payload: { data: loadedData, action } })
        })
      } else if (loadUrl) {
        get(loadUrl).then((loadedData) => {
          const finalData = [...loadedData]
          if (data && data.length > 0 && loadedData.length === 0) {
            data.forEach((item) => finalData.push(item))
          }
          dispatch({ type: SET_DATA, payload: { data: finalData, action } })
        })
      } else {
        dispatch({ type: SET_DATA, payload: { data, action } })
      }
    }, []),

    update: useCallback(({ data, action }) => {
      dispatch({ type: SET_DATA, payload: { data, action } })
    }, []),

    create: useCallback(
      (element) => {
        dispatch({ type: CREATE_ELEMENT, payload: element })
        // Save after creating
        const newData = [...state.data, element]
        saveData(newData)
      },
      [state.data, saveData]
    ),

    delete: useCallback(
      (element) => {
        dispatch({ type: DELETE_ELEMENT, payload: element })
        // Save after deleting
        const newData = state.data.filter((item) => item !== element)
        saveData(newData)
      },
      [state.data, saveData]
    ),

    updateOrder: useCallback(
      (elements) => {
        const newData = elements.filter((x) => x && !x.parentId)
        elements.filter((x) => x && x.parentId).forEach((x) => newData.push(x))
        dispatch({ type: UPDATE_ORDER, payload: newData })
        saveData(newData)
      },
      [saveData]
    ),
  }

  // Subscribe method for compatibility
  const subscribe = useCallback((callback) => {
    subscribersRef.current.push(callback)
    // Return unsubscribe function
    return () => {
      subscribersRef.current = subscribersRef.current.filter((cb) => cb !== callback)
    }
  }, [])

  // Set external handlers
  const setExternalHandler = useCallback((onLoad, onPost) => {
    onLoadRef.current = onLoad
    onPostRef.current = onPost
  }, [])

  const contextValue = {
    state,
    dispatch: (action, payload) => {
      if (actions[action]) {
        actions[action](payload)
      }
    },
    subscribe,
    setExternalHandler,
  }

  return <FormBuilderContext.Provider value={contextValue}>{children}</FormBuilderContext.Provider>
}

// Hook to use the store
export function useFormBuilderStore() {
  const context = useContext(FormBuilderContext)
  if (!context) {
    throw new Error('useFormBuilderStore must be used within a FormBuilderProvider')
  }
  return context
}

// Singleton store object for backward compatibility
let storeInstance = null

export function getStoreInstance() {
  if (!storeInstance) {
    const subscribers = []
    let currentState = { payload: { data: [], action: undefined } }
    let saveUrl = null
    let onPost = null
    let onLoad = null

    storeInstance = {
      state: currentState,

      dispatch(action, payload) {
        switch (action) {
          case 'load': {
            const { loadUrl, saveUrl: newSaveUrl, data = [] } = payload
            saveUrl = newSaveUrl

            if (onLoad) {
              onLoad().then((loadedData) => {
                currentState = { payload: { data: loadedData, action: payload.action } }
                subscribers.forEach((cb) => cb(currentState))
              })
            } else if (loadUrl) {
              get(loadUrl).then((loadedData) => {
                const finalData = [...loadedData]
                if (data && data.length > 0 && loadedData.length === 0) {
                  data.forEach((item) => finalData.push(item))
                }
                currentState = { payload: { data: finalData, action: payload.action } }
                subscribers.forEach((cb) => cb(currentState))
              })
            } else {
              currentState = { payload: { data, action: payload.action } }
              subscribers.forEach((cb) => cb(currentState))
            }
            break
          }

          case 'update': {
            currentState = { payload: { data: payload.data, action: payload.action } }
            subscribers.forEach((cb) => cb(currentState))
            break
          }

          case 'create': {
            currentState.payload.data.push(payload)
            currentState = { ...currentState }
            subscribers.forEach((cb) => cb(currentState))
            if (onPost) {
              onPost({ task_data: currentState.payload.data })
            } else if (saveUrl) {
              post(saveUrl, { task_data: currentState.payload.data })
            }
            break
          }

          case 'delete': {
            const index = currentState.payload.data.indexOf(payload)
            if (index > -1) {
              currentState.payload.data.splice(index, 1)
              currentState = { ...currentState }
              subscribers.forEach((cb) => cb(currentState))
              if (onPost) {
                onPost({ task_data: currentState.payload.data })
              } else if (saveUrl) {
                post(saveUrl, { task_data: currentState.payload.data })
              }
            }
            break
          }

          case 'updateOrder': {
            const newData = payload.filter((x) => x && !x.parentId)
            payload.filter((x) => x && x.parentId).forEach((x) => newData.push(x))
            currentState = { payload: { data: newData, action: undefined } }
            subscribers.forEach((cb) => cb(currentState))
            if (onPost) {
              onPost({ task_data: newData })
            } else if (saveUrl) {
              post(saveUrl, { task_data: newData })
            }
            break
          }

          default:
            break
        }
      },

      subscribe(callback) {
        subscribers.push(callback)
        // Return unsubscribe function
        return () => {
          const index = subscribers.indexOf(callback)
          if (index > -1) {
            subscribers.splice(index, 1)
          }
        }
      },

      setExternalHandler(newOnLoad, newOnPost) {
        onLoad = newOnLoad
        onPost = newOnPost
      },
    }
  }

  return storeInstance
}

// Export singleton for backward compatibility
export default getStoreInstance()
