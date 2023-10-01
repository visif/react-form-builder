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
var _formElements = _interopRequireDefault(require("../form-elements"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var _ref = _formElements["default"] || {},
  Checkboxes = _ref.Checkboxes;
var Table = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Table, _React$Component);
  var _super = _createSuper(Table);
  function Table(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Table);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "self", (0, _assertThisInitialized2["default"])(_this));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "addRow", function () {
      _this.setState(function (current) {
        return _objectSpread(_objectSpread({}, current), {}, {
          rowsAdded: current.rowsAdded + 1,
          inputs: Table.getInputValues(current.inputs, current.columns, current.rows, current.rowsAdded + 1)
        });
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeRow", function () {
      _this.setState(function (current) {
        return _objectSpread(_objectSpread({}, current), {}, {
          rowsAdded: current.rowsAdded - 1,
          inputs: Table.getInputValues(current.inputs, current.columns, current.rows, current.rowsAdded - 1)
        });
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderRows", function () {
      var _this$state$rowLabels, _this$state$rowLabels2;
      var userProperties = _this.props.getActiveUserProperties && _this.props.getActiveUserProperties();
      var savedEditor = _this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var isFixedRow = ((_this$state$rowLabels = _this.state.rowLabels) === null || _this$state$rowLabels === void 0 ? void 0 : _this$state$rowLabels.length) > 0;
      var activeRows = isFixedRow ? (_this$state$rowLabels2 = _this.state.rowLabels) === null || _this$state$rowLabels2 === void 0 ? void 0 : _this$state$rowLabels2.length : _this.state.rows + _this.state.rowsAdded;
      return /*#__PURE__*/_react["default"].createElement("tbody", null, Array.from(Array(Number(activeRows)).keys()).map(function (i) {
        var _this$props$data, _this$props$data$colu;
        return /*#__PURE__*/_react["default"].createElement("tr", {
          key: "row" + i
        }, (_this$props$data = _this.props.data) === null || _this$props$data === void 0 ? void 0 : (_this$props$data$colu = _this$props$data.columns) === null || _this$props$data$colu === void 0 ? void 0 : _this$props$data$colu.map(function (j, jIndex) {
          var _this$state$inputs$i$;
          var isLabel = isFixedRow && jIndex === 0;
          if (isLabel) {
            return /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement("label", null, _this.state.rowLabels[i].text));
          }
          var value = _this.state.inputs[i] ? (_this$state$inputs$i$ = _this.state.inputs[i][jIndex]) !== null && _this$state$inputs$i$ !== void 0 ? _this$state$inputs$i$ : "" : "";
          return /*#__PURE__*/_react["default"].createElement("td", null, _this.getColumnInputType("Dropdown"));
        }));
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getColumnWidth", function (totalWidthCount, width) {
      var currentWidth = parseInt(width) ? Number(width) : 1;
      return "".concat(currentWidth / totalWidthCount * 100, "%");
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getColumnInputType", function (type) {
      switch (type) {
        case "Dropdown":
          return _this.getInputElement(type);
        case "Checkboxes":
          return /*#__PURE__*/_react["default"].createElement(Checkboxes
          // ref={(c) => (this.inputs[item.field_name] = c)}
          // read_only={this.props.read_only}
          // handleChange={this.handleChange}
          // mutable={true}
          // key={`form_${item.id}`}
          // data={item}
          // defaultValue={this._optionsDefaultValue(item)}
          // getActiveUserProperties={this.props.getActiveUserProperties}
          // editor={this._getEditor(item)}
          , null);
          return /*#__PURE__*/_react["default"].createElement(ImageUpload, {
            ref: function ref(c) {
              return _this.inputs[item.field_name] = c;
            },
            read_only: _this.props.read_only || item.readOnly,
            mutable: true,
            key: "form_".concat(item.id),
            data: item,
            defaultValue: _this._getDefaultValue(item),
            onUploadImage: _this.props.onUploadImage,
            editor: _this._getEditor(item),
            getActiveUserProperties: _this.props.getActiveUserProperties
          });
        default:
          // return this.getSimpleElement(item);
          return null;
      }
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
  (0, _createClass2["default"])(Table, [{
    key: "getInputElement",
    value: function getInputElement(type) {
      // if (item.custom) {
      //   return this.getCustomElement(item);
      // }
      // const Input = FormElements[item.element];
      var Input = _formElements["default"][type];
      // return null;
      return /*#__PURE__*/_react["default"].createElement(Input, {
        hideHeader: true
        // handleChange={this.handleChange}
        // mutable={true}
        // key={`form_${item.id}`}
        ,
        data: {
          options: []
        }
        // defaultValue={this._getDefaultValue(item)}
        // editor={this._getEditor(item)}
        ,
        getActiveUserProperties: this.props.getActiveUserProperties,
        getDataSource: this.props.getDataSource,
        onUploadFile: this.props.onUploadFile,
        onDownloadFile: this.props.onDownloadFile,
        onUploadImage: this.props.onUploadImage,
        getFormSource: this.props.getFormSource
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props,
        _this$props$data2,
        _this$props$data3,
        _this$state$rowLabels3,
        _this$props$data4,
        _this$props$data4$col,
        _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var baseClasses = "SortableItem rfb-item";
      if ((_this$props = this.props) !== null && _this$props !== void 0 && (_this$props$data2 = _this$props.data) !== null && _this$props$data2 !== void 0 && _this$props$data2.pageBreakBefore) {
        baseClasses += " alwaysbreak";
      }
      var totalWidthCount = (_this$props$data3 = this.props.data) === null || _this$props$data3 === void 0 ? void 0 : _this$props$data3.columns.reduce(function (previous, current) {
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
      }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, (_this$props$data4 = this.props.data) === null || _this$props$data4 === void 0 ? void 0 : (_this$props$data4$col = _this$props$data4.columns) === null || _this$props$data4$col === void 0 ? void 0 : _this$props$data4$col.map(function (col) {
        return /*#__PURE__*/_react["default"].createElement("th", {
          scope: "col",
          style: {
            width: _this2.getColumnWidth(totalWidthCount, col.width)
          }
        }, col.text);
      }))), this.renderRows()), !isFixedRow && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: "right"
        }
      }, /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        "class": "btn btn-secondary",
        onClick: this.removeRow,
        style: {
          marginRight: 8,
          display: this.state.inputs.length > 0 ? "initial" : "none"
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
  return Table;
}(_react["default"].Component);
exports["default"] = Table;
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
      var value = defaultValue[i] ? (_defaultValue$i$jInde = defaultValue[i][jIndex]) !== null && _defaultValue$i$jInde !== void 0 ? _defaultValue$i$jInde : "" : "";
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
  console.log("Table getDerivedStateFromProps");
  if (Number(props.data.rows) !== Number(state.rows) || JSON.stringify(props.data.columns) !== JSON.stringify(state.columns) || JSON.stringify(state.rowLabels) !== JSON.stringify(props.data.rowLabels)) {
    console.log("Table default columns/rows changed");
    return {
      rows: Number(props.data.rows),
      columns: props.data.columns,
      defaultValue: state.defaultValue,
      inputs: Table.getInputValues(state.inputs, props.data.columns, Number(props.data.rows), state.rowsAdded, props.data.rowLabels),
      rowsAdded: state.rowsAdded,
      rowLabels: props.data.rowLabels
    };
  }
  if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
    console.log("Table default prop changed", state.defaultValue, props.defaultValue);
    var rowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
    return {
      rows: Number(props.data.rows),
      columns: props.data.columns,
      defaultValue: props.defaultValue,
      inputs: Table.getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), rowsAdded, props.data.rowLabels),
      rowsAdded: rowsAdded,
      rowLabels: props.data.rowLabels
    };
  }
  return state;
});