"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoColumnRow = exports.ThreeColumnRow = exports.FourColumnRow = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("../form-elements/component-header"));
var _componentLabel = _interopRequireDefault(require("../form-elements/component-label"));
var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));
var _dustbin = _interopRequireDefault(require("./dustbin"));
var _excluded = ["data", "class_name"];
var accepts = [_ItemTypes.default.BOX, _ItemTypes.default.CARD];
var MultiColumnRow = function MultiColumnRow(props) {
  var controls = props.controls,
    _props$data = props.data,
    data = _props$data === void 0 ? {} : _props$data,
    editModeOn = props.editModeOn,
    getDataById = props.getDataById,
    setAsChild = props.setAsChild,
    removeChild = props.removeChild,
    seq = props.seq,
    className = props.className,
    index = props.index;
  var _data$childItems = data.childItems,
    childItems = _data$childItems === void 0 ? [] : _data$childItems,
    pageBreakBefore = data.pageBreakBefore; // Default childItems to an empty array
  var baseClasses = "SortableItem rfb-item ".concat(pageBreakBefore ? 'alwaysbreak' : '');
<<<<<<< HEAD
  return /*#__PURE__*/_react.default.createElement("div", {
=======
  return /*#__PURE__*/_react["default"].createElement("div", {
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
    className: baseClasses
  }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, props), " ", /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_componentLabel.default, props), " ", /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, childItems.map(function (item, columnIndex) {
<<<<<<< HEAD
    return /*#__PURE__*/_react.default.createElement("div", {
=======
    return /*#__PURE__*/_react["default"].createElement("div", {
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
      key: "".concat(columnIndex, "_").concat(item || '_'),
      className: className
    }, controls ? controls[columnIndex] : /*#__PURE__*/_react.default.createElement(_dustbin.default, {
      style: {
        width: '100%'
      },
      data: data,
      accepts: accepts,
      items: childItems,
      col: columnIndex,
      parentIndex: index,
      editModeOn: editModeOn,
      _onDestroy: function _onDestroy() {
        return removeChild(data, columnIndex);
      },
      getDataById: getDataById,
      setAsChild: setAsChild,
      seq: seq
    }));
  }))));
};
var createColumnRow = function createColumnRow(defaultClassName, numberOfColumns) {
  return function (_ref) {
    var _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      class_name = _ref.class_name,
      rest = (0, _objectWithoutProperties2.default)(_ref, _excluded);
    var className = class_name || defaultClassName;
    if (!data.childItems) {
      data.childItems = Array(numberOfColumns).fill(null);
      data.isContainer = true;
    }
    return /*#__PURE__*/_react.default.createElement(MultiColumnRow, (0, _extends2.default)({}, rest, {
      className: className,
      data: data
    }));
  };
};
var TwoColumnRow = createColumnRow('col-md-6', 2);
exports.TwoColumnRow = TwoColumnRow;
var ThreeColumnRow = createColumnRow('col-md-4', 3);
exports.ThreeColumnRow = ThreeColumnRow;
var FourColumnRow = createColumnRow('col-md-3', 4);
exports.FourColumnRow = FourColumnRow;