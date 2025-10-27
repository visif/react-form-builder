"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } // TODO: Replace react-image-lightbox with React 18 compatible alternative
// import Lightbox from 'react-image-lightbox'
// import 'react-image-lightbox/style.css'
// This only needs to be imported once in your app
var ImageUpload = /*#__PURE__*/function (_React$Component) {
  function ImageUpload(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ImageUpload);
    _this = _callSuper(this, ImageUpload, [props]);
    (0, _defineProperty2["default"])(_this, "onRemoveImage", function () {
      if (!confirm('Confirm delete?')) {
        return;
      }
      _this.setState(function () {
        return {
          filePath: '',
          fileName: '',
          blobUrl: ''
        };
      });
    });
    (0, _defineProperty2["default"])(_this, "uploadImageFile", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
        var file, extension, filePath, blobUrl;
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              event.persist();
              if (!(!event || !event.target || !event.target.files)) {
                _context.next = 1;
                break;
              }
              return _context.abrupt("return");
            case 1:
              file = Array.from(event.target.files)[0];
              if (!(typeof _this.props.onUploadImage !== 'function')) {
                _context.next = 2;
                break;
              }
              console.log('onUploadImage >>>>> no upload function found', _this.props.onUploadImage);
              return _context.abrupt("return");
            case 2:
              console.log('Uploading image .....');
              extension = "".concat(file.name).substring(file.name.lastIndexOf('.'));
              _context.next = 3;
              return _this.props.onUploadImage(file);
            case 3:
              filePath = _context.sent;
              blobUrl = URL.createObjectURL(file);
              _this.setState({
                fileName: file.name,
                blobUrl: blobUrl,
                filePath: "".concat(filePath).concat(extension)
              });
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    _this.inputField = /*#__PURE__*/_react["default"].createRef(null);
    var _filePath = props.defaultValue && props.defaultValue.filePath;
    var fileName = props.defaultValue && props.defaultValue.fileName;
    var _blobUrl = props.defaultValue && props.defaultValue.blobUrl;
    _this.state = {
      defaultValue: props.defaultValue,
      filePath: _filePath,
      fileName: fileName,
      blobUrl: _blobUrl,
      isOpen: false
    };
    return _this;
  }
  (0, _inherits2["default"])(ImageUpload, _React$Component);
  return (0, _createClass2["default"])(ImageUpload, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : '')
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn is-isolated",
        onClick: this.onRemoveImage,
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          display: this.state.filePath ? '' : 'none'
        }
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "is-isolated fas fa-trash"
      })), /*#__PURE__*/_react["default"].createElement("img", {
        style: {
          width: '100%',
          cursor: 'pointer'
        },
        onClick: function onClick() {
          _this2.setState({
            isOpen: true
          });
        },
        src: this.state.blobUrl || this.state.filePath ? this.state.blobUrl || this.state.filePath : ''
      })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
        ref: this.inputField,
        type: "file",
        name: "fileUpload",
        title: " ",
        style: {
          display: 'none'
        },
        onChange: this.uploadImageFile
      }), /*#__PURE__*/_react["default"].createElement("a", {
        href: "",
        className: "btn btn-secondary",
        style: {
          display: this.state.filePath ? 'none' : 'inline-block',
          pointerEvents: isSameEditor ? 'auto' : 'none'
        },
        onClick: function onClick(e) {
          _this2.inputField && _this2.inputField.current.click();
          e.preventDefault();
        }
      }, "Upload Image"))));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(ImageUpload, "getDerivedStateFromProps", function (props, state) {
  console.log('ImageUpload >> getDerivedStateFromProps');
  console.log(props.defaultValue);
  if (props.defaultValue && JSON.stringify(props.defaultValue) !== JSON.stringify(state.defaultValue)) {
    var filePath = props.defaultValue && props.defaultValue.filePath;
    var fileName = props.defaultValue && props.defaultValue.fileName;
    var blobUrl = props.defaultValue && props.defaultValue.blobUrl;
    return {
      defaultValue: props.defaultValue,
      filePath: filePath,
      fileName: fileName,
      blobUrl: blobUrl
    };
  }
  return state;
});
var _default = exports["default"] = ImageUpload;