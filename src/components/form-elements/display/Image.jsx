import React from 'react'
import { Image as AntImage, Empty } from 'antd'

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
      {props.data.src ? (
        <AntImage
          src={props.data.src}
          width={props.data.width}
          height={props.data.height}
          style={{ maxWidth: '100%', height: 'auto' }}
          preview={{
            mask: 'Click to preview',
          }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No Image"
          style={{
            margin: '8px 0',
            padding: '8px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
          }}
        />
      )}
    </div>
  )
}

export default Image
