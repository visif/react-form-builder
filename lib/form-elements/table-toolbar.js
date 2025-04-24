"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var TableToolbar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(TableToolbar, _React$Component);
  var _super = _createSuper(TableToolbar);
  function TableToolbar(props) {
    var _this;
    (0, _classCallCheck2.default)(this, TableToolbar);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderColumnConfig", function (column, index) {
      var _column$options;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "column-config",
        key: "column-".concat(index)
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react.default.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "Column Header",
        value: column.text,
        onChange: function onChange(e) {
          return _this.handleColumnChange(index, 'text', e.target.value);
        }
      }), /*#__PURE__*/_react.default.createElement("input", {
        type: "number",
        className: "form-control",
        placeholder: "Width",
        value: column.width,
        onChange: function onChange(e) {
          return _this.handleColumnChange(index, 'width', e.target.value);
        }
      }), /*#__PURE__*/_react.default.createElement("select", {
        className: "form-control",
        value: column.inputType || 'textarea',
        onChange: function onChange(e) {
          return _this.handleColumnChange(index, 'inputType', e.target.value);
        }
      }, /*#__PURE__*/_react.default.createElement("option", {
        value: "textarea"
      }, "Text Area"), /*#__PURE__*/_react.default.createElement("option", {
        value: "radio"
      }, "Radio Button"), /*#__PURE__*/_react.default.createElement("option", {
        value: "checkbox"
      }, "Checkbox"), /*#__PURE__*/_react.default.createElement("option", {
        value: "select"
      }, "Dropdown")), column.inputType === 'select' && /*#__PURE__*/_react.default.createElement("div", {
        className: "select-options"
      }, /*#__PURE__*/_react.default.createElement("button", {
        type: "button",
        className: "btn btn-sm btn-info",
        onClick: function onClick() {
          return _this.addSelectOption(index);
        }
      }, "Add Option"), (_column$options = column.options) === null || _column$options === void 0 ? void 0 : _column$options.map(function (option, optionIndex) {
        return /*#__PURE__*/_react.default.createElement("div", {
          key: "option-".concat(optionIndex),
          className: "option-row"
        }, /*#__PURE__*/_react.default.createElement("input", {
          type: "text",
          className: "form-control",
          placeholder: "Label",
          value: option.label,
          onChange: function onChange(e) {
            return _this.handleOptionChange(index, optionIndex, 'label', e.target.value);
          }
        }), /*#__PURE__*/_react.default.createElement("input", {
          type: "text",
          className: "form-control",
          placeholder: "Value",
          value: option.value,
          onChange: function onChange(e) {
            return _this.handleOptionChange(index, optionIndex, 'value', e.target.value);
          }
        }), /*#__PURE__*/_react.default.createElement("button", {
          type: "button",
          className: "btn btn-sm btn-danger",
          onClick: function onClick() {
            return _this.removeSelectOption(index, optionIndex);
          }
        }, "Remove"));
      }))));
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleColumnChange", function (columnIndex, field, value) {
      var _objectSpread2;
      var newColumns = (0, _toConsumableArray2.default)(_this.state.columns);
      newColumns[columnIndex] = _objectSpread(_objectSpread({}, newColumns[columnIndex]), {}, (_objectSpread2 = {}, (0, _defineProperty2.default)(_objectSpread2, field, value), (0, _defineProperty2.default)(_objectSpread2, "options", field === 'inputType' && value === 'select' ? [{
        label: 'Option 1',
        value: 'option1'
      }] : newColumns[columnIndex].options), _objectSpread2));
      _this.setState({
        columns: newColumns
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addSelectOption", function (columnIndex) {
      var newColumns = (0, _toConsumableArray2.default)(_this.state.columns);
      var options = newColumns[columnIndex].options || [];
      newColumns[columnIndex].options = [].concat((0, _toConsumableArray2.default)(options), [{
        label: "Option ".concat(options.length + 1),
        value: "option".concat(options.length + 1)
      }]);
      _this.setState({
        columns: newColumns
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "removeSelectOption", function (columnIndex, optionIndex) {
      var newColumns = (0, _toConsumableArray2.default)(_this.state.columns);
      newColumns[columnIndex].options = newColumns[columnIndex].options.filter(function (_, i) {
        return i !== optionIndex;
      });
      _this.setState({
        columns: newColumns
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOptionChange", function (columnIndex, optionIndex, field, value) {
      var newColumns = (0, _toConsumableArray2.default)(_this.state.columns);
      newColumns[columnIndex].options[optionIndex] = _objectSpread(_objectSpread({}, newColumns[columnIndex].options[optionIndex]), {}, (0, _defineProperty2.default)({}, field, value));
      _this.setState({
        columns: newColumns
      });
    });
    _this.state = {
      columns: props.columns || []
    };
    return _this;
  }
  (0, _createClass2.default)(TableToolbar, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "table-toolbar"
      }, this.state.columns.map(function (column, index) {
        return _this2.renderColumnConfig(column, index);
      }));
    }
  }]);
  return TableToolbar;
}(_react.default.Component);
exports.default = TableToolbar;