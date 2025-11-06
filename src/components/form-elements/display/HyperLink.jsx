import React from 'react'
import { Typography } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'

const { Link } = Typography

const HyperLink = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  const href = props.data.href || 'http://www.example.com'
  const content = props.data.content || 'Link'

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </Link>
      </div>
    </div>
  )
}

export default HyperLink
