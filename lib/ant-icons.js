"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAntIcon = getAntIcon;
exports.renderAntIcon = renderAntIcon;
var _react = _interopRequireDefault(require("react"));
var _icons = require("@ant-design/icons");
var iconMap = {
  'fa-arrows-alt-h': _icons.ColumnWidthOutlined,
  'fa-calculator': _icons.CalculatorOutlined,
  'fa-calendar-alt': _icons.CalendarOutlined,
  'fa-camera': _icons.CameraOutlined,
  'fa-caret-square-down': _icons.DownSquareOutlined,
  'fa-check-square': _icons.CheckSquareOutlined,
  'fa-columns': _icons.ColumnWidthOutlined,
  'fa-cut': _icons.ScissorOutlined,
  'fa-database': _icons.DatabaseOutlined,
  'fa-dot-circle': _icons.CheckCircleOutlined,
  'fa-edit': _icons.EditOutlined,
  'fa-exclamation-triangle': _icons.ExclamationCircleOutlined,
  'fa-external-link-square-alt': _icons.ExportOutlined,
  'fa-file': _icons.FileOutlined,
  'fa-font': _icons.FontColorsOutlined,
  'fa-grip-vertical': _icons.DragOutlined,
  'fa-heading': _icons.FontSizeOutlined,
  'fa-history': _icons.HistoryOutlined,
  'fa-image': _icons.PictureOutlined,
  'fa-link': _icons.LinkOutlined,
  'fa-minus-circle': _icons.MinusCircleOutlined,
  'fa-paragraph': _icons.AlignLeftOutlined,
  'fa-pen-square': _icons.FormOutlined,
  'fa-plus': _icons.PlusOutlined,
  'fa-plus-circle': _icons.PlusCircleOutlined,
  'fa-redo': _icons.RedoOutlined,
  'fa-signature': _icons.SignatureOutlined,
  'fa-sliders-h': _icons.SlidersOutlined,
  'fa-star': _icons.StarOutlined,
  'fa-table': _icons.TableOutlined,
  'fa-tags': _icons.TagsOutlined,
  'fa-text-height': _icons.LineHeightOutlined,
  'fa-times': _icons.CloseOutlined,
  'fa-trash': _icons.DeleteOutlined,
  'fa-upload': _icons.UploadOutlined
};
function getAntIcon(icon) {
  if (!icon || typeof icon !== 'string') return null;
  var key = icon.split(/\s+/).find(function (className) {
    return iconMap[className];
  });
  return key ? iconMap[key] : null;
}
function renderAntIcon(icon, className) {
  var Icon = getAntIcon(icon);
  if (!Icon) {
    return /*#__PURE__*/_react["default"].createElement("i", {
      className: icon
    });
  }
  return /*#__PURE__*/_react["default"].createElement(Icon, {
    className: ['vdc-ant-form-builder-icon', className].filter(Boolean).join(' ')
  });
}