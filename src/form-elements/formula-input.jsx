import React, { Component } from 'react'
import { Parser } from 'hot-formula-parser'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'

class FormulaInput extends Component {
  constructor(props) {
    super(props)

    let newValue = ''
    if (props.data?.formula && props.variables) {
      const parser = new Parser()
      Object.entries(props.variables).forEach(([key, value]) => {
        const parsedValue = parseFloat(value)
        if (!Number.isNaN(parsedValue)) {
          parser.setVariable(key, parsedValue)
        }
      })
      newValue = parser.parse(props.data.formula)?.result || ''
    }

    this.state = {
      error: '',
      formula: props.data?.formula || '',
      variables: props.variables || {},
      value: newValue,
    }

    this.handleVariableChange = this.handleVariableChange.bind(this)
  }

  componentDidMount() {
    this.subscription = this.props.emitter?.addListener(
      'variableChange',
      this.handleVariableChange
    )
  }

  componentWillUnmount() {
    this.subscription?.remove()
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.data.formula !== state.formula ||
      JSON.stringify(props.variables) !== JSON.stringify(state.variables)
    ) {
      if (props.variables) {
        const parser = new Parser()
        const newVariables = { ...state.variables, ...props.variables }
        Object.entries(newVariables).forEach(([key, value]) => {
          const parsedValue = parseFloat(value)
          if (!Number.isNaN(parsedValue)) {
            parser.setVariable(key, parsedValue)
          }
        })
        return {
          ...state,
          variables: newVariables,
          value: parser.parse(props.data.formula)?.result || '',
        }
      }
    }

    return state
  }

  handleVariableChange(params) {
    const { formula } = this.state
    if (!formula) {
      errors.push(`${this.props.data.label} is invalid!`)
      return
    }

    const parser = new Parser()
    const parsedValue = parseFloat(params.value)
    let newVariables = { ...this.state.variables }
    if (!Number.isNaN(parsedValue)) {
      newVariables = { ...this.state.variables, [params.propKey]: parsedValue }
      Object.entries(newVariables).forEach(([key, value]) => {
        if (!Number.isNaN(value)) {
          parser.setVariable(key, value)
        }
      })
    }
    const newValue = parser.parse(formula)?.result || ''

    this.setState((prevState) => ({
      ...prevState,
      variables: newVariables,
      value: newValue,
    }))
  }

  render() {
    const { error, value } = this.state
    const inputProps = {
      type: 'text',
      className: `form-control ${error ? 'is-invalid' : ''}`,
      name: this.props.data?.field_name,
      value,
      disabled: true,
    }

    let baseClasses = 'SortableItem rfb-item'
    if (this.props.data?.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div style={{ ...this.props.style }} className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className={this.props.data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel {...this.props} />
          <input {...inputProps} />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    )
  }
}

export default FormulaInput
