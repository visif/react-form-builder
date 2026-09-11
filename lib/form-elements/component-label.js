"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RequiredBadge = exports.RequiredAsterisk = exports.REQUIRED_BADGE_STYLE = exports.REQUIRED_ASTERISK_STYLE = exports.DCR_REQUIRED_MARK_STYLE = void 0;
var _react = _interopRequireDefault(require("react"));
var _myxss = _interopRequireDefault(require("./myxss"));
const convertUnderlineToIns = html => html.replace(/<u>/g, '<ins>').replace(/<\/u>/g, '</ins>');

// Strip <p> tags from label text to avoid block elements inside inline <span>/<label>
const stripPTags = html => {
  if (!html) return html;
  return html.replace(/<p>/gi, '').replace(/<\/p>/gi, '').trim();
};
const REQUIRED_BADGE_STYLE = exports.REQUIRED_BADGE_STYLE = {
  display: 'inline-block',
  margin: '0 0 4px 0',
  padding: '2px 6px',
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1.2,
  color: '#fff',
  backgroundColor: '#dc3545',
  borderRadius: 4,
  verticalAlign: 'middle'
};
const REQUIRED_ASTERISK_STYLE = exports.REQUIRED_ASTERISK_STYLE = {
  color: '#dc3545',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1,
  margin: 0
};
const DCR_REQUIRED_MARK_STYLE = exports.DCR_REQUIRED_MARK_STYLE = {
  position: 'absolute',
  left: 6,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 30,
  margin: 0,
  padding: 0,
  width: 'auto',
  height: 'auto',
  display: 'block',
  color: '#dc3545',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1,
  pointerEvents: 'none'
};
const RequiredBadge = () => /*#__PURE__*/_react.default.createElement("span", {
  className: "label-required badge badge-danger",
  style: REQUIRED_BADGE_STYLE
}, "Required");
exports.RequiredBadge = RequiredBadge;
const RequiredAsterisk = () => /*#__PURE__*/_react.default.createElement("span", {
  className: "rfb-required-asterisk",
  style: REQUIRED_ASTERISK_STYLE,
  "aria-label": "Required"
}, "*");
exports.RequiredAsterisk = RequiredAsterisk;
const isRequiredValue = value => value === true || value === 'true';
const isDynamicColumnChild = (data, mutable) => {
  if (!(data !== null && data !== void 0 && data.parentId) || data.row === undefined || data.col === undefined) {
    return false;
  }
  const parent = mutable && typeof mutable.getDataById === 'function' ? mutable.getDataById(data.parentId) : null;
  if (parent !== null && parent !== void 0 && parent.element) {
    return parent.element === 'DynamicColumnRow';
  }
  return data.hideLabel === true;
};
const ComponentLabel = props => {
  var _props$data;
  const hasRequiredLabel = isRequiredValue((_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.required) && !props.read_only;
  const inDynamicColumn = isDynamicColumnChild(props.data, props.mutable);
  const requiredMark = inDynamicColumn ? /*#__PURE__*/_react.default.createElement(RequiredAsterisk, null) : /*#__PURE__*/_react.default.createElement(RequiredBadge, null);
  const hideLabelSetting = props.data.isShowLabel !== undefined && props.data.isShowLabel === false || props.data && props.data.hideLabel === true;
  let hideBecauseDynamicColumn = false;
  if (props.data.parentId) {
    const parentElement = props.mutable && props.mutable.getDataById && props.mutable.getDataById(props.data.parentId);
    if (parentElement && parentElement.element === 'DynamicColumnRow' && props.data.displayLabelInColumn !== true) {
      hideBecauseDynamicColumn = true;
    }
  }

  // Keep the required marker visible even when the cell label is hidden.
  if (hideLabelSetting || hideBecauseDynamicColumn) {
    if (!hasRequiredLabel) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement("label", {
      className: "".concat(props.className || '', " rfb-dcr-required-mark").trim(),
      style: DCR_REQUIRED_MARK_STYLE
    }, requiredMark);
  }
  let labelText = _myxss.default.process(props.data.label);
  labelText = convertUnderlineToIns(labelText);
  labelText = stripPTags(labelText);
  if (props.data.formularKey && props.preview) {
    labelText = "".concat(labelText, " (").concat(props.data.formularKey, ")");
  }
  return /*#__PURE__*/_react.default.createElement("label", {
    className: props.className || ''
  }, /*#__PURE__*/_react.default.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: labelText
    }
  }), hasRequiredLabel && requiredMark);
};
var _default = exports.default = ComponentLabel;