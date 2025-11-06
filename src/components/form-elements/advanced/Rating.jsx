import React from 'react'
import { Rate } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Rating = (props) => {
  const inputField = React.useRef(null)
  const [value, setValue] = React.useState(
    props.defaultValue !== undefined ? parseFloat(props.defaultValue) : 0
  )

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const handleChange = React.useCallback(
    (newValue) => {
      setValue(newValue)

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, newValue)
      }
    },
    [props]
  )

  // Initialize form context with initial value
  React.useEffect(() => {
    if (props.handleChange && value !== undefined) {
      props.handleChange(props.data.field_name, value)
    }
  }, []) // Only on mount

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <Rate
          ref={inputField}
          count={5}
          value={value}
          onChange={handleChange}
          disabled={!props.mutable || props.read_only || !isSameEditor}
        />
        <input type="hidden" name={props.data.field_name} value={value} />
      </div>
    </div>
  )
}

export default Rating
