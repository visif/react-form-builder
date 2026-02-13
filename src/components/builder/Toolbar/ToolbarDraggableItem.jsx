/**
 * <ToolbarItem />
 */
import React from 'react'

import * as AntIcons from '@ant-design/icons'
import { useDrag } from 'react-dnd'

import ItemTypes from '../../../constants/itemTypes'
import ID from '../../../utils/uuid'

// Map Font Awesome icon names to Ant Design icons
const iconMap = {
  'fas fa-heading': 'FontSizeOutlined',
  'fas fa-font': 'FontColorsOutlined',
  'fas fa-paragraph': 'AlignLeftOutlined',
  'fas fa-arrows-alt-h': 'MinusOutlined',
  'far fa-caret-square-down': 'DownSquareOutlined',
  'fas fa-tags': 'TagsOutlined',
  'far fa-check-square': 'CheckSquareOutlined',
  'far fa-dot-circle': 'CheckCircleOutlined',
  'fas fa-calculator': 'CalculatorOutlined',
  'fas fa-plus': 'NumberOutlined',
  'fas fa-text-height': 'AlignCenterOutlined',
  'fa fa-database': 'DatabaseOutlined',
  'fas fa-external-link-square-alt': 'LinkOutlined',
  'fas fa-table': 'TableOutlined',
  'fas fa-columns': 'ColumnWidthOutlined',
  'far fa-image': 'FileImageOutlined',
  'fas fa-image': 'FileImageOutlined',
  'fas fa-star': 'StarOutlined',
  'far fa-calendar-alt': 'CalendarOutlined',
  'fas fa-pen-square': 'EditOutlined',
  'fas fa-signature': 'FormOutlined',
  'fas fa-link': 'GlobalOutlined',
  'fas fa-file': 'FileOutlined',
  'fas fa-sliders-h': 'SlidersFilled',
  'fas fa-camera': 'CameraOutlined',
  'fas fa-cut': 'ScissorOutlined',
  'fas fa-upload': 'UploadOutlined',
}

const ToolbarItem = ({ data, onClick, onCreate }) => {
  const [{ isDragging }, connectDragSource] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: () => ({
        id: ID.uuid(),
        index: -1,
        data,
        onCreate,
        isNew: true,
      }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [data, onCreate]
  )

  if (!connectDragSource) return null

  // Get the Ant Design icon component
  const iconName = iconMap[data.icon] || 'AppstoreOutlined'
  const IconComponent = AntIcons[iconName]

  return connectDragSource(
    <div
      onClick={onClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'pointer',
        padding: '10px 12px',
        marginBottom: '5px',
        border: '1px dashed #ddd',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5'
        e.currentTarget.style.borderColor = '#d9d9d9'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
        e.currentTarget.style.borderColor = '#ddd'
      }}
    >
      {IconComponent && <IconComponent style={{ fontSize: '16px', color: '#666' }} />}
      <span style={{ fontSize: '14px' }}>{data.name}</span>
    </div>
  )
}

export default ToolbarItem
