"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _store = _interopRequireDefault(require("./stores/store"));

var _formElementsEdit = _interopRequireDefault(require("./form-elements-edit"));

var _sortableFormElements = _interopRequireDefault(require("./sortable-form-elements"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PlaceHolder = _sortableFormElements["default"].PlaceHolder;

var Preview = /*#__PURE__*/function (_React$Component) {
  _inherits(Preview, _React$Component);

  var _super = _createSuper(Preview);

  function Preview(props) {
    var _this;

    _classCallCheck(this, Preview);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      data: [],
      answer_data: {}
    });

    _defineProperty(_assertThisInitialized(_this), "editModeOff", function (e) {
      if (_this.editForm.current && !_this.editForm.current.contains(e.target)) {
        _this.manualEditModeOff();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "manualEditModeOff", function () {
      var editElement = _this.props.editElement;

      if (editElement && editElement.dirty) {
        editElement.dirty = false;

        _this.updateElement(editElement);
      }

      _this.props.manualEditModeOff();
    });

    var onLoad = props.onLoad,
        onPost = props.onPost;

    _store["default"].setExternalHandler(onLoad, onPost);

    _this.editForm = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      data: props.data || [],
      answer_data: {}
    };
    _this.seq = 0;

    var onUpdate = _this._onChange.bind(_assertThisInitialized(_this));

    _store["default"].subscribe(function (state) {
      return onUpdate(state.data);
    });

    _this.getDataById = _this.getDataById.bind(_assertThisInitialized(_this));
    _this.moveCard = _this.moveCard.bind(_assertThisInitialized(_this));
    _this.insertCard = _this.insertCard.bind(_assertThisInitialized(_this));
    _this.setAsChild = _this.setAsChild.bind(_assertThisInitialized(_this));
    _this.removeChild = _this.removeChild.bind(_assertThisInitialized(_this));
    _this._onDestroy = _this._onDestroy.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Preview, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          data = _this$props.data,
          url = _this$props.url,
          saveUrl = _this$props.saveUrl;

      _store["default"].dispatch('load', {
        loadUrl: url,
        saveUrl: saveUrl,
        data: data || []
      });

      document.addEventListener('mousedown', this.editModeOff);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.editModeOff);
    }
  }, {
    key: "_setValue",
    value: function _setValue(text) {
      return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
    }
  }, {
    key: "updateElement",
    value: function updateElement(element) {
      var data = this.state.data;
      var found = false;

      for (var i = 0, len = data.length; i < len; i++) {
        if (element.id === data[i].id) {
          data[i] = element;
          found = true;
          break;
        }
      }

      if (found) {
        this.seq = this.seq > 100000 ? 0 : this.seq + 1;

        _store["default"].dispatch('updateOrder', data);
      }
    }
  }, {
    key: "_onChange",
    value: function _onChange(data) {
      var _this2 = this;

      var answer_data = {};
      data.forEach(function (item) {
        if (item && item.readOnly && _this2.props.variables[item.variableKey]) {
          answer_data[item.field_name] = _this2.props.variables[item.variableKey];
        }
      });
      this.setState({
        data: data,
        answer_data: answer_data
      });
    }
  }, {
    key: "_onDestroy",
    value: function _onDestroy(item) {
      var _this3 = this;

      if (item.childItems) {
        item.childItems.forEach(function (x) {
          var child = _this3.getDataById(x);

          if (child) {
            _store["default"].dispatch('delete', child);
          }
        });
      }

      _store["default"].dispatch('delete', item);
    }
  }, {
    key: "getDataById",
    value: function getDataById(id) {
      var data = this.state.data;
      return data.find(function (x) {
        return x && x.id === id;
      });
    }
  }, {
    key: "swapChildren",
    value: function swapChildren(data, item, child, col) {
      if (child.col !== undefined && item.id !== child.parentId) {
        return false;
      }

      if (!(child.col !== undefined && child.col !== col && item.childItems[col])) {
        // No child was assigned yet in both source and target.
        return false;
      }

      var oldId = item.childItems[col];
      var oldItem = this.getDataById(oldId);
      var oldCol = child.col; // eslint-disable-next-line no-param-reassign

      item.childItems[oldCol] = oldId;
      oldItem.col = oldCol; // eslint-disable-next-line no-param-reassign

      item.childItems[col] = child.id;
      child.col = col;

      _store["default"].dispatch('updateOrder', data);

      return true;
    }
  }, {
    key: "setAsChild",
    value: function setAsChild(item, child, col) {
      var data = this.state.data;

      if (this.swapChildren(data, item, child, col)) {
        return;
      }

      var oldParent = this.getDataById(child.parentId);
      var oldCol = child.col; // eslint-disable-next-line no-param-reassign

      item.childItems[col] = child.id;
      child.col = col; // eslint-disable-next-line no-param-reassign

      child.parentId = item.id; // eslint-disable-next-line no-param-reassign

      child.parentIndex = data.indexOf(item);

      if (oldParent) {
        oldParent.childItems[oldCol] = null;
      }

      var list = data.filter(function (x) {
        return x && x.parentId === item.id;
      });
      var toRemove = list.filter(function (x) {
        return item.childItems.indexOf(x.id) === -1;
      });
      var newData = data;

      if (toRemove.length) {
        // console.log('toRemove', toRemove);
        newData = data.filter(function (x) {
          return toRemove.indexOf(x) === -1;
        });
      }

      if (!this.getDataById(child.id)) {
        newData.push(child);
      }

      _store["default"].dispatch('updateOrder', newData);
    }
  }, {
    key: "removeChild",
    value: function removeChild(item, col) {
      var data = this.state.data;
      var oldId = item.childItems[col];
      var oldItem = this.getDataById(oldId);

      if (oldItem) {
        var newData = data.filter(function (x) {
          return x !== oldItem;
        }); // eslint-disable-next-line no-param-reassign

        item.childItems[col] = null; // delete oldItem.parentId;

        this.seq = this.seq > 100000 ? 0 : this.seq + 1;

        _store["default"].dispatch('updateOrder', newData);

        this.setState({
          data: newData
        });
      }
    }
  }, {
    key: "restoreCard",
    value: function restoreCard(item, id) {
      var data = this.state.data;
      var parent = this.getDataById(item.data.parentId);
      var oldItem = this.getDataById(id);

      if (parent && oldItem) {
        var newIndex = data.indexOf(oldItem);

        var newData = _toConsumableArray(data); // data.filter(x => x !== oldItem);
        // eslint-disable-next-line no-param-reassign


        parent.childItems[oldItem.col] = null;
        delete oldItem.parentId; // eslint-disable-next-line no-param-reassign

        delete item.setAsChild; // eslint-disable-next-line no-param-reassign

        delete item.parentIndex; // eslint-disable-next-line no-param-reassign

        item.index = newIndex;
        this.seq = this.seq > 100000 ? 0 : this.seq + 1;

        _store["default"].dispatch('updateOrder', newData);

        this.setState({
          data: newData
        });
      }
    }
  }, {
    key: "insertCard",
    value: function insertCard(item, hoverIndex, id) {
      var data = this.state.data;

      if (id) {
        this.restoreCard(item, id);
      } else {
        data.splice(hoverIndex, 0, item);
        this.saveData(item, hoverIndex, hoverIndex);
      }
    }
  }, {
    key: "moveCard",
    value: function moveCard(dragIndex, hoverIndex) {
      var data = this.state.data;
      var dragCard = data[dragIndex];
      this.saveData(dragCard, dragIndex, hoverIndex);
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "cardPlaceHolder",
    value: function cardPlaceHolder(dragIndex, hoverIndex) {// Dummy
    }
  }, {
    key: "saveData",
    value: function saveData(dragCard, dragIndex, hoverIndex) {
      var newData = (0, _immutabilityHelper["default"])(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      });
      this.setState(newData);

      _store["default"].dispatch('updateOrder', newData.data);
    }
  }, {
    key: "getElement",
    value: function getElement(item, index) {
      if (item.custom) {
        if (!item.component || typeof item.component !== 'function') {
          // eslint-disable-next-line no-param-reassign
          item.component = this.props.registry.get(item.key);
        }
      }

      var SortableFormElement = _sortableFormElements["default"][item.element];

      if (SortableFormElement === null) {
        return null;
      }

      return /*#__PURE__*/_react["default"].createElement(SortableFormElement, {
        id: item.id,
        seq: this.seq,
        index: index,
        moveCard: this.moveCard,
        insertCard: this.insertCard,
        mutable: false,
        parent: this.props.parent,
        editModeOn: this.props.editModeOn,
        isDraggable: true,
        key: item.id,
        sortData: item.id,
        data: item,
        getDataById: this.getDataById,
        setAsChild: this.setAsChild,
        removeChild: this.removeChild,
        _onDestroy: this._onDestroy
      });
    }
  }, {
    key: "showEditForm",
    value: function showEditForm() {
      var _this4 = this;

      var handleUpdateElement = function handleUpdateElement(element) {
        return _this4.updateElement(element);
      };

      handleUpdateElement.bind(this);
      var formElementEditProps = {
        showCorrectColumn: this.props.showCorrectColumn,
        files: this.props.files,
        manualEditModeOff: this.manualEditModeOff,
        preview: this,
        element: this.props.editElement,
        updateElement: handleUpdateElement
      };
      return this.props.renderEditForm(formElementEditProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var classes = this.props.className;

      if (this.props.editMode) {
        classes += ' is-editing';
      }

      var data = this.state.data.filter(function (x) {
        return !!x && !x.parentId;
      });
      var items = data.map(function (item, index) {
        return _this5.getElement(item, index);
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: classes
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "edit-form",
        ref: this.editForm
      }, this.props.editElement !== null && this.showEditForm()), /*#__PURE__*/_react["default"].createElement("div", {
        className: "Sortable"
      }, items), /*#__PURE__*/_react["default"].createElement(PlaceHolder, {
        id: "form-place-holder",
        show: items.length === 0,
        index: items.length,
        moveCard: this.cardPlaceHolder,
        insertCard: this.insertCard
      }));
    }
  }]);

  return Preview;
}(_react["default"].Component);

exports["default"] = Preview;
Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: 'col-md-9 react-form-builder-preview float-left',
  renderEditForm: function renderEditForm(props) {
    return /*#__PURE__*/_react["default"].createElement(_formElementsEdit["default"], props);
  }
};