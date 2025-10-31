/**
 * <ToolbarItem />
 */
import React from 'react'

import * as fa from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDrag } from 'react-dnd'

import ItemTypes from '../../../constants/itemTypes'
import ID from '../../../utils/uuid'

const ToolbarItem = ({ data, onClick, onCreate }) => {
  const [{ isDragging }, connectDragSource] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: () => ({
        id: ID.uuid(),
        index: -1,
        data,
        onCreate,
      }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [data, onCreate]
  )

  if (!connectDragSource) return null

  return connectDragSource(
    <li onClick={onClick} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <i className={data.icon}></i>
      {data.name}
    </li>
  )
}

export default ToolbarItem
