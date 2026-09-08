"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _hotFormulaParser = require("hot-formula-parser");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _debounce = _interopRequireDefault(require("../functions/debounce"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
class FormulaInput extends _react.Component {
  constructor(props) {
    var _props$data, _props$data2;
    super(props);
    // Format the value for display
    (0, _defineProperty2.default)(this, "formatNumber", num => {
      if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
        return '0.00';
      }
      const numValue = parseFloat(num);
      return numValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });
    let newValue = '';
    if ((_props$data = props.data) !== null && _props$data !== void 0 && _props$data.formula && props.variables) {
      const parser = new _hotFormulaParser.Parser();
      Object.entries(props.variables).forEach(_ref => {
        let [key, value] = _ref;
        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
          parser.setVariable(key, parsedValue);
        }
      });
      const parseResult = parser.parse(props.data.formula);
      newValue = (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || '';
    }
    this.state = {
      error: '',
      formula: ((_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.formula) || '',
      variables: props.variables || {},
      value: newValue,
      isUpdating: false
    };
    this.handleVariableChange = this.handleVariableChange.bind(this);
    this.debouncedUpdate = (0, _debounce.default)(this.processVariableChange.bind(this), 100);
  }
  componentDidMount() {
    const {
      emitter
    } = this.props;
    if (emitter && typeof emitter.addListener === 'function') {
      this.subscription = emitter.addListener('variableChange', this.handleVariableChange);
    }
  }
  componentWillUnmount() {
    if (this.subscription && typeof this.subscription.remove === 'function') {
      this.subscription.remove();
    }
    if (this.debouncedUpdate && this.debouncedUpdate.cancel) this.debouncedUpdate.cancel();
  }
  static getDerivedStateFromProps(props, state) {
    var _props$data3;
    // Check if defaultValue exists and is different from current state
    if (props.defaultValue && props.defaultValue.value !== state.value) {
      // If defaultValue has a specific value, use it instead of recalculating
      if (props.defaultValue.value !== '' && props.defaultValue.value !== null && props.defaultValue.value !== undefined) {
        return {
          formula: props.defaultValue.formula || state.formula,
          variables: props.defaultValue.variables || state.variables,
          value: props.defaultValue.value
        };
      }
    }

    // Guard: no formula provided
    if (!(props !== null && props !== void 0 && (_props$data3 = props.data) !== null && _props$data3 !== void 0 && _props$data3.formula)) {
      return null;
    }

    // Shallow compare variables to avoid expensive stringify + false positives
    const incomingVars = props.variables || {};
    const prevVars = state.variables || {};
    let variablesChanged = Object.keys(incomingVars).length !== Object.keys(prevVars).length;
    if (!variablesChanged) {
      variablesChanged = Object.keys(incomingVars).some(k => {
        const incomingValue = parseFloat(incomingVars[k]);
        const prevValue = parseFloat(prevVars[k]);
        // Handle NaN comparison properly
        if (Number.isNaN(incomingValue) && Number.isNaN(prevValue)) {
          return false;
        }
        if (Number.isNaN(incomingValue) || Number.isNaN(prevValue)) {
          return true;
        }
        return Math.abs(incomingValue - prevValue) > 0.0001;
      });
    }
    const formulaChanged = props.data.formula !== state.formula;
    if (formulaChanged || variablesChanged) {
      const parser = new _hotFormulaParser.Parser();
      const newVariables = _objectSpread(_objectSpread({}, prevVars), incomingVars);
      Object.entries(newVariables).forEach(_ref2 => {
        let [key, value] = _ref2;
        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
          parser.setVariable(key, parsedValue);
        }
      });
      const parseResult = parser.parse(props.data.formula);
      return {
        formula: props.data.formula,
        variables: newVariables,
        value: (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || ''
      };
    }

    // No state update
    return null;
  }
  handleVariableChange(params) {
    const {
      formula,
      isUpdating
    } = this.state;
    if (!formula) {
      // Invalid / missing formula: nothing to compute
      return;
    }
    if (isUpdating) {
      return;
    }
    this.debouncedUpdate(params);
  }
  processVariableChange(params) {
    // Reordered below formatNumber to satisfy style rule
    const {
      formula,
      variables: currentVars,
      value: currentValue
    } = this.state;
    const {
      data,
      handleChange
    } = this.props;
    if (!formula) return;
    this.setState({
      isUpdating: true
    }, () => {
      const parser = new _hotFormulaParser.Parser();
      let newVariables = _objectSpread({}, currentVars);
      if (params.value === '' || params.value === null || params.value === undefined) {
        newVariables = _objectSpread(_objectSpread({}, currentVars), {}, {
          [params.propKey]: 0
        });
      } else {
        const processedValue = params.value;
        if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
          const numericPart = processedValue.trim().slice(0, -1).replace(/,/g, '');
          const parsedValue = parseFloat(numericPart);
          newVariables = _objectSpread(_objectSpread({}, currentVars), {}, {
            [params.propKey]: !Number.isNaN(parsedValue) ? parsedValue / 100 : 0
          });
        } else {
          const parsedValue = parseFloat(String(processedValue).replace(/,/g, ''));
          newVariables = _objectSpread(_objectSpread({}, currentVars), {}, {
            [params.propKey]: !Number.isNaN(parsedValue) ? parsedValue : 0
          });
        }
      }
      Object.entries(newVariables).forEach(_ref3 => {
        let [key, value] = _ref3;
        const numValue = parseFloat(value);
        parser.setVariable(key, !Number.isNaN(numValue) ? numValue : 0);
      });
      const parseResult = parser.parse(formula);
      const newValue = (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || 0;
      const previousValue = currentValue;
      this.setState({
        variables: newVariables,
        value: newValue,
        isUpdating: false
      }, () => {
        const {
          formularKey
        } = data;
        const valueChanged = Math.abs(previousValue - newValue) > 0.0001;
        if (formularKey && handleChange && valueChanged && params.propKey !== formularKey) {
          setTimeout(() => handleChange(formularKey, newValue), 50);
        }
      });
    });
  }
  render() {
    const {
      error,
      value
    } = this.state;
    const {
      data,
      style
    } = this.props;
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if formula input has any value
    const hasValue = value !== '' && value !== null && value !== undefined;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "Edited by: ".concat(savedEditor.name) : '';
    const inputProps = {
      type: 'text',
      className: "form-control ".concat(error ? 'is-invalid' : ''),
      name: data === null || data === void 0 ? void 0 : data.field_name,
      value: this.formatNumber(value),
      disabled: true
    };
    if (tooltipText) {
      inputProps.title = tooltipText;
    }
    let baseClasses = "".concat(data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      style: _objectSpread({}, style),
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, (0, _extends2.default)({
      data: data,
      style: style
    }, this.props)), /*#__PURE__*/_react.default.createElement("div", {
      className: data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, (0, _extends2.default)({
      data: data,
      style: style
    }, this.props)), /*#__PURE__*/_react.default.createElement("input", {
      type: inputProps.type,
      className: inputProps.className,
      name: inputProps.name,
      value: inputProps.value,
      disabled: inputProps.disabled,
      title: inputProps.title
    }), error && /*#__PURE__*/_react.default.createElement("div", {
      className: "invalid-feedback"
    }, error)));
  }
}
FormulaInput.propTypes = {
  data: _propTypes.default.shape({
    label: _propTypes.default.string,
    formula: _propTypes.default.string,
    field_name: _propTypes.default.string,
    formularKey: _propTypes.default.string,
    pageBreakBefore: _propTypes.default.bool,
    isShowLabel: _propTypes.default.bool
  }).isRequired,
  variables: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])),
  emitter: _propTypes.default.shape({
    addListener: _propTypes.default.func
  }),
  defaultValue: _propTypes.default.shape({
    formula: _propTypes.default.string,
    variables: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])),
    value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
  }),
  style: _propTypes.default.shape({}),
  handleChange: _propTypes.default.func,
  getActiveUserProperties: _propTypes.default.func,
  editor: _propTypes.default.shape({
    userId: _propTypes.default.string,
    name: _propTypes.default.string
  })
};
FormulaInput.defaultProps = {
  variables: {},
  emitter: null,
  defaultValue: null,
  style: {},
  handleChange: null,
  getActiveUserProperties: null,
  editor: null
};
var _default = exports.default = FormulaInput;