import React, { useImperativeHandle } from 'react'
import { DropTarget } from 'react-dnd'
import FormElements from '../form-elements'
import CustomElement from '../form-elements/custom-element'
import ItemTypes from '../ItemTypes'
import Registry from '../stores/registry'

// Styles
const dustbinStyles = (backgroundColor) => ({
  border: '1px solid rgba(0,0,0,0.2)',
  minHeight: '2rem',
  width: '100%',
  backgroundColor,
  padding: 0,
  float: 'left',
})

// Helper Functions
const renderCustomElement = (item, props) => {
  if (!item.component || typeof item.component !== 'function') {
    item.component = Registry.get(item.key)
    if (!item.component) {
      console.error(`${item.element} was not registered`)
    }
  }
  return <CustomElement {...props} mutable={false} key={`form_${item.id}`} data={item} />
}

const renderElement = (item, props) => {
  if (!item) return null

  const Element = item.custom
    ? () => renderCustomElement(item, props)
    : FormElements[item.element || item.key]

  // Add an onChange handler for column synchronization
  const elementProps = { ...props }

  // Check if this is a syncable element type
  if (
    [
      'Checkboxes',
      'RadioButtons',
      'Dropdown',
      'DataSource',
      'Signature2',
      'FormLink',
    ].includes(item.element) &&
    props.syncColumnChanges &&
    props.editModeOn
  ) {
    // Create an onElementChange handler for component-specific synchronization
    elementProps.onElementChange = (changedData) => {
      // Synchronize changes across the column
      props.syncColumnChanges(props.row, props.col, item.element, changedData)
    }
  }

  return (
    <>
      <Element {...elementProps} key={`form_${item.id}`} data={item} />
    </>
  )
}

const isContainerItem = (item) => {
  if (item.itemType !== ItemTypes.CARD) {
    const { data } = item
    if (data) {
      return data.isContainer || (data.field_name && data.field_name.includes('_col_row'))
    }
  }
  return false
}

// Main Component
const Dustbin = React.forwardRef(
  (
    {
      greedy,
      isOver,
      isOverCurrent,
      connectDropTarget,
      items,
      col,
      row,
      getDataById,
      setAsChild,
      syncColumnChanges,
      updateElement,
      ...rest
    },
    ref,
  ) => {
    const item = getDataById(items[col])

    // Handle drop operations
    useImperativeHandle(
      ref,
      () => ({
        onDrop: (dropped) => {
          if (dropped.data && typeof setAsChild === 'function') {
            const isNew = !dropped.data.id
            const data = isNew ? dropped.onCreate(dropped.data) : dropped.data
            setAsChild(rest.data, data, row, col)
          }
        },
      }),
      [setAsChild, col, rest.data],
    )

    // Determine background color based on drag state
    const backgroundColor =
      isOverCurrent || (isOver && greedy) ? 'darkgreen' : 'rgba(0, 0, 0, .03)'

    const element = renderElement(item, {
      ...rest,
      row,
      col,
      syncColumnChanges,
      updateElement,
    })

    return connectDropTarget(<div style={dustbinStyles(backgroundColor)}>{element}</div>)
  },
)

// Drop Target Configuration
const dropTargetSpec = {
  drop(props, monitor, component) {
    if (!component) return

    const item = monitor.getItem()
    if (!isContainerItem(item)) {
      component.onDrop(item)
    }
  },
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
})

export default DropTarget((props) => props.accepts, dropTargetSpec, collect)(Dustbin)
