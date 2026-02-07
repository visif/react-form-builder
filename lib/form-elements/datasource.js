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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DataSource = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(DataSource, _React$Component);
  var _super = _createSuper(DataSource);
  function DataSource(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DataSource);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "checkForValue", function () {
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
            }, function () {
              // Only notify parent after data is fully loaded and state is set
              _this.notifyParentOfInitialization();
            });
            if (!_this.state.selectedItem && attempt < maxRetries) {
              _this.checkForValue(attempt + 1);
            }
          }
        }, 500);
      } else {
        _this.setState({
          loading: false
        }, function () {
          // Only notify parent after data is fully loaded and state is set
          _this.notifyParentOfInitialization();
        });
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "notifyParentOfInitialization", function () {
      // Only notify parent once the component is fully initialized and not during sync operations
      if (_this.props.data.parentId && _this.props.onElementChange && !_this.state.loading && !_this.syncInProgress) {
        _this.props.onElementChange(_objectSpread(_objectSpread({}, _this.props.data), {}, {
          element: 'DataSource',
          initialized: true,
          sourceType: _this.props.data.sourceType,
          formSource: _this.props.data.formSource,
          selectedItem: _this.state.selectedItem,
          value: _this.state.searchText,
          isInitialSync: true // Flag to indicate this is initial synchronization
        }));
      }
    });
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
      if (event.key === 'Enter') {
        return;
      }
      _this.debounceOnChange(event.target.value);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleSelectItem", function (item) {
      var currentTime = Date.now();

      // Prevent sync loops during programmatic updates or rapid successive calls
      if (_this.syncInProgress || currentTime - _this.lastSyncTimestamp < 200) {
        _this.setState({
          selectedItem: item,
          searchText: item.name,
          isShowingList: false
        });
        return;
      }
      _this.setState({
        selectedItem: item,
        searchText: item.name,
        isShowingList: false
      });

      // Only notify parent about user-initiated selections, not sync updates
      if (_this.props.data.parentId && _this.props.onElementChange && !_this.state.loading) {
        _this.lastSyncTimestamp = currentTime;
        _this.props.onElementChange(_objectSpread(_objectSpread({}, _this.props.data), {}, {
          element: 'DataSource',
          selectedItem: item,
          value: item.name,
          isUserSelection: true,
          // Flag to indicate this is a user selection
          timestamp: currentTime // Add timestamp to track changes
        }));
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateFromSync", function (syncData) {
      _this.syncInProgress = true;
      if (syncData.selectedItem && syncData.selectedItem !== _this.state.selectedItem) {
        _this.setState({
          selectedItem: syncData.selectedItem,
          searchText: syncData.selectedItem.name || syncData.value || '',
          isShowingList: false
        }, function () {
          // Reset sync flag after state update
          setTimeout(function () {
            _this.syncInProgress = false;
          }, 100);
        });
      } else {
        _this.syncInProgress = false;
      }
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.mounted = false;
    _this.syncInProgress = false; // Flag to prevent infinite sync loops
    _this.lastSyncTimestamp = 0; // Timestamp to prevent rapid sync cycles

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
  (0, _createClass2["default"])(DataSource, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
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
      var _loadDataSource = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var data;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
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
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // Clear the sync flag after processing
      if (this.props.data.isSyncUpdate && prevProps.data.isSyncUpdate !== this.props.data.isSyncUpdate) {
        // Clear the flag to prevent further processing
        var updatedData = _objectSpread({}, this.props.data);
        delete updatedData.isSyncUpdate;
        if (this.props.updateElement) {
          this.props.updateElement(updatedData);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var hasValue = this.state.searchText && this.state.searchText.toString().trim() !== '';

      // Allow editing if no value exists OR if user is the same editor
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }

      // Create tooltip text showing editor name
      var tooltipText = savedEditor && savedEditor.name && hasValue ? "Edited by: ".concat(savedEditor.name) : '';
      var props = {
        type: 'text',
        className: 'form-control',
        name: this.props.data.field_name,
        value: this.state.searchText
      };
      if (tooltipText) {
        props.title = tooltipText;
      }
      if (this.props.mutable) {
        props.defaultValue = this.props.defaultValue;
        props.ref = this.inputField;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: baseClasses
      }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], this.props), /*#__PURE__*/_react["default"].createElement("div", {
        className: this.props.data.isShowLabel !== false ? 'form-group' : ''
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
        disabled: this.props.read_only || !isSameEditor || this.state.loading,
        onFocus: this.handleInputFocus,
        onBlur: this.handleInputBlur,
        onChange: this.handleOnChange
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 199,
          top: '100%',
          left: 0,
          right: 0,
          height: 250,
          overflowY: 'auto',
          display: this.state.isShowingList ? 'block' : 'none'
        }
      }, (this.state.matchedList || []).map(function (item) {
        return /*#__PURE__*/_react["default"].createElement("div", {
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
            return _this2.handleSelectItem(item);
          }
        }, item.name);
      })))));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      // Handle sync updates from other DataSource components in the same column
      if (props.data.isSyncUpdate && props.data.selectedItem && JSON.stringify(props.data.selectedItem) !== JSON.stringify(state.selectedItem)) {
        return {
          searchText: props.data.value || props.data.selectedItem.name || '',
          selectedItem: props.data.selectedItem,
          defaultSelectedItem: props.data.selectedItem
        };
      }
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
}(_react["default"].Component);
var _default = DataSource;
exports["default"] = _default;