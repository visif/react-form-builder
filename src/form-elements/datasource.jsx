import React from 'react'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'

class DataSource extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.mounted = false

    const defaultValue = props.defaultValue || {}

    this.state = {
      sourceList: [],
      matchedList: [],
      searchText: defaultValue.value,
      selectedItem: defaultValue.selectedItem,
      defaultSelectedItem: defaultValue.selectedItem,
      isShowingList: false,
      sourceType: props.data.sourceType,
      getDataSource: props.getDataSource,
      loading: true,
    }
  }

  async componentDidMount() {
    this.mounted = true
    await this.loadDataSource()

    // If this is in a DynamicColumnRow and we have onElementChange,
    // notify parent that this component is now initialized
    if (this.props.data.parentId && this.props.onElementChange) {
      // Send initialization status to parent
      this.props.onElementChange({
        ...this.props.data,
        element: 'DataSource',
        initialized: true,
        sourceType: this.props.data.sourceType,
        formSource: this.props.data.formSource,
      })
    }

    this.checkForValue()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  checkForValue = (attempt = 0) => {
    const { defaultValue } = this.props
    const maxRetries = 3

    if (!this.state.selectedItem && defaultValue?.selectedItem) {
      setTimeout(() => {
        if (this.mounted && !this.state.selectedItem) {
          this.setState({
            searchText: defaultValue.value,
            selectedItem: defaultValue.selectedItem,
            defaultSelectedItem: defaultValue.selectedItem,
            loading: false,
          })
          if (!this.state.selectedItem && attempt < maxRetries) {
            this.checkForValue(attempt + 1)
          }
        }
      }, 500)
    } else {
      this.setState({ loading: false })
    }
  }

  async loadDataSource() {
    if (typeof this.props.getDataSource === 'function') {
      try {
        const data = await this.props.getDataSource(this.props.data)
        if (this.mounted) {
          this.setState({
            sourceList: data,
            matchedList: data,
          })
        }
      } catch (error) {
        console.warn('Error loading data source:', error)
        if (this.mounted) {
          this.setState({
            sourceList: [],
            matchedList: [],
          })
        }
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.selectedItem) !==
        JSON.stringify(state.defaultSelectedItem)
    ) {
      const defaultValue = props.defaultValue || {}
      return {
        searchText: defaultValue.value,
        selectedItem: defaultValue.selectedItem,
        defaultSelectedItem: defaultValue.selectedItem,
      }
    }
    return null
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
  }

  debounceOnChange = (value) => {
    const matchData = this.state.sourceList.filter((item) =>
      `${item.name}`.toLocaleLowerCase().includes(`${value}`.toLocaleLowerCase())
    )
    this.setState({
      searchText: value,
      matchedList: matchData,
    })
  }

  handleOnChange = (event) => {
    if (event.key === 'Enter') {
      return
    }
    this.debounceOnChange(event.target.value)
  }

  handleSelectItem = (item) => {
    this.setState({
      selectedItem: item,
      searchText: item.name,
      isShowingList: false,
    })

    // If this component is in a DynamicColumnRow and we have onElementChange,
    // notify parent about the selection so it can be synced to other rows
    if (this.props.data.parentId && this.props.onElementChange) {
      this.props.onElementChange({
        ...this.props.data,
        element: 'DataSource',
        selectedItem: item,
        value: item.name,
      })
    }
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor =
        userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
    }

    // Add debugging
    console.log('DataSource Debug:', {
      userProperties,
      savedEditor,
      isSameEditor,
      hasDCCRole: userProperties?.hasDCCRole,
      readOnly: this.props.read_only,
      loading: this.state.loading,
      finalDisabled: this.props.read_only || !isSameEditor || this.state.loading
    });

    const props = {
      type: 'text',
      className: 'form-control',
      name: this.props.data.field_name,
      value: this.state.searchText,
    }

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue
      props.ref = this.inputField
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} style={{ display: 'block' }} />
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '100%',
            }}
          >
            <div>
              <input
                {...props}
                disabled={this.props.read_only || !isSameEditor || this.state.loading}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleOnChange}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                zIndex: 99,
                top: '100%',
                left: 0,
                right: 0,
                height: 250,
                overflowY: 'auto',
                display: this.state.isShowingList ? 'block' : 'none',
              }}
            >
              {(this.state.matchedList || []).map((item) => (
                <div
                  key={item.id}
                  style={{
                    position: 'relative',
                    display: 'block',
                    padding: '0.75rem 1.25rem',
                    marginBottom: -1,
                    backgroundColor: '#fff',
                    border: '1px solid rgba(0, 0, 0, 0.125)',
                  }}
                  onClick={() => this.handleSelectItem(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DataSource
