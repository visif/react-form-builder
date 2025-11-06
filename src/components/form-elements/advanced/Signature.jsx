import React from 'react'
import { Button, Image } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import SignaturePad from 'react-signature-canvas'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Signature = (props) => {
  const [defaultValue, setDefaultValue] = React.useState(props.defaultValue)
  const inputField = React.useRef(null)
  const canvas = React.useRef(null)

  const clear = React.useCallback(() => {
    if (defaultValue) {
      setDefaultValue('')

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, '')
      }

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

      // Update form context when clearing canvas
      if (props.handleChange) {
        props.handleChange(props.data.field_name, '')
      }
    }
  }, [defaultValue, props])

  // Handle signature changes
  const handleSignatureChange = React.useCallback(() => {
    // Only trigger if canvas is available
    if (!canvas.current) return

    // Get the signature data
    const signatureData = canvas.current.toDataURL().split(',')[1]

    // Update form context
    if (props.handleChange) {
      props.handleChange(props.data.field_name, signatureData)
    }

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

  // Initialize form context with initial value
  React.useEffect(() => {
    if (props.handleChange && defaultValue) {
      props.handleChange(props.data.field_name, defaultValue)
    }
  }, []) // Only on mount

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
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
          <Image src={sourceDataURL} style={{ maxWidth: '100%' }} />
        ) : (
          <SignaturePad {...pad_props} />
        )}
        {canClear && (
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={clear}
            title="Clear Signature"
            style={{ marginTop: '8px' }}
          >
            Clear
          </Button>
        )}
        <input {...inputProps} />
      </div>
    </div>
  )
}

export default Signature
