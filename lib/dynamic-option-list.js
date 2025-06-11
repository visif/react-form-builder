"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
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
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "throttle", function (func, wait) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var now = Date.now();
        var remaining = wait - (now - _this.previousTime);
        if (remaining <= 0 || remaining > wait) {
          if (_this.timeoutId) {
            clearTimeout(_this.timeoutId);
          }
          _this.previousTime = now;
          func.apply((0, _assertThisInitialized2["default"])(_this), args);
        } else if (!_this.timeoutId) {
          _this.timeoutId = setTimeout(function () {
            _this.previousTime = now;
            _this.timeoutId = null;
            func.apply((0, _assertThisInitialized2["default"])(_this), args);
          }, remaining);
        }
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setValue", function (text) {
      return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleOptionChange", _this.throttle(function (optionIndex, _ref) {
      var value = _ref.target.value;
      var element = _this.state.element;
      var newElement = _objectSpread({}, element);
      var val = newElement.options[optionIndex].value !== _this.setValue(newElement.options[optionIndex].text) ? newElement.options[optionIndex].value : _this.setValue(value);
      newElement.options[optionIndex].text = value;
      newElement.options[optionIndex].value = val;
      _this.setState({
        element: newElement,
        dirty: true
      }, function () {
        _this.syncOptionsWithSameColumnElements(newElement.options);
      });
    }, 200));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleValueChange", _this.throttle(function (optionIndex, _ref2) {
      var value = _ref2.target.value;
      var element = _this.state.element;
      var newElement = _objectSpread({}, element);
      var val = value === '' ? _this.setValue(newElement.options[optionIndex].text) : value;
      newElement.options[optionIndex].value = val;
      _this.setState({
        element: newElement,
        dirty: true
      }, function () {
        _this.syncOptionsWithSameColumnElements(newElement.options);
      });
    }, 200));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleOptionCorrect", function (optionIndex) {
      _this.setState(function (prevState) {
        var newElement = _objectSpread({}, prevState.element);
        var option = newElement.options[optionIndex];
        if (Object.prototype.hasOwnProperty.call(option, 'correct')) {
          delete option.correct;
        } else {
          option.correct = true;
        }
        return {
          element: newElement
        };
      }, function () {
        var _this$props = _this.props,
          updateElement = _this$props.updateElement,
          preview = _this$props.preview;
        var element = _this.state.element;
        updateElement.call(preview, element);
        _this.syncOptionsWithSameColumnElements(element.options);
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleOptionInfo", function (optionIndex) {
      _this.setState(function (prevState) {
        var newElement = _objectSpread({}, prevState.element);
        var option = newElement.options[optionIndex];
        if (Object.prototype.hasOwnProperty.call(option, 'info')) {
          delete option.info;
        } else {
          option.info = true;
        }
        return {
          element: newElement
        };
      }, function () {
        var _this$props2 = _this.props,
          updateElement = _this$props2.updateElement,
          preview = _this$props2.preview;
        var element = _this.state.element;
        updateElement.call(preview, element);
        _this.syncOptionsWithSameColumnElements(element.options);
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateOption", function () {
      var _this$props3 = _this.props,
        updateElement = _this$props3.updateElement,
        preview = _this$props3.preview;
      var _this$state = _this.state,
        element = _this$state.element,
        dirty = _this$state.dirty;
      if (dirty) {
        updateElement.call(preview, element);
        _this.setState({
          dirty: false
        }, function () {
          _this.syncOptionsWithSameColumnElements(element.options);
        });
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "addOption", function (index) {
      _this.setState(function (prevState) {
        var newElement = _objectSpread({}, prevState.element);
        var nextValue = Math.max.apply(Math, (0, _toConsumableArray2["default"])(newElement.options.map(function (_ref3) {
          var value = _ref3.value;
          return Number.isNaN(Number(value)) ? 0 : parseInt(value, 10);
        }))) + 1;
        newElement.options.splice(index + 1, 0, {
          value: nextValue,
          text: '',
          key: _UUID["default"].uuid()
        });
        return {
          element: newElement,
          dirty: true
        };
      }, function () {
        var element = _this.state.element;
        _this.syncOptionsWithSameColumnElements(element.options);
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeOption", function (index) {
      _this.setState(function (prevState) {
        var newElement = _objectSpread({}, prevState.element);
        newElement.options.splice(index, 1);
        return {
          element: newElement,
          dirty: true
        };
      }, function () {
        var element = _this.state.element;
        _this.syncOptionsWithSameColumnElements(element.options);
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "syncOptionsWithSameColumnElements", function (options) {
      var _preview$state, _parentElement;
      var _this$props4 = _this.props,
        preview = _this$props4.preview,
        propsElement = _this$props4.element,
        propsUpdateElement = _this$props4.updateElement;
      if (!preview || !propsElement.parentId) {
        return;
      }
      var parentElement;
      var getDataById = preview.getDataById || ((_preview$state = preview.state) === null || _preview$state === void 0 ? void 0 : _preview$state.data) && function (id) {
        return preview.state.data.find(function (x) {
          return x.id === id;
        });
      };
      if (typeof getDataById === 'function') {
        parentElement = getDataById(propsElement.parentId);
      }
      if (!((_parentElement = parentElement) !== null && _parentElement !== void 0 && _parentElement.childItems) || parentElement.element !== 'DynamicColumnRow') {
        return;
      }
      var columnIndex = propsElement.col,
        currentRowIndex = propsElement.row;
      if (columnIndex === undefined || currentRowIndex === undefined) {
        return;
      }
      var updateElement = typeof preview.updateElement === 'function' ? preview.updateElement : propsUpdateElement;
      if (!updateElement) {
        return;
      }
      parentElement.childItems.forEach(function (row, rowIndex) {
        if (rowIndex === currentRowIndex) return;
        var elementId = row[columnIndex];
        if (!elementId) return;
        var elementData = getDataById(elementId);
        if (!elementData || elementData.element !== propsElement.element || !Array.isArray(elementData.options)) {
          return;
        }
        var newOptions = options.map(function (option, i) {
          var _option$info, _option$correct;
          if (i >= elementData.options.length) {
            return _objectSpread(_objectSpread({}, option), {}, {
              key: _UUID["default"].uuid()
            });
          }
          var key = elementData.options[i].key;
          return _objectSpread(_objectSpread({}, option), {}, {
            key: key || _UUID["default"].uuid(),
            info: (_option$info = option.info) !== null && _option$info !== void 0 ? _option$info : false,
            correct: (_option$correct = option.correct) !== null && _option$correct !== void 0 ? _option$correct : false
          });
        });
        var updatedElement = _objectSpread(_objectSpread({}, elementData), {}, {
          options: newOptions,
          dirty: true
        });
        updateElement(updatedElement);
      });
    });
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    _this.previousTime = 0;
    _this.timeoutId = null;
    return _this;
  }

  // Throttle utility function
  (0, _createClass2["default"])(DynamicOptionList, [{
    key: "componentWillUnmount",
    value:
    // Clean up any pending timeouts
    function componentWillUnmount() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state2 = this.state,
        element = _this$state2.element,
        dirty = _this$state2.dirty;
      var _this$props5 = this.props,
        canHaveOptionValue = _this$props5.canHaveOptionValue,
        canHaveInfo = _this$props5.canHaveInfo,
        canHaveOptionCorrect = _this$props5.canHaveOptionCorrect,
        propsElement = _this$props5.element;
      var isInDynamicColumn = !!(propsElement !== null && propsElement !== void 0 && propsElement.parentId && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.col) !== undefined && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.row) !== undefined);
      var shouldShowInfo = canHaveInfo || isInDynamicColumn && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.element) === 'Checkboxes';
      var shouldShowCorrect = canHaveOptionCorrect || isInDynamicColumn && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.element) === 'Checkboxes';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "dynamic-option-list"
      }, /*#__PURE__*/_react["default"].createElement("ul", null, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-5"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Options")), canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-2"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Value")), shouldShowInfo && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-1"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Info")), shouldShowCorrect && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-1"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Correct")))), element.options.map(function (option, index) {
        var itemKey = "edit_".concat(option.key);
        var val = option.value !== _this2.setValue(option.text) ? option.value : '';
        return /*#__PURE__*/_react["default"].createElement("li", {
          className: "clearfix",
          key: itemKey
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
          onChange: function onChange(e) {
            return _this2.handleOptionChange(index, e);
          },
          onBlur: _this2.updateOption
        })), canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-2"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          type: "text",
          className: "form-control",
          style: {
            width: '100%'
          },
          value: val,
          onChange: function onChange(e) {
            return _this2.handleValueChange(index, e);
          },
          onBlur: _this2.updateOption
        })), canHaveOptionValue && canHaveInfo && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-1"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          className: "form-control",
          type: "checkbox",
          value: "1",
          checked: Object.prototype.hasOwnProperty.call(option, 'info') && option.info,
          onChange: function onChange() {
            return _this2.handleOptionInfo(index);
          }
        })), canHaveOptionValue && canHaveOptionCorrect && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-1"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          className: "form-control",
          type: "checkbox",
          value: "1",
          checked: Object.prototype.hasOwnProperty.call(option, 'correct') && option.correct,
          onChange: function onChange() {
            return _this2.handleOptionCorrect(index);
          }
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          onClick: function onClick() {
            return _this2.addOption(index);
          },
          type: "button",
          className: "btn btn-success"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-plus-circle"
        })), index > 0 && /*#__PURE__*/_react["default"].createElement("button", {
          onClick: function onClick() {
            return _this2.removeOption(index);
          },
          type: "button",
          className: "btn btn-danger"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-minus-circle"
        }))))));
      })), dirty && (element.dirty = true));
    }
  }]);
  return DynamicOptionList;
}(_react["default"].Component);
exports["default"] = DynamicOptionList;
(0, _defineProperty2["default"])(DynamicOptionList, "propTypes", {
  element: _propTypes["default"].shape({
    options: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      text: _propTypes["default"].string,
      value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
      key: _propTypes["default"].string
    })).isRequired,
    parentId: _propTypes["default"].string,
    col: _propTypes["default"].number,
    row: _propTypes["default"].number,
    element: _propTypes["default"].string
  }).isRequired,
  data: _propTypes["default"].shape({}),
  updateElement: _propTypes["default"].func,
  preview: _propTypes["default"].shape({
    state: _propTypes["default"].shape({
      data: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        id: _propTypes["default"].string.isRequired
      }))
    }),
    getDataById: _propTypes["default"].func,
    updateElement: _propTypes["default"].func
  }),
  canHaveOptionValue: _propTypes["default"].bool,
  canHaveOptionCorrect: _propTypes["default"].bool,
  canHaveInfo: _propTypes["default"].bool
});
(0, _defineProperty2["default"])(DynamicOptionList, "defaultProps", {
  data: {},
  updateElement: function updateElement() {},
  preview: null,
  canHaveOptionValue: false,
  canHaveOptionCorrect: false,
  canHaveInfo: false
});