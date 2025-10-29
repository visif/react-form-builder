"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _UUID = _interopRequireDefault(require("./UUID"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } /**
 * <FixedRowList />
 */
var FixedRowList = function FixedRowList(_ref) {
  var propsElement = _ref.element,
    _ref$preview = _ref.preview,
    preview = _ref$preview === void 0 ? null : _ref$preview,
    updateElement = _ref.updateElement;
  var _useState = (0, _react.useState)(propsElement),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    element = _useState2[0],
    setElement = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    dirty = _useState4[0],
    setDirty = _useState4[1];
  var _setValue = function _setValue(text) {
    return "".concat(text || '').replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };
  var areRowsInSync = (0, _react.useCallback)(function () {
    return Number(element.rows || 1) === element.rowLabels.length;
  }, [element.rows, element.rowLabels.length]);
  var editRow = (0, _react.useCallback)(function (index, key, e) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      var targetValue = e.target.value || '';

      // Ensure rowLabels[index] exists
      if (!newElement.rowLabels[index]) {
        newElement.rowLabels[index] = {
          value: '',
          text: '',
          key: _UUID["default"].uuid()
        };
      }

      // Safely check if value property differs from the generated value
      var currentValue = newElement.rowLabels[index].value || '';
      var currentKeyValue = newElement.rowLabels[index][key] || '';

      // If value is already custom (not auto-generated from text), keep it
      // Otherwise, set it to the new auto-generated value
      var val = currentValue !== _setValue(currentKeyValue) ? currentValue : _setValue(targetValue);

      // Update the properties
      newElement.rowLabels[index][key] = targetValue;
      newElement.rowLabels[index].value = val;
      setDirty(true);
      return newElement;
    });
  }, [_setValue]);
  var updateRow = (0, _react.useCallback)(function () {
    if (dirty) {
      updateElement.call(preview, element);
      setDirty(false);
    }
  }, [dirty, element, preview, updateElement]);
  var addRow = (0, _react.useCallback)(function (index) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      var newRowIndex = index + 1;

      // Add a new row label
      newElement.rowLabels.splice(newRowIndex, 0, {
        value: '',
        text: "Row ".concat(newElement.rowLabels.length + 1),
        key: _UUID["default"].uuid()
      });

      // Update rows count only if it was in sync with rowLabels
      if (Number(newElement.rows || 1) === prevElement.rowLabels.length) {
        newElement.rows = newElement.rowLabels.length;
      }

      // Initialize a new row in childItems if it doesn't exist
      if (!newElement.childItems) {
        newElement.childItems = [];
      }
      if (!newElement.childItems[newRowIndex]) {
        var columnsCount = newElement.childItems[0] ? newElement.childItems[0].length : 0;
        newElement.childItems[newRowIndex] = Array(columnsCount).fill(null);
      }
      return newElement;
    });

    // Handle element creation
    setTimeout(function () {
      var _preview$state;
      // If we can access the preview data
      if (preview !== null && preview !== void 0 && (_preview$state = preview.state) !== null && _preview$state !== void 0 && _preview$state.data && typeof preview.getDataById === 'function') {
        var allFormData = (0, _toConsumableArray2["default"])(preview.state.data);
        var newElements = [];
        var newRowIndex = index + 1;

        // For each column, create new elements
        var columnCount = element.childItems[0] ? element.childItems[0].length : 0;
        var _loop = function _loop() {
          // Find a template element
          var templateElement = null;

          // Look for existing elements in this column
          for (var row = 0; row < element.childItems.length; row++) {
            if (row !== newRowIndex && element.childItems[row] && element.childItems[row][col]) {
              var elementId = element.childItems[row][col];
              var foundElement = preview.getDataById(elementId);
              if (foundElement) {
                templateElement = foundElement;
                break;
              }
            }
          }

          // If we found a template element
          if (templateElement) {
            var elementType = templateElement.element;
            var timestamp = Date.now() + col + newRowIndex;

            // Create a new element
            var newElementData = {
              element: elementType,
              id: "".concat(elementType, "_").concat(timestamp, "_").concat(newRowIndex, "_").concat(col),
              row: newRowIndex,
              col: col,
              parentId: element.id,
              hideLabel: true,
              field_name: "".concat(elementType, "_").concat(newRowIndex, "_").concat(col, "_").concat(timestamp)
            };

            // Copy basic properties
            if (templateElement.label) {
              newElementData.label = templateElement.label;
            }
            if (templateElement.required !== undefined) {
              newElementData.required = templateElement.required;
            }

            // Handle special element types
            if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
              // Create fresh options with unchecked state
              if (templateElement.options && Array.isArray(templateElement.options)) {
                newElementData.options = templateElement.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9)),
                    checked: false,
                    selected: false
                  };
                });
                newElementData.inline = templateElement.inline || false;
              }
            } else if (elementType === 'Dropdown') {
              // Create dropdown options
              if (templateElement.options && Array.isArray(templateElement.options)) {
                newElementData.options = templateElement.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                  };
                });
              }
            } else if (templateElement.options) {
              // Handle other elements with options
              newElementData.options = JSON.parse(JSON.stringify(templateElement.options)).map(function (opt) {
                return _objectSpread(_objectSpread({}, opt), {}, {
                  key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                });
              });
            }

            // Add to our collection
            newElements.push(newElementData);
            element.childItems[newRowIndex][col] = newElementData.id;
          }
        };
        for (var col = 0; col < columnCount; col++) {
          _loop();
        }

        // If we created new elements, update the form data
        if (newElements.length > 0) {
          var updatedData = [].concat((0, _toConsumableArray2["default"])(allFormData), newElements);

          // Try to update state
          try {
            preview.setState({
              data: updatedData
            }, function () {
              updateElement.call(preview, element);
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error updating state:', e);
            updateElement.call(preview, element);
          }
        } else {
          // Just update the element if we can't access data
          updateElement.call(preview, element);
        }
      }
    }, 0);
  }, [element, preview, updateElement]);
  var removeRow = (0, _react.useCallback)(function (index) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);

      // Remove the row label
      newElement.rowLabels.splice(index, 1);

      // Update rows count only if it was in sync with rowLabels
      if (Number(newElement.rows || 1) === prevElement.rowLabels.length) {
        newElement.rows = newElement.rowLabels.length;
      }
      return newElement;
    });

    // Handle element removal
    setTimeout(function () {
      // If we have childItems, also remove the row from there
      if (element.childItems && Array.isArray(element.childItems)) {
        var updatedData = preview !== null && preview !== void 0 && preview.state ? (0, _toConsumableArray2["default"])(preview.state.data) : [];

        // Track elements to remove
        var elementsToRemove = [];

        // Remove the row from childItems
        if (index < element.childItems.length) {
          // Find elements in this row to remove them from data
          if (preview && typeof preview.getDataById === 'function') {
            var rowItems = element.childItems[index];
            if (rowItems) {
              rowItems.forEach(function (elementId) {
                if (elementId) {
                  var foundElement = preview.getDataById(elementId);
                  if (foundElement) {
                    elementsToRemove.push(foundElement);
                  }
                }
              });
            }
          }

          // Remove the row from childItems
          element.childItems.splice(index, 1);

          // Remove elements from data if we have access to it
          if (preview !== null && preview !== void 0 && preview.state && elementsToRemove.length > 0) {
            updatedData = updatedData.filter(function (x) {
              return !elementsToRemove.includes(x);
            });

            // Try to update state
            try {
              preview.setState({
                data: updatedData
              }, function () {
                updateElement.call(preview, element);
              });
              return;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Error updating state:', e);
            }
          }
        }
      }

      // Update the element
      updateElement.call(preview, element);
    }, 0);
  }, [element, preview, updateElement]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "dynamic-option-list"
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    key: "row-labels"
  }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-12"
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Rows")))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "clearfix",
    key: "li_label_x"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-9"
  }, "Row Label"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-3"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "dynamic-options-actions-buttons"
  }, /*#__PURE__*/_react["default"].createElement("button", {
    onClick: function onClick() {
      return addRow(-1);
    },
    className: "btn btn-success"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-plus-circle"
  })))))), propsElement.rowLabels.map(function (option, index) {
    var key = "edit_".concat(option.key);
    return /*#__PURE__*/_react["default"].createElement("li", {
      className: "clearfix",
      key: "li_label_".concat(key)
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-9"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      tabIndex: index + 1,
      key: "input_label_".concat(key),
      className: "form-control",
      style: {
        width: '100%'
      },
      type: "text",
      name: "text_".concat(index),
      placeholder: "Row Label",
      value: option.text,
      onBlur: updateRow,
      onChange: function onChange(e) {
        return editRow(index, 'text', e);
      }
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-3"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dynamic-options-actions-buttons"
    }, /*#__PURE__*/_react["default"].createElement("button", {
      onClick: function onClick() {
        return addRow(index);
      },
      className: "btn btn-success"
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-plus-circle"
    })), /*#__PURE__*/_react["default"].createElement("button", {
      onClick: function onClick() {
        return removeRow(index);
      },
      className: "btn btn-danger"
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-minus-circle"
    }))))));
  })));
};
FixedRowList.propTypes = {
  element: _propTypes["default"].shape({
    rowLabels: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      value: _propTypes["default"].string,
      text: _propTypes["default"].string,
      key: _propTypes["default"].string
    })).isRequired,
    rows: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
    id: _propTypes["default"].string,
    childItems: _propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].string))
  }).isRequired,
  preview: _propTypes["default"].shape({
    state: _propTypes["default"].shape({
      data: _propTypes["default"].arrayOf(_propTypes["default"].shape({}))
    }),
    getDataById: _propTypes["default"].func,
    setState: _propTypes["default"].func
  }),
  updateElement: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = FixedRowList;