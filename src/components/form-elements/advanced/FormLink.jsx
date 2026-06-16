import React from 'react'

import { Button } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const FormLink = (props) => {
  const inputField = React.useRef(null)
  const mounted = React.useRef(false)
  const hasLoadedFormSource = React.useRef(false)

  const defaultValue = props.defaultValue || {}

  const [formList, setFormList] = React.useState([])
  const [matchedList, setMatchedList] = React.useState([])
  const [formInfo, setFormInfo] = React.useState(null)
  const [searchText, setSearchText] = React.useState(defaultValue.value || '')
  const [selectedFormId, setSelectedFormId] = React.useState(defaultValue.selectedFormId)
  const [defaultSelectedForm, setDefaultSelectedForm] = React.useState(defaultValue.selectedForm)
  const [isShowingList, setIsShowingList] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const getFormDisplayName = React.useCallback((form) => {
    if (!form) return ''
    if (typeof form === 'string') return form
    if (typeof form === 'number') return ''
    return form.title || form.name || form.Name || ''
  }, [])

  const checkForValue = React.useCallback(
    (attempt = 0) => {
      const maxRetries = 3

      if (!selectedFormId && props.defaultValue?.selectedFormId) {
        setTimeout(() => {
          if (mounted.current && !selectedFormId) {
            setSearchText(props.defaultValue.value || '')
            setSelectedFormId(props.defaultValue.selectedFormId)
            setDefaultSelectedForm(props.defaultValue.selectedFormId)
            setLoading(false)
            if (!selectedFormId && attempt < maxRetries) {
              checkForValue(attempt + 1)
            }
          }
        }, 500)
      } else {
        setLoading(false)
      }
    },
    [selectedFormId, props.defaultValue]
  )

  const loadFormSource = React.useCallback(async () => {
    if (hasLoadedFormSource.current) {
      return // Already loaded, skip
    }

    if (typeof props.getFormSource === 'function') {
      try {
        const forms = await props.getFormSource(props.data)
        if (mounted.current) {
          hasLoadedFormSource.current = true

          // If we have a formSource set from the editor, find the matching form
          if (props.data.formSource) {
            const selectedForm = forms.find((form) => form.id == props.data.formSource)
            if (selectedForm) {
              setFormList(forms)
              setMatchedList(forms)
              setSelectedFormId(selectedForm)
              setSearchText(getFormDisplayName(selectedForm))
              return
            }
          }

          setFormList(forms)
          setMatchedList(forms)
        }
      } catch (error) {
        console.warn('Error loading form source:', error)
        if (mounted.current) {
          setFormList([])
          setMatchedList([])
        }
      }
    }
  }, [props.getFormSource, props.data.formSource, getFormDisplayName])

  React.useEffect(() => {
    mounted.current = true

    const init = async () => {
      await loadFormSource()
      checkForValue()

      if (typeof props.getFormInfo === 'function' && props.data.formSource) {
        try {
          const info = await props.getFormInfo(props.data.formSource)
          if (mounted.current) {
            setFormInfo(info || null)
          }
        } catch (error) {
          console.warn('Error loading form info:', error)
          if (mounted.current) {
            setFormInfo(null)
          }
        }
      }
    }

    init()

    return () => {
      mounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - loadFormSource has internal guard

  React.useEffect(() => {
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.selectedFormId) !== JSON.stringify(defaultSelectedForm)
    ) {
      const newDefaultValue = props.defaultValue || {}
      setSearchText(newDefaultValue.value || '')
      setSelectedFormId(newDefaultValue.selectedFormId)
      setDefaultSelectedForm(newDefaultValue.selectedFormId)
    }
  }, [props.defaultValue, defaultSelectedForm])

  React.useEffect(() => {
    if (!props.data.formSource || formList.length === 0) {
      return
    }

    const matchedForm = formList.find((form) => form.id == props.data.formSource)
    if (matchedForm) {
      setSelectedFormId(matchedForm)
      setSearchText(getFormDisplayName(matchedForm))
    }
  }, [props.data.formSource, formList, getFormDisplayName])

  const handleInputFocus = React.useCallback(() => {
    setIsShowingList(true)
  }, [])

  const handleInputBlur = React.useCallback(() => {
    setTimeout(() => {
      setIsShowingList(false)
    }, 200)
  }, [])

  const canSelectFromList = props.mutable && typeof props.getFormSource === 'function'

  const handlePrimaryAction = React.useCallback(() => {
    if (canSelectFromList) {
      setIsShowingList(true)
      return
    }

    const resolvedFormSource =
      props.data.formSource || selectedFormId?.id || selectedFormId?.value || undefined

    if (typeof props.onSelectChildForm === 'function') {
      props.onSelectChildForm(props.data.id, resolvedFormSource)
      return
    }

    if (typeof props.openLinkedForm === 'function' && resolvedFormSource !== undefined) {
      props.openLinkedForm(resolvedFormSource)
    }
  }, [
    canSelectFromList,
    props.onSelectChildForm,
    props.openLinkedForm,
    props.data.id,
    props.data.formSource,
    selectedFormId,
  ])

  const debounceOnChange = React.useCallback(
    (value) => {
      const matchData = formList.filter((form) =>
        `${form.title}`.toLocaleLowerCase().includes(`${value}`.toLocaleLowerCase())
      )
      setSearchText(value)
      setMatchedList(matchData)

      // Defer state updates to avoid setState during render
      setTimeout(() => {
        // If onElementChange is provided, call it to synchronize changes across the column
        if (props.onElementChange) {
          const updatedData = {
            ...props.data,
            value,
          }

          props.onElementChange(updatedData)

          // Immediately apply changes to this component's data
          if (props.data.dirty === undefined || props.data.dirty) {
            updatedData.dirty = true
            if (props.updateElement) {
              props.updateElement(updatedData)
            }
          }
        }
      }, 0)
    },
    [formList, props.onElementChange, props.updateElement, props.data]
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

  const handleFormSelect = React.useCallback(
    (form) => {
      setSelectedFormId(form)
      setSearchText(form.title)
      setIsShowingList(false)

      // Defer state updates to avoid setState during render
      setTimeout(() => {
        // If onElementChange is provided, call it to synchronize changes across the column
        if (props.onElementChange) {
          const updatedData = {
            ...props.data,
            value: form.title,
            selectedFormId: form,
            formSource: form.id, // Save the form ID as formSource
          }

          props.onElementChange(updatedData)

          // Immediately apply changes to this component's data
          if (props.data.dirty === undefined || props.data.dirty) {
            updatedData.dirty = true
            if (props.updateElement) {
              props.updateElement(updatedData)
            }
          }
        }
      }, 0)
    },
    [props.onElementChange, props.updateElement, props.data]
  )

  const openLinkedForm = React.useCallback(() => {
    console.info(`Select form: ${selectedFormId}`)
    if (selectedFormId && typeof props.openLinkedForm === 'function') {
      props.openLinkedForm(selectedFormId)
    }
  }, [selectedFormId, props.openLinkedForm])

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const selectedFormTitle =
    getFormDisplayName(selectedFormId) ||
    getFormDisplayName(formList.find((form) => form.id == props.data.formSource))

  const displayedFormName =
    formInfo?.Name ||
    formInfo?.name ||
    selectedFormTitle ||
    searchText ||
    props.data.value ||
    'Please select a form'

  const isFormSelected = !!(selectedFormId || props.data.formSource || selectedFormTitle)

  return (
    <section className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} style={{ display: 'block' }} />
        {canSelectFromList && isShowingList && matchedList.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: '#fff',
              border: '1px solid #ced4da',
              borderRadius: '.25rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              zIndex: 10,
              maxHeight: 200,
              overflowY: 'auto',
            }}
            onMouseLeave={handleInputBlur}
          >
            {matchedList.map((form) => (
              <div
                key={form.id}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  background: selectedFormId && selectedFormId.id === form.id ? '#e6f7ff' : '#fff',
                  borderBottom: '1px solid #f0f0f0',
                }}
                onClick={() => handleFormSelect(form)}
              >
                {form.title}
              </div>
            ))}
            {matchedList.length === 0 && (
              <div style={{ padding: '8px 12px', color: '#999' }}>No forms found</div>
            )}
          </div>
        )}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            width: 'auto',
            maxWidth: '100%',
          }}
        >
          <div
            className="form-link-container"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              width: 'auto',
              maxWidth: '100%',
            }}
          >
            {isFormSelected ? (
              <Button type="default" className="form-link-action-btn" onClick={handlePrimaryAction}>
                {displayedFormName}
              </Button>
            ) : (
              <div className="form-link-preview" style={{ padding: '6px 0', width: 'auto' }}>
                <Button
                  href="#"
                  className="form-link-action-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePrimaryAction()
                  }}
                >
                  {displayedFormName}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormLink
