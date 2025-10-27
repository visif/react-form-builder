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
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _componentLabel = _interopRequireDefault(require("./component-label"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var FormLink = /*#__PURE__*/function (_React$Component) {
  function FormLink(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FormLink);
    _this = _callSuper(this, FormLink, [props]);
    (0, _defineProperty2["default"])(_this, "checkForValue", function () {
      var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var defaultValue = _this.props.defaultValue;
      var maxRetries = 3;
      if (!_this.state.selectedFormId && defaultValue !== null && defaultValue !== void 0 && defaultValue.selectedFormId) {
        setTimeout(function () {
          if (_this.mounted && !_this.state.selectedFormId) {
            _this.setState({
              searchText: defaultValue.value || '',
              selectedFormId: defaultValue.selectedFormId,
              defaultSelectedFormId: defaultValue.selectedFormId,
              loading: false
            });
            if (!_this.state.selectedFormId && attempt < maxRetries) {
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
    (0, _defineProperty2["default"])(_this, "handleInputFocus", function () {
      _this.setState({
        isShowingList: true
      });
    });
    (0, _defineProperty2["default"])(_this, "handleInputBlur", function () {
      setTimeout(function () {
        _this.setState({
          isShowingList: false
        });
      }, 200);
    });
    (0, _defineProperty2["default"])(_this, "debounceOnChange", function (value) {
      var matchData = _this.state.formList.filter(function (form) {
        return "".concat(form.title).toLocaleLowerCase().includes("".concat(value).toLocaleLowerCase());
      });
      _this.setState({
        searchText: value,
        matchedList: matchData
      });

      // If onElementChange is provided, call it to synchronize changes across the column
      if (_this.props.onElementChange) {
        var updatedData = _objectSpread(_objectSpread({}, _this.props.data), {}, {
          value: value
        });
        _this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (_this.props.data.dirty === undefined || _this.props.data.dirty) {
          updatedData.dirty = true;
          if (_this.props.updateElement) {
            _this.props.updateElement(updatedData);
          }
        }
      }
    });
    (0, _defineProperty2["default"])(_this, "handleOnChange", function (event) {
      if (event.key === 'Enter') {
        return;
      }
      _this.debounceOnChange(event.target.value);
    });
    (0, _defineProperty2["default"])(_this, "handleFormSelect", function (form) {
      _this.setState({
        selectedFormId: form,
        searchText: form.title,
        isShowingList: false
      });

      // If onElementChange is provided, call it to synchronize changes across the column
      if (_this.props.onElementChange) {
        var updatedData = _objectSpread(_objectSpread({}, _this.props.data), {}, {
          value: form.title,
          selectedFormId: form,
          formSource: form.id // Save the form ID as formSource
        });
        _this.props.onElementChange(updatedData);

        // Immediately apply changes to this component's data
        if (_this.props.data.dirty === undefined || _this.props.data.dirty) {
          updatedData.dirty = true;
          if (_this.props.updateElement) {
            _this.props.updateElement(updatedData);
          }
        }
      }
    });
    (0, _defineProperty2["default"])(_this, "openLinkedForm", function () {
      console.info("Select form: ".concat(_this.state.selectedFormId));
      var selectedFormId = _this.state.selectedFormId.selectedFormId;
      if (selectedFormId && typeof _this.props.openLinkedForm === 'function') {
        _this.props.openLinkedForm(selectedFormId);
      }
    });
    _this.inputField = /*#__PURE__*/_react["default"].createRef();
    _this.mounted = false;
    var _defaultValue = props.defaultValue || {};
    _this.state = {
      formList: [],
      matchedList: [],
      formInfo: null,
      searchText: _defaultValue.value || '',
      selectedFormId: _defaultValue.selectedFormId,
      defaultSelectedForm: _defaultValue.selectedForm,
      isShowingList: false,
      getFormSource: props.getFormSource,
      loading: true,
      parentElementId: 0
    };
    return _this;
  }
  (0, _inherits2["default"])(FormLink, _React$Component);
  return (0, _createClass2["default"])(FormLink, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var formInfo, _t;
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.mounted = true;
              _context.next = 1;
              return this.loadFormSource();
            case 1:
              this.checkForValue();
              if (!(typeof this.props.getFormInfo === 'function' && this.props.data.formSource)) {
                _context.next = 5;
                break;
              }
              _context.prev = 2;
              _context.next = 3;
              return this.props.getFormInfo(this.props.data.formSource);
            case 3:
              formInfo = _context.sent;
              if (this.mounted) {
                this.setState({
                  formInfo: formInfo || null
                });
              }
              _context.next = 5;
              break;
            case 4:
              _context.prev = 4;
              _t = _context["catch"](2);
              console.warn('Error loading form info:', _t);
              if (this.mounted) {
                this.setState({
                  formInfo: null
                });
              }
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 4]]);
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
    key: "loadFormSource",
    value: function () {
      var _loadFormSource = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this2 = this;
        var forms, selectedFormId, _t2;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(typeof this.props.getFormSource === 'function')) {
                _context2.next = 6;
                break;
              }
              _context2.prev = 1;
              _context2.next = 2;
              return this.props.getFormSource(this.props.data);
            case 2:
              forms = _context2.sent;
              if (!this.mounted) {
                _context2.next = 4;
                break;
              }
              if (!this.props.data.formSource) {
                _context2.next = 3;
                break;
              }
              selectedFormId = forms.find(function (form) {
                return form.id == _this2.props.data.formSource;
              });
              if (!selectedFormId) {
                _context2.next = 3;
                break;
              }
              this.setState({
                formList: forms,
                matchedList: forms,
                selectedFormId: selectedFormId,
                searchText: ''
              });
              return _context2.abrupt("return");
            case 3:
              this.setState({
                formList: forms,
                matchedList: forms
              });
            case 4:
              _context2.next = 6;
              break;
            case 5:
              _context2.prev = 5;
              _t2 = _context2["catch"](1);
              console.warn('Error loading form source:', _t2);
              if (this.mounted) {
                this.setState({
                  formList: [],
                  matchedList: []
                });
              }
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[1, 5]]);
      }));
      function loadFormSource() {
        return _loadFormSource.apply(this, arguments);
      }
      return loadFormSource;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      var formTitle = this.state.selectedFormId ? this.state.selectedFormId.title : 'Select a form';
      var isFormSelected = !!this.state.selectedFormId;
      return /*#__PURE__*/_react["default"].createElement("section", {
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
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-link-container",
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        onClick: function onClick() {
          return _this3.setState({
            isShowingList: true
          });
        },
        style: {
          flex: 1,
          border: '1px solid #ced4da',
          borderRadius: '.25rem',
          padding: '6px 12px',
          cursor: 'pointer',
          backgroundColor: isFormSelected ? '#fff' : '#f8f9fa',
          minHeight: '38px',
          display: 'flex',
          alignItems: 'center'
        }
      }, isFormSelected ? /*#__PURE__*/_react["default"].createElement("span", null, this.state.formInfo ? this.state.formInfo.Name : 'Please select a form') : /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-link-preview",
        style: {
          padding: '6px 0'
        }
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "#",
        style: {
          marginTop: 6
        },
        className: "btn btn-secondary",
        onClick: function onClick(e) {
          e.preventDefault();
          if (typeof _this3.props.onSelectChildForm === 'function') {
            _this3.props.onSelectChildForm(_this3.props.data.id, _this3.props.data.formSource);
          }
        }
      }, this.state.formInfo ? this.state.formInfo.Name : 'Please select a form'))))))));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.defaultValue && JSON.stringify(props.defaultValue.selectedFormId) !== JSON.stringify(state.defaultSelectedFormId)) {
        var defaultValue = props.defaultValue || {};
        return {
          searchText: defaultValue.value || '',
          selectedFormId: defaultValue.selectedFormId,
          defaultSelectedForm: defaultValue.selectedFormId
        };
      }
      return null;
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = FormLink;