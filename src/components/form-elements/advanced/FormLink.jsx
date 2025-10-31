import React from 'react'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const FormLink = (props) => {
  const inputField = React.useRef(null)
  const mounted = React.useRef(false)

  const defaultValue = props.defaultValue || {}

  const [formList, setFormList] = React.useState([])
  const [matchedList, setMatchedList] = React.useState([])
  const [formInfo, setFormInfo] = React.useState(null)
  const [searchText, setSearchText] = React.useState(defaultValue.value || '')
  const [selectedFormId, setSelectedFormId] = React.useState(defaultValue.selectedFormId)
  const [defaultSelectedForm, setDefaultSelectedForm] = React.useState(defaultValue.selectedForm)
  const [isShowingList, setIsShowingList] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

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
    if (typeof props.getFormSource === 'function') {
      try {
        const forms = await props.getFormSource(props.data)
        if (mounted.current) {
          // If we have a formSource set from the editor, find the matching form
          if (props.data.formSource) {
            const selectedForm = forms.find((form) => form.id == props.data.formSource)
            if (selectedForm) {
              setFormList(forms)
              setMatchedList(forms)
              setSelectedFormId(selectedForm)
              setSearchText('')
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
  }, [props])

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
  }, [loadFormSource, checkForValue, props])

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
      const matchData = formList.filter((form) =>
        `${form.title}`.toLocaleLowerCase().includes(`${value}`.toLocaleLowerCase())
      )
      setSearchText(value)
      setMatchedList(matchData)

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
    },
    [formList, props]
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
    },
    [props]
  )

  const openLinkedForm = React.useCallback(() => {
    console.info(`Select form: ${selectedFormId}`)
    if (selectedFormId && typeof props.openLinkedForm === 'function') {
      props.openLinkedForm(selectedFormId)
    }
  }, [selectedFormId, props])

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

  const formTitle = selectedFormId ? selectedFormId.title : 'Select a form'
  const isFormSelected = !!selectedFormId

  return (
    <section className={baseClasses}>
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
          {/* Display hyperlink in preview mode */}
          {/* {!props.mutable && (
              <div className="form-link-preview" style={{ padding: '6px 0' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    openLinkedForm()
                  }}
                  style={{
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  {formInfo
                    ? formInfo.Name
                    : 'Please select a form'}
                </button>
              </div>
            )} */}

          {/* Display form selection in edit mode */}
          {/* {props.mutable && ( */}
          <div className="form-link-container" style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => setIsShowingList(true)}
              style={{
                flex: 1,
                border: '1px solid #ced4da',
                borderRadius: '.25rem',
                padding: '6px 12px',
                cursor: 'pointer',
                backgroundColor: isFormSelected ? '#fff' : '#f8f9fa',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isFormSelected ? (
                <span>{formInfo ? formInfo.Name : 'Please select a form'}</span>
              ) : (
                <div>
                  <div className="form-link-preview" style={{ padding: '6px 0' }}>
                    <a
                      href="#"
                      style={{ marginTop: 6 }}
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.preventDefault()
                        if (typeof props.onSelectChildForm === 'function') {
                          props.onSelectChildForm(props.data.id, props.data.formSource)
                        }
                      }}
                    >
                      {formInfo ? formInfo.Name : 'Please select a form'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </section>
  )
}

export default FormLink
