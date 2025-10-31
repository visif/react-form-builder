import React from 'react'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const DataSource = (props) => {
  const inputField = React.useRef(null)
  const mounted = React.useRef(false)
  const syncInProgress = React.useRef(false) // Flag to prevent infinite sync loops
  const lastSyncTimestamp = React.useRef(0) // Timestamp to prevent rapid sync cycles

  const defaultValue = props.defaultValue || {}

  const [sourceList, setSourceList] = React.useState([])
  const [matchedList, setMatchedList] = React.useState([])
  const [searchText, setSearchText] = React.useState(defaultValue.value)
  const [selectedItem, setSelectedItem] = React.useState(defaultValue.selectedItem)
  const [defaultSelectedItem, setDefaultSelectedItem] = React.useState(defaultValue.selectedItem)
  const [isShowingList, setIsShowingList] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const notifyParentOfInitialization = React.useCallback(() => {
    // Only notify parent once the component is fully initialized and not during sync operations
    if (props.data.parentId && props.onElementChange && !loading && !syncInProgress.current) {
      props.onElementChange({
        ...props.data,
        element: 'DataSource',
        initialized: true,
        sourceType: props.data.sourceType,
        formSource: props.data.formSource,
        selectedItem: selectedItem,
        value: searchText,
        isInitialSync: true, // Flag to indicate this is initial synchronization
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
          setSourceList(data)
          setMatchedList(data)
        }
      } catch (error) {
        console.warn('Error loading data source:', error)
        if (mounted.current) {
          setSourceList([])
          setMatchedList([])
        }
      }
    }
  }, [props])

  React.useEffect(() => {
    mounted.current = true

    const init = async () => {
      await loadDataSource()
      checkForValue()
    }

    init()

    return () => {
      mounted.current = false
    }
  }, [loadDataSource, checkForValue])

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
    setIsShowingList(true)
  }, [])

  const handleInputBlur = React.useCallback(() => {
    setTimeout(() => {
      setIsShowingList(false)
    }, 200)
  }, [])

  const debounceOnChange = React.useCallback(
    (value) => {
      const matchData = sourceList.filter((item) =>
        `${item.name}`.toLocaleLowerCase().includes(`${value}`.toLocaleLowerCase())
      )
      setSearchText(value)
      setMatchedList(matchData)
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
        return
      }

      setSelectedItem(item)
      setSearchText(item.name)
      setIsShowingList(false)

      // Only notify parent about user-initiated selections, not sync updates
      if (props.data.parentId && props.onElementChange && !loading) {
        lastSyncTimestamp.current = currentTime
        props.onElementChange({
          ...props.data,
          element: 'DataSource',
          selectedItem: item,
          value: item.name,
          isUserSelection: true, // Flag to indicate this is a user selection
          timestamp: currentTime, // Add timestamp to track changes
        })
      }
    },
    [props, loading]
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
    className: 'form-control',
    name: props.data.field_name,
    value: searchText,
  }

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue
    inputProps.ref = inputField
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
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
            <input
              {...inputProps}
              disabled={props.read_only || !isSameEditor || loading}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleOnChange}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              zIndex: 199,
              top: '100%',
              left: 0,
              right: 0,
              height: 250,
              overflowY: 'auto',
              display: isShowingList ? 'block' : 'none',
            }}
          >
            {(matchedList || []).map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  display: 'block',
                  padding: '0.75rem 1.25rem',
                  marginBottom: -1,
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0, 0, 0, 0.125)',
                }}
                onClick={() => handleSelectItem(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSource
