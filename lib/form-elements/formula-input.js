"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
      value: newValue
    };
    _this.handleVariableChange = _this.handleVariableChange.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }
  (0, _createClass2["default"])(FormulaInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props$emitter;
      this.subscription = (_this$props$emitter = this.props.emitter) === null || _this$props$emitter === void 0 ? void 0 : _this$props$emitter.addListener('variableChange', this.handleVariableChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$subscription;
      (_this$subscription = this.subscription) === null || _this$subscription === void 0 ? void 0 : _this$subscription.remove();
    }
  }, {
    key: "handleVariableChange",
    value: function handleVariableChange(params) {
      var _this2 = this;
      var formula = this.state.formula;
      if (!formula) {
        // Fix: Remove the undefined 'errors' variable
        console.error("".concat(this.props.data.label, " is invalid!"));
        return;
      }
      var parser = new _hotFormulaParser.Parser();
      var newVariables = _objectSpread({}, this.state.variables);

      // Handle empty/cleared values
      if (params.value === '' || params.value === null || params.value === undefined) {
        // Remove the variable or set it to 0
        newVariables = _objectSpread(_objectSpread({}, this.state.variables), {}, (0, _defineProperty2["default"])({}, params.propKey, 0));
      } else {
        var processedValue = params.value;

        // Check if the value ends with % and convert to decimal
        if (typeof processedValue === 'string' && processedValue.trim().endsWith('%')) {
          var numericPart = processedValue.trim().slice(0, -1); // Remove the % symbol
          var parsedValue = parseFloat(numericPart);
          if (!Number.isNaN(parsedValue)) {
            newVariables = _objectSpread(_objectSpread({}, this.state.variables), {}, (0, _defineProperty2["default"])({}, params.propKey, parsedValue / 100));
          } else {
            newVariables = _objectSpread(_objectSpread({}, this.state.variables), {}, (0, _defineProperty2["default"])({}, params.propKey, 0));
          }
        } else {
          var _parsedValue = parseFloat(processedValue);
          if (!Number.isNaN(_parsedValue)) {
            newVariables = _objectSpread(_objectSpread({}, this.state.variables), {}, (0, _defineProperty2["default"])({}, params.propKey, _parsedValue));
          } else {
            // If it's not a valid number, set to 0
            newVariables = _objectSpread(_objectSpread({}, this.state.variables), {}, (0, _defineProperty2["default"])({}, params.propKey, 0));
          }
        }
      }

      // Set all variables in the parser
      Object.entries(newVariables).forEach(function (_ref3) {
        var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];
        var numValue = parseFloat(value);
        if (!Number.isNaN(numValue)) {
          parser.setVariable(key, numValue);
        } else {
          parser.setVariable(key, 0);
        }
      });
      var parseResult = parser.parse(formula);
      var newValue = (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || 0;
      var previousValue = this.state.value;
      this.setState(function (prevState) {
        return _objectSpread(_objectSpread({}, prevState), {}, {
          variables: newVariables,
          value: newValue
        });
      }, function () {
        // Fix: Only dispatch if this component's value changed AND it's not from its own formularKey
        var _this2$props = _this2.props,
          data = _this2$props.data,
          handleChange = _this2$props.handleChange;
        var formularKey = data.formularKey;
        if (formularKey && handleChange && previousValue !== newValue && params.propKey !== formularKey) {
          handleChange(formularKey, newValue);
        }
      });
    }

    // Format the value for display
  }, {
    key: "render",
    value: function render() {
      var _this$props$data;
      var _this$state = this.state,
        error = _this$state.error,
        value = _this$state.value;
      var inputProps = {
        type: 'text',
        className: "form-control ".concat(error ? 'is-invalid' : ''),
        name: (_this$props$data = this.props.data) === null || _this$props$data === void 0 ? void 0 : _this$props$data.field_name,
        value: this.formatNumber(value),
        disabled: true
      };
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: _objectSpread({}, this.props.style),
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", inputProps), error && /*#__PURE__*/_react["default"].createElement("div", {
        className: "invalid-feedback"
      }, error)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      // Check if defaultValue exists and is different from current state
      if (props.defaultValue && props.defaultValue.value !== state.value) {
        // If defaultValue has a specific value, use it instead of recalculating
        if (props.defaultValue.value !== '' && props.defaultValue.value !== null && props.defaultValue.value !== undefined) {
          return _objectSpread(_objectSpread({}, state), {}, {
            formula: props.defaultValue.formula || state.formula,
            variables: props.defaultValue.variables || state.variables,
            value: props.defaultValue.value
          });
        }
      }
      if (props.data.formula !== state.formula || JSON.stringify(props.variables) !== JSON.stringify(state.variables)) {
        if (props.variables) {
          var parser = new _hotFormulaParser.Parser();
          var newVariables = _objectSpread(_objectSpread({}, state.variables), props.variables);
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
          return _objectSpread(_objectSpread({}, state), {}, {
            variables: newVariables,
            value: (parseResult === null || parseResult === void 0 ? void 0 : parseResult.result) || ''
          });
        }
      }
      return state;
    }
  }]);
  return FormulaInput;
}(_react.Component);
var _default = FormulaInput;
exports["default"] = _default;