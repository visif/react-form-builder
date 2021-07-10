"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FourColumnRow = exports.ThreeColumnRow = exports.TwoColumnRow = void 0;

var _react = _interopRequireDefault(require("react"));

var _componentHeader = _interopRequireDefault(require("../form-elements/component-header"));

var _componentLabel = _interopRequireDefault(require("../form-elements/component-label"));

var _dustbin = _interopRequireDefault(require("./dustbin"));

var _ItemTypes = _interopRequireDefault(require("../ItemTypes"));

var _excluded = ["data", "class_name"],
    _excluded2 = ["data", "class_name"],
    _excluded3 = ["data", "class_name"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var accepts = [_ItemTypes["default"].BOX, _ItemTypes["default"].CARD];

var MultiColumnRow = /*#__PURE__*/function (_React$Component) {
  _inherits(MultiColumnRow, _React$Component);

  var _super = _createSuper(MultiColumnRow);

  function MultiColumnRow() {
    _classCallCheck(this, MultiColumnRow);

    return _super.apply(this, arguments);
  }

  _createClass(MultiColumnRow, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          controls = _this$props.controls,
          data = _this$props.data,
          editModeOn = _this$props.editModeOn,
          getDataById = _this$props.getDataById,
          setAsChild = _this$props.setAsChild,
          removeChild = _this$props.removeChild,
          seq = _this$props.seq,
          className = _this$props.className,
          index = _this$props.index;
      var childItems = data.childItems,
          pageBreakBefore = data.pageBreakBefore;
      var baseClasses = 'SortableItem rfb-item';

      if (pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, childItems.map(function (x, i) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          key: "".concat(i, "_").concat(x || '_'),
          className: className
        }, controls ? controls[i] : /*#__PURE__*/_react["default"].createElement(_dustbin["default"], {
          style: {
            width: '100%'
          },
          data: data,
          accepts: accepts,
          items: childItems,
          col: i,
          parentIndex: index,
          editModeOn: editModeOn,
          _onDestroy: function _onDestroy() {
            return removeChild(data, i);
          },
          getDataById: getDataById,
          setAsChild: setAsChild,
          seq: seq
        }));
      }))));
    }
  }]);

  return MultiColumnRow;
}(_react["default"].Component);

var TwoColumnRow = function TwoColumnRow(_ref) {
  var data = _ref.data,
      class_name = _ref.class_name,
      rest = _objectWithoutProperties(_ref, _excluded);

  var className = class_name || 'col-md-6';

  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null];
    data.isContainer = true;
  }

  return /*#__PURE__*/_react["default"].createElement(MultiColumnRow, _extends({}, rest, {
    className: className,
    data: data
  }));
};

exports.TwoColumnRow = TwoColumnRow;

var ThreeColumnRow = function ThreeColumnRow(_ref2) {
  var data = _ref2.data,
      class_name = _ref2.class_name,
      rest = _objectWithoutProperties(_ref2, _excluded2);

  var className = class_name || 'col-md-4';

  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null, null];
    data.isContainer = true;
  }

  return /*#__PURE__*/_react["default"].createElement(MultiColumnRow, _extends({}, rest, {
    className: className,
    data: data
  }));
};

exports.ThreeColumnRow = ThreeColumnRow;

var FourColumnRow = function FourColumnRow(_ref3) {
  var data = _ref3.data,
      class_name = _ref3.class_name,
      rest = _objectWithoutProperties(_ref3, _excluded3);

  var className = class_name || "col-md-3";

  if (!data.childItems) {
    // eslint-disable-next-line no-param-reassign
    data.childItems = [null, null, null, null];
    data.isContainer = true;
  }

  return /*#__PURE__*/_react["default"].createElement(MultiColumnRow, _extends({}, rest, {
    className: className,
    data: data
  }));
};

exports.FourColumnRow = FourColumnRow;