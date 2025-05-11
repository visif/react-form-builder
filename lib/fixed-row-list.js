"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _UUID = _interopRequireDefault(require("./UUID"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FixedRowList = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(FixedRowList, _React$Component);
  var _super = _createSuper(FixedRowList);
  function FixedRowList(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FixedRowList);
    _this = _super.call(this, props);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    return _this;
  }
  (0, _createClass2["default"])(FixedRowList, [{
    key: "_setValue",
    value: function _setValue(text) {
      return "".concat(text || '').replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
    }
  }, {
    key: "editRow",
    value: function editRow(index, key, e) {
      var this_element = this.state.element;

      // Ensure rowLabels[index] exists
      if (!this_element.rowLabels[index]) {
        this_element.rowLabels[index] = {
          value: '',
          text: '',
          key: _UUID["default"].uuid()
        };
      }

      // Safely check if value property differs from the generated value
      var currentValue = this_element.rowLabels[index].value || '';
      var currentKeyValue = this_element.rowLabels[index][key] || '';
      var targetValue = e.target.value || '';

      // If value is already custom (not auto-generated from text), keep it
      // Otherwise, set it to the new auto-generated value
      var val = currentValue !== this._setValue(currentKeyValue) ? currentValue : this._setValue(targetValue);

      // Update the properties
      this_element.rowLabels[index][key] = targetValue;
      this_element.rowLabels[index].value = val;
      this.setState({
        element: this_element,
        dirty: true
      });
    }
  }, {
    key: "updateRow",
    value: function updateRow() {
      var this_element = this.state.element;
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({
          dirty: false
        });
      }
    }
  }, {
    key: "addRow",
    value: function addRow(index) {
      var _this2 = this;
      var this_element = this.state.element;
      var newRowIndex = index + 1;

      // Add a new row label
      this_element.rowLabels.splice(newRowIndex, 0, {
        value: '',
        text: "Row ".concat(this_element.rowLabels.length + 1),
        key: _UUID["default"].uuid()
      });

      // Get a reference to the preview component
      var preview = this.props.preview;

      // Increase the rows count
      var currentRows = Number(this_element.rows || 1);
      this_element.rows = currentRows + 1;

      // Initialize a new row in childItems if it doesn't exist
      if (!this_element.childItems[newRowIndex]) {
        var columnsCount = this_element.childItems[0] ? this_element.childItems[0].length : 0;
        this_element.childItems[newRowIndex] = Array(columnsCount).fill(null);
      }

      // If we can access the preview data
      if (preview && preview.state && preview.state.data && typeof preview.getDataById === 'function') {
        var allFormData = (0, _toConsumableArray2["default"])(preview.state.data);
        var newElements = [];

        // For each column, create new elements
        var columnCount = this_element.childItems[0] ? this_element.childItems[0].length : 0;
        var _loop = function _loop() {
          // Find a template element
          var templateElement = null;

          // Look for existing elements in this column
          for (var row = 0; row < this_element.childItems.length; row++) {
            if (row !== newRowIndex && this_element.childItems[row] && this_element.childItems[row][col]) {
              var elementId = this_element.childItems[row][col];
              var element = preview.getDataById(elementId);
              if (element) {
                templateElement = element;
                break;
              }
            }
          }

          // If we found a template element
          if (templateElement) {
            var elementType = templateElement.element;
            var timestamp = Date.now() + col + newRowIndex;

            // Create a new element
            var newElement = {
              element: elementType,
              id: "".concat(elementType, "_").concat(timestamp, "_").concat(newRowIndex, "_").concat(col),
              row: newRowIndex,
              col: col,
              parentId: this_element.id,
              hideLabel: true,
              field_name: "".concat(elementType, "_").concat(newRowIndex, "_").concat(col, "_").concat(timestamp)
            };

            // Copy basic properties
            if (templateElement.label) newElement.label = templateElement.label;
            if (templateElement.required !== undefined) newElement.required = templateElement.required;

            // Handle special element types
            if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
              // Create fresh options with unchecked state
              if (templateElement.options && Array.isArray(templateElement.options)) {
                newElement.options = templateElement.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9)),
                    checked: false,
                    selected: false
                  };
                });
                newElement.inline = templateElement.inline || false;
              }
            } else if (elementType === 'Dropdown') {
              // Create dropdown options
              if (templateElement.options && Array.isArray(templateElement.options)) {
                newElement.options = templateElement.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                  };
                });
              }
            } else if (templateElement.options) {
              // Handle other elements with options
              newElement.options = JSON.parse(JSON.stringify(templateElement.options)).map(function (opt) {
                return _objectSpread(_objectSpread({}, opt), {}, {
                  key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                });
              });
            }

            // Add to our collection
            newElements.push(newElement);
            this_element.childItems[newRowIndex][col] = newElement.id;
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
              _this2.props.updateElement.call(preview, this_element);
            });
          } catch (e) {
            console.error('Error updating state:', e);
            this.props.updateElement.call(preview, this_element);
          }
        } else {
          // Just update the element if we can't access data
          this.props.updateElement.call(this.props.preview, this_element);
        }
      }
    }
  }, {
    key: "removeRow",
    value: function removeRow(index) {
      var _this3 = this;
      var this_element = this.state.element;

      // Don't allow removing the last row
      if (this_element.rowLabels.length <= 1) {
        console.warn('Cannot remove the last row');
        return;
      }

      // Remove the row label
      this_element.rowLabels.splice(index, 1);

      // If we have childItems, also remove the row from there
      if (this_element.childItems && Array.isArray(this_element.childItems)) {
        // Get a reference to the preview component
        var preview = this.props.preview;
        var updatedData = preview && preview.state ? (0, _toConsumableArray2["default"])(preview.state.data) : [];

        // Track elements to remove
        var elementsToRemove = [];

        // Remove the row from childItems
        if (index < this_element.childItems.length) {
          // Find elements in this row to remove them from data
          if (preview && typeof preview.getDataById === 'function') {
            var rowItems = this_element.childItems[index];
            if (rowItems) {
              rowItems.forEach(function (elementId) {
                if (elementId) {
                  var element = preview.getDataById(elementId);
                  if (element) {
                    elementsToRemove.push(element);
                  }
                }
              });
            }
          }

          // Remove the row from childItems
          this_element.childItems.splice(index, 1);

          // Update rows count
          this_element.rows = this_element.childItems.length;

          // Remove elements from data if we have access to it
          if (preview && preview.state && elementsToRemove.length > 0) {
            updatedData = updatedData.filter(function (x) {
              return !elementsToRemove.includes(x);
            });

            // Try to update state
            try {
              preview.setState({
                data: updatedData
              }, function () {
                _this3.props.updateElement.call(preview, this_element);
              });
              return;
            } catch (e) {
              console.error('Error updating state:', e);
            }
          }
        }
      }

      // Update the element
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
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
        onClick: this.addRow.bind(this, -1),
        className: "btn btn-success"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-plus-circle"
      })))))), this.props.element.rowLabels.map(function (option, index) {
        var this_key = "edit_".concat(option.key);
        var val = option.value !== _this4._setValue(option.text) ? option.value : '';
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("li", {
          className: "clearfix",
          key: "li_label_".concat(this_key)
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-9"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          tabIndex: index + 1,
          key: "input_label_".concat(this_key),
          className: "form-control",
          style: {
            width: '100%'
          },
          type: "text",
          name: "text_".concat(index),
          placeholder: "Row Label",
          value: option.text,
          onBlur: _this4.updateRow.bind(_this4),
          onChange: _this4.editRow.bind(_this4, index, 'text')
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this4.addRow.bind(_this4, index),
          className: "btn btn-success"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-plus-circle"
        })), /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this4.removeRow.bind(_this4, index),
          className: "btn btn-danger"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-minus-circle"
        })))))));
      })));
    }
  }]);
  return FixedRowList;
}(_react["default"].Component);
exports["default"] = FixedRowList;