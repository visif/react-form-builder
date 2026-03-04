"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _dayjs = _interopRequireDefault(require("dayjs"));
var _dateUtil = require("../functions/dateUtil");
var _componentHeader = _interopRequireDefault(require("./component-header"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
class Signature2 extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "clickToSign", () => {
      if (typeof this.props.getActiveUserProperties !== 'function') {
        return;
      }
      const userProperties = this.props.getActiveUserProperties();
      let roleLists = userProperties && userProperties.role || [];
      roleLists = roleLists.concat([userProperties && userProperties.name || '']);
      const position = "".concat(this.props.data.position).toLocaleLowerCase().trim();
      if (this.props.data.specificRole === 'specific' && roleLists.find(item => "".concat(item).toLocaleLowerCase().trim() === position)) {
        this.setState(current => _objectSpread(_objectSpread({}, current), {}, {
          isSigned: !current.isSigned,
          signedPerson: !current.isSigned ? userProperties.name : '',
          signedPersonId: !current.isSigned ? userProperties.userId : '',
          signedDateTime: !current.isSigned ? (0, _dayjs.default)().utc(true) : null
        }));
      } else if (this.props.data.specificRole === 'notSpecific') {
        this.setState(current => _objectSpread(_objectSpread({}, current), {}, {
          isSigned: !current.isSigned,
          signedPerson: !current.isSigned ? userProperties.name : '',
          signedPersonId: !current.isSigned ? userProperties.userId : '',
          signedDateTime: !current.isSigned ? (0, _dayjs.default)().utc(true) : null
        }));
      } else {
        if (!this.state.isError) {
          this.setState({
            isError: true
          });
          setTimeout(() => {
            this.setState({
              isError: false
            });
          }, 5000);
        }
        console.log('role annd name does not match');
      }
    });
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.state = {
      // Track last-seen prop values to detect external changes only
      prevPropsIsSigned: props.defaultValue && props.defaultValue.isSigned,
      prevPropsSignedPerson: props.defaultValue && props.defaultValue.signedPerson,
      prevPropsSignedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
      prevPropsSignedDateTime: props.defaultValue && props.defaultValue.signedDateTime,
      // Actual state values
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      signedPerson: props.defaultValue && props.defaultValue.signedPerson,
      signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
      signedDateTime: props.defaultValue && props.defaultValue.signedDateTime,
      isError: false
    };
  }
  componentDidMount() {
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
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;
    const hasValue = this.state.isSigned;

    // Allow editing if no value exists OR if user is the same editor/signer
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.userId === this.state.signedPersonId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text showing editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "Edited by: ".concat(savedEditor.name) : '';
    const hasRequiredLabel = this.props.data.hasOwnProperty('required') && this.props.data.required === true && !this.props.read_only;
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: this.tableRef,
      className: "SortableItem rfb-item".concat(this.props.data.pageBreakBefore ? ' alwaysbreak' : ''),
      title: tooltipText
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group",
      onClick: () => {
        if (isSameEditor) {
          this.clickToSign();
        }
      },
      style: {
        cursor: 'pointer'
      }
    }, hasRequiredLabel && /*#__PURE__*/_react.default.createElement("span", {
      className: "label-required badge badge-danger",
      style: {
        marginLeft: '60%'
      }
    }, "Required"), /*#__PURE__*/_react.default.createElement("h5", {
      style: {
        textAlign: 'center'
      }
    }, this.state.isSigned ? 'Already signed' : '(Click to sign)'), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 8,
        color: this.state.isError ? 'red' : 'black',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: this.state.isError ? 'normal' : 'nowrap',
        fontSize: 'clamp(12px, 100%, 16px)',
        letterSpacing: this.state.isError ? 'normal' : '-2px',
        lineHeight: 1.2
      }
    }, this.state.isError ? 'You have no permission to sign' : '__________________'), /*#__PURE__*/_react.default.createElement("h6", {
      style: {
        textAlign: 'center',
        minHeight: 20
      }
    }, this.state.isSigned && "(".concat(this.state.signedPerson, ")")), /*#__PURE__*/_react.default.createElement("h6", {
      style: {
        textAlign: 'center'
      }
    }, this.props.data.position || 'Placeholder Text'), this.state.signedDateTime && /*#__PURE__*/_react.default.createElement("h6", {
      style: {
        textAlign: 'center'
      }
    }, (0, _dateUtil.formatDate)(this.state.signedDateTime))));
  }
}
(0, _defineProperty2.default)(Signature2, "getDerivedStateFromProps", (props, state) => {
  console.log('Signature getDerivedStateFromProps');
  if (props.defaultValue) {
    const propsIsSigned = props.defaultValue.isSigned;
    const propsSignedPerson = props.defaultValue.signedPerson;
    const propsSignedPersonId = props.defaultValue.signedPersonId;
    const propsSignedDateTime = props.defaultValue.signedDateTime;

    // Only sync state when the PROPS themselves have changed (external update),
    // not when local state differs from props (user interaction).
    const propsChanged = propsIsSigned !== state.prevPropsIsSigned || propsSignedPerson !== state.prevPropsSignedPerson || propsSignedPersonId !== state.prevPropsSignedPersonId || propsSignedDateTime !== state.prevPropsSignedDateTime;
    if (propsChanged) {
      return {
        prevPropsIsSigned: propsIsSigned,
        prevPropsSignedPerson: propsSignedPerson,
        prevPropsSignedPersonId: propsSignedPersonId,
        prevPropsSignedDateTime: propsSignedDateTime,
        isSigned: propsIsSigned,
        isError: false,
        signedPerson: propsSignedPerson,
        signedPersonId: propsSignedPersonId,
        signedDateTime: propsSignedDateTime
      };
    }
  }
  return null;
});
var _default = exports.default = Signature2;