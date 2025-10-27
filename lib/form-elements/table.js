"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
var _Table;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Table = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function Table(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Table);
    _this = _callSuper(this, Table, [props]);
    (0, _defineProperty2["default"])(_this, "self", _this);
    (0, _defineProperty2["default"])(_this, "addRow", function () {
      _this.setState(function (current) {
        return _objectSpread(_objectSpread({}, current), {}, {
          rowsAdded: current.rowsAdded + 1,
          inputs: Table.getInputValues(current.inputs, current.columns, current.rows, current.rowsAdded + 1)
        });
      });
    });
    (0, _defineProperty2["default"])(_this, "removeRow", function () {
      _this.setState(function (current) {
        return _objectSpread(_objectSpread({}, current), {}, {
          rowsAdded: current.rowsAdded - 1,
          inputs: Table.getInputValues(current.inputs, current.columns, current.rows, current.rowsAdded - 1)
        });
      });
    });
    (0, _defineProperty2["default"])(_this, "renderRows", function () {
      var _this$state$rowLabels, _this$state$rowLabels2;
      var userProperties = _this.props.getActiveUserProperties && _this.props.getActiveUserProperties();
      var savedEditor = _this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var isFixedRow = ((_this$state$rowLabels = _this.state.rowLabels) === null || _this$state$rowLabels === void 0 ? void 0 : _this$state$rowLabels.length) > 0;
      var activeRows = isFixedRow ? (_this$state$rowLabels2 = _this.state.rowLabels) === null || _this$state$rowLabels2 === void 0 ? void 0 : _this$state$rowLabels2.length : _this.state.rows + _this.state.rowsAdded;
      return /*#__PURE__*/_react["default"].createElement("tbody", null, Array.from(Array(Number(activeRows)).keys()).map(function (i) {
        var _this$props$data;
        return /*#__PURE__*/_react["default"].createElement("tr", {
          key: 'row' + i
        }, (_this$props$data = _this.props.data) === null || _this$props$data === void 0 || (_this$props$data = _this$props$data.columns) === null || _this$props$data === void 0 ? void 0 : _this$props$data.map(function (j, jIndex) {
          var _this$state$inputs$i$;
          var isLabel = isFixedRow && jIndex === 0;
          if (isLabel) {
            return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("label", null, _this.state.rowLabels[i].text));
          }
          var value = _this.state.inputs[i] ? (_this$state$inputs$i$ = _this.state.inputs[i][jIndex]) !== null && _this$state$inputs$i$ !== void 0 ? _this$state$inputs$i$ : '' : '';
          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("textarea", {
            className: "form-control",
            style: isLabel ? {
              border: 0,
              backgroundColor: 'inherit'
            } : {},
            disabled: isLabel || !isSameEditor,
            type: "text",
            value: value,
            rows: 1,
            onChange: function onChange(event) {
              var value = event.target.value;
              var array = _this.state.inputs;
              array[i][jIndex] = value;
              _this.setState({
                inputs: array
              });
            }
          }));
        }));
      }));
    });
    (0, _defineProperty2["default"])(_this, "getColumnWidth", function (totalWidthCount, width) {
      var currentWidth = parseInt(width) ? Number(width) : 1;
      return "".concat(currentWidth / totalWidthCount * 100, "%");
    });
    _this.tableRef = /*#__PURE__*/_react["default"].createRef();
    var rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
    _this.state = {
      rows: Number(props.data.rows),
      rowLabels: props.data.rowLabels,
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), rowsAdded, props.data.rowLabels),
      rowsAdded: rowsAdded
    };
    return _this;
  }
  (0, _inherits2["default"])(Table, _React$Component);
  return (0, _createClass2["default"])(Table, [{
    key: "render",
    value: function render() {
      var _this$props,
        _this$props$data2,
        _this$state$rowLabels3,
        _this$props$data3,
        _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if ((_this$props = this.props) !== null && _this$props !== void 0 && (_this$props = _this$props.data) !== null && _this$props !== void 0 && _this$props.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      var totalWidthCount = (_this$props$data2 = this.props.data) === null || _this$props$data2 === void 0 ? void 0 : _this$props$data2.columns.reduce(function (previous, current) {
        return previous + (parseInt(current.width) ? Number(current.width) : 1);
      }, 0);
      var isFixedRow = ((_this$state$rowLabels3 = this.state.rowLabels) === null || _this$state$rowLabels3 === void 0 ? void 0 : _this$state$rowLabels3.length) > 0;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses,
        key: "table-container-".concat(this.props.id)
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("table", {
        className: "table table-bordered",
        ref: this.tableRef,
        key: "table-".concat(this.props.id)
      }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, (_this$props$data3 = this.props.data) === null || _this$props$data3 === void 0 || (_this$props$data3 = _this$props$data3.columns) === null || _this$props$data3 === void 0 ? void 0 : _this$props$data3.map(function (col) {
        return /*#__PURE__*/_react["default"].createElement("th", {
          scope: "col",
          style: {
            width: _this2.getColumnWidth(totalWidthCount, col.width)
          }
        }, col.text);
      }))), this.renderRows()), !isFixedRow && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: 'right'
        }
      }, /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        "class": "btn btn-secondary",
        onClick: this.removeRow,
        style: {
          marginRight: 8,
          display: this.state.inputs.length > 0 ? 'initial' : 'none'
        },
        disabled: !isSameEditor
      }, "Remove Row"), /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        "class": "btn btn-info",
        disabled: !isSameEditor,
        onClick: this.addRow
      }, "Add Row"))));
    }
  }]);
}(_react["default"].Component);
_Table = Table;
(0, _defineProperty2["default"])(Table, "getInputValues", function () {
  var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var columns = arguments.length > 1 ? arguments[1] : undefined;
  var rows = arguments.length > 2 ? arguments[2] : undefined;
  var addingRows = arguments.length > 3 ? arguments[3] : undefined;
  var rowLabels = arguments.length > 4 ? arguments[4] : undefined;
  var result = [];
  var isFixedRow = (rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels.length) > 0;
  var activeRows = isFixedRow ? rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels.length : rows + addingRows;
  Array.from(Array(Number(activeRows)).keys()).map(function (i) {
    var current = [];
    columns.map(function (j, jIndex) {
      var _defaultValue$i$jInde;
      var value = defaultValue[i] ? (_defaultValue$i$jInde = defaultValue[i][jIndex]) !== null && _defaultValue$i$jInde !== void 0 ? _defaultValue$i$jInde : '' : '';
      if (isFixedRow && jIndex === 0) {
        value = rowLabels[i].text;
      }
      current.push(value);
    });
    result.push(current);
  });
  return result;
});
(0, _defineProperty2["default"])(Table, "getDerivedStateFromProps", function (props, state) {
  console.log('Table getDerivedStateFromProps');
  if (Number(props.data.rows) !== Number(state.rows) || JSON.stringify(props.data.columns) !== JSON.stringify(state.columns) || JSON.stringify(state.rowLabels) !== JSON.stringify(props.data.rowLabels)) {
    console.log('Table default columns/rows changed');
    return {
      rows: Number(props.data.rows),
      columns: props.data.columns,
      defaultValue: state.defaultValue,
      inputs: _Table.getInputValues(state.inputs, props.data.columns, Number(props.data.rows), state.rowsAdded, props.data.rowLabels),
      rowsAdded: state.rowsAdded,
      rowLabels: props.data.rowLabels
    };
  }
  if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
    console.log('Table default prop changed', state.defaultValue, props.defaultValue);
    var rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
    return {
      rows: Number(props.data.rows),
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: _Table.getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), rowsAdded, props.data.rowLabels),
      rowsAdded: rowsAdded,
      rowLabels: props.data.rowLabels
    };
  }
  return state;
});