import React from 'react'

import { useDrag } from 'react-dnd'
import { HolderOutlined } from '@ant-design/icons'

import ItemTypes from '../../../constants/itemTypes'

const style = {
  cursor: 'move',
}

const Grip = (props) => {
  const { data, index, onDestroy, setAsChild, getDataById } = props

  const [{ isDragging }, drag] = useDrag(
    () => ({
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
    }),
    [data, index, onDestroy, setAsChild, getDataById]
  )

  return (
    <div
      ref={drag}
      className="btn is-isolated"
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
      }}
    >
      <HolderOutlined style={{ fontSize: '14px' }} />
    </div>
  )
}

export default Grip
