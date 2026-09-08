var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var form_elements_edit_exports = {};
__export(form_elements_edit_exports, {
  default: () => FormElementsEdit
});
module.exports = __toCommonJS(form_elements_edit_exports);
var import_react = __toESM(require("react"));
var import_react_draft_wysiwyg = require("react-draft-wysiwyg");
var import_react_draft_wysiwyg2 = require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
var import_react_textarea_autosize = __toESM(require("react-textarea-autosize"));
var import_draft_js = require("draft-js");
var import_draftjs_to_html = __toESM(require("draftjs-to-html"));
var import_dynamic_column_list = __toESM(require("./dynamic-column-list"));
var import_dynamic_option_list = __toESM(require("./dynamic-option-list"));
var import_fixed_row_list = __toESM(require("./fixed-row-list"));
var import_requests = require("./stores/requests");
var import_draft_align = require("./styles/draft-align.css");
var import_UUID = __toESM(require("./UUID"));
var import_dynamic_column_row_names = require("./dynamic-column-row-names");
const toolbar = {
  options: ["inline", "list", "textAlign", "fontSize", "link", "colorPicker", "history"],
  inline: {
    inDropdown: false,
    className: void 0,
    options: ["bold", "italic", "underline", "superscript", "subscript"]
  },
  link: {
    popupClassName: "link-popup-right"
    // Open to the right so left sidebar does not clip it
  },
  colorPicker: {
    className: "rainbow-color-picker",
    // Add this custom class
    component: void 0,
    popupClassName: "color-picker-popup-right",
    // Open to the right so left sidebar does not clip it
    colors: [
      "rgb(97,189,109)",
      "rgb(26,188,156)",
      "rgb(84,172,210)",
      "rgb(44,130,201)",
      "rgb(147,101,184)",
      "#FF00BF",
      "rgb(71,85,119)",
      "rgb(204,204,204)",
      "rgb(65,168,95)",
      "rgb(0,168,133)",
      "rgb(61,142,185)",
      "rgb(41,105,176)",
      "#0000FF",
      "rgb(85,57,130)",
      "rgb(40,50,78)",
      "rgb(0,0,0)",
      "rgb(247,218,100)",
      "rgb(251,160,38)",
      "rgb(235,107,86)",
      "rgb(226,80,65)",
      "rgb(163,143,132)",
      "rgb(239,239,239)",
      "rgb(255,255,255)",
      "rgb(250,197,28)",
      "rgb(243,121,52)",
      "rgb(209,72,65)",
      "rgb(184,49,47)",
      "rgb(124,112,107)",
      "rgb(209,213,216)"
    ]
  }
};
class FormElementsEdit extends import_react.default.Component {
  constructor(props) {
    super(props);
    __publicField(this, "onUniqueNameChange", (e) => {
      const this_element = { ...this.latestElement || this.state.element };
      this_element.uniqueName = e.target.value;
      this.latestElement = this_element;
      this.setState({ element: this_element, dirty: true });
    });
    __publicField(this, "onUniqueNameBlur", () => {
      const this_element = { ...this.latestElement || this.state.element };
      const sanitized = (0, import_dynamic_column_row_names.sanitizeUniqueName)(this_element.uniqueName);
      const others = this.formDesignData();
      const fallback = (0, import_dynamic_column_row_names.nextDynamicColumnRowUniqueName)(
        others.filter((item) => item && item.id !== this_element.id)
      );
      this_element.uniqueName = sanitized || fallback;
      this.latestElement = this_element;
      this.setState({ element: this_element, dirty: true }, () => this.updateElement());
    });
    __publicField(this, "onSubFormNameChange", (e) => {
      const this_element = { ...this.latestElement || this.state.element };
      this_element.uniqueName = e.target.value;
      this.latestElement = this_element;
      this.setState({ element: this_element, dirty: true });
    });
    __publicField(this, "onSubFormNameBlur", () => {
      const this_element = { ...this.latestElement || this.state.element };
      this_element.uniqueName = (0, import_dynamic_column_row_names.sanitizeCellName)(this_element.uniqueName);
      this.latestElement = this_element;
      this.setState({ element: this_element, dirty: true }, () => this.updateElement());
    });
    __publicField(this, "onCellNameChange", (e) => {
      const this_element = { ...this.latestElement || this.state.element };
      this_element.cellName = e.target.value;
      this.latestElement = this_element;
      this.setState({ element: this_element, dirty: true });
    });
    __publicField(this, "onCellNameBlur", () => {
      const this_element = { ...this.latestElement || this.state.element };
      const fallback = (0, import_dynamic_column_row_names.defaultCellName)(this_element.row, this_element.col);
      const sanitized = (0, import_dynamic_column_row_names.sanitizeCellName)(this_element.cellName);
      if (!sanitized) {
        this_element.cellName = fallback;
        this_element.cellNameCustom = false;
      } else {
        this_element.cellName = sanitized;
        this_element.cellNameCustom = sanitized !== fallback;
      }
      this.latestElement = this_element;
      this.setState({ element: this_element, dirty: true }, () => this.updateElement());
    });
    __publicField(this, "updateElement", () => {
      var _a, _b, _c, _d;
      let this_element = this.latestElement || this.state.element;
      const editorStatesKeys = Object.keys(this.state.editorStates);
      if (editorStatesKeys.length > 0) {
        this_element = { ...this_element };
        editorStatesKeys.forEach((property) => {
          const editorState = this.state.editorStates[property];
          if (editorState) {
            const contentState = editorState.getCurrentContent();
            const raw = (0, import_draft_js.convertToRaw)(contentState);
            let html = (0, import_draftjs_to_html.default)(raw);
            html = this.applyBlockAlignmentStyles(raw, html);
            this_element[property] = html;
            this_element[`${property}Raw`] = JSON.stringify(raw);
          }
        });
        this.latestElement = this_element;
      }
      if (typeof console !== "undefined") {
        console.log("[FormElementsEdit] updateElement - saving element", {
          id: this_element == null ? void 0 : this_element.id,
          label: (_b = (_a = this_element == null ? void 0 : this_element.label) == null ? void 0 : _a.slice) == null ? void 0 : _b.call(_a, 0, 200),
          options: (_d = (_c = this_element == null ? void 0 : this_element.options) == null ? void 0 : _c.map) == null ? void 0 : _d.call(_c, (o) => ({ text: o.text, value: o.value }))
        });
      }
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({ dirty: false });
      }
      if (this_element.element === "Signature2" && this_element.parentId && this_element.row !== void 0 && this_element.col !== void 0 && this.props.preview && this.props.preview.syncRowChanges) {
        this.props.preview.syncRowChanges(this_element);
      }
    });
    // Wrapper for child components to ensure pending label/content updates are saved first
    __publicField(this, "updateElementWithFlush", (childElement) => {
      var _a, _b, _c, _d;
      if (this.debouncedPush && this.debouncedPush.cancel) {
        this.debouncedPush.cancel();
      }
      const currentElement = this.latestElement || this.state.element;
      const mergedElement = {
        ...childElement,
        label: currentElement.label,
        labelRaw: currentElement.labelRaw,
        content: currentElement.content,
        contentRaw: currentElement.contentRaw,
        dirty: true
      };
      if (typeof console !== "undefined" && console.debug) {
        console.debug("[FormElementsEdit] updateElementWithFlush - mergedElement", {
          id: mergedElement == null ? void 0 : mergedElement.id,
          label: (_b = (_a = mergedElement == null ? void 0 : mergedElement.label) == null ? void 0 : _a.slice) == null ? void 0 : _b.call(_a, 0, 200),
          options: (_d = (_c = mergedElement == null ? void 0 : mergedElement.options) == null ? void 0 : _c.map) == null ? void 0 : _d.call(_c, (o) => ({ text: o.text, value: o.value }))
        });
      }
      this.setState({ dirty: false });
      this.props.updateElement.call(this.props.preview, mergedElement);
    });
    __publicField(this, "onEditorBlur", () => {
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
    this.latestElement = this.props.element;
  }
  debounce(fn, ms) {
    let t;
    const debounced = (...a) => {
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
        this_element.src = "Please provide upload callback";
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
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
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
      console.log("error upload", error);
      const this_element = this.state.element;
      this_element.src = "cannot upload file";
      this.setState({
        element: this_element
      });
    }
  }
  async componentDidMount() {
    let formDataSource = [];
    let activeForm = {};
    let activeFormContent = {};
    if ((this.props.element.element === "DataSource" || this.props.element.element === "FormLink") && this.props.getFormSource) {
      formDataSource = await this.props.getFormSource(this.props.element) || [];
      if (formDataSource) {
        activeForm = formDataSource.find(
          (item) => item.id == this.props.element.formSource
        );
        if (activeForm && this.props.getFormContent) {
          activeFormContent = await this.props.getFormContent(activeForm) || {};
        }
      }
      this.setState((current) => ({
        ...current,
        formDataSource,
        activeForm: activeFormContent
      }));
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.element !== this.props.element) {
      this.latestElement = this.props.element;
      const prevId = prevProps.element && prevProps.element.id;
      const newId = this.props.element && this.props.element.id;
      if (prevId !== newId) {
        this.setState({
          element: this.props.element,
          data: this.props.data,
          dirty: false,
          editorStates: {}
          // Reset editor states to use new content
        });
      } else {
        this.setState({
          element: this.props.element,
          data: this.props.data,
          dirty: false
        });
      }
    }
  }
  async editElementProp(elemProperty, targProperty, e) {
    const this_element = this.state.element;
    this_element[elemProperty] = e.target[targProperty];
    if (elemProperty === "sourceType" && this.props.getFormSource) {
      this_element.formSource = "";
      const formDataSource = await this.props.getFormSource(this_element) || [];
      this.setState((current) => ({
        ...current,
        formDataSource,
        activeForm: {}
      }));
    }
    if (elemProperty === "formSource" && this.state.formDataSource) {
      const activeForm = this.state.formDataSource.find(
        (item) => item.id == this_element[elemProperty]
      );
      let activeFormContent = {};
      if (activeForm && this.props.getFormContent) {
        activeFormContent = await this.props.getFormContent(activeForm) || {};
      }
      this.setState((current) => ({
        ...current,
        activeForm: activeFormContent
      }));
    }
    this.latestElement = this_element;
    this.setState(
      {
        element: this_element,
        dirty: true
      },
      () => {
        if (targProperty === "checked") {
          this.updateElement();
        }
      }
    );
  }
  formDesignData() {
    var _a, _b;
    return ((_b = (_a = this.props.preview) == null ? void 0 : _a.state) == null ? void 0 : _b.data) || [];
  }
  getEditorStateFrom(element, key) {
    try {
      const rawStr = element[`${key}Raw`];
      if (rawStr) {
        const raw = typeof rawStr === "string" ? JSON.parse(rawStr) : rawStr;
        return import_draft_js.EditorState.createWithContent((0, import_draft_js.convertFromRaw)(raw));
      }
    } catch (e) {
    }
    if (element[key]) return this.convertFromHTML(element[key]);
    return import_draft_js.EditorState.createEmpty();
  }
  onEditorStateChange(property, editorState) {
    this.setState(
      {
        dirty: true,
        editorStates: { ...this.state.editorStates, [property]: editorState }
      },
      () => {
        this.debouncedPush();
      }
    );
  }
  // Inject text-align styles based on block.data alignment fields
  applyBlockAlignmentStyles(raw, html) {
    if (!raw || !raw.blocks || !html) return html;
    if (typeof window === "undefined" || !window.DOMParser) return html;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const blockEls = [];
      const collect = (node) => {
        if (node.nodeType !== 1) return;
        const tag = node.tagName.toLowerCase();
        if ([
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
          "pre",
          "li",
          "figure",
          "div"
        ].includes(tag)) {
          blockEls.push(node);
        }
        Array.from(node.children).forEach(collect);
      };
      Array.from(doc.body.children).forEach(collect);
      let idx = 0;
      raw.blocks.forEach((block) => {
        const el = blockEls[idx];
        idx += 1;
        if (!el) return;
        const data = block.data || {};
        const align = data["text-align"] || data.textAlign || data.textAlignment || data.alignment;
        if (!align) return;
        const a = ["left", "right", "center", "justify"].includes(align) ? align : "left";
        const prev = el.getAttribute("style") || "";
        if (!prev.includes("text-align")) {
          el.setAttribute("style", `text-align:${a};${prev}`);
        }
        el.classList.add(`draft-align-${a}`);
        if (el.tagName.toLowerCase() === "li" && el.parentElement) {
          const listParent = el.parentElement;
          const parentPrev = listParent.getAttribute("style") || "";
          if (!parentPrev.includes("text-align")) {
            listParent.setAttribute("style", `text-align:${a};${parentPrev}`);
          }
          listParent.classList.add(`draft-align-${a}`);
        }
      });
      return doc.body.innerHTML;
    } catch (e) {
      return html;
    }
  }
  convertFromHTML(content) {
    const newContent = (0, import_draft_js.convertFromHTML)(content || "");
    if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
      return import_draft_js.EditorState.createEmpty();
    }
    const contentState = import_draft_js.ContentState.createFromBlockArray(newContent);
    return import_draft_js.EditorState.createWithContent(contentState);
  }
  addOptions() {
    const optionsApiUrl = document.getElementById("optionsApiUrl").value;
    if (optionsApiUrl) {
      (0, import_requests.get)(optionsApiUrl).then((data) => {
        this.props.element.options = [];
        const { options } = this.props.element;
        data.forEach((x) => {
          x.key = import_UUID.default.uuid();
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (this.state.dirty) {
      this.props.element.dirty = true;
    }
    const this_checked = this.props.element.hasOwnProperty("required") ? this.props.element.required : false;
    const this_read_only = this.props.element.hasOwnProperty("readOnly") ? this.props.element.readOnly : false;
    const this_default_today = this.props.element.hasOwnProperty("defaultToday") ? this.props.element.defaultToday : false;
    const this_show_time_select = this.props.element.hasOwnProperty("showTimeSelect") ? this.props.element.showTimeSelect : false;
    const this_show_time_select_only = this.props.element.hasOwnProperty(
      "showTimeSelectOnly"
    ) ? this.props.element.showTimeSelectOnly : false;
    const this_checked_inline = this.props.element.hasOwnProperty("inline") ? this.props.element.inline : false;
    const this_checked_bold = this.props.element.hasOwnProperty("bold") ? this.props.element.bold : false;
    const this_checked_italic = this.props.element.hasOwnProperty("italic") ? this.props.element.italic : false;
    const this_checked_center = this.props.element.hasOwnProperty("center") ? this.props.element.center : false;
    const this_checked_page_break = this.props.element.hasOwnProperty("pageBreakBefore") ? this.props.element.pageBreakBefore : false;
    const this_checked_alternate_form = this.props.element.hasOwnProperty("alternateForm") ? this.props.element.alternateForm : false;
    const isInsideColumnContainer = this.props.element.parentId && this.props.preview && typeof this.props.preview.getDataById === "function" ? (() => {
      var _a2;
      const parentElement = this.props.preview.getDataById(
        this.props.element.parentId
      );
      return parentElement && (parentElement.element === "DynamicColumnRow" || ((_a2 = parentElement.element) == null ? void 0 : _a2.includes("ColumnRow")) || parentElement.isContainer && parentElement.childItems);
    })() : false;
    const {
      canHaveDisplayHorizontal,
      canHaveOptionCorrect,
      canHaveOptionValue,
      canHaveInfo
    } = this.props.element;
    const this_files = this.props.files.length ? this.props.files : [];
    if (this_files.length < 1 || this_files.length > 0 && this_files[0].id !== "") {
      this_files.unshift({ id: "", file_name: "" });
    }
    const contentEditorState = this.getEditorStateFrom(this.state.element, "content");
    const labelEditorState = this.getEditorStateFrom(this.state.element, "label");
    return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { className: "clearfix" }, /* @__PURE__ */ import_react.default.createElement("h4", { className: "float-left" }, this.props.element.text), /* @__PURE__ */ import_react.default.createElement(
      "i",
      {
        className: "float-right fas fa-times dismiss-edit",
        onClick: this.props.manualEditModeOff
      }
    )), this.props.element.element === "DynamicColumnRow" && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "dcrUniqueName" }, "Unique name"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "dcrUniqueName",
        type: "text",
        className: "form-control",
        value: this.state.element.uniqueName || "",
        placeholder: (0, import_dynamic_column_row_names.nextDynamicColumnRowUniqueName)(
          this.formDesignData().filter(
            (item) => item && item.id !== this.props.element.id
          )
        ),
        onChange: this.onUniqueNameChange,
        onBlur: this.onUniqueNameBlur
      }
    ), (0, import_dynamic_column_row_names.isUniqueNameTaken)(
      this.formDesignData(),
      this.state.element.uniqueName,
      this.props.element.id
    ) && /* @__PURE__ */ import_react.default.createElement("p", { className: "help-block", style: { color: "#c0392b" } }, "Unique name must be unique among Dynamic Column Rows on this form."), /* @__PURE__ */ import_react.default.createElement("p", { className: "help-block" }, "Required. Used in template tags such as #WorkHistory_c1#. On a master form, tables inside a SubForm use #SubFormName_WorkHistory_c1#.")), this.props.element.parentId && this.props.preview && typeof this.props.preview.getDataById === "function" && ((_a = this.props.preview.getDataById(this.props.element.parentId)) == null ? void 0 : _a.element) === "DynamicColumnRow" && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "dcrCellName" }, "Cell unique name"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "dcrCellName",
        type: "text",
        className: "form-control",
        value: this.state.element.cellName || (0, import_dynamic_column_row_names.defaultCellName)(this.state.element.row, this.state.element.col),
        onChange: this.onCellNameChange,
        onBlur: this.onCellNameBlur
      }
    ), (0, import_dynamic_column_row_names.isCellNameTaken)(
      this.formDesignData(),
      this.props.element.parentId,
      this.state.element.cellName || (0, import_dynamic_column_row_names.defaultCellName)(this.state.element.row, this.state.element.col),
      this.props.element.id
    ) && /* @__PURE__ */ import_react.default.createElement("p", { className: "help-block", style: { color: "#c0392b" } }, "Cell unique name must be unique within this table."), /* @__PURE__ */ import_react.default.createElement("p", { className: "help-block" }, "Default is r", "{", "row", "}", "c", "{", "col", "}", " (e.g. r1c1). Any language is allowed. Template tag:", " ", (0, import_dynamic_column_row_names.templateColumnTagPreview)(
      (_b = this.props.preview.getDataById(this.props.element.parentId)) == null ? void 0 : _b.uniqueName,
      this.state.element.col
    ))), this.props.element.hasOwnProperty("content") && this.props.element.content != null && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label" }, "Text to display:"), /* @__PURE__ */ import_react.default.createElement(
      import_react_draft_wysiwyg.Editor,
      {
        toolbar,
        defaultEditorState: contentEditorState,
        editorState: this.state.editorStates.content || contentEditorState,
        onBlur: this.onEditorBlur,
        onEditorStateChange: (es) => this.onEditorStateChange("content", es),
        stripPastedStyles: false
      }
    )), this.props.element.hasOwnProperty("file_path") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "fileSelect" }, "Choose file:"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        id: "fileSelect",
        className: "form-control",
        defaultValue: this.props.element.file_path,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "file_path", "value")
      },
      this_files.map((file) => {
        const this_key = `file_${file.id}`;
        return /* @__PURE__ */ import_react.default.createElement("option", { value: file.id, key: this_key }, file.file_name);
      })
    )), this.props.element.hasOwnProperty("href") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement(
      import_react_textarea_autosize.default,
      {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.href,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "href", "value")
      }
    )), this.props.element.hasOwnProperty("src") && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("input", { id: "srcImage", type: "file", onChange: this.onUploadFile.bind(this) })), /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "srcInput" }, "Link to:"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "srcInput",
        type: "text",
        className: "form-control",
        value: this.props.element.src,
        defaultValue: this.props.element.src,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "src", "value")
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "do-center",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked_center,
        value: true,
        onChange: this.editElementProp.bind(this, "center", "checked")
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: "do-center" }, "Center?"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "col-sm-3" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "elementWidth" }, "Width:"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "elementWidth",
        type: "text",
        className: "form-control",
        value: this.props.element.width,
        defaultValue: this.props.element.width,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "width", "value")
      }
    )), /* @__PURE__ */ import_react.default.createElement("div", { className: "col-sm-3" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "elementHeight" }, "Height:"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "elementHeight",
        type: "text",
        className: "form-control",
        value: this.props.element.height,
        defaultValue: this.props.element.height,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "height", "value")
      }
    )))), (((_c = this.props.element) == null ? void 0 : _c.label) != null || this.props.element.element === "Signature2" || this.props.element.element === "ImageUpload") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, this.props.element.element !== "Signature2" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", null, "Display Label"), /* @__PURE__ */ import_react.default.createElement(
      import_react_draft_wysiwyg.Editor,
      {
        toolbar,
        defaultEditorState: labelEditorState,
        editorState: this.state.editorStates.label || labelEditorState,
        onBlur: this.onEditorBlur,
        onEditorStateChange: (es) => this.onEditorStateChange("label", es),
        stripPastedStyles: false
      }
    ), /* @__PURE__ */ import_react.default.createElement("br", null)), /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "is-required",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked,
        value: true,
        onChange: this.editElementProp.bind(this, "required", "checked")
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: "is-required" }, "Required")), this.props.element.hasOwnProperty("showTimeSelect") && /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "show-time-select",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_show_time_select,
        value: true,
        onChange: this.editElementProp.bind(this, "showTimeSelect", "checked")
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: "show-time-select" }, "Show Time Select?")), this_show_time_select && this.props.element.hasOwnProperty("showTimeSelectOnly") && /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "show-time-select-only",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_show_time_select_only,
        value: true,
        onChange: this.editElementProp.bind(
          this,
          "showTimeSelectOnly",
          "checked"
        )
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: "show-time-select-only" }, "Show Time Select Only?")), this.props.element.hasOwnProperty("overdueNotification") && /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "overdueNotification",
        className: "custom-control-input",
        type: "checkbox",
        checked: !!this.props.element.overdueNotification,
        value: true,
        onChange: this.editElementProp.bind(
          this,
          "overdueNotification",
          "checked"
        )
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: "overdueNotification" }, "Overdue Notification")), (this.state.element.element === "RadioButtons" || this.state.element.element === "Checkboxes") && canHaveDisplayHorizontal && /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "display-horizontal",
        className: "custom-control-input",
        type: "checkbox",
        checked: this_checked_inline,
        value: true,
        onChange: this.editElementProp.bind(this, "inline", "checked")
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: "display-horizontal" }, "Display horizonal"))), this.state.element.element === "Signature" && this.props.element.readOnly ? /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "variableKey" }, "Variable Key:"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "variableKey",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.variableKey,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "variableKey", "value")
      }
    ), /* @__PURE__ */ import_react.default.createElement("p", { className: "help-block" }, "This will give the element a key that can be used to replace the content with a runtime value.")) : /* @__PURE__ */ import_react.default.createElement("div", null), this.props.element.hasOwnProperty("step") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group-range" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "rangeStep" }, "Step"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "rangeStep",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.step,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "step", "value")
      }
    ))), this.props.element.hasOwnProperty("min_value") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group-range" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "rangeMin" }, "Min"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "rangeMin",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.min_value,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "min_value", "value")
      }
    ), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.min_label,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "min_label", "value")
      }
    ))), this.props.element.hasOwnProperty("max_value") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group-range" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "rangeMax" }, "Max"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "rangeMax",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.max_value,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "max_value", "value")
      }
    ), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.max_label,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "max_label", "value")
      }
    ))), this.props.element.hasOwnProperty("default_value") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group-range" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "defaultSelected" }, "Default Selected"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "defaultSelected",
        type: "number",
        className: "form-control",
        defaultValue: this.props.element.default_value,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "default_value", "value")
      }
    ))), this.props.element.showDescription && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "questionDescription" }, "Description"), /* @__PURE__ */ import_react.default.createElement(
      import_react_textarea_autosize.default,
      {
        type: "text",
        className: "form-control",
        id: "questionDescription",
        defaultValue: this.props.element.description,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "description", "value")
      }
    )), this.props.showCorrectColumn && this.props.element.canHaveAnswer && !this.props.element.hasOwnProperty("options") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "correctAnswer" }, "Correct Answer"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "correctAnswer",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.correct,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "correct", "value")
      }
    )), this.props.element.hasOwnProperty("header") && this.props.element.element !== "ImageUpload" && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "header" }, "Section Header"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "header",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.header,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "header", "value")
      }
    )), this.props.element.hasOwnProperty("position") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "position" }, "Role / Position"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "position",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.position,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "position", "value")
      }
    )), this.props.element.hasOwnProperty("specificRole") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label" }, "Pre Defined User / Role ", Boolean(this.props.element.specificRole)), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        className: "form-control",
        id: "specificRole",
        defaultValue: this.props.element.specificRole,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "specificRole", "value")
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "specific", key: "specific" }, "Specific role only"),
      /* @__PURE__ */ import_react.default.createElement("option", { value: "notSpecific", key: "notSpecific" }, "Anyone can sign")
    )), this.props.element.hasOwnProperty("options") && /* @__PURE__ */ import_react.default.createElement(
      import_dynamic_option_list.default,
      {
        showCorrectColumn: this.props.showCorrectColumn,
        canHaveOptionCorrect,
        canHaveOptionValue,
        canHaveInfo,
        data: (_e = (_d = this.props.preview) == null ? void 0 : _d.state) == null ? void 0 : _e.data,
        updateElement: this.updateElementWithFlush,
        preview: this.props.preview,
        element: this.state.element
      }
    ), this.props.element.hasOwnProperty("rows") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "rowInput" }, "Row Count"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "rowInput",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.rows,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "rows", "value")
      }
    )), this.props.element.hasOwnProperty("rowLabels") && /* @__PURE__ */ import_react.default.createElement(
      import_fixed_row_list.default,
      {
        data: (_g = (_f = this.props.preview) == null ? void 0 : _f.state) == null ? void 0 : _g.data,
        updateElement: this.updateElementWithFlush,
        preview: this.props.preview,
        element: this.state.element,
        key: "table-row-labels"
      }
    ), this.props.element.hasOwnProperty("columns") && /* @__PURE__ */ import_react.default.createElement(
      import_dynamic_column_list.default,
      {
        data: (_i = (_h = this.props.preview) == null ? void 0 : _h.state) == null ? void 0 : _i.data,
        updateElement: this.updateElementWithFlush,
        preview: this.props.preview,
        element: this.state.element,
        key: "table-columns",
        allowSync: this.state.element.allowSync !== void 0 ? this.state.element.allowSync : true
      }
    ), this.props.element.hasOwnProperty("sourceType") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "sourceType" }, "Source Type"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        className: "form-control",
        id: "sourceType",
        defaultValue: this.props.element.sourceType,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "sourceType", "value")
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "name", key: "name" }, "Name"),
      /* @__PURE__ */ import_react.default.createElement("option", { value: "department", key: "department" }, "Department"),
      /* @__PURE__ */ import_react.default.createElement("option", { value: "role", key: "role" }, "Role"),
      /* @__PURE__ */ import_react.default.createElement("option", { value: "email", key: "email" }, "Email"),
      /* @__PURE__ */ import_react.default.createElement("option", { value: "form", key: "form" }, "Form"),
      /* @__PURE__ */ import_react.default.createElement("option", { value: "dataset", key: "dataset" }, "Dataset")
    )), (this.props.element.sourceType === "form" || this.props.element.sourceType === "dataset") && /* @__PURE__ */ import_react.default.createElement("div", null, this.props.element.hasOwnProperty("formSource") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "formSource" }, this.props.element.sourceType === "dataset" ? "Dataset Source" : "Form Source"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        className: "form-control",
        id: "formSource",
        value: this.props.element.formSource,
        defaultValue: this.props.element.formSource,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "formSource", "value")
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: -1, key: -1 }, '" Please select "'),
      this.state.formDataSource && this.state.formDataSource.map((item) => /* @__PURE__ */ import_react.default.createElement("option", { value: item.id, key: item.id }, item.name))
    )), (this.props.element.sourceType === "form" || this.props.element.sourceType === "dataset") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "formSource" }, this.props.element.sourceType === "dataset" ? "Select Dataset Keys" : "Select Fields"), this.state.activeForm && this.state.activeForm.columns && this.state.activeForm.columns.map((item) => /* @__PURE__ */ import_react.default.createElement("div", { className: "custom-control custom-checkbox" }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: item.field_name,
        className: "custom-control-input",
        type: "checkbox",
        checked: this.props.element.hasOwnProperty(`formField${item.field_name}`) ? this.props.element[`formField${item.field_name}`] : false,
        value: item.field_name,
        onChange: this.editElementProp.bind(
          this,
          `formField${item.field_name}`,
          "checked"
        )
      }
    ), /* @__PURE__ */ import_react.default.createElement("label", { className: "custom-control-label", htmlFor: item.field_name }, item.label || item.text || ""))))), this.props.element.hasOwnProperty("formula") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "rowInput" }, "Formula"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "formula",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.formula,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "formula", "value")
      }
    )), this.props.element.hasOwnProperty("formularKey") && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "rowInput" }, "Formula Key"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "formularKey",
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.formularKey,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "formularKey", "value")
      }
    )), this.props.element.element === "FormLink" && /* @__PURE__ */ import_react.default.createElement("div", { className: "form-group" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "formLinkSubFormName" }, "Subform name"), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        id: "formLinkSubFormName",
        type: "text",
        className: "form-control",
        value: this.state.element.uniqueName || "",
        placeholder: "Optional. Default is the Display Label.",
        onChange: this.onSubFormNameChange,
        onBlur: this.onSubFormNameBlur
      }
    ), /* @__PURE__ */ import_react.default.createElement("p", { className: "help-block" }, "Prefix for Dynamic Column Row tags from this SubForm, e.g.", " ", (0, import_dynamic_column_row_names.templateSubFormColumnTagPreview)(this.state.element, "DynamicColumnRow1", 0), ". Tags without a Subform name belong to the master form."), /* @__PURE__ */ import_react.default.createElement("label", { className: "control-label", htmlFor: "formLinkSource" }, "Select Form"), /* @__PURE__ */ import_react.default.createElement(
      "select",
      {
        className: "form-control",
        id: "formLinkSource",
        value: this.props.element.formSource || "",
        defaultValue: this.props.element.formSource || "",
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, "formSource", "value")
      },
      /* @__PURE__ */ import_react.default.createElement("option", { value: "", key: -1 }, "Select a form..."),
      this.state.formDataSource && this.state.formDataSource.map((form) => /* @__PURE__ */ import_react.default.createElement("option", { value: form.id, key: form.id }, form.name || form.title))
    )));
  }
}
FormElementsEdit.defaultProps = { className: "edit-element-fields" };
