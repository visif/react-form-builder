"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _hotFormulaParser = require("hot-formula-parser");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _debounce = _interopRequireDefault(require("../functions/debounce"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormulaInput = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(FormulaInput, _Component);
  var _super = _createSuper(FormulaInput);
  function FormulaInput(props) {
    var _props$data, _props$data2;
    var _this;
    (0, _classCallCheck2["default"])(this, FormulaInput);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "formatNumber", function (num) {
      if (num === '' || num === null || num === undefined || Number.isNaN(num)) {
        return '0.00';
      }
      var numValue = parseFloat(num);
      return numValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });
    var newValue = '';
    if ((_props$data = props.data) !== null && _props$data !== void 0 && _props$data.formula && props.variables) {
      var parser = new _hotFormulaParser.Parser();
      Object.entries(props.variables).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        var parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
          parser.setVariable(key, parsedValue);
        }
      });
      var parseResult = parser.parse(props.data.formula);
      newValue = (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || '';
    }
    _this.state = {
      error: '',
      formula: ((_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.formula) || '',
      variables: props.variables || {},
      value: newValue,
      isUpdating: false
    };
    _this.handleVariableChange = _this.handleVariableChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.debouncedUpdate = (0, _debounce["default"])(_this.processVariableChange.bind((0, _assertThisInitialized2["default"])(_this)), 100);
    return _this;
  }
  (0, _createClass2["default"])(FormulaInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var emitter = this.props.emitter;
      if (emitter && typeof emitter.addListener === 'function') {
        this.subscription = emitter.addListener('variableChange', this.handleVariableChange);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.subscription && typeof this.subscription.remove === 'function') {
        this.subscription.remove();
      }
      if (this.debouncedUpdate && this.debouncedUpdate.cancel) this.debouncedUpdate.cancel();
    }
  }, {
    key: "handleVariableChange",
    value: function handleVariableChange(params) {
      var _this$state = this.state,
        formula = _this$state.formula,
        isUpdating = _this$state.isUpdating;
      if (!formula) {
        // Invalid / missing formula: nothing to compute
        return;
      }
      if (isUpdating) {
        return;
      }
      this.debouncedUpdate(params);
    }

    // Format the value for display
  }, {
    key: "processVariableChange",
    value: function processVariableChange(params) {
      var _this2 = this;
      // Reordered below formatNumber to satisfy style rule
      var _this$state2 = this.state,
        formula = _this$state2.formula,
        currentVars = _this$state2.variables,
        currentValue = _this$state2.value;
      var _this$props = this.props,
        data = _this$props.data,
        handleChange = _this$props.handleChange;
      if (!formula) return;
      this.setState({
        isUpdating: true
      }, function () {
        var parser = new _hotFormulaParser.Parser();
        var newVariables = _objectSpread({}, currentVars);
        if (params.value === '' || params.value === null || params.value === undefined) {
          newVariables = _objectSpread(_objectSpread({}, currentVars), {}, (0, _defineProperty2["default"])({}, params.propKey, 0));
        } else {
          var processedValue = params.value;
          if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
            var numericPart = processedValue.trim().slice(0, -1).replace(/,/g, '');
            var parsedValue = parseFloat(numericPart);
            newVariables = _objectSpread(_objectSpread({}, currentVars), {}, (0, _defineProperty2["default"])({}, params.propKey, !Number.isNaN(parsedValue) ? parsedValue / 100 : 0));
          } else {
            var _parsedValue = parseFloat(String(processedValue).replace(/,/g, ''));
            newVariables = _objectSpread(_objectSpread({}, currentVars), {}, (0, _defineProperty2["default"])({}, params.propKey, !Number.isNaN(_parsedValue) ? _parsedValue : 0));
          }
        }
        Object.entries(newVariables).forEach(function (_ref3) {
          var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];
          var numValue = parseFloat(value);
          parser.setVariable(key, !Number.isNaN(numValue) ? numValue : 0);
        });
        var parseResult = parser.parse(formula);
        var newValue = (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || 0;
        var previousValue = currentValue;
        _this2.setState({
          variables: newVariables,
          value: newValue,
          isUpdating: false
        }, function () {
          var formularKey = data.formularKey;
          var valueChanged = Math.abs(previousValue - newValue) > 0.0001;
          if (formularKey && handleChange && valueChanged && params.propKey !== formularKey) {
            setTimeout(function () {
              return handleChange(formularKey, newValue);
            }, 50);
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state3 = this.state,
        error = _this$state3.error,
        value = _this$state3.value;
      var _this$props2 = this.props,
        data = _this$props2.data,
        style = _this$props2.style;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;

      // Check if formula input has any value
      var hasValue = value !== '' && value !== null && value !== undefined;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }

      // Create tooltip text for editor name
      var tooltipText = savedEditor && savedEditor.name && hasValue ? "Edited by: ".concat(savedEditor.name) : '';
      var inputProps = {
        type: 'text',
        className: "form-control ".concat(error ? 'is-invalid' : ''),
        name: data === null || data === void 0 ? void 0 : data.field_name,
        value: this.formatNumber(value),
        disabled: true
      };
      if (tooltipText) {
        inputProps.title = tooltipText;
      }
      var baseClasses = "".concat(data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: _objectSpread({}, style),
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], (0, _extends2["default"])({
        data: data,
        style: style
      }, this.props)), /*#__PURE__*/_react["default"].createElement("div", {
        className: data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
        data: data,
        style: style
      }, this.props)), /*#__PURE__*/_react["default"].createElement("input", {
        type: inputProps.type,
        className: inputProps.className,
        name: inputProps.name,
        value: inputProps.value,
        disabled: inputProps.disabled,
        title: inputProps.title
      }), error && /*#__PURE__*/_react["default"].createElement("div", {
        className: "invalid-feedback"
      }, error)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
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
      var incomingVars = props.variables || {};
      var prevVars = state.variables || {};
      var variablesChanged = Object.keys(incomingVars).length !== Object.keys(prevVars).length;
      if (!variablesChanged) {
        variablesChanged = Object.keys(incomingVars).some(function (k) {
          var incomingValue = parseFloat(incomingVars[k]);
          var prevValue = parseFloat(prevVars[k]);
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
      var formulaChanged = props.data.formula !== state.formula;
      if (formulaChanged || variablesChanged) {
        var parser = new _hotFormulaParser.Parser();
        var newVariables = _objectSpread(_objectSpread({}, prevVars), incomingVars);
        Object.entries(newVariables).forEach(function (_ref5) {
          var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
            key = _ref6[0],
            value = _ref6[1];
          var parsedValue = parseFloat(value);
          if (!Number.isNaN(parsedValue)) {
            parser.setVariable(key, parsedValue);
          }
        });
        var parseResult = parser.parse(props.data.formula);
        return {
          formula: props.data.formula,
          variables: newVariables,
          value: (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || ''
        };
      }

      // No state update
      return null;
    }
  }]);
  return FormulaInput;
}(_react.Component);
FormulaInput.propTypes = {
  data: _propTypes["default"].shape({
    label: _propTypes["default"].string,
    formula: _propTypes["default"].string,
    field_name: _propTypes["default"].string,
    formularKey: _propTypes["default"].string,
    pageBreakBefore: _propTypes["default"].bool,
    isShowLabel: _propTypes["default"].bool
  }).isRequired,
  variables: _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string])),
  emitter: _propTypes["default"].shape({
    addListener: _propTypes["default"].func
  }),
  defaultValue: _propTypes["default"].shape({
    formula: _propTypes["default"].string,
    variables: _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string])),
    value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
  }),
  style: _propTypes["default"].shape({}),
  handleChange: _propTypes["default"].func,
  getActiveUserProperties: _propTypes["default"].func,
  editor: _propTypes["default"].shape({
    userId: _propTypes["default"].string,
    name: _propTypes["default"].string
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
var _default = FormulaInput;
exports["default"] = _default;