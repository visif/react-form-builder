"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));
var _formElementsEdit = _interopRequireDefault(require("./form-elements-edit"));
var _useUndoRedo2 = _interopRequireWildcard(require("./functions/useUndoRedo"));
var _sortableFormElements = _interopRequireDefault(require("./sortable-form-elements"));
var _store = _interopRequireDefault(require("./stores/store"));
var _this = void 0;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PlaceHolder = _sortableFormElements.default.PlaceHolder;
var Preview = function Preview(props) {
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    data = _useState2[0],
    setData = _useState2[1];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    answerData = _useState4[0],
    setAnswerData = _useState4[1];
  var editForm = (0, _react.useRef)(null);
  var _useUndoRedo = (0, _useUndoRedo2.default)(),
    historyIndex = _useUndoRedo.index,
    history = _useUndoRedo.history,
    updateState = _useUndoRedo.updateState;
  var seq = 0;
  (0, _react.useEffect)(function () {
    var onLoad = props.onLoad,
      onPost = props.onPost,
      data = props.data,
      url = props.url,
      saveUrl = props.saveUrl;
    _store.default.setExternalHandler(onLoad, onPost);
    setData(data || []);
    setAnswerData({});
    seq = 0;
    _store.default.subscribe(function (state) {
      _onChange(state.payload);
    });
    _store.default.dispatch('load', {
      loadUrl: url,
      saveUrl: saveUrl,
      data: data || []
    });
    var editModeOff = function editModeOff(e) {
      if (editForm.current && !editForm.current.contains(e.target)) {
        manualEditModeOff();
      }
    };
    document.addEventListener('mousedown', editModeOff);
    return function () {
      document.removeEventListener('mousedown', editModeOff);
    };
  }, []);
  var manualEditModeOff = function manualEditModeOff() {
    var editElement = props.editElement;
    if (editElement && editElement.dirty) {
      editElement.dirty = false;
      updateElement(editElement);
    }
    props.manualEditModeOff();
  };
  var _setValue = function _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };
  var updateElement = function updateElement(element) {
    var found = false;
    for (var i = 0, len = data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element;
        found = true;
        break;
      }
    }
    if (found) {
      seq = seq > 100000 ? 0 : seq + 1;
      _store.default.dispatch('updateOrder', data);
    }
  };
  var _onChange = function _onChange(payload) {
    var data = payload.data,
      action = payload.action;
    var answerData = {};
    data.forEach(function (item) {
      if (item && item.readOnly && props.variables[item.variableKey]) {
        answerData[item.field_name] = props.variables[item.variableKey];
      }
    });
    setData(data);
    setAnswerData(answerData);
    if (typeof props.onChange === 'function') {
      props.onChange(data);
    }
    if (action !== _useUndoRedo2.ACTION.UNDO && action !== _useUndoRedo2.ACTION.REDO) {
      console.log('history index before: ', historyIndex);
      updateState(data, historyIndex);
    }
  };
  var _onDestroy = function _onDestroy(item) {
    if (item.childItems) {
      item.childItems.forEach(function (x) {
        var child = getDataById(x);
        if (child) {
          _store.default.dispatch('delete', child);
        }
      });
    }
    _store.default.dispatch('delete', item);
  };
  var getDataById = function getDataById(id) {
    var item = data.find(function (x) {
      return x && x.id === id;
    });
    return item;
  };
  var swapChildren = function swapChildren(item, child, col) {
    if (child.col !== undefined && item.id !== child.parentId) {
      return false;
    }
    if (!(child.col !== undefined && child.col !== col && item.childItems[col])) {
      // No child was assigned yet in both source and target.
      return false;
    }
    var oldId = item.childItems[col];
    var oldItem = getDataById(oldId);
    var oldCol = child.col;
    item.childItems[oldCol] = oldId;
    oldItem.col = oldCol;
    item.childItems[col] = child.id;
    child.col = col;
    _store.default.dispatch('updateOrder', data);
    return true;
  };
  var setAsChild = function setAsChild(item, child, col) {
    if (swapChildren(item, child, col)) {
      return;
    }
    var oldParent = getDataById(child.parentId);
    var oldCol = child.col;
    item.childItems[col] = child.id;
    child.col = col;
    child.parentId = item.id;
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
      newData = data.filter(function (x) {
        return toRemove.indexOf(x) === -1;
      });
    }
    if (!getDataById(child.id)) {
      newData.push(child);
    }
    _store.default.dispatch('updateOrder', newData);
  };
  var removeChild = function removeChild(item, col) {
    var oldId = item.childItems[col];
    var oldItem = getDataById(oldId);
    if (oldItem) {
      var newData = data.filter(function (x) {
        return x !== oldItem;
      });
      item.childItems[col] = null;
      seq = seq > 100000 ? 0 : seq + 1;
      _store.default.dispatch('updateOrder', newData);
      setData(newData);
    }
  };
  var restoreCard = function restoreCard(item, id) {
    var parent = getDataById(item.data.parentId);
    var oldItem = getDataById(id);
    if (parent && oldItem) {
      var newIndex = data.indexOf(oldItem);
      var newData = (0, _toConsumableArray2.default)(data);
      parent.childItems[oldItem.col] = null;
      delete oldItem.parentId;
      delete item.setAsChild;
      delete item.parentIndex;
      item.index = newIndex;
      seq = seq > 100000 ? 0 : seq + 1;
      _store.default.dispatch('updateOrder', newData);
      setData(newData);
    }
  };
  var insertCard = function insertCard(item, hoverIndex, id) {
    if (id) {
      restoreCard(item, id);
    } else {
      var newData = (0, _immutabilityHelper.default)(data, {
        $splice: [[hoverIndex, 0, item]]
      });
      saveData(item, hoverIndex, hoverIndex);
      setData(newData);
    }
  };
  var moveCard = function moveCard(dragIndex, hoverIndex) {
    var dragCard = data[dragIndex];
    saveData(dragCard, dragIndex, hoverIndex);
  };
  var cardPlaceHolder = function cardPlaceHolder(dragIndex, hoverIndex) {
    // Dummy
  };
  var saveData = function saveData(dragCard, dragIndex, hoverIndex) {
    var newData = (0, _immutabilityHelper.default)(data, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
    });
    setData(newData);
    _store.default.dispatch('updateOrder', newData);
  };
  var getElement = function getElement(item, index) {
    if (item.custom) {
      if (!item.component || typeof item.component !== 'function') {
        item.component = props.registry.get(item.key);
      }
    }
    var SortableFormElement = _sortableFormElements.default[item.element];
    if (SortableFormElement === null) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement(SortableFormElement, {
      id: item.id,
      key: item.id,
      seq: seq,
      index: index,
      moveCard: moveCard,
      insertCard: insertCard,
      mutable: false,
      parent: props.parent,
      editModeOn: props.editModeOn,
      isDraggable: true,
      sortData: item.id,
      data: item,
      getDataById: getDataById,
      setAsChild: setAsChild,
      removeChild: removeChild,
      _onDestroy: _onDestroy,
      getActiveUserProperties: props.getActiveUserProperties,
      getDataSource: function getDataSource(data) {
        if (data.sourceType === 'name') {
          return [{
            id: 1,
            name: 'NameA lastNameA'
          }, {
            id: 2,
            name: 'NameB lastNameB'
          }];
        }
        if (data.sourceType === 'department') {
          return [{
            id: 1,
            name: 'departmentA'
          }, {
            id: 2,
            name: 'departmentB'
          }];
        }
        if (data.sourceType === 'role') {
          return [{
            id: 1,
            name: 'roleA'
          }, {
            id: 2,
            name: 'roleB'
          }];
        }
        if (data.sourceType === 'form') {
          return [{
            id: 1,
            name: 'formA'
          }, {
            id: 2,
            name: 'formB'
          }];
        }
        return [];
      },
      onUploadFile: function onUploadFile(file) {
        return "".concat(file.name, "-").concat(Math.random() * 10000000);
      },
      onUploadImage: function onUploadImage(file) {
        return "path/".concat(file.name, "-").concat(Math.random() * 10000000);
      },
      onDownloadFile: function onDownloadFile(file) {
        return "download_".concat(file.name, "-").concat(Math.random() * 10000000);
      }
    });
  };
  var showEditForm = function showEditForm() {
    var handleUpdateElement = function handleUpdateElement(element) {
      return updateElement(element);
    };
    var formElementEditProps = {
      showCorrectColumn: props.showCorrectColumn,
      files: props.files,
      manualEditModeOff: manualEditModeOff,
      preview: _this,
      element: props.editElement,
      updateElement: handleUpdateElement,
      getFormSource: props.getFormSource,
      getFormContent: props.getFormContent,
      onImageUpload: props.onImageUpload
    };
    return props.renderEditForm(formElementEditProps);
  };
  var classes = props.className;
  if (props.editMode) {
    classes += ' is-editing';
  }
  var items = data.filter(function (item) {
    return !!item && !item.parentId;
  }).map(function (item, index) {
    return getElement(item, index);
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes,
    style: {
      height: '100%',
      scrollbarWidth: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "preview-toolbar"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      border: '1px solid #ddd',
      padding: 8,
      marginRight: '4px',
      backgroundColor: '#ffffff'
    },
    onClick: function onClick() {
      var event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true
      });
      document.dispatchEvent(event);
    }
  }, /*#__PURE__*/_react.default.createElement("i", {
    class: "fas fa-history",
    style: {
      marginRight: 8
    }
  }), "Undo"), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      border: '1px solid #ddd',
      padding: 8,
      backgroundColor: '#ffffff'
    },
    onClick: function onClick() {
      var event = new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true
      });
      document.dispatchEvent(event);
    }
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-redo",
    style: {
      marginRight: 8
    }
  }), "Redo")), /*#__PURE__*/_react.default.createElement("div", {
    className: "edit-form",
    ref: editForm
  }, props.editElement !== null && showEditForm()), /*#__PURE__*/_react.default.createElement("div", {
    className: "Sortable"
  }, items), /*#__PURE__*/_react.default.createElement(PlaceHolder, {
    id: "form-place-holder",
    show: items.length === 0,
    index: items.length,
    moveCard: cardPlaceHolder,
    insertCard: insertCard
  }));
};
Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: 'react-form-builder-preview',
  renderEditForm: function renderEditForm(props) {
    return /*#__PURE__*/_react.default.createElement(_formElementsEdit.default, props);
  }
};
var _default = Preview;
exports.default = _default;