/* eslint-disable camelcase */
import React from 'react'
import ComponentHeader from '../form-elements/component-header'
import ComponentLabel from '../form-elements/component-label'
import ItemTypes from '../ItemTypes'
import Dustbin from './dustbin'

const accepts = [ItemTypes.BOX, ItemTypes.CARD]

const MultiColumnRow = (props) => {
  const {
    controls,
    data = {}, // Default to an empty object if data is undefined
    editModeOn,
    getDataById,
    setAsChild,
    removeChild,
    seq,
    className,
    index,
  } = props

  const { childItems = [], pageBreakBefore } = data
  const baseClasses = `SortableItem rfb-item ${pageBreakBefore ? 'alwaysbreak' : ''}`

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div>
        <ComponentLabel {...props} />
        {data.columns && (
          <div className="row">
            {data.columns.map((column, columnIndex) => (
              <div key={`header_${columnIndex}`} className={className}>
                <strong>{column.text}</strong>
              </div>
            ))}
          </div>
        )}
        {childItems.map((row, rowIndex) => (
          <div key={`row_${rowIndex}`} className="row">
            {row.map((item, columnIndex) => (
              <div
                key={`${rowIndex}_${columnIndex}_${item || '_'}`}
                className={className}
              >
                {controls ? (
                  controls[rowIndex]?.[columnIndex]
                ) : (
                  <Dustbin
                    style={{ width: '100%' }}
                    data={data}
                    accepts={accepts}
                    items={childItems[rowIndex]}
                    row={rowIndex}
                    col={columnIndex}
                    parentIndex={index}
                    editModeOn={editModeOn}
                    _onDestroy={() => removeChild(data, rowIndex, columnIndex)}
                    getDataById={getDataById}
                    setAsChild={setAsChild}
                    seq={seq}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Creates a higher-order component (HOC) for rendering a multi-column row.
 *
 * @param {string} defaultClassName - The default CSS class name to apply to the row.
 * @param {number} numberOfColumns - The number of columns to initialize in the row.
 * @returns {Function} A React functional component that renders a `MultiColumnRow` with the specified properties.
 *
 * The returned component:
 * - Accepts `data`, `class_name`, and other props.
 * - Initializes `data.childItems` as an array of `numberOfColumns` elements if not already defined.
 * - Sets `data.isContainer` to `true` if `data.childItems` is initialized.
 * - Applies the provided `class_name` or falls back to `defaultClassName`.
 */
const createColumnRow = (defaultClassName, numberOfColumns, numberOfRows = 1) => {
  return ({ data = {}, class_name, ...rest }) => {
    const className = `${class_name || defaultClassName} mb-2`
    const rows = data.rows || numberOfRows

    if (!data.childItems) {
      data.childItems = Array(rows)
        .fill()
        .map(() => Array(numberOfColumns).fill(null))
      data.isContainer = true
    } else if (!Array.isArray(data.childItems[0])) {
      // Convert existing 1D array to 2D for backward compatibility
      data.childItems = [data.childItems]
    }

    return <MultiColumnRow {...rest} className={className} rows={rows} data={data} />
  }
}

/**
 * Creates a dynamic column row component that supports any number of rows and columns.
 * The number of rows and columns is determined by the data.rows and data.columns properties.
 *
 * @param {Object} props - Component props
 * @param {Object} props.data - Data object containing configuration
 * @param {number} props.data.rows - Number of rows (default: 1)
 * @param {number} props.data.columns - Number of columns (default: 2)
 * @param {string} props.class_name - Optional custom class name
 * @returns {JSX.Element} A MultiColumnRow component with dynamic rows and columns
 */
const DynamicColumnRow = ({ data = {}, class_name, ...rest }) => {
  const rows = Number(data.rows) || 1
  const columns = data.columns?.length || 2
  const defaultClassName = `col-md-${Math.floor(12 / columns)}`
  const className = `${class_name || defaultClassName} mb-2`

  if (!data.childItems) {
    data.childItems = Array(rows)
      .fill()
      .map(() => Array(columns).fill(null))
    data.isContainer = true
  } else if (!Array.isArray(data.childItems[0])) {
    // Convert existing 1D array to 2D for backward compatibility
    data.childItems = [data.childItems]
  }

  // Ensure childItems array matches the desired dimensions
  if (data.childItems.length !== rows || data.childItems[0].length !== columns) {
    const newChildItems = Array(rows)
      .fill()
      .map(() => Array(columns).fill(null))

    // Copy over existing items where possible
    data.childItems.forEach((row, rowIndex) => {
      if (rowIndex < rows) {
        row.forEach((item, colIndex) => {
          if (colIndex < columns) {
            newChildItems[rowIndex][colIndex] = item
          }
        })
      }
    })

    data.childItems = newChildItems
  }

  return <MultiColumnRow {...rest} className={className} rows={rows} data={data} />
}

const TwoColumnRow = createColumnRow('col-md-6', 2)
const ThreeColumnRow = createColumnRow('col-md-4', 3)
const FourColumnRow = createColumnRow('col-md-3', 4)

export { TwoColumnRow, ThreeColumnRow, FourColumnRow, DynamicColumnRow }
