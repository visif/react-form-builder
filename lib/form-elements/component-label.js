"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RequiredBadge = exports.REQUIRED_BADGE_STYLE = void 0;
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
const RequiredBadge = () => /*#__PURE__*/_react.default.createElement("span", {
  className: "label-required badge badge-danger",
  style: REQUIRED_BADGE_STYLE
}, "Required");
exports.RequiredBadge = RequiredBadge;
const isRequiredValue = value => value === true || value === 'true';
const ComponentLabel = props => {
  var _props$data;
  const hasRequiredLabel = isRequiredValue((_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.required) && !props.read_only;
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
      className: props.className || ''
    }, /*#__PURE__*/_react.default.createElement(RequiredBadge, null));
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
  }), hasRequiredLabel && /*#__PURE__*/_react.default.createElement(RequiredBadge, null));
};
var _default = exports.default = ComponentLabel;