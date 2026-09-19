import React from 'react'

import myxss from '../../../utils/xss'

// Decode HTML entities that may be stored in the backend as escaped HTML
// e.g. "&lt;span style=&quot;font-size:16px&quot;&gt;text&lt;/span&gt;" → "<span style="font-size:16px">text</span>"
const decodeHtmlEntities = (str) => {
  if (!str || typeof str !== 'string') return str
  if (!str.includes('&')) return str
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
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
  top: 6,
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
  <span className="rfb-required-asterisk" style={REQUIRED_ASTERISK_STYLE} aria-label="Required">
    *
  </span>
)

const isRequiredValue = (value) => value === true || value === 'true'

const isDynamicColumnChild = (data, mutable) => {
  if (!data?.parentId || data.row === undefined || data.col === undefined) {
    return false
  }
  const parent =
    mutable && typeof mutable.getDataById === 'function' ? mutable.getDataById(data.parentId) : null
  if (parent?.element) {
    return parent.element === 'DynamicColumnRow'
  }
  return data.hideLabel === true
}

const ComponentLabel = (props) => {
  const hasRequiredLabel = isRequiredValue(props.data?.required) && !props.read_only
  const inDynamicColumn = isDynamicColumnChild(props.data, props.mutable)
  const requiredMark = inDynamicColumn ? <RequiredAsterisk /> : <RequiredBadge />

  const hideLabelSetting =
    (props.data.isShowLabel !== undefined && props.data.isShowLabel === false) ||
    (props.data && props.data.hideLabel === true)

  let hideBecauseDynamicColumn = false
  if (props.data.parentId) {
    const parentElement =
      props.mutable && props.mutable.getDataById && props.mutable.getDataById(props.data.parentId)

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
      <label
        className={`${props.className || ''} rfb-dcr-required-mark`.trim()}
        style={DCR_REQUIRED_MARK_STYLE}
      >
        {requiredMark}
      </label>
    )
  }

  let labelText = myxss.process(decodeHtmlEntities(props.data.label))

  // Remove wrapping <p> tags from Quill editor output to prevent block-level elements
  labelText = labelText.replace(/^<p>/i, '').replace(/<\/p>$/i, '')

  const plainLabelText = labelText
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\u200B/g, '')
    .trim()

  if (!plainLabelText) {
    return null
  }

  if (props.data.formularKey && props.preview) {
    labelText = `${labelText} (${props.data.formularKey})`
  }

  return (
    <label className={props.className || ''} style={{ display: 'block', marginBottom: '8px' }}>
      <span dangerouslySetInnerHTML={{ __html: labelText }} />
      {hasRequiredLabel && requiredMark}
    </label>
  )
}

export default ComponentLabel
