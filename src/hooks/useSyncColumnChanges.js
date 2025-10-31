import { useCallback } from 'react'

/**
 * Custom hook for synchronizing changes across columns in a multi-column row
 * @param {Array} childItems - Array of rows with columns containing item IDs
 * @param {Function} getDataById - Function to get item data by ID
 * @param {Function} updateElement - Function to update an element
 * @returns {Function} syncColumnChanges function
 */
const useSyncColumnChanges = (childItems, getDataById, updateElement) => {
  const syncColumnChanges = useCallback(
    (rowIndex, columnIndex, elementType, changeData) => {
      // Only sync for supported element types
      if (
        ![
          'Checkboxes',
          'RadioButtons',
          'Dropdown',
          'TextInput',
          'NumberInput',
          'TextArea',
          'DatePicker',
          'Signature',
          'Signature2',
          'FormulaInput',
          'DataSource',
          'FormLink',
        ].includes(elementType)
      ) {
        return
      }

      // Go through each row
      childItems.forEach((row, rIdx) => {
        // Skip the row that triggered the change
        if (rIdx === rowIndex) return

        const itemId = row[columnIndex]
        if (!itemId) return

        const itemData = getDataById(itemId)
        if (!itemData || itemData.element !== elementType) return

        // Create a new updated element to apply changes
        const updatedItem = {
          ...itemData,
        }

        // Apply changes based on element type and what was changed
        if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
          // For checkboxes/radio buttons
          if (changeData.options) {
            // Transfer option selection state but preserve option structure
            updatedItem.options = changeData.options.map((newOpt, idx) => {
              if (idx < itemData.options.length) {
                return {
                  ...itemData.options[idx],
                  text: newOpt.text, // Update text
                  value: newOpt.value, // Update value
                  checked: newOpt.checked, // Update checked state
                  selected: newOpt.selected, // Update selected state
                }
              }
              return newOpt // For new options
            })
          }

          // Handle label changes
          if (changeData.label !== undefined && changeData.label !== itemData.label) {
            updatedItem.label = changeData.label
          }

          // Sync formularKey if it exists
          if (changeData.formularKey !== undefined) {
            updatedItem.formularKey = changeData.formularKey
          }
        } else if (elementType === 'Dropdown') {
          // For dropdowns
          if (changeData.options) {
            updatedItem.options = changeData.options.map((newOpt, idx) => {
              if (idx < itemData.options.length) {
                return {
                  ...itemData.options[idx],
                  text: newOpt.text,
                  value: newOpt.value,
                }
              }
              return newOpt
            })
          }

          if (changeData.value !== undefined) {
            updatedItem.value = changeData.value
          }

          // Handle label changes
          if (changeData.label !== undefined && changeData.label !== itemData.label) {
            updatedItem.label = changeData.label
          }

          // Sync formularKey if it exists
          if (changeData.formularKey !== undefined) {
            updatedItem.formularKey = changeData.formularKey
          }
        } else if (elementType === 'DataSource') {
          // For DataSource components
          if (changeData.sourceType !== undefined) {
            updatedItem.sourceType = changeData.sourceType
          }

          if (changeData.formSource !== undefined) {
            updatedItem.formSource = changeData.formSource
          }

          // Handle any selected item data
          if (changeData.selectedItem !== undefined) {
            updatedItem.selectedItem = changeData.selectedItem
          }

          // Handle label changes
          if (changeData.label !== undefined && changeData.label !== itemData.label) {
            updatedItem.label = changeData.label
          }

          // Make sure the DataSource is properly initialized
          updatedItem.initialized = true
        } else if (elementType === 'Signature2') {
          // For Signature2 components
          if (changeData.position !== undefined) {
            updatedItem.position = changeData.position
          }
          if (changeData.specificRole !== undefined) {
            updatedItem.specificRole = changeData.specificRole
          }
          // Handle label changes
          if (changeData.label !== undefined && changeData.label !== itemData.label) {
            updatedItem.label = changeData.label
          }

          // Sync required property if it exists
          if (Object.prototype.hasOwnProperty.call(changeData, 'required')) {
            updatedItem.required = changeData.required
          }

          // Sync readOnly property if it exists
          if (Object.prototype.hasOwnProperty.call(changeData, 'readOnly')) {
            updatedItem.readOnly = changeData.readOnly
          }

          // Make sure the Signature2 is properly initialized
          updatedItem.initialized = true
        } else if (elementType === 'FormLink') {
          // For FormLink components
          if (changeData.selectedFormId !== undefined) {
            updatedItem.selectedFormId = changeData.selectedFormId
          }

          if (changeData.formName !== undefined) {
            updatedItem.formName = changeData.formName
          }

          if (changeData.linkText !== undefined) {
            updatedItem.linkText = changeData.linkText
          }

          if (changeData.openInNewWindow !== undefined) {
            updatedItem.openInNewWindow = changeData.openInNewWindow
          }

          // Handle label changes
          if (changeData.label !== undefined && changeData.label !== itemData.label) {
            updatedItem.label = changeData.label
          }

          // Sync any additional FormLink-specific properties
          if (changeData.buttonStyle !== undefined) {
            updatedItem.buttonStyle = changeData.buttonStyle
          }

          if (changeData.className !== undefined) {
            updatedItem.className = changeData.className
          }

          // Add missing FormLink props from the component
          if (changeData.formSource !== undefined) {
            updatedItem.formSource = changeData.formSource
          }

          if (changeData.value !== undefined) {
            updatedItem.value = changeData.value
          }

          if (changeData.isShowLabel !== undefined) {
            updatedItem.isShowLabel = changeData.isShowLabel
          }

          if (changeData.pageBreakBefore !== undefined) {
            updatedItem.pageBreakBefore = changeData.pageBreakBefore
          }

          // Sync dirty state
          if (Object.prototype.hasOwnProperty.call(changeData, 'dirty')) {
            updatedItem.dirty = changeData.dirty
          }

          // Sync required property if it exists
          if (Object.prototype.hasOwnProperty.call(changeData, 'required')) {
            updatedItem.required = changeData.required
          }

          // Sync readOnly property if it exists
          if (Object.prototype.hasOwnProperty.call(changeData, 'readOnly')) {
            updatedItem.readOnly = changeData.readOnly
          }

          // Sync disabled property if it exists
          if (Object.prototype.hasOwnProperty.call(changeData, 'disabled')) {
            updatedItem.disabled = changeData.disabled
          }

          // Sync style property if it exists
          if (changeData.style !== undefined) {
            updatedItem.style = changeData.style
          }

          // Sync editor information
          if (changeData.editor !== undefined) {
            updatedItem.editor = changeData.editor
          }

          // Sync form information properties
          if (changeData.formInfo !== undefined) {
            updatedItem.formInfo = changeData.formInfo
          }

          // Sync default value properties
          if (changeData.defaultValue !== undefined) {
            updatedItem.defaultValue = changeData.defaultValue
          }
        } else {
          // For other input types
          if (changeData.value !== undefined) {
            updatedItem.value = changeData.value
          }

          // Handle label changes
          if (changeData.label !== undefined && changeData.label !== itemData.label) {
            updatedItem.label = changeData.label
          }

          // Sync formularKey if it exists
          if (changeData.formularKey !== undefined) {
            updatedItem.formularKey = changeData.formularKey
          }
        }

        // If we created an updated item, apply the changes
        if (updatedItem && updateElement) {
          updateElement(updatedItem)
        }
      })
    },
    [childItems, getDataById, updateElement]
  )

  return syncColumnChanges
}

export default useSyncColumnChanges
