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
var DynamicOptionList = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(DynamicOptionList, _React$Component);
  var _super = _createSuper(DynamicOptionList);
  function DynamicOptionList(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DynamicOptionList);
    _this = _super.call(this, props);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    return _this;
  }
  (0, _createClass2["default"])(DynamicOptionList, [{
    key: "_setValue",
    value: function _setValue(text) {
      return "".concat(text).replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
    }
  }, {
    key: "editOption",
    value: function editOption(option_index, e) {
      var this_element = this.state.element;
      var val = this_element.options[option_index].value !== this._setValue(this_element.options[option_index].text) ? this_element.options[option_index].value : this._setValue(e.target.value);
      this_element.options[option_index].text = e.target.value;
      this_element.options[option_index].value = val;
      this.setState({
        element: this_element,
        dirty: true
      });

      // Sync with other elements in the same column immediately if this element is part of a dynamic column
      if (this.props.preview && this.props.element.parentId) {
        this.syncOptionsWithSameColumnElements(this_element.options);
      }
    }
  }, {
    key: "editValue",
    value: function editValue(option_index, e) {
      var this_element = this.state.element;
      var val = e.target.value === '' ? this._setValue(this_element.options[option_index].text) : e.target.value;
      this_element.options[option_index].value = val;
      this.setState({
        element: this_element,
        dirty: true
      });

      // Sync with other elements in the same column immediately if this element is part of a dynamic column
      if (this.props.preview && this.props.element.parentId) {
        this.syncOptionsWithSameColumnElements(this_element.options);
      }
    }

    // eslint-disable-next-line no-unused-vars
  }, {
    key: "editOptionCorrect",
    value: function editOptionCorrect(option_index, e) {
      var this_element = this.state.element;
      if (this_element.options[option_index].hasOwnProperty('correct')) {
        delete this_element.options[option_index].correct;
      } else {
        this_element.options[option_index].correct = true;
      }
      this.setState({
        element: this_element
      });
      this.props.updateElement.call(this.props.preview, this_element);

      // Sync with other elements in the same column if this element is part of a dynamic column
      if (this.props.preview && this.props.element.parentId) {
        this.syncOptionsWithSameColumnElements(this_element.options);
      }
    }
  }, {
    key: "editOptionInfo",
    value: function editOptionInfo(option_index, e) {
      var this_element = this.state.element;
      if (this_element.options[option_index].hasOwnProperty('info')) {
        delete this_element.options[option_index].info;
      } else {
        this_element.options[option_index].info = true;
      }
      this.setState({
        element: this_element
      });
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }, {
    key: "updateOption",
    value: function updateOption() {
      var this_element = this.state.element;
      // to prevent ajax calls with no change
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({
          dirty: false
        });

        // Sync with other elements in the same column if this element is part of a dynamic column
        if (this.props.preview && this.props.element.parentId) {
          this.syncOptionsWithSameColumnElements(this_element.options);
        }
      }
    }
  }, {
    key: "addOption",
    value: function addOption(index) {
      var this_element = this.state.element;
      var nextValue = Math.max.apply(Math, (0, _toConsumableArray2["default"])(this_element.options.map(function (_ref) {
        var value = _ref.value;
        return isNaN(value) ? 0 : parseInt(value);
      }))) + 1;
      this_element.options.splice(index + 1, 0, {
        value: nextValue,
        text: '',
        key: _UUID["default"].uuid()
      });
      this.setState({
        element: this_element,
        dirty: true
      });

      // Sync with other elements in the same column if this element is part of a dynamic column
      if (this.props.preview && this.props.element.parentId) {
        this.syncOptionsWithSameColumnElements(this_element.options);
      }
    }
  }, {
    key: "removeOption",
    value: function removeOption(index) {
      var this_element = this.state.element;
      this_element.options.splice(index, 1);
      this.setState({
        element: this_element,
        dirty: true
      });

      // Sync with other elements in the same column if this element is part of a dynamic column
      if (this.props.preview && this.props.element.parentId) {
        this.syncOptionsWithSameColumnElements(this_element.options);
      }
    }
  }, {
    key: "syncOptionsWithSameColumnElements",
    value: function syncOptionsWithSameColumnElements(options) {
      var _this2 = this;
      // Check if we have the necessary context and if the element is in a dynamic column
      if (!this.props.preview || !this.props.element.parentId) {
        return;
      }

      // Get the parent element and verify it's available
      var parentElement;
      var getDataById = this.props.preview.getDataById || this.props.preview.state && this.props.preview.state.data && function (id) {
        return _this2.props.preview.state.data.find(function (x) {
          return x.id === id;
        });
      };
      if (typeof getDataById === 'function') {
        parentElement = getDataById(this.props.element.parentId);
      }
      if (!parentElement || !parentElement.childItems || parentElement.element !== 'DynamicColumnRow') {
        // Not a dynamic column or cannot access parent data
        return;
      }

      // Get the current element's column index
      var columnIndex = this.props.element.col;
      if (columnIndex === undefined) return;

      // Get the current element's row index
      var currentRowIndex = this.props.element.row;
      if (currentRowIndex === undefined) return;

      // Access update function - check both direct references and nested objects
      var updateElement = typeof this.props.preview.updateElement === 'function' ? this.props.preview.updateElement : this.props.updateElement;
      if (!updateElement) {
        return;
      }

      // Loop through all rows in this column and update options
      parentElement.childItems.forEach(function (row, rowIndex) {
        // Skip the current element's row
        if (rowIndex === currentRowIndex) return;

        // Get the element ID at this position
        var elementId = row[columnIndex];
        if (!elementId) return;

        // Get the element data
        var elementData = getDataById(elementId);

        // Verify it's the same type of element and has options
        if (!elementData || elementData.element !== _this2.props.element.element || !Array.isArray(elementData.options)) {
          return;
        }

        // Create a deep copy of options with all properties preserved
        var newOptions = options.map(function (option, i) {
          // Handle case where target has fewer options than source
          if (i >= elementData.options.length) {
            // Create a new option with all properties from the source
            return _objectSpread(_objectSpread({}, option), {}, {
              key: _UUID["default"].uuid()
            });
          } else {
            // For existing options, preserve the key but copy all other properties
            var key = elementData.options[i].key;
            return _objectSpread(_objectSpread({}, option), {}, {
              key: key || _UUID["default"].uuid(),
              // Explicitly copy these properties to ensure they're synchronized
              info: option.hasOwnProperty('info') ? option.info : undefined,
              correct: option.hasOwnProperty('correct') ? option.correct : undefined
            });
          }
        });

        // Create a new element with updated options
        var updatedElement = _objectSpread(_objectSpread({}, elementData), {}, {
          options: newOptions,
          dirty: true
        });

        // Update the element
        updateElement(updatedElement);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      if (this.state.dirty) {
        this.state.element.dirty = true;
      }

      // Determine if the element is inside a dynamic column
      var isInDynamicColumn = this.props.element && this.props.element.parentId && this.props.element.col !== undefined && this.props.element.row !== undefined;

      // For checkboxes in dynamic columns, we always want to show the Info option
      var shouldShowInfo = this.props.canHaveInfo || isInDynamicColumn && this.props.element.element === 'Checkboxes';

      // For checkboxes in dynamic columns, we always want to show the Correct option too
      var shouldShowCorrect = this.props.canHaveOptionCorrect || isInDynamicColumn && this.props.element.element === 'Checkboxes';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "dynamic-option-list"
      }, /*#__PURE__*/_react["default"].createElement("ul", null, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-5"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Options")), this.props.canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-2"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Value")), shouldShowInfo && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-1"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Info")), shouldShowCorrect && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-1"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Correct")))), this.state.element.options.map(function (option, index) {
        var this_key = "edit_".concat(option.key);
        var val = option.value !== _this3._setValue(option.text) ? option.value : '';
        return /*#__PURE__*/_react["default"].createElement("li", {
          className: "clearfix",
          key: this_key
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-5"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          type: "text",
          className: "form-control",
          style: {
            width: '100%'
          },
          value: option.text,
          onChange: _this3.editOption.bind(_this3, index),
          onBlur: _this3.updateOption.bind(_this3)
        })), _this3.props.canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-2"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          type: "text",
          className: "form-control",
          style: {
            width: '100%'
          },
          value: val,
          onChange: _this3.editValue.bind(_this3, index),
          onBlur: _this3.updateOption.bind(_this3)
        })), _this3.props.canHaveOptionValue && _this3.props.canHaveInfo && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-1"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          className: "form-control",
          type: "checkbox",
          value: "1",
          checked: option.hasOwnProperty('info'),
          onChange: _this3.editOptionInfo.bind(_this3, index)
        })), _this3.props.canHaveOptionValue && _this3.props.canHaveOptionCorrect && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-1"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          className: "form-control",
          type: "checkbox",
          value: "1",
          checked: option.hasOwnProperty('correct'),
          onChange: _this3.editOptionCorrect.bind(_this3, index)
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this3.addOption.bind(_this3, index),
          className: "btn btn-success"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-plus-circle"
        })), index > 0 && /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this3.removeOption.bind(_this3, index),
          className: "btn btn-danger"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-minus-circle"
        }))))));
      })));
    }
  }]);
  return DynamicOptionList;
}(_react["default"].Component);
exports["default"] = DynamicOptionList;