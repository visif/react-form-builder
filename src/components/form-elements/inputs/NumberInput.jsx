import React from 'react'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const NumberInput = (props) => {
  const inputField = React.useRef()
  const [value, setValue] = React.useState(props.defaultValue || '')

  const handleKeyPress = React.useCallback((e) => {
    // Allow: numbers, decimal point, minus sign, plus sign, basic math operators, and percentage
    const allowedChars = /[0-9.\-+*/()=% ]/
    const char = String.fromCharCode(e.which)

    if (!allowedChars.test(char) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
    }
  }, [])

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
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const inputProps = {}
  inputProps.type = 'number'
  inputProps.className = 'form-control'
  inputProps.name = props.data.field_name
  inputProps.onChange = handleChange
  inputProps.onKeyPress = handleKeyPress
  inputProps.value = value

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue
    inputProps.ref = inputField
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled'
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
        <input {...inputProps} />
      </div>
    </div>
  )
}

export default NumberInput
