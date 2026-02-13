/**
 * PlaceHolder - Drop target shown at the bottom of the preview area.
 * Acts as a catch-all zone so items can always be appended to the form.
 */
import React from 'react'

import PropTypes from 'prop-types'

import { useDrop } from 'react-dnd'

import ItemTypes from '../../../constants/itemTypes'

const PLACE_HOLDER = 'form-place-holder'

const PlaceHolder = ({ text = 'Dropzone', show = false, index, moveCard, insertCard }) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.CARD, ItemTypes.BOX],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return

      const hoverIndex = index

      // Restore child items dragged out of a multi-column cell
      if (item.data?.parentId && typeof insertCard === 'function') {
        insertCard(item, hoverIndex, item.id)
        return
      }

      // New toolbar items — create and insert
      if (item.isNew || typeof item.onCreate === 'function') {
        if (item.isProcessed) return
        if (typeof item.onCreate !== 'function') return

        const newItem = item.onCreate(item.data)
        if (newItem) {
          item.isProcessed = true
          insertCard(newItem, hoverIndex)
        }
        return
      }

      // Move an existing item to this position
      moveCard?.(item.index, hoverIndex, item.id)
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
}

export default PlaceHolder
