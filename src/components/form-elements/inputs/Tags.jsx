import React from 'react'

import { Select } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Tags = (props) => {
  const inputField = React.useRef(null)

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

  const handleChange = React.useCallback((selectedValues) => {
    setValue(selectedValues || [])
  }, [])

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
