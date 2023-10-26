"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _componentHeader = _interopRequireDefault(require("./component-header"));
// import React from 'react';
// import ComponentHeader from './component-header';

// export default class Section extends React.Component {
//   render() {
//     let baseClasses = 'SortableItem rfb-item';
//     if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

//     return (
//       <div className={baseClasses}>
//         <ComponentHeader {...this.props} />
//         <h6>{this.props.data.header}</h6>
//         <hr />
//       </div>
//     );
//   }
// }

var Section = function Section(props) {
  var baseClasses = "SortableItem rfb-item";
  if (props.data.pageBreakBefore) {
    baseClasses += " alwaysbreak";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: baseClasses
  }, /*#__PURE__*/_react["default"].createElement(_componentHeader["default"], props), /*#__PURE__*/_react["default"].createElement("h6", null, props.data.header), /*#__PURE__*/_react["default"].createElement("hr", null));
};
var _default = Section;
exports["default"] = _default;