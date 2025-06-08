import React, { useEffect, useRef, useState } from 'react'
import update from 'immutability-helper'
import FormElementsEdit from './form-elements-edit'
import useUndoRedo, { ACTION } from './functions/useUndoRedo'
import SortableFormElements from './sortable-form-elements'
import store from './stores/store'

const { PlaceHolder } = SortableFormElements

const Preview = (props) => {
  const [data, setData] = useState([])
  const [answerData, setAnswerData] = useState({})
  const editForm = useRef(null)

  const { index: historyIndex, updateState } = useUndoRedo()

  let seq = 0

  useEffect(() => {
    const { onLoad, onPost, data, url, saveUrl } = props
    store.setExternalHandler(onLoad, onPost)
    setData(data || [])
    setAnswerData({})
    seq = 0

    store.subscribe((state) => {
      _onChange(state.payload)
    })

    store.dispatch('load', { loadUrl: url, saveUrl, data: data || [] })

    const editModeOff = (e) => {
      if (editForm.current && !editForm.current.contains(e.target)) {
        manualEditModeOff()
      }
    }

    document.addEventListener('mousedown', editModeOff)

    return () => {
      document.removeEventListener('mousedown', editModeOff)
    }
  }, [])

  const manualEditModeOff = () => {
    const { editElement } = props
    if (editElement && editElement.dirty) {
      editElement.dirty = false
      updateElement(editElement)
    }
    props.manualEditModeOff()
  }

  const updateElement = (element) => {
    let found = false
    for (let i = 0, len = data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element
        found = true
        break
      }
    }
    if (found) {
      seq = seq > 100000 ? 0 : seq + 1
      store.dispatch('updateOrder', data)
    }
  }

  const _onChange = (payload) => {
    const { data, action } = payload
    const answerData = {}
    data.forEach((item) => {
      if (item && item.readOnly && props.variables[item.variableKey]) {
        answerData[item.field_name] = props.variables[item.variableKey]
      }
    })
    setData(data)
    setAnswerData(answerData)
    if (typeof props.onChange === 'function') {
      props.onChange(data)
    }

    if (action !== ACTION.UNDO && action !== ACTION.REDO) {
      console.log('history index before: ', historyIndex)
      updateState(data, historyIndex)
    }
  }

  const _onDestroy = (item) => {
    if (item.childItems) {
      item.childItems.forEach((x) => {
        const child = getDataById(x)
        if (child) {
          store.dispatch('delete', child)
        }
      })
    }
    store.dispatch('delete', item)
  }

  const getDataById = (id) => {
    const item = data.find((x) => x && x.id === id)
    return item
  }

  const swapChildren = (item, child, row, col) => {
    if (
      child.row !== undefined &&
      child.col !== undefined &&
      item.id !== child.parentId
    ) {
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
  }

  const setAsChild = (item, child, row, col) => {
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

    if (item.childItems.length > 1) {
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
    seq = seq > 100000 ? 0 : seq + 1

    // Update the state once with all changes
    setData(updatedData)

    // Dispatch the final update to the store
    store.dispatch('updateOrder', updatedData)
  }

  const removeChild = (item, row = 0, col) => {
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
      seq = seq > 100000 ? 0 : seq + 1

      // Update the state and store
      store.dispatch('updateOrder', newData)
      setData(newData)
    }
  }

  const restoreCard = (item, id) => {
    const parent = getDataById(item.data.parentId)
    const oldItem = getDataById(id)
    if (parent && oldItem) {
      const newIndex = data.indexOf(oldItem)
      const newData = [...data]
      parent.childItems[oldItem.col] = null
      delete oldItem.parentId
      delete item.setAsChild
      delete item.parentIndex
      item.index = newIndex
      seq = seq > 100000 ? 0 : seq + 1
      store.dispatch('updateOrder', newData)
      setData(newData)
    }
  }

  const insertCard = (item, hoverIndex, id) => {
    if (id) {
      restoreCard(item, id)
    } else {
      const newData = update(data, {
        $splice: [[hoverIndex, 0, item]],
      })
      saveData(item, hoverIndex, hoverIndex)
      setData(newData)
    }
  }

  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = data[dragIndex]
    saveData(dragCard, dragIndex, hoverIndex)
  }

  const cardPlaceHolder = (dragIndex, hoverIndex) => {
    // Dummy
  }

  const saveData = (dragCard, dragIndex, hoverIndex) => {
    const newData = update(data, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    })
    setData(newData)
    store.dispatch('updateOrder', newData)
  }

  const getElement = (item, index) => {
    if (item.custom) {
      if (!item.component || typeof item.component !== 'function') {
        item.component = props.registry.get(item.key)
      }
    }
    const SortableFormElement = SortableFormElements[item.element]
    if (SortableFormElement === null) {
      return null
    }
    return (
      <SortableFormElement
        id={item.id}
        key={item.id}
        seq={seq}
        index={index}
        moveCard={moveCard}
        insertCard={insertCard}
        mutable // Set to true to make inputs interactive
        preview // Add preview prop to identify preview mode
        parent={props.parent}
        editModeOn={props.editModeOn}
        isDraggable
        sortData={item.id}
        data={item}
        getDataById={getDataById}
        setAsChild={setAsChild}
        removeChild={removeChild}
        _onDestroy={_onDestroy}
        getActiveUserProperties={props.getActiveUserProperties}
        onElementChange={syncRowChanges} // Add callback for syncing changes in preview
        updateElement={updateElement} // Pass updateElement for state changes
        getDataSource={(data) => {
          if (data.sourceType === 'name') {
            return [
              { id: 1, name: 'NameA lastNameA' },
              { id: 2, name: 'NameB lastNameB' },
            ]
          }
          if (data.sourceType === 'department') {
            return [
              { id: 1, name: 'departmentA' },
              { id: 2, name: 'departmentB' },
            ]
          }
          if (data.sourceType === 'role') {
            return [
              { id: 1, name: 'roleA' },
              { id: 2, name: 'roleB' },
            ]
          }
          if (data.sourceType === 'form') {
            return [
              { id: 1, name: 'formA' },
              { id: 2, name: 'formB' },
            ]
          }
          return []
        }}
        onUploadFile={(file) => `${file.name}-${Math.random() * 10000000}`}
        onUploadImage={(file) => `path/${file.name}-${Math.random() * 10000000}`}
        onDownloadFile={(file) => `download_${file.name}-${Math.random() * 10000000}`}
      />
    )
  }

  const showEditForm = () => {
    const handleUpdateElement = (element) => {
      updateElement(element)

      // Directly call syncRowChanges here if the element is part of a multi-column row
      if (element.parentId && element.row !== undefined && element.col !== undefined) {
        syncRowChanges(element)
      }
    }

    // Create a preview object with all required methods directly accessible
    const previewObject = {
      syncRowChanges,
      updateElement: handleUpdateElement,
      getDataById,
      state: { data },
      // Add direct method references to ensure they're available in the edit form
      getDataById,
      updateElement: handleUpdateElement,
    }

    const formElementEditProps = {
      showCorrectColumn: props.showCorrectColumn,
      files: props.files,
      manualEditModeOff,
      // Pass the enhanced preview object
      preview: previewObject,
      element: props.editElement,
      updateElement: handleUpdateElement,
      getFormSource: props.getFormSource,
      getFormContent: props.getFormContent,
      onImageUpload: props.onImageUpload,
    }
    return props.renderEditForm(formElementEditProps)
  }

  let classes = props.className
  if (props.editMode) {
    classes += ' is-editing'
  }

  const items = data
    .filter((item) => !!item && !item.parentId)
    .map((item, index) => getElement(item, index))

  // Function to synchronize changes across all elements in a column
  const syncRowChanges = (changedElement) => {
    // Verify that this is an element in a multi-column row
    if (
      !changedElement.parentId ||
      changedElement.row === undefined ||
      changedElement.col === undefined
    ) {
      return
    }

    // Get the parent element (the row)
    const parentElement = getDataById(changedElement.parentId)
    if (!parentElement || !parentElement.childItems) {
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
      (changedElement.element === 'RadioButtons' ||
        changedElement.element === 'Checkboxes') &&
      changedElement.options &&
      changedElement.options.some((opt) => opt.checked)

    // If this is just a selection change in a form element, don't sync it to other rows
    if (isSelectionChange) {
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
      ]

      commonProps.forEach((prop) => {
        if (
          changedElement[prop] !== undefined &&
          changedElement[prop] !== itemData[prop]
        ) {
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
          ;['canHaveOptionCorrect', 'canHaveOptionValue', 'canHaveInfo'].forEach(
            (prop) => {
              if (
                changedElement[prop] !== undefined &&
                changedElement[prop] !== itemData[prop]
              ) {
                updatedItem[prop] = changedElement[prop]
                changed = true
              }
            }
          )
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
            if (
              changedElement[prop] !== undefined &&
              changedElement[prop] !== itemData[prop]
            ) {
              updatedItem[prop] = changedElement[prop]
              changed = true
            }
          })
          break

        case 'Range':
          // Sync range-specific properties
          ;[
            'min_value',
            'max_value',
            'step',
            'default_value',
            'min_label',
            'max_label',
          ].forEach((prop) => {
            if (
              changedElement[prop] !== undefined &&
              changedElement[prop] !== itemData[prop]
            ) {
              updatedItem[prop] = changedElement[prop]
              changed = true
            }
          })
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
            if (
              changedElement[prop] !== undefined &&
              changedElement[prop] !== itemData[prop]
            ) {
              updatedItem[prop] = changedElement[prop]
              changed = true
            }
          })
          break

        case 'Paragraph':
        case 'Header':
          // Sync text styling properties
          ;['bold', 'italic', 'content'].forEach((prop) => {
            if (
              changedElement[prop] !== undefined &&
              changedElement[prop] !== itemData[prop]
            ) {
              updatedItem[prop] = changedElement[prop]
              changed = true
            }
          })
          break

        case 'FormulaInput':
          // Sync formula properties
          ;['formula', 'formularKey'].forEach((prop) => {
            if (
              changedElement[prop] !== undefined &&
              changedElement[prop] !== itemData[prop]
            ) {
              updatedItem[prop] = changedElement[prop]
              changed = true
            }
          })
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
  }

  return (
    <div className={classes} style={{ height: '100%', scrollbarWidth: 'none' }}>
      <div className="preview-toolbar">
        <span
          style={{
            border: '1px solid #ddd',
            padding: 8,
            marginRight: '4px',
            backgroundColor: '#ffffff',
          }}
          onClick={() => {
            const event = new KeyboardEvent('keydown', {
              key: 'z',
              ctrlKey: true,
            })
            document.dispatchEvent(event)
          }}
        >
          <i className="fas fa-history" style={{ marginRight: 8 }} />
          Undo
        </span>
        <span
          style={{
            border: '1px solid #ddd',
            padding: 8,
            backgroundColor: '#ffffff',
          }}
          onClick={() => {
            const event = new KeyboardEvent('keydown', {
              key: 'y',
              ctrlKey: true,
            })
            document.dispatchEvent(event)
          }}
        >
          <i className="fas fa-redo" style={{ marginRight: 8 }} />
          Redo
        </span>
      </div>
      <div className="edit-form" ref={editForm}>
        {props.editElement !== null && showEditForm()}
      </div>
      <div className="Sortable">{items}</div>
      <PlaceHolder
        id="form-place-holder"
        show={items.length === 0}
        index={items.length}
        moveCard={cardPlaceHolder}
        insertCard={insertCard}
      />
    </div>
  )
}

Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: 'react-form-builder-preview',
  renderEditForm: (props) => <FormElementsEdit {...props} />,
}

export default Preview
