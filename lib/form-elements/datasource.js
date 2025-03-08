"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DataSource = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(DataSource, _React$Component);
  var _super = _createSuper(DataSource);
  function DataSource(props) {
    var _this;
    (0, _classCallCheck2.default)(this, DataSource);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "checkForValue", function () {
      var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var defaultValue = _this.props.defaultValue;
      var maxRetries = 3;
      if (!_this.state.selectedItem && defaultValue !== null && defaultValue !== void 0 && defaultValue.selectedItem) {
        setTimeout(function () {
          if (_this.mounted && !_this.state.selectedItem) {
            _this.setState({
              searchText: defaultValue.value,
              selectedItem: defaultValue.selectedItem,
              defaultSelectedItem: defaultValue.selectedItem,
              loading: false
            });
            if (!_this.state.selectedItem && attempt < maxRetries) {
              _this.checkForValue(attempt + 1);
            }
          }
        }, 500);
      } else {
        _this.setState({
          loading: false
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInputFocus", function () {
      _this.setState({
        isShowingList: true
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInputBlur", function () {
      setTimeout(function () {
        _this.setState({
          isShowingList: false
        });
      }, 200);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "debounceOnChange", function (value) {
      var matchData = _this.state.sourceList.filter(function (item) {
        return "".concat(item.name).toLocaleLowerCase().includes("".concat(value).toLocaleLowerCase());
      });
      _this.setState({
        searchText: value,
        matchedList: matchData
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnChange", function (event) {
      if (event.key === 'Enter') {
        return;
      }
      _this.debounceOnChange(event.target.value);
    });
    _this.inputField = /*#__PURE__*/_react.default.createRef();
    _this.mounted = false;
    var _defaultValue = props.defaultValue || {};
    _this.state = {
      sourceList: [],
      matchedList: [],
      searchText: _defaultValue.value,
      selectedItem: _defaultValue.selectedItem,
      defaultSelectedItem: _defaultValue.selectedItem,
      isShowingList: false,
      sourceType: props.data.sourceType,
      getDataSource: props.getDataSource,
      loading: true
    };
    return _this;
  }
  (0, _createClass2.default)(DataSource, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.mounted = true;
              _context.next = 3;
              return this.loadDataSource();
            case 3:
              this.checkForValue();
            case 4:
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
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "loadDataSource",
    value: function () {
      var _loadDataSource = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var data;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(typeof this.props.getDataSource === 'function')) {
                _context2.next = 12;
                break;
              }
              _context2.prev = 1;
              _context2.next = 4;
              return this.props.getDataSource(this.props.data);
            case 4:
              data = _context2.sent;
              if (this.mounted) {
                this.setState({
                  sourceList: data,
                  matchedList: data
                });
              }
              _context2.next = 12;
              break;
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              console.warn('Error loading data source:', _context2.t0);
              if (this.mounted) {
                this.setState({
                  sourceList: [],
                  matchedList: []
                });
              }
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[1, 8]]);
      }));
      function loadDataSource() {
        return _loadDataSource.apply(this, arguments);
      }
      return loadDataSource;
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
      var props = {
        type: 'text',
        className: 'form-control',
        name: this.props.data.field_name,
        value: this.state.searchText
      };
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = 'SortableItem rfb-item';
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react.default.createElement(_componentLabel.default, (0, _extends2.default)({}, this.props, {
        style: {
          display: 'block'
        }
      })), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          position: 'relative',
          display: 'inline-block',
          width: '100%'
        }
      }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("input", (0, _extends2.default)({}, props, {
        disabled: !isSameEditor || this.state.loading,
        onFocus: this.handleInputFocus,
        onBlur: this.handleInputBlur,
        onChange: this.handleOnChange
      }))), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 99,
          top: '100%',
          left: 0,
          right: 0,
          height: 250,
          overflowY: 'auto',
          display: this.state.isShowingList ? 'block' : 'none'
        }
      }, (this.state.matchedList || []).map(function (item) {
        return /*#__PURE__*/_react.default.createElement("div", {
          key: item.id,
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
              selectedItem: item,
              searchText: item.name,
              isShowingList: false
            });
          }
        }, item.name);
      })))));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.defaultValue && JSON.stringify(props.defaultValue.selectedItem) !== JSON.stringify(state.defaultSelectedItem)) {
        var defaultValue = props.defaultValue || {};
        return {
          searchText: defaultValue.value,
          selectedItem: defaultValue.selectedItem,
          defaultSelectedItem: defaultValue.selectedItem
        };
      }
      return null;
    }
  }]);
  return DataSource;
}(_react.default.Component);
var _default = DataSource;
exports.default = _default;