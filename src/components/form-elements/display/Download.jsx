import React from 'react'
import ComponentHeader from '../shared/ComponentHeader'

const Download = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <a href={`${props.download_path}?id=${props.data.file_path}`}>
          {props.data.content}
        </a>
      </div>
    </div>
  )
}

export default Download
