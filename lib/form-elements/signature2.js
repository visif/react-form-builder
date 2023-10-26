"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
var _formContext = require("../context/form-context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// import React from "react";
// import ComponentHeader from "./component-header";

// class Signature2 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.inputField = React.createRef();

//     this.state = {
//       defaultValue: props.defaultValue && props.defaultValue.isSigned,
//       isSigned: props.defaultValue && props.defaultValue.isSigned,
//       signedPerson: props.defaultValue && props.defaultValue.signedPerson,
//       signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
//       isError: false,
//     };
//   }

//   static getDerivedStateFromProps = (props, state) => {
//     console.log("Signature getDerivedStateFromProps");
//     if (
//       props.defaultValue &&
//       props.defaultValue.isSigned !== state.defaultValue
//     ) {
//       return {
//         defaultValue: props.defaultValue && props.defaultValue.isSigned,
//         isSigned: props.defaultValue && props.defaultValue.isSigned,
//         isError: false,
//         signedPerson: props.defaultValue.signedPerson,
//         signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
//       };
//     }

//     return state;
//   };

//   clickToSign = () => {
//     if (typeof this.props.getActiveUserProperties !== "function") {
//       return;
//     }

//     const userProperties = this.props.getActiveUserProperties();
//     let roleLists = (userProperties && userProperties.role) || [];
//     roleLists = roleLists.concat([
//       (userProperties && userProperties.name) || "",
//     ]);

//     const position = `${this.props.data.position}`.toLocaleLowerCase().trim();

//     if (
//       this.props.data.specificRole === "specific" &&
//       roleLists.find(
//         (item) => `${item}`.toLocaleLowerCase().trim() === position
//       )
//     ) {
//       this.setState((current) => ({
//         ...current,
//         isSigned: !current.isSigned,
//         signedPerson: !current.isSigned ? userProperties.name : "",
//         signedPersonId: !current.isSigned ? userProperties.userId : "",
//       }));
//     } else if (this.props.data.specificRole === "notSpecific") {
//       this.setState((current) => ({
//         ...current,
//         isSigned: !current.isSigned,
//         signedPerson: !current.isSigned ? userProperties.name : "",
//         signedPersonId: !current.isSigned ? userProperties.userId : "",
//       }));
//     } else {
//       if (!this.state.isError) {
//         this.setState({
//           isError: true,
//         });
//         setTimeout(() => {
//           this.setState({
//             isError: false,
//           });
//         }, 5000);
//       }
//       console.log("role annd name does not match");
//     }
//   };

//   render() {
//     const userProperties =
//       this.props.getActiveUserProperties &&
//       this.props.getActiveUserProperties();

//     const savedEditor = this.props.editor;
//     let isSameEditor = true;
//     if (savedEditor && savedEditor.userId && !!userProperties) {
//       isSameEditor = userProperties.userId === savedEditor.userId;
//     }

//     const hasRequiredLabel =
//       this.props.data.hasOwnProperty("required") &&
//       this.props.data.required === true &&
//       !this.props.read_only;

//     return (
//       <div
//         ref={this.tableRef}
//         className={`SortableItem rfb-item${this.props.data.pageBreakBefore ? " alwaysbreak" : ""
//           }`}
//       >
//         <ComponentHeader {...this.props} />
//         <div
//           className="form-group"
//           onClick={() => {
//             if (isSameEditor) {
//               this.clickToSign();
//             }
//           }}
//           style={{ cursor: "pointer" }}
//         >
//           {hasRequiredLabel && (
//             <span
//               className="label-required badge badge-danger"
//               style={{
//                 marginLeft: "60%",
//               }}
//             >
//               Required
//             </span>
//           )}
//           <h5 style={{ textAlign: "center" }}>
//             {this.state.isSigned ? "Already signed" : "(Click to sign)"}
//           </h5>
//           <div
//             style={{
//               textAlign: "center",
//               marginTop: 8,
//               marginBottom: 8,
//               color: this.state.isError ? "red" : "black",
//             }}
//           >
//             {this.state.isError
//               ? "You have no permission to sign"
//               : "__________________"}
//           </div>
//           <h6 style={{ textAlign: "center", minHeight: 20 }}>
//             {this.state.isSigned && `(${this.state.signedPerson})`}
//           </h6>
//           <h6 style={{ textAlign: "center" }}>
//             {this.props.data.position || "Placeholder Text"}
//           </h6>
//         </div>
//       </div>
//     );
//   }
// }

// export default Signature2;

function Signature2(props) {
  var _props$defaultValue, _props$defaultValue2;
  var _useFormContext = (0, _formContext.useFormContext)(),
    dispatch = _useFormContext.dispatch;
  var _useState = (0, _react.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isError = _useState2[0],
    setIsError = _useState2[1];
  var _useState3 = (0, _react.useState)((_props$defaultValue = props.defaultValue) === null || _props$defaultValue === void 0 ? void 0 : _props$defaultValue.isSigned),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    isSigned = _useState4[0],
    setIsSigned = _useState4[1];
  var _useState5 = (0, _react.useState)((_props$defaultValue2 = props.defaultValue) === null || _props$defaultValue2 === void 0 ? void 0 : _props$defaultValue2.signedPerson),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    signedPerson = _useState6[0],
    setSignedPerson = _useState6[1];
  var clickToSign = function clickToSign() {
    if (typeof props.getActiveUserProperties !== "function") {
      return;
    }
    var userProperties = props.getActiveUserProperties();
    var roleLists = userProperties && userProperties.role || [];
    roleLists = roleLists.concat([userProperties && userProperties.name || ""]);
    var position = "".concat(props.data.position).toLocaleLowerCase().trim();
    var prevIsSigned = isSigned;
    if (props.data.specificRole === "specific" && roleLists.find(function (item) {
      return "".concat(item).toLocaleLowerCase().trim() === position;
    })) {
      var newVal = {
        isSigned: !prevIsSigned,
        signedPerson: !prevIsSigned ? userProperties.name : "",
        signedPersonId: !prevIsSigned ? userProperties.userId : ""
      };
      setIsSigned(newVal.isSigned);
      setSignedPerson(newVal.signedPerson);
      dispatch({
        type: _formContext.FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: newVal
      });
    } else if (props.data.specificRole === "notSpecific") {
      var _newVal = {
        isSigned: !prevIsSigned,
        signedPerson: !prevIsSigned ? userProperties.name : "",
        signedPersonId: !prevIsSigned ? userProperties.userId : ""
      };
      setIsSigned(_newVal.isSigned);
      setSignedPerson(_newVal.signedPerson);
      dispatch({
        type: _formContext.FORM_ACTION.UPDATE_VALUE,
        name: props.data.field_name,
        value: _newVal
      });
    } else {
      if (!isError) {
        setIsError(true);
        setTimeout(function () {
          setIsError(false);
        }, 5000);
      }
      console.log("role annd name does not match");
    }
  };
  var userProperties = props.getActiveUserProperties && props.getActiveUserProperties();
  var savedEditor = props.editor;
  var isSameEditor = true;
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId;
  }
  var hasRequiredLabel = props.data.hasOwnProperty("required") && props.data.required === true && !props.read_only;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "SortableItem rfb-item".concat(props.data.pageBreakBefore ? " alwaysbreak" : "")
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("div", {
    className: "form-group",
    onClick: function onClick() {
      if (isSameEditor) {
        clickToSign();
      }
    },
    style: {
      cursor: "pointer"
    }
  }, hasRequiredLabel && /*#__PURE__*/_react["default"].createElement("span", {
    className: "label-required badge badge-danger",
    style: {
      marginLeft: "60%"
    }
  }, "Required"), /*#__PURE__*/_react["default"].createElement("h5", {
    style: {
      textAlign: "center"
    }
  }, isSigned ? "Already signed" : "(Click to sign)"), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 8,
      marginBottom: 8,
      color: isError ? "red" : "black"
    }
  }, isError ? "You have no permission to sign" : "__________________"), /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      textAlign: "center",
      minHeight: 20
    }
  }, isSigned && "(".concat(signedPerson, ")")), /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      textAlign: "center"
    }
  }, props.data.position || "Placeholder Text")));
}
var _default = Signature2;
exports["default"] = _default;