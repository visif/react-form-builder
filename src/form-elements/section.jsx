import React from 'react'
import ComponentHeader from './component-header'

export default class Section extends React.Component {
  render() {
    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    const header = this.props.data.header || ''
    const generateSectionID = this.props.generateSectionID
    const sectionId =
      typeof generateSectionID === 'function' ? generateSectionID(header) : header

    return (
      <div
        className={baseClasses}
        id={sectionId}
        data-section={header}
        title={header}
      >
        <ComponentHeader {...this.props} />
        <h5>{this.props.data.header}</h5>
        <hr />
      </div>
    )
  }
}
