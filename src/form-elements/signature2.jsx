import React from 'react';
import ComponentHeader from './component-header';

export default class Signature2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSigned: false,
    };
  }

  clickToSign = () => {
    this.setState({isSigned: !this.state.isSigned});
  }

  render() {
    const props = {};
    props.name = this.props.data.field_name;

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group" onClick={this.clickToSign}>
          <div style={{ textAlign: 'center' }}>{this.state.isSigned ? 'Already signed' : '(Click to sign)'}</div>
          <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>__________________</div>
          <div style={{ textAlign: 'center' }}>{this.props.data.position || 'Placeholder Text'}</div>
        </div>
      </div>
    );
  }
}