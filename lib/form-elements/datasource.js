"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var DataSource = function DataSource(props) {
  var inputField = _react["default"].useRef(null);
  var mounted = _react["default"].useRef(false);
  var syncInProgress = _react["default"].useRef(false); // Flag to prevent infinite sync loops
  var lastSyncTimestamp = _react["default"].useRef(0); // Timestamp to prevent rapid sync cycles

  var defaultValue = props.defaultValue || {};
  var _React$useState = _react["default"].useState([]),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    sourceList = _React$useState2[0],
    setSourceList = _React$useState2[1];
  var _React$useState3 = _react["default"].useState([]),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    matchedList = _React$useState4[0],
    setMatchedList = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(defaultValue.value),
    _React$useState6 = (0, _slicedToArray2["default"])(_React$useState5, 2),
    searchText = _React$useState6[0],
    setSearchText = _React$useState6[1];
  var _React$useState7 = _react["default"].useState(defaultValue.selectedItem),
    _React$useState8 = (0, _slicedToArray2["default"])(_React$useState7, 2),
    selectedItem = _React$useState8[0],
    setSelectedItem = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(defaultValue.selectedItem),
    _React$useState0 = (0, _slicedToArray2["default"])(_React$useState9, 2),
    defaultSelectedItem = _React$useState0[0],
    setDefaultSelectedItem = _React$useState0[1];
  var _React$useState1 = _react["default"].useState(false),
    _React$useState10 = (0, _slicedToArray2["default"])(_React$useState1, 2),
    isShowingList = _React$useState10[0],
    setIsShowingList = _React$useState10[1];
  var _React$useState11 = _react["default"].useState(true),
    _React$useState12 = (0, _slicedToArray2["default"])(_React$useState11, 2),
    loading = _React$useState12[0],
    setLoading = _React$useState12[1];
  var notifyParentOfInitialization = _react["default"].useCallback(function () {
    // Only notify parent once the component is fully initialized and not during sync operations
    if (props.data.parentId && props.onElementChange && !loading && !syncInProgress.current) {
      props.onElementChange(_objectSpread(_objectSpread({}, props.data), {}, {
        element: 'DataSource',
        initialized: true,
        sourceType: props.data.sourceType,
        formSource: props.data.formSource,
        selectedItem: selectedItem,
        value: searchText,
        isInitialSync: true // Flag to indicate this is initial synchronization
      }));
    }
  }, [props, loading, selectedItem, searchText]);
  var checkForValue = _react["default"].useCallback(function () {
    var _props$defaultValue;
    var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var maxRetries = 3;
    if (!selectedItem && (_props$defaultValue = props.defaultValue) !== null && _props$defaultValue !== void 0 && _props$defaultValue.selectedItem) {
      setTimeout(function () {
        if (mounted.current && !selectedItem) {
          setSearchText(props.defaultValue.value);
          setSelectedItem(props.defaultValue.selectedItem);
          setDefaultSelectedItem(props.defaultValue.selectedItem);
          setLoading(false);
          // Only notify parent after data is fully loaded and state is set
          notifyParentOfInitialization();
          if (!selectedItem && attempt < maxRetries) {
            checkForValue(attempt + 1);
          }
        }
      }, 500);
    } else {
      setLoading(false);
      // Only notify parent after data is fully loaded and state is set
      notifyParentOfInitialization();
    }
  }, [selectedItem, props.defaultValue, notifyParentOfInitialization]);
  var loadDataSource = _react["default"].useCallback(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var data, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof props.getDataSource === 'function')) {
            _context.next = 4;
            break;
          }
          _context.prev = 1;
          _context.next = 2;
          return props.getDataSource(props.data);
        case 2:
          data = _context.sent;
          if (mounted.current) {
            setSourceList(data);
            setMatchedList(data);
          }
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          console.warn('Error loading data source:', _t);
          if (mounted.current) {
            setSourceList([]);
            setMatchedList([]);
          }
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 3]]);
  })), [props]);
  _react["default"].useEffect(function () {
    mounted.current = true;
    var init = /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 1;
              return loadDataSource();
            case 1:
              checkForValue();
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function init() {
        return _ref2.apply(this, arguments);
      };
    }();
    init();
    return function () {
      mounted.current = false;
    };
  }, [loadDataSource, checkForValue]);
  _react["default"].useEffect(function () {
    // Handle sync updates from other DataSource components in the same column
    if (props.data.isSyncUpdate && props.data.selectedItem && JSON.stringify(props.data.selectedItem) !== JSON.stringify(selectedItem)) {
      setSearchText(props.data.value || props.data.selectedItem.name || '');
      setSelectedItem(props.data.selectedItem);
      setDefaultSelectedItem(props.data.selectedItem);

      // Clear the sync flag after processing
      var updatedData = _objectSpread({}, props.data);
      delete updatedData.isSyncUpdate;
      if (props.updateElement) {
        props.updateElement(updatedData);
      }
    } else if (props.defaultValue && JSON.stringify(props.defaultValue.selectedItem) !== JSON.stringify(defaultSelectedItem)) {
      var newDefaultValue = props.defaultValue || {};
      setSearchText(newDefaultValue.value);
      setSelectedItem(newDefaultValue.selectedItem);
      setDefaultSelectedItem(newDefaultValue.selectedItem);
    }
  }, [props.data, props.defaultValue, props.updateElement, selectedItem, defaultSelectedItem]);
  var handleInputFocus = _react["default"].useCallback(function () {
    setIsShowingList(true);
  }, []);
  var handleInputBlur = _react["default"].useCallback(function () {
    setTimeout(function () {
      setIsShowingList(false);
    }, 200);
  }, []);
  var debounceOnChange = _react["default"].useCallback(function (value) {
    var matchData = sourceList.filter(function (item) {
      return "".concat(item.name).toLocaleLowerCase().includes("".concat(value).toLocaleLowerCase());
    });
    setSearchText(value);
    setMatchedList(matchData);
  }, [sourceList]);
  var handleOnChange = _react["default"].useCallback(function (event) {
    if (event.key === 'Enter') {
      return;
    }
    debounceOnChange(event.target.value);
  }, [debounceOnChange]);
  var handleSelectItem = _react["default"].useCallback(function (item) {
    var currentTime = Date.now();

    // Prevent sync loops during programmatic updates or rapid successive calls
    if (syncInProgress.current || currentTime - lastSyncTimestamp.current < 200) {
      setSelectedItem(item);
      setSearchText(item.name);
      setIsShowingList(false);
      return;
    }
    setSelectedItem(item);
    setSearchText(item.name);
    setIsShowingList(false);

    // Only notify parent about user-initiated selections, not sync updates
    if (props.data.parentId && props.onElementChange && !loading) {
      lastSyncTimestamp.current = currentTime;
      props.onElementChange(_objectSpread(_objectSpread({}, props.data), {}, {
        element: 'DataSource',
        selectedItem: item,
        value: item.name,
        isUserSelection: true,
        // Flag to indicate this is a user selection
        timestamp: currentTime // Add timestamp to track changes
      }));
    }
  }, [props, loading]);
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
  }
  var inputProps = {
    type: 'text',
    className: 'form-control',
    name: props.data.field_name,
    value: searchText
  };
  if (props.mutable) {
    inputProps.defaultValue = props.defaultValue;
    inputProps.ref = inputField;
  }
  var baseClasses = "".concat(props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
  if (props.data.pageBreakBefore) {
    baseClasses += ' alwaysbreak';
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: props.data.isShowLabel !== false ? 'form-group' : ''
  }, /*#__PURE__*/_react["default"].createElement(_componentLabel["default"], (0, _extends2["default"])({}, props, {
    style: {
      display: 'block'
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: '100%'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({}, inputProps, {
    disabled: props.read_only || !isSameEditor || loading,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    onChange: handleOnChange
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: 'absolute',
      zIndex: 199,
      top: '100%',
      left: 0,
      right: 0,
      height: 250,
      overflowY: 'auto',
      display: isShowingList ? 'block' : 'none'
    }
  }, (matchedList || []).map(function (item) {
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
        return handleSelectItem(item);
      }
    }, item.name);
  })))));
};
var _default = exports["default"] = DataSource;