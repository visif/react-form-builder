import React from 'react'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Checkboxes = (props) => {
  const optionsRef = React.useRef({})
  const infosRef = React.useRef({})
  // Initialize with empty array if defaultValue is null/undefined
  const [value, setValue] = React.useState(props.defaultValue || [])

  // Only update from defaultValue on initial mount or when explicitly changed externally
  // Don't reset on every render as it breaks user interactions
  const initialDefaultValue = React.useRef(props.defaultValue)
  React.useEffect(() => {
    // Deep comparison for arrays since defaultValue might be recreated on every render
    const defaultValueJSON = JSON.stringify(props.defaultValue || [])
    const currentValueJSON = JSON.stringify(value || [])
    const initialValueJSON = JSON.stringify(initialDefaultValue.current || [])

    // Only sync if defaultValue changed from initial AND is different from current value
    const defaultChanged = defaultValueJSON !== initialValueJSON
    const differentFromCurrent = defaultValueJSON !== currentValueJSON

    if (defaultChanged && differentFromCurrent) {
      console.log('RESETTING VALUE because defaultValue changed externally')
      setValue(props.defaultValue || [])
      initialDefaultValue.current = props.defaultValue
    }
  }, [props.defaultValue, value])

  const getActiveValue = React.useCallback(
    (values, key) => values?.find((item) => item.key === key),
    []
  )

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  let classNames = 'custom-control custom-checkbox'
  if (props.data.inline) {
    classNames += ' option-inline'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel className="form-label" {...props} />
        {props.data.options.map((option) => {
          const this_key = `preview_${option.key}`

          const inputProps = {}
          inputProps.name = `option_${option.key}`
          inputProps.type = 'checkbox'
          inputProps.value = option.value

          // Check if the option is selected either from state or option properties
          const answerItem = getActiveValue(value, option.key)
          const isCheckedInOptions = option.checked || option.selected

          if (props.mutable) {
            inputProps.checked = answerItem?.value ?? isCheckedInOptions ?? false
          }

          if (props.read_only || !isSameEditor) {
            inputProps.disabled = 'disabled'
          }

          console.log('Rendering checkbox:', option.key, {
            answerItem,
            isCheckedInOptions,
            finalChecked: inputProps.checked,
            mutable: props.mutable,
            disabled: inputProps.disabled,
            value: value
          })

          return (
            <div
              className={classNames}
              key={this_key}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <input
                id={`fid_${this_key}`}
                className="custom-control-input"
                {...inputProps}
                ref={(c) => {
                  if (c && props.mutable) {
                    optionsRef.current[`child_ref_${option.key}`] = c
                  }
                }}
                onChange={() => {
                  console.log('Checkbox clicked!', option.key, 'Current value:', value)
                  // Calculate the new value first
                  const activeVal = getActiveValue(value, option.key)

                  // Toggle: if currently selected, remove it; otherwise add with actual option value
                  const isCurrentlySelected = activeVal?.value
                  const newActiveVal = isCurrentlySelected
                    ? null // Will be filtered out below
                    : {
                        key: option.key,
                        value: option.value, // Use actual option value, not just true
                        info: '',
                      }

                  // Build new value array - filter out this option, then add if selected
                  const newValue = newActiveVal
                    ? [
                        ...(value || []).filter((item) => item.key !== option.key),
                        newActiveVal,
                      ]
                    : (value || []).filter((item) => item.key !== option.key)

                  console.log('New value:', newValue)

                  // Update local state
                  setValue(newValue)

                  // Call parent handleChange to update form context
                  if (props.handleChange) {
                    console.log('Calling handleChange with:', props.data.field_name, newValue)
                    props.handleChange(props.data.field_name, newValue)
                  } else {
                    console.log('No handleChange prop!')
                  }

                  // If we're in a dynamic column and this is a UI-only change (selection)
                  const isInDynamicColumn =
                    props.data.parentId &&
                    props.data.row !== undefined &&
                    props.data.col !== undefined

                  // Always update the local element state for immediate visual feedback
                  if (props.updateElement) {
                    const updatedData = {
                      ...props.data,
                      dirty: true,
                      value: newValue,
                    }

                    // Update the local options to show selection visually
                    const localOptions = props.data.options.map((opt) => ({
                      ...opt,
                      checked:
                        opt.key === option.key
                          ? !activeVal?.value
                          : getActiveValue(newValue, opt.key)?.value || false,
                    }))
                    updatedData.options = localOptions

                    // Update just this element
                    props.updateElement(updatedData)
                  }

                  // If onElementChange is provided, but we avoid sending selection state
                  if (props.onElementChange && isInDynamicColumn) {
                    const updatedDataForSync = {
                      ...props.data,
                    }

                    updatedDataForSync._selectionChangeOnly = true
                    props.onElementChange(updatedDataForSync)
                  }
                }}
              />
              <label className="custom-control-label" htmlFor={`fid_${this_key}`}>
                {option.text}
              </label>
              {inputProps.checked && option.info && (
                <textarea
                  id={`fid_${this_key}_info`}
                  type="text"
                  className="form-control"
                  style={{
                    width: 'auto',
                    marginLeft: 16,
                    minHeight: '60px',
                    marginBottom: 4,
                  }}
                  rows={2}
                  defaultValue={answerItem?.info ?? ''}
                  ref={(c) => {
                    if (c && props.mutable) {
                      infosRef.current[`child_ref_${option.key}_info`] = c
                    }
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Checkboxes
