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
      const parseResult = parser.parse(props.data.formula)
      newValue = parseResult?.result || ''
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
      this.handleVariableChange,
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
        const parseResult = parser.parse(props.data.formula)
        return {
          ...state,
          variables: newVariables,
          value: parseResult?.result || '',
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
    let newVariables = { ...this.state.variables }

    // Handle empty/cleared values
    if (params.value === '' || params.value === null || params.value === undefined) {
      // Remove the variable or set it to 0
      newVariables = { ...this.state.variables, [params.propKey]: 0 }
    } else {
      let processedValue = params.value

      // Check if the value ends with % and convert to decimal
      if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
        const numericPart = processedValue.trim().slice(0, -1) // Remove the % symbol
        const parsedValue = parseFloat(numericPart)
        if (!Number.isNaN(parsedValue)) {
          newVariables = { ...this.state.variables, [params.propKey]: parsedValue / 100 }
        } else {
          newVariables = { ...this.state.variables, [params.propKey]: 0 }
        }
      } else {
        const parsedValue = parseFloat(processedValue)
        if (!Number.isNaN(parsedValue)) {
          newVariables = { ...this.state.variables, [params.propKey]: parsedValue }
        } else {
          // If it's not a valid number, set to 0
          newVariables = { ...this.state.variables, [params.propKey]: 0 }
        }
      }
    }

    // Set all variables in the parser
    Object.entries(newVariables).forEach(([key, value]) => {
      const numValue = parseFloat(value)
      if (!Number.isNaN(numValue)) {
        parser.setVariable(key, numValue)
      } else {
        parser.setVariable(key, 0)
      }
    })

    const parseResult = parser.parse(formula)
    const newValue = parseResult?.result || 0

    this.setState((prevState) => ({
      ...prevState,
      variables: newVariables,
      value: newValue,
    }))
  }

  render() {
    const { error, value } = this.state

    // Format the value for display
    const formatNumber = (num) => {
      if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
        return '0.00'
      }

      const numValue = parseFloat(num)
      return numValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const inputProps = {
      type: 'text',
      className: `form-control ${error ? 'is-invalid' : ''}`,
      name: this.props.data?.field_name,
      value: formatNumber(value),
      disabled: true,
    }

    let baseClasses = `${this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
    if (this.props.data.pageBreakBefore) {
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
