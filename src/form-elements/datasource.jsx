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

  componentDidMount() {
    if (this.props.getDataSource && typeof this.props.getDataSource === 'function') {
      const data = this.props.getDataSource(this.props.data.sourceType);
      this.setState({
        sourceList: data
      });
    }
  }

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
          <ComponentLabel {...this.props} style={{ display: 'block' }}/>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <div>
              <input {...props} />
            </div>
            <div style={{position: 'absolute', zIndex: 99, top: "100%", left: 0, right: 0 }}>
              <div style={{ 
                position: 'relative', display: 'block', padding: '0.75rem 1.25rem',
                marginBottom: -1, backgroundColor: '#fff', border: '1px solid rgba(0, 0, 0, 0.125)' }} >
                  Test 1
              </div>
              <div style={{ 
                position: 'relative', display: 'block', padding: '0.75rem 1.25rem',
                marginBottom: -1, backgroundColor: '#fff', border: '1px solid rgba(0, 0, 0, 0.125)' }} >
                  Test 2
              </div>
              <div style={{ 
                position: 'relative', display: 'block', padding: '0.75rem 1.25rem',
                marginBottom: -1, backgroundColor: '#fff', border: '1px solid rgba(0, 0, 0, 0.125)' }} >
                  Test 3
              </div>
              {
                this.state.sourceList.map(item => {
                  return (
                    <div style={{ 
                      position: 'relative', display: 'block', padding: '0.75rem 1.25rem',
                      marginBottom: -1, backgroundColor: '#fff', border: '1px solid rgba(0, 0, 0, 0.125)' }} >
                        {item}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataSource;
