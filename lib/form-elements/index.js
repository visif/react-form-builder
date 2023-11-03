"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _index = require("../index");
var _reactSelect = _interopRequireDefault(require("react-select"));
var _reactSignatureCanvas = _interopRequireDefault(require("react-signature-canvas"));
var _reactBootstrapSlider = _interopRequireDefault(require("react-bootstrap-slider"));
var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));
var _starRating = _interopRequireDefault(require("./star-rating"));
var _headerBar = _interopRequireDefault(require("./header-bar"));
var _datePicker = _interopRequireDefault(require("./date-picker"));
var _table = _interopRequireDefault(require("./table"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
var _myxss = _interopRequireDefault(require("./myxss"));
var _section = _interopRequireDefault(require("./section"));
var _signature = _interopRequireDefault(require("./signature2"));
var _fileUpload = _interopRequireDefault(require("./fileUpload2"));
var _datasource = _interopRequireDefault(require("./datasource"));
var _imageUpload = _interopRequireDefault(require("./imageUpload"));
var _debouncedInput = _interopRequireDefault(require("./debouncedInput"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormElements = {};

// class Header extends React.Component {
//   render() {
//     // const headerClasses = `dynamic-input ${this.props.data.element}-input`;
//     let classNames = "static";
//     if (this.props.data.bold) {
//       classNames += " bold";
//     }
//     if (this.props.data.italic) {
//       classNames += " italic";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <h3
//           className={classNames}
//           dangerouslySetInnerHTML={{
//             __html: myxss.process(this.props.data.content),
//           }}
//         />
//       </div>
//     );
//   }
// }

function Header(props) {
  var classNames = "static";
  if (props.data.bold) {
    classNames += " bold";
  }
  if (props.data.italic) {
    classNames += " italic";
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("h3", {
    className: classNames,
    dangerouslySetInnerHTML: {
      __html: _myxss["default"].process(props.data.content)
    }
  }));
}

// class Paragraph extends React.Component {
//   render() {
//     let classNames = "static";
//     if (this.props.data.bold) {
//       classNames += " bold";
//     }
//     if (this.props.data.italic) {
//       classNames += " italic";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <p
//           className={classNames}
//           dangerouslySetInnerHTML={{
//             __html: myxss.process(this.props.data.content),
//           }}
//         />
//       </div>
//     );
//   }
// }

function Paragraph(props) {
  var classNames = "static";
  if (props.data.bold) {
    classNames += " bold";
  }
  if (props.data.italic) {
    classNames += " italic";
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("p", {
    className: classNames,
    dangerouslySetInnerHTML: {
      __html: _myxss["default"].process(props.data.content)
    }
  }));
}

// class Label extends React.Component {
//   render() {
//     let classNames = "static";
//     if (this.props.data.bold) {
//       classNames += " bold";
//     }
//     if (this.props.data.italic) {
//       classNames += " italic";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <label
//           className={classNames}
//           dangerouslySetInnerHTML={{
//             __html: myxss.process(this.props.data.content),
//           }}
//         />
//       </div>
//     );
//   }
// }

function Label(props) {
  var classNames = "static" + (props.data.bold ? " bold" : "") + (props.data.italic ? " italic" : "");
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("label", {
    className: classNames,
    dangerouslySetInnerHTML: {
      __html: _myxss["default"].process(props.data.content)
    }
  }));
}

// class LineBreak extends React.Component {
//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <hr />
//       </div>
//     );
//   }
// }

function LineBreak(props) {
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("hr", null));
}

// class TextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.type = "text";
//     props.className = "form-control";
//     props.name = this.props.data.field_name;
//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <input {...props} />
//         </div>
//       </div>
//     );
//   }
// }

var TextInput = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var inputProps = {
    type: "text",
    className: "form-control",
    name: props.data.field_name
  };
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = ref;
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("input", inputProps)));
});

// class NumberInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.type = "number";
//     props.className = "form-control";
//     props.name = this.props.data.field_name;

//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     //if (this.props.read_only) {
//     //  props.disabled = "disabled";
//     //}

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <input {...props} />
//         </div>
//       </div>
//     );
//   }
// }

var NumberInput = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var inputProps = {
    type: "number",
    className: "form-control",
    name: props.data.field_name
  };
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = ref;
  }
  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("input", inputProps)));
});

// class TextArea extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }
//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.className = "form-control";
//     props.name = this.props.data.field_name;

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     if (this.props.mutable) {
//       props.defaultValue = this.props.defaultValue;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <TextAreaAutosize {...props} />
//         </div>
//       </div>
//     );
//   }
// }

var TextArea = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var inputProps = {};
  inputProps.className = "form-control";
  inputProps.name = props.data.field_name;
  if (props.read_only || !isSameEditor) {
    inputProps.disabled = "disabled";
  }
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = ref;
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement(_reactTextareaAutosize["default"], inputProps)));
});

// class Dropdown extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();

//     this.state = {
//       defaultValue: props.defaultValue,
//       value: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     console.log("Dropdown getDerivedStateFromProps");
//     if (
//       JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
//     ) {
//       console.log(
//         "Dropdown default prop changed",
//         state.defaultValue,
//         props.defaultValue
//       );
//       return {
//         defaultValue: props.defaultValue,
//         value: props.defaultValue,
//       };
//     }
//     return state;
//   }

//   handleChange = (e) => {
//     this.setState({ value: e.target.value });
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.className = "form-control";
//     props.name = this.props.data.field_name;
//     props.value = this.state.value;
//     props.onChange = this.handleChange;

//     if (this.props.mutable) {
//       props.defaultValue = this.state.value;
//       props.ref = this.inputField;
//     }

//     if (this.props.read_only || !isSameEditor) {
//       props.disabled = "disabled";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <select {...props}>
//             <option value="" key="default-0">
//               Please Select
//             </option>
//             {this.props.data.options.map((option) => {
//               const this_key = `preview_${option.key}`;
//               return (
//                 <option value={option.value} key={this_key}>
//                   {option.text}
//                 </option>
//               );
//             })}
//           </select>
//         </div>
//       </div>
//     );
//   }
// }

var Dropdown = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var _useState = (0, _react.useState)(props.defaultValue),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    defaultValue = _useState2[0],
    setDefaultValue = _useState2[1];
  var _useState3 = (0, _react.useState)(props.defaultValue),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    value = _useState4[0],
    setValue = _useState4[1];
  (0, _react.useEffect)(function () {
    console.log("Dropdown getDerivedStateFromProps");
    if (JSON.stringify(defaultValue) !== JSON.stringify(props.defaultValue)) {
      console.log("Dropdown default prop changed", defaultValue, props.defaultValue);
      setDefaultValue(props.defaultValue);
      setValue(props.defaultValue);
    }
  }, [defaultValue, props.defaultValue]);
  var handleChange = function handleChange(e) {
    setValue(e.target.value);
  };
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var baseClasses = "SortableItem rfb-item" + (props.data.pageBreakBefore ? " alwaysbreak" : "");
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("select", {
    className: "form-control",
    name: props.data.field_name,
    value: value,
    onChange: handleChange,
    defaultValue: value,
    ref: ref,
    disabled: props.read_only || !isSameEditor
  }, /*#__PURE__*/_react["default"].createElement("option", {
    value: "",
    key: "default-0"
  }, "Please Select"), props.data.options.map(function (option) {
    var this_key = "preview_".concat(option.key);
    return /*#__PURE__*/_react["default"].createElement("option", {
      value: option.value,
      key: this_key
    }, option.text);
  }))));
});
var Signature = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Signature, _React$Component);
  var _super = _createSuper(Signature);
  function Signature(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Signature);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "clear", function () {
      if (_this.state.defaultValue) {
        _this.setState({
          defaultValue: ""
        });
      } else if (_this.canvas.current) {
        _this.canvas.current.clear();
      }
    });
    _this.state = {
      defaultValue: props.defaultValue
    };
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.canvas = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }
  (0, _createClass2["default"])(Signature, [{
    key: "render",
    value: function render() {
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var defaultValue = this.state.defaultValue;
      var canClear = !!defaultValue;
      var props = {};
      props.type = "hidden";
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
        canClear = !this.props.read_only || isSameEditor;
      }
      if (this.props.read_only || !isSameEditor) {
        props.disabled = "disabled";
      }
      var baseClasses = "SortableItem rfb-item";
      if (this.props.data.pageBreakBefore) {
        baseClasses += " alwaysbreak";
      }
      var sourceDataURL;
      if (defaultValue && defaultValue.length > 0) {
        sourceDataURL = "data:image/png;base64,".concat(defaultValue);
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
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
}(_react["default"].Component); // const Signature = forwardRef((props, ref) => {
//   const [defaultValue, setDefaultValue] = useState(props.defaultValue);
//   const canvas = useRef();
//   const clear = () => {
//     if (defaultValue) {
//       setDefaultValue("");
//     } else if (canvas.current) {
//       canvas.current.clear();
//     }
//   };
//   const userProperties =
//     props.getActiveUserProperties && props.getActiveUserProperties();
//   const savedEditor = props.editor;
//   let isSameEditor = true;
//   if (savedEditor && savedEditor.userId && !!userProperties) {
//     isSameEditor = userProperties.userId === savedEditor.userId;
//   }
//   let canClear = !!defaultValue;
//   const inputProps = {};
//   inputProps.type = "hidden";
//   inputProps.name = props.data.field_name;
//   if (props.mutable) {
//     inputProps.defaultValue = defaultValue;
//     inputProps.ref = ref;
//   }
//   const padProps = {};
//   if (props.mutable) {
//     padProps.defaultValue = defaultValue;
//     padProps.ref = canvas;
//     canClear = !props.read_only || isSameEditor;
//   }
//   if (props.read_only || !isSameEditor) {
//     inputProps.disabled = "disabled";
//   }
//   let baseClasses = "SortableItem rfb-item";
//   if (props.data.pageBreakBefore) {
//     baseClasses += " alwaysbreak";
//   }
//   let sourceDataURL;
//   if (defaultValue && defaultValue.length > 0) {
//     sourceDataURL = `data:image/png;base64,${defaultValue}`;
//   }
//   return (
//     <div className={baseClasses}>
//       <ComponentHeader {...props} />
//       <div className="form-group">
//         <ComponentLabel {...props} />
//         {props.read_only === true || !isSameEditor || !!sourceDataURL ? (
//           <img src={sourceDataURL} />
//         ) : (
//           <SignaturePad {...padProps} />
//         )}
//         {canClear && (
//           <i
//             className="fas fa-times clear-signature"
//             onClick={clear}
//             title="Clear Signature"
//           ></i>
//         )}
//         <input {...inputProps} />
//       </div>
//     </div>
//   );
// });
// class Tags extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//     const { defaultValue, data } = props;
//     this.state = { value: this.getDefaultValue(defaultValue, data.options) };
//   }
//   getDefaultValue(defaultValue, options) {
//     if (defaultValue) {
//       if (typeof defaultValue === "string") {
//         const vals = defaultValue.split(",").map((x) => x.trim());
//         return options.filter((x) => vals.indexOf(x.value) > -1);
//       }
//       return options.filter((x) => defaultValue.indexOf(x.value) > -1);
//     }
//     return [];
//   }
//   // state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };
//   handleChange = (e) => {
//     this.setState({ value: e || [] });
//   };
//   render() {
//     const options = this.props.data.options.map((option) => {
//       option.label = option.text;
//       return option;
//     });
//     const props = {};
//     props.isMulti = true;
//     props.name = this.props.data.field_name;
//     props.onChange = this.handleChange;
//     props.options = options;
//     if (!this.props.mutable) {
//       props.value = options[0].text;
//     } // to show a sample of what tags looks like
//     if (this.props.mutable) {
//       //props.isDisabled = this.props.read_only;
//       props.isDisabled = this.props.read_only || !isSameEditor ? true : false;
//       props.value = this.state.value;
//       props.ref = this.inputField;
//     }
//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }
//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <Select {...props} />
//         </div>
//       </div>
//     );
//   }
// }
var Tags = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var _useState5 = (0, _react.useState)(getDefaultValue(props.defaultValue, props.data.options)),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    value = _useState6[0],
    setValue = _useState6[1];
  function getDefaultValue(defaultValue, options) {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        var vals = defaultValue.split(",").map(function (x) {
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
  var handleChange = function handleChange(e) {
    setValue(e || []);
  };
  var options = props.data.options.map(function (option) {
    option.label = option.text;
    return option;
  });
  var selectProps = {
    isMulti: true,
    name: props.data.field_name,
    onChange: handleChange,
    options: options,
    value: value
  };
  if (!props.mutable) {
    selectProps.value = options[0].text;
  }
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  if (props.mutable) {
    selectProps.isDisabled = props.read_only || !isSameEditor ? true : false;
    selectProps.value = value;
    selectProps.ref = ref;
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], selectProps)));
});

// class Checkboxes extends React.Component {
//   constructor(props) {
//     super(props);
//     this.options = {};
//     this.infos = {};
//     this.state = {
//       defaultValue: props.defaultValue,
//       value: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     console.log("Checkboxes getDerivedStateFromProps");
//     if (
//       JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
//     ) {
//       console.log(
//         "Checkboxes default prop changed",
//         state.defaultValue,
//         props.defaultValue
//       );
//       return {
//         defaultValue: props.defaultValue,
//         value: props.defaultValue,
//       };
//     }
//     return state;
//   }

//   getActiveValue = (values, key) => {
//     return values?.find((item) => item.key === key);
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const self = this;
//     let classNames = "custom-control custom-checkbox";
//     if (this.props.data.inline) {
//       classNames += " option-inline";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel className="form-label" {...this.props} />
//           {this.props.data.options.map((option) => {
//             const this_key = `preview_${option.key}`;

//             const props = {};
//             props.name = `option_${option.key}`;
//             props.type = "checkbox";
//             props.value = option.value;

//             const answerItem = self.getActiveValue(
//               self.state.value,
//               option.key
//             );

//             if (self.props.mutable) {
//               props.checked = answerItem?.value ?? false;
//             }

//             //if (this.props.read_only) {
//             //  props.disabled = "disabled";
//             //}

//             if (this.props.read_only || !isSameEditor) {
//               props.disabled = "disabled";
//             }

//             console.log("Checkbox =>> ", props);

//             return (
//               <div
//                 className={classNames}
//                 key={this_key}
//                 style={{ display: "flex", alignItems: "center" }}
//               >
//                 <input
//                   id={"fid_" + this_key}
//                   className="custom-control-input"
//                   ref={(c) => {
//                     if (c && self.props.mutable) {
//                       self.options[`child_ref_${option.key}`] = c;
//                     }
//                   }}
//                   onChange={() => {
//                     if (isSameEditor) {
//                       self.setState((current) => {
//                         const activeVal = self.getActiveValue(
//                           current && current.value,
//                           option.key
//                         );
//                         const newActiveVal = activeVal
//                           ? { ...activeVal, value: !activeVal.value }
//                           : {
//                               key: option.key,
//                               value: true,
//                               info: "",
//                             };

//                         if (!current) {
//                           return current;
//                         }

//                         return {
//                           ...current,
//                           value: [
//                             ...(current.value || []).filter(
//                               (item) => item.key !== option.key
//                             ),
//                             newActiveVal,
//                           ],
//                         };
//                       });
//                     }
//                   }x}
//                   {...props}
//                 />
//                 <label
//                   className="custom-control-label"
//                   htmlFor={"fid_" + this_key}
//                 >
//                   {option.text}
//                 </label>
//                 {props.checked && option.info && (
//                   <input
//                     id={"fid_" + this_key + "_info"}
//                     type="text"
//                     class="form-control"
//                     style={{
//                       width: "auto",
//                       marginLeft: 16,
//                       height: "calc(1.5em + .5rem)",
//                       marginBottom: 4,
//                     }}
//                     defaultValue={answerItem.info ?? ""}
//                     ref={(c) => {
//                       if (c && self.props.mutable) {
//                         self.infos[`child_ref_${option.key}_info`] = c;
//                       }
//                     }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

var Checkboxes = /*#__PURE__*/(0, _react.forwardRef)(function (props, _ref) {
  var _useFormContext = (0, _index.useFormContext)(),
    dispatch = _useFormContext.dispatch;
  var _useState7 = (0, _react.useState)(props.defaultValue),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    value = _useState8[0],
    setValue = _useState8[1];
  var getActiveValue = function getActiveValue(values, key) {
    var _values$value;
    return values === null || values === void 0 ? void 0 : (_values$value = values.value) === null || _values$value === void 0 ? void 0 : _values$value.find(function (item) {
      return item.key === key;
    });
  };
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var classNames = "custom-control custom-checkbox";
  if (props.data.inline) {
    classNames += " option-inline";
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  var handleChange = function handleChange(option) {
    if (isSameEditor) {
      var newVal;
      setValue(function (current) {
        var activeVal = getActiveValue(current, option.key);
        var newActiveVal = activeVal ? _objectSpread(_objectSpread({}, activeVal), {}, {
          value: !activeVal.value,
          info: activeVal.value ? "" : activeVal.info
        }) : {
          key: option.key,
          value: true,
          info: ""
        };
        newVal = _objectSpread(_objectSpread({}, current || {}), {}, {
          value: [].concat((0, _toConsumableArray2["default"])((current && current.value || []).filter(function (item) {
            return item.key !== option.key;
          })), [newActiveVal])
        });
        dispatch({
          type: _index.FORM_ACTION.UPDATE_VALUE,
          name: props.data.field_name,
          value: newVal
        });
        return newVal;
      });
    }
  };
  var handleInputChange = function handleInputChange(option, valueInfo) {
    if (!isSameEditor) {
      return;
    }
    var newVal;
    setValue(function (current) {
      var activeVal = getActiveValue(current, option.key);
      var newActiveVal = activeVal ? _objectSpread(_objectSpread({}, activeVal), {}, {
        info: valueInfo
      }) : {
        key: option.key,
        value: true,
        info: valueInfo
      };
      newVal = _objectSpread(_objectSpread({}, current || {}), {}, {
        value: [].concat((0, _toConsumableArray2["default"])((current && current.value || []).filter(function (item) {
          return item.key !== option.key;
        })), [newActiveVal])
      });
      dispatch({
        type: _index.FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal
      });
      return newVal;
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
    className: "form-label"
  }, props)), props.data.options.map(function (option) {
    var _answerItem$info;
    var this_key = "preview_".concat(option.key);
    var inputProps = {
      name: "option_".concat(option.key),
      type: "checkbox",
      value: option.value
    };
    var answerItem = getActiveValue(value, option.key);
    if (props.mutable) {
      var _answerItem$value;
      inputProps.checked = (_answerItem$value = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value !== void 0 ? _answerItem$value : false;
    }
    if (props.read_only || !isSameEditor) {
      inputProps.disabled = "disabled";
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: classNames,
      key: this_key,
      style: {
        display: "flex",
        alignItems: "center"
      }
    }, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({
      id: "fid_" + this_key,
      className: "custom-control-input",
      ref: function ref(c) {
        if (c && props.mutable) {
          _ref["child_ref_".concat(option.key)] = c;
        }
      },
      onChange: function onChange() {
        return handleChange(option);
      }
    }, inputProps)), /*#__PURE__*/_react["default"].createElement("label", {
      className: "custom-control-label",
      htmlFor: "fid_" + this_key
    }, option.text), inputProps.checked && option.info && /*#__PURE__*/_react["default"].createElement(_debouncedInput["default"], {
      id: "fid_" + this_key + "_info",
      style: {
        width: "auto",
        marginLeft: 16,
        height: "calc(1.5em + .5rem)",
        marginBottom: 4
      },
      onChange: function onChange(value) {
        handleInputChange(option, value);
      },
      value: (_answerItem$info = answerItem.info) !== null && _answerItem$info !== void 0 ? _answerItem$info : ""
    }));
  })));
});

// class RadioButtons extends React.Component {
//   constructor(props) {
//     super(props);
//     this.options = {};
//     this.infos = {};
//     this.state = {
//       defaultValue: props.defaultValue,
//       value: props.defaultValue,
//     };
//   }

//   static getDerivedStateFromProps(props, state) {
//     console.log("RadioButtons getDerivedStateFromProps");
//     if (
//       JSON.stringify(state.defaultValue) !== JSON.stringify(props.defaultValue)
//     ) {
//       console.log(
//         "RadioButtons default prop changed",
//         state.defaultValue,
//         props.defaultValue
//       );
//       return {
//         defaultValue: props.defaultValue,
//         value: props.defaultValue,
//       };
//     }
//     return state;
//   }

//   getActiveValue = (values, key) => {
//     return values?.find((item) => item.key === key);
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const self = this;
//     let classNames = "custom-control custom-radio";
//     if (this.props.data.inline) {
//       classNames += " option-inline";
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel className="form-label" {...this.props} />
//           {this.props.data.options.map((option) => {
//             const this_key = `preview_${option.key}`;
//             const props = {};
//             props.name = self.props.data.field_name;

//             props.type = "radio";
//             props.value = option.value;

//             const answerItem = self.getActiveValue(
//               self.state.value,
//               option.key
//             );

//             if (self.props.mutable) {
//               props.checked = answerItem?.value ?? false;
//             }
//             //if (this.props.read_only) {
//             //  props.disabled = "disabled";
//             //}
//             if (this.props.read_only || !isSameEditor) {
//               props.disabled = "disabled";
//             }

//             console.log("Radio =>> ", props);

//             return (
//               <div
//                 className={classNames}
//                 key={this_key}
//                 style={{ display: "flex", alignItems: "center" }}
//               >
//                 <input
//                   id={"fid_" + this_key}
//                   className="custom-control-input"
//                   ref={(c) => {
//                     if (c && self.props.mutable) {
//                       self.options[`child_ref_${option.key}`] = c;
//                     }
//                   }}
//                   onChange={() => {
//                     self.setState((current) => {
//                       return {
//                         ...current,
//                         value: [
//                           {
//                             key: option.key,
//                             value: true,
//                             info: "",
//                           },
//                         ],
//                       };
//                     });
//                   }}
//                   {...props}
//                 />
//                 <label
//                   className="custom-control-label"
//                   htmlFor={"fid_" + this_key}
//                 >
//                   {option.text}
//                 </label>
//                 {props.checked && option.info && (
//                   <input
//                     id={"fid_" + this_key + "_info"}
//                     type="text"
//                     class="form-control"
//                     style={{
//                       width: "auto",
//                       marginLeft: 16,
//                       height: "calc(1.5em + .5rem)",
//                     }}
//                     defaultValue={answerItem.info ?? ""}
//                     ref={(c) => {
//                       if (c && self.props.mutable) {
//                         self.infos[`child_ref_${option.key}_info`] = c;
//                       }
//                     }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

function RadioButtons(props) {
  var _useFormContext2 = (0, _index.useFormContext)(),
    dispatch = _useFormContext2.dispatch;
  var _useState9 = (0, _react.useState)(props.defaultValue),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    value = _useState10[0],
    setValue = _useState10[1];

  // useEffect(() => {
  //   console.log("RadioButtons getDerivedStateFromProps");
  //   if (JSON.stringify(defaultValue) !== JSON.stringify(props.defaultValue)) {
  //     console.log(
  //       "RadioButtons default prop changed",
  //       defaultValue,
  //       props.defaultValue
  //     );
  //     setDefaultValue(props.defaultValue);
  //     setValue(props.defaultValue);
  //   }
  // }, [defaultValue, props.defaultValue]);

  var getActiveValue = function getActiveValue(values, key) {
    return (values || {}).key === key ? values : null;
  };
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var classNames = "custom-control custom-radio";
  if (props.data.inline) {
    classNames += " option-inline";
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  var handleChange = function handleChange(option) {
    if (!isSameEditor) {
      return;
    }
    setValue(function (current) {
      var activeVal = getActiveValue(current, option.key);
      var newActiveVal = {
        key: option.key,
        value: true,
        info: activeVal !== null && activeVal !== void 0 && activeVal.value ? activeVal.info : ""
      };
      dispatch({
        type: _index.FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: {
          value: [newActiveVal]
        }
      });
      return newActiveVal;
    });
  };
  var handleInputChange = function handleInputChange(option, valueInfo) {
    if (!isSameEditor) {
      return;
    }
    setValue(function () {
      var newActiveVal = {
        key: option.key,
        value: true,
        info: valueInfo
      };
      dispatch({
        type: _index.FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: {
          value: [newActiveVal]
        }
      });
      return newActiveVal;
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({
    className: "form-label"
  }, props)), props.data.options.map(function (option) {
    var _answerItem$info2;
    var this_key = "preview_".concat(option.key);
    var inputProps = {};
    inputProps.name = props.data.field_name;
    inputProps.type = "radio";
    inputProps.value = option.value;
    var answerItem = getActiveValue(value, option.key);
    if (props.mutable) {
      var _answerItem$value2;
      inputProps.checked = (_answerItem$value2 = answerItem === null || answerItem === void 0 ? void 0 : answerItem.value) !== null && _answerItem$value2 !== void 0 ? _answerItem$value2 : false;
    }
    if (props.read_only || !isSameEditor) {
      inputProps.disabled = "disabled";
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: classNames,
      key: this_key,
      style: {
        display: "flex",
        alignItems: "center"
      }
    }, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({
      id: "fid_" + this_key,
      className: "custom-control-input",
      onChange: function onChange() {
        return handleChange(option);
      }
    }, inputProps)), /*#__PURE__*/_react["default"].createElement("label", {
      className: "custom-control-label",
      htmlFor: "fid_" + this_key
    }, option.text), inputProps.checked && option.info && /*#__PURE__*/_react["default"].createElement(_debouncedInput["default"], {
      id: "fid_" + this_key + "_info",
      style: {
        width: "auto",
        marginLeft: 16,
        height: "calc(1.5em + .5rem)"
      },
      onChange: function onChange(value) {
        handleInputChange(option, value);
      },
      value: (_answerItem$info2 = answerItem.info) !== null && _answerItem$info2 !== void 0 ? _answerItem$info2 : ""
    }));
  })));
}

// const Image = (props) => {
//   const style = props.data.center ? { textAlign: "center" } : null;

//   let baseClasses = "SortableItem rfb-item";
//   if (props.data.pageBreakBefore) {
//     baseClasses += " alwaysbreak";
//   }

//   return (
//     <div className={baseClasses} style={style}>
//       <ComponentHeader {...props} />
//       {props.data.src && (
//         <img
//           style={{ maxWidth: "100%", height: "auto" }}
//           src={props.data.src}
//           width={props.data.width}
//           height={props.data.height}
//         />
//       )}
//       {!props.data.src && <div className="no-image">No Image</div>}
//     </div>
//   );
// };

var Image = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var style = props.data.center ? {
    textAlign: "center"
  } : null;
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses,
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), props.data.src && /*#__PURE__*/_react["default"].createElement("img", {
    // ref={ref}
    style: {
      maxWidth: "100%",
      height: "auto"
    },
    src: props.data.src,
    width: props.data.width,
    height: props.data.height
  }), !props.data.src && /*#__PURE__*/_react["default"].createElement("div", {
    className: "no-image"
  }, "No Image"));
});

// class Rating extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//   }

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const props = {};
//     props.name = this.props.data.field_name;
//     props.ratingAmount = 5;

//     if (this.props.mutable) {
//       props.rating =
//         this.props.defaultValue !== undefined
//           ? parseFloat(this.props.defaultValue, 10)
//           : 0;
//       props.editing = true;
//       //props.disabled = this.props.read_only ||;
//       props.disabled = this.props.read_only || !isSameEditor ? true : false;
//       props.ref = this.inputField;
//     }

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <StarRating {...props} />
//         </div>
//       </div>
//     );
//   }
// }

var Rating = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var ratingProps = {};
  ratingProps.name = props.data.field_name;
  ratingProps.ratingAmount = 5;
  if (props.mutable) {
    ratingProps.rating = props.defaultValue !== undefined ? parseFloat(props.defaultValue, 10) : 0;
    ratingProps.editing = true;
    ratingProps.disabled = props.read_only || !isSameEditor ? true : false;
    ratingProps.ref = ref;
  }
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement(_starRating["default"], ratingProps)));
});

// class HyperLink extends React.Component {
//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <a target="_blank" href={this.props.data.href}>
//             {this.props.data.content}
//           </a>
//         </div>
//       </div>
//     );
//   }
// }

var HyperLink = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    target: "_blank",
    href: props.data.href
  }, props.data.content)));
});
var Download = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2["default"])(Download, _React$Component2);
  var _super2 = _createSuper(Download);
  function Download() {
    (0, _classCallCheck2["default"])(this, Download);
    return _super2.apply(this, arguments);
  }
  (0, _createClass2["default"])(Download, [{
    key: "render",
    value: function render() {
      var baseClasses = "SortableItem rfb-item";
      if (this.props.data.pageBreakBefore) {
        baseClasses += " alwaysbreak";
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
}(_react["default"].Component); // const Download = forwardRef((props, ref) => {
//   // not working
//   let baseClasses = "SortableItem rfb-item";
//   if (props.data.pageBreakBefore) {
//     baseClasses += " alwaysbreak";
//   }
//   return (
//     <div className={baseClasses}>
//       <ComponentHeader {...props} />
//       <div className="form-group">
//         <a href={`${props.download_path}?id=${props.data.file_path}`}>
//           {props.data.content}
//         </a>
//       </div>
//     </div>
//   );
// });
// class Camera extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { img: null };
//   }
//   displayImage = (e) => {
//     const self = this;
//     const target = e.target;
//     let file;
//     let reader;
//     if (target.files && target.files.length) {
//       file = target.files[0];
//       // eslint-disable-next-line no-undef
//       reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         self.setState({
//           img: reader.result,
//         });
//       };
//     }
//   };
//   clearImage = () => {
//     this.setState({
//       img: null,
//     });
//   };
//   render() {
//     let baseClasses = "SortableItem rfb-item";
//     const name = this.props.data.field_name;
//     const fileInputStyle = this.state.img ? { display: "none" } : null;
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }
//     let sourceDataURL;
//     if (
//       this.props.read_only === true &&
//       this.props.defaultValue &&
//       this.props.defaultValue.length > 0
//     ) {
//       if (this.props.defaultValue.indexOf(name > -1)) {
//         sourceDataURL = this.props.defaultValue;
//       } else {
//         sourceDataURL = `data:image/png;base64,${this.props.defaultValue}`;
//       }
//     }
//     console.log("sourceDataURL", sourceDataURL);
//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           {this.props.read_only === true &&
//           this.props.defaultValue &&
//           this.props.defaultValue.length > 0 ? (
//             <div>
//               <img src={sourceDataURL} />
//             </div>
//           ) : (
//             <div className="image-upload-container">
//               <div style={fileInputStyle}>
//                 <input
//                   name={name}
//                   type="file"
//                   accept="image/*"
//                   capture="camera"
//                   className="image-upload"
//                   onChange={this.displayImage}
//                 />
//                 <div className="image-upload-control">
//                   <div className="btn btn-default">
//                     <i className="fas fa-camera"></i> Upload Photo
//                   </div>
//                   <p>Select an image from your computer or device.</p>
//                 </div>
//               </div>
//               {this.state.img && (
//                 <div>
//                   <img
//                     src={this.state.img}
//                     height="100"
//                     className="image-upload-preview"
//                   />
//                   <br />
//                   <div
//                     className="btn btn-image-clear"
//                     onClick={this.clearImage}
//                   >
//                     <i className="fas fa-times"></i> Clear Photo
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }
var Camera = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var _useState11 = (0, _react.useState)(null),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    img = _useState12[0],
    setImg = _useState12[1];
  function displayImage(e) {
    var target = e.target;
    var file;
    var reader;
    if (target.files && target.files.length) {
      file = target.files[0];
      reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setImg(reader.result);
      };
    }
  }
  function clearImage() {
    setImg(null);
  }
  var baseClasses = "SortableItem rfb-item";
  var name = props.data.field_name;
  var fileInputStyle = img ? {
    display: "none"
  } : null;
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  var sourceDataURL;
  if (props.read_only === true && props.defaultValue && props.defaultValue.length > 0) {
    if (props.defaultValue.indexOf(name > -1)) {
      sourceDataURL = props.defaultValue;
    } else {
      sourceDataURL = "data:image/png;base64,".concat(props.defaultValue);
    }
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), props.read_only === true && props.defaultValue && props.defaultValue.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("img", {
    src: sourceDataURL,
    ref: ref
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
    className: "image-upload-preview",
    ref: ref
  }), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn btn-image-clear",
    onClick: clearImage
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-times"
  }), " Clear Photo")))));
});

// class Range extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();
//     this.state = {
//       value:
//         props.defaultValue !== undefined
//           ? parseInt(props.defaultValue, 10)
//           : parseInt(props.data.default_value, 10),
//     };
//   }

//   changeValue = (e) => {
//     const { target } = e;
//     this.setState({
//       value: target.value,
//     });
//   };

//   render() {
//     const props = {};
//     const name = this.props.data.field_name;

//     props.type = "range";
//     props.list = `tickmarks_${name}`;
//     props.min = this.props.data.min_value;
//     props.max = this.props.data.max_value;
//     props.step = this.props.data.step;

//     props.value = this.state.value;
//     props.change = this.changeValue;

//     if (this.props.mutable) {
//       props.ref = this.inputField;
//     }

//     const datalist = [];
//     for (
//       let i = parseInt(props.min_value, 10);
//       i <= parseInt(props.max_value, 10);
//       i += parseInt(props.step, 10)
//     ) {
//       datalist.push(i);
//     }

//     const oneBig = 100 / (datalist.length - 1);

//     const _datalist = datalist.map((d, idx) => (
//       <option key={`${props.list}_${idx}`}>{d}</option>
//     ));

//     const visible_marks = datalist.map((d, idx) => {
//       const option_props = {};
//       let w = oneBig;
//       if (idx === 0 || idx === datalist.length - 1) {
//         w = oneBig / 2;
//       }
//       option_props.key = `${props.list}_label_${idx}`;
//       option_props.style = { width: `${w}%` };
//       if (idx === datalist.length - 1) {
//         option_props.style = { width: `${w}%`, textAlign: "right" };
//       }
//       return <label {...option_props}>{d}</label>;
//     });

//     let baseClasses = "SortableItem rfb-item";
//     if (this.props.data.pageBreakBefore) {
//       baseClasses += " alwaysbreak";
//     }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <div className="form-group">
//           <ComponentLabel {...this.props} />
//           <div className="range">
//             <div className="clearfix">
//               <span className="float-left">{this.props.data.min_label}</span>
//               <span className="float-right">{this.props.data.max_label}</span>
//             </div>
//             <ReactBootstrapSlider {...props} />
//           </div>
//           <div className="visible_marks">{visible_marks}</div>
//           <input name={name} value={this.state.value} type="hidden" />
//           <datalist id={props.list}>{_datalist}</datalist>
//         </div>
//       </div>
//     );
//   }
// }

var Range = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var _useState13 = (0, _react.useState)(props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.default_value, 10)),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    value = _useState14[0],
    setValue = _useState14[1];
  var changeValue = function changeValue(e) {
    var target = e.target;
    setValue(target.value);
  };
  var name = props.data.field_name;
  var rangeProps = {
    type: "range",
    list: "tickmarks_".concat(name),
    min: props.data.min_value,
    max: props.data.max_value,
    step: props.data.step,
    value: value,
    change: changeValue
  };

  // if (props.mutable) {
  //   rangeProps.ref = ref;
  // }

  var datalist = [];
  for (var i = parseInt(rangeProps.min_value, 10); i <= parseInt(rangeProps.max_value, 10); i += parseInt(rangeProps.step, 10)) {
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
        textAlign: "right"
      };
    }
    return /*#__PURE__*/_react["default"].createElement("label", option_props, d);
  });
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "range"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "clearfix"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "float-left"
  }, props.data.min_label), /*#__PURE__*/_react["default"].createElement("span", {
    className: "float-right"
  }, props.data.max_label)), /*#__PURE__*/_react["default"].createElement(_reactBootstrapSlider["default"], rangeProps)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "visible_marks"
  }, visible_marks), /*#__PURE__*/_react["default"].createElement("input", {
    name: name,
    value: value,
    type: "hidden",
    ref: ref
  }), /*#__PURE__*/_react["default"].createElement("datalist", {
    id: rangeProps.list
  }, _datalist)));
});
FormElements.Header = Header; // migrated, no value
FormElements.HeaderBar = _headerBar["default"]; // migrated, no value
FormElements.Paragraph = Paragraph; // migrated, no value
FormElements.Label = Label; // migrated, no value
FormElements.LineBreak = LineBreak; // migrated, no value
FormElements.Image = Image; // migrated, no value
FormElements.HyperLink = HyperLink; // migrated, no value
FormElements.Section = _section["default"]; // migrated, no value

FormElements.TextInput = TextInput; // migrated, value done
FormElements.NumberInput = NumberInput; // migrated, value done
FormElements.TextArea = TextArea; // migrated, value done
FormElements.Dropdown = Dropdown; // migrated, value done
FormElements.DatePicker = _datePicker["default"]; // migrated, value done
FormElements.Tags = Tags; // migrated, value done
FormElements.Camera = Camera; // migrated, value done
FormElements.Range = Range; // migrated, value done
// FormElements.FileUpload = FileUpload; // migrated, value done
FormElements.Checkboxes = Checkboxes; // migrated, value done
FormElements.RadioButtons = RadioButtons; // migrated, value done
// FormElements.Signature2 = Signature2; // migrated, value done

FormElements.DataSource = _datasource["default"]; // not migrated yet, value failed
FormElements.ImageUpload = _imageUpload["default"]; // not migrated yet, value failed

FormElements.Download = Download; // =======>>> not migrate
FormElements.Rating = Rating; //  =======>>> not migrate
FormElements.Table = _table["default"]; // =======>>> not migrate
FormElements.Signature = Signature; // =======>>> not migrate, no used
var _default = FormElements;
exports["default"] = _default;