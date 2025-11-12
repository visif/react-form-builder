/**
 * Preview - Refactored form builder preview and editing panel
 *
 * @component
 * @description Main preview component that displays the form being built. Handles drag-and-drop
 * reordering, element editing, undo/redo functionality, and form state management.
 *
 * Refactored using Single Responsibility Principle:
 * - useElementManagement: Element CRUD operations
 * - useDragAndDrop: Drag-drop operations
 * - useRowSync: Multi-column row synchronization
 * - previewElementRenderer: Element rendering utilities
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Initial form data
 * @param {string} [props.url] - URL to load form data
 * @param {string} [props.saveUrl] - URL to save form data
 * @param {Function} [props.onLoad] - Callback when form loads
 * @param {Function} [props.onPost] - Callback when form saves
 * @param {Function} [props.onChange] - Callback when form changes
 * @param {Function} [props.onSubmit] - Custom submit handler
 * @param {Function} [props.renderEditForm] - Custom edit form renderer
 * @param {boolean} [props.editMode] - Initial edit mode state
 * @param {Object} [props.editElement] - Element to edit initially
 *
 * @returns {React.ReactElement} The form preview with drag-drop and edit capabilities
 *
 * @since 1.0.0
 * @requires SortableFormElements for drag-drop functionality
 * @requires useUndoRedo hook for undo/redo state management
 */
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { UndoOutlined, RedoOutlined } from '@ant-design/icons'

import store from '../../../contexts/FormBuilderContext'
import useUndoRedo, { ACTION } from '../../../hooks/useUndoRedo'
import FormElementsEdit from '../ElementEditor/FormElementsEdit'
import SortableFormElements from './SortableFormElements'

// Import custom hooks
import { useElementManagement } from './hooks/useElementManagement'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { useRowSync } from './hooks/useRowSync'

// Import rendering utilities
import { getElement, showEditForm } from './utils/previewElementRenderer'

const { PlaceHolder } = SortableFormElements

const Preview = (props) => {
  const [data, setData] = useState([])
  const [answerData, setAnswerData] = useState({})
  const editForm = useRef(null)
  const seq = useRef(0)

  const { index: historyIndex, updateState } = useUndoRedo()

  // Custom hooks for business logic
  const {
    getDataById,
    updateElement,
    destroyElement,
    swapChildren,
    setAsChild,
    removeChild,
  } = useElementManagement(data, setData, seq)

  const { syncRowChanges } = useRowSync(getDataById, updateElement)

  const { insertCard, moveCard, saveData, restoreCard, cardPlaceHolder } = useDragAndDrop(
    data,
    setData,
    getDataById
  )

  useEffect(() => {
    const { onLoad, onPost, data, url, saveUrl } = props
    store.setExternalHandler(onLoad, onPost)
    setData(data || [])
    setAnswerData({})
    seq.current = 0

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

  const _onChange = (payload) => {
    const { data, action } = payload

    // Safety check: ensure data is an array
    if (!data || !Array.isArray(data)) {
      console.warn('Preview._onChange received invalid data:', data)
      return
    }

    // Safety check for props.variables
    if (props.variables) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item && item.readOnly && item.variableKey && props.variables[item.variableKey]) {
          data[i].defaultValue = props.variables[item.variableKey]
        }
      }
    }

    setData(data)

    // Store current state snapshot for undo/redo
    updateState(data, action)

    if (props.onChange) {
      props.onChange(data)
    }
  }

  const _onDestroy = (item) => {
    destroyElement(item)
  }

  const handleUndo = () => {
    store.dispatch('undo')
  }

  const handleRedo = () => {
    store.dispatch('redo')
  }

  // Render element using utility function
  const renderElement = (item, index) =>
    getElement(item, index, {
      seq: seq.current,
      moveCard,
      insertCard,
      getDataById,
      setAsChild,
      removeChild,
      onDestroy: _onDestroy,
      updateElement,
      syncRowChanges,
      props,
    })

  // Render edit form using utility function
  const renderEditFormContent = () =>
    showEditForm({
      updateElement,
      getDataById,
      syncRowChanges,
      data,
      props,
      manualEditModeOff,
    })

  let classes = props.className
  if (props.editMode) {
    classes += ' is-editing'
  }

  const items = data
    .filter((item) => !!item && !item.parentId)
    .map((item, index) => renderElement(item, index))

  return (
    <div className={classes} style={{ height: '100%', scrollbarWidth: 'none' }}>
      <div
        className="preview-toolbar"
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #d9d9d9',
        }}
      >
        <Button
          icon={<UndoOutlined />}
          onClick={handleUndo}
          disabled={historyIndex === 0}
          size="small"
        >
          Undo
        </Button>
        <Button
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={historyIndex === store.state.history.length - 1}
          size="small"
        >
          Redo
        </Button>
      </div>

      <div className="edit-form" ref={editForm}>
        {props.editElement && renderEditFormContent()}
      </div>

      <div
        className="Sortable"
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        {items.length === 0 ? (
          <PlaceHolder
            show={data.length === 0}
            text="Drop form elements here"
            style={{
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #d9d9d9',
              borderRadius: '4px',
              color: '#999',
            }}
          />
        ) : (
          items
        )}
      </div>
    </div>
  )
}

Preview.defaultProps = {
  data: [],
  url: '',
  saveUrl: '',
  onLoad: () => {},
  onPost: () => {},
  onChange: () => {},
  editMode: false,
  editElement: null,
  className: 'react-form-builder-preview',
  manualEditModeOff: () => {},
  renderEditForm: (props) => <FormElementsEdit {...props} />,
}

export default Preview
