"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
const DROPDOWN_MAX_HEIGHT = 250;
const toSourceList = data => Array.isArray(data) ? data : [];
const matchSourceList = (sourceList, value) => {
  const list = toSourceList(sourceList);
  if (value === undefined || value === null || "".concat(value).trim() === '') {
    return list;
  }
  const query = "".concat(value).toLocaleLowerCase();
  return list.filter(item => "".concat(item.name).toLocaleLowerCase().includes(query));
};
class DataSource extends _react.default.Component {
  constructor(props) {
    var _this;
    super(props);
    _this = this;
    (0, _defineProperty2.default)(this, "checkForValue", function () {
      let attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      const {
        defaultValue
      } = _this.props;
      const maxRetries = 3;
      if (!_this.state.selectedItem && defaultValue !== null && defaultValue !== void 0 && defaultValue.selectedItem) {
        setTimeout(() => {
          if (_this.mounted && !_this.state.selectedItem) {
            _this.setState({
              searchText: defaultValue.value,
              selectedItem: defaultValue.selectedItem,
              defaultSelectedItem: defaultValue.selectedItem,
              loading: false
            }, () => {
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
        }, () => {
          // Only notify parent after data is fully loaded and state is set
          _this.notifyParentOfInitialization();
        });
      }
    });
    (0, _defineProperty2.default)(this, "notifyParentOfInitialization", () => {
      // Only notify parent once the component is fully initialized and not during sync operations
      if (this.props.data.parentId && this.props.onElementChange && !this.state.loading && !this.syncInProgress) {
        this.props.onElementChange(_objectSpread(_objectSpread({}, this.props.data), {}, {
          element: 'DataSource',
          initialized: true,
          sourceType: this.props.data.sourceType,
          formSource: this.props.data.formSource,
          selectedItem: this.state.selectedItem,
          value: this.state.searchText,
          isInitialSync: true // Flag to indicate this is initial synchronization
        }));
      }
    });
    (0, _defineProperty2.default)(this, "getDataSourceConfigKey", data => JSON.stringify({
      sourceType: data === null || data === void 0 ? void 0 : data.sourceType,
      formSource: data === null || data === void 0 ? void 0 : data.formSource,
      fields: Object.keys(data || {}).filter(key => key.startsWith('formField')).sort().map(key => [key, data[key]])
    }));
    (0, _defineProperty2.default)(this, "clearBlurTimer", () => {
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null;
      }
    });
    (0, _defineProperty2.default)(this, "getInputElement", () => this.inputField.current);
    (0, _defineProperty2.default)(this, "updateDropdownPosition", () => {
      const input = this.getInputElement();
      if (!input || typeof window === 'undefined') {
        return;
      }
      const rect = input.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;
      const maxHeight = Math.max(80, Math.min(DROPDOWN_MAX_HEIGHT, (openUp ? spaceAbove : spaceBelow) - 8));
      this.setState({
        dropdownStyle: {
          position: 'fixed',
          left: rect.left,
          width: rect.width,
          top: openUp ? undefined : rect.bottom,
          bottom: openUp ? window.innerHeight - rect.top : undefined,
          maxHeight,
          zIndex: 10050,
          overflowY: 'auto',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      });
    });
    (0, _defineProperty2.default)(this, "attachPositionListeners", () => {
      if (this.positionListenersAttached || typeof window === 'undefined') {
        return;
      }
      this.positionListenersAttached = true;
      this.onReposition = () => {
        if (this.state.isShowingList) {
          this.updateDropdownPosition();
        }
      };
      window.addEventListener('resize', this.onReposition);
      window.addEventListener('scroll', this.onReposition, true);
    });
    (0, _defineProperty2.default)(this, "detachPositionListeners", () => {
      if (!this.positionListenersAttached || typeof window === 'undefined') {
        return;
      }
      this.positionListenersAttached = false;
      window.removeEventListener('resize', this.onReposition);
      window.removeEventListener('scroll', this.onReposition, true);
    });
    (0, _defineProperty2.default)(this, "handleInputFocus", () => {
      this.clearBlurTimer();
      this.updateDropdownPosition();
      this.setState({
        isShowingList: true
      });
      this.attachPositionListeners();
    });
    (0, _defineProperty2.default)(this, "handleInputBlur", () => {
      this.clearBlurTimer();
      this.blurTimer = setTimeout(() => {
        if (this.mounted) {
          this.setState({
            isShowingList: false
          });
          this.detachPositionListeners();
        }
      }, 200);
    });
    (0, _defineProperty2.default)(this, "debounceOnChange", value => {
      this.setState({
        searchText: value,
        matchedList: matchSourceList(this.state.sourceList, value)
      });
    });
    (0, _defineProperty2.default)(this, "handleOnChange", event => {
      if (event.key === 'Enter') {
        return;
      }
      this.debounceOnChange(event.target.value);
    });
    (0, _defineProperty2.default)(this, "handleSelectItem", item => {
      const currentTime = Date.now();

      // Prevent sync loops during programmatic updates or rapid successive calls
      if (this.syncInProgress || currentTime - this.lastSyncTimestamp < 200) {
        this.setState({
          selectedItem: item,
          searchText: item.name,
          isShowingList: false
        });
        this.detachPositionListeners();
        return;
      }
      this.setState({
        selectedItem: item,
        searchText: item.name,
        isShowingList: false
      });
      this.detachPositionListeners();

      // Only notify parent about user-initiated selections, not sync updates
      if (this.props.data.parentId && this.props.onElementChange) {
        this.lastSyncTimestamp = currentTime;
        this.props.onElementChange(_objectSpread(_objectSpread({}, this.props.data), {}, {
          element: 'DataSource',
          selectedItem: item,
          value: item.name,
          isUserSelection: true,
          // Flag to indicate this is a user selection
          timestamp: currentTime // Add timestamp to track changes
        }));
      }
    });
    // Method to handle sync updates from parent without triggering more sync events
    (0, _defineProperty2.default)(this, "updateFromSync", syncData => {
      this.syncInProgress = true;
      if (syncData.selectedItem && syncData.selectedItem !== this.state.selectedItem) {
        this.setState({
          selectedItem: syncData.selectedItem,
          searchText: syncData.selectedItem.name || syncData.value || '',
          isShowingList: false
        }, () => {
          // Reset sync flag after state update
          setTimeout(() => {
            this.syncInProgress = false;
          }, 100);
        });
      } else {
        this.syncInProgress = false;
      }
    });
    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.mounted = false;
    this.syncInProgress = false; // Flag to prevent infinite sync loops
    this.lastSyncTimestamp = 0; // Timestamp to prevent rapid sync cycles
    this.blurTimer = null;
    const _defaultValue = props.defaultValue || {};
    this.state = {
      sourceList: [],
      matchedList: [],
      searchText: _defaultValue.value,
      selectedItem: _defaultValue.selectedItem,
      defaultSelectedItem: _defaultValue.selectedItem,
      isShowingList: false,
      dropdownStyle: null,
      sourceType: props.data.sourceType,
      getDataSource: props.getDataSource,
      loading: true
    };
  }
  async componentDidMount() {
    this.mounted = true;
    await this.loadDataSource();
    this.checkForValue();
  }
  componentWillUnmount() {
    this.mounted = false;
    this.clearBlurTimer();
    this.detachPositionListeners();
  }
  async loadDataSource() {
    if (typeof this.props.getDataSource === 'function') {
      try {
        const data = await this.props.getDataSource(this.props.data);
        if (this.mounted) {
          const sourceList = toSourceList(data);
          this.setState({
            sourceList,
            matchedList: matchSourceList(sourceList, this.state.searchText)
          });
        }
      } catch (error) {
        console.warn('Error loading data source:', error);
        if (this.mounted) {
          this.setState({
            sourceList: [],
            matchedList: []
          });
        }
      }
    }
  }
  static getDerivedStateFromProps(props, state) {
    // Handle sync updates from other DataSource components in the same column
    if (props.data.isSyncUpdate && props.data.selectedItem && JSON.stringify(props.data.selectedItem) !== JSON.stringify(state.selectedItem)) {
      return {
        searchText: props.data.value || props.data.selectedItem.name || '',
        selectedItem: props.data.selectedItem,
        defaultSelectedItem: props.data.selectedItem
      };
    }
    if (props.defaultValue && JSON.stringify(props.defaultValue.selectedItem) !== JSON.stringify(state.defaultSelectedItem)) {
      const defaultValue = props.defaultValue || {};
      return {
        searchText: defaultValue.value,
        selectedItem: defaultValue.selectedItem,
        defaultSelectedItem: defaultValue.selectedItem
      };
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    if (this.getDataSourceConfigKey(prevProps.data) !== this.getDataSourceConfigKey(this.props.data)) {
      this.setState({
        searchText: '',
        selectedItem: null,
        defaultSelectedItem: null,
        loading: true
      }, async () => {
        await this.loadDataSource();
        if (this.mounted) {
          this.setState({
            loading: false
          });
        }
      });
    }

    // Clear the sync flag after processing
    if (this.props.data.isSyncUpdate && prevProps.data.isSyncUpdate !== this.props.data.isSyncUpdate) {
      // Clear the flag to prevent further processing
      const updatedData = _objectSpread({}, this.props.data);
      delete updatedData.isSyncUpdate;
      if (this.props.updateElement) {
        this.props.updateElement(updatedData);
      }
    }
  }
  render() {
    const userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
    const savedEditor = this.props.editor;
    const hasValue = this.state.searchText && this.state.searchText.toString().trim() !== '';

    // Allow editing if no value exists OR if user is the same editor
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && hasValue && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
    }

    // Create tooltip text showing editor name
    const tooltipText = savedEditor && savedEditor.name && hasValue ? "".concat(this.state.searchText, "\nEdited by: ").concat(savedEditor.name) : '';
    const props = {
      type: 'text',
      className: 'form-control',
      name: this.props.data.field_name,
      value: this.state.searchText || '',
      ref: this.inputField
    };
    if (tooltipText) {
      props.title = tooltipText;
    }
    let baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }
    const optionStyle = {
      position: 'relative',
      display: 'block',
      padding: '0.75rem 1.25rem',
      marginBottom: -1,
      backgroundColor: '#fff',
      border: '1px solid rgba(0, 0, 0, 0.125)'
    };
    const matchedList = this.state.matchedList || [];
    const dropdown = this.state.isShowingList && this.state.dropdownStyle && typeof document !== 'undefined' ? /*#__PURE__*/_reactDom.default.createPortal(/*#__PURE__*/_react.default.createElement("div", {
      style: this.state.dropdownStyle,
      onMouseDown: event => event.preventDefault()
    }, this.state.loading && matchedList.length === 0 && /*#__PURE__*/_react.default.createElement("div", {
      style: _objectSpread(_objectSpread({}, optionStyle), {}, {
        color: '#888'
      })
    }, "Loading..."), !this.state.loading && matchedList.length === 0 && /*#__PURE__*/_react.default.createElement("div", {
      style: _objectSpread(_objectSpread({}, optionStyle), {}, {
        color: '#888'
      })
    }, "No options"), matchedList.map(item => /*#__PURE__*/_react.default.createElement("div", {
      key: item.id,
      style: _objectSpread(_objectSpread({}, optionStyle), {}, {
        cursor: 'pointer'
      }),
      onMouseDown: event => {
        event.preventDefault();
        this.handleSelectItem(item);
      }
    }, item.name))), document.body) : null;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: baseClasses
    }, /*#__PURE__*/_react.default.createElement(_componentHeader.default, this.props), /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.data.isShowLabel !== false ? 'form-group' : ''
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
      disabled: this.props.read_only || !isSameEditor,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur,
      onChange: this.handleOnChange
    }))), dropdown)));
  }
}
var _default = exports.default = DataSource;