import React from 'react'
import { createPortal } from 'react-dom'

import { Input } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const DROPDOWN_MAX_HEIGHT = 250

const toSourceList = (data) => (Array.isArray(data) ? data : [])

const matchSourceList = (sourceList, value) => {
  const list = toSourceList(sourceList)
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return list
  }
  const query = `${value}`.toLocaleLowerCase()
  return list.filter((item) => `${item.name}`.toLocaleLowerCase().includes(query))
}

const optionStyle = {
  position: 'relative',
  display: 'block',
  padding: '0.75rem 1.25rem',
  marginBottom: -1,
  backgroundColor: '#fff',
  border: '1px solid rgba(0, 0, 0, 0.125)',
}

const DataSource = (props) => {
  const inputField = React.useRef(null)
  const mounted = React.useRef(false)
  const syncInProgress = React.useRef(false) // Flag to prevent infinite sync loops
  const lastSyncTimestamp = React.useRef(0) // Timestamp to prevent rapid sync cycles
  const blurTimer = React.useRef(null)
  const positionListenersAttached = React.useRef(false)
  const isShowingListRef = React.useRef(false)

  const defaultValue = props.defaultValue || {}

  const [sourceList, setSourceList] = React.useState([])
  const [matchedList, setMatchedList] = React.useState([])
  const [searchText, setSearchText] = React.useState(defaultValue.value)
  const [selectedItem, setSelectedItem] = React.useState(defaultValue.selectedItem)
  const [defaultSelectedItem, setDefaultSelectedItem] = React.useState(defaultValue.selectedItem)
  const [isShowingList, setIsShowingList] = React.useState(false)
  const [dropdownStyle, setDropdownStyle] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  const clearBlurTimer = React.useCallback(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
  }, [])

  const getInputElement = React.useCallback(() => {
    const ref = inputField.current
    if (!ref) {
      return null
    }
    // Ant Design Input may expose the native input via input/inputElement
    if (ref instanceof HTMLElement) {
      return ref
    }
    return ref.input || ref.inputElement || ref.nativeElement || null
  }, [])

  const updateDropdownPosition = React.useCallback(() => {
    const input = getInputElement()
    if (!input || typeof window === 'undefined') {
      return
    }
    const rect = input.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const openUp = spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow
    const maxHeight = Math.max(
      80,
      Math.min(DROPDOWN_MAX_HEIGHT, (openUp ? spaceAbove : spaceBelow) - 8)
    )
    setDropdownStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      top: openUp ? undefined : rect.bottom,
      bottom: openUp ? window.innerHeight - rect.top : undefined,
      maxHeight,
      zIndex: 10050,
      overflowY: 'auto',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    })
  }, [getInputElement])

  const onReposition = React.useCallback(() => {
    if (isShowingListRef.current) {
      updateDropdownPosition()
    }
  }, [updateDropdownPosition])

  const detachPositionListeners = React.useCallback(() => {
    if (!positionListenersAttached.current || typeof window === 'undefined') {
      return
    }
    positionListenersAttached.current = false
    window.removeEventListener('resize', onReposition)
    window.removeEventListener('scroll', onReposition, true)
  }, [onReposition])

  const attachPositionListeners = React.useCallback(() => {
    if (positionListenersAttached.current || typeof window === 'undefined') {
      return
    }
    positionListenersAttached.current = true
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
  }, [onReposition])

  const notifyParentOfInitialization = React.useCallback(() => {
    // Only notify parent once the component is fully initialized and not during sync operations
    if (props.data.parentId && props.onElementChange && !loading && !syncInProgress.current) {
      props.onElementChange({
        ...props.data,
        element: props.data.element || 'DataSource',
        initialized: true,
        sourceType: props.data.sourceType,
        formSource: props.data.formSource,
        selectedItem,
        value: searchText,
        isInitialSync: true, // Flag to indicate this is initial synchronization
      })
    } else if (props.handleChange && !loading) {
      props.handleChange(props.data.field_name, {
        type: props.data.sourceType,
        value: searchText,
        selectedItem,
      })
    }
  }, [props, loading, selectedItem, searchText])

  const checkForValue = React.useCallback(
    (attempt = 0) => {
      const maxRetries = 3

      if (!selectedItem && props.defaultValue?.selectedItem) {
        setTimeout(() => {
          if (mounted.current && !selectedItem) {
            setSearchText(props.defaultValue.value)
            setSelectedItem(props.defaultValue.selectedItem)
            setDefaultSelectedItem(props.defaultValue.selectedItem)
            setLoading(false)
            // Only notify parent after data is fully loaded and state is set
            notifyParentOfInitialization()
            if (!selectedItem && attempt < maxRetries) {
              checkForValue(attempt + 1)
            }
          }
        }, 500)
      } else {
        setLoading(false)
        // Only notify parent after data is fully loaded and state is set
        notifyParentOfInitialization()
      }
    },
    [selectedItem, props.defaultValue, notifyParentOfInitialization]
  )

  const loadDataSource = React.useCallback(async () => {
    if (typeof props.getDataSource === 'function') {
      try {
        const data = await props.getDataSource(props.data)
        if (mounted.current) {
          const list = toSourceList(data)
          setSourceList(list)
          setMatchedList(matchSourceList(list, searchText))
        }
      } catch (error) {
        console.warn('Error loading data source:', error)
        if (mounted.current) {
          setSourceList([])
          setMatchedList([])
        }
      }
    }
  }, [props, searchText])

  React.useEffect(() => {
    mounted.current = true

    const init = async () => {
      await loadDataSource()
      checkForValue()
    }

    init()

    return () => {
      mounted.current = false
      clearBlurTimer()
      detachPositionListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    isShowingListRef.current = isShowingList
  }, [isShowingList])

  React.useEffect(() => {
    // Handle sync updates from other DataSource components in the same column
    if (
      props.data.isSyncUpdate &&
      props.data.selectedItem &&
      JSON.stringify(props.data.selectedItem) !== JSON.stringify(selectedItem)
    ) {
      setSearchText(props.data.value || props.data.selectedItem.name || '')
      setSelectedItem(props.data.selectedItem)
      setDefaultSelectedItem(props.data.selectedItem)

      // Clear the sync flag after processing
      const updatedData = { ...props.data }
      delete updatedData.isSyncUpdate
      if (props.updateElement) {
        props.updateElement(updatedData)
      }
    } else if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.selectedItem) !== JSON.stringify(defaultSelectedItem)
    ) {
      const newDefaultValue = props.defaultValue || {}
      setSearchText(newDefaultValue.value)
      setSelectedItem(newDefaultValue.selectedItem)
      setDefaultSelectedItem(newDefaultValue.selectedItem)
    }
  }, [props.data, props.defaultValue, props.updateElement, selectedItem, defaultSelectedItem])

  const handleInputFocus = React.useCallback(() => {
    clearBlurTimer()
    updateDropdownPosition()
    setIsShowingList(true)
    isShowingListRef.current = true
    attachPositionListeners()
  }, [clearBlurTimer, updateDropdownPosition, attachPositionListeners])

  const handleInputBlur = React.useCallback(() => {
    clearBlurTimer()
    blurTimer.current = setTimeout(() => {
      if (mounted.current) {
        setIsShowingList(false)
        isShowingListRef.current = false
        detachPositionListeners()
      }
    }, 200)
  }, [clearBlurTimer, detachPositionListeners])

  const debounceOnChange = React.useCallback(
    (value) => {
      setSearchText(value)
      setMatchedList(matchSourceList(sourceList, value))
    },
    [sourceList]
  )

  const handleOnChange = React.useCallback(
    (event) => {
      if (event.key === 'Enter') {
        return
      }
      debounceOnChange(event.target.value)
    },
    [debounceOnChange]
  )

  const handleSelectItem = React.useCallback(
    (item) => {
      const currentTime = Date.now()

      // Prevent sync loops during programmatic updates or rapid successive calls
      if (syncInProgress.current || currentTime - lastSyncTimestamp.current < 200) {
        setSelectedItem(item)
        setSearchText(item.name)
        setIsShowingList(false)
        isShowingListRef.current = false
        detachPositionListeners()
        return
      }

      setSelectedItem(item)
      setSearchText(item.name)
      setIsShowingList(false)
      isShowingListRef.current = false
      detachPositionListeners()

      // Only notify parent about user-initiated selections, not sync updates
      if (props.data.parentId && props.onElementChange && !loading) {
        lastSyncTimestamp.current = currentTime
        props.onElementChange({
          ...props.data,
          element: props.data.element || 'DataSource',
          selectedItem: item,
          value: item.name,
          isUserSelection: true, // Flag to indicate this is a user selection
          timestamp: currentTime, // Add timestamp to track changes
        })
      } else if (props.handleChange) {
        props.handleChange(props.data.field_name, {
          type: props.data.sourceType,
          value: item.name,
          selectedItem: item,
        })
      }
    },
    [props, loading, detachPositionListeners]
  )

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const inputProps = {
    type: 'text',
    name: props.data.field_name,
    value: searchText,
    ref: inputField,
  }

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const list = matchedList || []
  let dropdown = null
  if (isShowingList && dropdownStyle && typeof document !== 'undefined') {
    dropdown = createPortal(
      <div style={dropdownStyle} onMouseDown={(event) => event.preventDefault()}>
        {loading && list.length === 0 && (
          <div style={{ ...optionStyle, color: '#888' }}>Loading...</div>
        )}
        {!loading && list.length === 0 && (
          <div style={{ ...optionStyle, color: '#888' }}>No options</div>
        )}
        {list.map((item) => (
          <div
            key={item.id}
            style={{ ...optionStyle, cursor: 'pointer' }}
            onMouseDown={(event) => {
              event.preventDefault()
              handleSelectItem(item)
            }}
          >
            {item.name}
          </div>
        ))}
      </div>,
      document.body
    )
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} style={{ display: 'block' }} />
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '100%',
          }}
        >
          <div>
            <Input
              {...inputProps}
              disabled={props.read_only || !isSameEditor}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleOnChange}
            />
          </div>
          {dropdown}
        </div>
      </div>
    </div>
  )
}

export default DataSource
