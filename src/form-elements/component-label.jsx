import React from 'react'
import myxss from './myxss'

const ComponentLabel = (props) => {
  // Don't render anything if either isShowLabel is false or hideLabel is true
  if (
    (props.data.isShowLabel !== undefined && props.data.isShowLabel === false) ||
    (props.data && props.data.hideLabel === true)
  ) {
    return null
  }

  // Hide label in preview if element is in a DynamicColumnRow, but not other column types
  if (props.data.parentId) {
    // Try to find the parent element via props.mutable
    const parentElement =
      props.mutable &&
      props.mutable.getDataById &&
      props.mutable.getDataById(props.data.parentId)

    // If parent exists and is specifically a DynamicColumnRow, don't show label unless displayLabelInColumn is true
    if (
      parentElement &&
      parentElement.element === 'DynamicColumnRow' &&
      props.data.displayLabelInColumn !== true
    ) {
      return null
    }

    // For other column types (Two, Three, Four Column Row), we DO want to show the label
  }

  const hasRequiredLabel =
    props.data.hasOwnProperty('required') &&
    props.data.required === true &&
    !props.read_only

  let labelText = myxss.process(props.data.label)
  if (props.data.formularKey) {
    labelText = `${labelText} (${props.data.formularKey})`
  }

  return (
    <label className={props.className || ''}>
      <span dangerouslySetInnerHTML={{ __html: labelText }} />
      {hasRequiredLabel && (
        <span className="label-required badge badge-danger">Required</span>
      )}
    </label>
  )
}

export default ComponentLabel
