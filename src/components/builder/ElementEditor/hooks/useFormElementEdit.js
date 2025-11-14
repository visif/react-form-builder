import { useCallback, useEffect, useRef, useState } from 'react'

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
    const currentElement = element
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
  }, [element, props])

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

        if (activeFormItem && props.getFormContent) {
          activeFormContent = (await props.getFormContent(activeFormItem)) || {}
        }

        setActiveForm(activeFormContent)
      }

      setElement(this_element)
      setDirty(true)

      // Update immediately for checked properties, debounced for others
      if (targProperty === 'checked') {
        props.updateElement.call(props.preview, this_element)
        setDirty(false)
      } else {
        if (debouncedPushRef.current) {
          debouncedPushRef.current()
        }
      }
    },
    [element, formDataSource, props]
  )

  // Handle rich text content changes
  const onContentChange = useCallback(
    (property, html) => {
      const updatedElement = { ...element }
      updatedElement[property] = html

      // Update props.element directly for immediate parent sync
      props.element[property] = html

      setElement(updatedElement)
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
        (props.element.element === 'DataSource' || props.element.element === 'FormLink') &&
        props.getFormSource
      ) {
        // Fetch available forms
        const formData = (await props.getFormSource(props.element)) || []

        if (formData) {
          const activeFormItem = formData.find((item) => item.id == props.element.formSource)

          // Load active form content if a form is already selected
          if (activeFormItem && props.getFormContent) {
            const activeFormContent = (await props.getFormContent(activeFormItem)) || {}
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
    editElementProp,
    onContentChange,
    updateElement,
    setElement,
    setDirty,
  }
}
