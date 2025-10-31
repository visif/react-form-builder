import React from 'react'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const TextInput = (props) => {
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

  const inputProps = {}
  inputProps.type = 'text'
  inputProps.className = 'form-control'
  inputProps.name = props.data.field_name
  inputProps.onChange = handleChange
  inputProps.value = value

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue
    inputProps.ref = inputField
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <input {...inputProps} />
      </div>
    </div>
  )
}

export default TextInput
