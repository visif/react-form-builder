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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _form = _interopRequireDefault(require("./form"));
var _preview = _interopRequireDefault(require("./preview"));
var _registry = _interopRequireDefault(require("./stores/registry"));
var _store = _interopRequireDefault(require("./stores/store"));
var _toolbar = _interopRequireDefault(require("./toolbar"));
/**
 * ReactFormBuilder - Main form builder component with drag-and-drop interface
 *
 * @component
 * @description A complete form builder that allows users to create forms using a drag-and-drop
 * interface. Supports custom toolbar items, form data persistence, and real-time preview.
 *
 * @example
 * // Basic usage
 * import { ReactFormBuilder } from 'react-form-builder2';
 * import 'react-form-builder2/dist/app.css';
 *
 * function App() {
 *   return (
 *     <ReactFormBuilder
 *       url="/api/forms/initial.json"
 *       saveUrl="/api/forms/save"
 *     />
 *   );
 * }
 *
 * @example
 * // With custom toolbar items
 * const customItems = [
 *   { key: 'CustomElement', name: 'Custom', icon: 'fa fa-custom', static: false }
 * ];
 *
 * <ReactFormBuilder
 *   customToolbarItems={customItems}
 *   onSubmit={(data) => console.log('Form saved:', data)}
 * />
 *
 * @param {Object} props - Component props
 * @param {string} [props.url] - URL to load initial form data from (GET request)
 * @param {string} [props.saveUrl] - URL to save form data to (POST request)
 * @param {Function} [props.onLoad] - Callback when form data is loaded
 * @param {Function} [props.onPost] - Callback when form is saved/posted
 * @param {Function} [props.onChange] - Callback when form data changes
 * @param {Function} [props.onSubmit] - Callback on form submit (overrides POST)
 * @param {Array} [props.data] - Initial form data (if not loading from URL)
 * @param {Array} [props.toolbarItems] - Custom toolbar items to display
 * @param {Array} [props.customToolbarItems] - Additional custom toolbar items
 * @param {boolean} [props.show_description=true] - Show element descriptions in toolbar
 * @param {boolean} [props.editMode=false] - Start in edit mode
 * @param {Object} [props.editElement] - Element to edit initially
 * @param {string} [props.locale='en'] - Locale for internationalization
 * @param {Array} [props.files] - File upload configuration
 * @param {Function} [props.renderEditForm] - Custom render function for edit form
 *
 * @returns {React.ReactElement} The form builder interface with toolbar and preview
 *
 * @since 1.0.0 - Converted to functional component with React hooks
 * @requires react-dnd v16+ for drag-and-drop functionality
 */

var ReactFormBuilder = exports.ReactFormBuilder = function ReactFormBuilder(props) {
  var _React$useState = _react["default"].useState(false),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    editMode = _React$useState2[0],
    setEditMode = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(null),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    editElement = _React$useState4[0],
    setEditElement = _React$useState4[1];
  var editModeOn = _react["default"].useCallback(function (data, e) {
    e.preventDefault();
    e.stopPropagation();
    if (editMode) {
      setEditMode(false);
      setEditElement(null);
    } else {
      setEditMode(true);
      setEditElement(data);
    }
  }, [editMode]);
  var manualEditModeOff = _react["default"].useCallback(function () {
    if (editMode) {
      setEditMode(false);
      setEditElement(null);
    }
  }, [editMode]);
  var toolbarProps = {
    showDescription: props.show_description
  };
  if (props.toolbarItems) {
    toolbarProps.items = props.toolbarItems;
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
    files: props.files,
    manualEditModeOff: manualEditModeOff,
    showCorrectColumn: props.showCorrectColumn,
    parent: null,
    data: props.data,
    url: props.url,
    saveUrl: props.saveUrl,
    onLoad: props.onLoad,
    onPost: props.onPost,
    editModeOn: editModeOn,
    editMode: editMode,
    variables: props.variables,
    registry: _registry["default"],
    editElement: editElement,
    renderEditForm: props.renderEditForm,
    onChange: props.onChange,
    uploadUrl: props.uploadUrl,
    onImageUpload: props.onImageUpload,
    getDataSource: props.getDataSource,
    getFormSource: props.getFormSource,
    getFormContent: props.getFormContent,
    getActiveUserProperties: props.getActiveUserProperties,
    onUploadFile: props.onUploadFile,
    onUploadImage: props.onUploadImage,
    onDownloadFile: props.onDownloadFile
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
    customItems: props.customToolbarItems
  }))))));
};
ReactFormBuilder.propTypes = {
  show_description: _propTypes["default"].bool,
  toolbarItems: _propTypes["default"].array,
  customToolbarItems: _propTypes["default"].array,
  files: _propTypes["default"].array,
  showCorrectColumn: _propTypes["default"].bool,
  data: _propTypes["default"].array,
  url: _propTypes["default"].string,
  saveUrl: _propTypes["default"].string,
  onLoad: _propTypes["default"].func,
  onPost: _propTypes["default"].func,
  variables: _propTypes["default"].object,
  renderEditForm: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  uploadUrl: _propTypes["default"].string,
  onImageUpload: _propTypes["default"].func,
  getDataSource: _propTypes["default"].func,
  getFormSource: _propTypes["default"].func,
  getFormContent: _propTypes["default"].func,
  getActiveUserProperties: _propTypes["default"].func,
  onUploadFile: _propTypes["default"].func,
  onUploadImage: _propTypes["default"].func,
  onDownloadFile: _propTypes["default"].func
};
var FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = _form["default"];
FormBuilders.ElementStore = _store["default"];
FormBuilders.Registry = _registry["default"];
var _default = exports["default"] = FormBuilders;