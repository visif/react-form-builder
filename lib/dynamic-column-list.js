"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _formElementsEdit = _interopRequireDefault(require("./form-elements-edit"));
var _UUID = _interopRequireDefault(require("./UUID"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } /**
 * <DynamicColumnList />
 */ // eslint-disable-next-line import/no-cycle
var DynamicColumnList = function DynamicColumnList(_ref) {
  var propsElement = _ref.element,
    _ref$preview = _ref.preview,
    preview = _ref$preview === void 0 ? null : _ref$preview,
    updateElement = _ref.updateElement;
  var _useState = (0, _react.useState)(propsElement),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    element = _useState2[0],
    setElement = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    showEditModal = _useState4[0],
    setShowEditModal = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    editingColumn = _useState6[0],
    setEditingColumn = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    dirty = _useState8[0],
    setDirty = _useState8[1];
  var handleEditModalClose = (0, _react.useCallback)(function () {
    setShowEditModal(false);
    setEditingColumn(null);
  }, []);
  var _setValue = function _setValue(text) {
    return "".concat(text).replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };
  var editColumn = (0, _react.useCallback)(function (index, key, e) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      if (key === 'isSync') {
        newElement.columns[index][key] = e.target.checked;
      } else {
        var val = newElement.columns[index].value !== _setValue(newElement.columns[index][key]) ? newElement.columns[index].value : _setValue(e.target.value);
        newElement.columns[index][key] = e.target.value;
        newElement.columns[index].value = val;
      }
      setDirty(true);
      return newElement;
    });
  }, [_setValue]);
  var updateColumn = (0, _react.useCallback)(function () {
    if (dirty) {
      if (preview) {
        updateElement.call(preview, element);
      } else {
        updateElement(element);
      }
      setDirty(false);
    }
  }, [dirty, element, preview, updateElement]);
  var addColumn = (0, _react.useCallback)(function (index) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      newElement.columns.splice(index + 1, 0, {
        value: '',
        text: '',
        key: _UUID["default"].uuid(),
        width: 1,
        isSync: true
      });
      return newElement;
    });
    setTimeout(function () {
      if (preview) {
        updateElement.call(preview, element);
      } else {
        updateElement(element);
      }
    }, 0);
  }, [element, preview, updateElement]);
  var removeColumn = (0, _react.useCallback)(function (index) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      newElement.columns.splice(index, 1);
      return newElement;
    });
    setTimeout(function () {
      if (preview) {
        updateElement.call(preview, element);
      } else {
        updateElement(element);
      }
    }, 0);
  }, [element, preview, updateElement]);
  var editColumnSettings = (0, _react.useCallback)(function (column) {
    setShowEditModal(true);
    setEditingColumn(column);
  }, []);
  var handleUpdateElement = (0, _react.useCallback)(function (updatedElement) {
    var columns = (0, _toConsumableArray2["default"])(element.columns);
    var index = columns.findIndex(function (col) {
      return col.key === updatedElement.key;
    });
    if (index !== -1) {
      columns[index] = updatedElement;
      setElement(function (prevElement) {
        return _objectSpread(_objectSpread({}, prevElement), {}, {
          columns: columns
        });
      });
      setDirty(true);
      setTimeout(function () {
        updateColumn();
        handleEditModalClose();
      }, 0);
    }
  }, [element.columns, updateColumn, handleEditModalClose]);
  if (dirty) {
    element.dirty = true;
  }
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "dynamic-option-list"
  }, /*#__PURE__*/_react["default"].createElement("ul", null, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-12"
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Columns")))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "clearfix"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-6"
  }, "Header Text"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-2"
  }, "Width"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-1 text-center"
  }, "Sync"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-3"
  }))), element.columns.map(function (option, index) {
    var editKey = "edit_".concat(option.key);
    return /*#__PURE__*/_react["default"].createElement("li", {
      className: "clearfix",
      key: editKey
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-6"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      tabIndex: index + 1,
      className: "form-control",
      style: {
        width: '100%'
      },
      type: "text",
      name: "text_".concat(index),
      placeholder: "Option text",
      value: option.text,
      onBlur: updateColumn,
      onChange: function onChange(e) {
        return editColumn(index, 'text', e);
      }
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-2"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      tabIndex: index + 1,
      className: "form-control",
      style: {
        width: '100%'
      },
      type: "text",
      name: "width_".concat(index),
      placeholder: "Width",
      value: option.width,
      onBlur: updateColumn,
      onChange: function onChange(e) {
        return editColumn(index, 'width', e);
      }
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-1"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "d-flex justify-content-center align-items-center",
      style: {
        height: '38px',
        minWidth: '56px'
      }
    }, /*#__PURE__*/_react["default"].createElement("input", {
      className: "form-check-input",
      type: "checkbox",
      id: "sync_".concat(index),
      checked: option.isSync || false,
      onChange: function onChange(e) {
        return editColumn(index, 'isSync', e);
      },
      onBlur: updateColumn
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-3"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dynamic-options-actions-buttons"
    }, /*#__PURE__*/_react["default"].createElement("button", {
      type: "button",
      onClick: function onClick() {
        return addColumn(index);
      },
      className: "btn btn-success"
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-plus-circle"
    })), index > 0 && /*#__PURE__*/_react["default"].createElement("button", {
      type: "button",
      onClick: function onClick() {
        return removeColumn(index);
      },
      className: "btn btn-danger"
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-minus-circle"
    }))))));
  }))), showEditModal && editingColumn && /*#__PURE__*/_react["default"].createElement("div", {
    className: "modal show d-block"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "modal-dialog modal-lg"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/_react["default"].createElement(_formElementsEdit["default"], {
    element: editingColumn,
    updateElement: handleUpdateElement,
    manualEditModeOff: handleEditModalClose,
    preview: preview
  })))));
};
DynamicColumnList.propTypes = {
  element: _propTypes["default"].shape({
    columns: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      key: _propTypes["default"].string,
      text: _propTypes["default"].string,
      value: _propTypes["default"].string,
      width: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
      type: _propTypes["default"].string,
      isSync: _propTypes["default"].bool
    })).isRequired
  }).isRequired,
  preview: _propTypes["default"].shape({}),
  updateElement: _propTypes["default"].func.isRequired
};
var _default = exports["default"] = DynamicColumnList;