import React from 'react';
import ComponentHeader from './component-header';

export default class Section extends React.Component {
  render() {
    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <span>{this.props.data.header}</span>
        <hr />
      </div>
    );
  }
}
