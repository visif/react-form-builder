import React from 'react'

import myxss from '../../../utils/xss'
import ComponentHeader from '../shared/ComponentHeader'

const Label = (props) => {
  let classNames = 'static'
  if (props.data.bold) {
    classNames += ' bold'
  }
  if (props.data.italic) {
    classNames += ' italic'
  }

  // Add alignment support
  const style = { display: 'block' } // Always make label a block element

  if (props.data.center) {
    style.textAlign = 'center'
  } else if (props.data.right) {
    style.textAlign = 'right'
  } else if (props.data.left) {
    style.textAlign = 'left'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <label
        className={classNames}
        style={style}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  )
}

export default Label
