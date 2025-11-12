/**
 * useRowSync Hook
 *
 * Handles synchronization of property changes across rows in multi-column layouts.
 * When an element in one row changes, this hook propagates those changes to
 * corresponding elements in other rows (only for DynamicColumnRow with sync enabled).
 */
import { useCallback } from 'react'

export const useRowSync = (getDataById, updateElement) => {
  // Function to synchronize changes across all elements in a column
  const syncRowChanges = useCallback(
    (changedElement) => {
      // Verify that this is an element in a multi-column row
      if (
        !changedElement.parentId ||
        changedElement.row === undefined ||
        changedElement.col === undefined
      ) {
        return
      }

      // Skip if this is an initial sync to prevent loops
      if (changedElement.isInitialSync) {
        return
      }

      // Skip if this change happened very recently (prevent rapid sync cycles)
      const currentTime = Date.now()
      if (changedElement.timestamp && currentTime - changedElement.timestamp < 100) {
        return
      }

      // Get the parent element (the row)
      const parentElement = getDataById(changedElement.parentId)
      if (
        !parentElement ||
        !parentElement.childItems ||
        parentElement.columns?.[changedElement.col].isSync === false
      ) {
        return
      }

      // Skip synchronization for non-dynamic columns - only synchronize in DynamicColumnRow elements
      if (parentElement.element !== 'DynamicColumnRow') {
        return
      }

      // Get the column index where this element resides
      const { col } = changedElement

      // Check if this is a user selection change (not structure change)
      // For RadioButtons and Checkboxes, we don't want to sync the checked/selected states
      const isSelectionChange =
        (changedElement.element === 'RadioButtons' || changedElement.element === 'Checkboxes') &&
        changedElement.options &&
        changedElement.options.some((opt) => opt.checked)

      // For DataSource, only sync user selections, not initialization
      const isDataSourceUserSelection =
        changedElement.element === 'DataSource' && changedElement.isUserSelection === true

      // If this is just a selection change in a form element, don't sync it to other rows
      // Exception: DataSource user selections should be synced
      if (isSelectionChange && !isDataSourceUserSelection) {
        return
      }

      parentElement.childItems.forEach((row, rowIndex) => {
        // Skip the row that triggered the change
        if (rowIndex === changedElement.row) return

        const itemId = row[col]
        if (!itemId) return

        const itemData = getDataById(itemId)
        if (!itemData || itemData.element !== changedElement.element) return

        const updatedItem = { ...itemData }
        let changed = false

        const commonProps = [
          'label',
          'required',
          'readOnly',
          'description',
          'showDescription',
          'className',
          'customCSS',
          'formSource',
        ]

        commonProps.forEach((prop) => {
          if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
            updatedItem[prop] = changedElement[prop]
            changed = true
          }
        })

        // Special synchronization rules for different element types
        switch (changedElement.element) {
          case 'Checkboxes':
          case 'RadioButtons':
            if (changedElement.options && itemData.options) {
              const newOptions = []

              changedElement.options.forEach((newOpt, idx) => {
                if (idx < itemData.options.length) {
                  newOptions.push({
                    ...itemData.options[idx],
                    text: newOpt.text,
                    value: newOpt.value,
                  })
                } else {
                  const newOption = {
                    text: newOpt.text,
                    value: newOpt.value,
                    key: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  }

                  if (
                    changedElement.element === 'Checkboxes' ||
                    changedElement.element === 'RadioButtons'
                  ) {
                    newOption.checked = false
                    newOption.selected = false
                  }

                  newOptions.push(newOption)
                }
              })

              // Only update if options changed
              if (
                newOptions.length !== itemData.options.length ||
                newOptions.some(
                  (opt, i) =>
                    opt.text !== itemData.options[i]?.text ||
                    opt.value !== itemData.options[i]?.value
                )
              ) {
                updatedItem.options = newOptions
                changed = true
              }
            }

            // Sync display properties (but not option-specific ones)
            if (changedElement.inline !== itemData.inline) {
              updatedItem.inline = changedElement.inline
              changed = true
            }

            // Sync capability flags but don't sync individual option selections
            ;['canHaveOptionCorrect', 'canHaveOptionValue', 'canHaveInfo'].forEach((prop) => {
              if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                updatedItem[prop] = changedElement[prop]
                changed = true
              }
            })
            break
          case 'TextInput':
          case 'NumberInput':
          case 'TextArea':
            // For text inputs, copy formularKey
            if (
              changedElement.formularKey !== undefined &&
              changedElement.formularKey !== itemData.formularKey
            ) {
              updatedItem.formularKey = changedElement.formularKey
              changed = true
            }
            break
          case 'DatePicker':
            // Sync date-specific properties
            ;['showTimeSelect', 'showTimeSelectOnly', 'defaultToday'].forEach((prop) => {
              if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                updatedItem[prop] = changedElement[prop]
                changed = true
              }
            })
            break

          case 'Range':
            // Sync range-specific properties
            ;['min_value', 'max_value', 'step', 'default_value', 'min_label', 'max_label'].forEach(
              (prop) => {
                if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                  updatedItem[prop] = changedElement[prop]
                  changed = true
                }
              }
            )
            break

          case 'Signature':
          case 'Signature2':
            updatedItem.position = changedElement.position
            updatedItem.specificRole = changedElement.specificRole
            updatedItem.label = changedElement.label
            changed = true
            break
          case 'Image':
            ;['center', 'width', 'height'].forEach((prop) => {
              if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                updatedItem[prop] = changedElement[prop]
                changed = true
              }
            })
            break

          case 'Paragraph':
          case 'Header':
            // Sync text styling properties
            ;['bold', 'italic', 'content'].forEach((prop) => {
              if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                updatedItem[prop] = changedElement[prop]
                changed = true
              }
            })
            break

          case 'FormulaInput':
            // Sync formula properties
            ;['formula', 'formularKey'].forEach((prop) => {
              if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                updatedItem[prop] = changedElement[prop]
                changed = true
              }
            })
            break

          case 'DataSource':
            // For DataSource, only sync structural properties and user selections
            // but handle them carefully to prevent infinite loops
            if (changedElement.isUserSelection) {
              // If this is a user selection, update the target element's state directly
              // but mark it as a sync operation to prevent cascading updates
              updatedItem.selectedItem = changedElement.selectedItem
              updatedItem.value = changedElement.value
              updatedItem.isSyncUpdate = true // Flag to prevent infinite loops
              changed = true
            } else {
              // Sync structural properties like sourceType, formSource, etc.
              ;['sourceType', 'formSource'].forEach((prop) => {
                if (changedElement[prop] !== undefined && changedElement[prop] !== itemData[prop]) {
                  updatedItem[prop] = changedElement[prop]
                  changed = true
                }
              })
            }
            break

          default:
            // For other element types, do a generic property sync
            if (changedElement.options && itemData.options) {
              updatedItem.options = [...itemData.options] // Clone options but don't change them
              changed = true
            }
        }

        // If any properties were changed, update the element
        if (changed) {
          updatedItem.dirty = true
          updateElement(updatedItem)
        }
      })
    },
    [getDataById, updateElement]
  )

  return {
    syncRowChanges,
  }
}
