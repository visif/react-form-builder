"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireWildcard(require("react"));
var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));
var _formElementsEdit = _interopRequireDefault(require("./form-elements-edit"));
var _useUndoRedo2 = _interopRequireWildcard(require("./functions/useUndoRedo"));
var _sortableFormElements = _interopRequireDefault(require("./sortable-form-elements"));
var _store = _interopRequireDefault(require("./stores/store"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PlaceHolder = _sortableFormElements["default"].PlaceHolder;
var Preview = function Preview(props) {
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    data = _useState2[0],
    setData = _useState2[1];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    answerData = _useState4[0],
    setAnswerData = _useState4[1];
  var editForm = (0, _react.useRef)(null);
  var _useUndoRedo = (0, _useUndoRedo2["default"])(),
    historyIndex = _useUndoRedo.index,
    updateState = _useUndoRedo.updateState;
  var seq = 0;
  (0, _react.useEffect)(function () {
    var onLoad = props.onLoad,
      onPost = props.onPost,
      data = props.data,
      url = props.url,
      saveUrl = props.saveUrl;
    _store["default"].setExternalHandler(onLoad, onPost);
    setData(data || []);
    setAnswerData({});
    seq = 0;
    _store["default"].subscribe(function (state) {
      _onChange(state.payload);
    });
    _store["default"].dispatch('load', {
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
  var updateElement = function updateElement(element) {
    // Debug: log incoming element updates from editor/child components
    if (typeof console !== 'undefined') {
      var _element$label, _element$label$slice, _element$options, _element$options$map;
      console.log('[Preview] updateElement called with', {
        id: element === null || element === void 0 ? void 0 : element.id,
        label: element === null || element === void 0 ? void 0 : (_element$label = element.label) === null || _element$label === void 0 ? void 0 : (_element$label$slice = _element$label.slice) === null || _element$label$slice === void 0 ? void 0 : _element$label$slice.call(_element$label, 0, 200),
        options: element === null || element === void 0 ? void 0 : (_element$options = element.options) === null || _element$options === void 0 ? void 0 : (_element$options$map = _element$options.map) === null || _element$options$map === void 0 ? void 0 : _element$options$map.call(_element$options, function (o) {
          return {
            text: o.text,
            value: o.value
          };
        })
      });
    }
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
      _store["default"].dispatch('updateOrder', data);

      // If the app-level editElement is open for this element, keep it in sync
      try {
        if (props.editElement && props.editElement.id === element.id && props.parent && typeof props.parent.setState === 'function') {
          props.parent.setState({
            editElement: element
          });
        }
      } catch (e) {
        // ignore errors updating parent state
      }
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
          _store["default"].dispatch('delete', child);
        }
      });
    }
    _store["default"].dispatch('delete', item);
  };
  var getDataById = function getDataById(id) {
    var item = data.find(function (x) {
      return x && x.id === id;
    });
    return item;
  };
  var swapChildren = function swapChildren(item, child, row, col) {
    if (child.row !== undefined && child.col !== undefined && item.id !== child.parentId) {
      return false;
    }
    if (child.row === undefined || child.col === undefined || child.row === row && child.col === col || !item.childItems[row][col]) {
      return false;
    }
    var oldId = item.childItems[row][col];
    var oldItem = getDataById(oldId);
    var oldRow = child.row || 0;
    var oldCol = child.col;
    item.childItems[oldRow][oldCol] = oldId;
    oldItem.row = oldRow;
    oldItem.col = oldCol;
    item.childItems[row][col] = child.id;
    child.row = row;
    child.col = col;
    _store["default"].dispatch('updateOrder', data);
    return true;
  };
  var setAsChild = function setAsChild(item, child, row, col) {
    var _item$element;
    if (swapChildren(item, child, row, col)) {
      return;
    }

    // Keep track of all data modifications
    var updatedData = (0, _toConsumableArray2["default"])(data);

    // Handle the original drop first
    var oldParent = getDataById(child.parentId);
    var oldRow = child.row;
    var oldCol = child.col;

    // Update the child properties
    item.childItems[row][col] = child.id;
    child.row = row;
    child.col = col;
    child.parentId = item.id;
    child.parentIndex = updatedData.indexOf(item);

    // Set hideLabel to true ONLY for elements in Dynamic Columns, not other column types
    if (item.element === 'DynamicColumnRow') {
      child.hideLabel = true;
    } else if ((_item$element = item.element) !== null && _item$element !== void 0 && _item$element.includes('ColumnRow')) {
      if (child.hideLabel === true) {
        delete child.hideLabel;
      }
    }

    // Handle old parent reference
    if (oldParent) {
      oldParent.childItems[oldRow][oldCol] = null;
    }

    // If this element isn't in our data array yet (new element), add it
    if (!getDataById(child.id)) {
      updatedData.push(child);
    }
    if (item.childItems.length > 1 && item.columns[col].isSync !== false) {
      var rowsToUpdate = [];
      var _loop = function _loop() {
        // Skip the current row as it already has the element
        if (rowIndex !== row) {
          var existingElementId = item.childItems[rowIndex][col];
          if (existingElementId) {
            var existingElement = getDataById(existingElementId);
            if (existingElement) {
              updatedData = updatedData.filter(function (x) {
                return x !== existingElement;
              });
            }
          }

          // Create a new instance of the same element type with minimal shared properties
          var elementType = child.element;

          // Create a fresh timestamp to ensure uniqueness in IDs
          var timestamp = Date.now() + rowIndex;

          // Create a fresh element of the same type
          var newElement = _objectSpread(_objectSpread({
            // Core properties that define the element type
            element: elementType,
            // Create a truly unique ID for this instance
            id: "".concat(elementType, "_").concat(timestamp, "_").concat(rowIndex, "_").concat(Math.floor(Math.random() * 10000)),
            // Position properties
            row: rowIndex,
            col: col,
            parentId: item.id,
            parentIndex: updatedData.indexOf(item)
          }, item.element === 'DynamicColumnRow' ? {
            hideLabel: true
          } : {}), {}, {
            // Copy specific type-related properties from the original element
            // but leave data fields empty or with defaults
            field_name: "".concat(elementType, "_").concat(rowIndex, "_").concat(col, "_").concat(timestamp),
            // Each element gets its own separate local state for user input
            dirty: false
          });

          // Copy all styling and display properties
          var propertiesToCopy = ['label', 'required', 'bold', 'italic', 'center', 'className', 'inline', 'readOnly', 'canHaveDisplayHorizontal', 'content', 'showDescription', 'description', 'text', 'showTimeSelect', 'showTimeSelectOnly', 'step', 'min_value', 'max_value', 'customCSS', 'defaultValue', 'default_today'];
          propertiesToCopy.forEach(function (prop) {
            if (child[prop] !== undefined) {
              newElement[prop] = child[prop];
            }
          });

          // Handle specific element types
          switch (elementType) {
            case 'Checkboxes':
            case 'RadioButtons':
            case 'Dropdown':
              // For checkboxes and radio buttons, completely recreate the options array
              // with the same text values but reset all selected states
              if (child.options && Array.isArray(child.options)) {
                newElement.options = child.options.map(function (option) {
                  return {
                    value: option.value,
                    text: option.text,
                    key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9)),
                    checked: false,
                    selected: false
                  };
                });

                // Set default display properties
                newElement.inline = child.inline || false;
                newElement.canHaveDisplayHorizontal = child.canHaveDisplayHorizontal;
                newElement.canHaveOptionCorrect = child.canHaveOptionCorrect;
                newElement.canHaveOptionValue = child.canHaveOptionValue;
                if (child.canHaveInfo) newElement.canHaveInfo = child.canHaveInfo;
              }
              break;
            case 'FormulaInput':
              // Formula inputs need to copy formula and formularKey properties
              if (child.formula !== undefined) {
                newElement.formula = child.formula;
              }
              if (child.formularKey !== undefined) {
                newElement.formularKey = child.formularKey;
              }
              break;
            case 'TextInput':
            case 'NumberInput':
            case 'TextArea':
              // Text inputs need to copy formularKey if it exists
              if (child.formularKey !== undefined) {
                newElement.formularKey = child.formularKey;
              }
              break;
            default:
              // For other elements with options, do a generic clone
              if (child.options) {
                newElement.options = JSON.parse(JSON.stringify(child.options));

                // Ensure options have unique keys
                if (Array.isArray(newElement.options)) {
                  newElement.options = newElement.options.map(function (opt) {
                    return _objectSpread(_objectSpread({}, opt), {}, {
                      key: "".concat(timestamp, "_").concat(Math.random().toString(36).substring(2, 9))
                    });
                  });
                }
              }
          }

          // Always copy formula properties to ensure they're available for all element types that need them
          var formulaProps = ['formula', 'formularKey'];
          formulaProps.forEach(function (prop) {
            if (child[prop] !== undefined) {
              newElement[prop] = child[prop];
            }
          });

          // Add to our tracking array
          rowsToUpdate.push({
            rowIndex: rowIndex,
            newElement: newElement
          });
        }
      };
      for (var rowIndex = 0; rowIndex < item.childItems.length; rowIndex++) {
        _loop();
      }

      // Apply all element clones at once
      rowsToUpdate.forEach(function (_ref) {
        var rowIndex = _ref.rowIndex,
          newElement = _ref.newElement;
        item.childItems[rowIndex][col] = newElement.id;
        updatedData.push(newElement);
      });
    }

    // Clean up any orphaned elements
    var list = updatedData.filter(function (x) {
      return x && x.parentId === item.id;
    });
    var flatChildItems = item.childItems.flat().filter(Boolean);
    var toRemove = list.filter(function (x) {
      return !flatChildItems.includes(x.id);
    });
    if (toRemove.length) {
      updatedData = updatedData.filter(function (x) {
        return toRemove.indexOf(x) === -1;
      });
    }

    // Update sequence number
    seq = seq > 100000 ? 0 : seq + 1;

    // Update the state once with all changes
    setData(updatedData);

    // Dispatch the final update to the store
    _store["default"].dispatch('updateOrder', updatedData);
  };
  var removeChild = function removeChild(item) {
    var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var col = arguments.length > 2 ? arguments[2] : undefined;
    // Create a working copy of the data
    var newData = (0, _toConsumableArray2["default"])(data);
    // Track any elements that need to be removed
    var elementsToRemove = [];

    // Loop through all rows in the grid
    for (var rowIndex = 0; rowIndex < item.childItems.length; rowIndex++) {
      // Get the element ID in this column for the current row
      var elementId = item.childItems[rowIndex][col];
      if (elementId) {
        // Find the element to be removed
        var elementToRemove = getDataById(elementId);
        if (elementToRemove) {
          // Add it to our list of elements to remove
          elementsToRemove.push(elementToRemove);
          // Set the reference to null in the childItems array
          item.childItems[rowIndex][col] = null;
        }
      }
    }

    // Remove all collected elements from the data array
    if (elementsToRemove.length > 0) {
      newData = newData.filter(function (x) {
        return !elementsToRemove.includes(x);
      });

      // Update sequence number
      seq = seq > 100000 ? 0 : seq + 1;

      // Update the state and store
      _store["default"].dispatch('updateOrder', newData);
      setData(newData);
    }
  };
  var restoreCard = function restoreCard(item, id) {
    var parent = getDataById(item.data.parentId);
    var oldItem = getDataById(id);
    if (parent && oldItem) {
      var newIndex = data.indexOf(oldItem);
      var newData = (0, _toConsumableArray2["default"])(data);
      parent.childItems[oldItem.col] = null;
      delete oldItem.parentId;
      delete item.setAsChild;
      delete item.parentIndex;
      item.index = newIndex;
      seq = seq > 100000 ? 0 : seq + 1;
      _store["default"].dispatch('updateOrder', newData);
      setData(newData);
    }
  };
  var insertCard = function insertCard(item, hoverIndex, id) {
    if (id) {
      restoreCard(item, id);
    } else {
      var newData = (0, _immutabilityHelper["default"])(data, {
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
    var newData = (0, _immutabilityHelper["default"])(data, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
    });
    setData(newData);
    _store["default"].dispatch('updateOrder', newData);
  };
  var getElement = function getElement(item, index) {
    if (item.custom) {
      if (!item.component || typeof item.component !== 'function') {
        item.component = props.registry.get(item.key);
      }
    }
    var SortableFormElement = _sortableFormElements["default"][item.element];
    if (SortableFormElement === null) {
      return null;
    }
    return /*#__PURE__*/_react["default"].createElement(SortableFormElement, {
      id: item.id,
      key: item.id,
      seq: seq,
      index: index,
      moveCard: moveCard,
      insertCard: insertCard,
      mutable: true // Set to true to make inputs interactive
      ,
      preview: true // Add preview prop to identify preview mode
      ,
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
      onElementChange: syncRowChanges // Add callback for syncing changes in preview
      ,
      updateElement: updateElement // Pass updateElement for state changes
      ,
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
      getFormSource: props.getFormSource,
      getFormContent: props.getFormContent,
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
    var _previewObject;
    var handleUpdateElement = function handleUpdateElement(element) {
      updateElement(element);

      // Directly call syncRowChanges here if the element is part of a multi-column row
      if (element.parentId && element.row !== undefined && element.col !== undefined) {
        syncRowChanges(element);
      }
    };

    // Create a preview object with all required methods directly accessible
    var previewObject = (_previewObject = {
      syncRowChanges: syncRowChanges,
      updateElement: handleUpdateElement,
      getDataById: getDataById,
      state: {
        data: data
      }
    }, (0, _defineProperty2["default"])(_previewObject, "getDataById", getDataById), (0, _defineProperty2["default"])(_previewObject, "updateElement", handleUpdateElement), _previewObject);
    var formElementEditProps = {
      showCorrectColumn: props.showCorrectColumn,
      files: props.files,
      manualEditModeOff: manualEditModeOff,
      // Pass the enhanced preview object
      preview: previewObject,
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

  // Function to synchronize changes across all elements in a column
  var syncRowChanges = function syncRowChanges(changedElement) {
    var _parentElement$column;
    // Verify that this is an element in a multi-column row
    if (!changedElement.parentId || changedElement.row === undefined || changedElement.col === undefined) {
      return;
    }

    // Skip if this is an initial sync to prevent loops
    if (changedElement.isInitialSync) {
      return;
    }

    // Skip if this change happened very recently (prevent rapid sync cycles)
    var currentTime = Date.now();
    if (changedElement.timestamp && currentTime - changedElement.timestamp < 100) {
      return;
    }

    // Get the parent element (the row)
    var parentElement = getDataById(changedElement.parentId);
    if (!parentElement || !parentElement.childItems || ((_parentElement$column = parentElement.columns) === null || _parentElement$column === void 0 ? void 0 : _parentElement$column[changedElement.col].isSync) === false) {
      return;
    }

    // Skip synchronization for non-dynamic columns - only synchronize in DynamicColumnRow elements
    if (parentElement.element !== 'DynamicColumnRow') {
      return;
    }

    // Get the column index where this element resides
    var col = changedElement.col;

    // Check if this is a user selection change (not structure change)
    // For RadioButtons and Checkboxes, we don't want to sync the checked/selected states
    var isSelectionChange = (changedElement.element === 'RadioButtons' || changedElement.element === 'Checkboxes') && changedElement.options && changedElement.options.some(function (opt) {
      return opt.checked;
    });

    // For DataSource, only sync user selections, not initialization
    var isDataSourceUserSelection = changedElement.element === 'DataSource' && changedElement.isUserSelection === true;

    // If this is just a selection change in a form element, don't sync it to other rows
    // Exception: DataSource user selections should be synced
    if (isSelectionChange && !isDataSourceUserSelection) {
      return;
    }
    parentElement.childItems.forEach(function (row, rowIndex) {
      // Skip the row that triggered the change
      if (rowIndex === changedElement.row) return;
      var itemId = row[col];
      if (!itemId) return;
      var itemData = getDataById(itemId);
      if (!itemData || itemData.element !== changedElement.element) return;
      var updatedItem = _objectSpread({}, itemData);
      var changed = false;
      var commonProps = ['label', 'required', 'readOnly', 'description', 'showDescription', 'className', 'customCSS', 'formSource'];
      commonProps.forEach(function (prop) {
        if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
          updatedItem[prop] = changedElement[prop];
          changed = true;
        }
      });

      // Special synchronization rules for different element types
      switch (changedElement.element) {
        case 'Checkboxes':
        case 'RadioButtons':
          if (changedElement.options && itemData.options) {
            var newOptions = [];
            changedElement.options.forEach(function (newOpt, idx) {
              if (idx < itemData.options.length) {
                newOptions.push(_objectSpread(_objectSpread({}, itemData.options[idx]), {}, {
                  text: newOpt.text,
                  value: newOpt.value
                }));
              } else {
                var newOption = {
                  text: newOpt.text,
                  value: newOpt.value,
                  key: "".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9))
                };
                if (changedElement.element === 'Checkboxes' || changedElement.element === 'RadioButtons') {
                  newOption.checked = false;
                  newOption.selected = false;
                }
                newOptions.push(newOption);
              }
            });

            // Only update if options changed
            if (newOptions.length !== itemData.options.length || newOptions.some(function (opt, i) {
              var _itemData$options$i, _itemData$options$i2;
              return opt.text !== ((_itemData$options$i = itemData.options[i]) === null || _itemData$options$i === void 0 ? void 0 : _itemData$options$i.text) || opt.value !== ((_itemData$options$i2 = itemData.options[i]) === null || _itemData$options$i2 === void 0 ? void 0 : _itemData$options$i2.value);
            })) {
              updatedItem.options = newOptions;
              changed = true;
            }
          }

          // Sync display properties (but not option-specific ones)
          if (changedElement.inline !== itemData.inline) {
            updatedItem.inline = changedElement.inline;
            changed = true;
          }

          // Sync capability flags but don't sync individual option selections
          ;
          ['canHaveOptionCorrect', 'canHaveOptionValue', 'canHaveInfo'].forEach(function (prop) {
            if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
              updatedItem[prop] = changedElement[prop];
              changed = true;
            }
          });
          break;
        case 'TextInput':
        case 'NumberInput':
        case 'TextArea':
          // For text inputs, copy formularKey
          if (changedElement.formularKey !== undefined && changedElement.formularKey !== itemData.formularKey) {
            updatedItem.formularKey = changedElement.formularKey;
            changed = true;
          }
          break;
        case 'DatePicker':
          // Sync date-specific properties
          ;
          ['showTimeSelect', 'showTimeSelectOnly', 'defaultToday'].forEach(function (prop) {
            if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
              updatedItem[prop] = changedElement[prop];
              changed = true;
            }
          });
          break;
        case 'Range':
          // Sync range-specific properties
          ;
          ['min_value', 'max_value', 'step', 'default_value', 'min_label', 'max_label'].forEach(function (prop) {
            if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
              updatedItem[prop] = changedElement[prop];
              changed = true;
            }
          });
          break;
        case 'Signature':
        case 'Signature2':
          updatedItem.position = changedElement.position;
          updatedItem.specificRole = changedElement.specificRole;
          updatedItem.label = changedElement.label;
          changed = true;
          break;
        case 'Image':
          ;
          ['center', 'width', 'height'].forEach(function (prop) {
            if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
              updatedItem[prop] = changedElement[prop];
              changed = true;
            }
          });
          break;
        case 'Paragraph':
        case 'Header':
          // Sync text styling properties
          ;
          ['bold', 'italic', 'content'].forEach(function (prop) {
            if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
              updatedItem[prop] = changedElement[prop];
              changed = true;
            }
          });
          break;
        case 'FormulaInput':
          // Sync formula properties
          ;
          ['formula', 'formularKey'].forEach(function (prop) {
            if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
              updatedItem[prop] = changedElement[prop];
              changed = true;
            }
          });
          break;
        case 'DataSource':
          // For DataSource, only sync structural properties and user selections
          // but handle them carefully to prevent infinite loops
          if (changedElement.isUserSelection) {
            // If this is a user selection, update the target element's state directly
            // but mark it as a sync operation to prevent cascading updates
            updatedItem.selectedItem = changedElement.selectedItem;
            updatedItem.value = changedElement.value;
            updatedItem.isSyncUpdate = true; // Flag to prevent infinite loops
            changed = true;
          } else {
            // Sync structural properties like sourceType, formSource, etc.
            ;
            ['sourceType', 'formSource'].forEach(function (prop) {
              if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                updatedItem[prop] = changedElement[prop];
                changed = true;
              }
            });
          }
          break;
        default:
          // For other element types, do a generic property sync
          if (changedElement.options && itemData.options) {
            updatedItem.options = (0, _toConsumableArray2["default"])(itemData.options); // Clone options but don't change them
            changed = true;
          }
      }

      // If any properties were changed, update the element
      if (changed) {
        updatedItem.dirty = true;
        updateElement(updatedItem);
      }
    });
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes,
    style: {
      scrollbarWidth: 'none'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "preview-toolbar"
  }, /*#__PURE__*/_react["default"].createElement("span", {
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
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-history",
    style: {
      marginRight: 8
    }
  }), "Undo"), /*#__PURE__*/_react["default"].createElement("span", {
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
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "fas fa-redo",
    style: {
      marginRight: 8
    }
  }), "Redo")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "edit-form",
    ref: editForm
  }, props.editElement !== null && showEditForm()), /*#__PURE__*/_react["default"].createElement("div", {
    className: "Sortable"
  }, items), /*#__PURE__*/_react["default"].createElement(PlaceHolder, {
    id: "form-place-holder",
    show: true,
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
    return /*#__PURE__*/_react["default"].createElement(_formElementsEdit["default"], props);
  }
};
var _default = Preview;
exports["default"] = _default;