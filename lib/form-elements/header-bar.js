"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _grip = _interopRequireDefault(require("../multi-column/grip"));
/**
 * <HeaderBar />
 */

// function HeaderBar(props) {
//   const { data, parent, index, editModeOn, onDestroy, setAsChild } = props;

//   return (
//     <div className="toolbar-header">
//       <span className="badge badge-secondary">{data.text}</span>
//       <div className="toolbar-header-buttons">
//         {data.element !== "LineBreak" && (
//           <div
//             className="btn is-isolated"
//             onClick={editModeOn.bind(parent, data)}
//           >
//             <i className="is-isolated fas fa-edit"></i>
//           </div>
//         )}
//         <div className="btn is-isolated" onClick={onDestroy.bind(null, data)}>
//           <i className="is-isolated fas fa-trash"></i>
//         </div>
//         {!data.isContainer && (
//           <Grip
//             data={data}
//             index={index}
//             onDestroy={onDestroy}
//             setAsChild={setAsChild}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

function HeaderBar(props) {
  var data = props.data,
    parent = props.parent,
    index = props.index,
    editModeOn = props.editModeOn,
    onDestroy = props.onDestroy,
    setAsChild = props.setAsChild;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "toolbar-header"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "badge badge-secondary"
  }, data.text), /*#__PURE__*/_react["default"].createElement("div", {
    className: "toolbar-header-buttons"
  }, data.element !== "LineBreak" && /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    onClick: editModeOn.bind(parent, data)
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-edit"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "btn is-isolated",
    onClick: onDestroy.bind(null, data)
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "is-isolated fas fa-trash"
  })), !data.isContainer && /*#__PURE__*/_react["default"].createElement(_grip["default"], {
    data: data,
    index: index,
    onDestroy: onDestroy,
    setAsChild: setAsChild
  })));
}
var _default = HeaderBar;
exports["default"] = _default;