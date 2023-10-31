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
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _preview = _interopRequireDefault(require("./preview"));
var _toolbar = _interopRequireDefault(require("./toolbar"));
var _form = _interopRequireDefault(require("./form"));
var _store = _interopRequireDefault(require("./stores/store"));
var _registry = _interopRequireDefault(require("./stores/registry"));
var _formContext = require("./context/form-context.js");
/**
 * <ReactFormBuilder />
 */

var ReactFormBuilder = function ReactFormBuilder(props) {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     editMode: false,
  //     editElement: null,
  //   };
  //   this.editModeOn = this.editModeOn.bind(this);
  // }

  // editModeOn(data, e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (this.state.editMode) {
  //     this.setState({ editMode: !this.state.editMode, editElement: null });
  //   } else {
  //     this.setState({ editMode: !this.state.editMode, editElement: data });
  //   }
  // }

  // manualEditModeOff() {
  //   if (this.state.editMode) {
  //     this.setState({
  //       editMode: false,
  //       editElement: null,
  //     });
  //   }
  // }

  // render() {
  var toolbarProps = {
    showDescription: props.show_description
  };
  if (props.toolbarItems) {
    toolbarProps.items = props.toolbarItems;
  }
  return /*#__PURE__*/_react["default"].createElement(_reactDnd.DndProvider, {
    backend: _reactDndHtml5Backend.HTML5Backend
  }, /*#__PURE__*/_react["default"].createElement(_formContext.FormProvider, null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "react-form-builder clearfix"
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_toolbar["default"], (0, _extends2["default"])({}, toolbarProps, {
    customItems: props.customToolbarItems
  })))))));
  // }
};
exports.ReactFormBuilder = ReactFormBuilder;
var FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = _form["default"];
FormBuilders.ElementStore = _store["default"];
FormBuilders.Registry = _registry["default"];
var _default = FormBuilders;
exports["default"] = _default;