import React from 'react'
import { Typography } from 'antd'

import ComponentHeader from '../shared/ComponentHeader'

const { Link } = Typography

const HyperLink = (props) => {
  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className={props.data.isShowLabel !== false ? 'form-group' : ''}>
        <Link target="_blank" href={props.data.href}>
          {props.data.content}
        </Link>
      </div>
    </div>
  )
}

export default HyperLink
