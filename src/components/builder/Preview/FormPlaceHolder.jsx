import React from 'react'

import PropTypes from 'prop-types'

import { useDrop } from 'react-dnd'
import ItemTypes from '../../../constants/itemTypes'

const PLACE_HOLDER = 'form-place-holder'

const PlaceHolder = ({ text = 'Dropzone', show = false, index, moveCard, insertCard, id }) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.BOX],
    drop: (item, monitor) => {
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === -1) {
        if (item.onCreate) {
          const newItem = item.onCreate(item.data)
          insertCard(newItem, hoverIndex)
        }
      } else {
        moveCard(dragIndex, hoverIndex)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={PLACE_HOLDER}
      style={{
        minHeight: show ? '100px' : '20px',
        opacity: show || isOver ? 1 : 0.3,
        backgroundColor: isOver ? '#e6f7ff' : 'transparent',
        border: isOver ? '1px dashed #1890ff' : 'none',
      }}
    >
      {show && <div>{text}</div>}
    </div>
  )
}

PlaceHolder.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
  index: PropTypes.number,
  moveCard: PropTypes.func,
  insertCard: PropTypes.func,
  id: PropTypes.string,
}

export default PlaceHolder
