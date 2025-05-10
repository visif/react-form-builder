import React from 'react'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'

class FormulaInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()
    this.state = {
      value: this._getValue(props),
    }
  }

  _getValue = (props) => {
    let computedValue = ''
    if (props.data && props.data.formula && props.handleFormulaChange) {
      computedValue = props.handleFormulaChange(props.data.formula) || ''
    } else {
      computedValue = props.defaultValue || ''
    }
    return computedValue
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })

    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = {
        ...this.props.data,
        value: value,
      }

      // Send it for synchronization across columns
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

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId
    }

    const props = {}
    props.type = 'text'
    props.className = 'form-control'
    props.name = this.props.data.field_name
    props.onChange = this.handleChange
    props.value = this.state.value

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue
      props.ref = this.inputField
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled'
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <input {...props} />
        </div>
      </div>
    )
  }
}

export default FormulaInput
