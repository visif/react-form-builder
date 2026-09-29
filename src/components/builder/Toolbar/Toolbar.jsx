/**
 * Toolbar - Draggable form element toolbox
 *
 * @component
 * @description Displays a palette of draggable form elements that can be added to the form builder.
 * Supports both default form elements and custom toolbar items. Uses react-dnd for drag functionality.
 *
 * @example
 * // Basic usage with default items
 * import { Toolbar } from '@visif/form-builder';
 *
 * <Toolbar showDescription={true} />
 *
 * @example
 * // With custom toolbar items
 * const customItems = [
 *   {
 *     key: 'CustomElement',
 *     name: 'My Custom Element',
 *     icon: 'fa fa-custom',
 *     static: false,
 *     element: 'CustomElement',
 *     component: CustomComponent,
 *     type: 'custom'
 *   }
 * ];
 *
 * <Toolbar
 *   items={customItems}
 *   showDescription={true}
 * />
 *
 * @param {Object} props - Component props
 * @param {Array} [props.items] - Array of toolbar items to display (uses defaults if not provided)
 * @param {Array} [props.customItems] - Additional custom items to append to toolbar
 * @param {boolean} [props.showDescription=false] - Show descriptions for non-static elements
 *
 * @param {Object} props.items[] - Individual toolbar item configuration
 * @param {string} props.items[].key - Unique identifier for the item
 * @param {string} props.items[].element - Element type identifier
 * @param {string} props.items[].name - Display name in toolbar
 * @param {string} props.items[].icon - FontAwesome icon class (e.g., 'fa fa-header')
 * @param {boolean} [props.items[].static=false] - Whether element is static (non-input)
 * @param {boolean} [props.items[].canHaveAnswer=false] - Whether element can accept answers
 * @param {boolean} [props.items[].canHaveInfo=false] - Whether element can have info text
 * @param {boolean} [props.items[].canReadOnly=false] - Whether element supports read-only mode
 * @param {string} [props.items[].type] - 'custom' for custom elements
 * @param {React.Component} [props.items[].component] - Custom component for rendering
 *
 * @returns {React.ReactElement} The toolbar with draggable form elements
 *
 * @since 1.0.0 - Converted to functional component with hooks
 * @requires react-dnd v16+ for drag functionality
 */
import React from 'react'

import PropTypes from 'prop-types'

import { Typography } from 'antd'

import store from '../../../contexts/FormBuilderContext'
import ImportFormButton from '../Import/ImportFormButton'
import ToolbarItem from './ToolbarDraggableItem'
import {
  buildElementOptions,
  defaultItemColumns,
  defaultItemOptions,
  defaultItems as _defaultItems,
} from './toolbarItems'

const { Title } = Typography

function isDefaultItem(item) {
  const keys = Object.keys(item)
  return keys.filter((x) => x !== 'element' && x !== 'key').length === 0
}

function buildItems(items, defaultItems) {
  if (!items) {
    return defaultItems
  }
  return items.map((x) => {
    let found
    if (isDefaultItem(x)) {
      found = defaultItems.find((y) => (x.element || x.key) === (y.element || y.key))
    }
    return found || x
  })
}

const Toolbar = (props) => {
  const items = buildItems(props.items, _defaultItems())
  const [state, setState] = React.useState({ items })

  React.useEffect(() => {
    const unsubscribe = store.subscribe((storeState) => {
      setState((prevState) => ({ ...prevState, store: storeState }))
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const create = React.useCallback(
    (item) =>
      buildElementOptions(item, {
        showDescription: props.showDescription,
        existingData: state.store?.payload?.data || store.state?.payload?.data || [],
      }),
    [props.showDescription, state.store]
  )

  const _onClick = React.useCallback(
    (item) => {
      // ElementActions.createElement(create(item));
      store.dispatch('create', create(item))
    },
    [create]
  )

  return (
    <div
      className="react-form-builder-toolbar"
      style={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid #e8e8e8',
          paddingBottom: '12px',
          marginBottom: '12px',
          flexShrink: 0,
        }}
      >
        <Title
          level={4}
          style={{
            textAlign: 'center',
            marginBottom: '0',
            marginTop: '10px',
            fontWeight: 600,
            fontSize: '18px',
            color: '#262626',
          }}
        >
          Toolbox
        </Title>
        {props.importConfig !== false && (
          <div style={{ padding: '10px 8px 0' }}>
            <ImportFormButton config={props.importConfig} />
          </div>
        )}
      </div>
      <div
        style={{
          padding: '0 8px',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        }}
      >
        {state.items.map((item) => (
          <ToolbarItem
            data={item}
            key={item.key}
            onClick={() => _onClick(item)}
            onCreate={create}
          />
        ))}
      </div>
    </div>
  )
}

// Kept for backward compatibility with code that reached into the Toolbar statics.
Toolbar._defaultItemOptions = defaultItemOptions
Toolbar._defaultItemColumns = defaultItemColumns

Toolbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      element: PropTypes.string,
      key: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.string,
      static: PropTypes.bool,
      showDescription: PropTypes.bool,
    })
  ),
  customItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ),
  showDescription: PropTypes.bool,
  /** `false` hides the "Import from file" button; an object configures it. */
  importConfig: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}

export default Toolbar
