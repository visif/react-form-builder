import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import ItemTypes from './ItemTypes'

const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const MULTI_COLUMN_ELEMENTS = new Set([
  'TwoColumnRow',
  'ThreeColumnRow',
  'FourColumnRow',
  'DynamicColumnRow',
])

const shouldUseDragHandle = (props) => {
  const element = props?.data?.element || props?.data?.key
  if (MULTI_COLUMN_ELEMENTS.has(element)) return true
  return false
}

// Drag source specification
const cardSource = {
  beginDrag(props) {
    return {
      itemType: ItemTypes.CARD,
      id: props.id,
      index: props.index,
    }
  },
}

// Drop target specification
const cardTarget = {
  drop(props, monitor, component) {
    if (!component) return
    const item = monitor.getItem()
    const dragIndex = item.index
    const hoverIndex = props.index
    if (item.itemType === ItemTypes.CARD) {
      return
    }
    if (item.data && typeof item.setAsChild === 'function' && dragIndex === -1) {
      props.insertCard(item, hoverIndex, item.id)
    }
  },
  hover(props, monitor, component) {
    if (!component) return
    const item = monitor.getItem()
    const dragIndex = item.index
    const hoverIndex = props.index
    if (item.data && typeof item.setAsChild === 'function') {
      return
    }
    if (dragIndex === hoverIndex) {
      return
    }
    if (dragIndex === -1) {
      item.index = hoverIndex
      props.insertCard(item.onCreate(item.data), hoverIndex)
    }
    let node
    try {
      node = findDOMNode(component)
    } catch (err) {
      return
    }
    if (!node) return
    const hoverBoundingRect = node.getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }
    props.moveCard(dragIndex, hoverIndex)
    item.index = hoverIndex
  },
}

const withDragAndDrop = (ComposedComponent) => {
  class Card extends Component {
    static propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      connectDropTarget: PropTypes.func.isRequired,
      index: PropTypes.number.isRequired,
      isDragging: PropTypes.bool,
      id: PropTypes.any.isRequired,
      moveCard: PropTypes.func.isRequired,
      seq: PropTypes.number,
    }

    static defaultProps = {
      seq: -1,
    }

    render() {
      const { isDragging, connectDragSource, connectDropTarget } = this.props
      const opacity = isDragging ? 0 : 1
      const useDragHandle = this.props.useDragHandle || shouldUseDragHandle(this.props)
      const content = (
        <div>
          <ComposedComponent {...this.props} style={{ ...cardStyle, opacity }} />
        </div>
      )

      return useDragHandle
        ? connectDropTarget(content)
        : connectDragSource(connectDropTarget(content))
    }
  }

  const DroppableCard = DropTarget(
    [ItemTypes.CARD, ItemTypes.BOX],
    cardTarget,
    (connect) => ({
      connectDropTarget: connect.dropTarget(),
    })
  )(Card)

  return DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(DroppableCard)
}

export default withDragAndDrop
