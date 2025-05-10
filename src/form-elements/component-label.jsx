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
