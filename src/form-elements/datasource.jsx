import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';

class DataSource extends React.Component {
  
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    this.state = {
      sourceList: [],
    };
  }

  // componentDidMount() {
  //   if (this.props.)
  //   const data = 
  // }

  render() {
    const props = {};
    props.type = 'text';
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <input {...props} />
        </div>
      </div>
    );
  }
}

export default DataSource;
