import React from 'react'

import Select from 'react-select'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Tags = (props) => {
  const inputField = React.useRef(null)

  const getDefaultValue = React.useCallback((defaultValue, options) => {
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        const vals = defaultValue.split(',').map((x) => x.trim())
        return options.filter((x) => vals.indexOf(x.value) > -1)
      }
      return options.filter((x) => defaultValue.indexOf(x.value) > -1)
    }
    return []
  }, [])

  const [value, setValue] = React.useState(getDefaultValue(props.defaultValue, props.data.options))

  const handleChange = React.useCallback((e) => {
    setValue(e || [])
  }, [])

  const options = props.data.options.map((option) => {
    option.label = option.text
    return option
  })

  const selectProps = {}
  selectProps.isMulti = true
  selectProps.name = props.data.field_name
  selectProps.onChange = handleChange

  selectProps.options = options
  if (!props.mutable) {
    selectProps.value = options[0].text
  } // to show a sample of what tags looks like

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  if (props.mutable) {
    selectProps.isDisabled = !!(props.read_only || !isSameEditor)
    selectProps.value = value
    selectProps.ref = inputField
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
