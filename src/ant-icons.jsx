import React from 'react'
import {
  AlignLeftOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  ColumnWidthOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownSquareOutlined,
  DragOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  FileOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  FormOutlined,
  HistoryOutlined,
  LineHeightOutlined,
  LinkOutlined,
  MinusCircleOutlined,
  PictureOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  ScissorOutlined,
  SignatureOutlined,
  SlidersOutlined,
  StarOutlined,
  TableOutlined,
  TagsOutlined,
  UploadOutlined,
} from '@ant-design/icons'

const iconMap = {
  'fa-arrows-alt-h': ColumnWidthOutlined,
  'fa-calculator': CalculatorOutlined,
  'fa-calendar-alt': CalendarOutlined,
  'fa-camera': CameraOutlined,
  'fa-caret-square-down': DownSquareOutlined,
  'fa-check-square': CheckSquareOutlined,
  'fa-columns': ColumnWidthOutlined,
  'fa-cut': ScissorOutlined,
  'fa-database': DatabaseOutlined,
  'fa-dot-circle': CheckCircleOutlined,
  'fa-edit': EditOutlined,
  'fa-exclamation-triangle': ExclamationCircleOutlined,
  'fa-external-link-square-alt': ExportOutlined,
  'fa-file': FileOutlined,
  'fa-font': FontColorsOutlined,
  'fa-grip-vertical': DragOutlined,
  'fa-heading': FontSizeOutlined,
  'fa-history': HistoryOutlined,
  'fa-image': PictureOutlined,
  'fa-link': LinkOutlined,
  'fa-minus-circle': MinusCircleOutlined,
  'fa-paragraph': AlignLeftOutlined,
  'fa-pen-square': FormOutlined,
  'fa-plus': PlusOutlined,
  'fa-plus-circle': PlusCircleOutlined,
  'fa-redo': RedoOutlined,
  'fa-signature': SignatureOutlined,
  'fa-sliders-h': SlidersOutlined,
  'fa-star': StarOutlined,
  'fa-table': TableOutlined,
  'fa-tags': TagsOutlined,
  'fa-text-height': LineHeightOutlined,
  'fa-times': CloseOutlined,
  'fa-trash': DeleteOutlined,
  'fa-upload': UploadOutlined,
}

export function getAntIcon(icon) {
  if (!icon || typeof icon !== 'string') return null
  const key = icon.split(/\s+/).find((className) => iconMap[className])
  return key ? iconMap[key] : null
}

export function renderAntIcon(icon, className) {
  const Icon = getAntIcon(icon)
  if (!Icon) {
    return <i className={icon} />
  }
  return (
    <Icon
      className={['vdc-ant-form-builder-icon', className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
