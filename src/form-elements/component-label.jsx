import React from 'react'
import {
  getParentElement,
  isDynamicColumnChild,
  shouldHideColumnDisplayLabel,
} from './dynamic-column-display-label'
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

export const REQUIRED_ASTERISK_STYLE = {
  color: '#dc3545',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1,
  margin: 0,
}

export const DCR_REQUIRED_MARK_STYLE = {
  position: 'absolute',
  left: 6,
  top: 0,
  transform: 'translateY(-100%)',
  zIndex: 30,
  margin: 0,
  padding: 0,
  width: 'auto',
  height: 'auto',
  display: 'block',
  color: '#dc3545',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1,
  pointerEvents: 'none',
}

export const RequiredBadge = () => (
  <span className="label-required badge badge-danger" style={REQUIRED_BADGE_STYLE}>
    Required
  </span>
)

export const RequiredAsterisk = () => (
  <span
    className="rfb-required-asterisk"
    style={REQUIRED_ASTERISK_STYLE}
    aria-label="Required"
  >
    *
  </span>
)

const isRequiredValue = (value) => value === true || value === 'true'

const ComponentLabel = (props) => {
  const hasRequiredLabel =
    isRequiredValue(props.data?.required) && !props.read_only
  const inDynamicColumn = isDynamicColumnChild(props.data, props)
  const requiredMark = inDynamicColumn ? (
    <RequiredAsterisk />
  ) : (
    <RequiredBadge />
  )

  const parentElement = getParentElement(props)

  // Keep the required marker visible even when the cell label is hidden.
  if (shouldHideColumnDisplayLabel(props.data, parentElement)) {
    if (!hasRequiredLabel) {
      return null
    }
    return (
      <label
        className={`${props.className || ''} rfb-dcr-required-mark`.trim()}
        style={DCR_REQUIRED_MARK_STYLE}
      >
        {requiredMark}
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
      {hasRequiredLabel && requiredMark}
    </label>
  )
}

export default ComponentLabel
