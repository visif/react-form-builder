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
      isUpdating: false,
    }

    this.handleVariableChange = this.handleVariableChange.bind(this)
    this.updateTimeout = null
  }

  componentDidMount() {
    this.subscription = this.props.emitter?.addListener(
      'variableChange',
      this.handleVariableChange,
    )
  }

  componentWillUnmount() {
    this.subscription?.remove()
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }
  }

  static getDerivedStateFromProps(props, state) {
    // Check if defaultValue exists and is different from current state
    if (props.defaultValue && props.defaultValue.value !== state.value) {
      // If defaultValue has a specific value, use it instead of recalculating
      if (props.defaultValue.value !== '' && props.defaultValue.value !== null && props.defaultValue.value !== undefined) {
        return {
          ...state,
          formula: props.defaultValue.formula || state.formula,
          variables: props.defaultValue.variables || state.variables,
          value: props.defaultValue.value,
        }
      }
    }

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
      console.error(`${this.props.data.label} is invalid!`)
      return
    }

    if (this.state.isUpdating) {
      return
    }

    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }

    this.updateTimeout = setTimeout(() => {
      this.setState({ isUpdating: true }, () => {
        const parser = new Parser()
        let newVariables = { ...this.state.variables }

        // Handle empty/cleared values
        if (params.value === '' || params.value === null || params.value === undefined) {
          newVariables = { ...this.state.variables, [params.propKey]: 0 }
        } else {
          const processedValue = params.value

          // Check if the value ends with % and convert to decimal
          if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
            const numericPart = processedValue.trim().slice(0, -1)
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
        const previousValue = this.state.value

        this.setState((prevState) => ({
          ...prevState,
          variables: newVariables,
          value: newValue,
          isUpdating: false,
        }), () => {
          const { data, handleChange } = this.props
          const { formularKey } = data
          const valueChanged = Math.abs(previousValue - newValue) > 0.0001

          if (formularKey && handleChange && valueChanged && params.propKey !== formularKey) {
            setTimeout(() => {
              handleChange(formularKey, newValue)
            }, 50)
          }
        })
      })
    }, 100) // 100ms debounce
  }

  // Format the value for display
  formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
      return '0.00'
    }

    const numValue = parseFloat(num)
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  render() {
    const { error, value } = this.state

    const inputProps = {
      type: 'text',
      className: `form-control ${error ? 'is-invalid' : ''}`,
      name: this.props.data?.field_name,
      value: this.formatNumber(value),
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
