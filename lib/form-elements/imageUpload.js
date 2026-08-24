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
var _reactImageLightbox = _interopRequireDefault(require("react-image-lightbox"));
var _formDeleteButton = _interopRequireDefault(require("./form-delete-button"));
require("react-image-lightbox/style.css");
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var isBrowserUrl = function isBrowserUrl(value) {
  return !!value && /^(https?:|blob:|data:)/i.test(value);
};

// This only needs to be imported once in your app
var ImageUpload = /*#__PURE__*/function (_React$Component) {
  function ImageUpload(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ImageUpload);
    _this = _callSuper(this, ImageUpload, [props]);
    (0, _defineProperty2["default"])(_this, "resolveDisplayUrl", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _this$state, filePath, blobUrl, resolved, _t;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _this$state = _this.state, filePath = _this$state.filePath, blobUrl = _this$state.blobUrl; // Fresh same-session blob previews are fine; saved blob: URLs from prior
            // sessions are dead and must not block resolving filePath.
            if (!(isBrowserUrl(blobUrl) && String(blobUrl).startsWith('blob:') && !filePath)) {
              _context.next = 1;
              break;
            }
            _this.setState({
              displayUrl: blobUrl,
              resolveDone: true
            });
            return _context.abrupt("return");
          case 1:
            if (!isBrowserUrl(filePath)) {
              _context.next = 2;
              break;
            }
            _this.setState({
              displayUrl: filePath,
              resolveDone: true
            });
            return _context.abrupt("return");
          case 2:
            if (!(isBrowserUrl(blobUrl) && !String(blobUrl).startsWith('blob:'))) {
              _context.next = 3;
              break;
            }
            _this.setState({
              displayUrl: blobUrl,
              resolveDone: true
            });
            return _context.abrupt("return");
          case 3:
            if (!(!filePath || typeof _this.props.resolveImageUrl !== 'function')) {
              _context.next = 4;
              break;
            }
            _this.setState({
              displayUrl: '',
              resolveDone: true
            });
            return _context.abrupt("return");
          case 4:
            _context.prev = 4;
            _context.next = 5;
            return _this.props.resolveImageUrl(filePath);
          case 5:
            resolved = _context.sent;
            if (_this.state.filePath === filePath) {
              _this.setState({
                displayUrl: resolved || '',
                resolveDone: true
              });
            }
            _context.next = 7;
            break;
          case 6:
            _context.prev = 6;
            _t = _context["catch"](4);
            console.log('resolveImageUrl failed', _t);
            if (_this.state.filePath === filePath) {
              _this.setState({
                displayUrl: '',
                resolveDone: true
              });
            }
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 6]]);
    })));
    (0, _defineProperty2["default"])(_this, "onRemoveImage", function () {
      if (!confirm('Confirm delete?')) {
        return;
      }
      _this.setState(function () {
        return {
          filePath: '',
          fileName: '',
          blobUrl: '',
          displayUrl: '',
          resolveDone: true
        };
      });
    });
    (0, _defineProperty2["default"])(_this, "uploadImageFile", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(event) {
        var file, extension, filePath, blobUrl;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              event.persist();
              if (!(!event || !event.target || !event.target.files)) {
                _context2.next = 1;
                break;
              }
              return _context2.abrupt("return");
            case 1:
              file = Array.from(event.target.files)[0];
              if (!(typeof _this.props.onUploadImage !== 'function')) {
                _context2.next = 2;
                break;
              }
              console.log('onUploadImage >>>>> no upload function found', _this.props.onUploadImage);
              return _context2.abrupt("return");
            case 2:
              console.log('Uploading image .....');
              extension = "".concat(file.name).substring(file.name.lastIndexOf('.'));
              _context2.next = 3;
              return _this.props.onUploadImage(file);
            case 3:
              filePath = _context2.sent;
              if (filePath) {
                _context2.next = 4;
                break;
              }
              return _context2.abrupt("return");
            case 4:
              blobUrl = URL.createObjectURL(file); // Keep "{serverFile}{ext}" storage format expected by FormService attachment move.
              _this.setState({
                fileName: file.name,
                blobUrl: blobUrl,
                displayUrl: blobUrl,
                resolveDone: true,
                filePath: "".concat(filePath).concat(extension)
              });
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    _this.inputField = /*#__PURE__*/_react["default"].createRef(null);
    var _filePath = props.defaultValue && props.defaultValue.filePath;
    var fileName = props.defaultValue && props.defaultValue.fileName;
    var _blobUrl = props.defaultValue && props.defaultValue.blobUrl;
    var initialDisplay = isBrowserUrl(_blobUrl) || isBrowserUrl(_filePath) ? _blobUrl || _filePath : '';
    _this.state = {
      defaultValue: props.defaultValue,
      filePath: _filePath,
      fileName: fileName,
      blobUrl: _blobUrl,
      displayUrl: initialDisplay,
      resolveDone: !!initialDisplay || !_filePath,
      isOpen: false
    };
    return _this;
  }
  (0, _inherits2["default"])(ImageUpload, _React$Component);
  return (0, _createClass2["default"])(ImageUpload, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.resolveDisplayUrl();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_prevProps, prevState) {
      if (prevState.filePath !== this.state.filePath || prevState.blobUrl !== this.state.blobUrl) {
        this.resolveDisplayUrl();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var rawEditor = this.props.editor;
      var savedEditor = Array.isArray(rawEditor) ? rawEditor[0] : rawEditor;
      var hasValue = !!(this.state.filePath || this.state.blobUrl);
      var previewSrc = this.state.displayUrl || (isBrowserUrl(this.state.blobUrl) && String(this.state.blobUrl).startsWith('blob:') ? this.state.blobUrl : '');
      var resolveDone = this.state.resolveDone !== false;
      var isReadOnly = !!(this.props.read_only || this.props.data && this.props.data.readOnly);

      // Empty field: anyone who can fill the form may upload.
      // Existing image: only the uploader (editor) or DCC may replace/remove.
      var canEditImage = !isReadOnly;
      if (hasValue && savedEditor && savedEditor.userId != null && userProperties) {
        var sameUploader = String(userProperties.userId) === String(savedEditor.userId);
        var isDcc = userProperties.hasDCCRole === true;
        canEditImage = !isReadOnly && (sameUploader || isDcc);
      } else if (hasValue && savedEditor && savedEditor.userId != null && !userProperties) {
        canEditImage = false;
      }
      var showUpload = resolveDone && canEditImage && !hasValue;
      var showRemove = resolveDone && canEditImage && hasValue;
      var actionStyle = {
        display: 'inline-block',
        marginRight: 8
      };
      var tooltipText = savedEditor && savedEditor.name && hasValue ? "Uploaded by: ".concat(savedEditor.name) : '';
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : ''),
        title: tooltipText
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'relative'
        }
      }, previewSrc ? /*#__PURE__*/_react["default"].createElement("img", {
        style: {
          width: '100%',
          cursor: 'pointer'
        },
        onClick: function onClick() {
          _this2.setState({
            isOpen: true
          });
        },
        src: previewSrc
      }) : this.state.filePath && !this.state.resolveDone ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "no-image",
        style: {
          minHeight: 80,
          border: '1px dashed #d9d9d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999'
        }
      }, "Loading image...") : null), (showUpload || showRemove) && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginTop: 8
        }
      }, /*#__PURE__*/_react["default"].createElement("input", {
        ref: this.inputField,
        type: "file",
        accept: "image/*",
        name: "fileUpload",
        title: " ",
        style: {
          display: 'none'
        },
        onChange: this.uploadImageFile
      }), showUpload && /*#__PURE__*/_react["default"].createElement("a", {
        href: "",
        className: "btn btn-secondary",
        style: actionStyle,
        onClick: function onClick(e) {
          _this2.inputField && _this2.inputField.current.click();
          e.preventDefault();
        }
      }, "Upload Image"), showRemove && /*#__PURE__*/_react["default"].createElement(_formDeleteButton["default"], {
        title: "Remove Image",
        onClick: function onClick() {
          return _this2.onRemoveImage();
        }
      }))), this.state.isOpen && previewSrc && /*#__PURE__*/_react["default"].createElement(_reactImageLightbox["default"], {
        mainSrc: previewSrc
        // Form opens inside Ant Design Drawer (z-index ~1000). Default lightbox
        // overlay is also 1000, so raise it so original-size preview appears on top.
        ,
        reactModalStyle: {
          overlay: {
            zIndex: 2000
          },
          content: {
            zIndex: 2000
          }
        },
        onCloseRequest: function onCloseRequest() {
          return _this2.setState({
            isOpen: false
          });
        }
      }));
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
    var displayUrl = isBrowserUrl(blobUrl) || isBrowserUrl(filePath) ? blobUrl || filePath : '';
    return {
      defaultValue: props.defaultValue,
      filePath: filePath,
      fileName: fileName,
      blobUrl: blobUrl,
      displayUrl: displayUrl,
      resolveDone: !!displayUrl || !filePath
    };
  }
  return null;
});
var _default = exports["default"] = ImageUpload;