"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = require("react");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Custom hook for synchronizing changes across columns in a multi-column row
 * @param {Array} childItems - Array of rows with columns containing item IDs
 * @param {Function} getDataById - Function to get item data by ID
 * @param {Function} updateElement - Function to update an element
 * @returns {Function} syncColumnChanges function
 */
var useSyncColumnChanges = function useSyncColumnChanges(childItems, getDataById, updateElement) {
  var syncColumnChanges = (0, _react.useCallback)(function (rowIndex, columnIndex, elementType, changeData) {
    // Only sync for supported element types
    if (!['Checkboxes', 'RadioButtons', 'Dropdown', 'TextInput', 'NumberInput', 'TextArea', 'DatePicker', 'Signature', 'Signature2', 'FormulaInput', 'DataSource', 'FormLink'].includes(elementType)) {
      return;
    }

    // Go through each row
    childItems.forEach(function (row, rIdx) {
      // Skip the row that triggered the change
      if (rIdx === rowIndex) return;
      var itemId = row[columnIndex];
      if (!itemId) return;
      var itemData = getDataById(itemId);
      if (!itemData || itemData.element !== elementType) return;

      // Create a new updated element to apply changes
      var updatedItem = _objectSpread({}, itemData);

      // Apply changes based on element type and what was changed
      if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
        // For checkboxes/radio buttons
        if (changeData.options) {
          // Transfer option selection state but preserve option structure
          updatedItem.options = changeData.options.map(function (newOpt, idx) {
            if (idx < itemData.options.length) {
              return _objectSpread(_objectSpread({}, itemData.options[idx]), {}, {
                text: newOpt.text,
                // Update text
                value: newOpt.value,
                // Update value
                checked: newOpt.checked,
                // Update checked state
                selected: newOpt.selected // Update selected state
              });
            }
            return newOpt; // For new options
          });
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey;
        }
      } else if (elementType === 'Dropdown') {
        // For dropdowns
        if (changeData.options) {
          updatedItem.options = changeData.options.map(function (newOpt, idx) {
            if (idx < itemData.options.length) {
              return _objectSpread(_objectSpread({}, itemData.options[idx]), {}, {
                text: newOpt.text,
                value: newOpt.value
              });
            }
            return newOpt;
          });
        }
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey;
        }
      } else if (elementType === 'DataSource') {
        // For DataSource components
        if (changeData.sourceType !== undefined) {
          updatedItem.sourceType = changeData.sourceType;
        }
        if (changeData.formSource !== undefined) {
          updatedItem.formSource = changeData.formSource;
        }

        // Handle any selected item data
        if (changeData.selectedItem !== undefined) {
          updatedItem.selectedItem = changeData.selectedItem;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Make sure the DataSource is properly initialized
        updatedItem.initialized = true;
      } else if (elementType === 'Signature2') {
        // For Signature2 components
        if (changeData.position !== undefined) {
          updatedItem.position = changeData.position;
        }
        if (changeData.specificRole !== undefined) {
          updatedItem.specificRole = changeData.specificRole;
        }
        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync required property if it exists
        if (Object.prototype.hasOwnProperty.call(changeData, 'required')) {
          updatedItem.required = changeData.required;
        }

        // Sync readOnly property if it exists
        if (Object.prototype.hasOwnProperty.call(changeData, 'readOnly')) {
          updatedItem.readOnly = changeData.readOnly;
        }

        // Make sure the Signature2 is properly initialized
        updatedItem.initialized = true;
      } else if (elementType === 'FormLink') {
        // For FormLink components
        if (changeData.selectedFormId !== undefined) {
          updatedItem.selectedFormId = changeData.selectedFormId;
        }
        if (changeData.formName !== undefined) {
          updatedItem.formName = changeData.formName;
        }
        if (changeData.linkText !== undefined) {
          updatedItem.linkText = changeData.linkText;
        }
        if (changeData.openInNewWindow !== undefined) {
          updatedItem.openInNewWindow = changeData.openInNewWindow;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync any additional FormLink-specific properties
        if (changeData.buttonStyle !== undefined) {
          updatedItem.buttonStyle = changeData.buttonStyle;
        }
        if (changeData.className !== undefined) {
          updatedItem.className = changeData.className;
        }

        // Add missing FormLink props from the component
        if (changeData.formSource !== undefined) {
          updatedItem.formSource = changeData.formSource;
        }
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value;
        }
        if (changeData.isShowLabel !== undefined) {
          updatedItem.isShowLabel = changeData.isShowLabel;
        }
        if (changeData.pageBreakBefore !== undefined) {
          updatedItem.pageBreakBefore = changeData.pageBreakBefore;
        }

        // Sync dirty state
        if (Object.prototype.hasOwnProperty.call(changeData, 'dirty')) {
          updatedItem.dirty = changeData.dirty;
        }

        // Sync required property if it exists
        if (Object.prototype.hasOwnProperty.call(changeData, 'required')) {
          updatedItem.required = changeData.required;
        }

        // Sync readOnly property if it exists
        if (Object.prototype.hasOwnProperty.call(changeData, 'readOnly')) {
          updatedItem.readOnly = changeData.readOnly;
        }

        // Sync disabled property if it exists
        if (Object.prototype.hasOwnProperty.call(changeData, 'disabled')) {
          updatedItem.disabled = changeData.disabled;
        }

        // Sync style property if it exists
        if (changeData.style !== undefined) {
          updatedItem.style = changeData.style;
        }

        // Sync editor information
        if (changeData.editor !== undefined) {
          updatedItem.editor = changeData.editor;
        }

        // Sync form information properties
        if (changeData.formInfo !== undefined) {
          updatedItem.formInfo = changeData.formInfo;
        }

        // Sync default value properties
        if (changeData.defaultValue !== undefined) {
          updatedItem.defaultValue = changeData.defaultValue;
        }
      } else {
        // For other input types
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value;
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label;
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey;
        }
      }

      // If we created an updated item, apply the changes
      if (updatedItem && updateElement) {
        updateElement(updatedItem);
      }
    });
  }, [childItems, getDataById, updateElement]);
  return syncColumnChanges;
};
var _default = exports["default"] = useSyncColumnChanges;