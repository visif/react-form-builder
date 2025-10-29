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
var _UUID = _interopRequireDefault(require("./UUID"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } /**
 * <DynamicOptionList />
 */
var DynamicOptionList = function DynamicOptionList(_ref) {
  var propsElement = _ref.element,
    _ref$data = _ref.data,
    data = _ref$data === void 0 ? {} : _ref$data,
    _ref$updateElement = _ref.updateElement,
    updateElement = _ref$updateElement === void 0 ? function () {} : _ref$updateElement,
    _ref$preview = _ref.preview,
    preview = _ref$preview === void 0 ? null : _ref$preview,
    _ref$canHaveOptionVal = _ref.canHaveOptionValue,
    canHaveOptionValue = _ref$canHaveOptionVal === void 0 ? false : _ref$canHaveOptionVal,
    _ref$canHaveOptionCor = _ref.canHaveOptionCorrect,
    canHaveOptionCorrect = _ref$canHaveOptionCor === void 0 ? false : _ref$canHaveOptionCor,
    _ref$canHaveInfo = _ref.canHaveInfo,
    canHaveInfo = _ref$canHaveInfo === void 0 ? false : _ref$canHaveInfo;
  var _useState = (0, _react.useState)(propsElement),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    element = _useState2[0],
    setElement = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    dirty = _useState4[0],
    setDirty = _useState4[1];
  var previousTimeRef = (0, _react.useRef)(0);
  var timeoutIdRef = (0, _react.useRef)(null);

  // Cleanup on unmount
  (0, _react.useEffect)(function () {
    return function () {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  var setValue = function setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };
  var syncOptionsWithSameColumnElements = (0, _react.useCallback)(function (options) {
    var _preview$state, _parentElement$column;
    if (!preview || !propsElement.parentId) {
      return;
    }
    var parentElement;
    var getDataById = preview.getDataById || ((_preview$state = preview.state) === null || _preview$state === void 0 ? void 0 : _preview$state.data) && function (id) {
      return preview.state.data.find(function (x) {
        return x.id === id;
      });
    };
    var columnIndex = propsElement.col,
      currentRowIndex = propsElement.row;
    if (columnIndex === undefined || currentRowIndex === undefined) {
      return;
    }
    if (typeof getDataById === 'function') {
      parentElement = getDataById(propsElement.parentId);
    }
    if (!parentElement || !parentElement.childItems || parentElement.element !== 'DynamicColumnRow' || ((_parentElement$column = parentElement.columns) === null || _parentElement$column === void 0 ? void 0 : _parentElement$column[columnIndex].isSync) === false) {
      return;
    }
    var updateElementFunc = typeof preview.updateElement === 'function' ? preview.updateElement : updateElement;
    if (!updateElementFunc) {
      return;
    }
    parentElement.childItems.forEach(function (row, rowIndex) {
      if (rowIndex === currentRowIndex) return;
      var elementId = row[columnIndex];
      if (!elementId) return;
      var elementData = getDataById(elementId);
      if (!elementData || elementData.element !== propsElement.element || !Array.isArray(elementData.options)) {
        return;
      }
      var newOptions = options.map(function (option, i) {
        var _option$info, _option$correct;
        if (i >= elementData.options.length) {
          return _objectSpread(_objectSpread({}, option), {}, {
            key: _UUID["default"].uuid()
          });
        }
        var key = elementData.options[i].key;
        return _objectSpread(_objectSpread({}, option), {}, {
          key: key || _UUID["default"].uuid(),
          info: (_option$info = option.info) !== null && _option$info !== void 0 ? _option$info : false,
          correct: (_option$correct = option.correct) !== null && _option$correct !== void 0 ? _option$correct : false
        });
      });
      var updatedElement = _objectSpread(_objectSpread({}, elementData), {}, {
        options: newOptions,
        dirty: true
      });
      updateElementFunc(updatedElement);
    });
  }, [preview, propsElement, updateElement]);

  // Throttle utility function
  var throttle = (0, _react.useCallback)(function (func, wait) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var now = Date.now();
      var remaining = wait - (now - previousTimeRef.current);
      if (remaining <= 0 || remaining > wait) {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        previousTimeRef.current = now;
        func.apply(void 0, args);
      } else if (!timeoutIdRef.current) {
        timeoutIdRef.current = setTimeout(function () {
          previousTimeRef.current = now;
          timeoutIdRef.current = null;
          func.apply(void 0, args);
        }, remaining);
      }
    };
  }, []);
  var handleOptionChangeThrottled = (0, _react.useCallback)(throttle(function (optionIndex, _ref2) {
    var value = _ref2.target.value;
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      var currentOption = newElement.options[optionIndex];
      var autoGeneratedValue = setValue(currentOption.text);
      var shouldAutoGenerate = !currentOption.value || currentOption.value === autoGeneratedValue;
      var val = shouldAutoGenerate ? setValue(value) : currentOption.value;
      newElement.options[optionIndex].text = value;
      newElement.options[optionIndex].value = val;
      setDirty(true);
      setTimeout(function () {
        return syncOptionsWithSameColumnElements(newElement.options);
      }, 0);
      return newElement;
    });
  }, 200), [throttle, syncOptionsWithSameColumnElements]);
  var handleValueChangeThrottled = (0, _react.useCallback)(throttle(function (optionIndex, _ref3) {
    var value = _ref3.target.value;
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      newElement.options[optionIndex].value = value;
      setDirty(true);
      setTimeout(function () {
        return syncOptionsWithSameColumnElements(newElement.options);
      }, 0);
      return newElement;
    });
  }, 200), [throttle, syncOptionsWithSameColumnElements]);
  var handleOptionCorrect = (0, _react.useCallback)(function (optionIndex) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      var option = newElement.options[optionIndex];
      if (Object.prototype.hasOwnProperty.call(option, 'correct')) {
        delete option.correct;
      } else {
        option.correct = true;
      }
      setTimeout(function () {
        updateElement.call(preview, newElement);
        syncOptionsWithSameColumnElements(newElement.options);
      }, 0);
      return newElement;
    });
  }, [preview, updateElement, syncOptionsWithSameColumnElements]);
  var handleOptionInfo = (0, _react.useCallback)(function (optionIndex) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      var option = newElement.options[optionIndex];
      if (Object.prototype.hasOwnProperty.call(option, 'info')) {
        delete option.info;
      } else {
        option.info = true;
      }
      setTimeout(function () {
        updateElement.call(preview, newElement);
        syncOptionsWithSameColumnElements(newElement.options);
      }, 0);
      return newElement;
    });
  }, [preview, updateElement, syncOptionsWithSameColumnElements]);
  var updateOption = (0, _react.useCallback)(function () {
    if (dirty) {
      updateElement.call(preview, element);
      setDirty(false);
      setTimeout(function () {
        return syncOptionsWithSameColumnElements(element.options);
      }, 0);
    }
  }, [dirty, element, preview, updateElement, syncOptionsWithSameColumnElements]);
  var addOption = (0, _react.useCallback)(function (index) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      var nextValue = Math.max.apply(Math, (0, _toConsumableArray2["default"])(newElement.options.map(function (_ref4) {
        var value = _ref4.value;
        return Number.isNaN(Number(value)) ? 0 : parseInt(value, 10);
      }))) + 1;
      newElement.options.splice(index + 1, 0, {
        value: nextValue,
        text: '',
        key: _UUID["default"].uuid()
      });
      setDirty(true);
      setTimeout(function () {
        return syncOptionsWithSameColumnElements(newElement.options);
      }, 0);
      return newElement;
    });
  }, [syncOptionsWithSameColumnElements]);
  var removeOption = (0, _react.useCallback)(function (index) {
    setElement(function (prevElement) {
      var newElement = _objectSpread({}, prevElement);
      newElement.options.splice(index, 1);
      setDirty(true);
      setTimeout(function () {
        return syncOptionsWithSameColumnElements(newElement.options);
      }, 0);
      return newElement;
    });
  }, [syncOptionsWithSameColumnElements]);
  var isInDynamicColumn = !!(propsElement !== null && propsElement !== void 0 && propsElement.parentId && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.col) !== undefined && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.row) !== undefined);
  var shouldShowInfo = canHaveInfo || isInDynamicColumn && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.element) === 'Checkboxes';
  var shouldShowCorrect = canHaveOptionCorrect || isInDynamicColumn && (propsElement === null || propsElement === void 0 ? void 0 : propsElement.element) === 'Checkboxes';
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "dynamic-option-list"
  }, /*#__PURE__*/_react["default"].createElement("ul", null, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-5"
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Options")), canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-2"
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Value")), shouldShowInfo && /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-1"
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Info")), shouldShowCorrect && /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-sm-1"
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Correct")))), element.options.map(function (option, index) {
    var itemKey = "edit_".concat(option.key);
    var val = option.value || '';
    return /*#__PURE__*/_react["default"].createElement("li", {
      className: "clearfix",
      key: itemKey
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-5"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      type: "text",
      className: "form-control",
      style: {
        width: '100%'
      },
      value: option.text,
      onChange: function onChange(e) {
        var newElement = _objectSpread({}, element);
        newElement.options[index].text = e.target.value;
        setElement(newElement);
        setDirty(true);
        handleOptionChangeThrottled(index, e);
      },
      onBlur: updateOption
    })), canHaveOptionValue && /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-2"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      type: "text",
      className: "form-control",
      style: {
        width: '100%'
      },
      value: val,
      onChange: function onChange(e) {
        return handleValueChangeThrottled(index, e);
      },
      onBlur: updateOption
    })), canHaveOptionValue && canHaveInfo && /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-1"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      className: "form-control",
      type: "checkbox",
      value: "1",
      checked: Object.prototype.hasOwnProperty.call(option, 'info') && option.info,
      onChange: function onChange() {
        return handleOptionInfo(index);
      }
    })), canHaveOptionValue && canHaveOptionCorrect && /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-1"
    }, /*#__PURE__*/_react["default"].createElement("input", {
      className: "form-control",
      type: "checkbox",
      value: "1",
      checked: Object.prototype.hasOwnProperty.call(option, 'correct') && option.correct,
      onChange: function onChange() {
        return handleOptionCorrect(index);
      }
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "col-sm-3"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dynamic-options-actions-buttons"
    }, /*#__PURE__*/_react["default"].createElement("button", {
      onClick: function onClick() {
        return addOption(index);
      },
      type: "button",
      className: "btn btn-success"
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-plus-circle"
    })), index > 0 && /*#__PURE__*/_react["default"].createElement("button", {
      onClick: function onClick() {
        return removeOption(index);
      },
      type: "button",
      className: "btn btn-danger"
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "fas fa-minus-circle"
    }))))));
  })), dirty && (element.dirty = true));
};
DynamicOptionList.propTypes = {
  element: _propTypes["default"].shape({
    options: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      text: _propTypes["default"].string,
      value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
      key: _propTypes["default"].string
    })).isRequired,
    parentId: _propTypes["default"].string,
    col: _propTypes["default"].number,
    row: _propTypes["default"].number,
    element: _propTypes["default"].string
  }).isRequired,
  data: _propTypes["default"].shape({}),
  updateElement: _propTypes["default"].func,
  preview: _propTypes["default"].shape({
    state: _propTypes["default"].shape({
      data: _propTypes["default"].arrayOf(_propTypes["default"].shape({
        id: _propTypes["default"].string.isRequired
      }))
    }),
    getDataById: _propTypes["default"].func,
    updateElement: _propTypes["default"].func
  }),
  canHaveOptionValue: _propTypes["default"].bool,
  canHaveOptionCorrect: _propTypes["default"].bool,
  canHaveInfo: _propTypes["default"].bool
};
var _default = exports["default"] = DynamicOptionList;