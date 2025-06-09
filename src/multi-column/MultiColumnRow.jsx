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
    index,
    updateElement,
  } = props

  const { childItems = [], pageBreakBefore } = data
  const baseClasses = `SortableItem rfb-item ${pageBreakBefore ? 'alwaysbreak' : ''}`

  // Check if row labels are defined in data
  const hasRowLabels = Array.isArray(data.rowLabels) && data.rowLabels.length > 0

  // Function to synchronize changes across a column
  const syncColumnChanges = (rowIndex, columnIndex, elementType, changeData) => {
    // Only sync for supported element types
    if (
      ![
        'Checkboxes',
        'RadioButtons',
        'Dropdown',
        'TextInput',
        'NumberInput',
        'TextArea',
        'DatePicker',
        'Signature',
        'Signature2',
        'FormulaInput',
        'DataSource',
        'FormLink',
      ].includes(elementType)
    ) {
      return
    }

    // Go through each row
    childItems.forEach((row, rIdx) => {
      // Skip the row that triggered the change
      if (rIdx === rowIndex) return

      const itemId = row[columnIndex]
      if (!itemId) return

      const itemData = getDataById(itemId)
      if (!itemData || itemData.element !== elementType) return

      // Create a new updated element to apply changes
      const updatedItem = {
        ...itemData,
      }

      // Apply changes based on element type and what was changed
      if (elementType === 'Checkboxes' || elementType === 'RadioButtons') {
        // For checkboxes/radio buttons
        if (changeData.options) {
          // Transfer option selection state but preserve option structure
          updatedItem.options = changeData.options.map((newOpt, idx) => {
            if (idx < itemData.options.length) {
              return {
                ...itemData.options[idx],
                text: newOpt.text, // Update text
                value: newOpt.value, // Update value
                checked: newOpt.checked, // Update checked state
                selected: newOpt.selected, // Update selected state
              }
            }
            return newOpt // For new options
          })
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey
        }
      } else if (elementType === 'Dropdown') {
        // For dropdowns
        if (changeData.options) {
          updatedItem.options = changeData.options.map((newOpt, idx) => {
            if (idx < itemData.options.length) {
              return {
                ...itemData.options[idx],
                text: newOpt.text,
                value: newOpt.value,
              }
            }
            return newOpt
          })
        }

        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey
        }
      } else if (elementType === 'DataSource') {
        // For DataSource components
        if (changeData.sourceType !== undefined) {
          updatedItem.sourceType = changeData.sourceType
        }

        if (changeData.formSource !== undefined) {
          updatedItem.formSource = changeData.formSource
        }

        // Handle any selected item data
        if (changeData.selectedItem !== undefined) {
          updatedItem.selectedItem = changeData.selectedItem
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Make sure the DataSource is properly initialized
        updatedItem.initialized = true
      } else if (elementType === 'Signature2') {
        // For Signature2 components
        if (changeData.position !== undefined) {
          updatedItem.position = changeData.position
        }
        if (changeData.specificRole !== undefined) {
          updatedItem.specificRole = changeData.specificRole
        }
        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync required property if it exists
        if (changeData.hasOwnProperty('required')) {
          updatedItem.required = changeData.required
        }

        // Sync readOnly property if it exists
        if (changeData.hasOwnProperty('readOnly')) {
          updatedItem.readOnly = changeData.readOnly
        }

        // Make sure the Signature2 is properly initialized
        updatedItem.initialized = true
      } else if (elementType === 'FormLink') {
        // For FormLink components
        if (changeData.formId !== undefined) {
          updatedItem.formId = changeData.formId
        }

        if (changeData.formName !== undefined) {
          updatedItem.formName = changeData.formName
        }

        if (changeData.linkText !== undefined) {
          updatedItem.linkText = changeData.linkText
        }

        if (changeData.openInNewWindow !== undefined) {
          updatedItem.openInNewWindow = changeData.openInNewWindow
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync any additional FormLink-specific properties
        if (changeData.buttonStyle !== undefined) {
          updatedItem.buttonStyle = changeData.buttonStyle
        }

        if (changeData.className !== undefined) {
          updatedItem.className = changeData.className
        }
      } else {
        // For other input types
        if (changeData.value !== undefined) {
          updatedItem.value = changeData.value
        }

        // Handle label changes
        if (changeData.label !== undefined && changeData.label !== itemData.label) {
          updatedItem.label = changeData.label
        }

        // Sync formularKey if it exists
        if (changeData.formularKey !== undefined) {
          updatedItem.formularKey = changeData.formularKey
        }
      }

      // If we created an updated item, apply the changes
      if (updatedItem && updateElement) {
        updateElement(updatedItem)
      }
    })
  }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div>
        <ComponentLabel {...props} />
        <table className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
          {data.columns && (
            <thead>
              <tr>
                {/* Add empty header cell for row labels column if row labels are present */}
                {hasRowLabels && (
                  <th
                    style={{
                      width: '150px',
                      fontWeight: 'bold',
                      backgroundColor: '#e9ecef', // Slightly darker background
                      borderBottom: '2px solid #dee2e6', // Thicker bottom border
                    }}
                  />
                )}
                {data.columns.map((column, columnIndex) => (
                  <th
                    key={`header_${columnIndex}`}
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backgroundColor: '#e9ecef', // Slightly darker background
                      borderBottom: '2px solid #dee2e6', // Thicker bottom border
                      padding: '10px 8px', // More padding
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
                    className="row-label"
                    style={{
                      fontWeight: 'bold', // This is already bold, but ensuring it's here
                      textAlign: 'right',
                      paddingRight: '10px',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    {data.rowLabels[rowIndex] ? data.rowLabels[rowIndex].text : ''}
                  </td>
                )}
                {row.map((item, columnIndex) => (
                  <td
                    key={`${rowIndex}_${columnIndex}_${item || '_'}`}
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
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
                        syncColumnChanges={syncColumnChanges}
                        updateElement={updateElement}
                      />
                    )}
                  </td>
                ))}
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

  // Initialize rowLabels array if it doesn't exist
  // if (!data.rowLabels) {
  //   data.rowLabels = Array(rows)
  //     .fill()
  //     .map((_, i) => ({
  //       text: `Row ${i + 1}`,
  //       value: `row_${i + 1}`,
  //       key: `row_${Math.random().toString(36).substring(2, 9)}`,
  //     }))
  //   debugger
  // } else if (data.rowLabels?.length > 0 && data.rowLabels.length !== rows) {
  //   const currentLength = data.rowLabels.length
  //   if (currentLength < rows) {
  //     // Add additional row labels if needed
  //     const additionalLabels = Array(rows - currentLength)
  //       .fill()
  //       .map((_, i) => ({
  //         text: `Row ${currentLength + i + 1}`,
  //         value: `row_${currentLength + i + 1}`,
  //         key: `row_${Math.random().toString(36).substring(2, 9)}`,
  //       }))
  //     data.rowLabels = [...data.rowLabels, ...additionalLabels]
  //   } else {
  //     // Remove excess row labels
  //     data.rowLabels = data.rowLabels.slice(0, rows)
  //   }
  // }

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
