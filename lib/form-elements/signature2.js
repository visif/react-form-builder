"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _dayjs = _interopRequireDefault(require("dayjs"));
var _dateUtil = require("../functions/dateUtil");
var _componentHeader = _interopRequireDefault(require("./component-header"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Signature2 = /*#__PURE__*/function (_React$Component) {
  function Signature2(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Signature2);
    _this = _callSuper(this, Signature2, [props]);
    (0, _defineProperty2["default"])(_this, "clickToSign", function () {
      if (typeof _this.props.getActiveUserProperties !== 'function') {
        return;
      }
      var userProperties = _this.props.getActiveUserProperties();
      var roleLists = userProperties && userProperties.role || [];
      roleLists = roleLists.concat([userProperties && userProperties.name || '']);
      var position = "".concat(_this.props.data.position).toLocaleLowerCase().trim();
      if (_this.props.data.specificRole === 'specific' && roleLists.find(function (item) {
        return "".concat(item).toLocaleLowerCase().trim() === position;
      })) {
        _this.setState(function (current) {
          return _objectSpread(_objectSpread({}, current), {}, {
            isSigned: !current.isSigned,
            signedPerson: !current.isSigned ? userProperties.name : '',
            signedPersonId: !current.isSigned ? userProperties.userId : '',
            signedDateTime: !current.isSigned ? (0, _dayjs["default"])().utc(true) : null
          });
        });
      } else if (_this.props.data.specificRole === 'notSpecific') {
        _this.setState(function (current) {
          return _objectSpread(_objectSpread({}, current), {}, {
            isSigned: !current.isSigned,
            signedPerson: !current.isSigned ? userProperties.name : '',
            signedPersonId: !current.isSigned ? userProperties.userId : '',
            signedDateTime: !current.isSigned ? (0, _dayjs["default"])().utc(true) : null
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
        console.log('role annd name does not match');
      }
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      defaultValue: props.defaultValue && props.defaultValue.isSigned,
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      signedPerson: props.defaultValue && props.defaultValue.signedPerson,
      signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
      signedDateTime: props.defaultValue && props.defaultValue.signedDateTime,
      isError: false
    };
    return _this;
  }
  (0, _inherits2["default"])(Signature2, _React$Component);
  return (0, _createClass2["default"])(Signature2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // If this is in a DynamicColumnRow and we have onElementChange,
      // notify parent that this component is now initialized
      if (this.props.data.parentId && this.props.onElementChange) {
        // Send initialization status to parent
        this.props.onElementChange(_objectSpread(_objectSpread({}, this.props.data), {}, {
          element: 'Signature2',
          initialized: true,
          position: this.props.data.position,
          specificRole: this.props.data.specificRole,
          required: this.props.data.required,
          readOnly: this.props.data.readOnly
        }));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var hasRequiredLabel = this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only;
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tableRef,
        className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : '')
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group",
        onClick: function onClick() {
          if (isSameEditor) {
            _this2.clickToSign();
          }
        },
        style: {
          cursor: 'pointer'
        }
      }, hasRequiredLabel && /*#__PURE__*/_react["default"].createElement("span", {
        className: "label-required badge badge-danger",
        style: {
          marginLeft: '60%'
        }
      }, "Required"), /*#__PURE__*/_react["default"].createElement("h5", {
        style: {
          textAlign: 'center'
        }
      }, this.state.isSigned ? 'Already signed' : '(Click to sign)'), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 8,
          color: this.state.isError ? 'red' : 'black'
        }
      }, this.state.isError ? 'You have no permission to sign' : '__________________'), /*#__PURE__*/_react["default"].createElement("h6", {
        style: {
          textAlign: 'center',
          minHeight: 20
        }
      }, this.state.isSigned && "(".concat(this.state.signedPerson, ")")), /*#__PURE__*/_react["default"].createElement("h6", {
        style: {
          textAlign: 'center'
        }
      }, this.props.data.position || 'Placeholder Text'), this.state.signedDateTime && /*#__PURE__*/_react["default"].createElement("h6", {
        style: {
          textAlign: 'center'
        }
      }, (0, _dateUtil.formatDate)(this.state.signedDateTime))));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(Signature2, "getDerivedStateFromProps", function (props, state) {
  console.log('Signature getDerivedStateFromProps');
  if (props.defaultValue && props.defaultValue.isSigned !== state.defaultValue) {
    return {
      defaultValue: props.defaultValue && props.defaultValue.isSigned,
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      isError: false,
      signedPerson: props.defaultValue.signedPerson,
      signedPersonId: props.defaultValue && props.defaultValue.signedPersonId
    };
  }
  return state;
});
var _default = exports["default"] = Signature2;