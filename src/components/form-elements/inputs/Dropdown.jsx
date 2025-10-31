import React from 'react'

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
    (e) => {
      const constValue = e.target.value
      setValue(constValue)

      const { data, handleChange: onFormularChange } = props
      const { formularKey, field_name } = data

      // Always call handleChange to update the form context
      if (onFormularChange) {
        // Use formularKey if it exists, otherwise use field_name
        onFormularChange(formularKey || field_name, constValue)
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (props.onElementChange) {
        // Create updated data object with the new value
        const updatedData = {
          ...props.data,
          value: constValue,
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
  selectProps.className = 'form-control'
  selectProps.name = props.data.field_name
  selectProps.value = value
  selectProps.onChange = handleChange

  if (props.mutable) {
    selectProps.defaultValue = value
    selectProps.ref = inputField
  }

  if (props.read_only || !isSameEditor) {
    selectProps.disabled = 'disabled'
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
        <select {...selectProps}>
          <option value="" key="default-0">
            Please Select
          </option>
          {props.data.options.map((option) => {
            const this_key = `preview_${option.key}`
            return (
              <option value={option.value} key={this_key}>
                {option.text}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export default Dropdown
