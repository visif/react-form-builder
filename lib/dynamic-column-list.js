"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _formElementsEdit = _interopRequireDefault(require("./form-elements-edit"));
var _UUID = _interopRequireDefault(require("./UUID"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } /**
 * <DynamicColumnList />
 */ // eslint-disable-next-line import/no-cycle
class DynamicColumnList extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "handleEditModalClose", () => {
      this.setState({
        showEditModal: false,
        editingColumn: null
      });
    });
    (0, _defineProperty2.default)(this, "_setValue", text => "".concat(text).replace(/[^A-Z0-9]+/gi, '_').toLowerCase());
    (0, _defineProperty2.default)(this, "editColumn", (index, key, e) => {
      const {
        element
      } = this.state;
      if (key === 'isSync' || key === 'required') {
        element.columns[index][key] = e.target.checked;
      } else {
        const val = element.columns[index].value !== this._setValue(element.columns[index][key]) ? element.columns[index].value : this._setValue(e.target.value);
        element.columns[index][key] = e.target.value;
        element.columns[index].value = val;
      }
      this.setState({
        element,
        dirty: true
      });
    });
    (0, _defineProperty2.default)(this, "updateColumn", () => {
      const {
        element,
        dirty
      } = this.state;
      const {
        updateElement,
        preview
      } = this.props;
      if (dirty) {
        if (preview) {
          updateElement.call(preview, element);
        } else {
          updateElement(element);
        }
        this.setState({
          dirty: false
        });
      }
    });
    (0, _defineProperty2.default)(this, "addColumn", index => {
      const {
        element
      } = this.state;
      const {
        updateElement,
        preview
      } = this.props;
      if (!element.columns) {
        element.columns = [];
      }
      element.columns.splice(index + 1, 0, {
        value: '',
        text: '',
        key: _UUID.default.uuid(),
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
    (0, _defineProperty2.default)(this, "removeColumn", index => {
      const {
        element
      } = this.state;
      const {
        updateElement,
        preview
      } = this.props;
      element.columns.splice(index, 1);
      if (preview) {
        updateElement.call(preview, element);
      } else {
        updateElement(element);
      }
    });
    (0, _defineProperty2.default)(this, "editColumnSettings", column => {
      this.setState({
        showEditModal: true,
        editingColumn: column
      });
    });
    const {
      element: _element
    } = props;
    this.state = {
      element: _element,
      showEditModal: false,
      editingColumn: null,
      dirty: false
    };
  }
  componentDidUpdate(prevProps) {
    const {
      element
    } = this.props;
    if (prevProps.element !== element) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        element
      });
    }
  }
  render() {
    const {
      element,
      dirty,
      showEditModal,
      editingColumn
    } = this.state;
    const {
      preview,
      allowSync
    } = this.props;
    if (dirty) {
      element.dirty = true;
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "dynamic-option-list"
    }, /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-12"
    }, /*#__PURE__*/_react.default.createElement("b", null, "Columns")))), /*#__PURE__*/_react.default.createElement("li", {
      className: "clearfix"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: allowSync ? 'col-sm-5' : 'col-sm-6'
    }, "Header Text"), /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-2"
    }, "Width"), allowSync && /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-1 text-center"
    }, "Sync"), /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-1 text-center"
    }, "Required"), /*#__PURE__*/_react.default.createElement("div", {
      className: allowSync ? 'col-sm-3' : 'col-sm-3'
    }))), (!element.columns || element.columns.length === 0) && /*#__PURE__*/_react.default.createElement("li", {
      className: "clearfix"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "col-sm-12"
    }, /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      onClick: () => this.addColumn(-1),
      className: "btn btn-success"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fas fa-plus-circle"
    }), " Add Column")))), (element.columns || []).map((option, index) => {
      const editKey = "edit_".concat(option.key);
      return /*#__PURE__*/_react.default.createElement("li", {
        className: "clearfix",
        key: editKey
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: allowSync ? 'col-sm-5' : 'col-sm-6'
      }, /*#__PURE__*/_react.default.createElement("input", {
        tabIndex: index + 1,
        className: "form-control",
        style: {
          width: '100%'
        },
        type: "text",
        name: "text_".concat(index),
        placeholder: "Option text",
        value: option.text,
        onBlur: this.updateColumn,
        onChange: e => this.editColumn(index, 'text', e)
      })), /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-2"
      }, /*#__PURE__*/_react.default.createElement("input", {
        tabIndex: index + 1,
        className: "form-control",
        style: {
          width: '100%'
        },
        type: "text",
        name: "width_".concat(index),
        placeholder: "Width",
        value: option.width,
        onBlur: this.updateColumn,
        onChange: e => this.editColumn(index, 'width', e)
      })), allowSync && /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-1"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "d-flex justify-content-center align-items-center",
        style: {
          height: '38px',
          minWidth: '56px'
        }
      }, /*#__PURE__*/_react.default.createElement("input", {
        className: "form-check-input",
        type: "checkbox",
        id: "sync_".concat(index),
        checked: option.isSync || false,
        onChange: e => this.editColumn(index, 'isSync', e),
        onBlur: this.updateColumn
      }))), /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-1"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "d-flex justify-content-center align-items-center",
        style: {
          height: '38px',
          minWidth: '56px'
        }
      }, /*#__PURE__*/_react.default.createElement("input", {
        className: "form-check-input",
        type: "checkbox",
        id: "required_".concat(index),
        checked: option.required || false,
        onChange: e => this.editColumn(index, 'required', e),
        onBlur: this.updateColumn
      }))), /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-3"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "dynamic-options-actions-buttons"
      }, /*#__PURE__*/_react.default.createElement("button", {
        type: "button",
        onClick: () => this.addColumn(index),
        className: "btn btn-success"
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "fas fa-plus-circle"
      })), index > 0 && /*#__PURE__*/_react.default.createElement("button", {
        type: "button",
        onClick: () => this.removeColumn(index),
        className: "btn btn-danger"
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "fas fa-minus-circle"
      }))))));
    }))), showEditModal && editingColumn && /*#__PURE__*/_react.default.createElement("div", {
      className: "modal show d-block"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "modal-dialog modal-lg"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "modal-content"
    }, /*#__PURE__*/_react.default.createElement(_formElementsEdit.default, {
      element: editingColumn,
      updateElement: updatedElement => {
        const {
          element: currentElement
        } = this.state;
        const columns = [...currentElement.columns];
        const index = columns.findIndex(col => col.key === updatedElement.key);
        if (index !== -1) {
          columns[index] = updatedElement;
          this.setState(prevState => {
            const newElement = _objectSpread({}, prevState.element);
            newElement.columns = columns;
            return {
              element: newElement,
              dirty: true
            };
          }, () => {
            this.updateColumn();
            this.handleEditModalClose();
          });
        }
      },
      manualEditModeOff: this.handleEditModalClose,
      preview: preview
    })))));
  }
}
exports.default = DynamicColumnList;
DynamicColumnList.propTypes = {
  element: _propTypes.default.shape({
    columns: _propTypes.default.arrayOf(_propTypes.default.shape({
      key: _propTypes.default.string,
      text: _propTypes.default.string,
      value: _propTypes.default.string,
      width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
      type: _propTypes.default.string,
      isSync: _propTypes.default.bool
    })).isRequired
  }).isRequired,
  preview: _propTypes.default.shape({}),
  updateElement: _propTypes.default.func.isRequired,
  allowSync: _propTypes.default.bool
};
DynamicColumnList.defaultProps = {
  preview: null,
  allowSync: true
};