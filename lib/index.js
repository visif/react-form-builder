"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ElementStore", {
  enumerable: true,
  get: function () {
    return _store.default;
  }
});
exports.ReactFormBuilder = void 0;
Object.defineProperty(exports, "ReactFormGenerator", {
  enumerable: true,
  get: function () {
    return _form.default;
  }
});
Object.defineProperty(exports, "Registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _form = _interopRequireDefault(require("./form"));
var _preview = _interopRequireDefault(require("./preview"));
var _registry = _interopRequireDefault(require("./stores/registry"));
var _store = _interopRequireDefault(require("./stores/store"));
var _toolbar = _interopRequireDefault(require("./toolbar"));
/**
 * <ReactFormBuilder />
 */

class ReactFormBuilder extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editElement: null
    };
    this.editModeOn = this.editModeOn.bind(this);
  }
  editModeOn(data, e) {
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
  manualEditModeOff() {
    if (this.state.editMode) {
      this.setState({
        editMode: false,
        editElement: null
      });
    }
  }
  render() {
    const toolbarProps = {
      showDescription: this.props.show_description
    };
    if (this.props.toolbarItems) {
      toolbarProps.items = this.props.toolbarItems;
    }
    return /*#__PURE__*/_react.default.createElement(_reactDnd.DndProvider, {
      backend: _reactDndHtml5Backend.HTML5Backend
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "react-form-builder clearfix",
      style: {
        height: '100%'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        height: '100%',
        scrollbarWidth: 'none'
      }
    }, /*#__PURE__*/_react.default.createElement(_preview.default, {
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
      registry: _registry.default,
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
    })), /*#__PURE__*/_react.default.createElement("div", {
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
    }, /*#__PURE__*/_react.default.createElement(_toolbar.default, (0, _extends2.default)({}, toolbarProps, {
      customItems: this.props.customToolbarItems
    }))))));
  }
}
exports.ReactFormBuilder = ReactFormBuilder;
const FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = _form.default;
FormBuilders.ElementStore = _store.default;
FormBuilders.Registry = _registry.default;
var _default = exports.default = FormBuilders;