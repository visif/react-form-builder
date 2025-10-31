import React, { useImperativeHandle } from 'react'
import { useDrop } from 'react-dnd'
import FormElements from '../index.jsx'
import CustomElement from '../shared/CustomElement'
import ItemTypes from '../../../constants/itemTypes'
import Registry from '../../../contexts/registry'

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
      items,
      col,
      row,
      getDataById,
      setAsChild,
      syncColumnChanges,
      updateElement,
      accepts,
      ...rest
    },
    ref,
  ) => {
    const item = getDataById(items[col])

    const [{ isOver, isOverCurrent, canDrop }, drop] = useDrop(
      () => ({
        accept: accepts,
        drop: (droppedItem, monitor) => {
          if (!isContainerItem(droppedItem)) {
            if (droppedItem.data && typeof setAsChild === 'function') {
              const isNew = !droppedItem.data.id
              const data = isNew
                ? droppedItem.onCreate(droppedItem.data)
                : droppedItem.data
              setAsChild(rest.data, data, row, col)
            }
          }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          isOverCurrent: monitor.isOver({ shallow: true }),
          canDrop: monitor.canDrop(),
        }),
      }),
      [accepts, setAsChild, col, row, rest.data],
    )

    // Handle drop operations (legacy interface)
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
      [setAsChild, col, row, rest.data],
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

    return (
      <div ref={drop} style={dustbinStyles(backgroundColor)}>
        {element}
      </div>
    )
  },
)

export default Dustbin
