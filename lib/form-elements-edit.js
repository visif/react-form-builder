"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactDraftWysiwyg = require("react-draft-wysiwyg");
var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));
var _draftJs = require("draft-js");
var _draftjsToHtml = _interopRequireDefault(require("draftjs-to-html"));
var _dynamicColumnList = _interopRequireDefault(require("./dynamic-column-list"));
var _dynamicOptionList = _interopRequireDefault(require("./dynamic-option-list"));
var _fixedRowList = _interopRequireDefault(require("./fixed-row-list"));
var _requests = require("./stores/requests");
var _UUID = _interopRequireDefault(require("./UUID"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript']
  }
};
var FormElementsEdit = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(FormElementsEdit, _React$Component);
  var _super = _createSuper(FormElementsEdit);
  function FormElementsEdit(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FormElementsEdit);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateElement", function () {
      var this_element = _this.state.element;
      // to prevent ajax calls with no change
      if (_this.state.dirty) {
        _this.props.updateElement.call(_this.props.preview, this_element);
        _this.setState({
          dirty: false
        });
      }

      // If this is a Signature2 element in a DynamicColumnRow, we need to sync changes
      if (this_element.element === 'Signature2' && this_element.parentId && this_element.row !== undefined && this_element.col !== undefined && _this.props.preview && _this.props.preview.syncRowChanges) {
        _this.props.preview.syncRowChanges(this_element);
      }
    });
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false,
      formDataSource: [],
      activeForm: null
    };
    return _this;
  }
  (0, _createClass2["default"])(FormElementsEdit, [{
    key: "onUploadFile",
    value: function () {
      var _onUploadFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
        var this_element, file, imageUrl, reader, _this_element;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!event || !event.target || !event.target.files || !this.props.onImageUpload)) {
                _context.next = 3;
                break;
              }
              if (!this.props.onImageUpload) {
                this_element = this.state.element;
                this_element.src = 'Please provide upload callback';
                this.setState({
                  element: this_element
                });
              }
              return _context.abrupt("return");
            case 3:
              _context.prev = 3;
              file = event.target.files[0];
              _context.next = 7;
              return this.props.onImageUpload(file, this.props.element.id);
            case 7:
              imageUrl = _context.sent;
              reader = new FileReader();
              reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                  var this_element = this.state.element;
                  this_element.width = img.width;
                  this_element.height = img.height;
                  this_element.src = imageUrl;
                  this.setState({
                    element: this_element
                  });
                  this.props.updateElement.call(this.props.preview, this_element);
                }.bind(this);
                img.src = reader.result;
              }.bind(this);
              reader.readAsDataURL(file);
              _context.next = 19;
              break;
            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](3);
              console.log('error upload', _context.t0);
              _this_element = this.state.element;
              _this_element.src = 'cannot upload file';
              this.setState({
                element: _this_element
              });
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[3, 13]]);
      }));
      function onUploadFile(_x) {
        return _onUploadFile.apply(this, arguments);
      }
      return onUploadFile;
    }()
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this2 = this;
        var formDataSource, activeForm, activeFormContent;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              formDataSource = [];
              activeForm = {};
              activeFormContent = {};
              if (!((this.props.element.element === 'DataSource' || this.props.element.element === 'FormLink') && this.props.getFormSource)) {
                _context2.next = 20;
                break;
              }
              _context2.next = 6;
              return this.props.getFormSource();
            case 6:
              _context2.t0 = _context2.sent;
              if (_context2.t0) {
                _context2.next = 9;
                break;
              }
              _context2.t0 = [];
            case 9:
              formDataSource = _context2.t0;
              if (!formDataSource) {
                _context2.next = 19;
                break;
              }
              activeForm = formDataSource.find(function (item) {
                return item.id == _this2.props.element.formSource;
              });

              /// Call api to get current form field
              if (!(activeForm && this.props.getFormContent)) {
                _context2.next = 19;
                break;
              }
              _context2.next = 15;
              return this.props.getFormContent(activeForm);
            case 15:
              _context2.t1 = _context2.sent;
              if (_context2.t1) {
                _context2.next = 18;
                break;
              }
              _context2.t1 = {};
            case 18:
              activeFormContent = _context2.t1;
            case 19:
              this.setState(function (current) {
                return _objectSpread(_objectSpread({}, current), {}, {
                  formDataSource: formDataSource,
                  activeForm: activeFormContent
                });
              });
            case 20:
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
    key: "editElementProp",
    value: function () {
      var _editElementProp = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(elemProperty, targProperty, e) {
        var _this3 = this;
        var this_element, activeForm, activeFormContent;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              // elemProperty could be content or label
              // targProperty could be value or checked
              this_element = this.state.element;
              this_element[elemProperty] = e.target[targProperty];
              if (!(elemProperty === 'formSource' && this.state.formDataSource)) {
                _context3.next = 13;
                break;
              }
              activeForm = this.state.formDataSource.find(function (item) {
                return item.id == this_element[elemProperty];
              });
              activeFormContent = {}; /// Call api to get current form field
              if (!(activeForm && this.props.getFormContent)) {
                _context3.next = 12;
                break;
              }
              _context3.next = 8;
              return this.props.getFormContent(activeForm);
            case 8:
              _context3.t0 = _context3.sent;
              if (_context3.t0) {
                _context3.next = 11;
                break;
              }
              _context3.t0 = {};
            case 11:
              activeFormContent = _context3.t0;
            case 12:
              this.setState(function (current) {
                return _objectSpread(_objectSpread({}, current), {}, {
                  activeForm: activeFormContent
                });
              });
            case 13:
              this.setState({
                element: this_element,
                dirty: true
              }, function () {
                if (targProperty === 'checked') {
                  _this3.updateElement();
                }
              });
            case 14:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function editElementProp(_x2, _x3, _x4) {
        return _editElementProp.apply(this, arguments);
      }
      return editElementProp;
    }()
  }, {
    key: "onEditorStateChange",
    value: function onEditorStateChange(index, property, editorContent) {
      // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
      var html = (0, _draftjsToHtml["default"])((0, _draftJs.convertToRaw)(editorContent.getCurrentContent())).replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, ' ');
      var this_element = this.state.element;
      this_element[property] = html;
      this.setState({
        element: this_element,
        dirty: true
      });
    }
  }, {
    key: "convertFromHTML",
    value: function convertFromHTML(content) {
      var newContent = (0, _draftJs.convertFromHTML)(content || '');
      if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
        // to prevent crash when no contents in editor
        return _draftJs.EditorState.createEmpty();
      }
      var contentState = _draftJs.ContentState.createFromBlockArray(newContent);
      return _draftJs.EditorState.createWithContent(contentState);
    }
  }, {
    key: "addOptions",
    value: function addOptions() {
      var _this4 = this;
      var optionsApiUrl = document.getElementById('optionsApiUrl').value;
      if (optionsApiUrl) {
        (0, _requests.get)(optionsApiUrl).then(function (data) {
          _this4.props.element.options = [];
          var options = _this4.props.element.options;
          data.forEach(function (x) {
            // eslint-disable-next-line no-param-reassign
            x.key = _UUID["default"].uuid();
            options.push(x);
          });
          var this_element = _this4.state.element;
          _this4.setState({
            element: this_element,
            dirty: true
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this,
        _this$props$preview,
        _this$props$preview$s,
        _this$props$preview2,
        _this$props$preview2$,
        _this$props$preview3,
        _this$props$preview3$;
      if (this.state.dirty) {
        this.props.element.dirty = true;
      }
      var this_checked = this.props.element.hasOwnProperty('required') ? this.props.element.required : false;
      var this_read_only = this.props.element.hasOwnProperty('readOnly') ? this.props.element.readOnly : false;
      var this_default_today = this.props.element.hasOwnProperty('defaultToday') ? this.props.element.defaultToday : false;
      var this_show_time_select = this.props.element.hasOwnProperty('showTimeSelect') ? this.props.element.showTimeSelect : false;
      var this_show_time_select_only = this.props.element.hasOwnProperty('showTimeSelectOnly') ? this.props.element.showTimeSelectOnly : false;
      var this_checked_inline = this.props.element.hasOwnProperty('inline') ? this.props.element.inline : false;
      var this_checked_bold = this.props.element.hasOwnProperty('bold') ? this.props.element.bold : false;
      var this_checked_italic = this.props.element.hasOwnProperty('italic') ? this.props.element.italic : false;
      var this_checked_center = this.props.element.hasOwnProperty('center') ? this.props.element.center : false;
      var this_checked_page_break = this.props.element.hasOwnProperty('pageBreakBefore') ? this.props.element.pageBreakBefore : false;
      var this_checked_alternate_form = this.props.element.hasOwnProperty('alternateForm') ? this.props.element.alternateForm : false;

      // Determine if element is inside a DynamicColumnRow or other column container
      var isInsideColumnContainer = this.props.element.parentId && this.props.preview && typeof this.props.preview.getDataById === 'function' ? function () {
        var _parentElement$elemen;
        var parentElement = _this5.props.preview.getDataById(_this5.props.element.parentId);
        return parentElement && (parentElement.element === 'DynamicColumnRow' || ((_parentElement$elemen = parentElement.element) === null || _parentElement$elemen === void 0 ? void 0 : _parentElement$elemen.includes('ColumnRow')) || parentElement.isContainer && parentElement.childItems);
      }() : false;
      var _this$props$element = this.props.element,
        canHaveDisplayHorizontal = _this$props$element.canHaveDisplayHorizontal,
        canHaveOptionCorrect = _this$props$element.canHaveOptionCorrect,
        canHaveOptionValue = _this$props$element.canHaveOptionValue,
        canHaveInfo = _this$props$element.canHaveInfo;
      var this_files = this.props.files.length ? this.props.files : [];
      if (this_files.length < 1 || this_files.length > 0 && this_files[0].id !== '') {
        this_files.unshift({
          id: '',
          file_name: ''
        });
      }
      var editorState;
      if (this.props.element.hasOwnProperty('content')) {
        editorState = this.convertFromHTML(this.props.element.content);
      }
      if (this.props.element.hasOwnProperty('label')) {
        editorState = this.convertFromHTML(this.props.element.label);
      }
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "clearfix"
      }, /*#__PURE__*/_react["default"].createElement("h4", {
        className: "float-left"
      }, this.props.element.text), /*#__PURE__*/_react["default"].createElement("i", {
        className: "float-right fas fa-times dismiss-edit",
        onClick: this.props.manualEditModeOff
      })), this.props.element.hasOwnProperty('content') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label"
      }, "Text to display:"), /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
        toolbar: toolbar,
        defaultEditorState: editorState,
        onBlur: this.updateElement.bind(this),
        onEditorStateChange: this.onEditorStateChange.bind(this, 0, 'content'),
        stripPastedStyles: true
      })), this.props.element.hasOwnProperty('file_path') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "fileSelect"
      }, "Choose file:"), /*#__PURE__*/_react["default"].createElement("select", {
        id: "fileSelect",
        className: "form-control",
        defaultValue: this.props.element.file_path,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'file_path', 'value')
      }, this_files.map(function (file) {
        var this_key = "file_".concat(file.id);
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: file.id,
          key: this_key
        }, file.file_name);
      }))), this.props.element.hasOwnProperty('href') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement(_reactTextareaAutosize["default"], {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.href,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'href', 'value')
      })), this.props.element.hasOwnProperty('src') && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "srcImage",
        type: "file",
        onChange: this.onUploadFile.bind(this)
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "srcInput"
      }, "Link to:"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "srcInput",
        type: "text",
        className: "form-control",
        value: this.props.element.src,
        defaultValue: this.props.element.src,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'src', 'value')
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "do-center",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked_center,
        value: true,
        onChange: this.editElementProp.bind(this, 'center', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "do-center"
      }, "Center?"))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-3"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "elementWidth"
      }, "Width:"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "elementWidth",
        type: "text",
        className: "form-control",
        value: this.props.element.width,
        defaultValue: this.props.element.width,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'width', 'value')
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-3"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "elementHeight"
      }, "Height:"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "elementHeight",
        type: "text",
        className: "form-control",
        value: this.props.element.height,
        defaultValue: this.props.element.height,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'height', 'value')
      })))), (this.props.element.hasOwnProperty('label') || this.props.element.element === 'Signature2') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, this.props.element.element !== 'Signature2' && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("label", null, "Display Label"), /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
        toolbar: toolbar,
        defaultEditorState: editorState,
        onBlur: this.updateElement.bind(this),
        onEditorStateChange: this.onEditorStateChange.bind(this, 0, 'label'),
        stripPastedStyles: true
      }), /*#__PURE__*/_react["default"].createElement("br", null)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "is-required",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked,
        value: true,
        onChange: this.editElementProp.bind(this, 'required', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "is-required"
      }, "Required")), this.props.element.hasOwnProperty('defaultToday') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "is-default-to-today",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_default_today,
        value: true,
        onChange: this.editElementProp.bind(this, 'defaultToday', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "is-default-to-today"
      }, "Default to Today?")), this.props.element.hasOwnProperty('showTimeSelect') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "show-time-select",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_show_time_select,
        value: true,
        onChange: this.editElementProp.bind(this, 'showTimeSelect', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "show-time-select"
      }, "Show Time Select?")), this_show_time_select && this.props.element.hasOwnProperty('showTimeSelectOnly') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "show-time-select-only",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_show_time_select_only,
        value: true,
        onChange: this.editElementProp.bind(this, 'showTimeSelectOnly', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "show-time-select-only"
      }, "Show Time Select Only?")), this.props.element.hasOwnProperty('overdueNotification') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "overdueNotification",
        className: "custom-control-input",
        type: "checkbox",
        checked: !!this.props.element.overdueNotification,
        value: true,
        onChange: this.editElementProp.bind(this, 'overdueNotification', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "overdueNotification"
      }, "Overdue Notification")), (this.state.element.element === 'RadioButtons' || this.state.element.element === 'Checkboxes') && canHaveDisplayHorizontal && /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "display-horizontal",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked_inline,
        value: true,
        onChange: this.editElementProp.bind(this, 'inline', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "display-horizontal"
      }, "Display horizonal"))), this.state.element.element === 'Signature' && this.props.element.readOnly ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "variableKey"
      }, "Variable Key:"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "variableKey",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.variableKey,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'variableKey', 'value')
      }), /*#__PURE__*/_react["default"].createElement("p", {
        className: "help-block"
      }, "This will give the element a key that can be used to replace the content with a runtime value.")) : /*#__PURE__*/_react["default"].createElement("div", null), this.props.element.hasOwnProperty('step') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "rangeStep"
      }, "Step"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "rangeStep",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.step,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'step', 'value')
      }))), this.props.element.hasOwnProperty('min_value') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "rangeMin"
      }, "Min"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "rangeMin",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.min_value,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'min_value', 'value')
      }), /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.min_label,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'min_label', 'value')
      }))), this.props.element.hasOwnProperty('max_value') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "rangeMax"
      }, "Max"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "rangeMax",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.max_value,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'max_value', 'value')
      }), /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.max_label,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'max_label', 'value')
      }))), this.props.element.hasOwnProperty('default_value') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "defaultSelected"
      }, "Default Selected"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "defaultSelected",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.default_value,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'default_value', 'value')
      }))), this.props.element.hasOwnProperty('static') && this.props.element["static"] && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label"
      }, "Text Style"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "do-bold",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked_bold,
        value: true,
        onChange: this.editElementProp.bind(this, 'bold', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "do-bold"
      }, "Bold")), /*#__PURE__*/_react["default"].createElement("div", {
        className: "custom-control custom-checkbox"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "do-italic",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked_italic,
        value: true,
        onChange: this.editElementProp.bind(this, 'italic', 'checked')
      }), /*#__PURE__*/_react["default"].createElement("label", {
        className: "custom-control-label",
        htmlFor: "do-italic"
      }, "Italic"))), this.props.element.showDescription && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "questionDescription"
      }, "Description"), /*#__PURE__*/_react["default"].createElement(_reactTextareaAutosize["default"], {
        type: "text",
        className: "form-control",
        id: "questionDescription",
        defaultValue: this.props.element.description,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'description', 'value')
      })), this.props.showCorrectColumn && this.props.element.canHaveAnswer && !this.props.element.hasOwnProperty('options') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "correctAnswer"
      }, "Correct Answer"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "correctAnswer",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.correct,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'correct', 'value')
      })), this.props.element.hasOwnProperty('header') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "header"
      }, "Section Header"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "header",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.header,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'header', 'value')
      })), this.props.element.hasOwnProperty('position') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "position"
      }, "Role / Position"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "position",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.position,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'position', 'value')
      })), this.props.element.hasOwnProperty('specificRole') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label"
      }, "Pre Defined User / Role ", Boolean(this.props.element.specificRole)), /*#__PURE__*/_react["default"].createElement("select", {
        className: "form-control",
        id: "specificRole",
        defaultValue: this.props.element.specificRole,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'specificRole', 'value')
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "specific",
        key: "specific"
      }, "Specific role only"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "notSpecific",
        key: "notSpecific"
      }, "Anyone can sign"))), this.props.element.hasOwnProperty('options') && /*#__PURE__*/_react["default"].createElement(_dynamicOptionList["default"], {
        showCorrectColumn: this.props.showCorrectColumn,
        canHaveOptionCorrect: canHaveOptionCorrect,
        canHaveOptionValue: canHaveOptionValue,
        canHaveInfo: canHaveInfo,
        data: (_this$props$preview = this.props.preview) === null || _this$props$preview === void 0 ? void 0 : (_this$props$preview$s = _this$props$preview.state) === null || _this$props$preview$s === void 0 ? void 0 : _this$props$preview$s.data,
        updateElement: this.props.updateElement,
        preview: this.props.preview,
        element: this.props.element,
        key: "option-".concat(this.props.element.options.length)
      }), this.props.element.hasOwnProperty('rows') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "rowInput"
      }, "Row Count"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "rowInput",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.rows,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'rows', 'value')
      })), this.props.element.hasOwnProperty('rowLabels') && /*#__PURE__*/_react["default"].createElement(_fixedRowList["default"], {
        data: (_this$props$preview2 = this.props.preview) === null || _this$props$preview2 === void 0 ? void 0 : (_this$props$preview2$ = _this$props$preview2.state) === null || _this$props$preview2$ === void 0 ? void 0 : _this$props$preview2$.data,
        updateElement: this.props.updateElement,
        preview: this.props.preview,
        element: this.props.element,
        key: "table-row-labels"
      }), this.props.element.hasOwnProperty('columns') && /*#__PURE__*/_react["default"].createElement(_dynamicColumnList["default"], {
        data: (_this$props$preview3 = this.props.preview) === null || _this$props$preview3 === void 0 ? void 0 : (_this$props$preview3$ = _this$props$preview3.state) === null || _this$props$preview3$ === void 0 ? void 0 : _this$props$preview3$.data,
        updateElement: this.props.updateElement,
        preview: this.props.preview,
        element: this.props.element,
        key: "table-columns"
      }), this.props.element.hasOwnProperty('sourceType') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "sourceType"
      }, "Source Type"), /*#__PURE__*/_react["default"].createElement("select", {
        className: "form-control",
        id: "sourceType",
        defaultValue: this.props.element.sourceType,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'sourceType', 'value')
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "name",
        key: "name"
      }, "Name"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "department",
        key: "department"
      }, "Department"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "role",
        key: "role"
      }, "Role"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "form",
        key: "form"
      }, "Form"))), this.props.element.sourceType === 'form' && /*#__PURE__*/_react["default"].createElement("div", null, this.props.element.hasOwnProperty('formSource') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "formSource"
      }, "Form Source"), /*#__PURE__*/_react["default"].createElement("select", {
        className: "form-control",
        id: "formSource",
        value: this.props.element.formSource,
        defaultValue: this.props.element.formSource,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'formSource', 'value')
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: -1,
        key: -1
      }, "\" Please select \""), this.state.formDataSource && this.state.formDataSource.map(function (item) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: item.id,
          key: item.id
        }, item.name);
      }))), this.props.element.sourceType === 'form' && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "formSource"
      }, "Select Fields"), this.state.activeForm && this.state.activeForm.columns && this.state.activeForm.columns.map(function (item) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "custom-control custom-checkbox"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          id: item.field_name,
          className: "custom-control-input",
          type: "checkbox",
          checked: _this5.props.element.hasOwnProperty("formField".concat(item.field_name)) ? _this5.props.element["formField".concat(item.field_name)] : false,
          value: item.field_name,
          onChange: _this5.editElementProp.bind(_this5, "formField".concat(item.field_name), 'checked')
        }), /*#__PURE__*/_react["default"].createElement("label", {
          className: "custom-control-label",
          htmlFor: item.field_name
        }, item.label || item.text || ''));
      }))), this.props.element.hasOwnProperty('formula') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "rowInput"
      }, "Formula"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "formula",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.formula,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'formula', 'value')
      })), this.props.element.hasOwnProperty('formularKey') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "rowInput"
      }, "Formula Key"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "formularKey",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.formularKey,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'formularKey', 'value')
      })), this.props.element.element === 'FormLink' && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "formLinkSource"
      }, "Select Form"), /*#__PURE__*/_react["default"].createElement("select", {
        className: "form-control",
        id: "formLinkSource",
        value: this.props.element.formSource || '',
        defaultValue: this.props.element.formSource || '',
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'formSource', 'value')
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "",
        key: -1
      }, "Select a form..."), this.state.formDataSource && this.state.formDataSource.map(function (form) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: form.id,
          key: form.id
        }, form.name || form.title);
      }))));
    }
  }]);
  return FormElementsEdit;
}(_react["default"].Component);
exports["default"] = FormElementsEdit;
FormElementsEdit.defaultProps = {
  className: 'edit-element-fields'
};