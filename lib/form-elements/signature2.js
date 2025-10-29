"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _dayjs = _interopRequireDefault(require("dayjs"));
var _dateUtil = require("../functions/dateUtil");
var _componentHeader = _interopRequireDefault(require("./component-header"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Signature2 = function Signature2(props) {
  var inputField = _react["default"].useRef(null);
  var tableRef = _react["default"].useRef(null);
  var _React$useState = _react["default"].useState(props.defaultValue && props.defaultValue.isSigned),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    isSigned = _React$useState2[0],
    setIsSigned = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(props.defaultValue && props.defaultValue.signedPerson),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    signedPerson = _React$useState4[0],
    setSignedPerson = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(props.defaultValue && props.defaultValue.signedPersonId),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    signedPersonId = _React$useState6[0],
    setSignedPersonId = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(props.defaultValue && props.defaultValue.signedDateTime),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    signedDateTime = _React$useState8[0],
    setSignedDateTime = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(false),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 2),
    isError = _React$useState0[0],
    setIsError = _React$useState0[1];
  _react["default"].useEffect(function () {
    // If this is in a DynamicColumnRow and we have onElementChange,
    // notify parent that this component is now initialized
    if (props.data.parentId && props.onElementChange) {
      // Send initialization status to parent
      props.onElementChange(_objectSpread(_objectSpread({}, props.data), {}, {
        element: 'Signature2',
        initialized: true,
        position: props.data.position,
        specificRole: props.data.specificRole,
        required: props.data.required,
        readOnly: props.data.readOnly
      }));
    }
  }, [props]);
  _react["default"].useEffect(function () {
    console.log('Signature getDerivedStateFromProps');
    if (props.defaultValue && props.defaultValue.isSigned !== isSigned) {
      setIsSigned(props.defaultValue && props.defaultValue.isSigned);
      setSignedPerson(props.defaultValue.signedPerson);
      setSignedPersonId(props.defaultValue && props.defaultValue.signedPersonId);
      setIsError(false);
    }
  }, [props.defaultValue, isSigned]);
  var clickToSign = _react["default"].useCallback(function () {
    if (typeof props.getActiveUserProperties !== 'function') {
      return;
    }
    var userProperties = props.getActiveUserProperties();
    var roleLists = userProperties && userProperties.role || [];
    roleLists = roleLists.concat([userProperties && userProperties.name || '']);
    var position = "".concat(props.data.position).toLocaleLowerCase().trim();
    if (props.data.specificRole === 'specific' && roleLists.find(function (item) {
      return "".concat(item).toLocaleLowerCase().trim() === position;
    })) {
      setIsSigned(function (current) {
        return !current;
      });
      setSignedPerson(function (current) {
        return !current ? userProperties.name : '';
      });
      setSignedPersonId(function (current) {
        return !current ? userProperties.userId : '';
      });
      setSignedDateTime(function (current) {
        return !current ? (0, _dayjs["default"])().utc(true) : null;
      });
    } else if (props.data.specificRole === 'notSpecific') {
      setIsSigned(function (current) {
        return !current;
      });
      setSignedPerson(function (current) {
        return !current ? userProperties.name : '';
      });
      setSignedPersonId(function (current) {
        return !current ? userProperties.userId : '';
      });
      setSignedDateTime(function (current) {
        return !current ? (0, _dayjs["default"])().utc(true) : null;
      });
    } else {
      if (!isError) {
        setIsError(true);
        setTimeout(function () {
          setIsError(false);
        }, 5000);
      }
      console.log('role annd name does not match');
    }
  }, [props, isError]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var hasRequiredLabel = props.data.hasOwnProperty('required') && props.data.required === true && !props.read_only;
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: tableRef,
    className: "SortableItem rfb-item".concat(props.data.pageBreakBefore ? ' alwaysbreak' : '')
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group",
    onClick: function onClick() {
      if (isSameEditor) {
        clickToSign();
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
  }, isSigned ? 'Already signed' : '(Click to sign)'), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 8,
      color: isError ? 'red' : 'black'
    }
  }, isError ? 'You have no permission to sign' : '__________________'), /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      textAlign: 'center',
      minHeight: 20
    }
  }, isSigned && "(".concat(signedPerson, ")")), /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      textAlign: 'center'
    }
  }, props.data.position || 'Placeholder Text'), signedDateTime && /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      textAlign: 'center'
    }
  }, (0, _dateUtil.formatDate)(signedDateTime))));
};
var _default = exports["default"] = Signature2;