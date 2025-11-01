import React from 'react'

import { Select } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Dropdown = (props) => {
  const inputField = React.useRef()
  const [value, setValue] = React.useState(props.defaultValue)

  // Update value when defaultValue prop changes
  React.useEffect(() => {
    setValue(props.defaultValue)
  }, [props.defaultValue])

  const handleChange = React.useCallback(
    (selectedValue) => {
      setValue(selectedValue)

      const { data, handleChange: onFormularChange } = props
      const { formularKey, field_name } = data

      // Always call handleChange to update the form context
      if (onFormularChange) {
        // Use formularKey if it exists, otherwise use field_name
        onFormularChange(formularKey || field_name, selectedValue)
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (props.onElementChange) {
        // Create updated data object with the new value
        const updatedData = {
          ...props.data,
          value: selectedValue,
        }

        // Send it for synchronization across columns
        props.onElementChange(updatedData)

        // Immediately apply changes to this component's data
        // This makes changes visible in edit mode instantly
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

  const selectProps = {}
  selectProps.style = { width: '100%' }
  selectProps.placeholder = 'Please Select'
  selectProps.value = value || undefined
  selectProps.onChange = handleChange

  if (props.mutable) {
    selectProps.ref = inputField
  }

  if (props.read_only || !isSameEditor) {
    selectProps.disabled = true
  }

  // Convert options to Ant Design format
  const options = [
    { value: '', label: 'Please Select' },
    ...props.data.options.map((option) => ({
      value: option.value,
      label: option.text,
    })),
  ]

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <Select {...selectProps} options={options} />
      </div>
    </div>
  )
}

export default Dropdown
