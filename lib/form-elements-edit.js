"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } // eslint-disable-next-line import/no-cycle
const toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'colorPicker', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript']
  },
  link: {
    popupClassName: 'link-popup-left' // Add this to position the link popup to the left
  },
  colorPicker: {
    className: 'rainbow-color-picker',
    // Add this custom class
    component: undefined,
    popupClassName: 'color-picker-popup-left',
    // Add this to position the popup to the left
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)', 'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)', 'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)']
  }
};
class FormElementsEdit extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "updateElement", () => {
      let this_element = this.latestElement || this.state.element;

      // Convert any pending editor states to HTML before saving
      const editorStatesKeys = Object.keys(this.state.editorStates);
      if (editorStatesKeys.length > 0) {
        this_element = _objectSpread({}, this_element);
        editorStatesKeys.forEach(property => {
          const editorState = this.state.editorStates[property];
          if (editorState) {
            const contentState = editorState.getCurrentContent();
            const raw = (0, _draftJs.convertToRaw)(contentState);

            // Build HTML
            let html = (0, _draftjsToHtml.default)(raw);

            // Patch in alignment styles
            html = this.applyBlockAlignmentStyles(raw, html);
            this_element[property] = html;
            this_element["".concat(property, "Raw")] = JSON.stringify(raw);
          }
        });

        // Update latestElement with converted values
        this.latestElement = this_element;
      }

      // Debug: show what is being saved from parent
      if (typeof console !== 'undefined') {
        var _this_element, _this_element2, _this_element2$slice, _this_element3, _this_element3$map;
        console.log('[FormElementsEdit] updateElement - saving element', {
          id: (_this_element = this_element) === null || _this_element === void 0 ? void 0 : _this_element.id,
          label: (_this_element2 = this_element) === null || _this_element2 === void 0 || (_this_element2 = _this_element2.label) === null || _this_element2 === void 0 || (_this_element2$slice = _this_element2.slice) === null || _this_element2$slice === void 0 ? void 0 : _this_element2$slice.call(_this_element2, 0, 200),
          options: (_this_element3 = this_element) === null || _this_element3 === void 0 || (_this_element3 = _this_element3.options) === null || _this_element3 === void 0 || (_this_element3$map = _this_element3.map) === null || _this_element3$map === void 0 ? void 0 : _this_element3$map.call(_this_element3, o => ({
            text: o.text,
            value: o.value
          }))
        });
      }
      // to prevent ajax calls with no change
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({
          dirty: false
        });
      }

      // If this is a Signature2 element in a DynamicColumnRow, we need to sync changes
      if (this_element.element === 'Signature2' && this_element.parentId && this_element.row !== undefined && this_element.col !== undefined && this.props.preview && this.props.preview.syncRowChanges) {
        this.props.preview.syncRowChanges(this_element);
      }
    });
    // Wrapper for child components to ensure pending label/content updates are saved first
    (0, _defineProperty2.default)(this, "updateElementWithFlush", childElement => {
      // Cancel any pending debounced updates (avoid double-save races)
      if (this.debouncedPush && this.debouncedPush.cancel) {
        this.debouncedPush.cancel();
      }

      // Use latestElement to get synchronously updated values
      const currentElement = this.latestElement || this.state.element;

      // Merge: preserve parent's label/content but accept child's options/columns/rows
      const mergedElement = _objectSpread(_objectSpread({}, childElement), {}, {
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
          options: mergedElement === null || mergedElement === void 0 || (_mergedElement$option = mergedElement.options) === null || _mergedElement$option === void 0 || (_mergedElement$option2 = _mergedElement$option.map) === null || _mergedElement$option2 === void 0 ? void 0 : _mergedElement$option2.call(_mergedElement$option, o => ({
            text: o.text,
            value: o.value
          }))
        });
      }

      // Clear dirty flag since we're saving now
      this.setState({
        dirty: false
      });
      this.props.updateElement.call(this.props.preview, mergedElement);
    });
    (0, _defineProperty2.default)(this, "onEditorBlur", () => {
      // Flush any pending debounced updates immediately when editor loses focus
      if (this.debouncedPush && this.debouncedPush.flush) {
        this.debouncedPush.flush();
      }
    });
    this.debouncedPush = this.debounce(() => this.updateElement(), 400);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      formDataSource: [],
      activeForm: null,
      // keep ephemeral editor states if you want fully controlled editors
      editorStates: {}
    };

    // Synchronously track the latest element edits to avoid setState race conditions
    this.latestElement = this.props.element;
  }
  debounce(fn, ms) {
    let t;
    const debounced = function () {
      for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
        a[_key] = arguments[_key];
      }
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
    debounced.flush = () => {
      clearTimeout(t);
      fn();
    };
    debounced.cancel = () => {
      clearTimeout(t);
    };
    return debounced;
  }
  async onUploadFile(event) {
    if (!event || !event.target || !event.target.files || !this.props.onImageUpload) {
      if (!this.props.onImageUpload) {
        const this_element = this.state.element;
        this_element.src = 'Please provide upload callback';
        this.setState({
          element: this_element
        });
      }
      return;
    }
    try {
      const file = event.target.files[0];
      const imageUrl = await this.props.onImageUpload(file, this.props.element.id);
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const this_element = this.state.element;
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
    } catch (error) {
      console.log('error upload', error);
      const this_element = this.state.element;
      this_element.src = 'cannot upload file';
      this.setState({
        element: this_element
      });
    }
  }
  async componentDidMount() {
    let formDataSource = [];
    let activeForm = {};
    let activeFormContent = {};
    if ((this.props.element.element === 'DataSource' || this.props.element.element === 'FormLink') && this.props.getFormSource) {
      // call api to get form data
      formDataSource = (await this.props.getFormSource()) || [];
      if (formDataSource) {
        activeForm = formDataSource.find(item => item.id == this.props.element.formSource);

        /// Call api to get current form field
        if (activeForm && this.props.getFormContent) {
          activeFormContent = (await this.props.getFormContent(activeForm)) || {};
        }
      }
      this.setState(current => _objectSpread(_objectSpread({}, current), {}, {
        formDataSource,
        activeForm: activeFormContent
      }));
    }
  }
  componentDidUpdate(prevProps) {
    // Update state when element prop changes (e.g., when reopening the edit modal)
    if (prevProps.element !== this.props.element) {
      // Keep synchronous copy updated too
      this.latestElement = this.props.element;

      // If a different element was selected (different id), reset editorStates
      const prevId = prevProps.element && prevProps.element.id;
      const newId = this.props.element && this.props.element.id;
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
  async editElementProp(elemProperty, targProperty, e) {
    // elemProperty could be content or label
    // targProperty could be value or checked
    const this_element = this.state.element;
    this_element[elemProperty] = e.target[targProperty];
    if (elemProperty === 'formSource' && this.state.formDataSource) {
      const activeForm = this.state.formDataSource.find(item => item.id == this_element[elemProperty]);
      let activeFormContent = {};

      /// Call api to get current form field

      if (activeForm && this.props.getFormContent) {
        activeFormContent = (await this.props.getFormContent(activeForm)) || {};
      }
      this.setState(current => _objectSpread(_objectSpread({}, current), {}, {
        activeForm: activeFormContent
      }));
    }
    this.latestElement = this_element;
    this.setState({
      element: this_element,
      dirty: true
    }, () => {
      if (targProperty === 'checked') {
        this.updateElement();
      }
    });
  }
  getEditorStateFrom(element, key) {
    try {
      const rawStr = element["".concat(key, "Raw")];
      if (rawStr) {
        const raw = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr;
        return _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(raw));
      }
    } catch (e) {
      // ignore
    }
    if (element[key]) return this.convertFromHTML(element[key]);
    return _draftJs.EditorState.createEmpty();
  }
  onEditorStateChange(property, editorState) {
    // Only update editorState immediately for responsive typing
    // Defer expensive HTML conversion until debounced save
    this.setState({
      dirty: true,
      editorStates: _objectSpread(_objectSpread({}, this.state.editorStates), {}, {
        [property]: editorState
      })
    }, () => {
      // Schedule the debounced update which will handle HTML conversion
      this.debouncedPush();
    });
  }

  // Inject text-align styles based on block.data alignment fields
  applyBlockAlignmentStyles(raw, html) {
    if (!raw || !raw.blocks || !html) return html;
    if (typeof window === 'undefined' || !window.DOMParser) return html;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Collect block-level elements (draftjs-to-html keeps order)
      const blockEls = [];
      const collect = node => {
        if (node.nodeType !== 1) return;
        const tag = node.tagName.toLowerCase();
        if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'li', 'figure', 'div'].includes(tag)) {
          // figure/div can appear for atomic/custom blocks
          blockEls.push(node);
        }
        Array.from(node.children).forEach(collect);
      };
      Array.from(doc.body.children).forEach(collect);
      let idx = 0;
      raw.blocks.forEach(block => {
        const el = blockEls[idx];
        idx += 1;
        if (!el) return;
        const data = block.data || {};
        const align = data['text-align'] || data.textAlign || data.textAlignment || data.alignment;
        if (!align) return;

        // Normalize alignment value
        const a = ['left', 'right', 'center', 'justify'].includes(align) ? align : 'left';

        // Apply inline style (if not stripped later)
        const prev = el.getAttribute('style') || '';
        if (!prev.includes('text-align')) {
          el.setAttribute('style', "text-align:".concat(a, ";").concat(prev));
        }

        // Add class for resilience
        el.classList.add("draft-align-".concat(a));

        // If list item, also align parent list container
        if (el.tagName.toLowerCase() === 'li' && el.parentElement) {
          const listParent = el.parentElement;
          const parentPrev = listParent.getAttribute('style') || '';
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
  convertFromHTML(content) {
    const newContent = (0, _draftJs.convertFromHTML)(content || '');
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      // to prevent crash when no contents in editor
      return _draftJs.EditorState.createEmpty();
    }
    const contentState = _draftJs.ContentState.createFromBlockArray(newContent);
    return _draftJs.EditorState.createWithContent(contentState);
  }
  addOptions() {
    const optionsApiUrl = document.getElementById('optionsApiUrl').value;
    if (optionsApiUrl) {
      (0, _requests.get)(optionsApiUrl).then(data => {
        this.props.element.options = [];
        const {
          options
        } = this.props.element;
        data.forEach(x => {
          // eslint-disable-next-line no-param-reassign
          x.key = _UUID.default.uuid();
          options.push(x);
        });
        const this_element = this.state.element;
        this.setState({
          element: this_element,
          dirty: true
        });
      });
    }
  }
  render() {
    var _this$props$element, _this$props$preview, _this$props$preview2, _this$props$preview3;
    if (this.state.dirty) {
      this.props.element.dirty = true;
    }
    const this_checked = this.props.element.hasOwnProperty('required') ? this.props.element.required : false;
    const this_read_only = this.props.element.hasOwnProperty('readOnly') ? this.props.element.readOnly : false;
    const this_default_today = this.props.element.hasOwnProperty('defaultToday') ? this.props.element.defaultToday : false;
    const this_show_time_select = this.props.element.hasOwnProperty('showTimeSelect') ? this.props.element.showTimeSelect : false;
    const this_show_time_select_only = this.props.element.hasOwnProperty('showTimeSelectOnly') ? this.props.element.showTimeSelectOnly : false;
    const this_checked_inline = this.props.element.hasOwnProperty('inline') ? this.props.element.inline : false;
    const this_checked_bold = this.props.element.hasOwnProperty('bold') ? this.props.element.bold : false;
    const this_checked_italic = this.props.element.hasOwnProperty('italic') ? this.props.element.italic : false;
    const this_checked_center = this.props.element.hasOwnProperty('center') ? this.props.element.center : false;
    const this_checked_page_break = this.props.element.hasOwnProperty('pageBreakBefore') ? this.props.element.pageBreakBefore : false;
    const this_checked_alternate_form = this.props.element.hasOwnProperty('alternateForm') ? this.props.element.alternateForm : false;

    // Determine if element is inside a DynamicColumnRow or other column container
    const isInsideColumnContainer = this.props.element.parentId && this.props.preview && typeof this.props.preview.getDataById === 'function' ? (_parentElement$elemen => {
      const parentElement = this.props.preview.getDataById(this.props.element.parentId);
      return parentElement && (parentElement.element === 'DynamicColumnRow' || ((_parentElement$elemen = parentElement.element) === null || _parentElement$elemen === void 0 ? void 0 : _parentElement$elemen.includes('ColumnRow')) || parentElement.isContainer && parentElement.childItems);
    })() : false;
    const {
      canHaveDisplayHorizontal,
      canHaveOptionCorrect,
      canHaveOptionValue,
      canHaveInfo
    } = this.props.element;
    const this_files = this.props.files.length ? this.props.files : [];
    if (this_files.length < 1 || this_files.length > 0 && this_files[0].id !== '') {
      this_files.unshift({
        id: '',
        file_name: ''
      });
    }

    // Build editor states (prefer stored raw)
    const contentEditorState = this.getEditorStateFrom(this.state.element, 'content');
    const labelEditorState = this.getEditorStateFrom(this.state.element, 'label');
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "clearfix"
    }, /*#__PURE__*/_react.default.createElement("h4", {
      className: "float-left"
    }, this.props.element.text), /*#__PURE__*/_react.default.createElement("i", {
      className: "float-right fas fa-times dismiss-edit",
      onClick: this.props.manualEditModeOff
    })), this.props.element.hasOwnProperty('content') && this.props.element.content != null && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label"
    }, "Text to display:"), /*#__PURE__*/_react.default.createElement(_reactDraftWysiwyg.Editor, {
      toolbar: toolbar,
      defaultEditorState: contentEditorState,
      editorState: this.state.editorStates.content || contentEditorState,
      onBlur: this.onEditorBlur,
      onEditorStateChange: es => this.onEditorStateChange('content', es),
      stripPastedStyles: false
    })), this.props.element.hasOwnProperty('file_path') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "fileSelect"
    }, "Choose file:"), /*#__PURE__*/_react.default.createElement("select", {
      id: "fileSelect",
      className: "form-control",
      defaultValue: this.props.element.file_path,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'file_path', 'value')
    }, this_files.map(file => {
      const this_key = "file_".concat(file.id);
      return /*#__PURE__*/_react.default.createElement("option", {
        value: file.id,
        key: this_key
      }, file.file_name);
    }))), this.props.element.hasOwnProperty('href') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement(_reactTextareaAutosize.default, {
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.href,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'href', 'value')
    })), this.props.element.hasOwnProperty('src') && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "srcImage",
      type: "file",
      onChange: this.onUploadFile.bind(this)
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "srcInput"
    }, "Link to:"), /*#__PURE__*/_react.default.createElement("input", {
      id: "srcInput",
      type: "text",
      className: "form-control",
      value: this.props.element.src,
      defaultValue: this.props.element.src,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'src', 'value')
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "do-center",
      className: "custom-control-input",
      type: "checkbox",
      checked: this_checked_center,
      value: true,
      onChange: this.editElementProp.bind(this, 'center', 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: "do-center"
    }, "Center?"))), /*#__PURE__*/_react.default.createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-3"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "elementWidth"
    }, "Width:"), /*#__PURE__*/_react.default.createElement("input", {
      id: "elementWidth",
      type: "text",
      className: "form-control",
      value: this.props.element.width,
      defaultValue: this.props.element.width,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'width', 'value')
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-3"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "elementHeight"
    }, "Height:"), /*#__PURE__*/_react.default.createElement("input", {
      id: "elementHeight",
      type: "text",
      className: "form-control",
      value: this.props.element.height,
      defaultValue: this.props.element.height,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'height', 'value')
    })))), (((_this$props$element = this.props.element) === null || _this$props$element === void 0 ? void 0 : _this$props$element.label) != null || this.props.element.element === 'Signature2') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, this.props.element.element !== 'Signature2' && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("label", null, "Display Label"), /*#__PURE__*/_react.default.createElement(_reactDraftWysiwyg.Editor, {
      toolbar: toolbar,
      defaultEditorState: labelEditorState,
      editorState: this.state.editorStates.label || labelEditorState,
      onBlur: this.onEditorBlur,
      onEditorStateChange: es => this.onEditorStateChange('label', es),
      stripPastedStyles: false
    }), /*#__PURE__*/_react.default.createElement("br", null)), /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "is-required",
      className: "custom-control-input",
      type: "checkbox",
      checked: this_checked,
      value: true,
      onChange: this.editElementProp.bind(this, 'required', 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: "is-required"
    }, "Required")), this.props.element.hasOwnProperty('showTimeSelect') && /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "show-time-select",
      className: "custom-control-input",
      type: "checkbox",
      checked: this_show_time_select,
      value: true,
      onChange: this.editElementProp.bind(this, 'showTimeSelect', 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: "show-time-select"
    }, "Show Time Select?")), this_show_time_select && this.props.element.hasOwnProperty('showTimeSelectOnly') && /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "show-time-select-only",
      className: "custom-control-input",
      type: "checkbox",
      checked: this_show_time_select_only,
      value: true,
      onChange: this.editElementProp.bind(this, 'showTimeSelectOnly', 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: "show-time-select-only"
    }, "Show Time Select Only?")), this.props.element.hasOwnProperty('overdueNotification') && /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "overdueNotification",
      className: "custom-control-input",
      type: "checkbox",
      checked: !!this.props.element.overdueNotification,
      value: true,
      onChange: this.editElementProp.bind(this, 'overdueNotification', 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: "overdueNotification"
    }, "Overdue Notification")), (this.state.element.element === 'RadioButtons' || this.state.element.element === 'Checkboxes') && canHaveDisplayHorizontal && /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: "display-horizontal",
      className: "custom-control-input",
      type: "checkbox",
      checked: this_checked_inline,
      value: true,
      onChange: this.editElementProp.bind(this, 'inline', 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: "display-horizontal"
    }, "Display horizonal"))), this.state.element.element === 'Signature' && this.props.element.readOnly ? /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "variableKey"
    }, "Variable Key:"), /*#__PURE__*/_react.default.createElement("input", {
      id: "variableKey",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.variableKey,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'variableKey', 'value')
    }), /*#__PURE__*/_react.default.createElement("p", {
      className: "help-block"
    }, "This will give the element a key that can be used to replace the content with a runtime value.")) : /*#__PURE__*/_react.default.createElement("div", null), this.props.element.hasOwnProperty('step') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group-range"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "rangeStep"
    }, "Step"), /*#__PURE__*/_react.default.createElement("input", {
      id: "rangeStep",
      type: "number",
      className: "form-control",
      defaultValue: this.props.element.step,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'step', 'value')
    }))), this.props.element.hasOwnProperty('min_value') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group-range"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "rangeMin"
    }, "Min"), /*#__PURE__*/_react.default.createElement("input", {
      id: "rangeMin",
      type: "number",
      className: "form-control",
      defaultValue: this.props.element.min_value,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'min_value', 'value')
    }), /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.min_label,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'min_label', 'value')
    }))), this.props.element.hasOwnProperty('max_value') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group-range"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "rangeMax"
    }, "Max"), /*#__PURE__*/_react.default.createElement("input", {
      id: "rangeMax",
      type: "number",
      className: "form-control",
      defaultValue: this.props.element.max_value,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'max_value', 'value')
    }), /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.max_label,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'max_label', 'value')
    }))), this.props.element.hasOwnProperty('default_value') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group-range"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "defaultSelected"
    }, "Default Selected"), /*#__PURE__*/_react.default.createElement("input", {
      id: "defaultSelected",
      type: "number",
      className: "form-control",
      defaultValue: this.props.element.default_value,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'default_value', 'value')
    }))), this.props.element.showDescription && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "questionDescription"
    }, "Description"), /*#__PURE__*/_react.default.createElement(_reactTextareaAutosize.default, {
      type: "text",
      className: "form-control",
      id: "questionDescription",
      defaultValue: this.props.element.description,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'description', 'value')
    })), this.props.showCorrectColumn && this.props.element.canHaveAnswer && !this.props.element.hasOwnProperty('options') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "correctAnswer"
    }, "Correct Answer"), /*#__PURE__*/_react.default.createElement("input", {
      id: "correctAnswer",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.correct,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'correct', 'value')
    })), this.props.element.hasOwnProperty('header') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "header"
    }, "Section Header"), /*#__PURE__*/_react.default.createElement("input", {
      id: "header",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.header,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'header', 'value')
    })), this.props.element.hasOwnProperty('position') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "position"
    }, "Role / Position"), /*#__PURE__*/_react.default.createElement("input", {
      id: "position",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.position,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'position', 'value')
    })), this.props.element.hasOwnProperty('specificRole') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label"
    }, "Pre Defined User / Role ", Boolean(this.props.element.specificRole)), /*#__PURE__*/_react.default.createElement("select", {
      className: "form-control",
      id: "specificRole",
      defaultValue: this.props.element.specificRole,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'specificRole', 'value')
    }, /*#__PURE__*/_react.default.createElement("option", {
      value: "specific",
      key: "specific"
    }, "Specific role only"), /*#__PURE__*/_react.default.createElement("option", {
      value: "notSpecific",
      key: "notSpecific"
    }, "Anyone can sign"))), this.props.element.hasOwnProperty('options') && /*#__PURE__*/_react.default.createElement(_dynamicOptionList.default, {
      showCorrectColumn: this.props.showCorrectColumn,
      canHaveOptionCorrect: canHaveOptionCorrect,
      canHaveOptionValue: canHaveOptionValue,
      canHaveInfo: canHaveInfo,
      data: (_this$props$preview = this.props.preview) === null || _this$props$preview === void 0 || (_this$props$preview = _this$props$preview.state) === null || _this$props$preview === void 0 ? void 0 : _this$props$preview.data,
      updateElement: this.updateElementWithFlush,
      preview: this.props.preview,
      element: this.state.element
    }), this.props.element.hasOwnProperty('rows') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "rowInput"
    }, "Row Count"), /*#__PURE__*/_react.default.createElement("input", {
      id: "rowInput",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.rows,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'rows', 'value')
    })), this.props.element.hasOwnProperty('rowLabels') && /*#__PURE__*/_react.default.createElement(_fixedRowList.default, {
      data: (_this$props$preview2 = this.props.preview) === null || _this$props$preview2 === void 0 || (_this$props$preview2 = _this$props$preview2.state) === null || _this$props$preview2 === void 0 ? void 0 : _this$props$preview2.data,
      updateElement: this.updateElementWithFlush,
      preview: this.props.preview,
      element: this.state.element,
      key: "table-row-labels"
    }), this.props.element.hasOwnProperty('columns') && /*#__PURE__*/_react.default.createElement(_dynamicColumnList.default, {
      data: (_this$props$preview3 = this.props.preview) === null || _this$props$preview3 === void 0 || (_this$props$preview3 = _this$props$preview3.state) === null || _this$props$preview3 === void 0 ? void 0 : _this$props$preview3.data,
      updateElement: this.updateElementWithFlush,
      preview: this.props.preview,
      element: this.state.element,
      key: "table-columns",
      allowSync: this.state.element.allowSync !== undefined ? this.state.element.allowSync : true
    }), this.props.element.hasOwnProperty('sourceType') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "sourceType"
    }, "Source Type"), /*#__PURE__*/_react.default.createElement("select", {
      className: "form-control",
      id: "sourceType",
      defaultValue: this.props.element.sourceType,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'sourceType', 'value')
    }, /*#__PURE__*/_react.default.createElement("option", {
      value: "name",
      key: "name"
    }, "Name"), /*#__PURE__*/_react.default.createElement("option", {
      value: "department",
      key: "department"
    }, "Department"), /*#__PURE__*/_react.default.createElement("option", {
      value: "role",
      key: "role"
    }, "Role"), /*#__PURE__*/_react.default.createElement("option", {
      value: "form",
      key: "form"
    }, "Form"))), this.props.element.sourceType === 'form' && /*#__PURE__*/_react.default.createElement("div", null, this.props.element.hasOwnProperty('formSource') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "formSource"
    }, "Form Source"), /*#__PURE__*/_react.default.createElement("select", {
      className: "form-control",
      id: "formSource",
      value: this.props.element.formSource,
      defaultValue: this.props.element.formSource,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'formSource', 'value')
    }, /*#__PURE__*/_react.default.createElement("option", {
      value: -1,
      key: -1
    }, "\" Please select \""), this.state.formDataSource && this.state.formDataSource.map(item => /*#__PURE__*/_react.default.createElement("option", {
      value: item.id,
      key: item.id
    }, item.name)))), this.props.element.sourceType === 'form' && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "formSource"
    }, "Select Fields"), this.state.activeForm && this.state.activeForm.columns && this.state.activeForm.columns.map(item => /*#__PURE__*/_react.default.createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/_react.default.createElement("input", {
      id: item.field_name,
      className: "custom-control-input",
      type: "checkbox",
      checked: this.props.element.hasOwnProperty("formField".concat(item.field_name)) ? this.props.element["formField".concat(item.field_name)] : false,
      value: item.field_name,
      onChange: this.editElementProp.bind(this, "formField".concat(item.field_name), 'checked')
    }), /*#__PURE__*/_react.default.createElement("label", {
      className: "custom-control-label",
      htmlFor: item.field_name
    }, item.label || item.text || ''))))), this.props.element.hasOwnProperty('formula') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "rowInput"
    }, "Formula"), /*#__PURE__*/_react.default.createElement("input", {
      id: "formula",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.formula,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'formula', 'value')
    })), this.props.element.hasOwnProperty('formularKey') && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "rowInput"
    }, "Formula Key"), /*#__PURE__*/_react.default.createElement("input", {
      id: "formularKey",
      type: "text",
      className: "form-control",
      defaultValue: this.props.element.formularKey,
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'formularKey', 'value')
    })), this.props.element.element === 'FormLink' && /*#__PURE__*/_react.default.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "control-label",
      htmlFor: "formLinkSource"
    }, "Select Form"), /*#__PURE__*/_react.default.createElement("select", {
      className: "form-control",
      id: "formLinkSource",
      value: this.props.element.formSource || '',
      defaultValue: this.props.element.formSource || '',
      onBlur: this.updateElement.bind(this),
      onChange: this.editElementProp.bind(this, 'formSource', 'value')
    }, /*#__PURE__*/_react.default.createElement("option", {
      value: "",
      key: -1
    }, "Select a form..."), this.state.formDataSource && this.state.formDataSource.map(form => /*#__PURE__*/_react.default.createElement("option", {
      value: form.id,
      key: form.id
    }, form.name || form.title)))));
  }
}
exports.default = FormElementsEdit;
FormElementsEdit.defaultProps = {
  className: 'edit-element-fields'
};