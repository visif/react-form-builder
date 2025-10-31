import React from 'react'
import ComponentHeader from '../shared/ComponentHeader'
import myxss from '../../../utils/xss'

const Header = (props) => {
  let classNames = 'static'
  if (props.data.bold) {
    classNames += ' bold'
  }
  if (props.data.italic) {
    classNames += ' italic'
  }

  let baseClasses = `${props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak'
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <h3
        className={classNames}
        dangerouslySetInnerHTML={{
          __html: myxss.process(props.data.content),
        }}
      />
    </div>
  )
}

export default Header
