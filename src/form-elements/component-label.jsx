import React from 'react'
import myxss from './myxss'

const convertUnderlineToIns = (html) =>
  html.replace(/<u>/g, '<ins>').replace(/<\/u>/g, '</ins>')

// Strip <p> tags from label text to avoid block elements inside inline <span>/<label>
const stripPTags = (html) => {
  if (!html) return html
  return html.replace(/<p>/gi, '').replace(/<\/p>/gi, '').trim()
}

export const REQUIRED_BADGE_STYLE = {
  display: 'inline-block',
  margin: '0 0 4px 0',
  padding: '2px 6px',
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1.2,
  color: '#fff',
  backgroundColor: '#dc3545',
  borderRadius: 4,
  verticalAlign: 'middle',
}

export const RequiredBadge = () => (
  <span className="label-required badge badge-danger" style={REQUIRED_BADGE_STYLE}>
    Required
  </span>
)

const isRequiredValue = (value) => value === true || value === 'true'

const ComponentLabel = (props) => {
  const hasRequiredLabel =
    isRequiredValue(props.data?.required) && !props.read_only

  const hideLabelSetting =
    (props.data.isShowLabel !== undefined && props.data.isShowLabel === false) ||
    (props.data && props.data.hideLabel === true)

  let hideBecauseDynamicColumn = false
  if (props.data.parentId) {
    const parentElement =
      props.mutable &&
      props.mutable.getDataById &&
      props.mutable.getDataById(props.data.parentId)

    if (
      parentElement &&
      parentElement.element === 'DynamicColumnRow' &&
      props.data.displayLabelInColumn !== true
    ) {
      hideBecauseDynamicColumn = true
    }
  }

  // Keep the required marker visible even when the cell label is hidden.
  if (hideLabelSetting || hideBecauseDynamicColumn) {
    if (!hasRequiredLabel) {
      return null
    }
    return (
      <label className={props.className || ''}>
        <RequiredBadge />
      </label>
    )
  }

  let labelText = myxss.process(props.data.label)
  labelText = convertUnderlineToIns(labelText)
  labelText = stripPTags(labelText)
  if (props.data.formularKey && props.preview) {
    labelText = `${labelText} (${props.data.formularKey})`
  }

  return (
    <label className={props.className || ''}>
      <span dangerouslySetInnerHTML={{ __html: labelText }} />
      {hasRequiredLabel && <RequiredBadge />}
    </label>
  )
}

export default ComponentLabel
