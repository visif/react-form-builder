import React from 'react'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'

class FormLink extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.mounted = false

    const defaultValue = props.defaultValue || {}

    this.state = {
      formList: [],
      matchedList: [],
      formInfo: null,
      searchText: defaultValue.value || '',
      selectedFormId: defaultValue.selectedFormId,
      defaultSelectedForm: defaultValue.selectedForm,
      isShowingList: false,
      getFormSource: props.getFormSource,
      loading: true,
    }
  }

  async componentDidMount() {
    this.mounted = true
    await this.loadFormSource()
    this.checkForValue()

    if (typeof this.props.getFormInfo === 'function' && this.props.data.formSource) {
      try {
        const formInfo = await this.props.getFormInfo(this.props.data.formSource)
        if (this.mounted) {
          this.setState({
            formInfo: formInfo || null,
          })
        }
      } catch (error) {
        console.warn('Error loading form info:', error)
        if (this.mounted) {
          this.setState({
            formInfo: null,
          })
        }
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  checkForValue = (attempt = 0) => {
    const { defaultValue } = this.props
    const maxRetries = 3

    if (!this.state.selectedFormId && defaultValue?.selectedFormId) {
      setTimeout(() => {
        if (this.mounted && !this.state.selectedFormId) {
          this.setState({
            searchText: defaultValue.value || '',
            selectedFormId: defaultValue.selectedFormId,
            defaultSelectedFormId: defaultValue.selectedFormId,
            loading: false,
          })
          if (!this.state.selectedFormId && attempt < maxRetries) {
            this.checkForValue(attempt + 1)
          }
        }
      }, 500)
    } else {
      this.setState({ loading: false })
    }
  }

  async loadFormSource() {
    if (typeof this.props.getFormSource === 'function') {
      try {
        const forms = await this.props.getFormSource(this.props.data)
        if (this.mounted) {
          // If we have a formSource set from the editor, find the matching form
          if (this.props.data.formSource) {
            const selectedFormId = forms.find(
              (form) => form.id == this.props.data.formSource
            )
            if (selectedFormId) {
              this.setState({
                formList: forms,
                matchedList: forms,
                selectedFormId: selectedFormId,
                searchText: '',
              })
              return
            }
          }

          this.setState({
            formList: forms,
            matchedList: forms,
          })
        }
      } catch (error) {
        console.warn('Error loading form source:', error)
        if (this.mounted) {
          this.setState({
            formList: [],
            matchedList: [],
          })
        }
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.selectedFormId) !==
        JSON.stringify(state.defaultSelectedFormId)
    ) {
      const defaultValue = props.defaultValue || {}
      return {
        searchText: defaultValue.value || '',
        selectedFormId: defaultValue.selectedFormId,
        defaultSelectedForm: defaultValue.selectedFormId,
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
    const matchData = this.state.formList.filter((form) => {
      return `${form.title}`.toLocaleLowerCase().includes(`${value}`.toLocaleLowerCase())
    })
    this.setState({
      searchText: value,
      matchedList: matchData,
    })

    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      const updatedData = {
        ...this.props.data,
        value: value,
      }

      this.props.onElementChange(updatedData)

      // Immediately apply changes to this component's data
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
  }

  handleOnChange = (event) => {
    if (event.key === 'Enter') {
      return
    }
    this.debounceOnChange(event.target.value)
  }

  handleFormSelect = (form) => {
    this.setState({
      selectedFormId: form,
      searchText: form.title,
      isShowingList: false,
    })

    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      const updatedData = {
        ...this.props.data,
        value: form.title,
        selectedFormId: form,
        formSource: form.id, // Save the form ID as formSource
      }

      this.props.onElementChange(updatedData)

      // Immediately apply changes to this component's data
      if (this.props.data.dirty === undefined || this.props.data.dirty) {
        updatedData.dirty = true
        if (this.props.updateElement) {
          this.props.updateElement(updatedData)
        }
      }
    }
  }

  openLinkedForm = () => {
    console.info('Select form: ' + this.state.selectedFormId)
    const { selectedFormId } = this.state.selectedFormId
    if (selectedFormId && typeof this.props.openLinkedForm === 'function') {
      this.props.openLinkedForm(selectedFormId)
    }
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    const formTitle = this.state.selectedFormId
      ? this.state.selectedFormId.title
      : 'Select a form'
    const isFormSelected = !!this.state.selectedFormId

    return (
      <section className={baseClasses}>
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
            {/* Display hyperlink in preview mode */}
            {!this.props.mutable && (
              <div className="form-link-preview" style={{ padding: '6px 0' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    this.openLinkedForm()
                  }}
                  style={{
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  {this.state.formInfo
                    ? this.state.formInfo.Name
                    : 'Please select a form'}
                </button>
              </div>
            )}

            {/* Display form selection in edit mode */}
            {this.props.mutable && (
              <div
                className="form-link-container"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <div
                  onClick={() => this.setState({ isShowingList: true })}
                  style={{
                    flex: 1,
                    border: '1px solid #ced4da',
                    borderRadius: '.25rem',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    backgroundColor: isFormSelected ? '#fff' : '#f8f9fa',
                    minHeight: '38px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {isFormSelected ? (
                    <span>
                      {this.state.formInfo
                        ? this.state.formInfo.Name
                        : 'Please select a form'}
                    </span>
                  ) : (
                    <div>
                      <div className="form-link-preview" style={{ padding: '6px 0' }}>
                        <a
                          href="#"
                          style={{ marginTop: 6 }}
                          className="btn btn-secondary"
                          onClick={(e) => {
                            e.preventDefault()
                            if (typeof this.props.onSelectChildForm === 'function') {
                              this.props.onSelectChildForm(
                                this.props.data.id,
                                this.props.data.formSource
                              )
                            }
                          }}
                        >
                          {this.state.formInfo
                            ? this.state.formInfo.Name
                            : 'Please select a form'}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }
}

export default FormLink
