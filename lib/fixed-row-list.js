"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactDraftWysiwyg = require("react-draft-wysiwyg");
require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
var _draftJs = require("draft-js");
var _draftjsToHtml = _interopRequireDefault(require("draftjs-to-html"));
var _UUID = _interopRequireDefault(require("./UUID"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
 * <FixedRowList />
 */
var rowLabelToolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'colorPicker', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript']
  },
  link: {
    popupClassName: 'link-popup-right'
  },
  colorPicker: {
    className: 'rainbow-color-picker',
    component: undefined,
    popupClassName: 'color-picker-popup-right',
    colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)', 'rgb(147,101,184)', '#FF00BF', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)', 'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', '#0000FF', 'rgb(40,50,78)', 'rgb(0,0,0)', 'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)', 'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)', 'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)']
  }
};
var FixedRowList = /*#__PURE__*/function (_React$Component) {
  function FixedRowList(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, FixedRowList);
    _this = _callSuper(this, FixedRowList, [props]);
    var element = props.element;
    _this.state = {
      element: element,
      dirty: false,
      editorStates: {}
    };
    return _this;
  }
  (0, _inherits2["default"])(FixedRowList, _React$Component);
  return (0, _createClass2["default"])(FixedRowList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var element = this.props.element;
      if (prevProps.element !== element) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          element: element
        });
      }
    }
  }, {
    key: "_setValue",
    value: function _setValue(text) {
      return "".concat(text || '').replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
    }
  }, {
    key: "areRowsInSync",
    value: function areRowsInSync() {
      var element = this.state.element;
      return Number(element.rows || 1) === element.rowLabels.length;
    }
  }, {
    key: "editorStateFor",
    value: function editorStateFor(text) {
      if (text) {
        try {
          var blocks = (0, _draftJs.convertFromHTML)(text);
          if (blocks.contentBlocks && blocks.contentBlocks.length) {
            return _draftJs.EditorState.createWithContent(_draftJs.ContentState.createFromBlockArray(blocks));
          }
        } catch (e) {
          // ignore
        }
      }
      return _draftJs.RichUtils.toggleInlineStyle(_draftJs.EditorState.createEmpty(), 'BOLD');
    }
  }, {
    key: "onRowEditorStateChange",
    value: function onRowEditorStateChange(rowKey, editorState) {
      this.setState(function (prev) {
        return {
          editorStates: _objectSpread(_objectSpread({}, prev.editorStates), {}, (0, _defineProperty2["default"])({}, rowKey, editorState)),
          dirty: true
        };
      });
    }
  }, {
    key: "onRowEditorBlur",
    value: function onRowEditorBlur(index, rowKey) {
      var _this$state = this.state,
        editorStates = _this$state.editorStates,
        element = _this$state.element;
      var editorState = editorStates[rowKey];
      if (!editorState) return;
      if (!element.rowLabels[index]) {
        element.rowLabels[index] = {
          value: '',
          text: '',
          key: _UUID["default"].uuid()
        };
      }
      var html = (0, _draftjsToHtml["default"])((0, _draftJs.convertToRaw)(editorState.getCurrentContent()));
      var plainText = editorState.getCurrentContent().getPlainText();
      var currentValue = element.rowLabels[index].value || '';
      var currentKeyValue = typeof element.rowLabels[index].text === 'string' ? element.rowLabels[index].text.replace(/<[^>]+>/g, '') : element.rowLabels[index].text || '';
      var val = currentValue !== this._setValue(currentKeyValue) ? currentValue : this._setValue(plainText);
      element.rowLabels[index].text = html;
      element.rowLabels[index].value = val;
      this.setState({
        element: element,
        dirty: true
      }, this.updateRow.bind(this));
    }
  }, {
    key: "editRow",
    value: function editRow(index, key, e) {
      var element = this.state.element;
      var targetValue = e.target.value || '';
      if (!element.rowLabels[index]) {
        element.rowLabels[index] = {
          value: '',
          text: '',
          key: _UUID["default"].uuid()
        };
      }
      var currentValue = element.rowLabels[index].value || '';
      var currentKeyValue = element.rowLabels[index][key] || '';
      var val = currentValue !== this._setValue(currentKeyValue) ? currentValue : this._setValue(targetValue);
      element.rowLabels[index][key] = targetValue;
      element.rowLabels[index].value = val;
      this.setState({
        element: element,
        dirty: true
      });
    }
  }, {
    key: "updateRow",
    value: function updateRow() {
      var _this$state2 = this.state,
        element = _this$state2.element,
        dirty = _this$state2.dirty;
      var _this$props = this.props,
        updateElement = _this$props.updateElement,
        preview = _this$props.preview;
      if (dirty) {
        updateElement.call(preview, element);
        this.setState({
          dirty: false
        });
      }
    }
  }, {
    key: "addRow",
    value: function addRow(index) {
      var _preview$state;
      var element = this.state.element;
      var _this$props2 = this.props,
        updateElement = _this$props2.updateElement,
        preview = _this$props2.preview;
      var newRowIndex = index + 1;

      // Add a new row label
      element.rowLabels.splice(newRowIndex, 0, {
        value: '',
        text: "Row ".concat(element.rowLabels.length + 1),
        key: _UUID["default"].uuid()
      });
      element.rows = element.rowLabels.length;

      // Initialize a new row in childItems if it doesn't exist
      if (!element.childItems) {
        element.childItems = [];
      }
      if (!element.childItems[newRowIndex]) {
        var columnsCount = element.childItems[0] ? element.childItems[0].length : 0;
        element.childItems[newRowIndex] = Array(columnsCount).fill(null);
      }

      // If we can access the preview data
      if (preview !== null && preview !== void 0 && (_preview$state = preview.state) !== null && _preview$state !== void 0 && _preview$state.data && typeof preview.getDataById === 'function') {
        var allFormData = (0, _toConsumableArray2["default"])(preview.state.data);
        var newElements = [];

        // For each column, create new elements
        var columnCount = element.childItems[0] ? element.childItems[0].length : 0;
        var _loop = function _loop() {
          // Find a template element
          var templateElement = null;

          // Look for existing elements in this column
          for (var row = 0; row < element.childItems.length; row++) {
            if (row !== newRowIndex && element.childItems[row] && element.childItems[row][col]) {
              var elementId = element.childItems[row][col];
              var foundElement = preview.getDataById(elementId);
              if (foundElement) {
                templateElement = foundElement;
                break;
              }
            }
          }

          // If we found a template element
          if (templateElement) {
            var elementType = templateElement.element;
            var timestamp = Date.now() + col + newRowIndex;

            // Create a new element
            var newElement = {
              element: elementType,
              id: "".concat(elementType, "_").concat(timestamp, "_").concat(newRowIndex, "_").concat(col),
              row: newRowIndex,
              col: col,
              parentId: element.id,
              hideLabel: true,
              field_name: "".concat(elementType, "_").concat(newRowIndex, "_").concat(col, "_").concat(timestamp)
            };

            // Copy basic properties
            if (templateElement.label) {
              newElement.label = templateElement.label;
            }
            if (templateElement.required !== undefined) {
              newElement.required = templateElement.required;
            }

            // Handle special element types
            if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
              // Create fresh options with unchecked state
              if (templateElement.options && Array.isArray(templateElement.options)) {
                newElement.options = templateElement.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9)),
                    checked: false,
                    selected: false
                  };
                });
                newElement.inline = templateElement.inline || false;
              }
            } else if (elementType === 'Dropdown') {
              // Create dropdown options
              if (templateElement.options && Array.isArray(templateElement.options)) {
                newElement.options = templateElement.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                  };
                });
              }
            } else if (templateElement.options) {
              // Handle other elements with options
              newElement.options = JSON.parse(JSON.stringify(templateElement.options)).map(function (opt) {
                return _objectSpread(_objectSpread({}, opt), {}, {
                  key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                });
              });
            }

            // Add to our collection
            newElements.push(newElement);
            element.childItems[newRowIndex][col] = newElement.id;
          }
        };
        for (var col = 0; col < columnCount; col++) {
          _loop();
        }

        // If we created new elements, update the form data
        if (newElements.length > 0) {
          var updatedData = [].concat((0, _toConsumableArray2["default"])(allFormData), newElements);

          // Try to update state
          try {
            preview.setState({
              data: updatedData
            }, function () {
              updateElement.call(preview, element);
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error updating state:', e);
            updateElement.call(preview, element);
          }
        } else {
          // Just update the element if we can't access data
          updateElement.call(preview, element);
        }
      }
    }
  }, {
    key: "removeRow",
    value: function removeRow(index) {
      var element = this.state.element;
      var _this$props3 = this.props,
        updateElement = _this$props3.updateElement,
        preview = _this$props3.preview;

      // Remove the row label
      element.rowLabels.splice(index, 1);
      element.rows = element.rowLabels.length;

      // If we have childItems, also remove the row from there
      if (element.childItems && Array.isArray(element.childItems)) {
        var updatedData = preview !== null && preview !== void 0 && preview.state ? (0, _toConsumableArray2["default"])(preview.state.data) : [];

        // Track elements to remove
        var elementsToRemove = [];

        // Remove the row from childItems
        if (index < element.childItems.length) {
          // Find elements in this row to remove them from data
          if (preview && typeof preview.getDataById === 'function') {
            var rowItems = element.childItems[index];
            if (rowItems) {
              rowItems.forEach(function (elementId) {
                if (elementId) {
                  var foundElement = preview.getDataById(elementId);
                  if (foundElement) {
                    elementsToRemove.push(foundElement);
                  }
                }
              });
            }
          }

          // Remove the row from childItems
          element.childItems.splice(index, 1);

          // Remove elements from data if we have access to it
          if (preview !== null && preview !== void 0 && preview.state && elementsToRemove.length > 0) {
            updatedData = updatedData.filter(function (x) {
              return !elementsToRemove.includes(x);
            });

            // Try to update state
            try {
              preview.setState({
                data: updatedData
              }, function () {
                updateElement.call(preview, element);
              });
              return;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Error updating state:', e);
            }
          }
        }
      }

      // Update the element
      updateElement.call(preview, element);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var element = this.props.element;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "dynamic-option-list"
      }, /*#__PURE__*/_react["default"].createElement("ul", {
        key: "row-labels"
      }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-12"
      }, /*#__PURE__*/_react["default"].createElement("b", null, "Rows")))), /*#__PURE__*/_react["default"].createElement("li", {
        className: "clearfix",
        key: "li_label_x"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-9"
      }, "Row Label"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-3"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "dynamic-options-actions-buttons"
      }, /*#__PURE__*/_react["default"].createElement("button", {
        onClick: this.addRow.bind(this, -1),
        className: "btn btn-success"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-plus-circle"
      })))))), (element.rowLabels || []).map(function (option, index) {
        var key = "edit_".concat(option.key);
        return /*#__PURE__*/_react["default"].createElement("li", {
          className: "clearfix",
          key: "li_label_".concat(key)
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-9"
        }, /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
          toolbar: rowLabelToolbar,
          editorState: _this2.state.editorStates[option.key] || _this2.editorStateFor(option.text),
          onEditorStateChange: function onEditorStateChange(es) {
            return _this2.onRowEditorStateChange(option.key, es);
          },
          onBlur: function onBlur() {
            return _this2.onRowEditorBlur(index, option.key);
          },
          stripPastedStyles: false
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this2.addRow.bind(_this2, index),
          className: "btn btn-success"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-plus-circle"
        })), /*#__PURE__*/_react["default"].createElement("button", {
          onClick: _this2.removeRow.bind(_this2, index),
          className: "btn btn-danger"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-minus-circle"
        }))))));
      })));
    }
  }]);
}(_react["default"].Component);
FixedRowList.propTypes = {
  element: _propTypes["default"].shape({
    rowLabels: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      value: _propTypes["default"].string,
      text: _propTypes["default"].string,
      key: _propTypes["default"].string
    })).isRequired,
    rows: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
    id: _propTypes["default"].string,
    childItems: _propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].string))
  }).isRequired,
  preview: _propTypes["default"].shape({
    state: _propTypes["default"].shape({
      data: _propTypes["default"].arrayOf(_propTypes["default"].shape({}))
    }),
    getDataById: _propTypes["default"].func,
    setState: _propTypes["default"].func
  }),
  updateElement: _propTypes["default"].func.isRequired
};
FixedRowList.defaultProps = {
  preview: null
};
var _default = exports["default"] = FixedRowList;