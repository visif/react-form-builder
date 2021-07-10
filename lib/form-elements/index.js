"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactSelect = _interopRequireDefault(require("react-select"));

var _reactSignatureCanvas = _interopRequireDefault(require("react-signature-canvas"));

var _reactBootstrapSlider = _interopRequireDefault(require("react-bootstrap-slider"));

var _starRating = _interopRequireDefault(require("./star-rating"));

var _headerBar = _interopRequireDefault(require("./header-bar"));

var _datePicker = _interopRequireDefault(require("./date-picker"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

var _componentLabel = _interopRequireDefault(require("./component-label"));

var _myxss = _interopRequireDefault(require("./myxss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var FormElements = {};

var Header = /*#__PURE__*/function (_React$Component) {
  _inherits(Header, _React$Component);

  var _super = _createSuper(Header);

  function Header() {
    _classCallCheck(this, Header);

    return _super.apply(this, arguments);
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
      var classNames = 'static';

      if (this.props.data.bold) {
        classNames += ' bold';
      }

      if (this.props.data.italic) {
        classNames += ' italic';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("h3", {
        className: classNames,
        dangerouslySetInnerHTML: {
          __html: _myxss["default"].process(this.props.data.content)
        }
      }));
    }
  }]);

  return Header;
}(_react["default"].Component);

var Paragraph = /*#__PURE__*/function (_React$Component2) {
  _inherits(Paragraph, _React$Component2);

  var _super2 = _createSuper(Paragraph);

  function Paragraph() {
    _classCallCheck(this, Paragraph);

    return _super2.apply(this, arguments);
  }

  _createClass(Paragraph, [{
    key: "render",
    value: function render() {
      var classNames = 'static';

      if (this.props.data.bold) {
        classNames += ' bold';
      }

      if (this.props.data.italic) {
        classNames += ' italic';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("p", {
        className: classNames,
        dangerouslySetInnerHTML: {
          __html: _myxss["default"].process(this.props.data.content)
        }
      }));
    }
  }]);

  return Paragraph;
}(_react["default"].Component);

var Label = /*#__PURE__*/function (_React$Component3) {
  _inherits(Label, _React$Component3);

  var _super3 = _createSuper(Label);

  function Label() {
    _classCallCheck(this, Label);

    return _super3.apply(this, arguments);
  }

  _createClass(Label, [{
    key: "render",
    value: function render() {
      var classNames = 'static';

      if (this.props.data.bold) {
        classNames += ' bold';
      }

      if (this.props.data.italic) {
        classNames += ' italic';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("label", {
        className: classNames,
        dangerouslySetInnerHTML: {
          __html: _myxss["default"].process(this.props.data.content)
        }
      }));
    }
  }]);

  return Label;
}(_react["default"].Component);

var LineBreak = /*#__PURE__*/function (_React$Component4) {
  _inherits(LineBreak, _React$Component4);

  var _super4 = _createSuper(LineBreak);

  function LineBreak() {
    _classCallCheck(this, LineBreak);

    return _super4.apply(this, arguments);
  }

  _createClass(LineBreak, [{
    key: "render",
    value: function render() {
      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("hr", null));
    }
  }]);

  return LineBreak;
}(_react["default"].Component);

var TextInput = /*#__PURE__*/function (_React$Component5) {
  _inherits(TextInput, _React$Component5);

  var _super5 = _createSuper(TextInput);

  function TextInput(props) {
    var _this;

    _classCallCheck(this, TextInput);

    _this = _super5.call(this, props);
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }

  _createClass(TextInput, [{
    key: "render",
    value: function render() {
      var props = {};
      props.type = 'text';
      props.className = 'form-control';
      props.name = this.props.data.field_name;

      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      if (this.props.read_only) {
        props.disabled = 'disabled';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);

  return TextInput;
}(_react["default"].Component);

var NumberInput = /*#__PURE__*/function (_React$Component6) {
  _inherits(NumberInput, _React$Component6);

  var _super6 = _createSuper(NumberInput);

  function NumberInput(props) {
    var _this2;

    _classCallCheck(this, NumberInput);

    _this2 = _super6.call(this, props);
    _this2.inputField = /*#__PURE__*/_react["default"].createRef();
    return _this2;
  }

  _createClass(NumberInput, [{
    key: "render",
    value: function render() {
      var props = {};
      props.type = 'number';
      props.className = 'form-control';
      props.name = this.props.data.field_name;

      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }

      if (this.props.read_only) {
        props.disabled = 'disabled';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);

  return NumberInput;
}(_react["default"].Component);

var TextArea = /*#__PURE__*/function (_React$Component7) {
  _inherits(TextArea, _React$Component7);

  var _super7 = _createSuper(TextArea);

  function TextArea(props) {
    var _this3;

    _classCallCheck(this, TextArea);

    _this3 = _super7.call(this, props);
    _this3.inputField = /*#__PURE__*/_react["default"].createRef();
    return _this3;
  }

  _createClass(TextArea, [{
    key: "render",
    value: function render() {
      var props = {};
      props.className = 'form-control';
      props.name = this.props.data.field_name;

      if (this.props.read_only) {
        props.disabled = 'disabled';
      }

      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("textarea", props)));
    }
  }]);

  return TextArea;
}(_react["default"].Component);

var Dropdown = /*#__PURE__*/function (_React$Component8) {
  _inherits(Dropdown, _React$Component8);

  var _super8 = _createSuper(Dropdown);

  function Dropdown(props) {
    var _this4;

    _classCallCheck(this, Dropdown);

    _this4 = _super8.call(this, props);
    _this4.inputField = /*#__PURE__*/_react["default"].createRef();
    return _this4;
  }

  _createClass(Dropdown, [{
    key: "render",
    value: function render() {
      var props = {};
      props.className = 'form-control';
      props.name = this.props.data.field_name;

      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }

      if (this.props.read_only) {
        props.disabled = 'disabled';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("select", props, this.props.data.options.map(function (option) {
        var this_key = "preview_".concat(option.key);
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: option.value,
          key: this_key
        }, option.text);
      }))));
    }
  }]);

  return Dropdown;
}(_react["default"].Component);

var Signature = /*#__PURE__*/function (_React$Component9) {
  _inherits(Signature, _React$Component9);

  var _super9 = _createSuper(Signature);

  function Signature(props) {
    var _this5;

    _classCallCheck(this, Signature);

    _this5 = _super9.call(this, props);

    _defineProperty(_assertThisInitialized(_this5), "clear", function () {
      if (_this5.state.defaultValue) {
        _this5.setState({
          defaultValue: ''
        });
      } else if (_this5.canvas.current) {
        _this5.canvas.current.clear();
      }
    });

    _this5.state = {
      defaultValue: props.defaultValue
    };
    _this5.inputField = /*#__PURE__*/_react["default"].createRef();
    _this5.canvas = /*#__PURE__*/_react["default"].createRef();
    return _this5;
  }

  _createClass(Signature, [{
    key: "render",
    value: function render() {
      var defaultValue = this.state.defaultValue;
      var canClear = !!defaultValue;
      var props = {};
      props.type = 'hidden';
      props.name = this.props.data.field_name;

      if (this.props.mutable) {
        props.defaultValue = defaultValue;
        props.ref = this.inputField;
      }

      var pad_props = {}; // umd requires canvasProps={{ width: 400, height: 150 }}

      if (this.props.mutable) {
        pad_props.defaultValue = defaultValue;
        pad_props.ref = this.canvas;
        canClear = !this.props.read_only;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      var sourceDataURL;

      if (defaultValue && defaultValue.length > 0) {
        sourceDataURL = "data:image/png;base64,".concat(defaultValue);
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), this.props.read_only === true || !!sourceDataURL ? /*#__PURE__*/_react["default"].createElement("img", {
        src: sourceDataURL
      }) : /*#__PURE__*/_react["default"].createElement(_reactSignatureCanvas["default"], pad_props), canClear && /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-times clear-signature",
        onClick: this.clear,
        title: "Clear Signature"
      }), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);

  return Signature;
}(_react["default"].Component);

var Tags = /*#__PURE__*/function (_React$Component10) {
  _inherits(Tags, _React$Component10);

  var _super10 = _createSuper(Tags);

  function Tags(props) {
    var _this6;

    _classCallCheck(this, Tags);

    _this6 = _super10.call(this, props);

    _defineProperty(_assertThisInitialized(_this6), "handleChange", function (e) {
      _this6.setState({
        value: e || []
      });
    });

    _this6.inputField = /*#__PURE__*/_react["default"].createRef();
    var defaultValue = props.defaultValue,
        data = props.data;
    _this6.state = {
      value: _this6.getDefaultValue(defaultValue, data.options)
    };
    return _this6;
  }

  _createClass(Tags, [{
    key: "getDefaultValue",
    value: function getDefaultValue(defaultValue, options) {
      if (defaultValue) {
        if (typeof defaultValue === 'string') {
          var vals = defaultValue.split(',').map(function (x) {
            return x.trim();
          });
          return options.filter(function (x) {
            return vals.indexOf(x.value) > -1;
          });
        }

        return options.filter(function (x) {
          return defaultValue.indexOf(x.value) > -1;
        });
      }

      return [];
    } // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };

  }, {
    key: "render",
    value: function render() {
      var options = this.props.data.options.map(function (option) {
        option.label = option.text;
        return option;
      });
      var props = {};
      props.isMulti = true;
      props.name = this.props.data.field_name;
      props.onChange = this.handleChange;
      props.options = options;

      if (!this.props.mutable) {
        props.value = options[0].text;
      } // to show a sample of what tags looks like


      if (this.props.mutable) {
        props.isDisabled = this.props.read_only;
        props.value = this.state.value;
        props.ref = this.inputField;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], props)));
    }
  }]);

  return Tags;
}(_react["default"].Component);

var Checkboxes = /*#__PURE__*/function (_React$Component11) {
  _inherits(Checkboxes, _React$Component11);

  var _super11 = _createSuper(Checkboxes);

  function Checkboxes(props) {
    var _this7;

    _classCallCheck(this, Checkboxes);

    _this7 = _super11.call(this, props);
    _this7.options = {};
    return _this7;
  }

  _createClass(Checkboxes, [{
    key: "render",
    value: function render() {
      var _this8 = this;

      var self = this;
      var classNames = 'custom-control custom-checkbox';

      if (this.props.data.inline) {
        classNames += ' option-inline';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], _extends({
        className: "form-label"
      }, this.props)), this.props.data.options.map(function (option) {
        var this_key = "preview_".concat(option.key);
        var props = {};
        props.name = "option_".concat(option.key);
        props.type = 'checkbox';
        props.value = option.value;

        if (self.props.mutable) {
          props.defaultChecked = self.props.defaultValue !== undefined && self.props.defaultValue.indexOf(option.key) > -1;
        }

        if (_this8.props.read_only) {
          props.disabled = 'disabled';
        }

        return /*#__PURE__*/_react["default"].createElement("div", {
          className: classNames,
          key: this_key
        }, /*#__PURE__*/_react["default"].createElement("input", _extends({
          id: "fid_" + this_key,
          className: "custom-control-input",
          ref: function ref(c) {
            if (c && self.props.mutable) {
              self.options["child_ref_".concat(option.key)] = c;
            }
          }
        }, props)), /*#__PURE__*/_react["default"].createElement("label", {
          className: "custom-control-label",
          htmlFor: "fid_" + this_key
        }, option.text));
      })));
    }
  }]);

  return Checkboxes;
}(_react["default"].Component);

var RadioButtons = /*#__PURE__*/function (_React$Component12) {
  _inherits(RadioButtons, _React$Component12);

  var _super12 = _createSuper(RadioButtons);

  function RadioButtons(props) {
    var _this9;

    _classCallCheck(this, RadioButtons);

    _this9 = _super12.call(this, props);
    _this9.options = {};
    return _this9;
  }

  _createClass(RadioButtons, [{
    key: "render",
    value: function render() {
      var _this10 = this;

      var self = this;
      var classNames = 'custom-control custom-radio';

      if (this.props.data.inline) {
        classNames += ' option-inline';
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], _extends({
        className: "form-label"
      }, this.props)), this.props.data.options.map(function (option) {
        var this_key = "preview_".concat(option.key);
        var props = {};
        props.name = self.props.data.field_name;
        props.type = 'radio';
        props.value = option.value;

        if (self.props.mutable) {
          props.defaultChecked = self.props.defaultValue !== undefined && (self.props.defaultValue.indexOf(option.key) > -1 || self.props.defaultValue.indexOf(option.value) > -1);
        }

        if (_this10.props.read_only) {
          props.disabled = 'disabled';
        }

        return /*#__PURE__*/_react["default"].createElement("div", {
          className: classNames,
          key: this_key
        }, /*#__PURE__*/_react["default"].createElement("input", _extends({
          id: "fid_" + this_key,
          className: "custom-control-input",
          ref: function ref(c) {
            if (c && self.props.mutable) {
              self.options["child_ref_".concat(option.key)] = c;
            }
          }
        }, props)), /*#__PURE__*/_react["default"].createElement("label", {
          className: "custom-control-label",
          htmlFor: "fid_" + this_key
        }, option.text));
      })));
    }
  }]);

  return RadioButtons;
}(_react["default"].Component);

var Image = /*#__PURE__*/function (_React$Component13) {
  _inherits(Image, _React$Component13);

  var _super13 = _createSuper(Image);

  function Image() {
    _classCallCheck(this, Image);

    return _super13.apply(this, arguments);
  }

  _createClass(Image, [{
    key: "render",
    value: function render() {
      var style = this.props.data.center ? {
        textAlign: 'center'
      } : null;
      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses,
        style: style
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), this.props.data.src && /*#__PURE__*/_react["default"].createElement("img", {
        src: this.props.data.src,
        width: this.props.data.width,
        height: this.props.data.height
      }), !this.props.data.src && /*#__PURE__*/_react["default"].createElement("div", {
        className: "no-image"
      }, "No Image"));
    }
  }]);

  return Image;
}(_react["default"].Component);

var Rating = /*#__PURE__*/function (_React$Component14) {
  _inherits(Rating, _React$Component14);

  var _super14 = _createSuper(Rating);

  function Rating(props) {
    var _this11;

    _classCallCheck(this, Rating);

    _this11 = _super14.call(this, props);
    _this11.inputField = /*#__PURE__*/_react["default"].createRef();
    return _this11;
  }

  _createClass(Rating, [{
    key: "render",
    value: function render() {
      var props = {};
      props.name = this.props.data.field_name;
      props.ratingAmount = 5;

      if (this.props.mutable) {
        props.rating = this.props.defaultValue !== undefined ? parseFloat(this.props.defaultValue, 10) : 0;
        props.editing = true;
        props.disabled = this.props.read_only;
        props.ref = this.inputField;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement(_starRating["default"], props)));
    }
  }]);

  return Rating;
}(_react["default"].Component);

var HyperLink = /*#__PURE__*/function (_React$Component15) {
  _inherits(HyperLink, _React$Component15);

  var _super15 = _createSuper(HyperLink);

  function HyperLink() {
    _classCallCheck(this, HyperLink);

    return _super15.apply(this, arguments);
  }

  _createClass(HyperLink, [{
    key: "render",
    value: function render() {
      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        target: "_blank",
        href: this.props.data.href
      }, this.props.data.content)));
    }
  }]);

  return HyperLink;
}(_react["default"].Component);

var Download = /*#__PURE__*/function (_React$Component16) {
  _inherits(Download, _React$Component16);

  var _super16 = _createSuper(Download);

  function Download() {
    _classCallCheck(this, Download);

    return _super16.apply(this, arguments);
  }

  _createClass(Download, [{
    key: "render",
    value: function render() {
      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "".concat(this.props.download_path, "?id=").concat(this.props.data.file_path)
      }, this.props.data.content)));
    }
  }]);

  return Download;
}(_react["default"].Component);

var Camera = /*#__PURE__*/function (_React$Component17) {
  _inherits(Camera, _React$Component17);

  var _super17 = _createSuper(Camera);

  function Camera(props) {
    var _this12;

    _classCallCheck(this, Camera);

    _this12 = _super17.call(this, props);

    _defineProperty(_assertThisInitialized(_this12), "displayImage", function (e) {
      var self = _assertThisInitialized(_this12);

      var target = e.target;
      var file;
      var reader;

      if (target.files && target.files.length) {
        file = target.files[0]; // eslint-disable-next-line no-undef

        reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
          self.setState({
            img: reader.result
          });
        };
      }
    });

    _defineProperty(_assertThisInitialized(_this12), "clearImage", function () {
      _this12.setState({
        img: null
      });
    });

    _this12.state = {
      img: null
    };
    return _this12;
  }

  _createClass(Camera, [{
    key: "render",
    value: function render() {
      var baseClasses = 'SortableItem rfb-item';
      var name = this.props.data.field_name;
      var fileInputStyle = this.state.img ? {
        display: 'none'
      } : null;

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      var sourceDataURL;

      if (this.props.read_only === true && this.props.defaultValue && this.props.defaultValue.length > 0) {
        if (this.props.defaultValue.indexOf(name > -1)) {
          sourceDataURL = this.props.defaultValue;
        } else {
          sourceDataURL = "data:image/png;base64,".concat(this.props.defaultValue);
        }
      }

      console.log('sourceDataURL', sourceDataURL);
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), this.props.read_only === true && this.props.defaultValue && this.props.defaultValue.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("img", {
        src: sourceDataURL
      })) : /*#__PURE__*/_react["default"].createElement("div", {
        className: "image-upload-container"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: fileInputStyle
      }, /*#__PURE__*/_react["default"].createElement("input", {
        name: name,
        type: "file",
        accept: "image/*",
        capture: "camera",
        className: "image-upload",
        onChange: this.displayImage
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "image-upload-control"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn btn-default"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-camera"
      }), " Upload Photo"), /*#__PURE__*/_react["default"].createElement("p", null, "Select an image from your computer or device."))), this.state.img && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("img", {
        src: this.state.img,
        height: "100",
        className: "image-upload-preview"
      }), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn btn-image-clear",
        onClick: this.clearImage
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-times"
      }), " Clear Photo")))));
    }
  }]);

  return Camera;
}(_react["default"].Component);

var Range = /*#__PURE__*/function (_React$Component18) {
  _inherits(Range, _React$Component18);

  var _super18 = _createSuper(Range);

  function Range(props) {
    var _this13;

    _classCallCheck(this, Range);

    _this13 = _super18.call(this, props);

    _defineProperty(_assertThisInitialized(_this13), "changeValue", function (e) {
      var target = e.target;

      _this13.setState({
        value: target.value
      });
    });

    _this13.inputField = /*#__PURE__*/_react["default"].createRef();
    _this13.state = {
      value: props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.default_value, 10)
    };
    return _this13;
  }

  _createClass(Range, [{
    key: "render",
    value: function render() {
      var props = {};
      var name = this.props.data.field_name;
      props.type = 'range';
      props.list = "tickmarks_".concat(name);
      props.min = this.props.data.min_value;
      props.max = this.props.data.max_value;
      props.step = this.props.data.step;
      props.value = this.state.value;
      props.change = this.changeValue;

      if (this.props.mutable) {
        props.ref = this.inputField;
      }

      var datalist = [];

      for (var i = parseInt(props.min_value, 10); i <= parseInt(props.max_value, 10); i += parseInt(props.step, 10)) {
        datalist.push(i);
      }

      var oneBig = 100 / (datalist.length - 1);

      var _datalist = datalist.map(function (d, idx) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          key: "".concat(props.list, "_").concat(idx)
        }, d);
      });

      var visible_marks = datalist.map(function (d, idx) {
        var option_props = {};
        var w = oneBig;

        if (idx === 0 || idx === datalist.length - 1) {
          w = oneBig / 2;
        }

        option_props.key = "".concat(props.list, "_label_").concat(idx);
        option_props.style = {
          width: "".concat(w, "%")
        };

        if (idx === datalist.length - 1) {
          option_props.style = {
            width: "".concat(w, "%"),
            textAlign: 'right'
          };
        }

        return /*#__PURE__*/_react["default"].createElement("label", option_props, d);
      });
      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "range"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "clearfix"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "float-left"
      }, this.props.data.min_label), /*#__PURE__*/_react["default"].createElement("span", {
        className: "float-right"
      }, this.props.data.max_label)), /*#__PURE__*/_react["default"].createElement(_reactBootstrapSlider["default"], props)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "visible_marks"
      }, visible_marks), /*#__PURE__*/_react["default"].createElement("input", {
        name: name,
        value: this.state.value,
        type: "hidden"
      }), /*#__PURE__*/_react["default"].createElement("datalist", {
        id: props.list
      }, _datalist)));
    }
  }]);

  return Range;
}(_react["default"].Component);

FormElements.Header = Header;
FormElements.Paragraph = Paragraph;
FormElements.Label = Label;
FormElements.LineBreak = LineBreak;
FormElements.TextInput = TextInput;
FormElements.NumberInput = NumberInput;
FormElements.TextArea = TextArea;
FormElements.Dropdown = Dropdown;
FormElements.Signature = Signature;
FormElements.Checkboxes = Checkboxes;
FormElements.DatePicker = _datePicker["default"];
FormElements.RadioButtons = RadioButtons;
FormElements.Image = Image;
FormElements.Rating = Rating;
FormElements.Tags = Tags;
FormElements.HyperLink = HyperLink;
FormElements.Download = Download;
FormElements.Camera = Camera;
FormElements.Range = Range;
var _default = FormElements;
exports["default"] = _default;