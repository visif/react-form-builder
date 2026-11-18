import { useCallback, useEffect, useRef, useState } from 'react'

import {
  defaultCellName,
  nextDynamicColumnRowUniqueName,
  sanitizeCellName,
  sanitizeUniqueName,
} from '../../../../utils/dynamic-column-row-names'
import { mergeEditorElementUpdate } from '../utils/mergeEditorElementUpdate'
import {
  buildSwitchedChoiceElement,
  isSwitchableChoiceElement,
} from '../utils/switchChoiceElementType'

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
  const debounceTimerRef = useRef(null)
  const elementRef = useRef(element)
  const dirtyRef = useRef(false)
  const sourceRequestIdRef = useRef(0)
  const contentRequestIdRef = useRef(0)

  // Sync ref with state
  useEffect(() => {
    elementRef.current = element
  }, [element])

  dirtyRef.current = dirty

  useEffect(() => {
    if (props.element?.element !== 'Image') return
    setElement((prev) => {
      if (!prev || prev.id !== props.element.id) return prev
      if (
        prev.width === props.element.width &&
        prev.height === props.element.height &&
        prev.aspectRatio === props.element.aspectRatio &&
        prev.src === props.element.src
      ) {
        return prev
      }
      return {
        ...prev,
        width: props.element.width,
        height: props.element.height,
        aspectRatio: props.element.aspectRatio,
        src: props.element.src,
      }
    })
  }, [
    props.element,
    props.element?.id,
    props.element?.width,
    props.element?.height,
    props.element?.aspectRatio,
    props.element?.src,
  ])

  const formDesignData = useCallback(
    () => props.preview?.state?.data || [],
    [props.preview]
  )

  // A move inside Dynamic Column Row updates the stored element in place.
  // The open editor keeps its own copy, so pick up the new coordinate name.
  useEffect(() => {
    const elementId = props.element?.id
    if (!elementId) {
      return
    }
    const live =
      (typeof props.preview?.getDataById === 'function' &&
        props.preview.getDataById(elementId)) ||
      props.element
    if (!live) {
      return
    }
    const sameIndex = (left, right) => {
      if (left == null && right == null) {
        return true
      }
      return Number(left) === Number(right)
    }
    setElement((prev) => {
      if (!prev || prev.id !== live.id) {
        return prev
      }
      const sameCoords = sameIndex(prev.row, live.row) && sameIndex(prev.col, live.col)
      const sameType = prev.element === live.element
      if (sameCoords && sameType) {
        return prev
      }
      const next = {
        ...prev,
        element: live.element,
        text: live.text,
        options: live.options ?? prev.options,
        row: live.row,
        col: live.col,
        cellName: live.cellName,
        cellNameCustom: live.cellNameCustom,
      }
      if ('formularKey' in live) {
        next.formularKey = live.formularKey
      } else {
        delete next.formularKey
      }
      elementRef.current = next
      if (props.element && props.element !== live) {
        props.element.element = live.element
        props.element.text = live.text
        if ('formularKey' in live) {
          props.element.formularKey = live.formularKey
        } else {
          delete props.element.formularKey
        }
        props.element.row = live.row
        props.element.col = live.col
        props.element.cellName = live.cellName
        props.element.cellNameCustom = live.cellNameCustom
      }
      return next
    })
  }, [
    props.element,
    props.preview,
    props.preview?.state?.data,
    props.element?.row,
    props.element?.col,
    props.element?.cellName,
  ])

  // Update element in parent component.
  // Blur handlers call this with a DOM event. Column editors call it with the
  // edited element; that argument has to win, or the header text is dropped.
  const updateElement = useCallback((maybeElement) => {
    const currentElement = mergeEditorElementUpdate(elementRef.current, maybeElement)
    elementRef.current = currentElement
    setElement(currentElement)
    if (
      props.element &&
      currentElement &&
      props.element.id === currentElement.id &&
      props.element.columns !== currentElement.columns
    ) {
      props.element.columns = currentElement.columns
    }
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

  const updateElementRef = useRef(updateElement)
  updateElementRef.current = updateElement

  // One timer for the open editor. Replacing the debounced function used to
  // leave the previous timeout running, and that timeout wrote a stale copy
  // of the form that kept only the last edited element.
  const schedulePush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null
      dirtyRef.current = false
      updateElementRef.current()
    }, 400)
  }, [])

  debouncedPushRef.current = schedulePush

  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      if (dirtyRef.current) {
        dirtyRef.current = false
        updateElementRef.current()
      }
    },
    []
  )

  // Edit element property with optional async form loading
  const editElementProp = useCallback(
    async (elemProperty, targProperty, e) => {
      const nextValue = e.target[targProperty]
      const baseElement = elementRef.current || element
      const prevSourceType = baseElement.sourceType
      const prevFormSource = baseElement.formSource
      const this_element = { ...baseElement }

      if (elemProperty.startsWith('formField') && elemProperty.length > 'formField'.length && !nextValue) {
        delete this_element[elemProperty]
        delete props.element[elemProperty]
      } else {
        this_element[elemProperty] = nextValue
        props.element[elemProperty] = nextValue
      }

      const isSourceTypeChange = elemProperty === 'sourceType' && prevSourceType !== nextValue
      const isFormSourceChange = elemProperty === 'formSource' && prevFormSource != nextValue

      if (isSourceTypeChange || isFormSourceChange) {
        Object.keys(this_element).forEach((key) => {
          if (key.startsWith('formField') && key.length > 'formField'.length) {
            delete this_element[key]
            delete props.element[key]
          }
        })
      }

      if (isSourceTypeChange) {
        this_element.formSource = -1
        props.element.formSource = -1
        setActiveForm(null)
        setFormDataSource([])
      }

      // Sync state immediately before any async source/content fetch so controlled
      // inputs, refs, and concurrent edits stay consistent while requests are in flight.
      setElement(this_element)
      elementRef.current = this_element
      setDirty(true)

      if (targProperty === 'checked') {
        props.updateElement.call(props.preview, this_element)
        setDirty(false)
      } else if (debouncedPushRef.current) {
        debouncedPushRef.current()
      }

      // Reload available sources when switching to form or dataset
      if (elemProperty === 'sourceType') {
        const requestId = ++sourceRequestIdRef.current
        if ((nextValue === 'form' || nextValue === 'dataset') && props.getFormSource) {
          const sources = (await props.getFormSource(this_element)) || []
          if (sourceRequestIdRef.current !== requestId) {
            return
          }
          setFormDataSource(sources)
        }
        return
      }

      // Load form content when formSource changes
      if (elemProperty === 'formSource' && formDataSource) {
        const requestId = ++contentRequestIdRef.current
        const activeFormItem = formDataSource.find((item) => item.id == nextValue)
        let activeFormContent = {}

        // Persist selected form label for FormLink so generator can display it
        if (props.element.element === 'FormLink') {
          const selectedFormLabel = activeFormItem?.title || activeFormItem?.name || ''
          const latest = {
            ...(elementRef.current || this_element),
            value: selectedFormLabel,
            formName: selectedFormLabel,
            selectedFormId: activeFormItem || undefined,
          }
          props.element.value = selectedFormLabel
          props.element.formName = selectedFormLabel
          props.element.selectedFormId = activeFormItem || undefined
          setElement(latest)
          elementRef.current = latest
        }

        if (activeFormItem && props.getFormContent) {
          console.log('Fetching form content for:', activeFormItem)
          activeFormContent = (await props.getFormContent(activeFormItem)) || {}
          console.log('Received form content:', activeFormContent)
        }

        if (contentRequestIdRef.current !== requestId) {
          return
        }
        console.log('Setting activeForm to:', activeFormContent)
        setActiveForm(activeFormContent)
      }
    },
    [element, formDataSource, props]
  )

  const editElementFields = useCallback(
    (fields, { immediate } = {}) => {
      const this_element = { ...elementRef.current, ...fields }
      Object.keys(fields).forEach((key) => {
        props.element[key] = fields[key]
      })
      setElement(this_element)
      elementRef.current = this_element
      setDirty(true)

      if (immediate) {
        props.updateElement.call(props.preview, this_element)
        setDirty(false)
      } else if (debouncedPushRef.current) {
        debouncedPushRef.current()
      }
    },
    [props]
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

  const switchChoiceType = useCallback(() => {
    const current = elementRef.current
    if (!current || !isSwitchableChoiceElement(current.element)) {
      return
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    const live =
      (typeof props.preview?.getDataById === 'function' &&
        props.preview.getDataById(current.id)) ||
      props.element
    const switched = buildSwitchedChoiceElement(current, live, props.toolbarItems)
    if (!switched) {
      return
    }
    if (props.element && props.element.id === switched.id) {
      if (!('formularKey' in switched) && 'formularKey' in props.element) {
        delete props.element.formularKey
      }
      Object.assign(props.element, switched)
      props.element.dirty = false
    }
    dirtyRef.current = false
    elementRef.current = switched
    setDirty(false)
    setElement(switched)
    props.updateElement.call(props.preview, switched)
  }, [props])

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
    editElementFields,
    onContentChange,
    onUniqueNameChange,
    onUniqueNameBlur,
    onCellNameChange,
    onCellNameBlur,
    onSubFormNameChange,
    onSubFormNameBlur,
    switchChoiceType,
    updateElement,
    setElement,
    setDirty,
  }
}
