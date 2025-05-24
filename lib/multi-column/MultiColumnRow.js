"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoColumnRow = exports.ThreeColumnRow = exports.FourColumnRow = exports.DynamicColumnRow = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("../form-elements/component-header"));
var _componentLabel = _interopRequireDefault(require("../form-elements/component-label"));
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
var _dustbin = _interopRequireDefault(require("./dustbin"));
var _excluded = ["data", "class_name"],
  _excluded2 = ["data", "class_name"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
    updateElement = props.updateElement;
  var _data$childItems = data.childItems,
    childItems = _data$childItems === void 0 ? [] : _data$childItems,
    pageBreakBefore = data.pageBreakBefore;
  var baseClasses = "SortableItem rfb-item ".concat(pageBreakBefore ? 'alwaysbreak' : '');

  // Check if row labels are defined in data
  var hasRowLabels = Array.isArray(data.rowLabels) && data.rowLabels.length > 0;

  // Function to synchronize changes across a column
  var syncColumnChanges = function syncColumnChanges(rowIndex, columnIndex, elementType, changeData) {
    // Only sync for supported element types
    if (!['Checkboxes', 'RadioButtons', 'Dropdown', 'TextInput', 'NumberInput', 'TextArea', 'DatePicker', 'Signature', 'Signature2', 'FormulaInput', 'DataSource'].includes(elementType)) {
      return;
    }

    // Go through each row
    childItems.forEach(function (row, rIdx) {
      // Skip the row that triggered the change
      if (rIdx === rowIndex) return;
      var itemId = row[columnIndex];
      if (!itemId) return;
      var itemData = getDataById(itemId);
      if (!itemData || itemData.element !== elementType) return;

      // Create a new updated element to apply changes
      var updatedItem = _objectSpread({}, itemData);

      // Apply changes based on element type and what was changed
      if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
        // For checkboxes/radio buttons
        if (changeData.options) {
          // Transfer option selection state but preserve option structure
          updatedItem.options = changeData.options.map(function (newOpt, idx) {
            if (idx < itemData.options.length) {
              return _objectSpread(_objectSpread({}, itemData.options[idx]), {}, {
                text: newOpt.text,
                // Update text
                value: newOpt.value,
                // Update value
                checked: newOpt.checked,
                // Update checked state
                selected: newOpt.selected // Update selected state
              });
            }

            return newOpt; // For new options
          });
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey;
        }
      } else if (elementType === 'Dropdown') {
        // For dropdowns
        if (changeData.options) {
          updatedItem.options = changeData.options.map(function (newOpt, idx) {
            if (idx < itemData.options.length) {
              return _objectSpread(_objectSpread({}, itemData.options[idx]), {}, {
                text: newOpt.text,
                value: newOpt.value
              });
            }
            return newOpt;
          });
        }
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey;
        }
      } else if (elementType === 'DataSource') {
        // For DataSource components
        if (changeData.sourceType !== undefined) {
          updatedItem.sourceType = changeData.sourceType;
        }
        if (changeData.formSource !== undefined) {
          updatedItem.formSource = changeData.formSource;
        }

        // Handle any selected item data
        if (changeData.selectedItem !== undefined) {
          updatedItem.selectedItem = changeData.selectedItem;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Make sure the DataSource is properly initialized
        updatedItem.initialized = true;
      } else if (elementType === 'Signature2') {
        // For Signature2 components
        if (changeData.position !== undefined) {
          updatedItem.position = changeData.position;
        }
        if (changeData.specificRole !== undefined) {
          updatedItem.specificRole = changeData.specificRole;
        }
        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync required property if it exists
        if (changeData.hasOwnProperty('required')) {
          updatedItem.required = changeData.required;
        }

        // Sync readOnly property if it exists
        if (changeData.hasOwnProperty('readOnly')) {
          updatedItem.readOnly = changeData.readOnly;
        }

        // Make sure the Signature2 is properly initialized
        updatedItem.initialized = true;
      } else {
        // For other input types
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey;
        }
      }

      // If we created an updated item, apply the changes
      if (updatedItem && updateElement) {
        updateElement(updatedItem);
      }
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("table", {
    className: "table table-bordered",
    style: {
      borderCollapse: 'collapse'
    }
  }, data.columns && /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, hasRowLabels && /*#__PURE__*/_react["default"].createElement("th", {
    style: {
      width: '150px'
    }
  }), data.columns.map(function (column, columnIndex) {
    return /*#__PURE__*/_react["default"].createElement("th", {
      key: "header_".concat(columnIndex),
      style: {
        textAlign: 'center'
      }
    }, column.text);
  }))), /*#__PURE__*/_react["default"].createElement("tbody", null, childItems.map(function (row, rowIndex) {
    return /*#__PURE__*/_react["default"].createElement("tr", {
      key: "row_".concat(rowIndex)
    }, hasRowLabels && /*#__PURE__*/_react["default"].createElement("td", {
      className: "row-label",
      style: {
        fontWeight: 'bold',
        textAlign: 'right',
        paddingRight: '10px',
        backgroundColor: '#f5f5f5'
      }
    }, data.rowLabels[rowIndex] ? data.rowLabels[rowIndex].text : ''), row.map(function (item, columnIndex) {
      var _controls$rowIndex;
      return /*#__PURE__*/_react["default"].createElement("td", {
        key: "".concat(rowIndex, "_").concat(columnIndex, "_").concat(item || '_'),
        style: {
          paddingLeft: '8px',
          paddingRight: '8px'
        }
      }, controls ? (_controls$rowIndex = controls[rowIndex]) === null || _controls$rowIndex === void 0 ? void 0 : _controls$rowIndex[columnIndex] : /*#__PURE__*/_react["default"].createElement(_dustbin["default"], {
        style: {
          width: '100%'
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
        updateElement: updateElement
      }));
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
 * The number of rows and columns is determined by the data.rows and data.columns properties.
 *
 * @param {Object} props - Component props
 * @param {Object} props.data - Data object containing configuration
 * @param {number} props.data.rows - Number of rows (default: 1)
 * @param {number} props.data.columns - Number of columns (default: 2)
 * @param {string} props.class_name - Optional custom class name
 * @returns {JSX.Element} A MultiColumnRow component with dynamic rows and columns
 */
var DynamicColumnRow = function DynamicColumnRow(_ref2) {
  var _data$columns;
  var _ref2$data = _ref2.data,
    data = _ref2$data === void 0 ? {} : _ref2$data,
    class_name = _ref2.class_name,
    rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded2);
  var rows = Number(data.rows) || 1;
  var columns = ((_data$columns = data.columns) === null || _data$columns === void 0 ? void 0 : _data$columns.length) || 2;
  var defaultClassName = "col-md-".concat(Math.floor(12 / columns));
  var className = "".concat(class_name || defaultClassName, " mb-2");
  if (!data.childItems) {
    data.childItems = Array(rows).fill().map(function () {
      return Array(columns).fill(null);
    });
    data.isContainer = true;
  } else if (!Array.isArray(data.childItems[0])) {
    // Convert existing 1D array to 2D for backward compatibility
    data.childItems = [data.childItems];
  }

  // Initialize rowLabels array if it doesn't exist
  // if (!data.rowLabels) {
  //   data.rowLabels = Array(rows)
  //     .fill()
  //     .map((_, i) => ({
  //       text: `Row ${i + 1}`,
  //       value: `row_${i + 1}`,
  //       key: `row_${Math.random().toString(36).substring(2, 9)}`,
  //     }))
  //   debugger
  // } else if (data.rowLabels?.length > 0 && data.rowLabels.length !== rows) {
  //   const currentLength = data.rowLabels.length
  //   if (currentLength < rows) {
  //     // Add additional row labels if needed
  //     const additionalLabels = Array(rows - currentLength)
  //       .fill()
  //       .map((_, i) => ({
  //         text: `Row ${currentLength + i + 1}`,
  //         value: `row_${currentLength + i + 1}`,
  //         key: `row_${Math.random().toString(36).substring(2, 9)}`,
  //       }))
  //     data.rowLabels = [...data.rowLabels, ...additionalLabels]
  //   } else {
  //     // Remove excess row labels
  //     data.rowLabels = data.rowLabels.slice(0, rows)
  //   }
  // }

  // Ensure childItems array matches the desired dimensions
  if (data.childItems.length !== rows || data.childItems[0].length !== columns) {
    var newChildItems = Array(rows).fill().map(function () {
      return Array(columns).fill(null);
    });

    // Copy over existing items where possible
    data.childItems.forEach(function (row, rowIndex) {
      if (rowIndex < rows) {
        row.forEach(function (item, colIndex) {
          if (colIndex < columns) {
            newChildItems[rowIndex][colIndex] = item;
          }
        });
      }
    });
    data.childItems = newChildItems;
  }
  return /*#__PURE__*/_react["default"].createElement(MultiColumnRow, (0, _extends2["default"])({}, rest, {
    className: className,
    rows: rows,
    data: data
  }));
};
exports.DynamicColumnRow = DynamicColumnRow;
var TwoColumnRow = createColumnRow('col-md-6', 2);
exports.TwoColumnRow = TwoColumnRow;
var ThreeColumnRow = createColumnRow('col-md-4', 3);
exports.ThreeColumnRow = ThreeColumnRow;
var FourColumnRow = createColumnRow('col-md-3', 4);
exports.FourColumnRow = FourColumnRow;