/**
 * previewElementRenderer Utility
 *
 * Handles rendering of form elements in the preview panel:
 * - Creates SortableFormElement instances with all props
 * - Renders the edit form for selected elements
 */
import React from 'react'
import SortableFormElements from './SortableFormElements'

/**
 * Render a single form element with all necessary props
 */
export const getElement = (
  item,
  index,
  {
    seq,
    moveCard,
    insertCard,
    getDataById,
    setAsChild,
    removeChild,
    onDestroy,
    updateElement,
    syncRowChanges,
    props,
  }
) => {
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
      _onDestroy={onDestroy}
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
      getFormSource={props.getFormSource}
      getFormContent={props.getFormContent}
      onUploadFile={(file) => `${file.name}-${Math.random() * 10000000}`}
      onUploadImage={(file) => `path/${file.name}-${Math.random() * 10000000}`}
      onDownloadFile={(file) => `download_${file.name}-${Math.random() * 10000000}`}
    />
  )
}

/**
 * Render the edit form for the selected element
 */
export const showEditForm = (
  {
    updateElement,
    getDataById,
    syncRowChanges,
    data,
    props,
    manualEditModeOff,
  }
) => {
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
