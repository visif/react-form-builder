"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DraftJs = void 0;
Object.defineProperty(exports, "Editor", {
  enumerable: true,
  get: function () {
    return _reactDraftWysiwyg.Editor;
  }
});
exports.generateUUID = exports.draftToHtml = exports.TextAreaAutosize = void 0;
var PkgTextAreaAutosize = _interopRequireWildcard(require("react-textarea-autosize"));
var _react = _interopRequireDefault(require("react"));
var _reactDraftWysiwyg = require("react-draft-wysiwyg");
var DraftJs = _interopRequireWildcard(require("draft-js"));
exports.DraftJs = DraftJs;
var draftToHtml = _interopRequireWildcard(require("draftjs-to-html"));
exports.draftToHtml = draftToHtml;
var _UUID = _interopRequireDefault(require("../UUID"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const generateUUID = () => _UUID.default.uuid();
exports.generateUUID = generateUUID;
const TextAreaAutosize = props => /*#__PURE__*/_react.default.createElement(PkgTextAreaAutosize, props);
exports.TextAreaAutosize = TextAreaAutosize;