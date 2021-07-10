"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _fbemitter = require("fbemitter");

var _formValidator = _interopRequireDefault(require("./form-validator"));

var _formElements = _interopRequireDefault(require("./form-elements"));

var _multiColumn = require("./multi-column");

var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));

var _registry = _interopRequireDefault(require("./stores/registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Image = _formElements["default"].Image,
    Checkboxes = _formElements["default"].Checkboxes,
    Signature = _formElements["default"].Signature,
    Download = _formElements["default"].Download,
    Camera = _formElements["default"].Camera;

var ReactForm = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactForm, _React$Component);

  var _super = _createSuper(ReactForm);

  function ReactForm(props) {
    var _this;

    _classCallCheck(this, ReactForm);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "form", void 0);

    _defineProperty(_assertThisInitialized(_this), "inputs", {});

    _defineProperty(_assertThisInitialized(_this), "answerData", void 0);

    _defineProperty(_assertThisInitialized(_this), "handleRenderSubmit", function () {
      var _this$props = _this.props,
          _this$props$actionNam = _this$props.actionName,
          actionName = _this$props$actionNam === void 0 ? 'Submit' : _this$props$actionNam,
          _this$props$submitBut = _this$props.submitButton,
          submitButton = _this$props$submitBut === void 0 ? false : _this$props$submitBut;
      return submitButton || /*#__PURE__*/_react["default"].createElement("input", {
        type: "submit",
        className: "btn btn-big",
        value: actionName
      });
    });

    _this.answerData = _this._convert(props.answer_data);
    _this.emitter = new _fbemitter.EventEmitter();
    _this.getDataById = _this.getDataById.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ReactForm, [{
    key: "_convert",
    value: function _convert(answers) {
      if (Array.isArray(answers)) {
        var result = {};
        answers.forEach(function (x) {
          if (x.name.indexOf('tags_') > -1) {
            result[x.name] = x.value.map(function (y) {
              return y.value;
            });
          } else {
            result[x.name] = x.value;
          }
        });
        return result;
      }

      return answers || {};
    }
  }, {
    key: "_getDefaultValue",
    value: function _getDefaultValue(item) {
      return this.answerData[item.field_name];
    }
  }, {
    key: "_optionsDefaultValue",
    value: function _optionsDefaultValue(item) {
      var _this2 = this;

      var defaultValue = this._getDefaultValue(item);

      if (defaultValue) {
        return defaultValue;
      }

      var defaultChecked = [];
      item.options.forEach(function (option) {
        if (_this2.answerData["option_".concat(option.key)]) {
          defaultChecked.push(option.key);
        }
      });
      return defaultChecked;
    }
  }, {
    key: "_getItemValue",
    value: function _getItemValue(item, ref) {
      var $item = {
        element: item.element,
        value: ''
      };

      if (item.element === 'Rating') {
        $item.value = ref.inputField.current.state.rating;
      } else if (item.element === 'Tags') {
        $item.value = ref.inputField.current.state.value;
      } else if (item.element === 'DatePicker') {
        $item.value = ref.state.value;
      } else if (item.element === 'Camera') {
        $item.value = ref.state.img ? ref.state.img.replace('data:image/png;base64,', '') : '';
      } else if (ref && ref.inputField && ref.inputField.current) {
        $item = _reactDom["default"].findDOMNode(ref.inputField.current);

        if ($item && typeof $item.value === 'string') {
          $item.value = $item.value.trim();
        }
      }

      return $item;
    }
  }, {
    key: "_isIncorrect",
    value: function _isIncorrect(item) {
      var incorrect = false;

      if (item.canHaveAnswer) {
        var ref = this.inputs[item.field_name];

        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          item.options.forEach(function (option) {
            var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);

            if (option.hasOwnProperty('correct') && !$option.checked || !option.hasOwnProperty('correct') && $option.checked) {
              incorrect = true;
            }
          });
        } else {
          var $item = this._getItemValue(item, ref);

          if (item.element === 'Rating') {
            if ($item.value.toString() !== item.correct) {
              incorrect = true;
            }
          } else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
            incorrect = true;
          }
        }
      }

      return incorrect;
    }
  }, {
    key: "_isInvalid",
    value: function _isInvalid(item) {
      var invalid = false;

      if (item.required === true) {
        var ref = this.inputs[item.field_name];

        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          var checked_options = 0;
          item.options.forEach(function (option) {
            var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);

            if ($option.checked) {
              checked_options += 1;
            }
          });

          if (checked_options < 1) {
            // errors.push(item.label + ' is required!');
            invalid = true;
          }
        } else {
          var $item = this._getItemValue(item, ref);

          if (item.element === 'Rating') {
            if ($item.value === 0) {
              invalid = true;
            }
          } else if ($item.value === undefined || $item.value.length < 1) {
            invalid = true;
          }
        }
      }

      return invalid;
    }
  }, {
    key: "_collect",
    value: function _collect(item) {
      var itemData = {
        name: item.field_name,
        custom_name: item.custom_name || item.field_name
      };
      var ref = this.inputs[item.field_name];

      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        var checked_options = [];
        item.options.forEach(function (option) {
          var $option = _reactDom["default"].findDOMNode(ref.options["child_ref_".concat(option.key)]);

          if ($option.checked) {
            checked_options.push(option.key);
          }
        });
        itemData.value = checked_options;
      } else {
        if (!ref) return null;
        itemData.value = this._getItemValue(item, ref).value;
      }

      return itemData;
    }
  }, {
    key: "_collectFormData",
    value: function _collectFormData(data) {
      var _this3 = this;

      var formData = [];
      data.forEach(function (item) {
        var item_data = _this3._collect(item);

        if (item_data) {
          formData.push(item_data);
        }
      });
      return formData;
    }
  }, {
    key: "_getSignatureImg",
    value: function _getSignatureImg(item) {
      var ref = this.inputs[item.field_name];
      var $canvas_sig = ref.canvas.current;

      if ($canvas_sig) {
        var base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
        var isEmpty = $canvas_sig.isEmpty();

        var $input_sig = _reactDom["default"].findDOMNode(ref.inputField.current);

        if (isEmpty) {
          $input_sig.value = '';
        } else {
          $input_sig.value = base64;
        }
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var errors = [];

      if (!this.props.skip_validations) {
        errors = this.validateForm(); // Publish errors, if any.

        this.emitter.emit('formValidation', errors);
      } // Only submit if there are no errors.


      if (errors.length < 1) {
        var onSubmit = this.props.onSubmit;

        if (onSubmit) {
          var data = this._collectFormData(this.props.data);

          onSubmit(data);
        } else {
          var $form = _reactDom["default"].findDOMNode(this.form);

          $form.submit();
        }
      }
    }
  }, {
    key: "validateForm",
    value: function validateForm() {
      var _this4 = this;

      var errors = [];
      var data_items = this.props.data;

      if (this.props.display_short) {
        data_items = this.props.data.filter(function (i) {
          return i.alternateForm === true;
        });
      }

      data_items.forEach(function (item) {
        if (item.element === 'Signature') {
          _this4._getSignatureImg(item);
        }

        if (_this4._isInvalid(item)) {
          errors.push("".concat(item.label, " is required!"));
        }

        if (_this4.props.validateForCorrectness && _this4._isIncorrect(item)) {
          errors.push("".concat(item.label, " was answered incorrectly!"));
        }
      });
      return errors;
    }
  }, {
    key: "getDataById",
    value: function getDataById(id) {
      var data = this.props.data;
      return data.find(function (x) {
        return x.id === id;
      });
    }
  }, {
    key: "getInputElement",
    value: function getInputElement(item) {
      var _this5 = this;

      if (item.custom) {
        return this.getCustomElement(item);
      }

      var Input = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Input, {
        handleChange: this.handleChange,
        ref: function ref(c) {
          return _this5.inputs[item.field_name] = c;
        },
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        read_only: this.props.read_only,
        defaultValue: this._getDefaultValue(item)
      });
    }
  }, {
    key: "getContainerElement",
    value: function getContainerElement(item, Element) {
      var _this6 = this;

      var controls = item.childItems.map(function (x) {
        return x ? _this6.getInputElement(_this6.getDataById(x)) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
      });
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        controls: controls
      });
    }
  }, {
    key: "getSimpleElement",
    value: function getSimpleElement(item) {
      var Element = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item
      });
    }
  }, {
    key: "getCustomElement",
    value: function getCustomElement(item) {
      var _this7 = this;

      if (!item.component || typeof item.component !== 'function') {
        item.component = _registry["default"].get(item.key);

        if (!item.component) {
          console.error("".concat(item.element, " was not registered"));
        }
      }

      var inputProps = item.forwardRef && {
        handleChange: this.handleChange,
        defaultValue: this._getDefaultValue(item),
        ref: function ref(c) {
          return _this7.inputs[item.field_name] = c;
        }
      };
      return /*#__PURE__*/_react["default"].createElement(_customElement["default"], _extends({
        mutable: true,
        read_only: this.props.read_only,
        key: "form_".concat(item.id),
        data: item
      }, inputProps));
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var data_items = this.props.data;

      if (this.props.display_short) {
        data_items = this.props.data.filter(function (i) {
          return i.alternateForm === true;
        });
      }

      data_items.forEach(function (item) {
        if (item && item.readOnly && item.variableKey && _this8.props.variables[item.variableKey]) {
          _this8.answerData[item.field_name] = _this8.props.variables[item.variableKey];
        }
      });
      var items = data_items.filter(function (x) {
        return !x.parentId;
      }).map(function (item) {
        if (!item) return null;

        switch (item.element) {
          case 'TextInput':
          case 'NumberInput':
          case 'TextArea':
          case 'Dropdown':
          case 'DatePicker':
          case 'RadioButtons':
          case 'Rating':
          case 'Tags':
          case 'Range':
            return _this8.getInputElement(item);

          case 'CustomElement':
            return _this8.getCustomElement(item);

          case 'FourColumnRow':
            return _this8.getContainerElement(item, _multiColumn.FourColumnRow);

          case 'ThreeColumnRow':
            return _this8.getContainerElement(item, _multiColumn.ThreeColumnRow);

          case 'TwoColumnRow':
            return _this8.getContainerElement(item, _multiColumn.TwoColumnRow);

          case 'Signature':
            return /*#__PURE__*/_react["default"].createElement(Signature, {
              ref: function ref(c) {
                return _this8.inputs[item.field_name] = c;
              },
              read_only: _this8.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this8._getDefaultValue(item)
            });

          case 'Checkboxes':
            return /*#__PURE__*/_react["default"].createElement(Checkboxes, {
              ref: function ref(c) {
                return _this8.inputs[item.field_name] = c;
              },
              read_only: _this8.props.read_only,
              handleChange: _this8.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this8._optionsDefaultValue(item)
            });

          case 'Image':
            return /*#__PURE__*/_react["default"].createElement(Image, {
              ref: function ref(c) {
                return _this8.inputs[item.field_name] = c;
              },
              handleChange: _this8.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this8._getDefaultValue(item)
            });

          case 'Download':
            return /*#__PURE__*/_react["default"].createElement(Download, {
              download_path: _this8.props.download_path,
              mutable: true,
              key: "form_".concat(item.id),
              data: item
            });

          case 'Camera':
            return /*#__PURE__*/_react["default"].createElement(Camera, {
              ref: function ref(c) {
                return _this8.inputs[item.field_name] = c;
              },
              read_only: _this8.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this8._getDefaultValue(item)
            });

          default:
            return _this8.getSimpleElement(item);
        }
      });
      var formTokenStyle = {
        display: 'none'
      };
      var backName = this.props.back_name ? this.props.back_name : 'Cancel';
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_formValidator["default"], {
        emitter: this.emitter
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "react-form-builder-form"
      }, /*#__PURE__*/_react["default"].createElement("form", {
        encType: "multipart/form-data",
        ref: function ref(c) {
          return _this8.form = c;
        },
        action: this.props.form_action,
        onSubmit: this.handleSubmit.bind(this),
        method: this.props.form_method
      }, this.props.authenticity_token && /*#__PURE__*/_react["default"].createElement("div", {
        style: formTokenStyle
      }, /*#__PURE__*/_react["default"].createElement("input", {
        name: "utf8",
        type: "hidden",
        value: "\u2713"
      }), /*#__PURE__*/_react["default"].createElement("input", {
        name: "authenticity_token",
        type: "hidden",
        value: this.props.authenticity_token
      }), /*#__PURE__*/_react["default"].createElement("input", {
        name: "task_id",
        type: "hidden",
        value: this.props.task_id
      })), items, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn-toolbar"
      }, !this.props.hide_actions && this.handleRenderSubmit(), !this.props.hide_actions && this.props.back_action && /*#__PURE__*/_react["default"].createElement("a", {
        href: this.props.back_action,
        className: "btn btn-default btn-cancel btn-big"
      }, backName)))));
    }
  }]);

  return ReactForm;
}(_react["default"].Component);

exports["default"] = ReactForm;
ReactForm.defaultProps = {
  validateForCorrectness: false
};