/* eslint-disable camelcase */
import React from 'react'

import ItemTypes from '../../../constants/itemTypes'
import useSyncColumnChanges from '../../../hooks/useSyncColumnChanges'
import ComponentHeader from '../shared/ComponentHeader'
import ComponentLabel from '../shared/ComponentLabel'
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
    index,
    updateElement,
  } = props

  const { childItems = [], pageBreakBefore } = data
  const baseClasses = `SortableItem rfb-item ${pageBreakBefore ? 'alwaysbreak' : ''}`

  // Check if row labels are defined in data
  const hasRowLabels = Array.isArray(data.rowLabels) && data.rowLabels.length > 0

  // Use the custom hook for synchronizing column changes
  const syncColumnChanges = useSyncColumnChanges(childItems, getDataById, updateElement)

  // Calculate column widths once for the entire component
  const columnWidths = data.columns
    ? (() => {
        const totalWidth = data.columns.reduce((sum, col) => {
          const width = Number(col.width) || 1
          return sum + width
        }, 0)
        const widths = data.columns.map((column) => {
          const width = Number(column.width) || 1
          return (width / totalWidth) * 100
        })

        return widths
      })()
    : []

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div>
        <ComponentLabel {...props} />
        <table
          className="table table-bordered"
          style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' }}
        >
          {data.columns && (
            <thead>
              <tr>
                {/* Add empty header cell for row labels column if row labels are present */}
                {hasRowLabels && (
                  <th
                    className="rfb-table-row-header-cell"
                    style={{
                      width: 'var(--rfb-table-row-header-width, 150px)',
                      fontWeight: 'var(--rfb-table-header-font-weight, bold)',
                      fontFamily: 'var(--rfb-table-header-font-family, inherit)',
                      backgroundColor: '#e9ecef',
                      borderBottom: '2px solid #dee2e6',
                    }}
                  />
                )}
                {data.columns.map((column, columnIndex) => (
                  <th
                    key={`header_${columnIndex}`}
                    className="rfb-table-column-header"
                    style={{
                      textAlign: 'center',
                      fontWeight: 'var(--rfb-table-header-font-weight, bold)',
                      fontFamily: 'var(--rfb-table-header-font-family, inherit)',
                      backgroundColor: '#e9ecef',
                      borderBottom: '2px solid #dee2e6',
                      padding: '10px 8px',
                      width: `${columnWidths[columnIndex]}%`,
                      maxWidth: `${columnWidths[columnIndex]}%`,
                      minWidth: `${columnWidths[columnIndex]}%`,
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    }}
                  >
                    {column.text}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {childItems.map((row, rowIndex) => (
              <tr key={`row_${rowIndex}`}>
                {/* Add row label cell if row labels are present */}
                {hasRowLabels && (
                  <td
                    className="row-label rfb-table-row-label"
                    style={{
                      textAlign: 'right',
                      paddingRight: '10px',
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'var(--rfb-table-row-font-weight, bold)',
                      fontFamily: 'var(--rfb-table-row-font-family, inherit)',
                    }}
                  >
                    {data.rowLabels[rowIndex] ? data.rowLabels[rowIndex].text : ''}
                  </td>
                )}
                {row.map((item, columnIndex) => {
                  // Get column width with proper fallback handling
                  let columnWidth = 100 / row.length // Default: equal distribution

                  if (
                    data.columns &&
                    columnWidths.length > 0 &&
                    columnIndex < columnWidths.length
                  ) {
                    const calculatedWidth = columnWidths[columnIndex]
                    if (!Number.isNaN(calculatedWidth) && calculatedWidth > 0) {
                      columnWidth = calculatedWidth
                    }
                  }

                  return (
                    <td
                      key={`${rowIndex}_${columnIndex}_${item || '_'}`}
                      style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        width: `${columnWidth}%`,
                        maxWidth: `${columnWidth}%`,
                        // minWidth: `${columnWidth}%`,
                        boxSizing: 'border-box',
                        // overflow: 'hidden',
                      }}
                    >
                      {controls ? (
                        controls[rowIndex]?.[columnIndex]
                      ) : (
                        <Dustbin
                          style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
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
                          syncColumnChanges={syncColumnChanges}
                          updateElement={updateElement}
                          {...props}
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
const createColumnRow =
  (defaultClassName, numberOfColumns, numberOfRows = 1) =>
  ({ data = {}, class_name, ...rest }) => {
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

/**
 * Creates a dynamic column row component that supports any number of rows and columns.
 * Uses the same pattern as createColumnRow for consistency.
 */
const createDynamicColumnRow =
  () =>
  ({ data = {}, class_name, ...rest }) => {
    const rows = Number(data.rows) || 1
    const columns = data.columns?.length || 2
    const defaultClassName = `col-md-${Math.floor(12 / columns)}`
    const className = `${class_name || defaultClassName} mb-2`

    // Initialize or update childItems to match current rows and columns
    if (!data.childItems) {
      data.childItems = Array(rows)
        .fill()
        .map(() => Array(columns).fill(null))
      data.isContainer = true
    } else if (data.childItems.length > 0 && !Array.isArray(data.childItems[0])) {
      // Convert existing 1D array to 2D for backward compatibility
      data.childItems = [data.childItems]
    } else {
      // Update existing childItems to match current structure
      const updatedChildItems = []

      // Ensure we have the right number of rows
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const existingRow = data.childItems[rowIndex] || []
        const newRow = []

        // Ensure each row has the right number of columns
        for (let colIndex = 0; colIndex < columns; colIndex++) {
          newRow[colIndex] = existingRow[colIndex] || null
        }

        updatedChildItems.push(newRow)
      }

      data.childItems = updatedChildItems
    }

    return <MultiColumnRow {...rest} className={className} rows={rows} data={data} />
  }

// Create the component using the same pattern
const DynamicColumnRow = createDynamicColumnRow()

const TwoColumnRow = createColumnRow('col-md-6', 2)
const ThreeColumnRow = createColumnRow('col-md-4', 3)
const FourColumnRow = createColumnRow('col-md-3', 4)

export { TwoColumnRow, ThreeColumnRow, FourColumnRow, DynamicColumnRow }
