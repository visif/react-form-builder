import { useCallback, useEffect, useRef, useState } from 'react'

import {
  defaultCellName,
  nextDynamicColumnRowUniqueName,
  sanitizeCellName,
  sanitizeUniqueName,
} from '../../../../utils/dynamic-column-row-names'

/**
 * Custom hook for managing form element editing state and operations
 * Handles element updates, form data loading, and debounced saves
 */
export const useFormElementEdit = (props) => {
  // State management
  const [element, setElement] = useState(props.element)
  const [data, setData] = useState(props.data)
  const [dirty, setDirty] = useState(false)
  const [formDataSource, setFormDataSource] = useState([])
  const [activeForm, setActiveForm] = useState(null)

  // Refs for debounced update
  const debouncedPushRef = useRef(null)
  const elementRef = useRef(element)

  // Sync ref with state
  useEffect(() => {
    elementRef.current = element
  }, [element])

  const formDesignData = useCallback(
    () => props.preview?.state?.data || [],
    [props.preview]
  )

  // Debounce utility
  const debounce = useCallback((fn, ms) => {
    let t
    return (...a) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...a), ms)
    }
  }, [])

  // Update element in parent component
  const updateElement = useCallback(() => {
    const currentElement = elementRef.current
    props.updateElement.call(props.preview, currentElement)
    setDirty(false)

    // Sync changes for Signature2 elements in DynamicColumnRow
    if (
      currentElement.element === 'Signature2' &&
      currentElement.parentId &&
      currentElement.row !== undefined &&
      currentElement.col !== undefined &&
      props.preview &&
      props.preview.syncRowChanges
    ) {
      props.preview.syncRowChanges(currentElement)
    }
  }, [props])

  // Initialize debounced push on mount
  if (!debouncedPushRef.current) {
    debouncedPushRef.current = debounce(() => updateElement(), 400)
  }

  // Update debounced reference when updateElement changes
  useEffect(() => {
    debouncedPushRef.current = debounce(() => updateElement(), 400)
  }, [updateElement, debounce])

  // Edit element property with optional async form loading
  const editElementProp = useCallback(
    async (elemProperty, targProperty, e) => {
      const this_element = { ...element }
      this_element[elemProperty] = e.target[targProperty]

      // Update props.element directly for immediate parent sync
      props.element[elemProperty] = e.target[targProperty]

      // Load form content when formSource changes
      if (elemProperty === 'formSource' && formDataSource) {
        const activeFormItem = formDataSource.find((item) => item.id == this_element[elemProperty])
        let activeFormContent = {}

        // Persist selected form label for FormLink so generator can display it
        if (props.element.element === 'FormLink') {
          const selectedFormLabel = activeFormItem?.title || activeFormItem?.name || ''
          this_element.value = selectedFormLabel
          this_element.formName = selectedFormLabel
          this_element.selectedFormId = activeFormItem || undefined

          props.element.value = selectedFormLabel
          props.element.formName = selectedFormLabel
          props.element.selectedFormId = activeFormItem || undefined
        }

        if (activeFormItem && props.getFormContent) {
          console.log('Fetching form content for:', activeFormItem)
          activeFormContent = (await props.getFormContent(activeFormItem)) || {}
          console.log('Received form content:', activeFormContent)
        }

        console.log('Setting activeForm to:', activeFormContent)
        setActiveForm(activeFormContent)
      }

      setElement(this_element)
      elementRef.current = this_element
      setDirty(true)

      // Update immediately for checked properties, debounced for others
      if (targProperty === 'checked') {
        props.updateElement.call(props.preview, this_element)
        setDirty(false)
      } else if (debouncedPushRef.current) {
        debouncedPushRef.current()
      }
    },
    [element, formDataSource, props]
  )

  const onUniqueNameChange = useCallback(
    (e) => {
      const this_element = { ...elementRef.current, uniqueName: e.target.value }
      props.element.uniqueName = e.target.value
      setElement(this_element)
      elementRef.current = this_element
      setDirty(true)
    },
    [props.element]
  )

  const onUniqueNameBlur = useCallback(() => {
    const this_element = { ...elementRef.current }
    const sanitized = sanitizeUniqueName(this_element.uniqueName)
    const others = formDesignData()
    const fallback = nextDynamicColumnRowUniqueName(
      others.filter((item) => item && item.id !== this_element.id)
    )
    this_element.uniqueName = sanitized || fallback
    props.element.uniqueName = this_element.uniqueName
    setElement(this_element)
    elementRef.current = this_element
    setDirty(true)
    updateElement()
  }, [formDesignData, props.element, updateElement])

  const onCellNameChange = useCallback(
    (e) => {
      const this_element = { ...elementRef.current, cellName: e.target.value }
      props.element.cellName = e.target.value
      setElement(this_element)
      elementRef.current = this_element
      setDirty(true)
    },
    [props.element]
  )

  const onCellNameBlur = useCallback(() => {
    const this_element = { ...elementRef.current }
    const fallback = defaultCellName(this_element.row, this_element.col)
    const sanitized = sanitizeCellName(this_element.cellName)
    if (!sanitized) {
      this_element.cellName = fallback
      this_element.cellNameCustom = false
    } else {
      this_element.cellName = sanitized
      this_element.cellNameCustom = sanitized !== fallback
    }
    props.element.cellName = this_element.cellName
    props.element.cellNameCustom = this_element.cellNameCustom
    setElement(this_element)
    elementRef.current = this_element
    setDirty(true)
    updateElement()
  }, [props.element, updateElement])

  const onSubFormNameChange = useCallback(
    (e) => {
      const this_element = { ...elementRef.current, uniqueName: e.target.value }
      props.element.uniqueName = e.target.value
      setElement(this_element)
      elementRef.current = this_element
      setDirty(true)
    },
    [props.element]
  )

  const onSubFormNameBlur = useCallback(() => {
    const this_element = { ...elementRef.current }
    this_element.uniqueName = sanitizeCellName(this_element.uniqueName)
    props.element.uniqueName = this_element.uniqueName
    setElement(this_element)
    elementRef.current = this_element
    setDirty(true)
    updateElement()
  }, [props.element, updateElement])

  // Assign a unique name the first time an older Dynamic Column Row is opened
  useEffect(() => {
    if (props.element.element !== 'DynamicColumnRow') {
      return
    }
    if (sanitizeUniqueName(props.element.uniqueName)) {
      return
    }
    const name = nextDynamicColumnRowUniqueName(
      formDesignData().filter((item) => item && item.id !== props.element.id)
    )
    const updated = { ...elementRef.current, uniqueName: name }
    props.element.uniqueName = name
    setElement(updated)
    elementRef.current = updated
    setDirty(true)
    if (debouncedPushRef.current) {
      debouncedPushRef.current()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle rich text content changes
  const onContentChange = useCallback(
    (property, html) => {
      const updatedElement = { ...element }
      updatedElement[property] = html

      // Update props.element directly for immediate parent sync
      props.element[property] = html

      setElement(updatedElement)
      elementRef.current = updatedElement
      setDirty(true)

      // Call debounced push to update parent component
      if (debouncedPushRef.current) {
        debouncedPushRef.current()
      }
    },
    [element, props.element]
  )

  // Load form data source on mount for DataSource and FormLink elements
  useEffect(() => {
    const loadFormData = async () => {
      if (
        (props.element.element === 'DataSource' ||
          props.element.element === 'Dataset' ||
          props.element.element === 'FormLink') &&
        props.getFormSource
      ) {
        console.log('Loading form sources...')
        // Fetch available forms
        const formData = (await props.getFormSource(props.element)) || []
        console.log('Received form sources:', formData)

        if (formData) {
          const activeFormItem = formData.find((item) => item.id == props.element.formSource)

          // Load active form content if a form is already selected
          if (activeFormItem && props.getFormContent) {
            console.log('Loading initial form content for:', activeFormItem)
            const activeFormContent = (await props.getFormContent(activeFormItem)) || {}
            console.log('Received initial form content:', activeFormContent)
            setActiveForm(activeFormContent)
          }
        }

        setFormDataSource(formData)
      }
    }

    loadFormData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronize dirty flag to props.element
  if (dirty) {
    props.element.dirty = true
  }

  return {
    element,
    data,
    dirty,
    formDataSource,
    activeForm,
    formDesignData,
    editElementProp,
    onContentChange,
    onUniqueNameChange,
    onUniqueNameBlur,
    onCellNameChange,
    onCellNameBlur,
    onSubFormNameChange,
    onSubFormNameBlur,
    updateElement,
    setElement,
    setDirty,
  }
}
