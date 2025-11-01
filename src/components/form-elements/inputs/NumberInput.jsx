import React from 'react'

import { InputNumber } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const NumberInput = (props) => {
  const inputField = React.useRef()
  const [value, setValue] = React.useState(props.defaultValue || '')

  const handleChange = React.useCallback(
    (newValue) => {
      // InputNumber returns number or null, convert to string for consistency
      const stringValue = newValue !== null && newValue !== undefined ? String(newValue) : ''
      setValue(stringValue)

      const { data, handleChange: onFormularChange } = props
      const { formularKey, field_name } = data

      // Always call handleChange to update the form context
      if (onFormularChange) {
        // Use formularKey if it exists, otherwise use field_name
        onFormularChange(formularKey || field_name, stringValue)
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (props.onElementChange) {
        // Create updated data object with the new value
        const updatedData = {
          ...props.data,
          value: stringValue,
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
  inputProps.name = props.data.field_name
  inputProps.onChange = handleChange
  inputProps.value = value ? Number(value) : null
  inputProps.style = { width: '100%' }
  inputProps.controls = true
  inputProps.keyboard = true

  if (props.mutable) {
    inputProps.ref = inputField
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = true
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
        <InputNumber {...inputProps} />
      </div>
    </div>
  )
}

export default NumberInput
