"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ElementStore", {
  enumerable: true,
  get: function get() {
    return _store["default"];
  }
});
exports.ReactFormBuilder = void 0;
Object.defineProperty(exports, "ReactFormGenerator", {
  enumerable: true,
  get: function get() {
    return _form["default"];
  }
});
Object.defineProperty(exports, "Registry", {
  enumerable: true,
  get: function get() {
    return _registry["default"];
  }
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _form = _interopRequireDefault(require("./form"));
var _preview = _interopRequireDefault(require("./preview"));
var _registry = _interopRequireDefault(require("./stores/registry"));
var _store = _interopRequireDefault(require("./stores/store"));
var _toolbar = _interopRequireDefault(require("./toolbar"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ReactFormBuilder = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ReactFormBuilder, _React$Component);
  var _super = _createSuper(ReactFormBuilder);
  function ReactFormBuilder(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ReactFormBuilder);
    _this = _super.call(this, props);
    _this.state = {
      editMode: false,
      editElement: null
    };
    _this.editModeOn = _this.editModeOn.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }
  (0, _createClass2["default"])(ReactFormBuilder, [{
    key: "editModeOn",
    value: function editModeOn(data, e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.editMode) {
        this.setState({
          editMode: !this.state.editMode,
          editElement: null
        });
      } else {
        this.setState({
          editMode: !this.state.editMode,
          editElement: data
        });
      }
    }
  }, {
    key: "manualEditModeOff",
    value: function manualEditModeOff() {
      if (this.state.editMode) {
        this.setState({
          editMode: false,
          editElement: null
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var toolbarProps = {
        showDescription: this.props.show_description
      };
      if (this.props.toolbarItems) {
        toolbarProps.items = this.props.toolbarItems;
      }
      return /*#__PURE__*/_react["default"].createElement(_reactDnd.DndProvider, {
        backend: _reactDndHtml5Backend.HTML5Backend
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "react-form-builder clearfix",
        style: {
          height: '100%'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          flex: 1,
          overflowY: 'auto',
          height: '100%',
          scrollbarWidth: 'none'
        }
      }, /*#__PURE__*/_react["default"].createElement(_preview["default"], {
        files: this.props.files,
        manualEditModeOff: this.manualEditModeOff.bind(this),
        showCorrectColumn: this.props.showCorrectColumn,
        parent: this,
        data: this.props.data,
        url: this.props.url,
        saveUrl: this.props.saveUrl,
        onLoad: this.props.onLoad,
        onPost: this.props.onPost,
        editModeOn: this.editModeOn,
        editMode: this.state.editMode,
        variables: this.props.variables,
        registry: _registry["default"],
        editElement: this.state.editElement,
        renderEditForm: this.props.renderEditForm,
        onChange: this.props.onChange,
        uploadUrl: this.props.uploadUrl,
        onImageUpload: this.props.onImageUpload,
        getDataSource: this.props.getDataSource,
        getFormSource: this.props.getFormSource,
        getFormContent: this.props.getFormContent,
        getActiveUserProperties: this.props.getActiveUserProperties,
        onUploadFile: this.props.onUploadFile,
        onUploadImage: this.props.onUploadImage,
        onDownloadFile: this.props.onDownloadFile
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: '250px',
          top: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          position: 'sticky',
          paddingLeft: '15px',
          height: '100%',
          scrollbarWidth: 'none'
        }
      }, /*#__PURE__*/_react["default"].createElement(_toolbar["default"], (0, _extends2["default"])({}, toolbarProps, {
        customItems: this.props.customToolbarItems
      }))))));
    }
  }]);
  return ReactFormBuilder;
}(_react["default"].Component);
exports.ReactFormBuilder = ReactFormBuilder;
var FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = _form["default"];
FormBuilders.ElementStore = _store["default"];
FormBuilders.Registry = _registry["default"];
var _default = FormBuilders;
exports["default"] = _default;