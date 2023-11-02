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
exports.ReactFormBuilder = exports.FormProvider = exports.FORM_ACTION = void 0;
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
exports.useFormContext = exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _preview = _interopRequireDefault(require("./preview"));
var _toolbar = _interopRequireDefault(require("./toolbar"));
var _form = _interopRequireDefault(require("./form"));
var _store = _interopRequireDefault(require("./stores/store"));
var _registry = _interopRequireDefault(require("./stores/registry"));
/**
 * <ReactFormBuilder />
 */

// import React, { createContext, useReducer, useContext } from "react";

// const FormContext = createContext({
//   formValues: {},
// });

var FORM_ACTION = {
  UPDATE_VALUE: "UPDATE_VALUE"
};

// const formReducer = (state, action) => {
//   switch (action.type) {
//     case FORM_ACTION.UPDATE_VALUE:
//       return {
//         ...state,
//         [action.name]: action.value,
//       };
//     default:
//       return state;
//   }
// };

// export const FormProvider = ({ children }) => {
//   const [formValues, dispatch] = useReducer(formReducer, {});

//   return (
//     <FormContext.Provider value={{ formValues, dispatch }}>
//       {children}
//     </FormContext.Provider>
//   );
// };

// export const useFormContext = () => useContext(FormContext);
exports.FORM_ACTION = FORM_ACTION;
var FormProvider = function FormProvider(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", null, children);
};
exports.FormProvider = FormProvider;
var useFormContext = function useFormContext() {};
exports.useFormContext = useFormContext;
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
  }, /*#__PURE__*/_react["default"].createElement(FormProvider, null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
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