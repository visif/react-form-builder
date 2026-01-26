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
      // Include data and methods needed for dropping into multi-column cells
      data: props.data,
      // For already-dropped items, onCreate should just return the item itself
      onCreate: props.onCreate || ((item) => item),
      setAsChild: props.setAsChild,
      getDataById: props.getDataById,
    }
  },
}

// Drop target specification
const cardTarget = {
  drop(props, monitor, component) {
    if (!component) return

    // If the drop was already handled by a nested target (e.g., multi-column), don't process it again
    if (monitor.didDrop()) {
      return
    }

    const item = monitor.getItem()
    const dragIndex = item.index
    const hoverIndex = props.index
    const originalIndex =
      item.originalIndex !== undefined ? item.originalIndex : dragIndex

    if (item.itemType === ItemTypes.CARD) {
      return
    }

    // Handle dropping items that were in a multi-column (have setAsChild and parentId)
    if (item.data && item.data.parentId && typeof item.setAsChild === 'function') {
      // This item is being moved out of a multi-column container
      const parent = item.getDataById(item.data.parentId)
      if (parent && parent.childItems) {
        // Clear the child reference from the parent
        const { row } = item.data
        const { col } = item.data
        if (row !== undefined && col !== undefined && parent.childItems[row]) {
          parent.childItems[row][col] = null
        }
      }

      // Clean up the child-specific properties
      delete item.data.parentId
      delete item.data.parentIndex
      delete item.data.row
      delete item.data.col
      delete item.data.hideLabel

      // Insert the item into the main form at the drop position
      props.insertCard(item.data, hoverIndex)
      return
    }

    // Handle dropping items from toolbar (originalIndex === -1 means from toolbar)
    if (originalIndex === -1 && item.data && !item.isInserted) {
      let newItem
      if (item && typeof item.onCreate === 'function') {
        newItem = item.onCreate(item.data)
      } else if (item.data) {
        newItem = item.data
      } else {
        newItem = item
      }
      props.insertCard(newItem, hoverIndex)
      // Mark as inserted to prevent double insertion
      item.isInserted = true
    }
    if (item.data && typeof item.setAsChild === 'function' && originalIndex === -1) {
      props.insertCard(item, hoverIndex, item.id)
    }
  },
  hover(props, monitor, component) {
    if (!component) return
    const item = monitor.getItem()
    const dragIndex = item.index
    const hoverIndex = props.index

    // Only prevent hover for container elements (multi-column rows) themselves, not their children
    if (item.data && typeof item.setAsChild === 'function') {
      // Check if this is a child element being dragged out (has parentId) vs a container
      const isChildElement = item.data.parentId !== undefined
      const isContainerElement = MULTI_COLUMN_ELEMENTS.has(item.data.element)

      // Allow children to be dragged out, but prevent containers from being nested
      if (isContainerElement && !isChildElement) {
        return
      }
      // If it's a child element, allow the hover to continue for repositioning
    }

    if (dragIndex === hoverIndex) {
      return
    }
    // Only update visual position during hover for items from toolbar, don't insert yet
    if (dragIndex === -1) {
      // Store the original index so we know it came from toolbar
      item.originalIndex = -1
      item.index = hoverIndex
      return
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
