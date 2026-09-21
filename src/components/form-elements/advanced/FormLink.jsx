import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

// Inline styles extracted as constants for better readability
const STYLES = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  previewContainer: {
    padding: '6px 0',
  },
  previewButton: {
    marginTop: 6,
  },
}

// Custom hook for loading and managing form data
const useFormData = (data, getFormSource, getFormInfo) => {
  const [formList, setFormList] = useState([])
  const [formInfo, setFormInfo] = useState(null)
  const [selectedForm, setSelectedForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Load available forms from the source
  const loadForms = useCallback(async () => {
    if (typeof getFormSource !== 'function') {
      setLoading(false)
      return
    }

    try {
      const forms = await getFormSource(data)
      if (!isMounted.current) return

      setFormList(forms)

      // If a formSource is already set, find and select it
      if (data.formSource) {
        const preselectedForm = forms.find((form) => form.id == data.formSource)
        if (preselectedForm) {
          setSelectedForm(preselectedForm)
        }
      }
    } catch (error) {
      console.warn('Error loading form source:', error)
      if (isMounted.current) {
        setFormList([])
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [data, getFormSource])

  // Load detailed info about the selected form
  const loadFormInfo = useCallback(async () => {
    if (typeof getFormInfo !== 'function' || !data.formSource) {
      return
    }

    try {
      const info = await getFormInfo(data.formSource)
      if (isMounted.current) {
        setFormInfo(info || null)
      }
    } catch (error) {
      console.warn('Error loading form info:', error)
      if (isMounted.current) {
        setFormInfo(null)
      }
    }
  }, [data.formSource, getFormInfo])

  useEffect(() => {
    loadForms()
  }, [loadForms])

  useEffect(() => {
    loadFormInfo()
  }, [loadFormInfo])

  return { formList, formInfo, selectedForm, setSelectedForm, loading }
}

// Custom hook for editor permissions
const useEditorPermissions = (editor, selectedForm, getActiveUserProperties) => {
  const userProperties = getActiveUserProperties?.()
  const hasValue = selectedForm !== null

  // Determine if the current user can edit this field
  const canEdit = (() => {
    if (!hasValue) return true
    if (!editor?.userId || !userProperties) return true

    return userProperties.userId === editor.userId || userProperties.hasDCCRole === true
  })()

  // Tooltip showing who last edited
  const tooltipText = editor?.name && hasValue ? `Edited by: ${editor.name}` : ''

  return { canEdit, tooltipText }
}

// Display name for a form entry from the form source list
const getFormDisplayName = (form) => {
  if (!form) return ''
  if (typeof form === 'string') return form
  if (typeof form !== 'object') return ''
  return form.title || form.name || form.Name || ''
}

// Sub-component for the form selector display
const FormSelector = ({
  selectedForm,
  formInfo,
  selectedFormName,
  onSelectChildForm,
  openLinkedForm,
  data,
}) => {
  const isFormSelected = !!selectedForm
  const displayText =
    formInfo?.Name || formInfo?.name || selectedFormName || data.value || 'Please select a form'

  const handleClick = (e) => {
    e.preventDefault()

    // If form is selected, open it; otherwise, trigger form selection
    if (isFormSelected && data.formSource) {
      if (typeof openLinkedForm === 'function') {
        openLinkedForm(data.formSource)
      }
    } else if (typeof onSelectChildForm === 'function') {
      onSelectChildForm(data.id, data.formSource)
    }
  }

  return (
    <div style={STYLES.container}>
      <div className="form-link-container" style={STYLES.linkContainer}>
        <div className="form-link-preview" style={STYLES.previewContainer}>
          <Button
            type="primary"
            style={STYLES.previewButton}
            className="form-link-action-btn"
            onClick={handleClick}
          >
            {displayText}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main component refactored as a functional component
const FormLink = (props) => {
  const {
    data,
    defaultValue,
    editor,
    getFormSource,
    getFormInfo,
    getActiveUserProperties,
    onSelectChildForm,
    openLinkedForm,
  } = props

  // Custom hooks for data and permissions
  const { formList, formInfo, selectedForm, setSelectedForm, loading } = useFormData(
    data,
    getFormSource,
    getFormInfo
  )
  const { tooltipText } = useEditorPermissions(editor, selectedForm, getActiveUserProperties)

  // Name of the form chosen in the element editor, resolved from the form source
  // list so the button shows it immediately after selection.
  const selectedFormName =
    getFormDisplayName(selectedForm) ||
    getFormDisplayName(formList.find((form) => form.id == data.formSource))

  // Sync with defaultValue prop changes
  useEffect(() => {
    if (defaultValue?.selectedFormId && defaultValue.selectedFormId !== selectedForm) {
      setSelectedForm(defaultValue.selectedFormId)
    }
  }, [defaultValue?.selectedFormId, selectedForm, setSelectedForm])

  // Build CSS classes
  const baseClasses = [
    data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem',
    data.pageBreakBefore ? 'alwaysbreak' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const wrapperClass = data.isShowLabel !== false ? 'form-group' : ''

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <section className={baseClasses} title={tooltipText}>
      <ComponentHeader {...props} />
      <div className={wrapperClass}>
        <ComponentLabel {...props} style={{ display: 'block' }} />
        <FormSelector
          // Deliberately not wired: clicks always route to onSelectChildForm so the
          // fill view opens the child form drawer (matches the legacy builder).
          // selectedForm={selectedForm}
          formInfo={formInfo}
          selectedFormName={selectedFormName}
          onSelectChildForm={onSelectChildForm}
          openLinkedForm={openLinkedForm}
          data={data}
        />
      </div>
    </section>
  )
}

export default FormLink
