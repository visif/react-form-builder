"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
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
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "debounceOnChange", function (value) {
      var matchData = _this.state.sourceList.filter(function (item) {
        return "".concat(item.name).toLocaleLowerCase().includes("".concat(value).toLocaleLowerCase());
      });
      _this.setState({
        searchText: value,
        matchedList: matchData
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleOnChange", function (event) {
      if (event.key === "Enter") {
        return;
      }
      _this.debounceOnChange(event.target.value);
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    var defaultValue = props.defaultValue || {};
    _this.state = {
      sourceList: [],
      matchedList: [],
      searchText: defaultValue.value,
      selectedItem: defaultValue.selectedItem,
      defaultSelectedItem: defaultValue.selectedItem,
      isShowingList: false,
      sourceType: props.data.sourceType,
      getDataSource: props.getDataSource
    };
    return _this;
  }
  (0, _createClass2["default"])(DataSource, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              console.log("<<<<<<<<<<<<<<<< componentDidMount >>>>>>>>>>>>>>>>");
              if (!(typeof this.props.getDataSource === "function")) {
                _context.next = 6;
                break;
              }
              _context.next = 4;
              return this.props.getDataSource(this.props.data);
            case 4:
              data = _context.sent;
              this.setState({
                sourceList: data,
                matchedList: data
              });
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }
      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var props = {};
      props.type = "text";
      props.className = "form-control";
      props.name = this.props.data.field_name;
      props.value = this.state.searchText;
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = "SortableItem rfb-item";
      if (this.props.data.pageBreakBefore) {
        baseClasses += " alwaysbreak";
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({}, this.props, {
        style: {
          display: "block"
        }
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: "relative",
          display: "inline-block",
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({}, props, {
        onFocus: this.handleInputFocus,
        onBlur: this.handleInputBlur,
        onChange: this.handleOnChange
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: "absolute",
          zIndex: 99,
          top: "100%",
          left: 0,
          right: 0,
          height: 250,
          overflowY: "auto",
          display: this.state.isShowingList ? "block" : "none"
        }
      }, (this.state.matchedList || []).map(function (item) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          key: item.id,
          style: {
            position: "relative",
            display: "block",
            padding: "0.75rem 1.25rem",
            marginBottom: -1,
            backgroundColor: "#fff",
            //disabled: isSameEditor ? false : true,
            border: "1px solid rgba(0, 0, 0, 0.125)"
            //pointerEvents: isSameEditor ? "auto" : "none"
          },

          onClick: function onClick() {
            _this2.setState({
              selectedItem: item,
              searchText: item.name
            });
          }
        }, item.name);
      })))));
    }
  }]);
  return DataSource;
}(_react["default"].Component);
(0, _defineProperty2["default"])(DataSource, "getDerivedStateFromProps", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(props, state) {
    var defaultValue;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log("getDerivedStateFromProps ");
          if (!(props.defaultValue && JSON.stringify(props.defaultValue.selectedItem) !== JSON.stringify(state.defaultSelectedItem))) {
            _context2.next = 4;
            break;
          }
          defaultValue = props.defaultValue || {};
          return _context2.abrupt("return", {
            searchText: defaultValue.value,
            selectedItem: defaultValue.selectedItem,
            defaultSelectedItem: defaultValue.selectedItem
          });
        case 4:
          return _context2.abrupt("return", state);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = DataSource;
exports["default"] = _default;