"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
// TODO: Replace react-image-lightbox with React 18 compatible alternative
// import Lightbox from 'react-image-lightbox'
// import 'react-image-lightbox/style.css'

// This only needs to be imported once in your app

var ImageUpload = function ImageUpload(props) {
  var inputField = _react["default"].useRef(null);
  var initFilePath = props.defaultValue && props.defaultValue.filePath;
  var initFileName = props.defaultValue && props.defaultValue.fileName;
  var initBlobUrl = props.defaultValue && props.defaultValue.blobUrl;
  var _React$useState = _react["default"].useState(props.defaultValue),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    defaultValue = _React$useState2[0],
    setDefaultValue = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(initFilePath),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    filePath = _React$useState4[0],
    setFilePath = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(initFileName),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    fileName = _React$useState6[0],
    setFileName = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(initBlobUrl),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    blobUrl = _React$useState8[0],
    setBlobUrl = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(false),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 2),
    isOpen = _React$useState0[0],
    setIsOpen = _React$useState0[1];
  _react["default"].useEffect(function () {
    console.log('ImageUpload >> useEffect (prop sync)');
    console.log(props.defaultValue);
    if (props.defaultValue && JSON.stringify(props.defaultValue) !== JSON.stringify(defaultValue)) {
      var newFilePath = props.defaultValue && props.defaultValue.filePath;
      var newFileName = props.defaultValue && props.defaultValue.fileName;
      var newBlobUrl = props.defaultValue && props.defaultValue.blobUrl;
      setDefaultValue(props.defaultValue);
      setFilePath(newFilePath);
      setFileName(newFileName);
      setBlobUrl(newBlobUrl);
    }
  }, [props.defaultValue, defaultValue]);
  var onRemoveImage = _react["default"].useCallback(function () {
    if (!confirm('Confirm delete?')) {
      return;
    }
    setFilePath('');
    setFileName('');
    setBlobUrl('');
  }, []);
  var uploadImageFile = _react["default"].useCallback(/*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
      var file, extension, uploadedPath, newBlobUrl;
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
            if (!(typeof props.onUploadImage !== 'function')) {
              _context.next = 2;
              break;
            }
            console.log('onUploadImage >>>>> no upload function found', props.onUploadImage);
            return _context.abrupt("return");
          case 2:
            console.log('Uploading image .....');
            extension = "".concat(file.name).substring(file.name.lastIndexOf('.'));
            _context.next = 3;
            return props.onUploadImage(file);
          case 3:
            uploadedPath = _context.sent;
            newBlobUrl = URL.createObjectURL(file);
            setFileName(file.name);
            setBlobUrl(newBlobUrl);
            setFilePath("".concat(uploadedPath).concat(extension));
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [props.onUploadImage]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "SortableItem rfb-item".concat(props.data.pageBreakBefore ? ' alwaysbreak' : '')
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    onClick: onRemoveImage,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      display: filePath ? '' : 'none'
    }
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-trash"
  })), /*#__PURE__*/_react["default"].createElement("img", {
    style: {
      width: '100%',
      cursor: 'pointer'
    },
    onClick: function onClick() {
      setIsOpen(true);
    },
    src: blobUrl || filePath ? blobUrl || filePath : ''
  })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
    ref: inputField,
    type: "file",
    name: "fileUpload",
    title: " ",
    style: {
      display: 'none'
    },
    onChange: uploadImageFile
  }), /*#__PURE__*/_react["default"].createElement("a", {
    href: "",
    className: "btn btn-secondary",
    style: {
      display: filePath ? 'none' : 'inline-block',
      pointerEvents: isSameEditor ? 'auto' : 'none'
    },
    onClick: function onClick(e) {
      inputField && inputField.current.click();
      e.preventDefault();
    }
  }, "Upload Image"))));
};
var _default = exports["default"] = ImageUpload;