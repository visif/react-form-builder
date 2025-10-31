import React from 'react'

import ComponentHeader from '../shared/ComponentHeader'

const Image = (props) => {
  const style = props.data.center ? { textAlign: 'center' } : null

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses} style={style}>
      <ComponentHeader {...props} />
      {props.data.src && (
        <img
          style={{ maxWidth: '100%', height: 'auto' }}
          src={props.data.src}
          width={props.data.width}
          height={props.data.height}
        />
      )}
      {!props.data.src && <div className="no-image">No Image</div>}
    </div>
  )
}

export default Image
