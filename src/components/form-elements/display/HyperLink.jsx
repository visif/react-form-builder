import React from 'react'
import ComponentHeader from '../shared/ComponentHeader'

const HyperLink = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <a target="_blank" href={props.data.href} rel="noreferrer">
          {props.data.content}
        </a>
      </div>
    </div>
  )
}

export default HyperLink
