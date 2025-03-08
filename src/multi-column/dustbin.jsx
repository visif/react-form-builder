import React, { Fragment, useImperativeHandle } from 'react'
import { DropTarget } from 'react-dnd'
import FormElements from '../form-elements'
import CustomElement from '../form-elements/custom-element'
import ItemTypes from '../ItemTypes'
import Registry from '../stores/registry'

function getCustomElement(item, props) {
  if (!item.component || typeof item.component !== 'function') {
    item.component = Registry.get(item.key)
    if (!item.component) {
      console.error(`${item.element} was not registered`)
    }
  }
  return <CustomElement {...props} mutable={false} key={`form_${item.id}`} data={item} />
}

function getElement(item, props) {
  if (!item) return null
  const Element = item.custom
    ? () => getCustomElement(item, props)
    : FormElements[item.element || item.key]

  return (
    <Fragment>
      <Element {...props} key={`form_${item.id}`} data={item} />
    </Fragment>
  )
}

function getStyle(backgroundColor) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    minHeight: '2rem',
    minWidth: '12rem',
    width: '100%',
    backgroundColor,
    padding: 0,
    float: 'left',
  }
}

function isContainer(item) {
  if (item.itemType !== ItemTypes.CARD) {
    const { data } = item
    if (data) {
      return data.isContainer || (data.field_name && data.field_name.includes('_col_row'))
    }
  }
  return false
}

const Dustbin = React.forwardRef(
  (
    {
      greedy,
      isOver,
      isOverCurrent,
      connectDropTarget,
      items,
      col,
      getDataById,
      setAsChild,
      ...rest
    },
    ref
  ) => {
    const item = getDataById(items[col])
    useImperativeHandle(
      ref,
      () => ({
        onDrop: (dropped) => {
          if (dropped.data && typeof setAsChild === 'function') {
            const isNew = !dropped.data.id
            const data = isNew ? dropped.onCreate(dropped.data) : dropped.data
            setAsChild(rest.data, data, col)
          }
        },
      }),
      [setAsChild, col, rest.data]
    )

    let backgroundColor = 'rgba(0, 0, 0, .03)'
    if (isOverCurrent || (isOver && greedy)) {
      backgroundColor = 'darkgreen'
    }

    const element = getElement(item, rest)
    return connectDropTarget(<div style={getStyle(backgroundColor)}>{element}</div>)
  }
)

export default DropTarget(
  (props) => props.accepts,
  {
    drop(props, monitor, component) {
      if (!component) return

      const item = monitor.getItem()
      if (!isContainer(item)) {
        component.onDrop(item)
      }
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  })
)(Dustbin)
