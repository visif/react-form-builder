import React from 'react'
import { Typography } from 'antd'

import myxss from '../../../utils/xss'
import ComponentHeader from '../shared/ComponentHeader'

const { Title } = Typography

const Header = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <Title
        level={3}
        style={{
          fontWeight: props.data.bold ? 'bold' : 'normal',
          fontStyle: props.data.italic ? 'italic' : 'normal',
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: myxss.process(props.data.content),
          }}
        />
      </Title>
    </div>
  )
}

export default Header
