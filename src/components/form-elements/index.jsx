// eslint-disable-next-line max-classes-per-file
import React from 'react'
import { Slider } from 'antd'
import Select from 'react-select'
import SignaturePad from 'react-signature-canvas'
import TextAreaAutosize from 'react-textarea-autosize'
import ComponentHeader from './shared/ComponentHeader'
import ComponentLabel from './shared/ComponentLabel'
import DataSource from './advanced/DataSource'
import DatePicker from './inputs/DatePicker'
import FileUpload from './uploads/FileUpload'
import FormLink from './advanced/FormLink'
import FormulaInput from './inputs/FormulaInput'
import HeaderBar from './display/HeaderBar'
import ImageUpload from './uploads/ImageUpload'
import myxss from '../../utils/xss'
import Section from './display/Section'
import Signature2 from './advanced/Signature2'
import StarRating from './advanced/StarRating'
import Table from './inputs/Table'

const FormElements = {}

const Header = (props) => {
  // const headerClasses = `dynamic-input ${props.data.element}-input`;
  let classNames = 'static'
  if (props.data.bold) {
    classNames += ' bold'
  }
  if (props.data.italic) {
    classNames += ' italic'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <h3
        className={classNames}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  )
}

const Paragraph = (props) => {
  let classNames = 'static'
  if (props.data.bold) {
    classNames += ' bold'
  }
  if (props.data.italic) {
    classNames += ' italic'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <p
        className={classNames}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  )
}

const Label = (props) => {
  let classNames = 'static'
  if (props.data.bold) {
    classNames += ' bold'
  }
  if (props.data.italic) {
    classNames += ' italic'
  }

  // Add alignment support
  const style = { display: 'block' } // Always make label a block element

  if (props.data.center) {
    style.textAlign = 'center'
  } else if (props.data.right) {
    style.textAlign = 'right'
  } else if (props.data.left) {
    style.textAlign = 'left'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <label
        className={classNames}
        style={style}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  )
}

const LineBreak = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <hr />
    </div>
  )
}

const TextInput = (props) => {
  const inputField = React.useRef()
  const [value, setValue] = React.useState(props.defaultValue || '')

  const handleChange = React.useCallback(
    (e) => {
      const { value: newValue } = e.target
      setValue(newValue)

      const { data, handleChange: onFormularChange } = props
      const { formularKey } = data
      if (formularKey && onFormularChange) {
        onFormularChange(formularKey, newValue)
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
  inputProps.type = 'text'
  inputProps.className = 'form-control'
  inputProps.name = props.data.field_name
  inputProps.onChange = handleChange
  inputProps.value = value

  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue
    inputProps.ref = inputField
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled'
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
      const { formularKey } = data
      if (formularKey && onFormularChange) {
        onFormularChange(formularKey, newValue)
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

const TextArea = (props) => {
  const inputField = React.useRef()
  const [value, setValue] = React.useState(props.defaultValue || '')

  const handleChange = React.useCallback(
    (e) => {
      const { value: newValue } = e.target
      setValue(newValue)

      const { data, handleChange: onFormularChange } = props
      const { formularKey } = data
      if (formularKey && onFormularChange) {
        onFormularChange(formularKey, newValue)
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

  const textareaProps = {}
  textareaProps.className = 'form-control'
  textareaProps.name = props.data.field_name
  textareaProps.minRows = 3
  textareaProps.onChange = handleChange
  textareaProps.value = value

  if (props.read_only || !isSameEditor) {
    textareaProps.disabled = 'disabled'
  }

  if (props.mutable) {
    textareaProps.defaultValue = props.defaultValue
    textareaProps.ref = inputField
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
        <TextAreaAutosize {...textareaProps} />
      </div>
    </div>
  )
}

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
      const { formularKey } = data
      if (formularKey && onFormularChange) {
        onFormularChange(formularKey, constValue)
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
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
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

const Signature = (props) => {
  const [defaultValue, setDefaultValue] = React.useState(props.defaultValue)
  const inputField = React.useRef(null)
  const canvas = React.useRef(null)

  const clear = React.useCallback(() => {
    if (defaultValue) {
      setDefaultValue('')

      // Immediately apply changes to this component's data when clearing signature
      if (props.onElementChange) {
        const updatedData = {
          ...props.data,
          value: '',
        }

        props.onElementChange(updatedData)

        if (props.data.dirty === undefined || props.data.dirty) {
          updatedData.dirty = true
          if (props.updateElement) {
            props.updateElement(updatedData)
          }
        }
      }
    } else if (canvas.current) {
      canvas.current.clear()
    }
  }, [defaultValue, props])

  // Handle signature changes
  const handleSignatureChange = React.useCallback(() => {
    // Only trigger if canvas is available
    if (!canvas.current) return

    // Get the signature data
    const signatureData = canvas.current.toDataURL().split(',')[1]

    // If onElementChange is provided, call it to synchronize changes across columns
    if (props.onElementChange) {
      const updatedData = {
        ...props.data,
        value: signatureData,
      }

      props.onElementChange(updatedData)

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true
        if (props.updateElement) {
          props.updateElement(updatedData)
        }
      }
    }

    setDefaultValue(signatureData)
  }, [props])

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  let canClear = !!defaultValue
  const inputProps = {}
  inputProps.type = 'hidden'
  inputProps.name = props.data.field_name

  if (props.mutable) {
    inputProps.defaultValue = defaultValue
    inputProps.ref = inputField
  }
  const pad_props = {}
  // umd requires canvasProps={{ width: 400, height: 150 }}
  if (props.mutable) {
    pad_props.defaultValue = defaultValue
    pad_props.ref = canvas
    pad_props.onEnd = handleSignatureChange
    canClear = !props.read_only || isSameEditor
  }

  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  let sourceDataURL
  if (defaultValue && defaultValue.length > 0) {
    sourceDataURL = `data:image/png;base64,${defaultValue}`
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        {props.read_only === true || !isSameEditor || !!sourceDataURL ? (
          <img src={sourceDataURL} />
        ) : (
          <SignaturePad {...pad_props} />
        )}
        {canClear && (
          <i
            className="fas fa-times clear-signature"
            onClick={clear}
            title="Clear Signature"
          />
        )}
        <input {...inputProps} />
      </div>
    </div>
  )
}

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
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  if (props.mutable) {
    // selectProps.isDisabled = props.read_only;
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


const Checkboxes = (props) => {
  const optionsRef = React.useRef({})
  const infosRef = React.useRef({})
  const [value, setValue] = React.useState(props.defaultValue)

  // Update value when defaultValue prop changes
  React.useEffect(() => {
    setValue(props.defaultValue)
  }, [props.defaultValue])

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

  // Add debugging
  console.log('Checkboxes Debug:', {
    userProperties,
    savedEditor,
    isSameEditor,
    hasDCCRole: userProperties?.hasDCCRole,
    readOnly: props.read_only,
    finalDisabled: props.read_only || !isSameEditor,
  })

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

          return (
            <div
              className={classNames}
              key={this_key}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <input
                id={`fid_${this_key}`}
                className="custom-control-input"
                ref={(c) => {
                  if (c && props.mutable) {
                    optionsRef.current[`child_ref_${option.key}`] = c
                  }
                }}
                onChange={() => {
                  setValue((current) => {
                    const activeVal = getActiveValue(current, option.key)
                    const newActiveVal = activeVal
                      ? { ...activeVal, value: !activeVal.value }
                      : {
                          key: option.key,
                          value: true,
                          info: '',
                        }

                    if (!current) {
                      return current
                    }

                    const newValue = [
                      ...(current || []).filter((item) => item.key !== option.key),
                      newActiveVal,
                    ]

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

                    return newValue
                  })
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

const RadioButtons = (props) => {
  const optionsRef = React.useRef({})
  const infosRef = React.useRef({})
  const [value, setValue] = React.useState(props.defaultValue)

  React.useEffect(() => {
    if (JSON.stringify(props.defaultValue) !== JSON.stringify(value)) {
      setValue(props.defaultValue)
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

  // Add debugging for RadioButtons
  console.log('RadioButtons Debug:', {
    userProperties,
    savedEditor,
    isSameEditor,
    hasDCCRole: userProperties?.hasDCCRole,
    readOnly: props.read_only,
    finalDisabled: props.read_only || !isSameEditor,
  })

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
    props.data.parentId &&
    props.data.row !== undefined &&
    props.data.col !== undefined

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
                ref={(c) => {
                  if (c && props.mutable) {
                    optionsRef.current[`child_ref_${option.key}`] = c
                  }
                }}
                onClick={() => {
                  // Remove the isSameEditor check here since it's already handled by the disabled prop
                  setValue((current) => {
                    if (formularKey && handleChange) {
                      handleChange(formularKey, option.value)
                    }

                    // Check if this option is already selected
                    const currentActiveValue = getActiveValue(current, option.key)
                    const isCurrentlySelected = currentActiveValue?.value === true

                    let newValue
                    if (isCurrentlySelected) {
                      // If already selected, deselect it (empty array)
                      newValue = [] // Clear selection
                    } else {
                      // If not selected, select this option
                      newValue = [
                        {
                          key: option.key,
                          value: true,
                          info: '',
                        },
                      ]
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

                    return newValue
                  })
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
                    // height: 'calc(1.5em + .5rem)',
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

const Image = (props) => {
  const style = props.data.center ? { textAlign: 'center' } : null

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses} style={style}>
      <ComponentHeader {...props} />
      {props.data.src && (
        <img
          style={{ maxWidth: '100%', height: 'auto' }}
          src={props.data.src}
          width={props.data.width}
          height={props.data.height}
        />
      )}
      {!props.data.src && <div className="no-image">No Image</div>}
    </div>
  )
}

const Rating = (props) => {
  const inputField = React.useRef(null)

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const starProps = {}
  starProps.name = props.data.field_name
  starProps.ratingAmount = 5

  if (props.mutable) {
    starProps.rating = props.defaultValue !== undefined ? parseFloat(props.defaultValue, 10) : 0
    starProps.editing = true
    // starProps.disabled = props.read_only ||;
    starProps.disabled = !!(props.read_only || !isSameEditor)
    starProps.ref = inputField
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
        <StarRating {...starProps} />
      </div>
    </div>
  )
}

const HyperLink = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <a target="_blank" href={props.data.href} rel="noreferrer">
          {props.data.content}
        </a>
      </div>
    </div>
  )
}

const Download = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <a href={`${props.download_path}?id=${props.data.file_path}`}>
          {props.data.content}
        </a>
      </div>
    </div>
  )
}

const Camera = (props) => {
  const [img, setImg] = React.useState(null)

  const displayImage = React.useCallback((e) => {
    const { target } = e
    let file
    let reader

    if (target.files && target.files.length) {
      file = target.files[0]
      // eslint-disable-next-line no-undef
      reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = () => {
        setImg(reader.result)
      }
    }
  }, [])

  const clearImage = React.useCallback(() => {
    setImg(null)
  }, [])

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const name = props.data.field_name
  const fileInputStyle = img ? { display: 'none' } : null
  let sourceDataURL
  if (props.read_only === true && props.defaultValue && props.defaultValue.length > 0) {
    if (props.defaultValue.indexOf(name > -1)) {
      sourceDataURL = props.defaultValue
    } else {
      sourceDataURL = `data:image/png;base64,${props.defaultValue}`
    }
  }
  console.log('sourceDataURL', sourceDataURL)
  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        {props.read_only === true && props.defaultValue && props.defaultValue.length > 0 ? (
          <div>
            <img src={sourceDataURL} />
          </div>
        ) : (
          <div className="image-upload-container">
            <div style={fileInputStyle}>
              <input
                name={name}
                type="file"
                accept="image/*"
                capture="camera"
                className="image-upload"
                onChange={displayImage}
              />
              <div className="image-upload-control">
                <div className="btn btn-default">
                  <i className="fas fa-camera" /> Upload Photo
                </div>
                <p>Select an image from your computer or device.</p>
              </div>
            </div>

            {img && (
              <div>
                <img src={img} height="100" className="image-upload-preview" />
                <br />
                <div className="btn btn-image-clear" onClick={clearImage}>
                  <i className="fas fa-times" /> Clear Photo
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const Range = (props) => {
  const inputField = React.useRef(null)
  const [value, setValue] = React.useState(
    props.defaultValue !== undefined
      ? parseInt(props.defaultValue, 10)
      : parseInt(props.data.default_value, 10)
  )

  const changeValue = React.useCallback((e) => {
    const { target } = e
    setValue(target.value)
  }, [])

  const rangeProps = {}
  const name = props.data.field_name

  rangeProps.type = 'range'
  rangeProps.list = `tickmarks_${name}`
  rangeProps.min = props.data.min_value
  rangeProps.max = props.data.max_value
  rangeProps.step = props.data.step

  rangeProps.value = value
  rangeProps.change = changeValue

  if (props.mutable) {
    rangeProps.ref = inputField
  }

  const datalist = []
  for (
    let i = parseInt(rangeProps.min, 10);
    i <= parseInt(rangeProps.max, 10);
    i += parseInt(rangeProps.step, 10)
  ) {
    datalist.push(i)
  }

  const oneBig = 100 / (datalist.length - 1)

  const _datalist = datalist.map((d, idx) => (
    <option key={`${rangeProps.list}_${idx}`}>{d}</option>
  ))

  const visible_marks = datalist.map((d, idx) => {
    const option_props = {}
    let w = oneBig
    if (idx === 0 || idx === datalist.length - 1) {
      w = oneBig / 2
    }
    option_props.key = `${rangeProps.list}_label_${idx}`
    option_props.style = { width: `${w}%` }
    if (idx === datalist.length - 1) {
      option_props.style = { width: `${w}%`, textAlign: 'right' }
    }
    return <label {...option_props}>{d}</label>
  })

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <div className="range">
          <div className="clearfix">
            <span className="float-left">{props.data.min_label}</span>
            <span className="float-right">{props.data.max_label}</span>
          </div>
          <Slider
            min={rangeProps.min}
            max={rangeProps.max}
            step={rangeProps.step}
            value={rangeProps.value}
            onChange={(newValue) => {
              setValue(newValue)
              if (rangeProps.change) {
                rangeProps.change({ target: { value: newValue } })
              }
            }}
            marks={datalist.reduce((acc, val) => {
              acc[val] = ''
              return acc
            }, {})}
          />
        </div>
        <div className="visible_marks">{visible_marks}</div>
        <input name={name} value={value} type="hidden" />
        <datalist id={rangeProps.list}>{_datalist}</datalist>
      </div>
    </div>
  )
}


FormElements.Header = Header
FormElements.HeaderBar = HeaderBar
FormElements.Paragraph = Paragraph
FormElements.Label = Label
FormElements.LineBreak = LineBreak
FormElements.TextInput = TextInput
FormElements.NumberInput = NumberInput
FormElements.TextArea = TextArea
FormElements.Dropdown = Dropdown
FormElements.Signature = Signature
FormElements.Checkboxes = Checkboxes
FormElements.DatePicker = DatePicker
FormElements.RadioButtons = RadioButtons
FormElements.Image = Image
FormElements.Rating = Rating
FormElements.Tags = Tags
FormElements.HyperLink = HyperLink
FormElements.Download = Download
FormElements.Camera = Camera
FormElements.Range = Range
FormElements.Table = Table
FormElements.Section = Section
FormElements.Signature2 = Signature2
FormElements.DataSource = DataSource
FormElements.FileUpload = FileUpload
FormElements.ImageUpload = ImageUpload
FormElements.FormulaInput = FormulaInput
FormElements.FormLink = FormLink
export default FormElements
