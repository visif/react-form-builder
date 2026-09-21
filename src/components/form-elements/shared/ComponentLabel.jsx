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

// Resolve the getDataById lookup from whichever prop shape is available.
// In the builder preview, `mutable` is a boolean and `getDataById` is passed
// as its own prop; in the generator, `mutable` is an object carrying it.
const resolveGetDataById = (props) => {
  if (typeof props.getDataById === 'function') return props.getDataById
  if (props.mutable && typeof props.mutable.getDataById === 'function') {
    return props.mutable.getDataById
  }
  return null
}

const getParentElement = (props) => {
  if (!props.data?.parentId) return null
  const getDataById = resolveGetDataById(props)
  return getDataById ? getDataById(props.data.parentId) : null
}

const isDynamicColumnChild = (data, props) => {
  if (!data?.parentId || data.row === undefined || data.col === undefined) {
    return false
  }
  const parent = getParentElement(props)
  if (parent?.element) {
    return parent.element === 'DynamicColumnRow'
  }
  return data.hideLabel === true
}

const ComponentLabel = (props) => {
  const hasRequiredLabel = isRequiredValue(props.data?.required) && !props.read_only
  const inDynamicColumn = isDynamicColumnChild(props.data, props)
  const requiredMark = inDynamicColumn ? <RequiredAsterisk /> : <RequiredBadge />

  const parentElement = getParentElement(props)
  const parentDynamicColumnRow =
    parentElement && parentElement.element === 'DynamicColumnRow' ? parentElement : null

  // When the Dynamic Column Row opts in to showing labels, the row-level setting
  // overrides the automatic hideLabel flag that is stamped on children at drop time.
  const rowShowsLabels = parentDynamicColumnRow?.showDisplayLabel === true

  const hideLabelSetting =
    (props.data.isShowLabel !== undefined && props.data.isShowLabel === false) ||
    (props.data && props.data.hideLabel === true && !rowShowsLabels)

  const hideBecauseDynamicColumn =
    parentDynamicColumnRow !== null &&
    !rowShowsLabels &&
    props.data.displayLabelInColumn !== true

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
