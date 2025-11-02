import React from 'react'
import { Typography } from 'antd'

import myxss from '../../../utils/xss'
import ComponentHeader from '../shared/ComponentHeader'

const { Text } = Typography

const Label = (props) => {
  // Add alignment support
  const style = { display: 'block' } // Always make label a block element

  if (props.data.bold) {
    style.fontWeight = 'bold'
  }
  if (props.data.italic) {
    style.fontStyle = 'italic'
  }
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
      <Text style={style}>
        <div
          dangerouslySetInnerHTML={{
            __html: myxss.process(props.data.content),
          }}
        />
      </Text>
    </div>
  )
}

export default Label
