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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// import noImage from "./noImage.png";
var ImageUpload = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ImageUpload, _React$Component);

  var _super = _createSuper(ImageUpload);

  function ImageUpload(_props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ImageUpload);
    _this = _super.call(this, _props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onRemoveImage", function () {
      if (!confirm("Confirm delete?")) {
        return;
      }

      _this.setState(function () {
        return {
          filePath: "",
          fileName: "",
          blobUrl: ""
        };
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "uploadImageFile", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
        var file, extension, filePath, blobUrl;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event.persist();

                if (!(!event || !event.target || !event.target.files)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                file = Array.from(event.target.files)[0];

                if (!(typeof _this.props.onUploadImage !== "function")) {
                  _context.next = 7;
                  break;
                }

                console.log("onUploadImage >>>>> no upload function found", _this.props.onUploadImage);
                return _context.abrupt("return");

              case 7:
                console.log("Uploading image .....");
                extension = "".concat(file.name).substring(file.name.lastIndexOf("."));
                _context.next = 11;
                return _this.props.onUploadImage(file);

              case 11:
                filePath = _context.sent;
                blobUrl = URL.createObjectURL(file);

                _this.setState({
                  fileName: file.name,
                  blobUrl: blobUrl,
                  filePath: "".concat(filePath).concat(extension)
                });

                if (!isSameEditor) {
                  props.disabled = "true";
                }

              case 15:
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
    _this.inputField = /*#__PURE__*/_react["default"].createRef(null);

    var _filePath = _props.defaultValue && _props.defaultValue.filePath;

    var fileName = _props.defaultValue && _props.defaultValue.fileName;

    var _blobUrl = _props.defaultValue && _props.defaultValue.blobUrl;

    _this.state = {
      defaultValue: _props.defaultValue,
      filePath: _filePath,
      fileName: fileName,
      blobUrl: _blobUrl
    };
    return _this;
  }

  (0, _createClass2["default"])(ImageUpload, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;

      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? " alwaysbreak" : "")
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: "relative"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn is-isolated",
        onClick: this.onRemoveImage,
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          display: this.state.filePath ? "" : "none"
        }
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "is-isolated fas fa-trash"
      })), /*#__PURE__*/_react["default"].createElement("img", {
        style: {
          width: "70vw"
        },
        src: this.state.blobUrl || this.state.filePath ? this.state.blobUrl || this.state.filePath : ""
      })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
        ref: this.inputField,
        type: "file",
        name: "fileUpload",
        title: " ",
        style: {
          display: "none"
        },
        onChange: this.uploadImageFile
      }), /*#__PURE__*/_react["default"].createElement("a", {
        href: "",
        className: "btn btn-secondary",
        style: {
          display: this.state.filePath ? "none" : "inline-block"
        },
        onClick: function onClick(e) {
          _this2.inputField && _this2.inputField.current.click();
          e.preventDefault();
        }
      }, "Upload Image"))));
    }
  }]);
  return ImageUpload;
}(_react["default"].Component);

(0, _defineProperty2["default"])(ImageUpload, "getDerivedStateFromProps", function (props, state) {
  console.log("ImageUpload >> getDerivedStateFromProps");
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
var _default = ImageUpload;
exports["default"] = _default;