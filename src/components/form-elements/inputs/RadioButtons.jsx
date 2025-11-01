import React from 'react'

import { Radio, Input } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const { TextArea } = Input

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

  const radioStyle = props.data.inline
    ? { display: 'inline-block', marginRight: '16px', marginBottom: '4px' }
    : { display: 'block', marginBottom: '4px' }

  // Find the currently selected option
  const selectedOption = value?.find(item => item.value)

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel className="form-label" {...props} />
        <Radio.Group
          name={uniqueName}
          value={selectedOption?.key}
          disabled={props.read_only || !isSameEditor}
          onChange={(e) => {
            const selectedKey = e.target.value
            const option = props.data.options.find(opt => opt.key === selectedKey)

            const newValue = [{
              key: option.key,
              value: option.value,
              info: '',
            }]

            setValue(newValue)

            if (handleChange) {
              handleChange(formularKey || props.data.field_name, newValue)
            }

            if (props.updateElement) {
              const updatedData = {
                ...props.data,
                dirty: true,
                value: newValue,
                options: props.data.options.map((opt) => ({
                  ...opt,
                  checked: opt.key === selectedKey,
                  selected: opt.key === selectedKey,
                })),
              }
              props.updateElement(updatedData)
            }

            if (props.onElementChange && isInDynamicColumn) {
              props.onElementChange({
                ...props.data,
                _selectionChangeOnly: true,
              })
            }
          }}
        >
          {props.data.options.map((option) => {
            const this_key = `preview_${option.key}`
            const answerItem = getActiveValue(value, option.key)
            const isCheckedInOptions = option.checked || option.selected
            const isChecked = answerItem?.value ?? isCheckedInOptions ?? false

            return (
              <div key={this_key} style={radioStyle}>
                <Radio value={option.key}>
                  <span style={{ fontSize: '13px', color: '#262626' }}>{option.text}</span>
                </Radio>
                {isChecked && option.info && (
                  <TextArea
                    rows={2}
                    style={{ width: '100%', marginTop: '8px' }}
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
        </Radio.Group>
      </div>
    </div>
  )
}

export default RadioButtons
