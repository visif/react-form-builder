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

  const { index: historyIndex, history, updateState } = useUndoRedo()

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

  const _setValue = (text) => {
    return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
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
    let updatedData = [...data];
    
    // Handle the original drop first
    const oldParent = getDataById(child.parentId)
    const oldRow = child.row
    const oldCol = child.col
    
    // Update the child properties
    item.childItems[row][col] = child.id

    child.row = row
    child.col = col
    child.parentId = item.id
    child.parentIndex = data.indexOf(item)
    if (oldParent) {
      oldParent.childItems[oldRow][oldCol] = null
    }
    
    // If this element isn't in our data array yet (new element), add it
    if (!getDataById(child.id)) {
      updatedData.push(child);
    }

    // Auto-propagate to all rows in the same column if:
    // - There are multiple rows
    // - Auto-propagate is enabled (we'll always enable it for now)
    if (item.childItems.length > 1) {
      const rowsToUpdate = [];
      
      for (let rowIndex = 0; rowIndex < item.childItems.length; rowIndex++) {
        // Skip the current row as it already has the element
        if (rowIndex === row) continue;
        
        // Remove any existing element in this position
        const existingElementId = item.childItems[rowIndex][col];
        if (existingElementId) {
          const existingElement = getDataById(existingElementId);
          if (existingElement) {
            // Filter out the existing element
            updatedData = updatedData.filter(x => x !== existingElement);
          }
        }
        
        // Create a clone of the element for this row
        const elementClone = JSON.parse(JSON.stringify(child));
        
        // Ensure unique IDs for each clone
        elementClone.id = `${elementClone.element || 'item'}_${Date.now()}_${rowIndex}_${Math.floor(Math.random() * 10000)}`;
        elementClone.row = rowIndex;
        elementClone.col = col;
        elementClone.parentId = item.id;
        elementClone.parentIndex = updatedData.indexOf(item);
        elementClone.hideLabel = true; // Hide label for all cloned elements too
        
        // Add clone to our tracking array
        rowsToUpdate.push({rowIndex, clone: elementClone});
      }
      
      // Apply all element clones at once
      rowsToUpdate.forEach(({rowIndex, clone}) => {
        item.childItems[rowIndex][col] = clone.id;
        updatedData.push(clone);
      });
    }
    
    // Clean up any orphaned elements
    const list = updatedData.filter((x) => x && x.parentId === item.id);
    const flatChildItems = item.childItems.flat().filter(Boolean);
    const toRemove = list.filter((x) => !flatChildItems.includes(x.id));
    
    if (toRemove.length) {
      updatedData = updatedData.filter((x) => toRemove.indexOf(x) === -1);
    }
    
    // Update sequence number
    seq = seq > 100000 ? 0 : seq + 1;
    
    // Update the state once with all changes
    setData(updatedData);
    
    // Dispatch the final update to the store
    store.dispatch('updateOrder', updatedData);
  }

  const removeChild = (item, row = 0, col) => {
    // Create a working copy of the data
    let newData = [...data];
    // Track any elements that need to be removed
    const elementsToRemove = [];
    
    // Loop through all rows in the grid
    for (let rowIndex = 0; rowIndex < item.childItems.length; rowIndex++) {
      // Get the element ID in this column for the current row
      const elementId = item.childItems[rowIndex][col];
      
      if (elementId) {
        // Find the element to be removed
        const elementToRemove = getDataById(elementId);
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
      newData = newData.filter(x => !elementsToRemove.includes(x));
      
      // Update sequence number
      seq = seq > 100000 ? 0 : seq + 1;
      
      // Update the state and store
      store.dispatch('updateOrder', newData);
      setData(newData);
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
        mutable={false}
        parent={props.parent}
        editModeOn={props.editModeOn}
        isDraggable={true}
        sortData={item.id}
        data={item}
        getDataById={getDataById}
        setAsChild={setAsChild}
        removeChild={removeChild}
        _onDestroy={_onDestroy}
        getActiveUserProperties={props.getActiveUserProperties}
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
        onUploadFile={(file) => {
          return `${file.name}-${Math.random() * 10000000}`
        }}
        onUploadImage={(file) => {
          return `path/${file.name}-${Math.random() * 10000000}`
        }}
        onDownloadFile={(file) => {
          return `download_${file.name}-${Math.random() * 10000000}`
        }}
      />
    )
  }

  const showEditForm = () => {
    const handleUpdateElement = (element) => updateElement(element)
    const formElementEditProps = {
      showCorrectColumn: props.showCorrectColumn,
      files: props.files,
      manualEditModeOff: manualEditModeOff,
      preview: this,
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
          <i class="fas fa-history" style={{ marginRight: 8 }} />
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
