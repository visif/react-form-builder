"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _toolbarDraggableItem = _interopRequireDefault(require("./toolbar-draggable-item"));

var _UUID = _interopRequireDefault(require("./UUID"));

var _store = _interopRequireDefault(require("./stores/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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

var Toolbar = /*#__PURE__*/function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  var _super = _createSuper(Toolbar);

  function Toolbar(props) {
    var _this;

    _classCallCheck(this, Toolbar);

    _this = _super.call(this, props);
    var items = buildItems(props.items, _this._defaultItems());
    _this.state = {
      items: items
    };

    _store["default"].subscribe(function (state) {
      return _this.setState({
        store: state
      });
    });

    _this.create = _this.create.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Toolbar, [{
    key: "_defaultItems",
    value: function _defaultItems() {
      return [{
        key: 'Header',
        name: 'Header Text',
        icon: 'fas fa-heading',
        "static": true,
        content: 'Placeholder Text...'
      }, {
        key: 'Label',
        name: 'Label',
        "static": true,
        icon: 'fas fa-font',
        content: 'Placeholder Text...'
      }, {
        key: 'Paragraph',
        name: 'Paragraph',
        "static": true,
        icon: 'fas fa-paragraph',
        content: 'Placeholder Text...'
      }, {
        key: 'LineBreak',
        name: 'Line Break',
        "static": true,
        icon: 'fas fa-arrows-alt-h'
      }, {
        key: 'Dropdown',
        canHaveAnswer: true,
        name: 'Dropdown',
        icon: 'far fa-caret-square-down',
        label: 'Placeholder Label',
        field_name: 'dropdown_',
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
        key: 'Checkboxes',
        canHaveAnswer: true,
        name: 'Checkboxes',
        icon: 'far fa-check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        options: []
      }, {
        key: 'RadioButtons',
        canHaveAnswer: true,
        name: 'Multiple Choice',
        icon: 'far fa-dot-circle',
        label: 'Placeholder Label',
        field_name: 'radiobuttons_',
        options: []
      }, {
        key: 'TextInput',
        canHaveAnswer: true,
        name: 'Text Input',
        label: 'Placeholder Label',
        icon: 'fas fa-font',
        field_name: 'text_input_'
      }, {
        key: 'NumberInput',
        canHaveAnswer: true,
        name: 'Number Input',
        label: 'Placeholder Label',
        icon: 'fas fa-plus',
        field_name: 'number_input_'
      }, {
        key: 'TextArea',
        canHaveAnswer: true,
        name: 'Multi-line Input',
        label: 'Placeholder Label',
        icon: 'fas fa-text-height',
        field_name: 'text_area_'
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
        dateFormat: 'MM/dd/yyyy',
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
        key: 'HyperLink',
        name: 'Web site',
        icon: 'fas fa-link',
        "static": true,
        content: 'Placeholder Web site link ...',
        href: 'http://www.example.com'
      }, {
        key: 'Download',
        name: 'File Attachment',
        icon: 'fas fa-file',
        "static": true,
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
      }];
    }
  }, {
    key: "create",
    value: function create(item) {
      var elementOptions = {
        id: _UUID["default"].uuid(),
        element: item.element || item.key,
        text: item.name,
        "static": item["static"],
        required: false,
        showDescription: item.showDescription
      };

      if (this.props.showDescription === true && !item["static"]) {
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

      if (item["static"]) {
        elementOptions.bold = false;
        elementOptions.italic = false;
      }

      if (item.canHaveAnswer) {
        elementOptions.canHaveAnswer = item.canHaveAnswer;
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
      }

      if (item.key === 'DatePicker') {
        elementOptions.dateFormat = item.dateFormat;
        elementOptions.timeFormat = item.timeFormat;
        elementOptions.showTimeSelect = item.showTimeSelect;
        elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
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
        elementOptions.field_name = item.field_name + _UUID["default"].uuid();
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

      return elementOptions;
    }
  }, {
    key: "_onClick",
    value: function _onClick(item) {
      // ElementActions.createElement(this.create(item));
      _store["default"].dispatch('create', this.create(item));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-md-3 react-form-builder-toolbar float-right"
      }, /*#__PURE__*/_react["default"].createElement("h4", null, "Toolbox"), /*#__PURE__*/_react["default"].createElement("ul", null, this.state.items.map(function (item) {
        return /*#__PURE__*/_react["default"].createElement(_toolbarDraggableItem["default"], {
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
            value: 'place_holder_option_1',
            text: 'Place holder option 1',
            key: "dropdown_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_option_2',
            text: 'Place holder option 2',
            key: "dropdown_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_option_3',
            text: 'Place holder option 3',
            key: "dropdown_option_".concat(_UUID["default"].uuid())
          }];

        case 'Tags':
          return [{
            value: 'place_holder_tag_1',
            text: 'Place holder tag 1',
            key: "tags_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_tag_2',
            text: 'Place holder tag 2',
            key: "tags_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_tag_3',
            text: 'Place holder tag 3',
            key: "tags_option_".concat(_UUID["default"].uuid())
          }];

        case 'Checkboxes':
          return [{
            value: 'place_holder_option_1',
            text: 'Place holder option 1',
            key: "checkboxes_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_option_2',
            text: 'Place holder option 2',
            key: "checkboxes_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_option_3',
            text: 'Place holder option 3',
            key: "checkboxes_option_".concat(_UUID["default"].uuid())
          }];

        case 'RadioButtons':
          return [{
            value: 'place_holder_option_1',
            text: 'Place holder option 1',
            key: "radiobuttons_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_option_2',
            text: 'Place holder option 2',
            key: "radiobuttons_option_".concat(_UUID["default"].uuid())
          }, {
            value: 'place_holder_option_3',
            text: 'Place holder option 3',
            key: "radiobuttons_option_".concat(_UUID["default"].uuid())
          }];

        default:
          return [];
      }
    }
  }]);

  return Toolbar;
}(_react["default"].Component);

exports["default"] = Toolbar;