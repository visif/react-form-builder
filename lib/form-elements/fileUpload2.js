"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FileUpload = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(FileUpload, _React$Component);

  var _super = _createSuper(FileUpload);

  function FileUpload(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, FileUpload);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onRemoveFile", function (file) {
      _this.setState(function (current) {
        var remainList = current.fileList.filter(function (item) {
          return item.fileName !== file.fileName;
        });
        return {
          fileList: (0, _toConsumableArray2["default"])(remainList)
        };
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "uploadAttachFile", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(file) {
        var fileName;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(typeof _this.props.onUploadFile !== "function")) {
                  _context.next = 3;
                  break;
                }

                console.log("FileUpload >>>>> not upload function found", _this.props.onUploadFile);
                return _context.abrupt("return");

              case 3:
                console.log("Uploading file.....");
                _context.next = 6;
                return _this.props.onUploadFile(file);

              case 6:
                fileName = _context.sent;
                return _context.abrupt("return", {
                  originalName: file.name,
                  fileName: fileName
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onUploadMultipleFiles", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(event) {
        var newFileList, newResponse, i, currentFile, response;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!event || !event.target || !event.target.files)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                newFileList = Array.from(event.target.files);
                newResponse = [];
                i = 0;

              case 5:
                if (!(i < newFileList.length)) {
                  _context2.next = 14;
                  break;
                }

                currentFile = newFileList[i];
                _context2.next = 9;
                return _this.uploadAttachFile(currentFile);

              case 9:
                response = _context2.sent;

                if (response) {
                  newResponse.push(response);
                }

              case 11:
                i = i + 1;
                _context2.next = 5;
                break;

              case 14:
                _this.setState(function (current) {
                  return {
                    fileList: [].concat((0, _toConsumableArray2["default"])(current.fileList), newResponse)
                  };
                });

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    _this.inputField = /*#__PURE__*/_react["default"].createRef(null);
    var fileList = props.defaultValue && props.defaultValue.fileList || [];
    _this.state = {
      defaultValue: props.defaultValue && props.defaultValue.fileList,
      fileList: (0, _toConsumableArray2["default"])(fileList)
    };
    return _this;
  }

  (0, _createClass2["default"])(FileUpload, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? " alwaysbreak" : "")
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
        multiple: true,
        ref: this.inputField,
        type: "file",
        name: "fileUpload",
        title: " ",
        style: {
          display: "none"
        },
        onChange: this.onUploadMultipleFiles
      }), /*#__PURE__*/_react["default"].createElement("a", {
        href: "",
        style: {
          marginTop: 6
        },
        className: "btn btn-secondary",
        onClick: function onClick(e) {
          _this2.inputField && _this2.inputField.current.click();
          e.preventDefault();
        }
      }, "Upload files"), this.state.fileList && this.state.fileList.length && /*#__PURE__*/_react["default"].createElement("ul", {
        style: {
          display: "flex",
          maxWidth: "450px",
          flexDirection: "column",
          marginTop: "1rem"
        }
      }, this.state.fileList.map(function (file, index) {
        return /*#__PURE__*/_react["default"].createElement("li", {
          key: "file".concat(index),
          style: {
            listStyleType: "none",
            fontSize: 16,
            display: "block"
          }
        }, /*#__PURE__*/_react["default"].createElement("span", {
          style: {
            "float": "left"
          }
        }, /*#__PURE__*/_react["default"].createElement("span", {
          style: {
            marginRight: 4
          }
        }, index + 1, "."), " ", file.originalName), /*#__PURE__*/_react["default"].createElement("span", {
          style: {
            "float": "right",
            cursor: "pointer",
            marginTop: 4
          },
          onClick: function onClick() {
            _this2.onRemoveFile(file);
          }
        }, /*#__PURE__*/_react["default"].createElement("i", {
          "class": "fas fa-trash"
        })));
      })))));
    }
  }]);
  return FileUpload;
}(_react["default"].Component);

(0, _defineProperty2["default"])(FileUpload, "getDerivedStateFromProps", function (props, state) {
  console.log("FileUpload >> getDerivedStateFromProps");
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
var _default = FileUpload;
exports["default"] = _default;