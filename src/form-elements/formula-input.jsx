import React, { Component } from 'react';
import { Parser } from 'hot-formula-parser';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';

class FormulaInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formula: '', // The calculated result or the error message
      error: '', // Error message from the parser
      variables: {}, // Variables to pass into parser.
    };
    this.parser = new Parser();
  }

  componentDidMount() {
    this.setVariables();
    this.handleChange();
  }

  componentDidUpdate(prevProps) {
    // Update formula when either the formula prop or the variables change
    if (
      prevProps.formula !== this.props.formula ||
      JSON.stringify(prevProps.variables) !== JSON.stringify(this.props.variables)
    ) {
      this.setVariables();
      this.handleChange();
    }
  }

  setVariables() {
    // Reset the variables in the parser
    this.parser.setVariable('ERROR', '');
    // Set the variables from props
    if (this.props.variables) {
      Object.entries(this.props.variables).forEach(([key, value]) => {
        // Check if the value is numeric before setting it as a variable
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          this.parser.setVariable(key, parsedValue);
        } else {
          this.parser.setVariable('ERROR', `variable ${key} is not a number`);
        }
      });
    }
  }

  handleChange = () => {
    const formula = this.props.formula?.trim(); // Ensure it's a valid string
    if (!formula) {
      this.setState({ error: '', formula: '' });
      return;
    }

    const result = this.parser.parse(formula);
    if (result.error || this.parser.getVariable('ERROR')) {
      this.setState({
        error: result.error || this.parser.getVariable('ERROR'),
        formula: '',
      });
    } else {
      this.setState({ error: '', formula: result.result });
    }
  };

  render() {
    const { error, formula } = this.state;
    const inputProps = {
      type: 'text',
      className: `form-control ${error ? 'is-invalid' : ''}`,
      name: this.props.data?.field_name,
      value: formula,
      disabled: true,
    };

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data?.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }

    return (
      <div style={{ ...this.props.style }} className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <input {...inputProps} />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    );
  }
}

export default FormulaInput;
