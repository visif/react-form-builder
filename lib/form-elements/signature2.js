"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Signature2 = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Signature2, _React$Component);

  var _super = _createSuper(Signature2);

  function Signature2(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, Signature2);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "clickToSign", function () {
      if (typeof _this.props.getActiveUserProperties !== "function") {
        return;
      }

      var userProperties = _this.props.getActiveUserProperties();

      var roleLists = userProperties && userProperties.role || [];
      roleLists = roleLists.concat([userProperties && userProperties.name || ""]);
      var position = "".concat(_this.props.data.position).toLocaleLowerCase().trim();

      if (_this.props.data.specificRole === "specific" && roleLists.find(function (item) {
        return "".concat(item).toLocaleLowerCase().trim() === position;
      })) {
        _this.setState(function (current) {
          return _objectSpread(_objectSpread({}, current), {}, {
            isSigned: !current.isSigned,
            signedPerson: !current.isSigned ? userProperties.name : ""
          });
        });
      } else if (_this.props.data.specificRole === "notSpecific") {
        _this.setState(function (current) {
          return _objectSpread(_objectSpread({}, current), {}, {
            isSigned: !current.isSigned,
            signedPerson: !current.isSigned ? userProperties.name : ""
          });
        });
      } else {
        if (!_this.state.isError) {
          _this.setState({
            isError: true
          });

          setTimeout(function () {
            _this.setState({
              isError: false
            });
          }, 5000);
        }

        console.log("role annd name does not match");
      }
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      defaultValue: props.defaultValue && props.defaultValue.isSigned,
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      signedPerson: props.defaultValue && props.defaultValue.signedPerson,
      isError: false
    };
    return _this;
  }

  (0, _createClass2["default"])(Signature2, [{
    key: "render",
    value: function render() {
      var hasRequiredLabel = this.props.data.hasOwnProperty("required") && this.props.data.required === true && !this.props.read_only;
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? " alwaysbreak" : "")
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group",
        onClick: this.clickToSign,
        style: {
          cursor: "pointer"
        }
      }, hasRequiredLabel && /*#__PURE__*/_react["default"].createElement("span", {
        className: "label-required badge badge-danger",
        style: {
          marginLeft: "60%"
        }
      }, "Required"), /*#__PURE__*/_react["default"].createElement("h5", {
        style: {
          textAlign: "center"
        }
      }, this.state.isSigned ? "Already signed" : "(Click to sign)"), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: "center",
          marginTop: 8,
          marginBottom: 8,
          color: this.state.isError ? "red" : "inherit"
        }
      }, this.state.isError ? "You have no permission to sign" : "__________________"), /*#__PURE__*/_react["default"].createElement("h6", {
        style: {
          textAlign: "center",
          minHeight: 20
        }
      }, this.state.isSigned && "(".concat(this.state.signedPerson, ")")), /*#__PURE__*/_react["default"].createElement("h6", {
        style: {
          textAlign: "center"
        }
      }, this.props.data.position || "Placeholder Text")));
    }
  }]);
  return Signature2;
}(_react["default"].Component);

(0, _defineProperty2["default"])(Signature2, "getDerivedStateFromProps", function (props, state) {
  console.log("Signature getDerivedStateFromProps");

  if (props.defaultValue && props.defaultValue.isSigned !== state.defaultValue) {
    return {
      defaultValue: props.defaultValue && props.defaultValue.isSigned,
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      isError: false,
      signedPerson: props.defaultValue.signedPerson
    };
  }

  return state;
});
var _default = Signature2;
exports["default"] = _default;