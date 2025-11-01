import React from 'react'

import { Input } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const { TextArea: AntTextArea } = Input

const TextArea = (props) => {
  const inputField = React.useRef()
  const [value, setValue] = React.useState(props.defaultValue || '')

  const handleChange = React.useCallback(
    (e) => {
      const { value: newValue } = e.target
      setValue(newValue)

      const { data, handleChange: onFormularChange } = props
      const { formularKey, field_name } = data

      // Always call handleChange to update the form context
      if (onFormularChange) {
        // Use formularKey if it exists, otherwise use field_name
        onFormularChange(formularKey || field_name, newValue)
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (props.onElementChange) {
        // Create updated data object with the new value
        const updatedData = {
          ...props.data,
          value: newValue,
        }

        // Send it for synchronization across columns
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

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const textareaProps = {}
  textareaProps.name = props.data.field_name
  textareaProps.rows = 3
  textareaProps.autoSize = { minRows: 3, maxRows: 10 }
  textareaProps.onChange = handleChange
  textareaProps.value = value
  textareaProps.style = { width: '100%' }

  if (props.read_only || !isSameEditor) {
    textareaProps.disabled = true
  }

  if (props.mutable) {
    textareaProps.ref = inputField
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <AntTextArea {...textareaProps} />
      </div>
    </div>
  )
}

export default TextArea
