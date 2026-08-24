"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _formDeleteButton = _interopRequireDefault(require("./form-delete-button"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var getSavedEditor = function getSavedEditor(editor) {
  return Array.isArray(editor) ? editor[0] : editor;
};
var FileUpload = /*#__PURE__*/function (_React$Component) {
  function FileUpload(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FileUpload);
    _this = _callSuper(this, FileUpload, [props]);
    (0, _defineProperty2["default"])(_this, "canEditFiles", function () {
      var isReadOnly = !!(_this.props.read_only || _this.props.data && _this.props.data.readOnly);
      return !isReadOnly;
    });
    (0, _defineProperty2["default"])(_this, "uploadAttachFile", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
        var fileName;
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(typeof _this.props.onUploadFile !== 'function')) {
                _context.next = 1;
                break;
              }
              console.log('FileUpload >>>>> not upload function found', _this.props.onUploadFile);
              return _context.abrupt("return");
            case 1:
              console.log('Uploading file.....');
              _context.next = 2;
              return _this.props.onUploadFile(file);
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
    }());
    (0, _defineProperty2["default"])(_this, "onUploadMultipleFiles", /*#__PURE__*/function () {
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
              return _this.uploadAttachFile(currentFile);
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
              _this.setState(function (current) {
                return {
                  fileList: [].concat((0, _toConsumableArray2["default"])(current.fileList), newResponse)
                };
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
    }());
    (0, _defineProperty2["default"])(_this, "onDownloadFile", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(file) {
        return _regenerator["default"].wrap(function (_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!(typeof _this.props.onDownloadFile !== 'function')) {
                _context3.next = 1;
                break;
              }
              console.log('FileUpload >>>>> no download function found', _this.props.onDownloadFile);
              return _context3.abrupt("return");
            case 1:
              console.log('Downloading File file.....');
              _context3.next = 2;
              return _this.props.onDownloadFile(file);
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
    }());
    (0, _defineProperty2["default"])(_this, "onRemoveFile", function (file) {
      if (!_this.canEditFiles()) {
        console.log('User not authorized to delete file');
        return;
      }
      _this.setState(function (current) {
        var remainList = current.fileList.filter(function (item) {
          return item.fileName !== file.fileName;
        });
        return {
          fileList: (0, _toConsumableArray2["default"])(remainList)
        };
      });
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef(null);
    var fileList = props.defaultValue && props.defaultValue.fileList || [];
    _this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: (0, _toConsumableArray2["default"])(fileList)
    };
    return _this;
  }
  (0, _inherits2["default"])(FileUpload, _React$Component);
  return (0, _createClass2["default"])(FileUpload, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var savedEditor = getSavedEditor(this.props.editor);
      var hasValue = this.state.fileList && this.state.fileList.length > 0;
      var canEdit = this.canEditFiles();
      var files = this.state.fileList ? this.state.fileList.map(function (f) {
        return f.originalName;
      }).join(', ') : '';
      var tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(files, "\nEdited by: ").concat(savedEditor.name) : '';
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : ''),
        title: tooltipText
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
        multiple: true,
        ref: this.inputField,
        type: "file",
        name: "fileUpload",
        title: " ",
        style: {
          display: 'none'
        },
        onChange: this.onUploadMultipleFiles,
        disabled: !canEdit
      }), /*#__PURE__*/_react["default"].createElement("a", {
        href: "#",
        style: {
          marginTop: 6
        },
        className: "btn btn-secondary",
        onClick: function onClick(e) {
          e.preventDefault();
          if (!canEdit) {
            return;
          }
          _this2.inputField && _this2.inputField.current.click();
        }
      }, "Upload files"), this.state.fileList && this.state.fileList.length > 0 && /*#__PURE__*/_react["default"].createElement("ul", {
        style: {
          display: 'flex',
          maxWidth: '450px',
          flexDirection: 'column',
          marginTop: '1rem',
          paddingLeft: 0
        }
      }, this.state.fileList.map(function (file, index) {
        return /*#__PURE__*/_react["default"].createElement("li", {
          key: "file".concat(index),
          style: {
            listStyleType: 'none',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            width: '100%'
          }
        }, /*#__PURE__*/_react["default"].createElement("span", {
          style: {
            cursor: 'pointer',
            flex: 1,
            minWidth: 0
          },
          onClick: function onClick() {
            _this2.onDownloadFile(file);
          }
        }, /*#__PURE__*/_react["default"].createElement("span", {
          style: {
            marginRight: 4
          }
        }, index + 1, "."), ' ', file.originalName), canEdit && /*#__PURE__*/_react["default"].createElement(_formDeleteButton["default"], {
          title: "Delete file",
          onClick: function onClick() {
            _this2.onRemoveFile(file);
          }
        }));
      })))));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(FileUpload, "getDerivedStateFromProps", function (props, state) {
  console.log('FileUpload >> getDerivedStateFromProps');
  console.log(props.defaultValue);
  if (props.defaultValue && JSON.stringify(props.defaultValue.fileList) !== JSON.stringify(state.defaultValue)) {
    var fileList = props.defaultValue && props.defaultValue.fileList || [];
    return {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: (0, _toConsumableArray2["default"])(fileList)
    };
  }
  return state;
});
var _default = exports["default"] = FileUpload;