import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Parser } from 'hot-formula-parser'
import ComponentHeader from './component-header'
import ComponentLabel from './component-label'
import debounce from '../functions/debounce'

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
  this.debouncedUpdate = debounce(this.processVariableChange.bind(this), 100)
  }

  componentDidMount() {
    const { emitter } = this.props
    if (emitter && typeof emitter.addListener === 'function') {
      this.subscription = emitter.addListener('variableChange', this.handleVariableChange)
    }
  }

  componentWillUnmount() {
    if (this.subscription && typeof this.subscription.remove === 'function') {
      this.subscription.remove()
    }
  if (this.debouncedUpdate && this.debouncedUpdate.cancel) this.debouncedUpdate.cancel()
  }

  static getDerivedStateFromProps(props, state) {
    // Check if defaultValue exists and is different from current state
    if (props.defaultValue && props.defaultValue.value !== state.value) {
      // If defaultValue has a specific value, use it instead of recalculating
      if (props.defaultValue.value !== '' && props.defaultValue.value !== null && props.defaultValue.value !== undefined) {
        return {
          formula: props.defaultValue.formula || state.formula,
          variables: props.defaultValue.variables || state.variables,
          value: props.defaultValue.value,
        }
      }
    }

    // Guard: no formula provided
    if (!props?.data?.formula) {
      return null
    }

    // Shallow compare variables to avoid expensive stringify + false positives
    const incomingVars = props.variables || {}
    const prevVars = state.variables || {}
    let variablesChanged = Object.keys(incomingVars).length !== Object.keys(prevVars).length
    if (!variablesChanged) {
      variablesChanged = Object.keys(incomingVars).some(k => incomingVars[k] !== prevVars[k])
    }

    const formulaChanged = props.data.formula !== state.formula

    if (formulaChanged || variablesChanged) {
      const parser = new Parser()
      const newVariables = { ...prevVars, ...incomingVars }
      Object.entries(newVariables).forEach(([key, value]) => {
        const parsedValue = parseFloat(value)
        if (!Number.isNaN(parsedValue)) {
          parser.setVariable(key, parsedValue)
        }
      })
      const parseResult = parser.parse(props.data.formula)
      return {
        formula: props.data.formula,
        variables: newVariables,
        value: parseResult?.result || '',
      }
    }

    // No state update
    return null
  }

  handleVariableChange(params) {
  const { formula, isUpdating } = this.state
    if (!formula) {
  // Invalid / missing formula: nothing to compute
      return
    }

  if (isUpdating) {
      return
    }
  this.debouncedUpdate(params)
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

  processVariableChange(params) { // Reordered below formatNumber to satisfy style rule
    const { formula, variables: currentVars, value: currentValue } = this.state
    const { data, handleChange } = this.props
    if (!formula) return

    this.setState({ isUpdating: true }, () => {
      const parser = new Parser()
      let newVariables = { ...currentVars }

      if (params.value === '' || params.value === null || params.value === undefined) {
        newVariables = { ...currentVars, [params.propKey]: 0 }
      } else {
        const processedValue = params.value
        if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
          const numericPart = processedValue.trim().slice(0, -1)
            .replace(/,/g, '')
          const parsedValue = parseFloat(numericPart)
          newVariables = { ...currentVars, [params.propKey]: !Number.isNaN(parsedValue) ? parsedValue / 100 : 0 }
        } else {
          const parsedValue = parseFloat(String(processedValue).replace(/,/g, ''))
          newVariables = { ...currentVars, [params.propKey]: !Number.isNaN(parsedValue) ? parsedValue : 0 }
        }
      }

      Object.entries(newVariables).forEach(([key, value]) => {
        const numValue = parseFloat(value)
        parser.setVariable(key, !Number.isNaN(numValue) ? numValue : 0)
      })

      const parseResult = parser.parse(formula)
      const newValue = parseResult?.result || 0
      const previousValue = currentValue

      this.setState({ variables: newVariables, value: newValue, isUpdating: false }, () => {
        const { formularKey } = data
        const valueChanged = Math.abs(previousValue - newValue) > 0.0001
        if (formularKey && handleChange && valueChanged && params.propKey !== formularKey) {
          setTimeout(() => handleChange(formularKey, newValue), 50)
        }
      })
    })
  }

  render() {
    const { error, value } = this.state
  const { data, style } = this.props

    const inputProps = {
      type: 'text',
      className: `form-control ${error ? 'is-invalid' : ''}`,
      name: data?.field_name,
      value: this.formatNumber(value),
      disabled: true,
    }

  let baseClasses = `${data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem'}`
  if (data.pageBreakBefore) {
      baseClasses += ' alwaysbreak'
    }

    return (
      <div style={{ ...style }} className={baseClasses}>
        {/* eslint-disable react/jsx-props-no-spreading */}
        <ComponentHeader data={data} style={style} {...this.props} />
        <div className={data.isShowLabel !== false ? 'form-group' : ''}>
          <ComponentLabel data={data} style={style} {...this.props} />
          <input type={inputProps.type} className={inputProps.className} name={inputProps.name} value={inputProps.value} disabled={inputProps.disabled} />
          {/* eslint-enable react/jsx-props-no-spreading */}
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    )
  }
}

FormulaInput.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    formula: PropTypes.string,
    field_name: PropTypes.string,
    formularKey: PropTypes.string,
    pageBreakBefore: PropTypes.bool,
    isShowLabel: PropTypes.bool,
  }).isRequired,
  variables: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  emitter: PropTypes.shape({
    addListener: PropTypes.func,
  }),
  defaultValue: PropTypes.shape({
    formula: PropTypes.string,
    variables: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  style: PropTypes.shape({}),
  handleChange: PropTypes.func,
}

FormulaInput.defaultProps = {
  variables: {},
  emitter: null,
  defaultValue: null,
  style: {},
  handleChange: null,
}

export default FormulaInput
