"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormulaInput = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(FormulaInput, _React$Component);
  var _super = _createSuper(FormulaInput);
  function FormulaInput(_props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FormulaInput);
    _this = _super.call(this, _props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_getValue", function (props) {
      var computedValue = '';
      if (props.data && props.data.formula && props.handleFormulaChange) {
        computedValue = props.handleFormulaChange(props.data.formula) || '';
      } else {
        computedValue = props.defaultValue || '';
      }
      return computedValue;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleChange", function (e) {
      var value = e.target.value;
      _this.setState({
        value: value
      });

      // If onElementChange is provided, call it to synchronize changes across the column
      if (_this.props.onElementChange) {
        // Create updated data object with the new value
        var updatedData = _objectSpread(_objectSpread({}, _this.props.data), {}, {
          value: value
        });

        // Send it for synchronization across columns
        _this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (_this.props.data.dirty === undefined || _this.props.data.dirty) {
          updatedData.dirty = true;
          if (_this.props.updateElement) {
            _this.props.updateElement(updatedData);
          }
        }
      }
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      value: _this._getValue(_props)
    };
    return _this;
  }
  (0, _createClass2["default"])(FormulaInput, [{
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var props = {};
      props.type = 'text';
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      props.onChange = this.handleChange;
      props.value = this.state.value;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);
  return FormulaInput;
}(_react["default"].Component);
var _default = FormulaInput;
exports["default"] = _default;