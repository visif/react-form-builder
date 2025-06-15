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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormLink = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(FormLink, _React$Component);
  var _super = _createSuper(FormLink);
  function FormLink(props) {
    var _this;
    (0, _classCallCheck2.default)(this, FormLink);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "loadFormInfo", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _this$state$selectedF;
      var formSource, formInfo;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            formSource = _this.props.data.formSource || ((_this$state$selectedF = _this.state.selectedFormId) === null || _this$state$selectedF === void 0 ? void 0 : _this$state$selectedF.id);
            if (!(typeof _this.props.getFormInfo === 'function' && formSource)) {
              _context.next = 13;
              break;
            }
            _context.prev = 2;
            _context.next = 5;
            return _this.props.getFormInfo(formSource);
          case 5:
            formInfo = _context.sent;
            if (_this.mounted) {
              _this.setState({
                formInfo: formInfo || null
              });
            }
            _context.next = 13;
            break;
          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            console.warn('Error loading form info:', _context.t0);
            if (_this.mounted) {
              _this.setState({
                formInfo: null
              });
            }
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 9]]);
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "checkForValue", function () {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnChange", function (event) {
      if (event.key === 'Enter') {
        return;
      }
      _this.debounceOnChange(event.target.value);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleFormSelect", function (form) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "openLinkedForm", function () {
      console.info("Select form: ".concat(_this.state.selectedFormId));
      var selectedFormId = _this.state.selectedFormId.selectedFormId;
      if (selectedFormId && typeof _this.props.openLinkedForm === 'function') {
        _this.props.openLinkedForm(selectedFormId);
      }
    });
    _this.inputField = /*#__PURE__*/_react.default.createRef();
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
      loading: true
    };
    return _this;
  }
  (0, _createClass2.default)(FormLink, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.mounted = true;
              _context2.next = 3;
              return this.loadFormSource();
            case 3:
              this.checkForValue();

              // Load form info if formSource exists
              _context2.next = 6;
              return this.loadFormInfo();
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
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
      var _loadFormSource = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var _this2 = this;
        var forms, selectedForm;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!(typeof this.props.getFormSource === 'function')) {
                _context3.next = 20;
                break;
              }
              _context3.prev = 1;
              _context3.next = 4;
              return this.props.getFormSource(this.props.data);
            case 4:
              forms = _context3.sent;
              if (!this.mounted) {
                _context3.next = 14;
                break;
              }
              if (!this.props.data.formSource) {
                _context3.next = 13;
                break;
              }
              selectedForm = forms.find(function (form) {
                return form.id == _this2.props.data.formSource;
              });
              if (!selectedForm) {
                _context3.next = 13;
                break;
              }
              this.setState({
                formList: forms,
                matchedList: forms,
                selectedFormId: selectedForm,
                // Store the full form object
                searchText: selectedForm.title || ''
              });
              // Load form info for the selected form
              _context3.next = 12;
              return this.loadFormInfo();
            case 12:
              return _context3.abrupt("return");
            case 13:
              this.setState({
                formList: forms,
                matchedList: forms
              });
            case 14:
              _context3.next = 20;
              break;
            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3["catch"](1);
              console.warn('Error loading form source:', _context3.t0);
              if (this.mounted) {
                this.setState({
                  formList: [],
                  matchedList: []
                });
              }
            case 20:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[1, 16]]);
      }));
      function loadFormSource() {
        return _loadFormSource.apply(this, arguments);
      }
      return loadFormSource;
    }()
  }, {
    key: "componentDidUpdate",
    value: function () {
      var _componentDidUpdate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(prevProps) {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(prevProps.data.formSource !== this.props.data.formSource)) {
                _context4.next = 3;
                break;
              }
              _context4.next = 3;
              return this.loadFormInfo();
            case 3:
              if (!(prevProps.data !== this.props.data)) {
                _context4.next = 6;
                break;
              }
              _context4.next = 6;
              return this.loadFormSource();
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function componentDidUpdate(_x) {
        return _componentDidUpdate.apply(this, arguments);
      }
      return componentDidUpdate;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this3 = this,
        _this$state$formInfo,
        _this$state$selectedF2,
        _this$state$formInfo2;
      var userProperties = this.props.getActiveUserProperties && this.props.getActiveUserProperties();
      var savedEditor = this.props.editor;
      var isSameEditor = true;
      if (savedEditor && savedEditor.userId && !!userProperties) {
        isSameEditor = userProperties.userId === savedEditor.userId;
      }
      var baseClasses = "".concat(this.props.data.isShowLabel !== false ? 'SortableItem rfb-item' : 'SortableItem');
      if (this.props.data.pageBreakBefore) {
        baseClasses += ' alwaysbreak';
      }
      var formTitle = this.state.selectedFormId ? this.state.selectedFormId.title : 'Select a form';
      var isFormSelected = !!this.state.selectedFormId;
      return /*#__PURE__*/_react.default.createElement("section", {
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
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "form-link-container",
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement("div", {
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
      }, isFormSelected ? /*#__PURE__*/_react.default.createElement("span", null, ((_this$state$formInfo = this.state.formInfo) === null || _this$state$formInfo === void 0 ? void 0 : _this$state$formInfo.Name) || ((_this$state$selectedF2 = this.state.selectedFormId) === null || _this$state$selectedF2 === void 0 ? void 0 : _this$state$selectedF2.title) || 'Loading...') : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
        className: "form-link-preview",
        style: {
          padding: '6px 0'
        }
      }, /*#__PURE__*/_react.default.createElement("a", {
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
      }, ((_this$state$formInfo2 = this.state.formInfo) === null || _this$state$formInfo2 === void 0 ? void 0 : _this$state$formInfo2.Name) || 'Please select a form'))))))));
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
  return FormLink;
}(_react.default.Component);
var _default = FormLink;
exports.default = _default;