import React from 'react'

import { Checkbox, Input } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'
import { INFO_TEXTAREA_STYLE, OPTION_INFO_ROW_STYLE } from '../shared/optionInfoLayout'

const { TextArea } = Input

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

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const checkboxStyle = props.data.inline
    ? { display: 'block', marginRight: '16px', marginBottom: '4px' }
    : { display: 'block', marginBottom: '4px' }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel className="form-label" {...props} />
        {props.data.options.map((option) => {
          const this_key = `preview_${option.key}`

          // Check if the option is selected either from state or option properties
          const answerItem = getActiveValue(value, option.key)
          const isCheckedInOptions = option.checked || option.selected
          const isChecked = answerItem?.value ?? isCheckedInOptions ?? false

          const checkboxProps = {
            checked: props.mutable ? isChecked : isCheckedInOptions,
            disabled: props.read_only || !isSameEditor,
          }

          return (
            <div key={this_key} style={checkboxStyle}>
              <div className="rfb-option-info-row" style={OPTION_INFO_ROW_STYLE}>
                <Checkbox
                  {...checkboxProps}
                  onChange={(e) => {
                    const checked = e.target.checked

                    // Build new value array
                    const newValue = checked
                      ? [
                          ...(value || []).filter((item) => item.key !== option.key),
                          {
                            key: option.key,
                            value: option.value,
                            info: '',
                          },
                        ]
                      : (value || []).filter((item) => item.key !== option.key)

                    // Update local state
                    setValue(newValue)

                    // Call parent handleChange to update form context
                    if (props.handleChange) {
                      const { formularKey, field_name } = props.data
                      props.handleChange(formularKey || field_name, newValue)
                    }

                    // Defer state updates to avoid setState during render
                    setTimeout(() => {
                      // Always update the local element state for immediate visual feedback
                      if (props.updateElement) {
                        const updatedData = {
                          ...props.data,
                          dirty: true,
                          value: newValue,
                          options: props.data.options.map((opt) => ({
                            ...opt,
                            checked:
                              opt.key === option.key
                                ? checked
                                : getActiveValue(newValue, opt.key)?.value || false,
                          })),
                        }
                        props.updateElement(updatedData)
                      }

                      // If onElementChange is provided for column sync
                      const isInDynamicColumn = props.data.parentId && props.data.row !== undefined
                      if (props.onElementChange && isInDynamicColumn) {
                        props.onElementChange({ ...props.data, _selectionChangeOnly: true })
                      }
                    }, 0)
                  }}
                >
                  <span className="rfb-option-text" style={{ fontSize: '14px', color: '#262626' }}>
                    {option.text}
                  </span>
                </Checkbox>
                {isChecked && option.info && (
                  <TextArea
                    className="rfb-info-textarea"
                    rows={2}
                    style={INFO_TEXTAREA_STYLE}
                    defaultValue={answerItem?.info ?? ''}
                    onChange={(e) => {
                      const infoValue = e.target.value
                      const newValue = (value || []).map((item) =>
                        (item.key === option.key ? { ...item, info: infoValue } : item)
                      )
                      setValue(newValue)
                      if (props.handleChange) {
                        const { formularKey, field_name } = props.data
                        props.handleChange(formularKey || field_name, newValue)
                      }
                    }}
                    ref={(c) => {
                      if (c && props.mutable) {
                        infosRef.current[`child_ref_${option.key}_info`] = c
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Checkboxes
