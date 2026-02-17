import React, { useRef } from 'react'

import ComponentHeader from './ComponentHeader'
import ComponentLabel from './ComponentLabel'

const CustomElement = (props) => {
  const inputField = useRef(null)

  const { bare } = props.data
  const elementProps = {}
  elementProps.name = props.data.field_name
  elementProps.defaultValue = props.defaultValue

  if (props.mutable && props.data.forwardRef) {
    elementProps.ref = inputField
  }

  if (props.read_only) {
    elementProps.disabled = 'disabled'
  }

  // Return if component is invalid.
  if (!props.data.component) return null
  const Element = props.data.component

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      {bare ? (
        <Element data={props.data} {...props.data.props} {...elementProps} />
      ) : (
        <div className="form-group">
          <ComponentLabel className="form-label" {...props} />
          <Element data={props.data} {...props.data.props} {...elementProps} />
        </div>
      )}
    </div>
  )
}

CustomElement.propTypes = {}

export default CustomElement
