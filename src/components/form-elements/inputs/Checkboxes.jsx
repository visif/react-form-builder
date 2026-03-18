import React from 'react'

import { Checkbox, Input } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                <Checkbox
                  {...checkboxProps}
                  onChange={(e) => {
                    const checked = e.target.checked
                    console.log('Checkbox clicked!', option.key, 'Checked:', checked)

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

                    console.log('New value:', newValue)

                    // Update local state
                    setValue(newValue)

                    // Call parent handleChange to update form context
                    if (props.handleChange) {
                      console.log('Calling handleChange with:', props.data.field_name, newValue)
                      props.handleChange(props.data.field_name, newValue)
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
                  <span style={{ fontSize: '13px', color: '#262626' }}>{option.text}</span>
                </Checkbox>
                {isChecked && option.info && (
                  <TextArea
                    rows={2}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      color: 'rgba(0, 0, 0, 0.85)',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.85)',
                      opacity: 1,
                    }}
                    defaultValue={answerItem?.info ?? ''}
                    onChange={(e) => {
                      const infoValue = e.target.value
                      const newValue = (value || []).map((item) =>
                        item.key === option.key ? { ...item, info: infoValue } : item
                      )
                      setValue(newValue)
                      if (props.handleChange) {
                        props.handleChange(props.data.field_name, newValue)
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
