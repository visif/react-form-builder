/**
 * useDragAndDrop Hook
 *
 * Handles drag-and-drop operations for form elements:
 * - Inserting elements at positions
 * - Moving elements between positions
 * - Restoring elements from child to root
 * - Saving reordered data
 */
import { useCallback } from 'react'
import update from 'immutability-helper'
import store from '../../../../contexts/FormBuilderContext'

export const useDragAndDrop = (data, setData, getDataById) => {
  // Restore a card from child position to root level
  const restoreCard = useCallback(
    (item, id) => {
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
        store.dispatch('updateOrder', newData)
        setData(newData)
      }
    },
    [data, getDataById, setData]
  )

  // Insert a card at a specific index
  const insertCard = useCallback(
    (item, hoverIndex, id) => {
      if (id) {
        restoreCard(item, id)
      } else {
        const newData = update(data, {
          $splice: [[hoverIndex, 0, item]],
        })
        saveData(item, hoverIndex, hoverIndex)
        setData(newData)
      }
    },
    [data, restoreCard, setData]
  )

  // Save reordered data to store
  const saveData = useCallback(
    (dragCard, dragIndex, hoverIndex) => {
      const newData = update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      })
      setData(newData)
      store.dispatch('updateOrder', newData)
    },
    [data, setData]
  )

  // Move a card from drag index to hover index
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = data[dragIndex]
      saveData(dragCard, dragIndex, hoverIndex)
    },
    [data, saveData]
  )

  // Placeholder function for drag operations
  const cardPlaceHolder = useCallback(() => {
    // Dummy function
  }, [])

  return {
    insertCard,
    moveCard,
    saveData,
    restoreCard,
    cardPlaceHolder,
  }
}
