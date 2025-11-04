import React from 'react'

import { Select } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Tags = (props) => {
  const getDefaultValue = React.useCallback((defaultValue, options) => {
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        const vals = defaultValue.split(',').map((x) => x.trim())
        return vals.filter((val) => options.some((opt) => opt.value === val))
      }
      return defaultValue.filter((val) => options.some((opt) => opt.value === val))
    }
    return []
  }, [])

  const [value, setValue] = React.useState(getDefaultValue(props.defaultValue, props.data.options))

  // Initialize form context with default value on mount
  React.useEffect(() => {
    const { data, handleChange: onFormularChange } = props
    const { formularKey, field_name } = data
    const initialValue = getDefaultValue(props.defaultValue, props.data.options)

    // Always initialize in context, even if empty
    if (onFormularChange) {
      onFormularChange(formularKey || field_name, initialValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run on mount

  const handleChange = React.useCallback((selectedValues) => {
    const newValue = selectedValues || []
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
  }, [props])

  const options = props.data.options.map((option) => ({
    value: option.value,
    label: option.text,
  }))

  const selectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    placeholder: props.data.label || 'Select tags',
    onChange: handleChange,
    options,
  }

  if (!props.mutable) {
    selectProps.value = options.length > 0 ? [options[0].value] : []
  }

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  if (props.mutable) {
    selectProps.disabled = !!(props.read_only || !isSameEditor)
    selectProps.value = value
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
        <Select {...selectProps} />
      </div>
    </div>
  )
}

export default Tags
