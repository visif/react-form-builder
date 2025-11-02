import React from 'react'
import { Typography } from 'antd'

import myxss from '../../../utils/xss'
import ComponentHeader from '../shared/ComponentHeader'

const { Paragraph: AntParagraph } = Typography

const Paragraph = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <AntParagraph
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
      </AntParagraph>
    </div>
  )
}

export default Paragraph
