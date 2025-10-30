import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import PropTypes from 'prop-types'
import ItemTypes from '../../../constants/itemTypes'

const cardStyle = {
  border: '1px dashed gray',
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
          if (data.isContainer || item.itemType === ItemTypes.CARD) {
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
            item.index = hoverIndex
            insertCard(onCreate(item.data), hoverIndex)
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

          moveCard(dragIndex, hoverIndex)
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
