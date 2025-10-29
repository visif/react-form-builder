"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
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
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } // eslint-disable-next-line max-classes-per-file
var FormElements = {};
var Header = function Header(props) {
  // const headerClasses = `dynamic-input ${props.data.element}-input`;
  var classNames = 'static';
  if (props.data.bold) {
    classNames += ' bold';
  }
  if (props.data.italic) {
    classNames += ' italic';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("h3", {
    className: classNames,
    dangerouslySetInnerHTML: {
      __html: _myxss["default"].process(props.data.content)
    }
  }));
};
var Paragraph = function Paragraph(props) {
  var classNames = 'static';
  if (props.data.bold) {
    classNames += ' bold';
  }
  if (props.data.italic) {
    classNames += ' italic';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("p", {
    className: classNames,
    dangerouslySetInnerHTML: {
      __html: _myxss["default"].process(props.data.content)
    }
  }));
};
var Label = function Label(props) {
  var classNames = 'static';
  if (props.data.bold) {
    classNames += ' bold';
  }
  if (props.data.italic) {
    classNames += ' italic';
  }

  // Add alignment support
  var style = {
    display: 'block'
  }; // Always make label a block element

  if (props.data.center) {
    style.textAlign = 'center';
  } else if (props.data.right) {
    style.textAlign = 'right';
  } else if (props.data.left) {
    style.textAlign = 'left';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("label", {
    className: classNames,
    style: style,
    dangerouslySetInnerHTML: {
      __html: _myxss["default"].process(props.data.content)
    }
  }));
};
var LineBreak = function LineBreak(props) {
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("hr", null));
};
var TextInput = function TextInput(props) {
  var inputField = _react["default"].useRef();
  var _React$useState = _react["default"].useState(props.defaultValue || ''),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    value = _React$useState2[0],
    setValue = _React$useState2[1];
  var handleChange = _react["default"].useCallback(function (e) {
    var newValue = e.target.value;
    setValue(newValue);
    var data = props.data,
      onFormularChange = props.handleChange;
    var formularKey = data.formularKey;
    if (formularKey && onFormularChange) {
      onFormularChange(formularKey, newValue);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (props.onElementChange) {
      // Create updated data object with the new value
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: newValue
      });

      // Send it for synchronization across columns
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
  }, [props]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var inputProps = {};
  inputProps.type = 'text';
  inputProps.className = 'form-control';
  inputProps.name = props.data.field_name;
  inputProps.onChange = handleChange;
  inputProps.value = value;
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("input", inputProps)));
};
var NumberInput = function NumberInput(props) {
  var inputField = _react["default"].useRef();
  var _React$useState3 = _react["default"].useState(props.defaultValue || ''),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    value = _React$useState4[0],
    setValue = _React$useState4[1];
  var handleKeyPress = _react["default"].useCallback(function (e) {
    // Allow: numbers, decimal point, minus sign, plus sign, basic math operators, and percentage
    var allowedChars = /[0-9.\-+*/()=% ]/;
    var _char = String.fromCharCode(e.which);
    if (!allowedChars.test(_char) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  }, []);
  var handleChange = _react["default"].useCallback(function (e) {
    var newValue = e.target.value;
    setValue(newValue);
    var data = props.data,
      onFormularChange = props.handleChange;
    var formularKey = data.formularKey;
    if (formularKey && onFormularChange) {
      onFormularChange(formularKey, newValue);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (props.onElementChange) {
      // Create updated data object with the new value
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: newValue
      });

      // Send it for synchronization across columns
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
  }, [props]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var inputProps = {};
  inputProps.type = 'number';
  inputProps.className = 'form-control';
  inputProps.name = props.data.field_name;
  inputProps.onChange = handleChange;
  inputProps.onKeyPress = handleKeyPress;
  inputProps.value = value;
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }
  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("input", inputProps)));
};
var TextArea = function TextArea(props) {
  var inputField = _react["default"].useRef();
  var _React$useState5 = _react["default"].useState(props.defaultValue || ''),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    value = _React$useState6[0],
    setValue = _React$useState6[1];
  var handleChange = _react["default"].useCallback(function (e) {
    var newValue = e.target.value;
    setValue(newValue);
    var data = props.data,
      onFormularChange = props.handleChange;
    var formularKey = data.formularKey;
    if (formularKey && onFormularChange) {
      onFormularChange(formularKey, newValue);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (props.onElementChange) {
      // Create updated data object with the new value
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: newValue
      });

      // Send it for synchronization across columns
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
  }, [props]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var textareaProps = {};
  textareaProps.className = 'form-control';
  textareaProps.name = props.data.field_name;
  textareaProps.minRows = 3;
  textareaProps.onChange = handleChange;
  textareaProps.value = value;
  if (props.read_only || !isSameEditor) {
    textareaProps.disabled = 'disabled';
  }
  if (props.mutable) {
    textareaProps.defaultValue = props.defaultValue;
    textareaProps.ref = inputField;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement(_reactTextareaAutosize["default"], textareaProps)));
};
var Dropdown = function Dropdown(props) {
  var inputField = _react["default"].useRef();
  var _React$useState7 = _react["default"].useState(props.defaultValue),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    value = _React$useState8[0],
    setValue = _React$useState8[1];

  // Update value when defaultValue prop changes
  _react["default"].useEffect(function () {
    setValue(props.defaultValue);
  }, [props.defaultValue]);
  var handleChange = _react["default"].useCallback(function (e) {
    var constValue = e.target.value;
    setValue(constValue);
    var data = props.data,
      onFormularChange = props.handleChange;
    var formularKey = data.formularKey;
    if (formularKey && onFormularChange) {
      onFormularChange(formularKey, constValue);
    }

    // If onElementChange is provided, call it to synchronize changes across the column
    if (props.onElementChange) {
      // Create updated data object with the new value
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: constValue
      });

      // Send it for synchronization across columns
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      // This makes changes visible in edit mode instantly
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
  }, [props]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var selectProps = {};
  selectProps.className = 'form-control';
  selectProps.name = props.data.field_name;
  selectProps.value = value;
  selectProps.onChange = handleChange;
  if (props.mutable) {
    selectProps.defaultValue = value;
    selectProps.ref = inputField;
  }
  if (props.read_only || !isSameEditor) {
    selectProps.disabled = 'disabled';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("select", selectProps, /*#__PURE__*/_react["default"].createElement("option", {
    value: "",
    key: "default-0"
  }, "Please Select"), props.data.options.map(function (option) {
    var this_key = "preview_".concat(option.key);
    return /*#__PURE__*/_react["default"].createElement("option", {
      value: option.value,
      key: this_key
    }, option.text);
  }))));
};
var Signature = function Signature(props) {
  var _React$useState9 = _react["default"].useState(props.defaultValue),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 2),
    defaultValue = _React$useState0[0],
    setDefaultValue = _React$useState0[1];
  var inputField = _react["default"].useRef(null);
  var canvas = _react["default"].useRef(null);
  var clear = _react["default"].useCallback(function () {
    if (defaultValue) {
      setDefaultValue('');

      // Immediately apply changes to this component's data when clearing signature
      if (props.onElementChange) {
        var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
          value: ''
        });
        props.onElementChange(updatedData);
        if (props.data.dirty === undefined || props.data.dirty) {
          updatedData.dirty = true;
          if (props.updateElement) {
            props.updateElement(updatedData);
          }
        }
      }
    } else if (canvas.current) {
      canvas.current.clear();
    }
  }, [defaultValue, props]);

  // Handle signature changes
  var handleSignatureChange = _react["default"].useCallback(function () {
    // Only trigger if canvas is available
    if (!canvas.current) return;

    // Get the signature data
    var signatureData = canvas.current.toDataURL().split(',')[1];

    // If onElementChange is provided, call it to synchronize changes across columns
    if (props.onElementChange) {
      var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
        value: signatureData
      });
      props.onElementChange(updatedData);

      // Immediately apply changes to this component's data
      if (props.data.dirty === undefined || props.data.dirty) {
        updatedData.dirty = true;
        if (props.updateElement) {
          props.updateElement(updatedData);
        }
      }
    }
    setDefaultValue(signatureData);
  }, [props]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var canClear = !!defaultValue;
  var inputProps = {};
  inputProps.type = 'hidden';
  inputProps.name = props.data.field_name;
  if (props.mutable) {
    inputProps.defaultValue = defaultValue;
    inputProps.ref = inputField;
  }
  var pad_props = {};
  // umd requires canvasProps={{ width: 400, height: 150 }}
  if (props.mutable) {
    pad_props.defaultValue = defaultValue;
    pad_props.ref = canvas;
    pad_props.onEnd = handleSignatureChange;
    canClear = !props.read_only || isSameEditor;
  }
  if (props.read_only || !isSameEditor) {
    inputProps.disabled = 'disabled';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  var sourceDataURL;
  if (defaultValue && defaultValue.length > 0) {
    sourceDataURL = "data:image/png;base64,".concat(defaultValue);
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), props.read_only === true || !isSameEditor || !!sourceDataURL ? /*#__PURE__*/_react["default"].createElement("img", {
    src: sourceDataURL
  }) : /*#__PURE__*/_react["default"].createElement(_reactSignatureCanvas["default"], pad_props), canClear && /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-times clear-signature",
    onClick: clear,
    title: "Clear Signature"
  }), /*#__PURE__*/_react["default"].createElement("input", inputProps)));
};
var Tags = function Tags(props) {
  var inputField = _react["default"].useRef(null);
  var getDefaultValue = _react["default"].useCallback(function (defaultValue, options) {
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
  }, []);
  var _React$useState1 = _react["default"].useState(getDefaultValue(props.defaultValue, props.data.options)),
    _React$useState10 = (0, _slicedToArray2["default"])(_React$useState1, 2),
    value = _React$useState10[0],
    setValue = _React$useState10[1];
  var handleChange = _react["default"].useCallback(function (e) {
    setValue(e || []);
  }, []);
  var options = props.data.options.map(function (option) {
    option.label = option.text;
    return option;
  });
  var selectProps = {};
  selectProps.isMulti = true;
  selectProps.name = props.data.field_name;
  selectProps.onChange = handleChange;
  selectProps.options = options;
  if (!props.mutable) {
    selectProps.value = options[0].text;
  } // to show a sample of what tags looks like

  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  if (props.mutable) {
    // selectProps.isDisabled = props.read_only;
    selectProps.isDisabled = !!(props.read_only || !isSameEditor);
    selectProps.value = value;
    selectProps.ref = inputField;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], selectProps)));
};
var Checkboxes = function Checkboxes(props) {
  var optionsRef = _react["default"].useRef({});
  var infosRef = _react["default"].useRef({});
  var _React$useState11 = _react["default"].useState(props.defaultValue),
    _React$useState12 = (0, _slicedToArray2["default"])(_React$useState11, 2),
    value = _React$useState12[0],
    setValue = _React$useState12[1];

  // Update value when defaultValue prop changes
  _react["default"].useEffect(function () {
    setValue(props.defaultValue);
  }, [props.defaultValue]);
  var getActiveValue = _react["default"].useCallback(function (values, key) {
    return values === null || values === void 0 ? void 0 : values.find(function (item) {
      return item.key === key;
    });
  }, []);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
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
    readOnly: props.read_only,
    finalDisabled: props.read_only || !isSameEditor
  });
  var classNames = 'custom-control custom-checkbox';
  if (props.data.inline) {
    classNames += ' option-inline';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
    className: "form-label"
  }, props)), props.data.options.map(function (option) {
    var _answerItem$info;
    var this_key = "preview_".concat(option.key);
    var inputProps = {};
    inputProps.name = "option_".concat(option.key);
    inputProps.type = 'checkbox';
    inputProps.value = option.value;

    // Check if the option is selected either from state or option properties
    var answerItem = getActiveValue(value, option.key);
    var isCheckedInOptions = option.checked || option.selected;
    if (props.mutable) {
      var _ref, _answerItem$value;
      inputProps.checked = (_ref = (_answerItem$value = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value !== void 0 ? _answerItem$value : isCheckedInOptions) !== null && _ref !== void 0 ? _ref : false;
    }
    if (props.read_only || !isSameEditor) {
      inputProps.disabled = 'disabled';
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
        if (c && props.mutable) {
          optionsRef.current["child_ref_".concat(option.key)] = c;
        }
      },
      onChange: function onChange() {
        setValue(function (current) {
          var activeVal = getActiveValue(current, option.key);
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
          var newValue = [].concat((0, _toConsumableArray2["default"])((current || []).filter(function (item) {
            return item.key !== option.key;
          })), [newActiveVal]);

          // If we're in a dynamic column and this is a UI-only change (selection)
          var isInDynamicColumn = props.data.parentId && props.data.row !== undefined && props.data.col !== undefined;

          // Always update the local element state for immediate visual feedback
          if (props.updateElement) {
            var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
              dirty: true,
              value: newValue
            });

            // Update the local options to show selection visually
            var localOptions = props.data.options.map(function (opt) {
              var _getActiveValue;
              return _objectSpread(_objectSpread({}, opt), {}, {
                checked: opt.key === option.key ? !(activeVal !== null && activeVal !== void 0 && activeVal.value) : ((_getActiveValue = getActiveValue(newValue, opt.key)) === null || _getActiveValue === void 0 ? void 0 : _getActiveValue.value) || false
              });
            });
            updatedData.options = localOptions;

            // Update just this element
            props.updateElement(updatedData);
          }

          // If onElementChange is provided, but we avoid sending selection state
          if (props.onElementChange && isInDynamicColumn) {
            var updatedDataForSync = _objectSpread({}, props.data);
            updatedDataForSync._selectionChangeOnly = true;
            props.onElementChange(updatedDataForSync);
          }
          return newValue;
        });
      }
    }, inputProps)), /*#__PURE__*/_react["default"].createElement("label", {
      className: "custom-control-label",
      htmlFor: "fid_".concat(this_key)
    }, option.text), inputProps.checked && option.info && /*#__PURE__*/_react["default"].createElement("textarea", {
      id: "fid_".concat(this_key, "_info"),
      type: "text",
      className: "form-control",
      style: {
        width: 'auto',
        marginLeft: 16,
        minHeight: '60px',
        marginBottom: 4
      },
      rows: 2,
      defaultValue: (_answerItem$info = answerItem === null || answerItem === void 0 ? void 0 : answerItem.info) !== null && _answerItem$info !== void 0 ? _answerItem$info : '',
      ref: function ref(c) {
        if (c && props.mutable) {
          infosRef.current["child_ref_".concat(option.key, "_info")] = c;
        }
      }
    }));
  })));
};
var RadioButtons = function RadioButtons(props) {
  var optionsRef = _react["default"].useRef({});
  var infosRef = _react["default"].useRef({});
  var _React$useState13 = _react["default"].useState(props.defaultValue),
    _React$useState14 = (0, _slicedToArray2["default"])(_React$useState13, 2),
    value = _React$useState14[0],
    setValue = _React$useState14[1];
  _react["default"].useEffect(function () {
    if (JSON.stringify(props.defaultValue) !== JSON.stringify(value)) {
      setValue(props.defaultValue);
    }
  }, [props.defaultValue, value]);
  var getActiveValue = _react["default"].useCallback(function (values, key) {
    return values === null || values === void 0 ? void 0 : values.find(function (item) {
      return item.key === key;
    });
  }, []);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
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
    readOnly: props.read_only,
    finalDisabled: props.read_only || !isSameEditor
  });
  var classNames = 'custom-control custom-radio';
  if (props.data.inline) {
    classNames += ' option-inline';
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  var data = props.data,
    handleChange = props.handleChange;
  var formularKey = data.formularKey;

  // Create unique name for RadioButtons in multi-column layout
  var isInDynamicColumn = props.data.parentId && props.data.row !== undefined && props.data.col !== undefined;
  var uniqueName = isInDynamicColumn ? "".concat(props.data.parentId, "_row").concat(props.data.row, "_col").concat(props.data.col, "_").concat(props.data.field_name) : props.data.field_name;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
    className: "form-label"
  }, props)), props.data.options.map(function (option) {
    var _answerItem$info2;
    var this_key = "preview_".concat(option.key);
    var inputProps = {};
    inputProps.name = uniqueName; // Use unique name instead of field_name

    inputProps.type = 'radio';
    inputProps.value = option.value;

    // Check if the option is selected either from state or option properties
    var answerItem = getActiveValue(value, option.key);
    var isCheckedInOptions = option.checked || option.selected;
    if (props.mutable) {
      var _ref2, _answerItem$value2;
      inputProps.checked = (_ref2 = (_answerItem$value2 = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value2 !== void 0 ? _answerItem$value2 : isCheckedInOptions) !== null && _ref2 !== void 0 ? _ref2 : false;
    }
    if (props.read_only || !isSameEditor) {
      inputProps.disabled = 'disabled';
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
        if (c && props.mutable) {
          optionsRef.current["child_ref_".concat(option.key)] = c;
        }
      },
      onClick: function onClick() {
        // Remove the isSameEditor check here since it's already handled by the disabled prop
        setValue(function (current) {
          if (formularKey && handleChange) {
            handleChange(formularKey, option.value);
          }

          // Check if this option is already selected
          var currentActiveValue = getActiveValue(current, option.key);
          var isCurrentlySelected = (currentActiveValue === null || currentActiveValue === void 0 ? void 0 : currentActiveValue.value) === true;
          var newValue;
          if (isCurrentlySelected) {
            // If already selected, deselect it (empty array)
            newValue = []; // Clear selection
          } else {
            // If not selected, select this option
            newValue = [{
              key: option.key,
              value: true,
              info: ''
            }];
          }

          // Always update the local element state for immediate visual feedback
          if (props.updateElement) {
            // Apply the checked state to just this element's data
            var updatedData = _objectSpread(_objectSpread({}, props.data), {}, {
              dirty: true,
              value: newValue
            });

            // Update the local options to show selection visually
            // This only affects THIS element, not others in the column
            var localOptions = props.data.options.map(function (opt) {
              return _objectSpread(_objectSpread({}, opt), {}, {
                checked: isCurrentlySelected ? false : opt.key === option.key,
                selected: isCurrentlySelected ? false : opt.key === option.key
              });
            });
            updatedData.options = localOptions;

            // Update just this element
            props.updateElement(updatedData);
          }

          // If onElementChange is provided and we're in a dynamic column
          if (props.onElementChange && isInDynamicColumn) {
            // For selection changes in dynamic columns, we don't want to sync the selection state
            // but we still need to notify the system that a change happened for other purposes
            var updatedDataForSync = _objectSpread({}, props.data);

            // Mark this as a selection-only change that shouldn't be synced
            updatedDataForSync._selectionChangeOnly = true;

            // Notify the system about the change, but without selection state changes
            props.onElementChange(updatedDataForSync);
          }
          return newValue;
        });
      }
    }, inputProps)), /*#__PURE__*/_react["default"].createElement("label", {
      className: "custom-control-label",
      htmlFor: "fid_".concat(this_key)
    }, option.text), inputProps.checked && option.info && /*#__PURE__*/_react["default"].createElement("textarea", {
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
        if (c && props.mutable) {
          infosRef.current["child_ref_".concat(option.key, "_info")] = c;
        }
      }
    }));
  })));
};
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
var Rating = function Rating(props) {
  var inputField = _react["default"].useRef(null);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var starProps = {};
  starProps.name = props.data.field_name;
  starProps.ratingAmount = 5;
  if (props.mutable) {
    starProps.rating = props.defaultValue !== undefined ? parseFloat(props.defaultValue, 10) : 0;
    starProps.editing = true;
    // starProps.disabled = props.read_only ||;
    starProps.disabled = !!(props.read_only || !isSameEditor);
    starProps.ref = inputField;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement(_starRating["default"], starProps)));
};
var HyperLink = function HyperLink(props) {
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement("a", {
    target: "_blank",
    href: props.data.href,
    rel: "noreferrer"
  }, props.data.content)));
};
var Download = function Download(props) {
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "".concat(props.download_path, "?id=").concat(props.data.file_path)
  }, props.data.content)));
};
var Camera = function Camera(props) {
  var _React$useState15 = _react["default"].useState(null),
    _React$useState16 = (0, _slicedToArray2["default"])(_React$useState15, 2),
    img = _React$useState16[0],
    setImg = _React$useState16[1];
  var displayImage = _react["default"].useCallback(function (e) {
    var target = e.target;
    var file;
    var reader;
    if (target.files && target.files.length) {
      file = target.files[0];
      // eslint-disable-next-line no-undef
      reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setImg(reader.result);
      };
    }
  }, []);
  var clearImage = _react["default"].useCallback(function () {
    setImg(null);
  }, []);
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  var name = props.data.field_name;
  var fileInputStyle = img ? {
    display: 'none'
  } : null;
  var sourceDataURL;
  if (props.read_only === true && props.defaultValue && props.defaultValue.length > 0) {
    if (props.defaultValue.indexOf(name > -1)) {
      sourceDataURL = props.defaultValue;
    } else {
      sourceDataURL = "data:image/png;base64,".concat(props.defaultValue);
    }
  }
  console.log('sourceDataURL', sourceDataURL);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), props.read_only === true && props.defaultValue && props.defaultValue.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("img", {
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
    onChange: displayImage
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "image-upload-control"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn btn-default"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-camera"
  }), " Upload Photo"), /*#__PURE__*/_react["default"].createElement("p", null, "Select an image from your computer or device."))), img && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("img", {
    src: img,
    height: "100",
    className: "image-upload-preview"
  }), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn btn-image-clear",
    onClick: clearImage
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-times"
  }), " Clear Photo")))));
};
var Range = function Range(props) {
  var inputField = _react["default"].useRef(null);
  var _React$useState17 = _react["default"].useState(props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.default_value, 10)),
    _React$useState18 = (0, _slicedToArray2["default"])(_React$useState17, 2),
    value = _React$useState18[0],
    setValue = _React$useState18[1];
  var changeValue = _react["default"].useCallback(function (e) {
    var target = e.target;
    setValue(target.value);
  }, []);
  var rangeProps = {};
  var name = props.data.field_name;
  rangeProps.type = 'range';
  rangeProps.list = "tickmarks_".concat(name);
  rangeProps.min = props.data.min_value;
  rangeProps.max = props.data.max_value;
  rangeProps.step = props.data.step;
  rangeProps.value = value;
  rangeProps.change = changeValue;
  if (props.mutable) {
    rangeProps.ref = inputField;
  }
  var datalist = [];
  for (var i = parseInt(rangeProps.min, 10); i <= parseInt(rangeProps.max, 10); i += parseInt(rangeProps.step, 10)) {
    datalist.push(i);
  }
  var oneBig = 100 / (datalist.length - 1);
  var _datalist = datalist.map(function (d, idx) {
    return /*#__PURE__*/_react["default"].createElement("option", {
      key: "".concat(rangeProps.list, "_").concat(idx)
    }, d);
  });
  var visible_marks = datalist.map(function (d, idx) {
    var option_props = {};
    var w = oneBig;
    if (idx === 0 || idx === datalist.length - 1) {
      w = oneBig / 2;
    }
    option_props.key = "".concat(rangeProps.list, "_label_").concat(idx);
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
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "range"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "clearfix"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "float-left"
  }, props.data.min_label), /*#__PURE__*/_react["default"].createElement("span", {
    className: "float-right"
  }, props.data.max_label)), /*#__PURE__*/_react["default"].createElement(_antd.Slider, {
    min: rangeProps.min,
    max: rangeProps.max,
    step: rangeProps.step,
    value: rangeProps.value,
    onChange: function onChange(newValue) {
      setValue(newValue);
      if (rangeProps.change) {
        rangeProps.change({
          target: {
            value: newValue
          }
        });
      }
    },
    marks: datalist.reduce(function (acc, val) {
      acc[val] = '';
      return acc;
    }, {})
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "visible_marks"
  }, visible_marks), /*#__PURE__*/_react["default"].createElement("input", {
    name: name,
    value: value,
    type: "hidden"
  }), /*#__PURE__*/_react["default"].createElement("datalist", {
    id: rangeProps.list
  }, _datalist)));
};
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
var _default = exports["default"] = FormElements;