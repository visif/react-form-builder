import React from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from '../ItemTypes'

const style = {
  cursor: 'move',
}

const Grip = (props) => {
  const { data, index, onDestroy, setAsChild, getDataById } = props

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: {
      itemType: ItemTypes.BOX,
      index: data.parentId ? -1 : index,
      parentIndex: data.parentIndex,
      id: data.id,
      col: data.col,
      onDestroy,
      setAsChild,
      getDataById,
      data,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [data, index, onDestroy, setAsChild, getDataById])

  return (
    <div
      ref={drag}
      className="btn is-isolated"
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <i className="is-isolated fas fa-grip-vertical"></i>
    </div>
  )
}

export default Grip
