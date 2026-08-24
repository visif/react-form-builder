"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactDraftWysiwyg = require("react-draft-wysiwyg");
require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
var _draftJs = require("draft-js");
var _draftjsToHtml = _interopRequireDefault(require("draftjs-to-html"));
var _formElementsEdit = _interopRequireDefault(require("./form-elements-edit"));
var _UUID = _interopRequireDefault(require("./UUID"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
 * <DynamicColumnList />
 */ // eslint-disable-next-line import/no-cycle
var columnNameToolbar = {
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
var DynamicColumnList = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function DynamicColumnList(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, DynamicColumnList);
    _this = _callSuper(this, DynamicColumnList, [props]);
    (0, _defineProperty2["default"])(_this, "handleEditModalClose", function () {
      _this.setState({
        showEditModal: false,
        editingColumn: null
      });
    });
    (0, _defineProperty2["default"])(_this, "_setValue", function (text) {
      return "".concat(text).replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
    });
    (0, _defineProperty2["default"])(_this, "editorStateFor", function (text) {
      if (text) {
        try {
          var rawStr = text.__raw;
          if (rawStr) {
            var raw = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr;
            return _draftJs.EditorState.createWithContent((0, _draftJs.convertFromRaw)(raw));
          }
        } catch (e) {
          // ignore
        }
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
    });
    (0, _defineProperty2["default"])(_this, "onColumnEditorStateChange", function (columnKey, editorState) {
      _this.setState(function (prev) {
        return {
          editorStates: _objectSpread(_objectSpread({}, prev.editorStates), {}, (0, _defineProperty2["default"])({}, columnKey, editorState)),
          dirty: true
        };
      });
    });
    (0, _defineProperty2["default"])(_this, "onColumnEditorBlur", function (index, columnKey) {
      var _this$state = _this.state,
        editorStates = _this$state.editorStates,
        element = _this$state.element;
      var editorState = editorStates[columnKey];
      if (editorState) {
        var raw = (0, _draftJs.convertToRaw)(editorState.getCurrentContent());
        var html = (0, _draftjsToHtml["default"])(raw);
        var plainText = editorState.getCurrentContent().getPlainText();
        var oldValue = element.columns[index].value;
        var oldText = element.columns[index].text;
        var newVal = oldValue !== _this._setValue(typeof oldText === 'string' ? oldText.replace(/<[^>]+>/g, '') : oldText) ? oldValue : _this._setValue(plainText);
        element.columns[index].text = html;
        element.columns[index].value = newVal;
        _this.setState({
          element: element,
          dirty: true
        }, _this.updateColumn);
      }
    });
    (0, _defineProperty2["default"])(_this, "editColumn", function (index, key, e) {
      var element = _this.state.element;
      if (key === 'isSync' || key === 'required') {
        element.columns[index][key] = e.target.checked;
      } else {
        var val = element.columns[index].value !== _this._setValue(element.columns[index][key]) ? element.columns[index].value : _this._setValue(e.target.value);
        element.columns[index][key] = e.target.value;
        element.columns[index].value = val;
      }
      _this.setState({
        element: element,
        dirty: true
      });
    });
    (0, _defineProperty2["default"])(_this, "updateColumn", function () {
      var _this$state2 = _this.state,
        element = _this$state2.element,
        dirty = _this$state2.dirty;
      var _this$props = _this.props,
        updateElement = _this$props.updateElement,
        preview = _this$props.preview;
      if (dirty) {
        if (preview) {
          updateElement.call(preview, element);
        } else {
          updateElement(element);
        }
        _this.setState({
          dirty: false
        });
      }
    });
    (0, _defineProperty2["default"])(_this, "addColumn", function (index) {
      var element = _this.state.element;
      var _this$props2 = _this.props,
        updateElement = _this$props2.updateElement,
        preview = _this$props2.preview;
      if (!element.columns) {
        element.columns = [];
      }
      element.columns.splice(index + 1, 0, {
        value: '',
        text: '',
        key: _UUID["default"].uuid(),
        width: 1,
        isSync: true,
        required: false
      });
      if (preview) {
        updateElement.call(preview, element);
      } else {
        updateElement(element);
      }
    });
    (0, _defineProperty2["default"])(_this, "removeColumn", function (index) {
      var element = _this.state.element;
      var _this$props3 = _this.props,
        updateElement = _this$props3.updateElement,
        preview = _this$props3.preview;
      element.columns.splice(index, 1);
      if (preview) {
        updateElement.call(preview, element);
      } else {
        updateElement(element);
      }
    });
    (0, _defineProperty2["default"])(_this, "editColumnSettings", function (column) {
      _this.setState({
        showEditModal: true,
        editingColumn: column
      });
    });
    var _element = props.element;
    _this.state = {
      element: _element,
      showEditModal: false,
      editingColumn: null,
      dirty: false,
      editorStates: {}
    };
    return _this;
  }
  (0, _inherits2["default"])(DynamicColumnList, _React$Component);
  return (0, _createClass2["default"])(DynamicColumnList, [{
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
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state3 = this.state,
        element = _this$state3.element,
        dirty = _this$state3.dirty,
        showEditModal = _this$state3.showEditModal,
        editingColumn = _this$state3.editingColumn,
        editorStates = _this$state3.editorStates;
      var _this$props4 = this.props,
        preview = _this$props4.preview,
        allowSync = _this$props4.allowSync;
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
        className: allowSync ? 'col-sm-5' : 'col-sm-6'
      }, "Header Text"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-2"
      }, "Width"), allowSync && /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-1 text-center"
      }, "Sync"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-1 text-center"
      }, "Required"), /*#__PURE__*/_react["default"].createElement("div", {
        className: allowSync ? 'col-sm-3' : 'col-sm-3'
      }))), (!element.columns || element.columns.length === 0) && /*#__PURE__*/_react["default"].createElement("li", {
        className: "clearfix"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-sm-12"
      }, /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        onClick: function onClick() {
          return _this2.addColumn(-1);
        },
        className: "btn btn-success"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "fas fa-plus-circle"
      }), " Add Column")))), (element.columns || []).map(function (option, index) {
        var editKey = "edit_".concat(option.key);
        return /*#__PURE__*/_react["default"].createElement("li", {
          className: "clearfix",
          key: editKey
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: allowSync ? 'col-sm-5' : 'col-sm-6'
        }, /*#__PURE__*/_react["default"].createElement(_reactDraftWysiwyg.Editor, {
          toolbar: columnNameToolbar,
          editorState: editorStates[option.key] || _this2.editorStateFor(option.text),
          onEditorStateChange: function onEditorStateChange(es) {
            return _this2.onColumnEditorStateChange(option.key, es);
          },
          onBlur: function onBlur() {
            return _this2.onColumnEditorBlur(index, option.key);
          },
          stripPastedStyles: false
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
          onBlur: _this2.updateColumn,
          onChange: function onChange(e) {
            return _this2.editColumn(index, 'width', e);
          }
        })), allowSync && /*#__PURE__*/_react["default"].createElement("div", {
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
            return _this2.editColumn(index, 'isSync', e);
          },
          onBlur: _this2.updateColumn
        }))), /*#__PURE__*/_react["default"].createElement("div", {
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
          id: "required_".concat(index),
          checked: option.required || false,
          onChange: function onChange(e) {
            return _this2.editColumn(index, 'required', e);
          },
          onBlur: _this2.updateColumn
        }))), /*#__PURE__*/_react["default"].createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          type: "button",
          onClick: function onClick() {
            return _this2.addColumn(index);
          },
          className: "btn btn-success"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "fas fa-plus-circle"
        })), index > 0 && /*#__PURE__*/_react["default"].createElement("button", {
          type: "button",
          onClick: function onClick() {
            return _this2.removeColumn(index);
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
        updateElement: function updateElement(updatedElement) {
          var currentElement = _this2.state.element;
          var columns = (0, _toConsumableArray2["default"])(currentElement.columns);
          var index = columns.findIndex(function (col) {
            return col.key === updatedElement.key;
          });
          if (index !== -1) {
            columns[index] = updatedElement;
            _this2.setState(function (prevState) {
              var newElement = _objectSpread({}, prevState.element);
              newElement.columns = columns;
              return {
                element: newElement,
                dirty: true
              };
            }, function () {
              _this2.updateColumn();
              _this2.handleEditModalClose();
            });
          }
        },
        manualEditModeOff: this.handleEditModalClose,
        preview: preview
      })))));
    }
  }]);
}(_react["default"].Component);
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
  updateElement: _propTypes["default"].func.isRequired,
  allowSync: _propTypes["default"].bool
};
DynamicColumnList.defaultProps = {
  preview: null,
  allowSync: true
};