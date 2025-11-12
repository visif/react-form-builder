/**
 * useElementManagement Hook
 *
 * Handles element CRUD operations in the form builder:
 * - Getting elements by ID
 * - Updating element properties
 * - Managing parent-child relationships
 * - Handling element deletion
 */
import { useCallback } from 'react'
import store from '../../../../contexts/FormBuilderContext'

export const useElementManagement = (data, setData, seq) => {
  // Get element by ID from data array
  const getDataById = useCallback(
    (id) => {
      const item = data.find((x) => x && x.id === id)
      return item
    },
    [data]
  )

  // Update a single element in the data array
  const updateElement = useCallback(
    (element) => {
      let found = false
      const newData = [...data]

      for (let i = 0, len = newData.length; i < len; i++) {
        if (element.id === newData[i].id) {
          newData[i] = element
          found = true
          break
        }
      }

      if (found) {
        seq.current = seq.current > 100000 ? 0 : seq.current + 1
        store.dispatch('updateOrder', newData)
      }
    },
    [data, seq]
  )

  // Delete an element and its children
  const destroyElement = useCallback(
    (item) => {
      if (item.childItems) {
        item.childItems.forEach((x) => {
          const child = getDataById(x)
          if (child) {
            store.dispatch('delete', child)
          }
        })
      }
      store.dispatch('delete', item)
    },
    [getDataById]
  )

  // Swap two child elements within a parent
  const swapChildren = useCallback(
    (item, child, row, col) => {
      if (child.row !== undefined && child.col !== undefined && item.id !== child.parentId) {
        return false
      }

      if (
        child.row === undefined ||
        child.col === undefined ||
        (child.row === row && child.col === col) ||
        !item.childItems[row][col]
      ) {
        return false
      }

      const oldId = item.childItems[row][col]
      const oldItem = getDataById(oldId)
      const oldRow = child.row || 0
      const oldCol = child.col

      item.childItems[oldRow][oldCol] = oldId
      oldItem.row = oldRow
      oldItem.col = oldCol

      item.childItems[row][col] = child.id
      child.row = row
      child.col = col

      store.dispatch('updateOrder', data)
      return true
    },
    [data, getDataById]
  )

  // Set an element as a child of another element (complex parent-child relationship with syncing)
  const setAsChild = useCallback(
    (item, child, row, col) => {
      if (swapChildren(item, child, row, col)) {
        return
      }

      // Keep track of all data modifications
      let updatedData = [...data]

      // Handle the original drop first
      const oldParent = getDataById(child.parentId)
      const oldRow = child.row
      const oldCol = child.col

      // Update the child properties
      item.childItems[row][col] = child.id
      child.row = row
      child.col = col
      child.parentId = item.id
      child.parentIndex = updatedData.indexOf(item)

      // Set hideLabel to true ONLY for elements in Dynamic Columns, not other column types
      if (item.element === 'DynamicColumnRow') {
        child.hideLabel = true
      } else if (item.element?.includes('ColumnRow')) {
        if (child.hideLabel === true) {
          delete child.hideLabel
        }
      }

      // Handle old parent reference
      if (oldParent) {
        oldParent.childItems[oldRow][oldCol] = null
      }

      // If this element isn't in our data array yet (new element), add it
      if (!getDataById(child.id)) {
        updatedData.push(child)
      }

      if (item.childItems.length > 1 && item.columns[col].isSync !== false) {
        const rowsToUpdate = []

        for (let rowIndex = 0; rowIndex < item.childItems.length; rowIndex++) {
          // Skip the current row as it already has the element
          if (rowIndex !== row) {
            const existingElementId = item.childItems[rowIndex][col]
            if (existingElementId) {
              const existingElement = getDataById(existingElementId)
              if (existingElement) {
                updatedData = updatedData.filter((x) => x !== existingElement)
              }
            }

            // Create a new instance of the same element type with minimal shared properties
            const elementType = child.element

            // Create a fresh timestamp to ensure uniqueness in IDs
            const timestamp = Date.now() + rowIndex

            // Create a fresh element of the same type
            const newElement = {
              // Core properties that define the element type
              element: elementType,

              // Create a truly unique ID for this instance
              id: `${elementType}_${timestamp}_${rowIndex}_${Math.floor(Math.random() * 10000)}`,

              // Position properties
              row: rowIndex,
              col,
              parentId: item.id,
              parentIndex: updatedData.indexOf(item),

              // Only hide labels in DynamicColumnRow, not other column types
              ...(item.element === 'DynamicColumnRow' ? { hideLabel: true } : {}),

              // Copy specific type-related properties from the original element
              // but leave data fields empty or with defaults
              field_name: `${elementType}_${rowIndex}_${col}_${timestamp}`,

              // Each element gets its own separate local state for user input
              dirty: false,
            }

            // Copy all styling and display properties
            const propertiesToCopy = [
              'label',
              'required',
              'bold',
              'italic',
              'center',
              'className',
              'inline',
              'readOnly',
              'canHaveDisplayHorizontal',
              'content',
              'showDescription',
              'description',
              'text',
              'showTimeSelect',
              'showTimeSelectOnly',
              'step',
              'min_value',
              'max_value',
              'customCSS',
              'defaultValue',
              'default_today',
            ]

            propertiesToCopy.forEach((prop) => {
              if (child[prop] !== undefined) {
                newElement[prop] = child[prop]
              }
            })

            // Handle specific element types
            switch (elementType) {
              case 'Checkboxes':
              case 'RadioButtons':
              case 'Dropdown':
                // For checkboxes and radio buttons, completely recreate the options array
                // with the same text values but reset all selected states
                if (child.options && Array.isArray(child.options)) {
                  newElement.options = child.options.map((option) => ({
                    value: option.value,
                    text: option.text,
                    key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                    checked: false,
                    selected: false,
                  }))

                  // Set default display properties
                  newElement.inline = child.inline || false
                  newElement.canHaveDisplayHorizontal = child.canHaveDisplayHorizontal
                  newElement.canHaveOptionCorrect = child.canHaveOptionCorrect
                  newElement.canHaveOptionValue = child.canHaveOptionValue
                  if (child.canHaveInfo) newElement.canHaveInfo = child.canHaveInfo
                }
                break

              case 'FormulaInput':
                // Formula inputs need to copy formula and formularKey properties
                if (child.formula !== undefined) {
                  newElement.formula = child.formula
                }
                if (child.formularKey !== undefined) {
                  newElement.formularKey = child.formularKey
                }
                break

              case 'TextInput':
              case 'NumberInput':
              case 'TextArea':
                // Text inputs need to copy formularKey if it exists
                if (child.formularKey !== undefined) {
                  newElement.formularKey = child.formularKey
                }
                break

              default:
                // For other elements with options, do a generic clone
                if (child.options) {
                  newElement.options = JSON.parse(JSON.stringify(child.options))

                  // Ensure options have unique keys
                  if (Array.isArray(newElement.options)) {
                    newElement.options = newElement.options.map((opt) => ({
                      ...opt,
                      key: `${timestamp}_${Math.random().toString(36).substring(2, 9)}`,
                    }))
                  }
                }
            }

            // Always copy formula properties to ensure they're available for all element types that need them
            const formulaProps = ['formula', 'formularKey']
            formulaProps.forEach((prop) => {
              if (child[prop] !== undefined) {
                newElement[prop] = child[prop]
              }
            })

            // Add to our tracking array
            rowsToUpdate.push({ rowIndex, newElement })
          }
        }

        // Apply all element clones at once
        rowsToUpdate.forEach(({ rowIndex, newElement }) => {
          item.childItems[rowIndex][col] = newElement.id
          updatedData.push(newElement)
        })
      }

      // Clean up any orphaned elements
      const list = updatedData.filter((x) => x && x.parentId === item.id)
      const flatChildItems = item.childItems.flat().filter(Boolean)
      const toRemove = list.filter((x) => !flatChildItems.includes(x.id))

      if (toRemove.length) {
        updatedData = updatedData.filter((x) => toRemove.indexOf(x) === -1)
      }

      // Update sequence number
      seq.current = seq.current > 100000 ? 0 : seq.current + 1

      // Update the state once with all changes
      setData(updatedData)

      // Dispatch the final update to the store
      store.dispatch('updateOrder', updatedData)
    },
    [data, getDataById, swapChildren, seq, setData]
  )

  // Remove a child from a column across all rows
  const removeChild = useCallback(
    (item, row = 0, col) => {
      // Create a working copy of the data
      let newData = [...data]
      // Track any elements that need to be removed
      const elementsToRemove = []

      // Loop through all rows in the grid
      for (let rowIndex = 0; rowIndex < item.childItems.length; rowIndex++) {
        // Get the element ID in this column for the current row
        const elementId = item.childItems[rowIndex][col]

        if (elementId) {
          // Find the element to be removed
          const elementToRemove = getDataById(elementId)
          if (elementToRemove) {
            // Add it to our list of elements to remove
            elementsToRemove.push(elementToRemove)
            // Set the reference to null in the childItems array
            item.childItems[rowIndex][col] = null
          }
        }
      }

      // Remove all collected elements from the data array
      if (elementsToRemove.length > 0) {
        newData = newData.filter((x) => !elementsToRemove.includes(x))

        // Update sequence number
        seq.current = seq.current > 100000 ? 0 : seq.current + 1

        // Update the state and store
        store.dispatch('updateOrder', newData)
        setData(newData)
      }
    },
    [data, getDataById, seq, setData]
  )

  return {
    getDataById,
    updateElement,
    destroyElement,
    swapChildren,
    setAsChild,
    removeChild,
  }
}
