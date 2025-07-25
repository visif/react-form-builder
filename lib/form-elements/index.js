"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _reactBootstrapSlider = _interopRequireDefault(require("react-bootstrap-slider"));
var _reactSelect = _interopRequireDefault(require("react-select"));
var _reactSignatureCanvas = _interopRequireDefault(require("react-signature-canvas"));
var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
var _datasource = _interopRequireDefault(require("./datasource"));
var _datePicker = _interopRequireDefault(require("./date-picker"));
var _fileUpload = _interopRequireDefault(require("./fileUpload2"));
var _formLink = _interopRequireDefault(require("./form-link"));
var _formulaInput = _interopRequireDefault(require("./formula-input"));
var _headerBar = _interopRequireDefault(require("./header-bar"));
var _imageUpload = _interopRequireDefault(require("./imageUpload"));
var _myxss = _interopRequireDefault(require("./myxss"));
var _section = _interopRequireDefault(require("./section"));
var _signature = _interopRequireDefault(require("./signature2"));
var _starRating = _interopRequireDefault(require("./star-rating"));
var _table = _interopRequireDefault(require("./table"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormElements = {};
var Header = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Header, _React$Component);
  var _super = _createSuper(Header);
  function Header() {
    (0, _classCallCheck2["default"])(this, Header);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(Header, [{
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
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
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
  (0, _inherits2["default"])(Paragraph, _React$Component2);
  var _super2 = _createSuper(Paragraph);
  function Paragraph() {
    (0, _classCallCheck2["default"])(this, Paragraph);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2["default"])(Paragraph, [{
    key: "render",
    value: function render() {
      var classNames = 'static';
      if (this.props.data.bold) {
        classNames += ' bold';
      }
      if (this.props.data.italic) {
        classNames += ' italic';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
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
  (0, _inherits2["default"])(Label, _React$Component3);
  var _super3 = _createSuper(Label);
  function Label() {
    (0, _classCallCheck2["default"])(this, Label);
    return _super3.apply(this, arguments);
  }
  (0, _createClass2["default"])(Label, [{
    key: "render",
    value: function render() {
      var classNames = 'static';
      if (this.props.data.bold) {
        classNames += ' bold';
      }
      if (this.props.data.italic) {
        classNames += ' italic';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
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
  (0, _inherits2["default"])(LineBreak, _React$Component4);
  var _super4 = _createSuper(LineBreak);
  function LineBreak() {
    (0, _classCallCheck2["default"])(this, LineBreak);
    return _super4.apply(this, arguments);
  }
  (0, _createClass2["default"])(LineBreak, [{
    key: "render",
    value: function render() {
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
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
  (0, _inherits2["default"])(TextInput, _React$Component5);
  var _super5 = _createSuper(TextInput);
  function TextInput(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, TextInput);
    _this = _super5.call(this, props);
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.state = {
      value: props.defaultValue || ''
    };
    return _this;
  }
  (0, _createClass2["default"])(TextInput, [{
    key: "handleChange",
    value: function handleChange(e) {
      var value = e.target.value;
      this.setState({
        value: value
      });
      var _this$props = this.props,
        data = _this$props.data,
        handleChange = _this$props.handleChange;
      var formularKey = data.formularKey;
      if (formularKey && handleChange) {
        handleChange(formularKey, value);
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (this.props.onElementChange) {
        // Create updated data object with the new value
        var updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
          value: value
        });

        // Send it for synchronization across columns
        this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (this.props.data.dirty === undefined || this.props.data.dirty) {
          updatedData.dirty = true;
          if (this.props.updateElement) {
            this.props.updateElement(updatedData);
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var props = {};
      props.type = 'text';
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      props.onChange = this.handleChange;
      props.value = this.state.value;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);
  return TextInput;
}(_react["default"].Component);
var NumberInput = /*#__PURE__*/function (_React$Component6) {
  (0, _inherits2["default"])(NumberInput, _React$Component6);
  var _super6 = _createSuper(NumberInput);
  function NumberInput(props) {
    var _this2;
    (0, _classCallCheck2["default"])(this, NumberInput);
    _this2 = _super6.call(this, props);
    _this2.inputField = /*#__PURE__*/_react["default"].createRef();
    _this2.handleChange = _this2.handleChange.bind((0, _assertThisInitialized2["default"])(_this2));
    _this2.handleKeyPress = _this2.handleKeyPress.bind((0, _assertThisInitialized2["default"])(_this2));
    _this2.state = {
      value: props.defaultValue || ''
    };
    return _this2;
  }
  (0, _createClass2["default"])(NumberInput, [{
    key: "handleKeyPress",
    value: function handleKeyPress(e) {
      // Allow: numbers, decimal point, minus sign, plus sign, basic math operators, and percentage
      var allowedChars = /[0-9.\-+*/()=% ]/;
      var _char = String.fromCharCode(e.which);
      if (!allowedChars.test(_char) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var value = e.target.value;
      this.setState({
        value: value
      });
      var _this$props2 = this.props,
        data = _this$props2.data,
        handleChange = _this$props2.handleChange;
      var formularKey = data.formularKey;
      if (formularKey && handleChange) {
        handleChange(formularKey, value);
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (this.props.onElementChange) {
        // Create updated data object with the new value
        var updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
          value: value
        });

        // Send it for synchronization across columns
        this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (this.props.data.dirty === undefined || this.props.data.dirty) {
          updatedData.dirty = true;
          if (this.props.updateElement) {
            this.props.updateElement(updatedData);
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var props = {};
      props.type = 'number';
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      props.onChange = this.handleChange;
      props.onKeyPress = this.handleKeyPress;
      props.value = this.state.value;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("input", props)));
    }
  }]);
  return NumberInput;
}(_react["default"].Component);
var TextArea = /*#__PURE__*/function (_React$Component7) {
  (0, _inherits2["default"])(TextArea, _React$Component7);
  var _super7 = _createSuper(TextArea);
  function TextArea(props) {
    var _this3;
    (0, _classCallCheck2["default"])(this, TextArea);
    _this3 = _super7.call(this, props);
    _this3.inputField = /*#__PURE__*/_react["default"].createRef();
    _this3.handleChange = _this3.handleChange.bind((0, _assertThisInitialized2["default"])(_this3));
    _this3.state = {
      value: props.defaultValue || ''
    };
    return _this3;
  }
  (0, _createClass2["default"])(TextArea, [{
    key: "handleChange",
    value: function handleChange(e) {
      var value = e.target.value;
      this.setState({
        value: value
      });
      var _this$props3 = this.props,
        data = _this$props3.data,
        handleChange = _this$props3.handleChange;
      var formularKey = data.formularKey;
      if (formularKey && handleChange) {
        handleChange(formularKey, value);
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (this.props.onElementChange) {
        // Create updated data object with the new value
        var updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
          value: value
        });

        // Send it for synchronization across columns
        this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (this.props.data.dirty === undefined || this.props.data.dirty) {
          updatedData.dirty = true;
          if (this.props.updateElement) {
            this.props.updateElement(updatedData);
          }
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var props = {};
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      props.minRows = 3;
      props.onChange = this.handleChange;
      props.value = this.state.value;
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement(_reactTextareaAutosize["default"], props)));
    }
  }]);
  return TextArea;
}(_react["default"].Component);
var Dropdown = /*#__PURE__*/function (_React$Component8) {
  (0, _inherits2["default"])(Dropdown, _React$Component8);
  var _super8 = _createSuper(Dropdown);
  function Dropdown(props) {
    var _this4;
    (0, _classCallCheck2["default"])(this, Dropdown);
    _this4 = _super8.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this4), "handleChange", function (e) {
      var constValue = e.target.value;
      _this4.setState({
        value: constValue
      });
      var _this4$props = _this4.props,
        data = _this4$props.data,
        handleChange = _this4$props.handleChange;
      var formularKey = data.formularKey;
      if (formularKey && handleChange) {
        handleChange(formularKey, constValue);
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (_this4.props.onElementChange) {
        // Create updated data object with the new value
        var updatedData = _objectSpread(_objectSpread({}, _this4.props.data), {}, {
          value: constValue
        });

        // Send it for synchronization across columns
        _this4.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        // This makes changes visible in edit mode instantly
        if (_this4.props.data.dirty === undefined || _this4.props.data.dirty) {
          updatedData.dirty = true;
          if (_this4.props.updateElement) {
            _this4.props.updateElement(updatedData);
          }
        }
      }
    });
    _this4.inputField = /*#__PURE__*/_react["default"].createRef();
    _this4.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
    return _this4;
  }
  (0, _createClass2["default"])(Dropdown, [{
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var props = {};
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      props.value = this.state.value;
      props.onChange = this.handleChange;
      if (this.props.mutable) {
        props.defaultValue = this.state.value;
        props.ref = this.inputField;
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("select", props, /*#__PURE__*/_react["default"].createElement("option", {
        value: "",
        key: "default-0"
      }, "Please Select"), this.props.data.options.map(function (option) {
        var this_key = "preview_".concat(option.key);
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: option.value,
          key: this_key
        }, option.text);
      }))));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
        return {
          defaultValue: props.defaultValue,
          value: props.defaultValue
        };
      }
      return state;
    }
  }]);
  return Dropdown;
}(_react["default"].Component);
var Signature = /*#__PURE__*/function (_React$Component9) {
  (0, _inherits2["default"])(Signature, _React$Component9);
  var _super9 = _createSuper(Signature);
  function Signature(props) {
    var _this5;
    (0, _classCallCheck2["default"])(this, Signature);
    _this5 = _super9.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this5), "clear", function () {
      if (_this5.state.defaultValue) {
        _this5.setState({
          defaultValue: ''
        });

        // Immediately apply changes to this component's data when clearing signature
        if (_this5.props.onElementChange) {
          var updatedData = _objectSpread(_objectSpread({}, _this5.props.data), {}, {
            value: ''
          });
          _this5.props.onElementChange(updatedData);
          if (_this5.props.data.dirty === undefined || _this5.props.data.dirty) {
            updatedData.dirty = true;
            if (_this5.props.updateElement) {
              _this5.props.updateElement(updatedData);
            }
          }
        }
      } else if (_this5.canvas.current) {
        _this5.canvas.current.clear();
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this5), "handleSignatureChange", function () {
      // Only trigger if canvas is available
      if (!_this5.canvas.current) return;

      // Get the signature data
      var signatureData = _this5.canvas.current.toDataURL().split(',')[1];

      // If onElementChange is provided, call it to synchronize changes across columns
      if (_this5.props.onElementChange) {
        var updatedData = _objectSpread(_objectSpread({}, _this5.props.data), {}, {
          value: signatureData
        });
        _this5.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (_this5.props.data.dirty === undefined || _this5.props.data.dirty) {
          updatedData.dirty = true;
          if (_this5.props.updateElement) {
            _this5.props.updateElement(updatedData);
          }
        }
      }
      _this5.setState({
        defaultValue: signatureData
      });
    });
    _this5.state = {
      defaultValue: props.defaultValue
    };
    _this5.inputField = /*#__PURE__*/_react["default"].createRef();
    _this5.canvas = /*#__PURE__*/_react["default"].createRef();
    return _this5;
  }
  (0, _createClass2["default"])(Signature, [{
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var defaultValue = this.state.defaultValue;
      var canClear = !!defaultValue;
      var props = {};
      props.type = 'hidden';
      props.name = this.props.data.field_name;
      if (this.props.mutable) {
        props.defaultValue = defaultValue;
        props.ref = this.inputField;
      }
      var pad_props = {};
      // umd requires canvasProps={{ width: 400, height: 150 }}
      if (this.props.mutable) {
        pad_props.defaultValue = defaultValue;
        pad_props.ref = this.canvas;
        pad_props.onEnd = this.handleSignatureChange;
        canClear = !this.props.read_only || isSameEditor;
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
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
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), this.props.read_only === true || !isSameEditor || !!sourceDataURL ? /*#__PURE__*/_react["default"].createElement("img", {
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
  (0, _inherits2["default"])(Tags, _React$Component10);
  var _super10 = _createSuper(Tags);
  function Tags(props) {
    var _this6;
    (0, _classCallCheck2["default"])(this, Tags);
    _this6 = _super10.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this6), "handleChange", function (e) {
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
  (0, _createClass2["default"])(Tags, [{
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
    }

    // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };
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

      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      if (this.props.mutable) {
        // props.isDisabled = this.props.read_only;
        props.isDisabled = !!(this.props.read_only || !isSameEditor);
        props.value = this.state.value;
        props.ref = this.inputField;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], props)));
    }
  }]);
  return Tags;
}(_react["default"].Component);
var Checkboxes = /*#__PURE__*/function (_React$Component11) {
  (0, _inherits2["default"])(Checkboxes, _React$Component11);
  var _super11 = _createSuper(Checkboxes);
  function Checkboxes(props) {
    var _this7;
    (0, _classCallCheck2["default"])(this, Checkboxes);
    _this7 = _super11.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this7), "getActiveValue", function (values, key) {
      return values === null || values === void 0 ? void 0 : values.find(function (item) {
        return item.key === key;
      });
    });
    _this7.options = {};
    _this7.infos = {};
    _this7.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
    return _this7;
  }
  (0, _createClass2["default"])(Checkboxes, [{
    key: "render",
    value: function render() {
      var _this8 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }

      // Add debugging
      console.log('Checkboxes Debug:', {
        userProperties: userProperties,
        savedEditor: savedEditor,
        isSameEditor: isSameEditor,
        hasDCCRole: userProperties === null || userProperties === void 0 ? void 0 : userProperties.hasDCCRole,
        readOnly: this.props.read_only,
        finalDisabled: this.props.read_only || !isSameEditor
      });
      var self = this;
      var classNames = 'custom-control custom-checkbox';
      if (this.props.data.inline) {
        classNames += ' option-inline';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
        className: "form-label"
      }, this.props)), this.props.data.options.map(function (option) {
        var _answerItem$info;
        var this_key = "preview_".concat(option.key);
        var props = {};
        props.name = "option_".concat(option.key);
        props.type = 'checkbox';
        props.value = option.value;

        // Check if the option is selected either from state or option properties
        var answerItem = self.getActiveValue(self.state.value, option.key);
        var isCheckedInOptions = option.checked || option.selected;
        if (self.props.mutable) {
          var _ref, _answerItem$value;
          props.checked = (_ref = (_answerItem$value = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value !== void 0 ? _answerItem$value : isCheckedInOptions) !== null && _ref !== void 0 ? _ref : false;
        }
        if (_this8.props.read_only || !isSameEditor) {
          props.disabled = 'disabled';
        }
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: classNames,
          key: this_key,
          style: {
            display: 'flex',
            alignItems: 'center'
          }
        }, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({
          id: "fid_".concat(this_key),
          className: "custom-control-input",
          ref: function ref(c) {
            if (c && self.props.mutable) {
              self.options["child_ref_".concat(option.key)] = c;
            }
          },
          onChange: function onChange() {
            // Remove the isSameEditor check here since it's already handled by the disabled prop
            self.setState(function (current) {
              var activeVal = self.getActiveValue(current && current.value, option.key);
              var newActiveVal = activeVal ? _objectSpread(_objectSpread({}, activeVal), {}, {
                value: !activeVal.value
              }) : {
                key: option.key,
                value: true,
                info: ''
              };
              if (!current) {
                return current;
              }
              var newValue = _objectSpread(_objectSpread({}, current), {}, {
                value: [].concat((0, _toConsumableArray2["default"])((current.value || []).filter(function (item) {
                  return item.key !== option.key;
                })), [newActiveVal])
              });

              // If we're in a dynamic column and this is a UI-only change (selection)
              // We need to update just this component's internal state without syncing to other rows
              var isInDynamicColumn = self.props.data.parentId && self.props.data.row !== undefined && self.props.data.col !== undefined;

              // Always update the local element state for immediate visual feedback
              if (self.props.updateElement) {
                // Apply the checked state to just this element's data
                var updatedData = _objectSpread(_objectSpread({}, self.props.data), {}, {
                  dirty: true,
                  value: newValue.value
                });

                // Update the local options to show selection visually
                // This only affects THIS element, not others in the column
                var localOptions = self.props.data.options.map(function (opt) {
                  var _self$getActiveValue;
                  return _objectSpread(_objectSpread({}, opt), {}, {
                    checked: opt.key === option.key ? !(activeVal !== null && activeVal !== void 0 && activeVal.value) : ((_self$getActiveValue = self.getActiveValue(newValue.value, opt.key)) === null || _self$getActiveValue === void 0 ? void 0 : _self$getActiveValue.value) || false
                  });
                });
                updatedData.options = localOptions;

                // Update just this element
                self.props.updateElement(updatedData);
              }

              // If onElementChange is provided, but we avoid sending selection state
              if (self.props.onElementChange && isInDynamicColumn) {
                // For selection changes in dynamic columns, we don't want to sync the selection state
                // but we still need to notify the system that a change happened for other purposes
                // Create a copy that doesn't modify the selection state
                var updatedDataForSync = _objectSpread({}, self.props.data);

                // Mark this as a selection-only change that shouldn't be synced
                updatedDataForSync._selectionChangeOnly = true;

                // Notify the system about the change, but without selection state changes
                self.props.onElementChange(updatedDataForSync);
              }
              return newValue;
            });
          }
        }, props)), /*#__PURE__*/_react["default"].createElement("label", {
          className: "custom-control-label",
          htmlFor: "fid_".concat(this_key)
        }, option.text), props.checked && option.info && /*#__PURE__*/_react["default"].createElement("textarea", {
          id: "fid_".concat(this_key, "_info"),
          type: "text",
          className: "form-control",
          style: {
            width: 'auto',
            marginLeft: 16,
            minHeight: '60px',
            // height: 'calc(1.5em + .5rem)',
            marginBottom: 4
          },
          rows: 2,
          defaultValue: (_answerItem$info = answerItem === null || answerItem === void 0 ? void 0 : answerItem.info) !== null && _answerItem$info !== void 0 ? _answerItem$info : '',
          ref: function ref(c) {
            if (c && self.props.mutable) {
              self.infos["child_ref_".concat(option.key, "_info")] = c;
            }
          }
        }));
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
        return {
          defaultValue: props.defaultValue,
          value: props.defaultValue
        };
      }
      return state;
    }
  }]);
  return Checkboxes;
}(_react["default"].Component);
var RadioButtons = /*#__PURE__*/function (_React$Component12) {
  (0, _inherits2["default"])(RadioButtons, _React$Component12);
  var _super12 = _createSuper(RadioButtons);
  function RadioButtons(props) {
    var _this9;
    (0, _classCallCheck2["default"])(this, RadioButtons);
    _this9 = _super12.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this9), "getActiveValue", function (values, key) {
      return values === null || values === void 0 ? void 0 : values.find(function (item) {
        return item.key === key;
      });
    });
    _this9.options = {};
    _this9.infos = {};
    _this9.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
    return _this9;
  }
  (0, _createClass2["default"])(RadioButtons, [{
    key: "render",
    value: function render() {
      var _this10 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }

      // Add debugging for RadioButtons
      console.log('RadioButtons Debug:', {
        userProperties: userProperties,
        savedEditor: savedEditor,
        isSameEditor: isSameEditor,
        hasDCCRole: userProperties === null || userProperties === void 0 ? void 0 : userProperties.hasDCCRole,
        readOnly: this.props.read_only,
        finalDisabled: this.props.read_only || !isSameEditor
      });
      var self = this;
      var classNames = 'custom-control custom-radio';
      if (this.props.data.inline) {
        classNames += ' option-inline';
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      var _this$props4 = this.props,
        data = _this$props4.data,
        handleChange = _this$props4.handleChange;
      var formularKey = data.formularKey;

      // Create unique name for RadioButtons in multi-column layout
      var isInDynamicColumn = this.props.data.parentId && this.props.data.row !== undefined && this.props.data.col !== undefined;
      var uniqueName = isInDynamicColumn ? "".concat(this.props.data.parentId, "_row").concat(this.props.data.row, "_col").concat(this.props.data.col, "_").concat(this.props.data.field_name) : this.props.data.field_name;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
        className: "form-label"
      }, this.props)), this.props.data.options.map(function (option) {
        var _answerItem$info2;
        var this_key = "preview_".concat(option.key);
        var props = {};
        props.name = uniqueName; // Use unique name instead of field_name

        props.type = 'radio';
        props.value = option.value;

        // Check if the option is selected either from state or option properties
        var answerItem = self.getActiveValue(self.state.value, option.key);
        var isCheckedInOptions = option.checked || option.selected;
        if (self.props.mutable) {
          var _ref2, _answerItem$value2;
          props.checked = (_ref2 = (_answerItem$value2 = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value2 !== void 0 ? _answerItem$value2 : isCheckedInOptions) !== null && _ref2 !== void 0 ? _ref2 : false;
        }
        if (_this10.props.read_only || !isSameEditor) {
          props.disabled = 'disabled';
        }
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: classNames,
          key: this_key,
          style: {
            display: 'flex',
            alignItems: 'center'
          }
        }, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({
          id: "fid_".concat(this_key),
          className: "custom-control-input",
          ref: function ref(c) {
            if (c && self.props.mutable) {
              self.options["child_ref_".concat(option.key)] = c;
            }
          },
          onClick: function onClick() {
            // Remove the isSameEditor check here since it's already handled by the disabled prop
            self.setState(function (current) {
              if (formularKey && handleChange) {
                handleChange(formularKey, option.value);
              }

              // Check if this option is already selected
              var currentActiveValue = self.getActiveValue(current === null || current === void 0 ? void 0 : current.value, option.key);
              var isCurrentlySelected = (currentActiveValue === null || currentActiveValue === void 0 ? void 0 : currentActiveValue.value) === true;
              var newValue;
              if (isCurrentlySelected) {
                // If already selected, deselect it (empty array)
                newValue = _objectSpread(_objectSpread({}, current), {}, {
                  value: [] // Clear selection
                });
              } else {
                // If not selected, select this option
                newValue = _objectSpread(_objectSpread({}, current), {}, {
                  value: [{
                    key: option.key,
                    value: true,
                    info: ''
                  }]
                });
              }

              // Always update the local element state for immediate visual feedback
              if (self.props.updateElement) {
                // Apply the checked state to just this element's data
                var updatedData = _objectSpread(_objectSpread({}, self.props.data), {}, {
                  dirty: true,
                  value: newValue.value
                });

                // Update the local options to show selection visually
                // This only affects THIS element, not others in the column
                var localOptions = self.props.data.options.map(function (opt) {
                  return _objectSpread(_objectSpread({}, opt), {}, {
                    checked: isCurrentlySelected ? false : opt.key === option.key,
                    selected: isCurrentlySelected ? false : opt.key === option.key
                  });
                });
                updatedData.options = localOptions;

                // Update just this element
                self.props.updateElement(updatedData);
              }

              // If onElementChange is provided and we're in a dynamic column
              if (self.props.onElementChange && isInDynamicColumn) {
                // For selection changes in dynamic columns, we don't want to sync the selection state
                // but we still need to notify the system that a change happened for other purposes
                var updatedDataForSync = _objectSpread({}, self.props.data);

                // Mark this as a selection-only change that shouldn't be synced
                updatedDataForSync._selectionChangeOnly = true;

                // Notify the system about the change, but without selection state changes
                self.props.onElementChange(updatedDataForSync);
              }
              return newValue;
            });
          }
        }, props)), /*#__PURE__*/_react["default"].createElement("label", {
          className: "custom-control-label",
          htmlFor: "fid_".concat(this_key)
        }, option.text), props.checked && option.info && /*#__PURE__*/_react["default"].createElement("textarea", {
          id: "fid_".concat(this_key, "_info"),
          type: "text",
          className: "form-control",
          style: {
            width: 'auto',
            marginLeft: 16,
            minHeight: '60px'
            // height: 'calc(1.5em + .5rem)',
          },

          rows: 2,
          defaultValue: (_answerItem$info2 = answerItem === null || answerItem === void 0 ? void 0 : answerItem.info) !== null && _answerItem$info2 !== void 0 ? _answerItem$info2 : '',
          ref: function ref(c) {
            if (c && self.props.mutable) {
              self.infos["child_ref_".concat(option.key, "_info")] = c;
            }
          }
        }));
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
        return {
          defaultValue: props.defaultValue,
          value: props.defaultValue
        };
      }
      return state;
    }
  }]);
  return RadioButtons;
}(_react["default"].Component);
var Image = function Image(props) {
  var style = props.data.center ? {
    textAlign: 'center'
  } : null;
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses,
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), props.data.src && /*#__PURE__*/_react["default"].createElement("img", {
    style: {
      maxWidth: '100%',
      height: 'auto'
    },
    src: props.data.src,
    width: props.data.width,
    height: props.data.height
  }), !props.data.src && /*#__PURE__*/_react["default"].createElement("div", {
    className: "no-image"
  }, "No Image"));
};
var Rating = /*#__PURE__*/function (_React$Component13) {
  (0, _inherits2["default"])(Rating, _React$Component13);
  var _super13 = _createSuper(Rating);
  function Rating(props) {
    var _this11;
    (0, _classCallCheck2["default"])(this, Rating);
    _this11 = _super13.call(this, props);
    _this11.inputField = /*#__PURE__*/_react["default"].createRef();
    return _this11;
  }
  (0, _createClass2["default"])(Rating, [{
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var props = {};
      props.name = this.props.data.field_name;
      props.ratingAmount = 5;
      if (this.props.mutable) {
        props.rating = this.props.defaultValue !== undefined ? parseFloat(this.props.defaultValue, 10) : 0;
        props.editing = true;
        // props.disabled = this.props.read_only ||;
        props.disabled = !!(this.props.read_only || !isSameEditor);
        props.ref = this.inputField;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement(_starRating["default"], props)));
    }
  }]);
  return Rating;
}(_react["default"].Component);
var HyperLink = /*#__PURE__*/function (_React$Component14) {
  (0, _inherits2["default"])(HyperLink, _React$Component14);
  var _super14 = _createSuper(HyperLink);
  function HyperLink() {
    (0, _classCallCheck2["default"])(this, HyperLink);
    return _super14.apply(this, arguments);
  }
  (0, _createClass2["default"])(HyperLink, [{
    key: "render",
    value: function render() {
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement("a", {
        target: "_blank",
        href: this.props.data.href,
        rel: "noreferrer"
      }, this.props.data.content)));
    }
  }]);
  return HyperLink;
}(_react["default"].Component);
var Download = /*#__PURE__*/function (_React$Component15) {
  (0, _inherits2["default"])(Download, _React$Component15);
  var _super15 = _createSuper(Download);
  function Download() {
    (0, _classCallCheck2["default"])(this, Download);
    return _super15.apply(this, arguments);
  }
  (0, _createClass2["default"])(Download, [{
    key: "render",
    value: function render() {
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "".concat(this.props.download_path, "?id=").concat(this.props.data.file_path)
      }, this.props.data.content)));
    }
  }]);
  return Download;
}(_react["default"].Component);
var Camera = /*#__PURE__*/function (_React$Component16) {
  (0, _inherits2["default"])(Camera, _React$Component16);
  var _super16 = _createSuper(Camera);
  function Camera(props) {
    var _this12;
    (0, _classCallCheck2["default"])(this, Camera);
    _this12 = _super16.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this12), "displayImage", function (e) {
      var self = (0, _assertThisInitialized2["default"])(_this12);
      var target = e.target;
      var file;
      var reader;
      if (target.files && target.files.length) {
        file = target.files[0];
        // eslint-disable-next-line no-undef
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          self.setState({
            img: reader.result
          });
        };
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this12), "clearImage", function () {
      _this12.setState({
        img: null
      });
    });
    _this12.state = {
      img: null
    };
    return _this12;
  }
  (0, _createClass2["default"])(Camera, [{
    key: "render",
    value: function render() {
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
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
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
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
var Range = /*#__PURE__*/function (_React$Component17) {
  (0, _inherits2["default"])(Range, _React$Component17);
  var _super17 = _createSuper(Range);
  function Range(props) {
    var _this13;
    (0, _classCallCheck2["default"])(this, Range);
    _this13 = _super17.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this13), "changeValue", function (e) {
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
  (0, _createClass2["default"])(Range, [{
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
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
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
FormElements.HeaderBar = _headerBar["default"];
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
FormElements.Table = _table["default"];
FormElements.Section = _section["default"];
FormElements.Signature2 = _signature["default"];
FormElements.DataSource = _datasource["default"];
FormElements.FileUpload = _fileUpload["default"];
FormElements.ImageUpload = _imageUpload["default"];
FormElements.FormulaInput = _formulaInput["default"];
FormElements.FormLink = _formLink["default"];
var _default = FormElements;
exports["default"] = _default;