import React from 'react'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const RadioButtons = (props) => {
  const optionsRef = React.useRef({})
  const infosRef = React.useRef({})
  // Initialize with empty array if defaultValue is null/undefined
  const [value, setValue] = React.useState(props.defaultValue || [])

  // Only update from defaultValue when it actually changes externally
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
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  let classNames = 'custom-control custom-radio'
  if (props.data.inline) {
    classNames += ' option-inline'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const { data, handleChange } = props
  const { formularKey } = data

  // Create unique name for RadioButtons in multi-column layout
  const isInDynamicColumn =
    props.data.parentId && props.data.row !== undefined && props.data.col !== undefined

  const uniqueName = isInDynamicColumn
    ? `${props.data.parentId}_row${props.data.row}_col${props.data.col}_${props.data.field_name}`
    : props.data.field_name

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel className="form-label" {...props} />
        {props.data.options.map((option) => {
          const this_key = `preview_${option.key}`
          const inputProps = {}
          inputProps.name = uniqueName // Use unique name instead of field_name

          inputProps.type = 'radio'
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
                  // Use onChange instead of onClick for proper radio button behavior
                  // Check if this option is already selected
                  const currentActiveValue = getActiveValue(value, option.key)
                  const isCurrentlySelected = currentActiveValue?.value

                  let newValue
                  if (isCurrentlySelected) {
                    // If already selected, deselect it (empty array)
                    newValue = [] // Clear selection
                  } else {
                    // If not selected, select this option with actual option value
                    newValue = [
                      {
                        key: option.key,
                        value: option.value, // Use actual option value, not just true
                        info: '',
                      },
                    ]
                  }

                  // Update local state
                  setValue(newValue)

                  // Always call handleChange to update form context
                  if (handleChange) {
                    handleChange(formularKey || props.data.field_name, newValue)
                  }

                  // Always update the local element state for immediate visual feedback
                  if (props.updateElement) {
                    // Apply the checked state to just this element's data
                    const updatedData = {
                      ...props.data,
                      dirty: true,
                      value: newValue,
                    }

                    // Update the local options to show selection visually
                    // This only affects THIS element, not others in the column
                    const localOptions = props.data.options.map((opt) => ({
                      ...opt,
                      checked: isCurrentlySelected ? false : opt.key === option.key,
                      selected: isCurrentlySelected ? false : opt.key === option.key,
                    }))
                    updatedData.options = localOptions

                    // Update just this element
                    props.updateElement(updatedData)
                  }

                  // If onElementChange is provided and we're in a dynamic column
                  if (props.onElementChange && isInDynamicColumn) {
                    // For selection changes in dynamic columns, we don't want to sync the selection state
                    // but we still need to notify the system that a change happened for other purposes
                    const updatedDataForSync = {
                      ...props.data,
                      // Deliberately NOT updating options or selection state
                    }

                    // Mark this as a selection-only change that shouldn't be synced
                    updatedDataForSync._selectionChangeOnly = true

                    // Notify the system about the change, but without selection state changes
                    props.onElementChange(updatedDataForSync)
                  }
                }}
                {...inputProps}
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

export default RadioButtons
