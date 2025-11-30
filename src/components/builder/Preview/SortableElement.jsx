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

    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: ItemTypes.CARD,
        item: {
          itemType: ItemTypes.CARD,
          id,
          index,
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
          // Reset the isProcessed flag when drag ends to allow subsequent drags
          if (item) {
            delete item.isProcessed
            // Reset index for toolbar items to allow re-dragging
            if (item.index === -1 || item.onCreate) {
              item.index = -1
            }
          }
        },
      }),
      [id, index]
    )

    const [, drop] = useDrop(
      () => ({
        accept: [ItemTypes.CARD, ItemTypes.BOX],
        drop: (item, monitor) => {
          if (!ref.current) return
          const dragIndex = item.index
          const hoverIndex = index
          console.log('SortableElement: drop', { dragIndex, hoverIndex, item, data })

          if ((data && data.isContainer) || item.itemType === ItemTypes.CARD) {
            return
          }
          if (item.data && typeof item.setAsChild === 'function' && dragIndex === -1) {
            insertCard(item, hoverIndex, item.id)
          }
        },
        hover: (item, monitor) => {
          if (!ref.current) return
          const dragIndex = item.index
          const hoverIndex = index

          // console.log('SortableElement: hover', { dragIndex, hoverIndex, item })

          if (item.data && typeof item.setAsChild === 'function') {
            return
          }
          if (dragIndex === hoverIndex) {
            return
          }
          if (dragIndex === -1) {
            if (data && data.isContainer) {
              return
            }
            // Only create and insert if we haven't already processed this item
            if (item.isProcessed) {
              return
            }
            const createHandler = typeof item.onCreate === 'function' ? item.onCreate : onCreate
            if (typeof createHandler !== 'function') {
              console.warn('SortableElement: missing onCreate handler for new item drop', item)
              return
            }
            const newItem = createHandler(item.data)
            if (!newItem) {
              console.warn('SortableElement: onCreate handler returned no element', item)
              return
            }
            // Mark as processed BEFORE inserting to prevent race conditions
            item.isProcessed = true
            item.index = hoverIndex

            console.log('SortableElement: inserting new item', { newItem, hoverIndex })

            // Insert the new item
            if (typeof insertCard === 'function') {
              insertCard(newItem, hoverIndex)
            } else {
              console.warn('SortableElement: insertCard is not a function')
            }
            return // Exit early for new items
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

          // Pass the element ID along with indices for ID-based tracking
          moveCard(dragIndex, hoverIndex, item.id)
          item.index = hoverIndex
        },
      }),
      [index, moveCard, insertCard, data, onCreate]
    )

    // Combine drag and drop refs
    drag(drop(ref))

    const opacity = isDragging ? 0 : 1

    return (
      <div ref={ref}>
        <ComposedComponent {...props} style={{ ...cardStyle, opacity }} />
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
