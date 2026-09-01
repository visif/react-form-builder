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

  const rawContent = String(props.data.content || '')
    .replace(/<[^>]+>/g, '')
    .trim()
  const { generateSectionID } = props
  const sectionId =
    typeof generateSectionID === 'function' && rawContent
      ? generateSectionID(rawContent)
      : undefined

  return (
    <div className={baseClasses} id={sectionId} data-section={rawContent} title={rawContent}>
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
