import React from 'react'
import { Rate } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

export const RATING_STAR_COUNT = 5

/** Map stored answers onto the 1–5 star widget. Values above 5 (legacy click positions) show as 5. */
export function toStarRatingValue(raw) {
  if (Array.isArray(raw)) {
    return toStarRatingValue(raw[0])
  }
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    if ('value' in raw) {
      return toStarRatingValue(raw.value)
    }
    if ('rating' in raw) {
      return toStarRatingValue(raw.rating)
    }
  }
  const n = typeof raw === 'number' ? raw : parseFloat(raw)
  if (!Number.isFinite(n) || n <= 0) {
    return 0
  }
  return Math.min(RATING_STAR_COUNT, n)
}

const Rating = (props) => {
  const inputField = React.useRef(null)
  const [value, setValue] = React.useState(
    props.defaultValue !== undefined ? toStarRatingValue(props.defaultValue) : 0
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
      const next = toStarRatingValue(newValue)
      setValue(next)

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, next)
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
          count={RATING_STAR_COUNT}
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
