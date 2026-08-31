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
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactDraftWysiwyg = require("react-draft-wysiwyg");
require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));
var _draftJs = require("draft-js");
var _draftjsToHtml = _interopRequireDefault(require("draftjs-to-html"));
var _dynamicColumnList = _interopRequireDefault(require("./dynamic-column-list"));
var _dynamicOptionList = _interopRequireDefault(require("./dynamic-option-list"));
var _fixedRowList = _interopRequireDefault(require("./fixed-row-list"));
var _requests = require("./stores/requests");
require("./styles/draft-align.css");
var _UUID = _interopRequireDefault(require("./UUID"));
var _dynamicColumnRowNames = require("./dynamic-column-row-names");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } // eslint-disable-next-line import/no-cycle
var toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'colorPicker', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript']
  },
  link: {
    popupClassName: 'link-popup-right' // Open to the right so left sidebar does not clip it
  },
  colorPicker: {
    className: 'rainbow-color-picker',
    // Add this custom class
    component: undefined,
    popupClassName: 'color-picker-popup-right',
    // Open to the right so left sidebar does not clip it
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)', 'rgb(147,101,184)', '#FF00BF', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', '#0000FF', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)', 'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)']
  }
};
var FormElementsEdit = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function FormElementsEdit(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FormElementsEdit);
    _this = _callSuper(this, FormElementsEdit, [props]);
    (0, _defineProperty2["default"])(_this, "onUniqueNameChange", function (e) {
      var this_element = _objectSpread({}, _this.latestElement || _this.state.element);
      this_element.uniqueName = e.target.value;
      _this.latestElement = this_element;
      _this.setState({
        element: this_element,
        dirty: true
      });
    });
    (0, _defineProperty2["default"])(_this, "onUniqueNameBlur", function () {
      var this_element = _objectSpread({}, _this.latestElement || _this.state.element);
      var sanitized = (0, _dynamicColumnRowNames.sanitizeUniqueName)(this_element.uniqueName);
      var others = _this.formDesignData();
      var fallback = (0, _dynamicColumnRowNames.nextDynamicColumnRowUniqueName)(others.filter(function (item) {
        return item && item.id !== this_element.id;
      }));
      this_element.uniqueName = sanitized || fallback;
      _this.latestElement = this_element;
      _this.setState({
        element: this_element,
        dirty: true
      }, function () {
        return _this.updateElement();
      });
    });
    (0, _defineProperty2["default"])(_this, "onSubFormNameChange", function (e) {
      var this_element = _objectSpread({}, _this.latestElement || _this.state.element);
      this_element.uniqueName = e.target.value;
      _this.latestElement = this_element;
      _this.setState({
        element: this_element,
        dirty: true
      });
    });
    (0, _defineProperty2["default"])(_this, "onSubFormNameBlur", function () {
      var this_element = _objectSpread({}, _this.latestElement || _this.state.element);
      this_element.uniqueName = (0, _dynamicColumnRowNames.sanitizeCellName)(this_element.uniqueName);
      _this.latestElement = this_element;
      _this.setState({
        element: this_element,
        dirty: true
      }, function () {
        return _this.updateElement();
      });
    });
    (0, _defineProperty2["default"])(_this, "onCellNameChange", function (e) {
      var this_element = _objectSpread({}, _this.latestElement || _this.state.element);
      this_element.cellName = e.target.value;
      _this.latestElement = this_element;
      _this.setState({
        element: this_element,
        dirty: true
      });
    });
    (0, _defineProperty2["default"])(_this, "onCellNameBlur", function () {
      var this_element = _objectSpread({}, _this.latestElement || _this.state.element);
      var fallback = (0, _dynamicColumnRowNames.defaultCellName)(this_element.row, this_element.col);
      var sanitized = (0, _dynamicColumnRowNames.sanitizeCellName)(this_element.cellName);
      if (!sanitized) {
        this_element.cellName = fallback;
        this_element.cellNameCustom = false;
      } else {
        this_element.cellName = sanitized;
        this_element.cellNameCustom = sanitized !== fallback;
      }
      _this.latestElement = this_element;
      _this.setState({
        element: this_element,
        dirty: true
      }, function () {
        return _this.updateElement();
      });
    });
    (0, _defineProperty2["default"])(_this, "updateElement", function () {
      var this_element = _this.latestElement || _this.state.element;

      // Convert any pending editor states to HTML before saving
      var editorStatesKeys = Object.keys(_this.state.editorStates);
      if (editorStatesKeys.length > 0) {
        this_element = _objectSpread({}, this_element);
        editorStatesKeys.forEach(function (property) {
          var editorState = _this.state.editorStates[property];
          if (editorState) {
            var contentState = editorState.getCurrentContent();
            var raw = (0, _draftJs.convertToRaw)(contentState);

            // Build HTML
            var html = (0, _draftjsToHtml["default"])(raw);

            // Patch in alignment styles
            html = _this.applyBlockAlignmentStyles(raw, html);
            this_element[property] = html;
            this_element["".concat(property, "Raw")] = JSON.stringify(raw);
          }
        });

        // Update latestElement with converted values
        _this.latestElement = this_element;
      }

      // Debug: show what is being saved from parent
      if (typeof console !== 'undefined') {
        var _this_element, _this_element2, _this_element2$slice, _this_element3, _this_element3$map;
        console.log('[FormElementsEdit] updateElement - saving element', {
          id: (_this_element = this_element) === null || _this_element === void 0 ? void 0 : _this_element.id,
          label: (_this_element2 = this_element) === null || _this_element2 === void 0 || (_this_element2 = _this_element2.label) === null || _this_element2 === void 0 || (_this_element2$slice = _this_element2.slice) === null || _this_element2$slice === void 0 ? void 0 : _this_element2$slice.call(_this_element2, 0, 200),
          options: (_this_element3 = this_element) === null || _this_element3 === void 0 || (_this_element3 = _this_element3.options) === null || _this_element3 === void 0 || (_this_element3$map = _this_element3.map) === null || _this_element3$map === void 0 ? void 0 : _this_element3$map.call(_this_element3, function (o) {
            return {
              text: o.text,
              value: o.value
            };
          })
        });
      }
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
    // Wrapper for child components to ensure pending label/content updates are saved first
    (0, _defineProperty2["default"])(_this, "updateElementWithFlush", function (childElement) {
      // Cancel any pending debounced updates (avoid double-save races)
      if (_this.debouncedPush && _this.debouncedPush.cancel) {
        _this.debouncedPush.cancel();
      }

      // Use latestElement to get synchronously updated values
      var currentElement = _this.latestElement || _this.state.element;

      // Merge: preserve parent's label/content but accept child's options/columns/rows
      var mergedElement = _objectSpread(_objectSpread({}, childElement), {}, {
        label: currentElement.label,
        labelRaw: currentElement.labelRaw,
        content: currentElement.content,
        contentRaw: currentElement.contentRaw,
        dirty: true
      });
      if (typeof console !== 'undefined' && console.debug) {
        var _mergedElement$label, _mergedElement$label$, _mergedElement$option, _mergedElement$option2;
        console.debug('[FormElementsEdit] updateElementWithFlush - mergedElement', {
          id: mergedElement === null || mergedElement === void 0 ? void 0 : mergedElement.id,
          label: mergedElement === null || mergedElement === void 0 || (_mergedElement$label = mergedElement.label) === null || _mergedElement$label === void 0 || (_mergedElement$label$ = _mergedElement$label.slice) === null || _mergedElement$label$ === void 0 ? void 0 : _mergedElement$label$.call(_mergedElement$label, 0, 200),
          options: mergedElement === null || mergedElement === void 0 || (_mergedElement$option = mergedElement.options) === null || _mergedElement$option === void 0 || (_mergedElement$option2 = _mergedElement$option.map) === null || _mergedElement$option2 === void 0 ? void 0 : _mergedElement$option2.call(_mergedElement$option, function (o) {
            return {
              text: o.text,
              value: o.value
            };
          })
        });
      }

      // Clear dirty flag since we're saving now
      _this.setState({
        dirty: false
      });
      _this.props.updateElement.call(_this.props.preview, mergedElement);
    });
    (0, _defineProperty2["default"])(_this, "onEditorBlur", function () {
      // Flush any pending debounced updates immediately when editor loses focus
      if (_this.debouncedPush && _this.debouncedPush.flush) {
        _this.debouncedPush.flush();
      }
    });
    _this.debouncedPush = _this.debounce(function () {
      return _this.updateElement();
    }, 400);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false,
      formDataSource: [],
      activeForm: null,
      // keep ephemeral editor states if you want fully controlled editors
      editorStates: {}
    };

    // Synchronously track the latest element edits to avoid setState race conditions
    _this.latestElement = _this.props.element;
    return _this;
  }
  (0, _inherits2["default"])(FormElementsEdit, _React$Component);
  return (0, _createClass2["default"])(FormElementsEdit, [{
    key: "debounce",
    value: function debounce(fn, ms) {
      var t;
      var debounced = function debounced() {
        for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
          a[_key] = arguments[_key];
        }
        clearTimeout(t);
        t = setTimeout(function () {
          return fn.apply(void 0, a);
        }, ms);
      };
      debounced.flush = function () {
        clearTimeout(t);
        fn();
      };
      debounced.cancel = function () {
        clearTimeout(t);
      };
      return debounced;
    }
  }, {
    key: "onUploadFile",
    value: function () {
      var _onUploadFile = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
        var this_element, file, imageUrl, reader, _this_element4, _t;
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!event || !event.target || !event.target.files || !this.props.onImageUpload)) {
                _context.next = 1;
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
            case 1:
              _context.prev = 1;
              file = event.target.files[0];
              _context.next = 2;
              return this.props.onImageUpload(file, this.props.element.id);
            case 2:
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
              _context.next = 4;
              break;
            case 3:
              _context.prev = 3;
              _t = _context["catch"](1);
              console.log('error upload', _t);
              _this_element4 = this.state.element;
              _this_element4.src = 'cannot upload file';
              this.setState({
                element: _this_element4
              });
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[1, 3]]);
      }));
      function onUploadFile(_x) {
        return _onUploadFile.apply(this, arguments);
      }
      return onUploadFile;
    }()
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this2 = this;
        var formDataSource, activeForm, activeFormContent, _t2, _t3;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              formDataSource = [];
              activeForm = {};
              activeFormContent = {};
              if (!((this.props.element.element === 'DataSource' || this.props.element.element === 'FormLink') && this.props.getFormSource)) {
                _context2.next = 6;
                break;
              }
              _context2.next = 1;
              return this.props.getFormSource(this.props.element);
            case 1:
              _t2 = _context2.sent;
              if (_t2) {
                _context2.next = 2;
                break;
              }
              _t2 = [];
            case 2:
              formDataSource = _t2;
              if (!formDataSource) {
                _context2.next = 5;
                break;
              }
              activeForm = formDataSource.find(function (item) {
                return item.id == _this2.props.element.formSource;
              });

              /// Call api to get current form field
              if (!(activeForm && this.props.getFormContent)) {
                _context2.next = 5;
                break;
              }
              _context2.next = 3;
              return this.props.getFormContent(activeForm);
            case 3:
              _t3 = _context2.sent;
              if (_t3) {
                _context2.next = 4;
                break;
              }
              _t3 = {};
            case 4:
              activeFormContent = _t3;
            case 5:
              this.setState(function (current) {
                return _objectSpread(_objectSpread({}, current), {}, {
                  formDataSource: formDataSource,
                  activeForm: activeFormContent
                });
              });
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
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // Update state when element prop changes (e.g., when reopening the edit modal)
      if (prevProps.element !== this.props.element) {
        // Keep synchronous copy updated too
        this.latestElement = this.props.element;

        // If a different element was selected (different id), reset editorStates
        var prevId = prevProps.element && prevProps.element.id;
        var newId = this.props.element && this.props.element.id;
        if (prevId !== newId) {
          this.setState({
            element: this.props.element,
            data: this.props.data,
            dirty: false,
            editorStates: {} // Reset editor states to use new content
          });
        } else {
          // Same element updated (e.g., save returned), preserve editorStates to avoid cursor jump
          this.setState({
            element: this.props.element,
            data: this.props.data,
            dirty: false
          });
        }
      }
    }
  }, {
    key: "editElementProp",
    value: function () {
      var _editElementProp = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(elemProperty, targProperty, e) {
        var _this3 = this;
        var this_element, formDataSource, activeForm, activeFormContent, _t4, _t5;
        return _regenerator["default"].wrap(function (_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              // elemProperty could be content or label
              // targProperty could be value or checked
              this_element = this.state.element;
              this_element[elemProperty] = e.target[targProperty];
              if (!(elemProperty === 'sourceType' && this.props.getFormSource)) {
                _context3.next = 3;
                break;
              }
              this_element.formSource = '';
              _context3.next = 1;
              return this.props.getFormSource(this_element);
            case 1:
              _t4 = _context3.sent;
              if (_t4) {
                _context3.next = 2;
                break;
              }
              _t4 = [];
            case 2:
              formDataSource = _t4;
              this.setState(function (current) {
                return _objectSpread(_objectSpread({}, current), {}, {
                  formDataSource: formDataSource,
                  activeForm: {}
                });
              });
            case 3:
              if (!(elemProperty === 'formSource' && this.state.formDataSource)) {
                _context3.next = 7;
                break;
              }
              activeForm = this.state.formDataSource.find(function (item) {
                return item.id == this_element[elemProperty];
              });
              activeFormContent = {}; /// Call api to get current form field
              if (!(activeForm && this.props.getFormContent)) {
                _context3.next = 6;
                break;
              }
              _context3.next = 4;
              return this.props.getFormContent(activeForm);
            case 4:
              _t5 = _context3.sent;
              if (_t5) {
                _context3.next = 5;
                break;
              }
              _t5 = {};
            case 5:
              activeFormContent = _t5;
            case 6:
              this.setState(function (current) {
                return _objectSpread(_objectSpread({}, current), {}, {
                  activeForm: activeFormContent
                });
              });
            case 7:
              this.latestElement = this_element;
              this.setState({
                element: this_element,
                dirty: true
              }, function () {
                if (targProperty === 'checked') {
                  _this3.updateElement();
                }
              });
            case 8:
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
    key: "formDesignData",
    value: function formDesignData() {
      var _this$props$preview;
      return ((_this$props$preview = this.props.preview) === null || _this$props$preview === void 0 || (_this$props$preview = _this$props$preview.state) === null || _this$props$preview === void 0 ? void 0 : _this$props$preview.data) || [];
    }
  }, {
    key: "getEditorStateFrom",
    value: function getEditorStateFrom(element, key) {
      try {
        var rawStr = element["".concat(key, "Raw")];
        if (rawStr) {
          var raw = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr;
          return _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(raw));
        }
      } catch (e) {
        // ignore
      }
      if (element[key]) return this.convertFromHTML(element[key]);
      return _draftJs.EditorState.createEmpty();
    }
  }, {
    key: "onEditorStateChange",
    value: function onEditorStateChange(property, editorState) {
      var _this4 = this;
      // Only update editorState immediately for responsive typing
      // Defer expensive HTML conversion until debounced save
      this.setState({
        dirty: true,
        editorStates: _objectSpread(_objectSpread({}, this.state.editorStates), {}, (0, _defineProperty2["default"])({}, property, editorState))
      }, function () {
        // Schedule the debounced update which will handle HTML conversion
        _this4.debouncedPush();
      });
    }

    // Inject text-align styles based on block.data alignment fields
  }, {
    key: "applyBlockAlignmentStyles",
    value: function applyBlockAlignmentStyles(raw, html) {
      if (!raw || !raw.blocks || !html) return html;
      if (typeof window === 'undefined' || !window.DOMParser) return html;
      try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        // Collect block-level elements (draftjs-to-html keeps order)
        var blockEls = [];
        var _collect = function collect(node) {
          if (node.nodeType !== 1) return;
          var tag = node.tagName.toLowerCase();
          if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'li', 'figure', 'div'].includes(tag)) {
            // figure/div can appear for atomic/custom blocks
            blockEls.push(node);
          }
          Array.from(node.children).forEach(_collect);
        };
        Array.from(doc.body.children).forEach(_collect);
        var idx = 0;
        raw.blocks.forEach(function (block) {
          var el = blockEls[idx];
          idx += 1;
          if (!el) return;
          var data = block.data || {};
          var align = data['text-align'] || data.textAlign || data.textAlignment || data.alignment;
          if (!align) return;

          // Normalize alignment value
          var a = ['left', 'right', 'center', 'justify'].includes(align) ? align : 'left';

          // Apply inline style (if not stripped later)
          var prev = el.getAttribute('style') || '';
          if (!prev.includes('text-align')) {
            el.setAttribute('style', "text-align:".concat(a, ";").concat(prev));
          }

          // Add class for resilience
          el.classList.add("draft-align-".concat(a));

          // If list item, also align parent list container
          if (el.tagName.toLowerCase() === 'li' && el.parentElement) {
            var listParent = el.parentElement;
            var parentPrev = listParent.getAttribute('style') || '';
            if (!parentPrev.includes('text-align')) {
              listParent.setAttribute('style', "text-align:".concat(a, ";").concat(parentPrev));
            }
            listParent.classList.add("draft-align-".concat(a));
          }
        });
        return doc.body.innerHTML;
      } catch (e) {
        return html;
      }
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
      var _this5 = this;
      var optionsApiUrl = document.getElementById('optionsApiUrl').value;
      if (optionsApiUrl) {
        (0, _requests.get)(optionsApiUrl).then(function (data) {
          _this5.props.element.options = [];
          var options = _this5.props.element.options;
          data.forEach(function (x) {
            // eslint-disable-next-line no-param-reassign
            x.key = _UUID["default"].uuid();
            options.push(x);
          });
          var this_element = _this5.state.element;
          _this5.setState({
            element: this_element,
            dirty: true
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this,
        _this$props$preview$g,
        _this$props$preview$g2,
        _this$props$element2,
        _this$props$preview2,
        _this$props$preview3,
        _this$props$preview4;
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
      var isInsideColumnContainer = this.props.element.parentId && this.props.preview && typeof this.props.preview.getDataById === 'function' ? function (_parentElement$elemen) {
        var parentElement = _this6.props.preview.getDataById(_this6.props.element.parentId);
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

      // Build editor states (prefer stored raw)
      var contentEditorState = this.getEditorStateFrom(this.state.element, 'content');
      var labelEditorState = this.getEditorStateFrom(this.state.element, 'label');
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "clearfix"
      }, /*#__PURE__*/_react["default"].createElement("h4", {
        className: "float-left"
      }, this.props.element.text), /*#__PURE__*/_react["default"].createElement("i", {
        className: "float-right fas fa-times dismiss-edit",
        onClick: this.props.manualEditModeOff
      })), this.props.element.element === 'DynamicColumnRow' && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "dcrUniqueName"
      }, "Unique name"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "dcrUniqueName",
        type: "text",
        className: "form-control",
        value: this.state.element.uniqueName || '',
        placeholder: (0, _dynamicColumnRowNames.nextDynamicColumnRowUniqueName)(this.formDesignData().filter(function (item) {
          return item && item.id !== _this6.props.element.id;
        })),
        onChange: this.onUniqueNameChange,
        onBlur: this.onUniqueNameBlur
      }), (0, _dynamicColumnRowNames.isUniqueNameTaken)(this.formDesignData(), this.state.element.uniqueName, this.props.element.id) && /*#__PURE__*/_react["default"].createElement("p", {
        className: "help-block",
        style: {
          color: '#c0392b'
        }
      }, "Unique name must be unique among Dynamic Column Rows on this form."), /*#__PURE__*/_react["default"].createElement("p", {
        className: "help-block"
      }, "Required. Used in template tags such as #WorkHistory_c1#. On a master form, tables inside a SubForm use #SubFormName_WorkHistory_c1#.")), this.props.element.parentId && this.props.preview && typeof this.props.preview.getDataById === 'function' && ((_this$props$preview$g = this.props.preview.getDataById(this.props.element.parentId)) === null || _this$props$preview$g === void 0 ? void 0 : _this$props$preview$g.element) === 'DynamicColumnRow' && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "dcrCellName"
      }, "Cell unique name"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "dcrCellName",
        type: "text",
        className: "form-control",
        value: this.state.element.cellName || (0, _dynamicColumnRowNames.defaultCellName)(this.state.element.row, this.state.element.col),
        onChange: this.onCellNameChange,
        onBlur: this.onCellNameBlur
      }), (0, _dynamicColumnRowNames.isCellNameTaken)(this.formDesignData(), this.props.element.parentId, this.state.element.cellName || (0, _dynamicColumnRowNames.defaultCellName)(this.state.element.row, this.state.element.col), this.props.element.id) && /*#__PURE__*/_react["default"].createElement("p", {
        className: "help-block",
        style: {
          color: '#c0392b'
        }
      }, "Cell unique name must be unique within this table."), /*#__PURE__*/_react["default"].createElement("p", {
        className: "help-block"
      }, "Default is r", '{', "row", '}', "c", '{', "col", '}', " (e.g. r1c1). Any language is allowed. Template tag:", ' ', (0, _dynamicColumnRowNames.templateColumnTagPreview)((_this$props$preview$g2 = this.props.preview.getDataById(this.props.element.parentId)) === null || _this$props$preview$g2 === void 0 ? void 0 : _this$props$preview$g2.uniqueName, this.state.element.col)))), this.props.element.hasOwnProperty('content') && this.props.element.content != null && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label"
      }, "Text to display:"), /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
        toolbar: toolbar,
        defaultEditorState: contentEditorState,
        editorState: this.state.editorStates.content || contentEditorState,
        onBlur: this.onEditorBlur,
        onEditorStateChange: function onEditorStateChange(es) {
          return _this6.onEditorStateChange('content', es);
        },
        stripPastedStyles: false
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
      })))), (((_this$props$element2 = this.props.element) === null || _this$props$element2 === void 0 ? void 0 : _this$props$element2.label) != null || this.props.element.element === 'Signature2' || this.props.element.element === 'ImageUpload') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, this.props.element.element !== 'Signature2' && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("label", null, "Display Label"), /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
        toolbar: toolbar,
        defaultEditorState: labelEditorState,
        editorState: this.state.editorStates.label || labelEditorState,
        onBlur: this.onEditorBlur,
        onEditorStateChange: function onEditorStateChange(es) {
          return _this6.onEditorStateChange('label', es);
        },
        stripPastedStyles: false
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
      }, "Required")), this.props.element.hasOwnProperty('showTimeSelect') && /*#__PURE__*/_react["default"].createElement("div", {
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
      }))), this.props.element.showDescription && /*#__PURE__*/_react["default"].createElement("div", {
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
      })), this.props.element.hasOwnProperty('header') && this.props.element.element !== 'ImageUpload' && /*#__PURE__*/_react["default"].createElement("div", {
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
        data: (_this$props$preview2 = this.props.preview) === null || _this$props$preview2 === void 0 || (_this$props$preview2 = _this$props$preview2.state) === null || _this$props$preview2 === void 0 ? void 0 : _this$props$preview2.data,
        updateElement: this.updateElementWithFlush,
        preview: this.props.preview,
        element: this.state.element
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
        data: (_this$props$preview3 = this.props.preview) === null || _this$props$preview3 === void 0 || (_this$props$preview3 = _this$props$preview3.state) === null || _this$props$preview3 === void 0 ? void 0 : _this$props$preview3.data,
        updateElement: this.updateElementWithFlush,
        preview: this.props.preview,
        element: this.state.element,
        key: "table-row-labels"
      }), this.props.element.hasOwnProperty('columns') && /*#__PURE__*/_react["default"].createElement(_dynamicColumnList["default"], {
        data: (_this$props$preview4 = this.props.preview) === null || _this$props$preview4 === void 0 || (_this$props$preview4 = _this$props$preview4.state) === null || _this$props$preview4 === void 0 ? void 0 : _this$props$preview4.data,
        updateElement: this.updateElementWithFlush,
        preview: this.props.preview,
        element: this.state.element,
        key: "table-columns",
        allowSync: this.state.element.allowSync !== undefined ? this.state.element.allowSync : true
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
        value: "email",
        key: "email"
      }, "Email"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "form",
        key: "form"
      }, "Form"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "dataset",
        key: "dataset"
      }, "Dataset"))), (this.props.element.sourceType === 'form' || this.props.element.sourceType === 'dataset') && /*#__PURE__*/_react["default"].createElement("div", null, this.props.element.hasOwnProperty('formSource') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "formSource"
      }, this.props.element.sourceType === 'dataset' ? 'Dataset Source' : 'Form Source'), /*#__PURE__*/_react["default"].createElement("select", {
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
      }))), (this.props.element.sourceType === 'form' || this.props.element.sourceType === 'dataset') && /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "control-label",
        htmlFor: "formSource"
      }, this.props.element.sourceType === 'dataset' ? 'Select Dataset Keys' : 'Select Fields'), this.state.activeForm && this.state.activeForm.columns && this.state.activeForm.columns.map(function (item) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "custom-control custom-checkbox"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          id: item.field_name,
          className: "custom-control-input",
          type: "checkbox",
          checked: _this6.props.element.hasOwnProperty("formField".concat(item.field_name)) ? _this6.props.element["formField".concat(item.field_name)] : false,
          value: item.field_name,
          onChange: _this6.editElementProp.bind(_this6, "formField".concat(item.field_name), 'checked')
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
        htmlFor: "formLinkSubFormName"
      }, "Subform name"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "formLinkSubFormName",
        type: "text",
        className: "form-control",
        value: this.state.element.uniqueName || '',
        placeholder: "Optional. Default is the Display Label.",
        onChange: this.onSubFormNameChange,
        onBlur: this.onSubFormNameBlur
      }), /*#__PURE__*/_react["default"].createElement("p", {
        className: "help-block"
      }, "Prefix for Dynamic Column Row tags from this SubForm, e.g.", ' ', (0, _dynamicColumnRowNames.templateSubFormColumnTagPreview)(this.state.element, 'DynamicColumnRow1', 0), ". Tags without a Subform name belong to the master form."), /*#__PURE__*/_react["default"].createElement("label", {
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
}(_react["default"].Component);
FormElementsEdit.defaultProps = {
  className: 'edit-element-fields'
};