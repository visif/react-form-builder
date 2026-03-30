import React from 'react'

import myxss from '../../../utils/xss'

// Decode HTML entities that may be stored in the backend as escaped HTML
// e.g. "&lt;span style=&quot;font-size:16px&quot;&gt;text&lt;/span&gt;" → "<span style="font-size:16px">text</span>"
const decodeHtmlEntities = (str) => {
  if (!str || typeof str !== 'string') return str
  // Only decode if the string contains HTML entities (quick check)
  if (!str.includes('&')) return str
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&') // must be last to avoid double-decoding
}

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
      props.mutable && props.mutable.getDataById && props.mutable.getDataById(props.data.parentId)

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
    Object.prototype.hasOwnProperty.call(props.data, 'required') &&
    props.data.required === true &&
    !props.read_only

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
      {hasRequiredLabel && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
    </label>
  )
}

export default ComponentLabel
