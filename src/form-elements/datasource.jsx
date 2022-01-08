import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';

class DataSource extends React.Component {
  
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    this.state = {
      sourceList: [],
      matchedList: [],
      searchText: '',
      isShowingList: false,
      sourceType: props.data.sourceType,
    };
  }

  componentDidMount() {
    if (this.props.getDataSource && typeof this.props.getDataSource === 'function') {
      const data = this.props.getDataSource(this.props.data.sourceType);
      this.setState({
        sourceList: data,
        matchedList: data,
      });
    }
  }

  handleInputFocus = () => {
    this.setState({
      isShowingList: true,
    })
  }

  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({
        isShowingList: false,
      })
     }, 200)
  };

  handleOnChange = (event) => {
    if(event.key === 'Enter'){
      return;
    }

    const value = event.target.value;

    const matchData = this.state.sourceList.filter(item => {
      return `${item}`.toLocaleLowerCase().includes(`${value}`.toLocaleLowerCase())
    });
    this.setState({
      searchText: value,
      matchedList: matchData,
    });
  }

  render() {
    const props = {};
    props.type = 'text';
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    props.value = this.state.searchText;

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
              <input 
                {...props} 
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleOnChange} 
              />
            </div>
            <div style={{
                position: 'absolute', zIndex: 99, top: "100%", left: 0, right: 0,
                display: this.state.isShowingList ? 'block' : 'none'
              }}
            >
              {
                this.state.matchedList.map(item => {
                  return (
                    <div style={{ 
                      position: 'relative', display: 'block', padding: '0.75rem 1.25rem',
                      marginBottom: -1, backgroundColor: '#fff', border: '1px solid rgba(0, 0, 0, 0.125)' }} 
                      onClick={() => {
                        this.setState({
                          searchText: item,
                        })
                      }}
                    >
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
