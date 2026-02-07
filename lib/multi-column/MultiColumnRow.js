"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoColumnRow = exports.ThreeColumnRow = exports.FourColumnRow = exports.DynamicColumnRow = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("../form-elements/component-header"));
var _componentLabel = _interopRequireDefault(require("../form-elements/component-label"));
var _useSyncColumnChanges = _interopRequireDefault(require("../hooks/useSyncColumnChanges"));
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
var _dustbin = _interopRequireDefault(require("./dustbin"));
var _excluded = ["data", "class_name"],
  _excluded2 = ["data", "class_name"];
var accepts = [_ItemTypes["default"].BOX, _ItemTypes["default"].CARD];
var MultiColumnRow = function MultiColumnRow(props) {
  var controls = props.controls,
    _props$data = props.data,
    data = _props$data === void 0 ? {} : _props$data,
    editModeOn = props.editModeOn,
    getDataById = props.getDataById,
    setAsChild = props.setAsChild,
    removeChild = props.removeChild,
    seq = props.seq,
    index = props.index,
    updateElement = props.updateElement,
    connectDragSource = props.connectDragSource,
    onSelectChildForm = props.onSelectChildForm,
    openLinkedForm = props.openLinkedForm,
    getFormInfo = props.getFormInfo,
    getFormSource = props.getFormSource;
  var _data$childItems = data.childItems,
    childItems = _data$childItems === void 0 ? [] : _data$childItems,
    pageBreakBefore = data.pageBreakBefore;
  var baseClasses = "SortableItem rfb-item ".concat(pageBreakBefore ? 'alwaysbreak' : '');

  // Check if row labels are defined in data
  var hasRowLabels = Array.isArray(data.rowLabels) && data.rowLabels.length > 0;

  // Use the custom hook for synchronizing column changes
  var syncColumnChanges = (0, _useSyncColumnChanges["default"])(childItems, getDataById, updateElement);

  // Calculate column widths once for the entire component
  var columnWidths = data.columns ? function () {
    var totalWidth = data.columns.reduce(function (sum, col) {
      var width = Number(col.width) || 1;
      return sum + width;
    }, 0);
    var widths = data.columns.map(function (column) {
      var width = Number(column.width) || 1;
      return width / totalWidth * 100;
    });
    return widths;
  }() : [];

  // Render header and ensure a visible drag handle even when header is hidden
  var header = /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props);
  var headerWithHandle = connectDragSource ? connectDragSource( /*#__PURE__*/_react["default"].createElement("div", {
    className: "rfb-drag-handle",
    style: {
      cursor: 'move'
    }
  }, header || /*#__PURE__*/_react["default"].createElement("div", {
    className: "toolbar-header",
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "badge badge-secondary"
  }, (data === null || data === void 0 ? void 0 : data.text) || 'Row'), /*#__PURE__*/_react["default"].createElement("div", {
    className: "toolbar-header-buttons"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    "aria-label": "Drag row",
    title: "Drag row"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-grip-vertical"
  })))))) : header;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, headerWithHandle, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("table", {
    className: "table table-bordered",
    style: {
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      width: '100%'
    }
  }, data.columns && /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, hasRowLabels && /*#__PURE__*/_react["default"].createElement("th", {
    className: "rfb-table-row-header-cell",
    style: {
      width: 'var(--rfb-table-row-header-width, 150px)',
      fontWeight: 'var(--rfb-table-header-font-weight, bold)',
      fontFamily: 'var(--rfb-table-header-font-family, inherit)',
      backgroundColor: '#e9ecef',
      borderBottom: '2px solid #dee2e6'
    }
  }), data.columns.map(function (column, columnIndex) {
    return /*#__PURE__*/_react["default"].createElement("th", {
      key: "header_".concat(columnIndex),
      className: "rfb-table-column-header",
      style: {
        textAlign: 'center',
        fontWeight: 'var(--rfb-table-header-font-weight, bold)',
        fontFamily: 'var(--rfb-table-header-font-family, inherit)',
        backgroundColor: '#e9ecef',
        borderBottom: '2px solid #dee2e6',
        padding: '10px 8px',
        width: "".concat(columnWidths[columnIndex], "%"),
        maxWidth: "".concat(columnWidths[columnIndex], "%"),
        minWidth: "".concat(columnWidths[columnIndex], "%"),
        boxSizing: 'border-box',
        overflow: 'hidden'
      }
    }, column.text, column.required && /*#__PURE__*/_react["default"].createElement("span", {
      className: "label-required badge badge-danger ml-1"
    }, "Required"));
  }))), /*#__PURE__*/_react["default"].createElement("tbody", null, childItems.map(function (row, rowIndex) {
    return /*#__PURE__*/_react["default"].createElement("tr", {
      key: "row_".concat(rowIndex)
    }, hasRowLabels && /*#__PURE__*/_react["default"].createElement("td", {
      className: "row-label rfb-table-row-label",
      style: {
        textAlign: 'right',
        paddingRight: '10px',
        backgroundColor: '#f5f5f5',
        fontWeight: 'var(--rfb-table-row-font-weight, bold)',
        fontFamily: 'var(--rfb-table-row-font-family, inherit)'
      }
    }, data.rowLabels[rowIndex] ? data.rowLabels[rowIndex].text : ''), row.map(function (item, columnIndex) {
      var _controls$rowIndex;
      // Get column width with proper fallback handling
      var columnWidth = 100 / row.length; // Default: equal distribution

      if (data.columns && columnWidths.length > 0 && columnIndex < columnWidths.length) {
        var calculatedWidth = columnWidths[columnIndex];
        if (!Number.isNaN(calculatedWidth) && calculatedWidth > 0) {
          columnWidth = calculatedWidth;
        }
      }
      return /*#__PURE__*/_react["default"].createElement("td", {
        key: "".concat(rowIndex, "_").concat(columnIndex, "_").concat(item || '_'),
        style: {
          paddingLeft: '8px',
          paddingRight: '8px',
          width: "".concat(columnWidth, "%"),
          maxWidth: "".concat(columnWidth, "%"),
          // minWidth: `${columnWidth}%`,
          boxSizing: 'border-box'
          // overflow: 'hidden',
        }
      }, controls ? (_controls$rowIndex = controls[rowIndex]) === null || _controls$rowIndex === void 0 ? void 0 : _controls$rowIndex[columnIndex] : /*#__PURE__*/_react["default"].createElement(_dustbin["default"], (0, _extends2["default"])({
        style: {
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        },
        data: data,
        accepts: accepts,
        items: childItems[rowIndex],
        row: rowIndex,
        col: columnIndex,
        parentIndex: index,
        editModeOn: editModeOn,
        _onDestroy: function _onDestroy() {
          return removeChild(data, rowIndex, columnIndex);
        },
        getDataById: getDataById,
        setAsChild: setAsChild,
        seq: seq,
        syncColumnChanges: syncColumnChanges,
        updateElement: updateElement,
        onSelectChildForm: onSelectChildForm,
        openLinkedForm: openLinkedForm,
        getFormInfo: getFormInfo,
        getFormSource: getFormSource
      }, props)));
    }));
  })))));
};

/**
 * Creates a higher-order component (HOC) for rendering a multi-column row.
 *
 * @param {string} defaultClassName - The default CSS class name to apply to the row.
 * @param {number} numberOfColumns - The number of columns to initialize in the row.
 * @returns {Function} A React functional component that renders a `MultiColumnRow` with the specified properties.
 *
 * The returned component:
 * - Accepts `data`, `class_name`, and other props.
 * - Initializes `data.childItems` as an array of `numberOfColumns` elements if not already defined.
 * - Sets `data.isContainer` to `true` if `data.childItems` is initialized.
 * - Applies the provided `class_name` or falls back to `defaultClassName`.
 */
var createColumnRow = function createColumnRow(defaultClassName, numberOfColumns) {
  var numberOfRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return function (_ref) {
    var _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      class_name = _ref.class_name,
      rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
    var className = "".concat(class_name || defaultClassName, " mb-2");
    var rows = data.rows || numberOfRows;
    if (!data.childItems) {
      data.childItems = Array(rows).fill().map(function () {
        return Array(numberOfColumns).fill(null);
      });
      data.isContainer = true;
    } else if (!Array.isArray(data.childItems[0])) {
      // Convert existing 1D array to 2D for backward compatibility
      data.childItems = [data.childItems];
    }
    return /*#__PURE__*/_react["default"].createElement(MultiColumnRow, (0, _extends2["default"])({}, rest, {
      className: className,
      rows: rows,
      data: data
    }));
  };
};

/**
 * Creates a dynamic column row component that supports any number of rows and columns.
 * Uses the same pattern as createColumnRow for consistency.
 */
var createDynamicColumnRow = function createDynamicColumnRow() {
  return function (_ref2) {
    var _data$columns;
    var _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? {} : _ref2$data,
      class_name = _ref2.class_name,
      rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded2);
    var rows = Number(data.rows) || 1;
    var columns = ((_data$columns = data.columns) === null || _data$columns === void 0 ? void 0 : _data$columns.length) || 2;
    var defaultClassName = "col-md-".concat(Math.floor(12 / columns));
    var className = "".concat(class_name || defaultClassName, " mb-2");

    // Initialize or update childItems to match current rows and columns
    if (!data.childItems) {
      data.childItems = Array(rows).fill().map(function () {
        return Array(columns).fill(null);
      });
      data.isContainer = true;
    } else if (data.childItems.length > 0 && !Array.isArray(data.childItems[0])) {
      // Convert existing 1D array to 2D for backward compatibility
      data.childItems = [data.childItems];
    } else {
      // Update existing childItems to match current structure
      var updatedChildItems = [];

      // Ensure we have the right number of rows
      for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
        var existingRow = data.childItems[rowIndex] || [];
        var newRow = [];

        // Ensure each row has the right number of columns
        for (var colIndex = 0; colIndex < columns; colIndex++) {
          newRow[colIndex] = existingRow[colIndex] || null;
        }
        updatedChildItems.push(newRow);
      }
      data.childItems = updatedChildItems;
    }
    return /*#__PURE__*/_react["default"].createElement(MultiColumnRow, (0, _extends2["default"])({}, rest, {
      className: className,
      rows: rows,
      data: data
    }));
  };
};

// Create the component using the same pattern
var DynamicColumnRow = createDynamicColumnRow();
exports.DynamicColumnRow = DynamicColumnRow;
var TwoColumnRow = createColumnRow('col-md-6', 2);
exports.TwoColumnRow = TwoColumnRow;
var ThreeColumnRow = createColumnRow('col-md-4', 3);
exports.ThreeColumnRow = ThreeColumnRow;
var FourColumnRow = createColumnRow('col-md-3', 4);
exports.FourColumnRow = FourColumnRow;