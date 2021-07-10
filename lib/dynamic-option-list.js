"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _UUID = _interopRequireDefault(require("./UUID"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DynamicOptionList = /*#__PURE__*/function (_React$Component) {
  _inherits(DynamicOptionList, _React$Component);

  var _super = _createSuper(DynamicOptionList);

  function DynamicOptionList(props) {
    var _this;

    _classCallCheck(this, DynamicOptionList);

    _this = _super.call(this, props);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    return _this;
  }

  _createClass(DynamicOptionList, [{
    key: "_setValue",
    value: function _setValue(text) {
      return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
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
    } // eslint-disable-next-line no-unused-vars

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
    }
  }, {
    key: "updateOption",
    value: function updateOption() {
      var this_element = this.state.element; // to prevent ajax calls with no change

      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({
          dirty: false
        });
      }
    }
  }, {
    key: "addOption",
    value: function addOption(index) {
      var this_element = this.state.element;
      this_element.options.splice(index + 1, 0, {
        value: '',
        text: '',
        key: _UUID["default"].uuid()
      });
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }, {
    key: "removeOption",
    value: function removeOption(index) {
      var this_element = this.state.element;
      this_element.options.splice(index, 1);
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.state.dirty) {
        this.state.element.dirty = true;
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "dynamic-option-list"
      }, /*#__PURE__*/_react["default"].createElement("ul", null, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-6"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Options")), this.props.canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-2"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Value")), this.props.canHaveOptionValue && this.props.canHaveOptionCorrect && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-4"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Correct")))), this.props.element.options.map(function (option, index) {
        var this_key = "edit_".concat(option.key);
        var val = option.value !== _this2._setValue(option.text) ? option.value : '';
        return /*#__PURE__*/_react["default"].createElement("li", {
          className: "clearfix",
          key: this_key
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-6"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          tabIndex: index + 1,
          className: "form-control",
          style: {
            width: '100%'
          },
          type: "text",
          name: "text_".concat(index),
          placeholder: "Option text",
          value: option.text,
          onBlur: _this2.updateOption.bind(_this2),
          onChange: _this2.editOption.bind(_this2, index)
        })), _this2.props.canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-2"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          className: "form-control",
          type: "text",
          name: "value_".concat(index),
          value: val,
          onChange: _this2.editValue.bind(_this2, index)
        })), _this2.props.canHaveOptionValue && _this2.props.canHaveOptionCorrect && /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-1"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          className: "form-control",
          type: "checkbox",
          value: "1",
          onChange: _this2.editOptionCorrect.bind(_this2, index),
          checked: option.hasOwnProperty('correct')
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this2.addOption.bind(_this2, index),
          className: "btn btn-success"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-plus-circle"
        })), index > 0 && /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this2.removeOption.bind(_this2, index),
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