/**
 * SortableElement - Higher-order component that adds drag-and-drop behavior
 *
 * Wraps form elements to make them draggable and droppable within the preview.
 * Handles both reordering existing elements and inserting new ones from the toolbar.
 *
 * @module SortableElement
 */
import React, { useRef } from 'react'

import PropTypes from 'prop-types'

import { useDrag, useDrop } from 'react-dnd'

import ItemTypes from '../../../constants/itemTypes'

const cardStyle = {
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const withDragAndDrop = (ComposedComponent) => {
  const Card = (props) => {
    const { id, index, moveCard, insertCard, data, onCreate, seq = -1 } = props
    const ref = useRef(null)
    const dragHandleRef = useRef(null)

    const [{ isDragging }, drag, dragPreview] = useDrag(
      () => ({
        type: ItemTypes.CARD,
        item: {
          itemType: ItemTypes.CARD,
          id,
          index,
          data,
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
        end: (item) => {
          if (item) {
            delete item.isProcessed
            if (item.index === -1 || item.onCreate) {
              item.index = -1
            }
          }
        },
      }),
      [id, index, data]
    )

    const [, drop] = useDrop(
      () => ({
        accept: [ItemTypes.CARD, ItemTypes.BOX],
        drop: (item, monitor) => {
          if (!ref.current) return
          if (monitor.didDrop()) return

          const hoverIndex = index

          // Don't drop on itself (same element ID)
          if (item.id === id) {
            return
          }

          // For NEW toolbar items: always allow the drop
          if (item.isNew && item.data) {
            // Prevent double-processing
            if (item.isProcessed) return

            const createHandler = typeof item.onCreate === 'function' ? item.onCreate : onCreate
            if (typeof createHandler !== 'function') return

            const newItem = createHandler(item.data)
            if (!newItem) return

            item.isProcessed = true

            // Determine insertion position based on cursor location
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const insertIndex = hoverClientY < hoverMiddleY ? hoverIndex : hoverIndex + 1

            if (typeof insertCard === 'function') {
              insertCard(newItem, insertIndex)
            }
            return
          }

          const dragIndex = item.index

          if (dragIndex === hoverIndex) {
            return
          }

          // Prevent dropping INTO containers for existing items
          if (item.itemType === ItemTypes.CARD && dragIndex !== -1 && data && data.isContainer) {
            return
          }

          // Restore items dragged out of a multi-column cell
          if (item.data && item.data.parentId && typeof insertCard === 'function') {
            insertCard(item, hoverIndex, item.id)
            return
          }

          // Handle child insertion from toolbar (special case)
          if (item.data && typeof item.setAsChild === 'function') {
            insertCard(item, hoverIndex, item.id)
            return
          }
        },
        hover: (item, monitor) => {
          if (!ref.current) return
          const dragIndex = item.index
          const hoverIndex = index

          if (item.data && typeof item.setAsChild === 'function') {
            return
          }

          // For NEW toolbar items: just track hover position, no early returns
          if (item.isNew) {
            return
          }

          if (dragIndex === hoverIndex) {
            return
          }
          if (dragIndex === undefined || dragIndex === null) {
            return
          }

          const hoverBoundingRect = ref.current.getBoundingClientRect()
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          const clientOffset = monitor.getClientOffset()
          const hoverClientY = clientOffset.y - hoverBoundingRect.top

          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
          }
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
          }

          moveCard(dragIndex, hoverIndex, item.id)
          item.index = hoverIndex
        },
      }),
      [index, moveCard, insertCard, data, onCreate]
    )

    // Combine drag and drop refs
    if (data?.isContainer) {
      drop(ref)
      dragPreview(ref)
      if (dragHandleRef.current) {
        drag(dragHandleRef)
      } else {
        drag(ref)
      }
    } else {
      dragPreview(drop(ref))
      drag(ref)
    }

    const opacity = isDragging ? 0 : 1

    return (
      <div ref={ref}>
        <ComposedComponent
          {...props}
          dragHandleRef={dragHandleRef}
          style={{ ...cardStyle, opacity }}
        />
      </div>
    )
  }

  Card.propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.any.isRequired,
    moveCard: PropTypes.func.isRequired,
    insertCard: PropTypes.func,
    onCreate: PropTypes.func,
    data: PropTypes.object,
    seq: PropTypes.number,
  }

  Card.defaultProps = {
    seq: -1,
  }

  return Card
}

export default withDragAndDrop
