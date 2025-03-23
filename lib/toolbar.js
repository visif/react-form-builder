"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _store = _interopRequireDefault(require("./stores/store"));
var _toolbarDraggableItem = _interopRequireDefault(require("./toolbar-draggable-item"));
var _UUID = _interopRequireDefault(require("./UUID"));
<<<<<<< HEAD
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
=======
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function isDefaultItem(item) {
  var keys = Object.keys(item);
  return keys.filter(function (x) {
    return x !== 'element' && x !== 'key';
  }).length === 0;
}
function buildItems(items, defaultItems) {
  if (!items) {
    return defaultItems;
  }
  return items.map(function (x) {
    var found;
    if (isDefaultItem(x)) {
      found = defaultItems.find(function (y) {
        return (x.element || x.key) === (y.element || y.key);
      });
    }
    return found || x;
  });
}
var DATE_FORMAT = 'DD MMM YYYY';
var Toolbar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Toolbar, _React$Component);
  var _super = _createSuper(Toolbar);
  function Toolbar(props) {
    var _this;
    (0, _classCallCheck2.default)(this, Toolbar);
    _this = _super.call(this, props);
    var items = buildItems(props.items, _this._defaultItems());
    _this.state = {
      items: items
    };
    _store.default.subscribe(function (state) {
      _this.setState({
        store: state
      });
    });
    _this.create = _this.create.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }
  (0, _createClass2.default)(Toolbar, [{
    key: "_defaultItems",
    value: function _defaultItems() {
      return [{
        key: 'Header',
        name: 'Header Text',
        icon: 'fas fa-heading',
<<<<<<< HEAD
        static: true,
=======
        "static": true,
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        content: 'Placeholder Text...'
      }, {
        key: 'Label',
        name: 'Label',
<<<<<<< HEAD
        static: true,
=======
        "static": true,
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        icon: 'fas fa-font',
        content: 'Placeholder Text...'
      }, {
        key: 'Paragraph',
        name: 'Paragraph',
<<<<<<< HEAD
        static: true,
=======
        "static": true,
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        icon: 'fas fa-paragraph',
        content: 'Placeholder Text...'
      }, {
        key: 'LineBreak',
        name: 'Line Break',
<<<<<<< HEAD
        static: true,
=======
        "static": true,
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        icon: 'fas fa-arrows-alt-h'
      }, {
        key: 'Dropdown',
        canHaveAnswer: true,
        name: 'Dropdown',
        icon: 'far fa-caret-square-down',
        label: 'Placeholder Label',
        field_name: 'dropdown_',
<<<<<<< HEAD
        options: []
      }, {
        key: 'Tags',
        canHaveAnswer: true,
        name: 'Tags',
        icon: 'fas fa-tags',
        label: 'Placeholder Label',
        field_name: 'tags_',
        options: []
      }, {
=======
        options: [],
        formularKey: ''
      }, {
        key: 'Tags',
        canHaveAnswer: true,
        name: 'Tags',
        icon: 'fas fa-tags',
        label: 'Placeholder Label',
        field_name: 'tags_',
        options: []
      }, {
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        key: 'Checkboxes',
        canHaveAnswer: true,
        canHaveInfo: true,
        name: 'Checkboxes',
        icon: 'far fa-check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        options: []
      }, {
        key: 'RadioButtons',
        canHaveAnswer: true,
        canHaveInfo: true,
        name: 'Multiple Choice',
        icon: 'far fa-dot-circle',
        label: 'Placeholder Label',
        field_name: 'radiobuttons_',
<<<<<<< HEAD
        options: []
=======
        options: [],
        formularKey: ''
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
      }, {
        key: 'TextInput',
        canHaveAnswer: true,
        name: 'Text Input',
        label: 'Placeholder Label',
        icon: 'fas fa-font',
<<<<<<< HEAD
        field_name: 'text_input_'
=======
        field_name: 'text_input_',
        formularKey: ''
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
      }, {
        key: 'FormulaInput',
        // Add FormulaInput to the default items
        name: 'Formula Input',
        label: 'Placeholder Label',
        icon: 'fas fa-calculator',
        field_name: 'formula_input_',
        formula: ''
      }, {
        key: 'NumberInput',
        canHaveAnswer: true,
        name: 'Number Input',
        label: 'Placeholder Label',
        icon: 'fas fa-plus',
<<<<<<< HEAD
        field_name: 'number_input_'
=======
        field_name: 'number_input_',
        formularKey: ''
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
      }, {
        key: 'TextArea',
        canHaveAnswer: true,
        name: 'Multi-line Input',
        label: 'Placeholder Label',
        icon: 'fas fa-text-height',
        field_name: 'text_area_'
      }, {
        key: 'DataSource',
        name: 'DataSource',
        icon: 'fa fa-database',
        field_name: 'data_source_',
        sourceType: 'name',
        formSource: '',
        formField: {},
        canHaveAnswer: true,
        label: 'Placeholder Label'
      }, {
        key: 'Table',
        name: 'Table',
        icon: 'fas fa-table',
        field_name: 'tables_',
        columns: [],
        rowLabels: [],
        rows: 3
      }, {
        key: 'TwoColumnRow',
        canHaveAnswer: false,
        name: 'Two Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'two_col_row_'
      }, {
        key: 'ThreeColumnRow',
        canHaveAnswer: false,
        name: 'Three Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'three_col_row_'
      }, {
        key: 'FourColumnRow',
        canHaveAnswer: false,
        name: 'Four Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'four_col_row_'
      }, {
        key: 'Image',
        name: 'Image',
        label: '',
        icon: 'far fa-image',
        field_name: 'image_',
        src: ''
      }, {
        key: 'Rating',
        canHaveAnswer: true,
        name: 'Rating',
        label: 'Placeholder Label',
        icon: 'fas fa-star',
        field_name: 'rating_'
      }, {
        key: 'DatePicker',
        canDefaultToday: true,
        canReadOnly: true,
        dateFormat: DATE_FORMAT,
        timeFormat: 'hh:mm aa',
        showTimeSelect: false,
        showTimeSelectOnly: false,
        name: 'Date',
        icon: 'far fa-calendar-alt',
        label: 'Placeholder Label',
        field_name: 'date_picker_'
      }, {
        key: 'Signature',
        canReadOnly: true,
        name: 'Signature',
        icon: 'fas fa-pen-square',
        label: 'Signature',
        field_name: 'signature_'
      }, {
        key: 'Signature2',
        name: 'Signature',
        // label: "Signature",
        icon: 'fas fa-signature',
        field_name: 'signature2_',
        position: 'Placeholder Text',
        specificRole: 'specific'
      }, {
        key: 'HyperLink',
        name: 'Web site',
        icon: 'fas fa-link',
<<<<<<< HEAD
        static: true,
=======
        "static": true,
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        content: 'Placeholder Web site link ...',
        href: 'http://www.example.com'
      }, {
        key: 'Download',
        name: 'File Attachment',
        icon: 'fas fa-file',
<<<<<<< HEAD
        static: true,
=======
        "static": true,
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        content: 'Placeholder file name ...',
        field_name: 'download_',
        file_path: '',
        _href: ''
      }, {
        key: 'Range',
        name: 'Range',
        icon: 'fas fa-sliders-h',
        label: 'Placeholder Label',
        field_name: 'range_',
        step: 1,
        default_value: 3,
        min_value: 1,
        max_value: 5,
        min_label: 'Easy',
        max_label: 'Difficult'
      }, {
        key: 'Camera',
        name: 'Camera',
        icon: 'fas fa-camera',
        label: 'Placeholder Label',
        field_name: 'camera_'
      }, {
        key: 'Section',
        name: 'Section',
        icon: 'fas fa-cut',
        field_name: 'section_',
        header: 'Placeholder Text'
      }, {
        key: 'FileUpload',
        name: 'FileUpload',
        icon: 'fas fa-upload',
        field_name: 'fileupload_',
        header: 'Placeholder Text'
      }, {
        key: 'ImageUpload',
        name: 'ImageUpload',
        icon: 'fas fa-image',
        field_name: 'fileimage_',
        header: 'Placeholder Text'
      }];
    }
  }, {
    key: "create",
    value: function create(item) {
      var elementOptions = {
        id: _UUID.default.uuid(),
        element: item.element || item.key,
        text: item.name,
        static: item.static,
        required: false,
        showDescription: item.showDescription
      };
      if (this.props.showDescription === true && !item.static) {
        elementOptions.showDescription = true;
      }
      if (item.type === 'custom') {
        elementOptions.key = item.key;
        elementOptions.custom = true;
        elementOptions.forwardRef = item.forwardRef;
        elementOptions.bare = item.bare;
        elementOptions.props = item.props;
        elementOptions.component = item.component || null;
        elementOptions.custom_options = item.custom_options || [];
      }
      if (item.static) {
        elementOptions.bold = false;
        elementOptions.italic = false;
      }
      if (item.canHaveAnswer) {
        elementOptions.canHaveAnswer = item.canHaveAnswer;
      }
      if (item.canHaveInfo) {
        elementOptions.canHaveInfo = item.canHaveInfo;
      }
      if (item.canReadOnly) {
        elementOptions.readOnly = false;
      }
      if (item.canDefaultToday) {
        elementOptions.defaultToday = false;
      }
      if (item.content) {
        elementOptions.content = item.content;
      }
      if (item.href) {
        elementOptions.href = item.href;
      }
      elementOptions.canHavePageBreakBefore = item.canHavePageBreakBefore !== false;
      elementOptions.canHaveAlternateForm = item.canHaveAlternateForm !== false;
      elementOptions.canHaveDisplayHorizontal = item.canHaveDisplayHorizontal !== false;
      if (elementOptions.canHaveDisplayHorizontal) {
        elementOptions.inline = item.inline;
      }
      elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect !== false;
      elementOptions.canHaveOptionValue = item.canHaveOptionValue !== false;
      elementOptions.canPopulateFromApi = item.canPopulateFromApi !== false;
      if (item.class_name) {
        elementOptions.class_name = item.class_name;
      }
      if (item.key === 'Image') {
        elementOptions.src = item.src;
        elementOptions.width = item.src.width || 100;
        elementOptions.height = item.src.height || 100;
      }
      if (item.key === 'DatePicker') {
        elementOptions.dateFormat = item.dateFormat;
        elementOptions.timeFormat = item.timeFormat;
        elementOptions.showTimeSelect = item.showTimeSelect;
        elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
        elementOptions.overdueNotification = false;
      }
      if (item.key === 'Download') {
        elementOptions._href = item._href;
        elementOptions.file_path = item.file_path;
      }
      if (item.key === 'Range') {
        elementOptions.step = item.step;
        elementOptions.default_value = item.default_value;
        elementOptions.min_value = item.min_value;
        elementOptions.max_value = item.max_value;
        elementOptions.min_label = item.min_label;
        elementOptions.max_label = item.max_label;
      }
      if (item.defaultValue) {
        elementOptions.defaultValue = item.defaultValue;
      }
      if (item.field_name) {
        elementOptions.field_name = item.field_name + _UUID.default.uuid();
      }
      if (item.label) {
        elementOptions.label = item.label;
      }
      if (item.options) {
        if (item.options.length > 0) {
          elementOptions.options = item.options;
        } else {
          elementOptions.options = Toolbar._defaultItemOptions(elementOptions.element);
        }
      }
      if (item.key === 'Table') {
        var _item$rowLabels;
        if (item.columns.length > 0) {
          elementOptions.columns = item.columns;
        } else {
          elementOptions.columns = Toolbar._defaultItemColumns();
        }
        if (((_item$rowLabels = item.rowLabels) === null || _item$rowLabels === void 0 ? void 0 : _item$rowLabels.length) > 0) {
          elementOptions.rowLabels = item.rowLabels;
        } else {
          elementOptions.rowLabels = [];
        }
        elementOptions.rows = item.rows || 3;
      }
      if (item.key === 'Section') {
        elementOptions.header = 'Placeholder Text';
      }
      if (item.key === 'Signature2') {
        elementOptions.position = 'Placeholder Text';
        elementOptions.specificRole = 'specific';
      }
      if (item.key === 'DataSource') {
        elementOptions.sourceType = item.sourceType;
        elementOptions.formSource = item.formSource;
        elementOptions.formField = item.formField || {};
      }
<<<<<<< HEAD
      if (item.key === 'FileUpload') {}
=======
      if (item.formularKey !== undefined) {
        elementOptions.formularKey = item.formularKey;
      }
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
      if (item.key === 'FormulaInput') {
        elementOptions.formula = item.formula;
      }
      return elementOptions;
    }
  }, {
    key: "_onClick",
    value: function _onClick(item) {
      // ElementActions.createElement(this.create(item));
<<<<<<< HEAD
      _store.default.dispatch('create', this.create(item));
=======
      _store["default"].dispatch('create', this.create(item));
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "react-form-builder-toolbar",
        style: {
          marginTop: 0
        }
      }, /*#__PURE__*/_react.default.createElement("h4", null, "Toolbox"), /*#__PURE__*/_react.default.createElement("ul", null, this.state.items.map(function (item) {
        return /*#__PURE__*/_react.default.createElement(_toolbarDraggableItem.default, {
          data: item,
          key: item.key,
          onClick: _this2._onClick.bind(_this2, item),
          onCreate: _this2.create
        });
      })));
    }
  }], [{
    key: "_defaultItemOptions",
    value: function _defaultItemOptions(element) {
      switch (element) {
        case 'Dropdown':
          return [{
            value: '1',
            text: 'Place holder option 1',
<<<<<<< HEAD
            key: "dropdown_option_".concat(_UUID.default.uuid())
          }, {
            value: '2',
            text: 'Place holder option 2',
            key: "dropdown_option_".concat(_UUID.default.uuid())
          }, {
            value: '3',
            text: 'Place holder option 3',
            key: "dropdown_option_".concat(_UUID.default.uuid())
=======
            key: "dropdown_option_".concat(_UUID["default"].uuid())
          }, {
            value: '2',
            text: 'Place holder option 2',
            key: "dropdown_option_".concat(_UUID["default"].uuid())
          }, {
            value: '3',
            text: 'Place holder option 3',
            key: "dropdown_option_".concat(_UUID["default"].uuid())
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
          }];
        case 'Tags':
          return [{
            value: '1',
            text: 'Place holder tag 1',
<<<<<<< HEAD
            key: "tags_option_".concat(_UUID.default.uuid())
          }, {
            value: '2',
            text: 'Place holder tag 2',
            key: "tags_option_".concat(_UUID.default.uuid())
          }, {
            value: '3',
            text: 'Place holder tag 3',
            key: "tags_option_".concat(_UUID.default.uuid())
=======
            key: "tags_option_".concat(_UUID["default"].uuid())
          }, {
            value: '2',
            text: 'Place holder tag 2',
            key: "tags_option_".concat(_UUID["default"].uuid())
          }, {
            value: '3',
            text: 'Place holder tag 3',
            key: "tags_option_".concat(_UUID["default"].uuid())
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
          }];
        case 'Checkboxes':
          return [{
            value: '1',
            text: 'Place holder option 1',
<<<<<<< HEAD
            key: "checkboxes_option_".concat(_UUID.default.uuid())
          }, {
            value: '2',
            text: 'Place holder option 2',
            key: "checkboxes_option_".concat(_UUID.default.uuid())
          }, {
            value: '3',
            text: 'Place holder option 3',
            key: "checkboxes_option_".concat(_UUID.default.uuid())
=======
            key: "checkboxes_option_".concat(_UUID["default"].uuid())
          }, {
            value: '2',
            text: 'Place holder option 2',
            key: "checkboxes_option_".concat(_UUID["default"].uuid())
          }, {
            value: '3',
            text: 'Place holder option 3',
            key: "checkboxes_option_".concat(_UUID["default"].uuid())
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
          }];
        case 'RadioButtons':
          return [{
            value: '1',
            text: 'Place holder option 1',
<<<<<<< HEAD
            key: "radiobuttons_option_".concat(_UUID.default.uuid())
          }, {
            value: '2',
            text: 'Place holder option 2',
            key: "radiobuttons_option_".concat(_UUID.default.uuid())
          }, {
            value: '3',
            text: 'Place holder option 3',
            key: "radiobuttons_option_".concat(_UUID.default.uuid())
=======
            key: "radiobuttons_option_".concat(_UUID["default"].uuid())
          }, {
            value: '2',
            text: 'Place holder option 2',
            key: "radiobuttons_option_".concat(_UUID["default"].uuid())
          }, {
            value: '3',
            text: 'Place holder option 3',
            key: "radiobuttons_option_".concat(_UUID["default"].uuid())
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
          }];
        default:
          return [];
      }
    }
  }, {
    key: "_defaultItemColumns",
    value: function _defaultItemColumns() {
      return [{
        text: 'Column1',
<<<<<<< HEAD
        key: "table_column_".concat(_UUID.default.uuid()),
        width: 1
      }, {
        text: 'Column2',
        key: "table_column_".concat(_UUID.default.uuid()),
        width: 1
      }, {
        text: 'Column3',
        key: "table_column_".concat(_UUID.default.uuid()),
=======
        key: "table_column_".concat(_UUID["default"].uuid()),
        width: 1
      }, {
        text: 'Column2',
        key: "table_column_".concat(_UUID["default"].uuid()),
        width: 1
      }, {
        text: 'Column3',
        key: "table_column_".concat(_UUID["default"].uuid()),
>>>>>>> 41f3fbd (Refactor code style for consistency and improve readability across multiple files)
        width: 1
      }];
    }
  }]);
  return Toolbar;
}(_react.default.Component);
exports.default = Toolbar;