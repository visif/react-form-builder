import React from 'react';
import ComponentHeader from './component-header';

export default class Section extends React.Component {
  render() {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses} id={this.props.data.header}>
        <ComponentHeader {...this.props} />
        <h6>{this.props.data.header}</h6>
        <hr />
      </div>
    );
  }
}
