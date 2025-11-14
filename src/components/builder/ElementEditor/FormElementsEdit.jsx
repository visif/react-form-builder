import React, { useCallback, useMemo } from 'react'

import '../../../styles/draft-align.css'
import { useFormElementEdit } from './hooks/useFormElementEdit'
import { createImageUploadHandler } from './utils/imageUploadHandler'
import { buildFieldConfigs } from './configs/fieldConfigs'

/**
 * FormElementsEdit - Main component for editing form element properties
 * Displays appropriate editor fields based on element type and properties
 *
 * @param {Object} props - Component props
 * @param {Object} props.element - The form element being edited
 * @param {Array} props.data - Form data
 * @param {Object} props.preview - Preview component reference
 * @param {Function} props.updateElement - Function to update element in parent
 * @param {Function} props.manualEditModeOff - Function to close the editor
 * @param {Function} props.getFormSource - API call to fetch available forms
 * @param {Function} props.getFormContent - API call to fetch form structure
 * @param {Function} props.onImageUpload - Callback for image uploads
 * @param {Array} props.files - Available files for file selection
 * @param {boolean} props.showCorrectColumn - Show correct answer fields
 */
const FormElementsEdit = (props) => {
  // Use custom hook for state and edit logic
  const {
    element,
    formDataSource,
    activeForm,
    editElementProp,
    onContentChange,
    updateElement,
    setElement,
  } = useFormElementEdit(props)

  // Create image upload handler
  const onUploadFile = useCallback(
    createImageUploadHandler(setElement, props),
    [props, setElement]
  )

  // Prepare file options
  const fileOptions = useMemo(() => {
    const options = props.files?.length ? props.files : []
    if (options.length < 1 || (options.length > 0 && options[0].id !== '')) {
      options.unshift({ id: '', file_name: '' })
    }
    return options
  }, [props.files])

  // Build field configurations
  const fieldConfigs = useMemo(
    () =>
      buildFieldConfigs({
        props,
        element,
        fileOptions,
        formDataSource,
        activeForm,
        onUploadFile,
        editElementProp,
        onContentChange,
        updateElement,
      }),
    [
      props,
      element,
      fileOptions,
      formDataSource,
      activeForm,
      onUploadFile,
      editElementProp,
      onContentChange,
      updateElement,
    ]
  )

  // Render the editor UI
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with element name and close button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <h2 style={{ margin: 0 }}>{props.element.text}</h2>
        <button
          type="button"
          className="dismiss-edit"
          onClick={props.manualEditModeOff}
          style={{
            border: 'none',
            background: 'none',
            padding: '5px',
            paddingRight: '24px',
            cursor: 'pointer',
            fontSize: '125%',
            color: '#333',
          }}
        >
          <i className="fas fa-times" />
        </button>
      </div>

      {/* Scrollable editor fields container */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '30px' }}>
        {fieldConfigs.map((config, index) => {
          if (!config.condition()) return null
          const Component = config.component
          return <Component key={index} {...config.props} />
        })}
      </div>
    </div>
  )
}

FormElementsEdit.defaultProps = { className: 'edit-element-fields' }

export default FormElementsEdit
