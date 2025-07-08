import React from 'react'
import ComponentHeader from './component-header'

export default class Section extends React.Component {
  render() {
    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses} id={this.props.data.header}>
        <ComponentHeader {...this.props} />
        <h5>{this.props.data.header}</h5>
        <hr />
      </div>
    )
  }
}
