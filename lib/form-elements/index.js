"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } // eslint-disable-next-line max-classes-per-file
const FormElements = {};
class Header extends _react.default.Component {
  render() {
    // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
    let classNames = 'static';
    if (this.props.data.bold) {
      classNames += ' bold';
    }
    if (this.props.data.italic) {
      classNames += ' italic';
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("h3", {
      className: classNames,
      dangerouslySetInnerHTML: {
        __html: _myxss.default.process(this.props.data.content)
      }
    }));
  }
}
class Paragraph extends _react.default.Component {
  render() {
    let classNames = 'static';
    if (this.props.data.bold) {
      classNames += ' bold';
    }
    if (this.props.data.italic) {
      classNames += ' italic';
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("p", {
      className: classNames,
      dangerouslySetInnerHTML: {
        __html: _myxss.default.process(this.props.data.content)
      }
    }));
  }
}
class Label extends _react.default.Component {
  render() {
    let classNames = 'static';
    if (this.props.data.bold) {
      classNames += ' bold';
    }
    if (this.props.data.italic) {
      classNames += ' italic';
    }

    // Add alignment support
    const style = {
      display: 'block'
    }; // Always make label a block element

    if (this.props.data.center) {
      style.textAlign = 'center';
    } else if (this.props.data.right) {
      style.textAlign = 'right';
    } else if (this.props.data.left) {
      style.textAlign = 'left';
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("label", {
      className: classNames,
      style: style,
      dangerouslySetInnerHTML: {
        __html: _myxss.default.process(this.props.data.content)
      }
    }));
  }
}
class LineBreak extends _react.default.Component {
  render() {
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("hr", null));
  }
}
class TextInput extends _react.default.Component {
  constructor(props) {
    super(props);
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: props.defaultValue || ''
    };
  }
  handleChange(e) {
    const {
      value
    } = e.target;
    this.setState({
      value
    });
    const {
      data,
      handleChange
    } = this.props;
    const {
      formularKey
    } = data;
    if (formularKey && handleChange) {
      handleChange(formularKey, value);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
        value
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
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if text input has any value
    const hasValue = this.state.value && this.state.value.toString().trim() !== '';
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {};
    props.type = 'text';
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;
    props.value = this.state.value;
    if (tooltipText) {
      props.title = tooltipText;
    }
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("input", props)));
  }
}
class NumberInput extends _react.default.Component {
  constructor(props) {
    super(props);
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      value: props.defaultValue || ''
    };
  }
  handleKeyPress(e) {
    // Allow: numbers, decimal point, minus sign, plus sign, basic math operators, and percentage
    const allowedChars = /[0-9.\-+*/()=% ]/;
    const char = String.fromCharCode(e.which);
    if (!allowedChars.test(char) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  }
  handleChange(e) {
    const {
      value
    } = e.target;
    this.setState({
      value
    });
    const {
      data,
      handleChange
    } = this.props;
    const {
      formularKey
    } = data;
    if (formularKey && handleChange) {
      handleChange(formularKey, value);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
        value
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
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if number input has any value
    const hasValue = this.state.value && this.state.value.toString().trim() !== '';
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {};
    props.type = 'number';
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;
    props.onKeyPress = this.handleKeyPress;
    props.value = this.state.value;
    if (tooltipText) {
      props.title = tooltipText;
    }
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }
    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled';
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("input", props)));
  }
}
class TextArea extends _react.default.Component {
  constructor(props) {
    super(props);
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: props.defaultValue || ''
    };
  }
  handleChange(e) {
    const {
      value
    } = e.target;
    this.setState({
      value
    });
    const {
      data,
      handleChange
    } = this.props;
    const {
      formularKey
    } = data;
    if (formularKey && handleChange) {
      handleChange(formularKey, value);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (this.props.onElementChange) {
      // Create updated data object with the new value
      const updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
        value
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
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if textarea has any value
    const hasValue = this.state.value && this.state.value.toString().trim() !== '';
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {};
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    props.minRows = 3;
    props.onChange = this.handleChange;
    props.value = this.state.value;
    if (tooltipText) {
      props.title = tooltipText;
    }
    if (this.props.read_only || !isSameEditor) {
      props.disabled = 'disabled';
    }
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement(_reactTextareaAutosize.default, props)));
  }
}
class Dropdown extends _react.default.Component {
  constructor(props) {
    var _props$data;
    super(props);
    (0, _defineProperty2.default)(this, "handleChange", selectedOption => {
      // react-select passes the entire selected object, not an event
      // If null (cleared), use empty string; otherwise use the value property
      const constValue = selectedOption ? selectedOption.value : '';

      // Check if the newly selected option has info enabled
      // Use loose equality to handle type coercion (string vs number)
      const selectedOptionData = this.props.data.options.find(option => option.value == constValue);
      const shouldShowInfo = selectedOptionData === null || selectedOptionData === void 0 ? void 0 : selectedOptionData.info;

      // If switching to an option without info, clear the info field
      // If switching to an option with info, keep any existing info or empty if none
      const newInfo = shouldShowInfo ? this.state.info : '';
      this.setState({
        value: constValue,
        info: newInfo
      });
      const {
        data,
        handleChange
      } = this.props;
      const {
        formularKey
      } = data;
      if (formularKey && handleChange) {
        handleChange(formularKey, constValue);
      }

      // If onElementChange is provided, call it to synchronize changes across the column
      if (this.props.onElementChange) {
        // Create updated data object with the new value
        const updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
          value: constValue
        });

        // Send it for synchronization across columns
        this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        // This makes changes visible in edit mode instantly
        if (this.props.data.dirty === undefined || this.props.data.dirty) {
          updatedData.dirty = true;
          if (this.props.updateElement) {
            this.props.updateElement(updatedData);
          }
        }
      }
    });
    (0, _defineProperty2.default)(this, "handleInfoChange", e => {
      this.setState({
        info: e.target.value
      });
    });
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.infoField = /*#__PURE__*/_react.default.createRef();
    const rawDefaultValue = props.defaultValue !== undefined ? props.defaultValue : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.defaultValue;
    const value = rawDefaultValue && typeof rawDefaultValue === 'object' ? rawDefaultValue.value : rawDefaultValue || '';
    const info = rawDefaultValue && typeof rawDefaultValue === 'object' ? rawDefaultValue.info || '' : '';
    this.state = {
      defaultValue: rawDefaultValue,
      value,
      info
    };
  }
  static getDerivedStateFromProps(props, state) {
    var _props$data2;
    const rawDefaultValue = props.defaultValue !== undefined ? props.defaultValue : (_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.defaultValue;
    if (props.mutable && props.data.field_name && (props.defaultValue === undefined || props.defaultValue === null)) {
      // If mutable but defaultValue is missing or null, possibly due to a reset or clear,
      // we might want to check the data object.
    }

    // Check if props.defaultValue has changed from what we last saw.
    // JSON.stringify is a bit heavy but handles deep comparison for objects.
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(rawDefaultValue)) {
      var _props$data3;
      const value = rawDefaultValue && typeof rawDefaultValue === 'object' ? rawDefaultValue.value : rawDefaultValue || '';
      const info = rawDefaultValue && typeof rawDefaultValue === 'object' ? rawDefaultValue.info || '' : '';

      // Check if the selected option has info enabled, and if we don't have stored info,
      // we need to ensure the field is shown but empty (ready for user input)
      const selectedOption = (_props$data3 = props.data) === null || _props$data3 === void 0 || (_props$data3 = _props$data3.options) === null || _props$data3 === void 0 ? void 0 : _props$data3.find(option => option.value == value);
      const shouldShowInfo = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.info;
      return {
        defaultValue: rawDefaultValue,
        value,
        info: shouldShowInfo ? info : ''
      };
    }
    return state;
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if dropdown has any value (not empty string)
    const hasValue = this.state.value && this.state.value.toString().trim() !== '';
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }
    const options = this.props.data.options.map(option => _objectSpread(_objectSpread({}, option), {}, {
      label: option.text
    }));
    const selectedOption = options.find(option => option.value == this.state.value);

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(selectedOption ? selectedOption.label : this.state.value, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {};
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;
    props.isSearchable = true;
    props.placeholder = 'Please Select';
    if (tooltipText) {
      props.title = tooltipText;
    }
    if (this.props.mutable) {
      props.ref = this.inputField;
    }
    if (this.props.read_only || !isSameEditor) {
      props.isDisabled = true;
    }
    const showInfo = selectedOption && selectedOption.info;
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_reactSelect.default, (0, _extends2.default)({}, props, {
      className: "react-select-container",
      classNamePrefix: "react-select",
      options: options,
      value: selectedOption || null,
      isClearable: true
    }))), showInfo && /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      className: "form-control",
      style: {
        marginTop: '8px'
      },
      placeholder: "Additional information",
      value: this.state.info,
      onChange: this.handleInfoChange,
      disabled: this.props.read_only || !isSameEditor,
      ref: this.infoField
    }), /*#__PURE__*/_react.default.createElement("input", {
      type: "hidden",
      name: this.props.data.field_name,
      value: this.state.value
    })));
  }
}
class Signature extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "clear", () => {
      if (this.state.defaultValue) {
        this.setState({
          defaultValue: ''
        });

        // Immediately apply changes to this component's data when clearing signature
        if (this.props.onElementChange) {
          const updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
            value: ''
          });
          this.props.onElementChange(updatedData);
          if (this.props.data.dirty === undefined || this.props.data.dirty) {
            updatedData.dirty = true;
            if (this.props.updateElement) {
              this.props.updateElement(updatedData);
            }
          }
        }
      } else if (this.canvas.current) {
        this.canvas.current.clear();
      }
    });
    // Handle signature changes
    (0, _defineProperty2.default)(this, "handleSignatureChange", () => {
      // Only trigger if canvas is available
      if (!this.canvas.current) return;

      // Get the signature data
      const signatureData = this.canvas.current.toDataURL().split(',')[1];

      // If onElementChange is provided, call it to synchronize changes across columns
      if (this.props.onElementChange) {
        const updatedData = _objectSpread(_objectSpread({}, this.props.data), {}, {
          value: signatureData
        });
        this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (this.props.data.dirty === undefined || this.props.data.dirty) {
          updatedData.dirty = true;
          if (this.props.updateElement) {
            this.props.updateElement(updatedData);
          }
        }
      }
      this.setState({
        defaultValue: signatureData
      });
    });
    this.state = {
      defaultValue: props.defaultValue
    };
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.canvas = /*#__PURE__*/_react.default.createRef();
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;
    const {
      defaultValue
    } = this.state;

    // Check if signature has any value
    const hasValue = defaultValue && defaultValue.length > 0;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(defaultValue, "\nEdited by: ").concat(savedEditor.name) : '';
    let canClear = !!defaultValue;
    const props = {};
    props.type = 'hidden';
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = defaultValue;
      props.ref = this.inputField;
    }
    const pad_props = {};
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
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    let sourceDataURL;
    if (defaultValue && defaultValue.length > 0) {
      sourceDataURL = "data:image/png;base64,".concat(defaultValue);
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), this.props.read_only === true || !isSameEditor || !!sourceDataURL ? /*#__PURE__*/_react.default.createElement("img", {
      src: sourceDataURL
    }) : /*#__PURE__*/_react.default.createElement(_reactSignatureCanvas.default, pad_props), canClear && /*#__PURE__*/_react.default.createElement("i", {
      className: "fas fa-times clear-signature",
      onClick: this.clear,
      title: "Clear Signature"
    }), /*#__PURE__*/_react.default.createElement("input", props)));
  }
}
class Tags extends _react.default.Component {
  constructor(props) {
    super(props);
    // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };
    (0, _defineProperty2.default)(this, "handleChange", e => {
      this.setState({
        value: e || []
      });
    });
    this.inputField = /*#__PURE__*/_react.default.createRef();
    const {
      defaultValue,
      data
    } = props;
    this.state = {
      value: this.getDefaultValue(defaultValue, data.options)
    };
  }
  getDefaultValue(defaultValue, options) {
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        const vals = defaultValue.split(',').map(x => x.trim());
        return options.filter(x => vals.indexOf(x.value) > -1);
      }
      return options.filter(x => defaultValue.indexOf(x.value) > -1);
    }
    return [];
  }
  render() {
    const options = this.props.data.options.map(option => {
      option.label = option.text;
      return option;
    });
    const props = {};
    props.isMulti = true;
    props.name = this.props.data.field_name;
    props.onChange = this.handleChange;
    props.options = options;
    if (!this.props.mutable) {
      props.value = options[0].text;
    } // to show a sample of what tags looks like

    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if tags has any value (selected items)
    const hasValue = this.state.value && Array.isArray(this.state.value) && this.state.value.length > 0;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value.map(v => v.label || v.text).join(', '), "\nEdited by: ").concat(savedEditor.name) : '';
    if (this.props.mutable) {
      // props.isDisabled = this.props.read_only;
      props.isDisabled = !!(this.props.read_only || !isSameEditor);
      props.value = this.state.value;
      props.ref = this.inputField;
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement(_reactSelect.default, props)));
  }
}
class Checkboxes extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "getActiveValue", (values, key) => values === null || values === void 0 ? void 0 : values.find(item => item.key === key));
    this.options = {};
    this.infos = {};
    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue
      };
    }
    return state;
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if any checkbox is selected
    const hasValue = this.state.value && Array.isArray(this.state.value) && this.state.value.length > 0;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.value.map(v => {
      if (v.value) {
        const opt = this.props.data.options.find(o => o.key === v.key);
        return opt ? opt.text : v.key;
      }
      return null;
    }).filter(Boolean).join(', '), "\nEdited by: ").concat(savedEditor.name) : '';
    const self = this;
    let classNames = 'custom-control custom-checkbox';
    if (this.props.data.inline) {
      classNames += ' option-inline';
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, (0, _extends2.default)({
      className: "form-label"
    }, this.props)), this.props.data.options.map(option => {
      var _answerItem$info;
      const this_key = "preview_".concat(option.key);
      const props = {};
      props.name = "option_".concat(option.key);
      props.type = 'checkbox';
      props.value = option.value;

      // Check if the option is selected either from state or option properties
      const answerItem = self.getActiveValue(self.state.value, option.key);
      const isCheckedInOptions = option.checked || option.selected;
      if (self.props.mutable) {
        var _ref, _answerItem$value;
        props.checked = (_ref = (_answerItem$value = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value !== void 0 ? _answerItem$value : isCheckedInOptions) !== null && _ref !== void 0 ? _ref : false;
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classNames,
        key: this_key,
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement("input", (0, _extends2.default)({
        id: "fid_".concat(this_key),
        className: "custom-control-input",
        ref: c => {
          if (c && self.props.mutable) {
            self.options["child_ref_".concat(option.key)] = c;
          }
        },
        onChange: () => {
          // Remove the isSameEditor check here since it's already handled by the disabled prop
          self.setState(current => {
            const activeVal = self.getActiveValue(current && current.value, option.key);
            const newActiveVal = activeVal ? _objectSpread(_objectSpread({}, activeVal), {}, {
              value: !activeVal.value
            }) : {
              key: option.key,
              value: true,
              info: ''
            };
            if (!current) {
              return current;
            }
            const newValue = _objectSpread(_objectSpread({}, current), {}, {
              value: [...(current.value || []).filter(item => item.key !== option.key), newActiveVal]
            });

            // If we're in a dynamic column and this is a UI-only change (selection)
            // We need to update just this component's internal state without syncing to other rows
            const isInDynamicColumn = self.props.data.parentId && self.props.data.row !== undefined && self.props.data.col !== undefined;

            // Always update the local element state for immediate visual feedback
            if (self.props.updateElement) {
              // Apply the checked state to just this element's data
              const updatedData = _objectSpread(_objectSpread({}, self.props.data), {}, {
                dirty: true,
                value: newValue.value
              });

              // Update the local options to show selection visually
              // This only affects THIS element, not others in the column
              const localOptions = self.props.data.options.map(opt => {
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
              const updatedDataForSync = _objectSpread({}, self.props.data);

              // Mark this as a selection-only change that shouldn't be synced
              updatedDataForSync._selectionChangeOnly = true;

              // Notify the system about the change, but without selection state changes
              self.props.onElementChange(updatedDataForSync);
            }
            return newValue;
          });
        }
      }, props)), /*#__PURE__*/_react.default.createElement("label", {
        className: "custom-control-label",
        htmlFor: "fid_".concat(this_key)
      }, option.text), props.checked && option.info && /*#__PURE__*/_react.default.createElement("textarea", {
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
        ref: c => {
          if (c && self.props.mutable) {
            self.infos["child_ref_".concat(option.key, "_info")] = c;
          }
        }
      }));
    })));
  }
}
class RadioButtons extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "getActiveValue", (values, key) => values === null || values === void 0 ? void 0 : values.find(item => item.key === key));
    this.options = {};
    this.infos = {};
    this.state = {
      defaultValue: props.defaultValue,
      value: props.defaultValue
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)) {
      return {
        defaultValue: props.defaultValue,
        value: props.defaultValue
      };
    }
    return state;
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if radio button has any value (any option selected)
    const hasValue = this.state.defaultValue && Array.isArray(this.state.defaultValue) && this.state.defaultValue.length > 0;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.defaultValue.map(v => {
      if (v.value) {
        const opt = this.props.data.options.find(o => o.key === v.key);
        return opt ? opt.text : v.key;
      }
      return null;
    }).filter(Boolean).join(', '), "\nEdited by: ").concat(savedEditor.name) : '';
    const self = this;
    let classNames = 'custom-control custom-radio';
    if (this.props.data.inline) {
      classNames += ' option-inline';
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    const {
      data,
      handleChange
    } = this.props;
    const {
      formularKey
    } = data;

    // Create unique name for RadioButtons in multi-column layout
    const isInDynamicColumn = this.props.data.parentId && this.props.data.row !== undefined && this.props.data.col !== undefined;
    const uniqueName = isInDynamicColumn ? "".concat(this.props.data.parentId, "_row").concat(this.props.data.row, "_col").concat(this.props.data.col, "_").concat(this.props.data.field_name) : this.props.data.field_name;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, (0, _extends2.default)({
      className: "form-label"
    }, this.props)), this.props.data.options.map(option => {
      var _answerItem$info2;
      const this_key = "preview_".concat(option.key);
      const props = {};
      props.name = uniqueName; // Use unique name instead of field_name

      props.type = 'radio';
      props.value = option.value;

      // Check if the option is selected either from state or option properties
      const answerItem = self.getActiveValue(self.state.value, option.key);
      const isCheckedInOptions = option.checked || option.selected;
      if (self.props.mutable) {
        var _ref2, _answerItem$value2;
        props.checked = (_ref2 = (_answerItem$value2 = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value2 !== void 0 ? _answerItem$value2 : isCheckedInOptions) !== null && _ref2 !== void 0 ? _ref2 : false;
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = 'disabled';
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classNames,
        key: this_key,
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement("input", (0, _extends2.default)({
        id: "fid_".concat(this_key),
        className: "custom-control-input",
        ref: c => {
          if (c && self.props.mutable) {
            self.options["child_ref_".concat(option.key)] = c;
          }
        },
        onClick: () => {
          // Remove the isSameEditor check here since it's already handled by the disabled prop
          self.setState(current => {
            if (formularKey && handleChange) {
              handleChange(formularKey, option.value);
            }

            // Check if this option is already selected
            const currentActiveValue = self.getActiveValue(current === null || current === void 0 ? void 0 : current.value, option.key);
            const isCurrentlySelected = (currentActiveValue === null || currentActiveValue === void 0 ? void 0 : currentActiveValue.value) === true;
            let newValue;
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
              const updatedData = _objectSpread(_objectSpread({}, self.props.data), {}, {
                dirty: true,
                value: newValue.value
              });

              // Update the local options to show selection visually
              // This only affects THIS element, not others in the column
              const localOptions = self.props.data.options.map(opt => _objectSpread(_objectSpread({}, opt), {}, {
                checked: isCurrentlySelected ? false : opt.key === option.key,
                selected: isCurrentlySelected ? false : opt.key === option.key
              }));
              updatedData.options = localOptions;

              // Update just this element
              self.props.updateElement(updatedData);
            }

            // If onElementChange is provided and we're in a dynamic column
            if (self.props.onElementChange && isInDynamicColumn) {
              // For selection changes in dynamic columns, we don't want to sync the selection state
              // but we still need to notify the system that a change happened for other purposes
              const updatedDataForSync = _objectSpread({}, self.props.data);

              // Mark this as a selection-only change that shouldn't be synced
              updatedDataForSync._selectionChangeOnly = true;

              // Notify the system about the change, but without selection state changes
              self.props.onElementChange(updatedDataForSync);
            }
            return newValue;
          });
        }
      }, props)), /*#__PURE__*/_react.default.createElement("label", {
        className: "custom-control-label",
        htmlFor: "fid_".concat(this_key)
      }, option.text), props.checked && option.info && /*#__PURE__*/_react.default.createElement("textarea", {
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
        ref: c => {
          if (c && self.props.mutable) {
            self.infos["child_ref_".concat(option.key, "_info")] = c;
          }
        }
      }));
    })));
  }
}
const Image = props => {
  const style = props.data.center ? {
    textAlign: 'center'
  } : null;
  let baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: baseClasses,
    style: style
  }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, props), props.data.src && /*#__PURE__*/_react.default.createElement("img", {
    style: {
      maxWidth: '100%',
      height: 'auto'
    },
    src: props.data.src,
    width: props.data.width,
    height: props.data.height
  }), !props.data.src && /*#__PURE__*/_react.default.createElement("div", {
    className: "no-image"
  }, "No Image"));
};
class Rating extends _react.default.Component {
  constructor(props) {
    super(props);
    this.inputField = /*#__PURE__*/_react.default.createRef();
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if rating has any value (greater than 0)
    const currentRating = this.props.defaultValue !== undefined ? parseFloat(this.props.defaultValue, 10) : 0;
    const hasValue = currentRating > 0;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(currentRating, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {};
    props.name = this.props.data.field_name;
    props.ratingAmount = 5;
    if (this.props.mutable) {
      props.rating = currentRating;
      props.editing = true;
      // props.disabled = this.props.read_only ||;
      props.disabled = !!(this.props.read_only || !isSameEditor);
      props.ref = this.inputField;
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement(_starRating.default, props)));
  }
}
class HyperLink extends _react.default.Component {
  render() {
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement("a", {
      target: "_blank",
      href: this.props.data.href,
      rel: "noreferrer"
    }, this.props.data.content)));
  }
}
class Download extends _react.default.Component {
  render() {
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: "".concat(this.props.download_path, "?id=").concat(this.props.data.file_path)
    }, this.props.data.content)));
  }
}
class Camera extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "displayImage", e => {
      const self = this;
      const {
        target
      } = e;
      let file;
      let reader;
      if (target.files && target.files.length) {
        file = target.files[0];
        // eslint-disable-next-line no-undef
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          self.setState({
            img: reader.result
          });
        };
      }
    });
    (0, _defineProperty2.default)(this, "clearImage", () => {
      this.setState({
        img: null
      });
    });
    this.state = {
      img: null
    };
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if camera has any value (image captured or default value)
    const hasValue = this.state.img || this.props.defaultValue && this.props.defaultValue.length > 0;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.img || this.props.defaultValue, "\nEdited by: ").concat(savedEditor.name) : '';
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    const name = this.props.data.field_name;
    const fileInputStyle = this.state.img ? {
      display: 'none'
    } : null;
    let sourceDataURL;
    if (this.props.read_only === true && this.props.defaultValue && this.props.defaultValue.length > 0) {
      if (this.props.defaultValue.indexOf(name > -1)) {
        sourceDataURL = this.props.defaultValue;
      } else {
        sourceDataURL = "data:image/png;base64,".concat(this.props.defaultValue);
      }
    }
    console.log('sourceDataURL', sourceDataURL);
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), this.props.read_only === true && this.props.defaultValue && this.props.defaultValue.length > 0 ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: sourceDataURL
    })) : /*#__PURE__*/_react.default.createElement("div", {
      className: "image-upload-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: fileInputStyle
    }, /*#__PURE__*/_react.default.createElement("input", {
      name: name,
      type: "file",
      accept: "image/*",
      capture: "camera",
      className: "image-upload",
      onChange: this.displayImage,
      disabled: this.props.read_only || !isSameEditor
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "image-upload-control"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "btn btn-default"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fas fa-camera"
    }), " Upload Photo"), /*#__PURE__*/_react.default.createElement("p", null, "Select an image from your computer or device."))), this.state.img && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("img", {
      src: this.state.img,
      height: "100",
      className: "image-upload-preview"
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
      className: "btn btn-image-clear",
      onClick: this.clearImage
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fas fa-times"
    }), " Clear Photo")))));
  }
}
class Range extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "changeValue", e => {
      const {
        target
      } = e;
      this.setState({
        value: target.value
      });
    });
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.state = {
      value: props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.default_value, 10)
    };
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;

    // Check if range has any value (different from default)
    const defaultVal = parseInt(this.props.data.default_value, 10);
    const currentVal = this.state.value;
    const hasValue = currentVal !== defaultVal && currentVal !== undefined;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text for editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(currentVal, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {};
    const name = this.props.data.field_name;
    props.type = 'range';
    props.list = "tickmarks_".concat(name);
    props.min = this.props.data.min_value;
    props.max = this.props.data.max_value;
    props.step = this.props.data.step;
    props.value = this.state.value;
    props.change = this.changeValue;
    props.disabled = !!(this.props.read_only || !isSameEditor);
    if (this.props.mutable) {
      props.ref = this.inputField;
    }
    const datalist = [];
    for (let i = parseInt(props.min_value, 10); i <= parseInt(props.max_value, 10); i += parseInt(props.step, 10)) {
      datalist.push(i);
    }
    const oneBig = 100 / (datalist.length - 1);
    const _datalist = datalist.map((d, idx) => /*#__PURE__*/_react.default.createElement("option", {
      key: "".concat(props.list, "_").concat(idx)
    }, d));
    const visible_marks = datalist.map((d, idx) => {
      const option_props = {};
      let w = oneBig;
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
      return /*#__PURE__*/_react.default.createElement("label", option_props, d);
    });
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : '',
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: "range"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "clearfix"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "float-left"
    }, this.props.data.min_label), /*#__PURE__*/_react.default.createElement("span", {
      className: "float-right"
    }, this.props.data.max_label)), /*#__PURE__*/_react.default.createElement(_reactBootstrapSlider.default, props)), /*#__PURE__*/_react.default.createElement("div", {
      className: "visible_marks"
    }, visible_marks), /*#__PURE__*/_react.default.createElement("input", {
      name: name,
      value: this.state.value,
      type: "hidden"
    }), /*#__PURE__*/_react.default.createElement("datalist", {
      id: props.list
    }, _datalist)));
  }
}
FormElements.Header = Header;
FormElements.HeaderBar = _headerBar.default;
FormElements.Paragraph = Paragraph;
FormElements.Label = Label;
FormElements.LineBreak = LineBreak;
FormElements.TextInput = TextInput;
FormElements.NumberInput = NumberInput;
FormElements.TextArea = TextArea;
FormElements.Dropdown = Dropdown;
FormElements.Signature = Signature;
FormElements.Checkboxes = Checkboxes;
FormElements.DatePicker = _datePicker.default;
FormElements.RadioButtons = RadioButtons;
FormElements.Image = Image;
FormElements.Rating = Rating;
FormElements.Tags = Tags;
FormElements.HyperLink = HyperLink;
FormElements.Download = Download;
FormElements.Camera = Camera;
FormElements.Range = Range;
FormElements.Table = _table.default;
FormElements.Section = _section.default;
FormElements.Signature2 = _signature.default;
FormElements.DataSource = _datasource.default;
FormElements.FileUpload = _fileUpload.default;
FormElements.ImageUpload = _imageUpload.default;
FormElements.FormulaInput = _formulaInput.default;
FormElements.FormLink = _formLink.default;
var _default = exports.default = FormElements;