"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _react = _interopRequireDefault(require("react"));
var _UUID = _interopRequireDefault(require("./UUID"));
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FixedRowList = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(FixedRowList, _React$Component);
  var _super = _createSuper(FixedRowList);
  function FixedRowList(props) {
    var _this;
    (0, _classCallCheck2.default)(this, FixedRowList);
    _this = _super.call(this, props);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    return _this;
  }
  (0, _createClass2.default)(FixedRowList, [{
    key: "_setValue",
    value: function _setValue(text) {
      return "".concat(text).replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
    }
  }, {
    key: "editRow",
    value: function editRow(index, key, e) {
      var this_element = this.state.element;
      var val = this_element.rowLabels[index].value !== this._setValue(this_element.rowLabels[index][key]) ? this_element.rowLabels[index].value : this._setValue(e.target.value);
      this_element.rowLabels[index][key] = e.target.value;
      this_element.rowLabels[index].value = val;
      this.setState({
        element: this_element,
        dirty: true
      });
    }
  }, {
    key: "updateRow",
    value: function updateRow() {
      var this_element = this.state.element;
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, this_element);
        this.setState({
          dirty: false
        });
      }
    }
  }, {
    key: "addRow",
    value: function addRow(index) {
      var this_element = this.state.element;
      this_element.rowLabels.splice(index + 1, 0, {
        value: '',
        text: '',
        key: _UUID.default.uuid()
      });
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }, {
    key: "removeRow",
    value: function removeRow(index) {
      var this_element = this.state.element;
      this_element.rowLabels.splice(index, 1);
      this.props.updateElement.call(this.props.preview, this_element);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      if (this.state.dirty) {
        this.state.element.dirty = true;
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "dynamic-option-list"
      }, /*#__PURE__*/_react.default.createElement("ul", {
        key: "row-labels"
      }, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-12"
      }, /*#__PURE__*/_react.default.createElement("b", null, "Rows")))), /*#__PURE__*/_react.default.createElement("li", {
        className: "clearfix",
        key: "li_label_x"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-9"
      }, "Row Label"), /*#__PURE__*/_react.default.createElement("div", {
        className: "col-sm-3"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "dynamic-options-actions-buttons"
      }, /*#__PURE__*/_react.default.createElement("button", {
        onClick: this.addRow.bind(this, -1),
        className: "btn btn-success"
      }, /*#__PURE__*/_react.default.createElement("i", {
        className: "fas fa-plus-circle"
      })))))), this.props.element.rowLabels.map(function (option, index) {
        var this_key = "edit_".concat(option.key);
        var val = option.value !== _this2._setValue(option.text) ? option.value : '';
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("li", {
          className: "clearfix",
          key: "li_label_".concat(this_key)
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "col-sm-9"
        }, /*#__PURE__*/_react.default.createElement("input", {
          tabIndex: index + 1,
          key: "input_label_".concat(this_key),
          className: "form-control",
          style: {
            width: '100%'
          },
          type: "text",
          name: "text_".concat(index),
          placeholder: "Row Label",
          value: option.text,
          onBlur: _this2.updateRow.bind(_this2),
          onChange: _this2.editRow.bind(_this2, index, 'text')
        })), /*#__PURE__*/_react.default.createElement("div", {
          className: "col-sm-3"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/_react.default.createElement("button", {
          onClick: _this2.addRow.bind(_this2, index),
          className: "btn btn-success"
        }, /*#__PURE__*/_react.default.createElement("i", {
          className: "fas fa-plus-circle"
        })), /*#__PURE__*/_react.default.createElement("button", {
          onClick: _this2.removeRow.bind(_this2, index),
          className: "btn btn-danger"
        }, /*#__PURE__*/_react.default.createElement("i", {
          className: "fas fa-minus-circle"
        })))))));
      })));
    }
  }]);
  return FixedRowList;
}(_react.default.Component);
exports.default = FixedRowList;