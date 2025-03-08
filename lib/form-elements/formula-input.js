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
    var _this;
    (0, _classCallCheck2["default"])(this, FormulaInput);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleChange", function () {
      var _this$props$formula;
      var formula = (_this$props$formula = _this.props.formula) === null || _this$props$formula === void 0 ? void 0 : _this$props$formula.trim(); // Ensure it's a valid string
      if (!formula) {
        _this.setState({
          error: "",
          formula: ""
        });
        return;
      }
      var result = _this.parser.parse(formula);
      if (result.error || _this.parser.getVariable("ERROR")) {
        _this.setState({
          error: result.error || _this.parser.getVariable("ERROR"),
          formula: ""
        });
      } else {
        _this.setState({
          error: "",
          formula: result.result
        });
      }
    });
    _this.state = {
      formula: "",
      // The calculated result or the error message
      error: "",
      // Error message from the parser
      variables: {} // Variables to pass into parser.
    };

    _this.parser = new _hotFormulaParser.Parser();
    return _this;
  }
  (0, _createClass2["default"])(FormulaInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setVariables();
      this.handleChange();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // Update formula when either the formula prop or the variables change
      if (prevProps.formula !== this.props.formula || JSON.stringify(prevProps.variables) !== JSON.stringify(this.props.variables)) {
        this.setVariables();
        this.handleChange();
      }
    }
  }, {
    key: "setVariables",
    value: function setVariables() {
      var _this2 = this;
      // Reset the variables in the parser
      this.parser.setVariable("ERROR", "");
      // Set the variables from props
      if (this.props.variables) {
        Object.entries(this.props.variables).forEach(function (_ref) {
          var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];
          // Check if the value is numeric before setting it as a variable
          var parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            _this2.parser.setVariable(key, parsedValue);
          } else {
            _this2.parser.setVariable("ERROR", "variable ".concat(key, " is not a number"));
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$data, _this$props$data2;
      var _this$state = this.state,
        error = _this$state.error,
        formula = _this$state.formula;
      var inputProps = {
        type: "text",
        className: "form-control ".concat(error ? "is-invalid" : ""),
        name: (_this$props$data = this.props.data) === null || _this$props$data === void 0 ? void 0 : _this$props$data.field_name,
        value: formula,
        disabled: true
      };
      var baseClasses = "SortableItem rfb-item";
      if ((_this$props$data2 = this.props.data) !== null && _this$props$data2 !== void 0 && _this$props$data2.pageBreakBefore) {
        baseClasses += " alwaysbreak";
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: _objectSpread({}, this.props.style),
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", inputProps), error && /*#__PURE__*/_react["default"].createElement("div", {
        className: "invalid-feedback"
      }, error)));
    }
  }]);
  return FormulaInput;
}(_react.Component);
var _default = FormulaInput;
exports["default"] = _default;