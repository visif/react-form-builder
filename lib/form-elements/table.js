"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
var getInputValues = function getInputValues() {
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
};
var Table = function Table(props) {
  var _props$data2, _props$data3, _props$data4;
  var tableRef = _react["default"].useRef(null);
  var initialRowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
  var _React$useState = _react["default"].useState(Number(props.data.rows)),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    rows = _React$useState2[0],
    setRows = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(props.data.rowLabels),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    rowLabels = _React$useState4[0],
    setRowLabels = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(props.data.columns),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    columns = _React$useState6[0],
    setColumns = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(props.defaultValue),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    defaultValue = _React$useState8[0],
    setDefaultValue = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), initialRowsAdded, props.data.rowLabels)),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 2),
    inputs = _React$useState0[0],
    setInputs = _React$useState0[1];
  var _React$useState1 = _react["default"].useState(initialRowsAdded),
    _React$useState10 = (0, _slicedToArray2["default"])(_React$useState1, 2),
    rowsAdded = _React$useState10[0],
    setRowsAdded = _React$useState10[1];
  _react["default"].useEffect(function () {
    console.log('Table useEffect - columns/rows check');
    if (Number(props.data.rows) !== Number(rows) || JSON.stringify(props.data.columns) !== JSON.stringify(columns) || JSON.stringify(rowLabels) !== JSON.stringify(props.data.rowLabels)) {
      console.log('Table default columns/rows changed');
      setRows(Number(props.data.rows));
      setColumns(props.data.columns);
      setRowLabels(props.data.rowLabels);
      setInputs(getInputValues(inputs, props.data.columns, Number(props.data.rows), rowsAdded, props.data.rowLabels));
    }
  }, [props.data.rows, props.data.columns, props.data.rowLabels, rows, columns, rowLabels, rowsAdded, inputs]);
  _react["default"].useEffect(function () {
    console.log('Table useEffect - defaultValue check');
    if (JSON.stringify(defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log('Table default prop changed', defaultValue, props.defaultValue);
      var newRowsAdded = (props.defaultValue ? props.defaultValue.length : Number(props.data.rows)) - Number(props.data.rows);
      setRows(Number(props.data.rows));
      setColumns(props.data.columns);
      setDefaultValue(props.defaultValue);
      setRowLabels(props.data.rowLabels);
      setInputs(getInputValues(props.defaultValue, props.data.columns, Number(props.data.rows), newRowsAdded, props.data.rowLabels));
      setRowsAdded(newRowsAdded);
    }
  }, [props.defaultValue, props.data.rows, props.data.columns, props.data.rowLabels, defaultValue]);
  var addRow = _react["default"].useCallback(function () {
    var newRowsAdded = rowsAdded + 1;
    setRowsAdded(newRowsAdded);
    setInputs(getInputValues(inputs, columns, rows, newRowsAdded));
  }, [rowsAdded, inputs, columns, rows]);
  var removeRow = _react["default"].useCallback(function () {
    var newRowsAdded = rowsAdded - 1;
    setRowsAdded(newRowsAdded);
    setInputs(getInputValues(inputs, columns, rows, newRowsAdded));
  }, [rowsAdded, inputs, columns, rows]);
  var handleInputChange = _react["default"].useCallback(function (rowIndex, colIndex, value) {
    setInputs(function (prevInputs) {
      var newInputs = (0, _toConsumableArray2["default"])(prevInputs);
      if (!newInputs[rowIndex]) {
        newInputs[rowIndex] = [];
      }
      newInputs[rowIndex][colIndex] = value;
      return newInputs;
    });
  }, []);
  var getColumnWidth = _react["default"].useCallback(function (totalWidthCount, width) {
    var currentWidth = parseInt(width) ? Number(width) : 1;
    return "".concat(currentWidth / totalWidthCount * 100, "%");
  }, []);
  var renderRows = _react["default"].useCallback(function () {
    var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
    var savedEditor = props.editor;
    var isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }
    var isFixedRow = (rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels.length) > 0;
    var activeRows = isFixedRow ? rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels.length : rows + rowsAdded;
    return /*#__PURE__*/_react["default"].createElement("tbody", null, Array.from(Array(Number(activeRows)).keys()).map(function (i) {
      var _props$data;
      return /*#__PURE__*/_react["default"].createElement("tr", {
        key: 'row' + i
      }, (_props$data = props.data) === null || _props$data === void 0 || (_props$data = _props$data.columns) === null || _props$data === void 0 ? void 0 : _props$data.map(function (j, jIndex) {
        var _inputs$i$jIndex;
        var isLabel = isFixedRow && jIndex === 0;
        if (isLabel) {
          return /*#__PURE__*/_react["default"].createElement("td", {
            key: "cell-".concat(i, "-").concat(jIndex)
          }, /*#__PURE__*/_react["default"].createElement("label", null, rowLabels[i].text));
        }
        var value = inputs[i] ? (_inputs$i$jIndex = inputs[i][jIndex]) !== null && _inputs$i$jIndex !== void 0 ? _inputs$i$jIndex : '' : '';
        return /*#__PURE__*/_react["default"].createElement("td", {
          key: "cell-".concat(i, "-").concat(jIndex)
        }, /*#__PURE__*/_react["default"].createElement("textarea", {
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
            handleInputChange(i, jIndex, event.target.value);
          }
        }));
      }));
    }));
  }, [props, rowLabels, rows, rowsAdded, inputs, handleInputChange]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props !== null && props !== void 0 && (_props$data2 = props.data) !== null && _props$data2 !== void 0 && _props$data2.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  var totalWidthCount = (_props$data3 = props.data) === null || _props$data3 === void 0 ? void 0 : _props$data3.columns.reduce(function (previous, current) {
    return previous + (parseInt(current.width) ? Number(current.width) : 1);
  }, 0);
  var isFixedRow = (rowLabels === null || rowLabels === void 0 ? void 0 : rowLabels.length) > 0;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses,
    key: "table-container-".concat(props.id)
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("table", {
    className: "table table-bordered",
    ref: tableRef,
    key: "table-".concat(props.id)
  }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, (_props$data4 = props.data) === null || _props$data4 === void 0 || (_props$data4 = _props$data4.columns) === null || _props$data4 === void 0 ? void 0 : _props$data4.map(function (col, colIndex) {
    return /*#__PURE__*/_react["default"].createElement("th", {
      key: "header-".concat(colIndex),
      scope: "col",
      style: {
        width: getColumnWidth(totalWidthCount, col.width)
      }
    }, col.text);
  }))), renderRows()), !isFixedRow && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: removeRow,
    style: {
      marginRight: 8,
      display: inputs.length > 0 ? 'initial' : 'none'
    },
    disabled: !isSameEditor
  }, "Remove Row"), /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    className: "btn btn-info",
    disabled: !isSameEditor,
    onClick: addRow
  }, "Add Row"))));
};
Table.propTypes = {
  data: _propTypes["default"].shape({
    rows: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
    columns: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number, _propTypes["default"].array]),
    rowLabels: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      text: _propTypes["default"].string,
      value: _propTypes["default"].string
    })),
    required: _propTypes["default"].bool,
    bold: _propTypes["default"].bool,
    italic: _propTypes["default"].bool,
    label: _propTypes["default"].string
  }).isRequired,
  defaultValue: _propTypes["default"].array,
  read_only: _propTypes["default"].bool,
  editor: _propTypes["default"].shape({
    email: _propTypes["default"].string
  })
};
var _default = exports["default"] = Table;