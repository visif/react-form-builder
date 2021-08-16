"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _react = _interopRequireWildcard(require("react"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

var _componentLabel = _interopRequireDefault(require("./component-label"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// import FormElements from '../form-elements';
var Table = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Table, _React$Component);

  var _super = _createSuper(Table);

  function Table(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Table);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "self", (0, _assertThisInitialized2["default"])(_this));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderRows", function () {
      var _this$props$data, _this$props$data2;

      if (!Number((_this$props$data = _this.props.data) === null || _this$props$data === void 0 ? void 0 : _this$props$data.rows)) {
        return;
      }

      return /*#__PURE__*/_react["default"].createElement("tbody", null, Array.from(Array(Number((_this$props$data2 = _this.props.data) === null || _this$props$data2 === void 0 ? void 0 : _this$props$data2.rows)).keys()).map(function (i) {
        var _this$props$data3, _this$props$data3$col;

        return /*#__PURE__*/_react["default"].createElement("tr", {
          key: "row" + i
        }, (_this$props$data3 = _this.props.data) === null || _this$props$data3 === void 0 ? void 0 : (_this$props$data3$col = _this$props$data3.columns) === null || _this$props$data3$col === void 0 ? void 0 : _this$props$data3$col.map(function (j, jIndex) {
          var _this$state$inputs$i$;

          return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("input", {
            className: "form-control",
            type: "text",
            value: _this.state.inputs[i] ? (_this$state$inputs$i$ = _this.state.inputs[i][jIndex]) !== null && _this$state$inputs$i$ !== void 0 ? _this$state$inputs$i$ : '' : '',
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
    _this.tableRef = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      rows: props.data.rows,
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(props.defaultValue, props.data.columns, props.data.rows)
    };
    return _this;
  }

  (0, _createClass2["default"])(Table, [{
    key: "render",
    value: function render() {
      var _this$props, _this$props$data4, _this$props$data5, _this$props$data5$col;

      var baseClasses = 'SortableItem rfb-item';

      if ((_this$props = this.props) !== null && _this$props !== void 0 && (_this$props$data4 = _this$props.data) !== null && _this$props$data4 !== void 0 && _this$props$data4.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("table", {
        className: "table table-bordered",
        ref: this.tableRef
      }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, (_this$props$data5 = this.props.data) === null || _this$props$data5 === void 0 ? void 0 : (_this$props$data5$col = _this$props$data5.columns) === null || _this$props$data5$col === void 0 ? void 0 : _this$props$data5$col.map(function (col) {
        return /*#__PURE__*/_react["default"].createElement("th", {
          scope: "col"
        }, col.text);
      }))), this.renderRows())));
    }
  }]);
  return Table;
}(_react["default"].Component);

exports["default"] = Table;
(0, _defineProperty2["default"])(Table, "getInputValues", function () {
  var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var columns = arguments.length > 1 ? arguments[1] : undefined;
  var rows = arguments.length > 2 ? arguments[2] : undefined;
  var result = [];
  Array.from(Array(Number(rows)).keys()).map(function (i) {
    var current = [];
    columns.map(function (j, jIndex) {
      var _defaultValue$i$jInde;

      var value = defaultValue[i] ? (_defaultValue$i$jInde = defaultValue[i][jIndex]) !== null && _defaultValue$i$jInde !== void 0 ? _defaultValue$i$jInde : '' : '';
      current.push(value);
    });
    result.push(current);
  });
  return result;
});
(0, _defineProperty2["default"])(Table, "getDerivedStateFromProps", function (props, state) {
  console.log('Table getDerivedStateFromProps');

  if (Number(props.data.rows) !== Number(state.rows) || JSON.stringify(props.data.columns) !== JSON.stringify(state.columns)) {
    console.log('Table default columns/rows changed');
    return {
      rows: props.data.rows,
      columns: props.data.columns,
      defaultValue: state.defaultValue,
      inputs: Table.getInputValues(state.inputs, props.data.columns, props.data.rows)
    };
  }

  if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
    console.log('Table default prop changed', state.defaultValue, props.defaultValue);
    return {
      rows: props.data.rows,
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(props.defaultValue, props.data.columns, props.data.rows)
    };
  }

  return state;
});