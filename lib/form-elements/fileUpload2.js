"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var FileUpload = function FileUpload(props) {
  var inputField = _react["default"].useRef(null);
  var initFileList = props.defaultValue && props.defaultValue.fileList || [];
  var _React$useState = _react["default"].useState(props.defaultValue && props.defaultValue.fileList),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    defaultValue = _React$useState2[0],
    setDefaultValue = _React$useState2[1];
  var _React$useState3 = _react["default"].useState((0, _toConsumableArray2["default"])(initFileList)),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    fileList = _React$useState4[0],
    setFileList = _React$useState4[1];
  _react["default"].useEffect(function () {
    console.log('FileUpload >> useEffect (prop sync)');
    console.log(props.defaultValue);
    if (props.defaultValue && JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(defaultValue)) {
      var newFileList = props.defaultValue && props.defaultValue.fileList || [];
      setDefaultValue(props.defaultValue && props.defaultValue.fileList);
      setFileList((0, _toConsumableArray2["default"])(newFileList));
    }
  }, [props.defaultValue, defaultValue]);
  var uploadAttachFile = _react["default"].useCallback(/*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
      var fileName;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof props.onUploadFile !== 'function')) {
              _context.next = 1;
              break;
            }
            console.log('FileUpload >>>>> not upload function found', props.onUploadFile);
            return _context.abrupt("return");
          case 1:
            console.log('Uploading file.....');
            _context.next = 2;
            return props.onUploadFile(file);
          case 2:
            fileName = _context.sent;
            return _context.abrupt("return", {
              originalName: file.name,
              fileName: fileName
            });
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [props.onUploadFile]);
  var onUploadMultipleFiles = _react["default"].useCallback(/*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(event) {
      var newFileList, newResponse, i, currentFile, response;
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
            newFileList = Array.from(event.target.files);
            newResponse = [];
            i = 0;
          case 2:
            if (!(i < newFileList.length)) {
              _context2.next = 5;
              break;
            }
            currentFile = newFileList[i];
            _context2.next = 3;
            return uploadAttachFile(currentFile);
          case 3:
            response = _context2.sent;
            if (response) {
              newResponse.push(response);
            }
          case 4:
            i = i + 1;
            _context2.next = 2;
            break;
          case 5:
            setFileList(function (current) {
              return [].concat((0, _toConsumableArray2["default"])(current), newResponse);
            });
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }(), [uploadAttachFile]);
  var onDownloadFile = _react["default"].useCallback(/*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(file) {
      return _regenerator["default"].wrap(function (_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!(typeof props.onDownloadFile !== 'function')) {
              _context3.next = 1;
              break;
            }
            console.log('FileUpload >>>>> no download function found', props.onDownloadFile);
            return _context3.abrupt("return");
          case 1:
            console.log('Downloading File file.....');
            _context3.next = 2;
            return props.onDownloadFile(file);
          case 2:
            console.log('download filtPath: ', file);
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }(), [props.onDownloadFile]);
  var onRemoveFile = _react["default"].useCallback(function (file) {
    // Check if user is the same editor before allowing deletion
    var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
    var savedEditor = props.editor;
    var isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Only allow deletion if user is the same editor
    if (!isSameEditor) {
      console.log('User not authorized to delete file');
      return;
    }
    setFileList(function (current) {
      var remainList = current.filter(function (item) {
        return item.fileName !== file.fileName;
      });
      return (0, _toConsumableArray2["default"])(remainList);
    });
  }, [props.getActiveUserProperties, props.editor]);
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
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
    multiple: true,
    ref: inputField,
    type: "file",
    name: "fileUpload",
    title: " ",
    style: {
      display: 'none'
    },
    onChange: onUploadMultipleFiles,
    disabled: !isSameEditor
  }), /*#__PURE__*/_react["default"].createElement("a", {
    href: "#",
    style: {
      marginTop: 6
    },
    className: "btn btn-secondary",
    onClick: function onClick(e) {
      e.preventDefault();
      inputField && inputField.current.click();
    }
  }, "Upload files"), fileList && fileList.length > 0 && /*#__PURE__*/_react["default"].createElement("ul", {
    style: {
      display: 'flex',
      maxWidth: '450px',
      flexDirection: 'column',
      marginTop: '1rem'
    }
  }, fileList.map(function (file, index) {
    return /*#__PURE__*/_react["default"].createElement("li", {
      key: "file".concat(index),
      style: {
        listStyleType: 'none',
        fontSize: 16,
        display: 'block'
      }
    }, /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        "float": 'left',
        cursor: 'pointer'
      },
      onClick: function onClick() {
        onDownloadFile(file);
      }
    }, /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        marginRight: 4
      }
    }, index + 1, "."), ' ', file.originalName), isSameEditor && /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        "float": 'right',
        cursor: 'pointer',
        marginTop: 4
      },
      onClick: function onClick() {
        onRemoveFile(file);
      }
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-trash"
    })));
  })))));
};
var _default = exports["default"] = FileUpload;