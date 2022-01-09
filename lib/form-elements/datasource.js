"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _componentHeader = _interopRequireDefault(require("./component-header"));

var _componentLabel = _interopRequireDefault(require("./component-label"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DataSource = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(DataSource, _React$Component);

  var _super = _createSuper(DataSource);

  function DataSource(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, DataSource);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleInputFocus", function () {
      _this.setState({
        isShowingList: true
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleInputBlur", function () {
      setTimeout(function () {
        _this.setState({
          isShowingList: false
        });
      }, 200);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleOnChange", function (event) {
      if (event.key === 'Enter') {
        return;
      }

      var value = event.target.value;

      var matchData = _this.state.sourceList.filter(function (item) {
        return "".concat(item).toLocaleLowerCase().includes("".concat(value).toLocaleLowerCase());
      });

      _this.setState({
        searchText: value,
        matchedList: matchData
      });
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      sourceList: [],
      matchedList: [],
      searchText: '',
      isShowingList: false,
      sourceType: props.data.sourceType
    };
    return _this;
  }

  (0, _createClass2["default"])(DataSource, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.getDataSource && typeof this.props.getDataSource === 'function') {
        var data = this.props.getDataSource(this.props.data.sourceType);
        this.setState({
          sourceList: data,
          matchedList: data
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = {};
      props.type = 'text';
      props.className = 'form-control';
      props.name = this.props.data.field_name;
      props.value = this.state.searchText;

      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }

      var baseClasses = 'SortableItem rfb-item';

      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }

      if (this.props.read_only) {
        props.disabled = 'disabled';
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({}, this.props, {
        style: {
          display: 'block'
        }
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'relative',
          display: 'inline-block',
          width: '100%'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({}, props, {
        onFocus: this.handleInputFocus,
        onBlur: this.handleInputBlur,
        onChange: this.handleOnChange
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 99,
          top: "100%",
          left: 0,
          right: 0,
          display: this.state.isShowingList ? 'block' : 'none'
        }
      }, this.state.matchedList.map(function (item) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            position: 'relative',
            display: 'block',
            padding: '0.75rem 1.25rem',
            marginBottom: -1,
            backgroundColor: '#fff',
            border: '1px solid rgba(0, 0, 0, 0.125)'
          },
          onClick: function onClick() {
            _this2.setState({
              searchText: item
            });
          }
        }, item);
      })))));
    }
  }]);
  return DataSource;
}(_react["default"].Component);

var _default = DataSource;
exports["default"] = _default;