import React from 'react'
import StarRating from './StarRating'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'

const Rating = (props) => {
  const inputField = React.useRef(null)

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const starProps = {}
  starProps.name = props.data.field_name
  starProps.ratingAmount = 5

  if (props.mutable) {
    starProps.rating = props.defaultValue !== undefined ? parseFloat(props.defaultValue, 10) : 0
    starProps.editing = true
    starProps.disabled = !!(props.read_only || !isSameEditor)
    starProps.ref = inputField
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <ComponentLabel {...props} />
        <StarRating {...starProps} />
      </div>
    </div>
  )
}

export default Rating
